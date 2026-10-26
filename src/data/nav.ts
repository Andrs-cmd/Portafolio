import type { CardNavItem } from "../components/CardNav"

/**
 * Fuente ÚNICA de verdad para navegación y contacto. Todas las páginas importan
 * de aquí para que el menú sea idéntico en todo el sitio (antes cada página
 * definía el suyo y diferían entre sí). Cambiar un enlace aquí lo cambia en todas.
 */

// ── Contacto ───────────────────────────────────────────────────────────────
export const WA_NUMBER = "573195768097"
export const WA_URL = `https://wa.me/${WA_NUMBER}?text=Hola%20Andres%2C%20vi%20tu%20portafolio%20y%20quiero%20hablar`
export const EMAIL = "aprada.web@gmail.com"
export const EMAIL_HREF = `mailto:${EMAIL}`
export const INSTAGRAM = "https://instagram.com/andfel_fotografia"
export const INSTAGRAM_HANDLE = "@andfel_fotografia"

// ── CTA del nav (botón del CardNav) ──────────────────────────────────────────
export const NAV_CTA = { label: "Hablemos", href: "/contact" }

// ── Menú (mismo en todas las páginas) ────────────────────────────────────────
export function getNavItems(isDark: boolean): CardNavItem[] {
  return [
    {
      label: "Servicios",
      bgColor: isDark ? "#111111" : "#f0ece4",
      textColor: isDark ? "#fff" : "#000",
      links: [
        { label: "Desarrollo & Web", href: "/lab", ariaLabel: "Servicios de desarrollo y web" },
        { label: "Automatización n8n", href: "/automation", ariaLabel: "Automatización con n8n" },
      ],
    },
    {
      label: "Proyectos",
      bgColor: isDark ? "#1a1a1a" : "#e8e4dc",
      textColor: isDark ? "#fff" : "#000",
      links: [
        { label: "Archivo", href: "/archive", ariaLabel: "Archivo de proyectos" },
        { label: "Visual & Foto", href: "/visual", ariaLabel: "Portafolio visual y fotografía" },
      ],
    },
    {
      label: "Contacto",
      bgColor: isDark ? "#dde4e6" : "#1a1a1a",
      textColor: isDark ? "#000" : "#fff",
      links: [
        { label: "Contáctame", href: "/contact", ariaLabel: "Página de contacto" },
        { label: "WhatsApp", href: WA_URL, ariaLabel: "Escribir por WhatsApp" },
        { label: "Email", href: EMAIL_HREF, ariaLabel: "Enviar un email" },
      ],
    },
  ]
}
