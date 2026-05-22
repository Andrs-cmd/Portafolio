import { motion } from "framer-motion"
import { useEffect, useState } from "react"
import { createPortal } from "react-dom"

export const WA_NUMBER = "573195768097"
export const WA_BASE = `https://wa.me/${WA_NUMBER}?text=`
export const WA_DEFAULT = `${WA_BASE}Hola%20Andres%2C%20me%20interesa%20trabajar%20contigo`

/** Floating Action Button — bottom right on every page */
export function WhatsAppFAB({ message }: { message?: string }) {
  const [mounted, setMounted] = useState(false)
  useEffect(() => { setMounted(true) }, [])

  const href = message ? `${WA_BASE}${encodeURIComponent(message)}` : WA_DEFAULT

  if (!mounted) return null
  const el = (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Contactar por WhatsApp"
      initial={{ opacity: 0, scale: 0.5, y: 30 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ delay: 0.8, duration: 0.6, ease: [.16, 1, .3, 1] }}
      whileHover={{ scale: 1.06 }}
      whileTap={{ scale: 0.96 }}
      style={{
        position: "fixed",
        bottom: 20,
        right: 20,
        zIndex: 9997,
        width: 60,
        height: 60,
        borderRadius: "50%",
        background: "#25D366",
        boxShadow: "0 12px 32px rgba(37,211,102,.45), 0 4px 12px rgba(0,0,0,.25)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        textDecoration: "none",
        cursor: "pointer",
        border: "2px solid rgba(255,255,255,.85)",
      }}
    >
      <span style={{ position: "absolute", inset: -2, borderRadius: "50%", border: "2px solid #25D366", opacity: 0.5, animation: "wa-pulse 2.4s ease-out infinite" }}/>
      <svg width="28" height="28" viewBox="0 0 32 32" fill="#fff" aria-hidden="true">
        <path d="M16.001 0C7.165 0 0 7.163 0 15.998a15.94 15.94 0 0 0 2.255 8.166L0 32l8.045-2.106A15.99 15.99 0 0 0 16 32C24.836 32 32 24.836 32 16S24.836 0 16.001 0zm0 29.336a13.27 13.27 0 0 1-6.78-1.862l-.487-.29-5.014 1.312 1.337-4.882-.318-.503a13.297 13.297 0 0 1-2.04-7.113c0-7.351 5.98-13.331 13.336-13.331 7.357 0 13.336 5.98 13.336 13.336s-5.98 13.333-13.37 13.333zm7.305-9.989c-.4-.2-2.366-1.167-2.733-1.3-.366-.133-.633-.2-.9.2-.266.4-1.033 1.3-1.267 1.567-.233.266-.466.3-.866.1-.4-.2-1.69-.623-3.218-1.987-1.19-1.06-1.992-2.372-2.226-2.772-.233-.4-.025-.617.175-.817.18-.18.4-.466.6-.7.2-.233.266-.4.4-.667.133-.266.066-.5-.033-.7-.1-.2-.9-2.166-1.233-2.966-.324-.78-.652-.673-.9-.686-.233-.013-.5-.016-.766-.016-.266 0-.7.1-1.066.5-.366.4-1.4 1.367-1.4 3.333 0 1.967 1.434 3.867 1.633 4.133.2.266 2.823 4.308 6.842 6.04.957.413 1.703.66 2.286.844.96.305 1.836.262 2.527.16.77-.115 2.366-.967 2.7-1.9.333-.933.333-1.733.233-1.9-.1-.166-.366-.266-.766-.466z"/>
      </svg>
    </motion.a>
  )
  return createPortal(el, document.body)
}

