/**
 * Centralized Error Translation & User-Friendly Guidance for Goldies Travel.
 * Transforms raw Supabase, PostgREST, and Network errors into clear French messages with actionable fixes.
 */

export interface UserFriendlyError {
  title: string;
  description: string;
  action?: string;
  technicalDetails?: string;
  fullMessage: string;
}

/**
 * Parses any error object and returns a clear, actionable French diagnostic.
 */
export function formatUserErrorMessage(error: any): UserFriendlyError {
  if (!error) {
    return {
      title: "Erreur inconnue",
      description: "Une opération n'a pas pu aboutir.",
      action: "Veuillez réessayer.",
      fullMessage: "Erreur inconnue. Veuillez réessayer.",
    };
  }

  const rawMsg: string = typeof error === "string" 
    ? error 
    : error?.message || error?.error_description || error?.details || JSON.stringify(error);
  const code: string = String(error?.code || "");

  // 1. Missing database column (Schema Cache issue in Supabase)
  const missingColMatch = rawMsg.match(/Could not find the '([^']+)' column of '([^']+)' in the schema cache/i)
    || rawMsg.match(/column "([^"]+)" of relation "([^"]+)" does not exist/i);

  if (missingColMatch || rawMsg.includes("schema cache") || code === "PGRST204") {
    const colName = missingColMatch ? missingColMatch[1] : "demandée";
    const tableName = missingColMatch ? missingColMatch[2] : "concernée";
    
    let specificAction = "Exécutez les dernières migrations SQL dans l'éditeur SQL de votre tableau de bord Supabase.";
    if (colName === "deposit_amount") {
      specificAction = "Exécutez la commande : ALTER TABLE trips ADD COLUMN IF NOT EXISTS deposit_amount NUMERIC; dans le SQL Editor de Supabase.";
    } else if (colName === "deposit_payment_link") {
      specificAction = "Exécutez la commande : ALTER TABLE trips ADD COLUMN IF NOT EXISTS deposit_payment_link TEXT; dans le SQL Editor de Supabase.";
    }

    return {
      title: "Colonne de base de données non configurée",
      description: `La colonne « ${colName} » n'est pas encore créée dans la table « ${tableName} » de votre projet Supabase.`,
      action: specificAction,
      technicalDetails: rawMsg,
      fullMessage: `La colonne « ${colName} » n'est pas encore créée dans la table « ${tableName} ».\nAction : ${specificAction}`,
    };
  }

  // 2. Authentication & Session expiration
  if (
    rawMsg.includes("JWT expired") ||
    rawMsg.includes("invalid token") ||
    rawMsg.includes("session expired") ||
    rawMsg.includes("Auth session missing") ||
    code === "PGRST301"
  ) {
    return {
      title: "Session administrateur expirée",
      description: "Votre session de connexion sécurisée a expiré pour protéger vos données.",
      action: "Veuillez vous déconnecter puis vous reconnecter avec votre mot de passe et votre code MFA.",
      technicalDetails: rawMsg,
      fullMessage: "Votre session a expiré. Veuillez vous reconnecter à l'espace d'administration.",
    };
  }

  // 3. Row Level Security / Permissions
  if (
    rawMsg.includes("row-level security") ||
    rawMsg.includes("permission denied") ||
    rawMsg.includes("new row violates row-level security policy") ||
    code === "42501"
  ) {
    return {
      title: "Autorisation requise",
      description: "Votre compte ne dispose pas des droits nécessaires pour modifier cette ressource.",
      action: "Vérifiez que votre compte possède bien le rôle « admin » dans la table user_roles de Supabase.",
      technicalDetails: rawMsg,
      fullMessage: "Droits insuffisants. Vérifiez que votre compte a le rôle admin dans Supabase.",
    };
  }

  // 4. Duplicate key / Unique constraint violation
  if (rawMsg.includes("duplicate key value violates unique constraint") || code === "23505") {
    let field = "identifiant";
    if (rawMsg.includes("slug")) field = "slug URL";
    if (rawMsg.includes("email")) field = "adresse email";

    return {
      title: "Élément déjà existant",
      description: `Un enregistrement avec cette valeur de ${field} existe déjà.`,
      action: `Modifiez le ${field} pour qu'il soit unique, puis réessayez.`,
      technicalDetails: rawMsg,
      fullMessage: `Un élément avec cette valeur existe déjà. Modifiez le ${field} pour qu'il soit unique.`,
    };
  }

  // 5. Foreign key constraint / Linked records deletion
  if (rawMsg.includes("violates foreign key constraint") || code === "23503") {
    return {
      title: "Suppression bloquée par des données liées",
      description: "Cet élément est associé à des réservations ou d'autres données actives.",
      action: "Désactivez plutôt cet élément (mode inactif) au lieu de le supprimer pour préserver l'historique.",
      technicalDetails: rawMsg,
      fullMessage: "Impossible de supprimer cet élément car des réservations y sont rattachées. Vous pouvez le désactiver.",
    };
  }

  // 6. Network / Connectivity errors
  if (
    rawMsg.includes("Failed to fetch") ||
    rawMsg.includes("NetworkError") ||
    rawMsg.includes("net::ERR_") ||
    rawMsg.includes("timeout")
  ) {
    return {
      title: "Connexion réseau interrompue",
      description: "Impossible d'établir la communication avec la base de données.",
      action: "Vérifiez votre connexion Internet et rechargez la page si nécessaire.",
      technicalDetails: rawMsg,
      fullMessage: "Problème de connexion réseau. Vérifiez votre accès Internet et réessayez.",
    };
  }

  // 7. Storage / File upload issues
  if (rawMsg.includes("Bucket not found") || rawMsg.includes("storage")) {
    return {
      title: "Erreur d'enregistrement du fichier",
      description: "L'espace de stockage de fichiers n'est pas accessible ou configuré.",
      action: "Vérifiez que le bucket « trip-photos » existe et possède les droits de lecture/écriture publics dans Supabase Storage.",
      technicalDetails: rawMsg,
      fullMessage: "Erreur de stockage de photo. Vérifiez les buckets dans Supabase Storage.",
    };
  }

  if (rawMsg.includes("Payload too large") || rawMsg.includes("File size")) {
    return {
      title: "Fichier trop volumineux",
      description: "L'image sélectionnée dépasse la taille maximale autorisée (5 Mo).",
      action: "Compressez l'image ou choisissez un fichier au format JPEG/PNG/WebP de moins de 5 Mo.",
      technicalDetails: rawMsg,
      fullMessage: "Image trop lourde. Veuillez choisir une image de moins de 5 Mo.",
    };
  }

  // 8. Default fallback
  return {
    title: "Une erreur est survenue",
    description: rawMsg.length > 180 ? rawMsg.slice(0, 180) + "..." : rawMsg,
    action: "Veuillez vérifier les champs renseignés et réessayer. Si le problème persiste, contactez le support technique.",
    technicalDetails: rawMsg,
    fullMessage: `${rawMsg}\nAction : Vérifiez les champs et réessayez.`,
  };
}
