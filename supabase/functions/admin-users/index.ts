import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const ALLOWED_ORIGINS = [
  "https://goldies.vercel.app",
  "http://localhost:5173",
  "http://localhost:8080",
  "http://127.0.0.1:5173",
  "http://127.0.0.1:8080",
];

function getCorsHeaders(req: Request) {
  const origin = req.headers.get("origin") || "";
  const isAllowed = ALLOWED_ORIGINS.includes(origin) || !origin;
  return {
    "Access-Control-Allow-Origin": isAllowed ? origin : "https://goldies.vercel.app",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Methods": "GET, POST, DELETE, OPTIONS",
  };
}

const EMAIL_DOMAIN = "goldies.local";

const admin = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  { auth: { persistSession: false } }
);

function json(body: unknown, status = 200, corsHeaders = {}) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

async function getCallerUser(req: Request) {
  const authHeader = req.headers.get("Authorization");
  if (!authHeader) return null;
  const token = authHeader.replace("Bearer ", "");
  const { data: userData } = await admin.auth.getUser(token);
  return userData?.user ?? null;
}

async function getCallerIsAdmin(req: Request): Promise<boolean> {
  const user = await getCallerUser(req);
  if (!user) return false;
  const { data: roles } = await admin
    .from("user_roles")
    .select("role")
    .eq("user_id", user.id)
    .eq("role", "admin")
    .maybeSingle();
  return !!roles;
}

async function noAdminExists(): Promise<boolean> {
  const { count } = await admin
    .from("user_roles")
    .select("*", { count: "exact", head: true })
    .eq("role", "admin");
  return (count ?? 0) === 0;
}

function getSafeSiteUrl(req: Request): string {
  const configured = Deno.env.get("SITE_URL");
  if (configured && (configured.startsWith("https://") || configured.startsWith("http://"))) {
    return configured.replace(/\/$/, "");
  }
  const origin = req.headers.get("origin");
  if (origin && ALLOWED_ORIGINS.includes(origin)) {
    return origin.replace(/\/$/, "");
  }
  return "https://goldies.vercel.app";
}

Deno.serve(async (req) => {
  const corsHeaders = getCorsHeaders(req);
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const url = new URL(req.url);
    const action = url.searchParams.get("action") ?? "list";

    if (req.method === "GET" && action === "status") {
      return json({ needs_bootstrap: await noAdminExists() }, 200, corsHeaders);
    }

    // Bootstrap: allow first admin creation if none exists
    if (req.method === "POST" && action === "create") {
      const body = await req.json();
      const username = String(body.username ?? "").trim().toLowerCase();
      const password = String(body.password ?? "");
      if (!/^[a-z0-9]+\.[a-z0-9]+$/.test(username)) {
        return json({ error: "Format invalide. Utilisez nom.prenom" }, 400, corsHeaders);
      }
      if (password.length < 10) {
        return json({ error: "Mot de passe trop court (min 10 caractères)" }, 400, corsHeaders);
      }

      const bootstrap = await noAdminExists();
      if (!bootstrap) {
        const isAdmin = await getCallerIsAdmin(req);
        if (!isAdmin) return json({ error: "Non autorisé" }, 403, corsHeaders);
      }

      const email = `${username}@${EMAIL_DOMAIN}`;
      const { data: created, error: createErr } = await admin.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: { username },
      });
      if (createErr || !created.user) {
        return json({ error: createErr?.message ?? "Création échouée" }, 400, corsHeaders);
      }
      const { error: roleErr } = await admin
        .from("user_roles")
        .insert({ user_id: created.user.id, role: "admin" });
      if (roleErr) {
        await admin.auth.admin.deleteUser(created.user.id);
        return json({ error: roleErr.message }, 400, corsHeaders);
      }
      return json({ ok: true, username }, 200, corsHeaders);
    }

    // Authenticated admin actions below
    const callerUser = await getCallerUser(req);
    const isAdmin = await getCallerIsAdmin(req);
    if (!callerUser || !isAdmin) return json({ error: "Non autorisé" }, 403, corsHeaders);

    if (req.method === "POST" && action === "invite") {
      const body = await req.json();
      const email = String(body.email ?? "").trim().toLowerCase();
      if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return json({ error: "Email valide requis" }, 400, corsHeaders);
      }

      const siteUrl = getSafeSiteUrl(req);
      const { data: invited, error: inviteErr } = await admin.auth.admin.inviteUserByEmail(email, {
        redirectTo: `${siteUrl}/set-password`,
      });
      if (inviteErr || !invited.user) {
        return json({ error: inviteErr?.message ?? "Invitation échouée" }, 400, corsHeaders);
      }

      const { error: roleErr } = await admin
        .from("user_roles")
        .insert({ user_id: invited.user.id, role: "admin" });
      if (roleErr) return json({ error: roleErr.message }, 400, corsHeaders);

      return json({ success: true, message: `Invitation envoyée à ${email}` }, 200, corsHeaders);
    }

    if (req.method === "GET" && action === "list") {
      const { data: roles } = await admin
        .from("user_roles")
        .select("user_id, created_at")
        .eq("role", "admin");
      const users = await Promise.all(
        (roles ?? []).map(async (r) => {
          const { data } = await admin.auth.admin.getUserById(r.user_id);
          const email = data.user?.email ?? "";
          return {
            user_id: r.user_id,
            username: email.replace(`@${EMAIL_DOMAIN}`, ""),
            created_at: r.created_at,
            invited_at: data.user?.invited_at ?? null,
            confirmed_at: data.user?.confirmed_at ?? null,
          };
        })
      );
      return json({ users }, 200, corsHeaders);
    }

    if (req.method === "DELETE" && action === "delete") {
      const body = await req.json();
      const userId = String(body.user_id ?? "");
      if (!userId) return json({ error: "user_id requis" }, 400, corsHeaders);

      // Prevent self-deletion if caller is the targeted user
      if (callerUser.id === userId) {
        return json({ error: "Impossible de supprimer votre propre compte admin" }, 400, corsHeaders);
      }

      // Ensure at least one admin remains
      const { count } = await admin
        .from("user_roles")
        .select("*", { count: "exact", head: true })
        .eq("role", "admin");
      if ((count ?? 0) <= 1) {
        return json({ error: "Impossible de supprimer le dernier administrateur" }, 400, corsHeaders);
      }

      const { error } = await admin.auth.admin.deleteUser(userId);
      if (error) return json({ error: error.message }, 400, corsHeaders);
      return json({ ok: true }, 200, corsHeaders);
    }

    return json({ error: "Action inconnue" }, 400, corsHeaders);
  } catch (e) {
    return json({ error: (e as Error).message }, 500, corsHeaders);
  }
});
