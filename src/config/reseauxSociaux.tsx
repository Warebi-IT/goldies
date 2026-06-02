import { ComponentType } from "react"
import { Instagram, Facebook, Youtube, Linkedin, Mail, MessageCircle } from "lucide-react"

interface ReseauSocial {
  nom: string
  url: string
  icone: ComponentType<{ className?: string }> | null
  actif: boolean
  externe: boolean
}

const TikTokIconSvg = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.75a4.85 4.85 0 0 1-1.01-.06z" />
  </svg>
)

const SnapchatIconSvg = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
    <path d="M12.017 2C9.5 2 7.9 3.1 7.1 4.4c-.4.7-.5 1.4-.5 2v.8c-.6.1-1.3.3-1.8.6-.2.1-.3.3-.2.5.1.3.4.5.7.5h.1c.4-.1.9-.3 1.3-.4v.1c0 .5-.1 1-.3 1.5-.5 1.1-1.5 2-2.8 2.4-.2.1-.3.2-.3.4 0 .3.2.5.4.6.7.2 1.4.3 2.1.3.2 0 .4 0 .6.1.3.5.4 1 .3 1.5-.1.3-.3.5-.5.7-.5.3-1.1.5-1.7.5-.3 0-.5.2-.5.5s.2.5.5.5c1.3 0 2.5-.5 3.4-1.3.3.1.7.1 1 .1.8 0 1.6-.2 2.3-.5.9.8 2.1 1.3 3.4 1.3.3 0 .5-.2.5-.5s-.2-.5-.5-.5c-.6 0-1.2-.2-1.7-.5-.2-.2-.4-.4-.5-.7-.1-.5 0-1 .3-1.5.2-.1.4-.1.6-.1.7 0 1.4-.1 2.1-.3.2-.1.4-.3.4-.6 0-.2-.1-.3-.3-.4-1.3-.4-2.3-1.3-2.8-2.4-.2-.5-.3-1-.3-1.5v-.1c.4.1.9.3 1.3.4h.1c.3 0 .6-.2.7-.5.1-.2 0-.4-.2-.5-.5-.3-1.2-.5-1.8-.6V6.4c0-.6-.1-1.3-.5-2C16.1 3.1 14.5 2 12.017 2z" />
  </svg>
)

const LinktreeIconSvg = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
    <path d="M7.953 15.066c-.08.163-.08.324-.08.486.08.517.528.897 1.052.897h2.024v4.716c0 .405.324.729.729.729h.647c.405 0 .729-.324.729-.729v-4.716h2.024c.405 0 .81-.243.972-.648.162-.405.081-.81-.162-1.134l-3.159-3.321 3.159-3.321c.324-.324.405-.81.162-1.134-.162-.405-.567-.648-.972-.648h-2.024V1.625c0-.405-.324-.729-.729-.729h-.647c-.405 0-.729.324-.729.729v4.716H9.006c-.405 0-.81.243-.972.648-.162.405-.081.81.162 1.134l3.078 3.321-3.159 3.321c-.081.081-.162.243-.162.324v-.243z" />
  </svg>
)

export const RESEAUX_SOCIAUX: ReseauSocial[] = [
  {
    nom: "Instagram",
    url: "https://www.instagram.com/goldies.travel/",
    icone: Instagram,
    actif: true,
    externe: true,
  },
  {
    nom: "TikTok",
    url: "https://www.tiktok.com/@goldies_travel",
    icone: TikTokIconSvg,
    actif: true,
    externe: true,
  },
  {
    nom: "WhatsApp",
    url: "https://chat.whatsapp.com/JwP9zvmow5UJyfeiVkiSbE",
    icone: MessageCircle,
    actif: true,
    externe: true,
  },
  {
    nom: "Facebook",
    url: "https://www.facebook.com/groups/366190054572553?locale=fr_CA",
    icone: Facebook,
    actif: true,
    externe: true,
  },
  {
    nom: "Youtube",
    url: "https://www.youtube.com/watch?v=Y4ui_wZOcmw",
    icone: Youtube,
    actif: true,
    externe: true,
  },
  {
    nom: "LinkedIn",
    url: "https://www.linkedin.com/company/la-presse/",
    icone: Linkedin,
    actif: true,
    externe: true,
  },
  {
    nom: "Snapchat",
    url: "",
    icone: SnapchatIconSvg,
    actif: true,
    externe: true,
  },
  {
    nom: "Linktree",
    url: "https://linktr.ee/goldiestraveel",
    icone: LinktreeIconSvg,
    actif: true,
    externe: true,
  },
  {
    nom: "Email",
    url: "contact@goldiestravel.com",
    icone: Mail,
    actif: true,
    externe: false,
  },
]

export const RESEAUX_ACTIFS = RESEAUX_SOCIAUX.filter((r) => r.actif && r.url !== "")
