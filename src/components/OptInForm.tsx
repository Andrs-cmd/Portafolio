import { useState } from "react"
import { useTheme } from "../context/ThemeContext"

/**
 * Captura opt-in → /api/subscribe (Brevo). Reutilizable: cada instancia marca su
 * `source` (ej. "curso" o "auditoria") para segmentar en Brevo. En desarrollo la
 * función no existe, así que muestra un aviso en vez de fallar.
 */
const LAV = "#c3c4f2"

export default function OptInForm({
  source,
  title,
  subtitle,
  cta = "Quiero recibirlo",
}: {
  source: string
  title: string
  subtitle: string
  cta?: string
}) {
  const { isDark } = useTheme()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [website, setWebsite] = useState("") // honeypot
  const [state, setState] = useState<"idle" | "loading" | "ok" | "error">("idle")
  const [msg, setMsg] = useState("")

  const fg = isDark ? "#eef0f3" : "#141211"
  const muted = isDark ? "rgba(238,240,243,.65)" : "rgba(20,18,17,.62)"
  const line = isDark ? "rgba(255,255,255,.14)" : "rgba(0,0,0,.14)"
  const fieldBg = isDark ? "rgba(255,255,255,.04)" : "rgba(0,0,0,.03)"
  const cardBg = isDark ? "rgba(255,255,255,.03)" : "rgba(0,0,0,.02)"

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (state === "loading") return
    const mail = email.trim()
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(mail)) {
      setState("error"); setMsg("Escribe un correo válido.")
      return
    }
    setState("loading"); setMsg("")
    try {
      const r = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ name: name.trim(), email: mail, source, website }),
      })
      const data = await r.json().catch(() => ({}))
      if (r.ok && data.ok) {
        setState("ok")
        setMsg("¡Listo! Revisa tu correo (puede llegar a spam la primera vez).")
      } else {
        setState("error")
        setMsg(data.error || "No pudimos registrarte. Inténtalo de nuevo.")
      }
    } catch {
      setState("error")
      setMsg("Esto funciona en el sitio publicado. Mientras tanto, escríbele a Andres por WhatsApp.")
    }
  }

  const label = { fontSize: 11, letterSpacing: ".04em", color: muted, display: "block", marginBottom: 6 } as const
  const input = {
    width: "100%", boxSizing: "border-box" as const, border: `1px solid ${line}`, background: fieldBg,
    color: fg, borderRadius: 11, padding: "11px 13px", fontSize: 14, outline: "none",
  }

  if (state === "ok") {
    return (
      <div style={{ border: `1px solid ${line}`, background: cardBg, borderRadius: 16, padding: "26px 22px", textAlign: "center" }}>
        <div style={{ width: 40, height: 40, margin: "0 auto 12px", borderRadius: "50%", background: LAV, display: "grid", placeItems: "center", color: "#141211", fontSize: 20, fontWeight: 800 }}>✓</div>
        <p style={{ margin: 0, color: fg, fontSize: 15, fontWeight: 600 }}>{msg}</p>
      </div>
    )
  }

  return (
    <form onSubmit={submit} style={{ border: `1px solid ${line}`, background: cardBg, borderRadius: 16, padding: "22px 20px", display: "flex", flexDirection: "column", gap: 14 }}>
      <div>
        <h3 style={{ margin: "0 0 6px", fontSize: "clamp(1.1rem,2.4vw,1.4rem)", fontWeight: 800, letterSpacing: "-.02em", color: fg }}>{title}</h3>
        <p style={{ margin: 0, fontSize: 13.5, lineHeight: 1.5, color: muted }}>{subtitle}</p>
      </div>

      {/* honeypot: invisible para humanos, lo rellenan los bots */}
      <input type="text" name="website" tabIndex={-1} autoComplete="off" value={website}
        onChange={(e) => setWebsite(e.target.value)}
        style={{ position: "absolute", left: "-9999px", width: 1, height: 1, opacity: 0 }} aria-hidden="true" />

      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
        <div style={{ flex: "1 1 140px" }}>
          <label style={label} htmlFor={`name-${source}`}>Nombre</label>
          <input id={`name-${source}`} value={name} onChange={(e) => setName(e.target.value)}
            placeholder="Tu nombre" maxLength={80} style={input} />
        </div>
        <div style={{ flex: "1 1 180px" }}>
          <label style={label} htmlFor={`email-${source}`}>Correo *</label>
          <input id={`email-${source}`} type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
            placeholder="tu@correo.com" maxLength={120} style={input} />
        </div>
      </div>

      <button type="submit" disabled={state === "loading"}
        style={{ border: "none", borderRadius: 999, padding: "13px 20px", background: LAV, color: "#141211",
          fontWeight: 700, fontSize: 13.5, letterSpacing: ".02em", cursor: state === "loading" ? "default" : "pointer",
          opacity: state === "loading" ? 0.7 : 1 }}>
        {state === "loading" ? "Enviando…" : cta}
      </button>

      {state === "error" && <p style={{ margin: 0, fontSize: 12.5, color: "#ef6b6b" }}>{msg}</p>}
      <p style={{ margin: 0, fontSize: 10.5, lineHeight: 1.5, color: muted }}>
        Solo te escribiré sobre esto y mi trabajo. Puedes darte de baja cuando quieras.
      </p>
    </form>
  )
}
