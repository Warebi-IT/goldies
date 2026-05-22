import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "GET, POST, DELETE, OPTIONS",
};

const EMAIL_DOMAIN = "goldies.local";

const admin = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  { auth: { persistSession: false } }
);

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

async function getCallerIsAdmin(req: Request): Promise<boolean> {
  const authHeader = req.headers.get("Authorization");
  if (!authHeader) return false;
  const token = authHeader.replace("Bearer ", "");
  const { data: userData } = await admin.auth.getUser(token);
  if (!userData.user) return false;
  const { data: roles } = await admin
    .from("user_roles")
    .select("role")
    .eq("user_id", userData.user.id)
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

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const url = new URL(req.url);
    const action = url.searchParams.get("action") ?? "list";

    if (req.method === "GET" && action === "status") {
      return json({ needs_bootstrap: await noAdminExists() });
    }

    // Bootstrap: allow first admin creation if none exists
    if (req.method === "POST" && action === "create") {
      const body = await req.json();
      const username = String(body.username ?? "").trim().toLowerCase();
      const password = String(body.password ?? "");
      if (!/^[a-z0-9]+\.[a-z0-9]+$/.test(username)) {
        return json({ error: "Format invalide. Utilisez nom.prenom" }, 400);
      }
      if (password.length < 6) {
        return json({ error: "Mot de passe trop court (min 6)" }, 400);
      }

      const bootstrap = await noAdminExists();
      if (!bootstrap) {
        const isAdmin = await getCallerIsAdmin(req);
        if (!isAdmin) return json({ error: "Non autorisé" }, 403);
      }

      const email = `${username}@${EMAIL_DOMAIN}`;
      const { data: created, error: createErr } = await admin.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: { username },
      });
      if (createErr || !created.user) {
        return json({ error: createErr?.message ?? "Création échouée" }, 400);
      }
      const { error: roleErr } = await admin
        .from("user_roles")
        .insert({ user_id: created.user.id, role: "admin" });
      if (roleErr) {
        await admin.auth.admin.deleteUser(created.user.id);
        return json({ error: roleErr.message }, 400);
      }
      return json({ ok: true, username });
    }

    // Authenticated admin actions below
    const isAdmin = await getCallerIsAdmin(req);
    if (!isAdmin) return json({ error: "Non autorisé" }, 403);

    if (req.method === "POST" && action === "invite") {
      const body = await req.json();
      const email = String(body.email ?? "").trim().toLowerCase();
      if (!email) return json({ error: "email requis" }, 400);

      const origin = req.headers.get("origin") ?? "";
      const { data: invited, error: inviteErr } = await admin.auth.admin.inviteUserByEmail(email, {
        redirectTo: `${origin}/set-password`,
      });
      if (inviteErr || !invited.user) {
        return json({ error: inviteErr?.message ?? "Invitation échouée" }, 400);
      }

      const { error: roleErr } = await admin
        .from("user_roles")
        .insert({ user_id: invited.user.id, role: "admin" });
      if (roleErr) return json({ error: roleErr.message }, 400);

      return json({ success: true, message: `Invitation envoyée à ${email}` });
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
      return json({ users });
    }

    if (req.method === "DELETE" && action === "delete") {
      const body = await req.json();
      const userId = String(body.user_id ?? "");
      if (!userId) return json({ error: "user_id requis" }, 400);
      const { error } = await admin.auth.admin.deleteUser(userId);
      if (error) return json({ error: error.message }, 400);
      return json({ ok: true });
    }

    return json({ error: "Action inconnue" }, 400);
  } catch (e) {
    return json({ error: (e as Error).message }, 500);
  }
});