/** Pill-style inline WhatsApp button — for use inside CTA sections */
export function WhatsAppPill({
  message,
  label = "Escribir por WhatsApp",
  isDark = true,
  size = "md",
}: {
  message?: string
  label?: string
  isDark?: boolean
  size?: "sm" | "md" | "lg"
}) {
  const href = message ? `${WA_BASE}${encodeURIComponent(message)}` : WA_DEFAULT
  const padY = size === "sm" ? 10 : size === "lg" ? 16 : 14
  const padX = size === "sm" ? 18 : size === "lg" ? 28 : 22
  const font = size === "sm" ? 11 : size === "lg" ? 14 : 12

  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      whileHover={{ scale: 1.03, y: -2 }}
      whileTap={{ scale: 0.97 }}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 10,
        padding: `${padY}px ${padX}px`,
        borderRadius: 999,
        background: "#25D366",
        color: "#fff",
        textDecoration: "none",
        fontSize: font,
        fontWeight: 600,
        letterSpacing: ".12em",
        textTransform: "uppercase",
        boxShadow: isDark ? "0 8px 24px rgba(37,211,102,.30)" : "0 6px 18px rgba(37,211,102,.30)",
        border: "1px solid rgba(255,255,255,.18)",
      }}
    >
      <svg width="16" height="16" viewBox="0 0 32 32" fill="#fff" aria-hidden="true">
        <path d="M16.001 0C7.165 0 0 7.163 0 15.998a15.94 15.94 0 0 0 2.255 8.166L0 32l8.045-2.106A15.99 15.99 0 0 0 16 32C24.836 32 32 24.836 32 16S24.836 0 16.001 0zm0 29.336a13.27 13.27 0 0 1-6.78-1.862l-.487-.29-5.014 1.312 1.337-4.882-.318-.503a13.297 13.297 0 0 1-2.04-7.113c0-7.351 5.98-13.331 13.336-13.331 7.357 0 13.336 5.98 13.336 13.336s-5.98 13.333-13.37 13.333zm7.305-9.989c-.4-.2-2.366-1.167-2.733-1.3-.366-.133-.633-.2-.9.2-.266.4-1.033 1.3-1.267 1.567-.233.266-.466.3-.866.1-.4-.2-1.69-.623-3.218-1.987-1.19-1.06-1.992-2.372-2.226-2.772-.233-.4-.025-.617.175-.817.18-.18.4-.466.6-.7.2-.233.266-.4.4-.667.133-.266.066-.5-.033-.7-.1-.2-.9-2.166-1.233-2.966-.324-.78-.652-.673-.9-.686-.233-.013-.5-.016-.766-.016-.266 0-.7.1-1.066.5-.366.4-1.4 1.367-1.4 3.333 0 1.967 1.434 3.867 1.633 4.133.2.266 2.823 4.308 6.842 6.04.957.413 1.703.66 2.286.844.96.305 1.836.262 2.527.16.77-.115 2.366-.967 2.7-1.9.333-.933.333-1.733.233-1.9-.1-.166-.366-.266-.766-.466z"/>
      </svg>
      {label}
    </motion.a>
  )
}

/** WhatsApp banner — high contrast CTA strip for between sections */
export function WhatsAppBanner({ isDesktop, message, headline }: {
  isDark?: boolean
  isDesktop: boolean
  message?: string
  headline?: string
}) {
  const href = message ? `${WA_BASE}${encodeURIComponent(message)}` : WA_DEFAULT
  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: .7 }}
      whileHover={{ y: -3 }}
      style={{
        display: "flex",
        flexDirection: isDesktop ? "row" : "column",
        alignItems: isDesktop ? "center" : "flex-start",
        gap: isDesktop ? 32 : 20,
        padding: isDesktop ? "28px 32px" : "24px 20px",
        background: "linear-gradient(135deg, #128C7E 0%, #25D366 100%)",
        borderRadius: 18,
        textDecoration: "none",
        boxShadow: "0 18px 40px rgba(18,140,126,.30)",
        cursor: "pointer",
      }}
    >
      <div style={{ flex: 1 }}>
        <span style={{ display: "block", fontFamily: "monospace", fontSize: 10, letterSpacing: ".25em", textTransform: "uppercase", color: "rgba(255,255,255,.85)", marginBottom: 6 }}>
          Respondo rápido
        </span>
        <h3 style={{ fontSize: isDesktop ? "1.6rem" : "1.3rem", fontWeight: 900, textTransform: "uppercase", letterSpacing: "-.02em", lineHeight: 1.05, color: "#fff" }}>
          {headline || "Hablemos por WhatsApp"}
        </h3>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <span style={{ fontSize: 12, fontWeight: 600, letterSpacing: ".15em", textTransform: "uppercase", color: "#fff" }}>
          Iniciar chat
        </span>
        <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 44, height: 44, borderRadius: "50%", background: "rgba(255,255,255,.22)", border: "1px solid rgba(255,255,255,.35)" }}>
          <svg width="20" height="20" viewBox="0 0 32 32" fill="#fff" aria-hidden="true">
            <path d="M16.001 0C7.165 0 0 7.163 0 15.998a15.94 15.94 0 0 0 2.255 8.166L0 32l8.045-2.106A15.99 15.99 0 0 0 16 32C24.836 32 32 24.836 32 16S24.836 0 16.001 0zm7.305 19.347c-.4-.2-2.366-1.167-2.733-1.3-.366-.133-.633-.2-.9.2-.266.4-1.033 1.3-1.267 1.567-.233.266-.466.3-.866.1-.4-.2-1.69-.623-3.218-1.987-1.19-1.06-1.992-2.372-2.226-2.772-.233-.4-.025-.617.175-.817.18-.18.4-.466.6-.7.2-.233.266-.4.4-.667.133-.266.066-.5-.033-.7-.1-.2-.9-2.166-1.233-2.966-.324-.78-.652-.673-.9-.686-.233-.013-.5-.016-.766-.016-.266 0-.7.1-1.066.5-.366.4-1.4 1.367-1.4 3.333 0 1.967 1.434 3.867 1.633 4.133.2.266 2.823 4.308 6.842 6.04.957.413 1.703.66 2.286.844.96.305 1.836.262 2.527.16.77-.115 2.366-.967 2.7-1.9.333-.933.333-1.733.233-1.9-.1-.166-.366-.266-.766-.466z"/>
          </svg>
        </span>
      </div>
    </motion.a>
  )
}
