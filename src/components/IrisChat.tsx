import { useEffect, useRef, useState } from "react"
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
      {/* bolita flotante, sutil — solo el ícono de Iris; despliega el chat */}
      <button
        onClick={() => setOpen(o => !o)}
        aria-label={open ? "Cerrar chat de Iris" : "Preguntarle a Iris"}
        style={{
          position: "fixed", right: 20, bottom: 20, zIndex: 9998,
          width: 46, height: 46, borderRadius: "50%", padding: 0,
          display: "grid", placeItems: "center", cursor: "pointer",
          border: `1px solid ${isDark ? "rgba(255,255,255,.14)" : "rgba(0,0,0,.12)"}`,
          background: isDark ? "rgba(13,13,18,.78)" : "rgba(255,255,255,.82)",
          backdropFilter: "blur(10px)", boxShadow: "0 6px 20px rgba(0,0,0,.22)",
          transition: "transform .2s ease",
        }}
        onMouseEnter={(e) => { e.currentTarget.style.transform = "scale(1.06)" }}
        onMouseLeave={(e) => { e.currentTarget.style.transform = "scale(1)" }}
      >
        {open
          ? <span style={{ color: fg, fontSize: 18, lineHeight: 1, opacity: .8 }}>×</span>
          : <span style={{ color: LAV, fontWeight: 800, fontSize: 19, fontStyle: "italic", fontFamily: "Georgia, serif" }}>i</span>}
      </button>

      {/* panel de chat */}
      {open && (
        <div style={{
          position: "fixed", zIndex: 9998,
          right: "max(16px, env(safe-area-inset-right))", bottom: 78,
          width: "min(360px, calc(100vw - 32px))", height: "min(520px, 70vh)",
          display: "flex", flexDirection: "column", overflow: "hidden",
          borderRadius: 18, border: `1px solid ${line}`, background: bg, color: fg,
          boxShadow: "0 24px 70px rgba(0,0,0,.45)",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "14px 16px", borderBottom: `1px solid ${line}` }}>
            <span style={{ width: 28, height: 28, borderRadius: "50%", background: LAV, display: "grid", placeItems: "center", color: "#141211", fontWeight: 800 }}>i</span>
            <div style={{ lineHeight: 1.1 }}>
              <div style={{ fontWeight: 700, fontSize: 13 }}>Iris</div>
              <div style={{ fontSize: 10.5, opacity: .6 }}>Asistente de Andres Prada</div>
            </div>
          </div>

          <div ref={scrollRef} style={{ flex: 1, overflowY: "auto", padding: 14, display: "flex", flexDirection: "column", gap: 10 }}>
            {msgs.map((m, i) => (
              <div key={i} style={{ alignSelf: m.role === "user" ? "flex-end" : "flex-start", maxWidth: "86%", padding: "9px 12px", borderRadius: 14, fontSize: 13, lineHeight: 1.5, background: m.role === "user" ? bubbleUser : bubbleIris, border: m.role === "user" ? `1px solid ${isDark ? "rgba(195,196,242,.25)" : "rgba(99,91,255,.2)"}` : `1px solid ${line}`, whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
                {m.content}
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
