import { useEffect, useRef, useState, type ReactNode } from "react"
import { useTheme } from "../context/ThemeContext"

/**
 * Iris — chat flotante del portafolio. Botón fijo (sobre el FAB de WhatsApp) que
 * abre un panel de conversación; llama a la función /api/iris (Cloudflare Workers
 * AI) que responde sobre Andres: servicios, precios, proyectos, fotografía,
 * esculturas, cómo trabaja y contacto. En desarrollo (/api/iris no existe en el
 * dev server) muestra un aviso en vez de fallar.
 */
const LAV = "#c3c4f2"
type Msg = { role: "user" | "assistant"; content: string }
const GREETING: Msg = { role: "assistant", content: "¡Hola! Soy Iris, la asistente de Andres. Pregúntame por sus servicios, precios, proyectos o cómo contactarlo." }

// Convierte en enlaces cliqueables lo contactable que mencione Iris, sin
// depender de cómo lo escriba el modelo: URLs y wa.me, emails (→ mailto) y el
// número de WhatsApp de Andres escrito como teléfono (+57 319 576 8097 → wa.me).
const WA_HREF = "https://wa.me/573195768097"
// url | wa.me | email | teléfono (dígito, luego 7+ de dígito/espacio/()./- , y dígito)
const TOKEN_RE =
  /(https?:\/\/[^\s]+|wa\.me\/[^\s]+|[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}|\+?\d[\d\s().-]{7,}\d)/g

function renderWithLinks(text: string, linkColor: string): ReactNode[] {
  const out: ReactNode[] = []
  let last = 0
  let key = 0
  let m: RegExpExecArray | null
  TOKEN_RE.lastIndex = 0
  const anchor = (href: string, label: string) => (
    <a key={key++} href={href} target="_blank" rel="noopener noreferrer"
      style={{ color: linkColor, textDecoration: "underline", fontWeight: 600, wordBreak: "break-all" }}>
      {label}
    </a>
  )
  while ((m = TOKEN_RE.exec(text))) {
    if (m.index > last) out.push(text.slice(last, m.index))
    const raw = m[0]
    let href: string | null = null
    let label = raw
    let trail = ""
    if (/^https?:\/\//.test(raw) || /^wa\.me\//.test(raw)) {
      // Recorta la puntuación final (no es parte del enlace).
      const tm = raw.match(/[.,;:!?)]+$/)
      if (tm) { trail = tm[0]; label = raw.slice(0, -trail.length) }
      href = label.startsWith("http") ? label : `https://${label}`
    } else if (raw.includes("@")) {
      href = `mailto:${raw}`
    } else {
      // Teléfono: sólo se enlaza si son los dígitos del WhatsApp de Andres; otro
      // número (una fecha, un precio) se deja como texto tal cual.
      if (raw.replace(/\D/g, "").includes("3195768097")) href = WA_HREF
    }
    if (href) {
      out.push(anchor(href, label))
      if (trail) out.push(trail)
    } else {
      out.push(raw)
    }
    last = TOKEN_RE.lastIndex
  }
  if (last < text.length) out.push(text.slice(last))
  return out
}

// Logo de Iris: un nudo toroidal (trefoil / torus knot), la misma familia de
// formas que las esculturas 3D del Manifiesto — coherencia de marca. Se traza
// con las ecuaciones paramétricas del trefoil para que quede limpio y simétrico.
const TREFOIL_PATH = (() => {
  const N = 170, cx = 12, cy = 12, s = 2.85
  let d = ""
  for (let i = 0; i <= N; i++) {
    const t = (i / N) * Math.PI * 2
    const x = cx + s * (Math.sin(t) + 2 * Math.sin(2 * t))
    const y = cy + s * (Math.cos(t) - 2 * Math.cos(2 * t))
    d += (i === 0 ? "M" : "L") + x.toFixed(2) + " " + y.toFixed(2) + " "
  }
  return d + "Z"
})()
function IrisMark({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d={TREFOIL_PATH} stroke="#ffffff" strokeWidth="1.7" strokeLinejoin="round" strokeLinecap="round" opacity={0.96} />
    </svg>
  )
}

export default function IrisChat() {
  const { isDark } = useTheme()
  const [open, setOpen] = useState(false)
  const [msgs, setMsgs] = useState<Msg[]>([GREETING])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => { scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" }) }, [msgs, loading, open])

  const send = async () => {
    const text = input.trim()
    if (!text || loading) return
    const next = [...msgs, { role: "user" as const, content: text }]
    setMsgs(next); setInput(""); setLoading(true)
    try {
      const r = await fetch("/api/iris", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ messages: next.filter(m => m !== GREETING) }),
      })
      if (!r.ok) throw new Error(String(r.status))
      const data = await r.json()
      setMsgs(m => [...m, { role: "assistant", content: data.reply || "…" }])
    } catch {
      setMsgs(m => [...m, { role: "assistant", content: "Ahora mismo no puedo responder (Iris funciona en el sitio publicado). Mientras tanto escríbele a Andres por WhatsApp: wa.me/573195768097" }])
    } finally { setLoading(false) }
  }

  const bg = isDark ? "#0d0d12" : "#fbfaf7"
  const fg = isDark ? "#eef0f3" : "#141211"
  const line = isDark ? "rgba(255,255,255,.12)" : "rgba(0,0,0,.12)"
  const bubbleUser = isDark ? "rgba(195,196,242,.16)" : "rgba(99,91,255,.12)"
  const bubbleIris = isDark ? "rgba(255,255,255,.05)" : "rgba(0,0,0,.04)"

  return (
    <>
      {/* halo que late (solo cerrado) para que la bolita se note */}
      <style>{`@keyframes irisGlow{0%,100%{box-shadow:0 10px 26px rgba(0,0,0,.30),0 0 0 0 rgba(195,196,242,.55)}50%{box-shadow:0 10px 26px rgba(0,0,0,.30),0 0 0 10px rgba(195,196,242,0)}}`}</style>

      {/* bolita flotante con el logo de Iris; despliega el chat */}
      <button
        onClick={() => setOpen(o => !o)}
        aria-label={open ? "Cerrar chat de Iris" : "Preguntarle a Iris"}
        style={{
          position: "fixed", right: 22, bottom: 22, zIndex: 9998,
          width: 58, height: 58, borderRadius: "50%", padding: 0,
          display: "grid", placeItems: "center", cursor: "pointer",
          border: "1px solid rgba(255,255,255,.4)",
          background: "linear-gradient(145deg, #cfd0f7 0%, #9a9bec 60%, #8486e4 100%)",
          boxShadow: "0 10px 26px rgba(0,0,0,.30)",
          animation: open ? "none" : "irisGlow 2.8s ease-out infinite",
          transition: "transform .2s ease",
        }}
        onMouseEnter={(e) => { e.currentTarget.style.transform = "scale(1.07)" }}
        onMouseLeave={(e) => { e.currentTarget.style.transform = "scale(1)" }}
      >
        {open
          ? <span style={{ color: "#17171f", fontSize: 24, lineHeight: 1, fontWeight: 400 }}>×</span>
          : <IrisMark />}
      </button>

      {/* panel de chat */}
      {open && (
        <div style={{
          position: "fixed", zIndex: 9998,
          right: "max(16px, env(safe-area-inset-right))", bottom: 92,
          width: "min(360px, calc(100vw - 32px))", height: "min(520px, 70vh)",
          display: "flex", flexDirection: "column", overflow: "hidden",
          borderRadius: 18, border: `1px solid ${line}`, background: bg, color: fg,
          boxShadow: "0 24px 70px rgba(0,0,0,.45)",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "14px 16px", borderBottom: `1px solid ${line}` }}>
            <span style={{ width: 30, height: 30, borderRadius: "50%", background: "linear-gradient(145deg, #cfd0f7 0%, #9a9bec 60%, #8486e4 100%)", display: "grid", placeItems: "center", flexShrink: 0 }}><IrisMark size={18} /></span>
            <div style={{ lineHeight: 1.1 }}>
              <div style={{ fontWeight: 700, fontSize: 13 }}>Iris</div>
              <div style={{ fontSize: 10.5, opacity: .6 }}>Asistente de Andres Prada</div>
            </div>
          </div>

          <div ref={scrollRef} style={{ flex: 1, overflowY: "auto", padding: 14, display: "flex", flexDirection: "column", gap: 10 }}>
            {msgs.map((m, i) => (
              <div key={i} style={{ alignSelf: m.role === "user" ? "flex-end" : "flex-start", maxWidth: "86%", padding: "9px 12px", borderRadius: 14, fontSize: 13, lineHeight: 1.5, background: m.role === "user" ? bubbleUser : bubbleIris, border: m.role === "user" ? `1px solid ${isDark ? "rgba(195,196,242,.25)" : "rgba(99,91,255,.2)"}` : `1px solid ${line}`, whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
                {renderWithLinks(m.content, isDark ? LAV : "#635bff")}
              </div>
            ))}
            {loading && (
              <div style={{ alignSelf: "flex-start", padding: "9px 12px", borderRadius: 14, fontSize: 13, background: bubbleIris, border: `1px solid ${line}`, opacity: .7 }}>Iris está escribiendo…</div>
            )}
          </div>

          <form onSubmit={(e) => { e.preventDefault(); send() }} style={{ display: "flex", gap: 8, padding: 12, borderTop: `1px solid ${line}` }}>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Escribe tu pregunta…"
              maxLength={800}
              style={{ flex: 1, border: `1px solid ${line}`, background: isDark ? "rgba(255,255,255,.04)" : "rgba(0,0,0,.03)", color: fg, borderRadius: 12, padding: "10px 12px", fontSize: 13, outline: "none" }}
            />
            <button type="submit" disabled={loading || !input.trim()} aria-label="Enviar"
              style={{ width: 42, flexShrink: 0, borderRadius: 12, border: "none", background: LAV, color: "#141211", cursor: loading || !input.trim() ? "default" : "pointer", opacity: loading || !input.trim() ? .5 : 1, fontSize: 16, fontWeight: 800 }}>↑</button>
          </form>
        </div>
      )}
    </>
  )
}
