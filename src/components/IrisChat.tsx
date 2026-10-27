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

// Captación de leads: Iris termina su respuesta con [[LEAD]]<mensaje>[[/LEAD]]
// cuando el visitante quiere contratar. Aquí se separa ese mensaje del texto
// visible; el frontend arma el enlace de WhatsApp (así la codificación nunca
// se rompe) y muestra un botón para enviárselo a Andres con el contexto listo.
// Tolerante a cómo el modelo escriba el marcador: [[LEAD]] o [LEAD], cierre
// [[/LEAD]] o [/LEAD], o sin cierre (hasta el final). Así no se pierde el lead.
const LEAD_RE = /\[\[?LEAD\]\]?\s*([\s\S]*?)\s*(?:\[\[?\/LEAD\]\]?|$)/i
// Limpia el mensaje del lead: quita un marcador/fragmento de cierre colgante
// (p. ej. "...[/" si la respuesta se truncó) y cualquier placeholder <...> que
// el modelo haya dejado sin rellenar, y normaliza espacios.
function cleanLead(s: string): string {
  return s
    .replace(/\[+\s*\/?\s*L?E?A?D?\]*\s*$/i, "")
    .replace(/<[^>]*>/g, "")
    .replace(/\s{2,}/g, " ")
    .replace(/\s+([.,;:!?])/g, "$1")
    .trim()
}
function extractLead(content: string): { text: string; lead: string | null } {
  const m = content.match(LEAD_RE)
  if (!m) return { text: content, lead: null }
  const lead = cleanLead(m[1].trim())
  return { text: content.replace(LEAD_RE, "").trim(), lead: lead || null }
}

// Logo de Iris: un nudo toroidal (torus knot p=2,q=3) girando en 3D — la misma
// familia de formas que las esculturas/visuales de Andres. Se proyecta y rota en
// un <canvas> para que esté en movimiento, igual que en el reel.
function IrisMark({ size = 28 }: { size?: number }) {
  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const cv = ref.current; if (!cv) return
    const ctx = cv.getContext("2d"); if (!ctx) return
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    cv.width = Math.round(size * dpr); cv.height = Math.round(size * dpr)
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    const reduce = typeof window.matchMedia === "function" && window.matchMedia("(prefers-reduced-motion: reduce)").matches
    const N = 120, p = 2, q = 3, R = size * 0.42, cx = size / 2, cy = size / 2
    let raf = 0
    const start = performance.now()
    const draw = (t: number) => {
      const ax = t * 1.7, ay = t * 2.3
      const cxx = Math.cos(ax), sxx = Math.sin(ax), cyy = Math.cos(ay), syy = Math.sin(ay)
      const pts: Array<[number, number, number]> = []
      for (let i = 0; i <= N; i++) {
        const u = (i / N) * Math.PI * 2, rr = Math.cos(q * u) + 2.2
        let x = rr * Math.cos(p * u), y = rr * Math.sin(p * u), z = -Math.sin(q * u) * 1.2
        const y2 = y * cyy - z * syy, z2 = y * syy + z * cyy; y = y2; z = z2
        const x2 = x * cxx - z * sxx, z3 = x * sxx + z * cxx; x = x2; z = z3
        const sc = (R / 3.4) * (1 + z * 0.1)
        pts.push([cx + x * sc, cy + y * sc, z])
      }
      ctx.clearRect(0, 0, size, size)
      ctx.lineJoin = "round"; ctx.lineCap = "round"
      for (let i = 0; i < N; i++) {
        const a = pts[i], b = pts[i + 1]
        const depth = Math.max(0, Math.min(1, (a[2] + 2.2) / 4.4))
        ctx.globalAlpha = 0.28 + 0.72 * depth
        ctx.strokeStyle = "#ffffff"
        ctx.lineWidth = Math.max(0.7, size * 0.032 * (0.55 + depth))
        ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.stroke()
      }
      ctx.globalAlpha = 1
    }
    if (reduce) { draw(0.9); return }
    const loop = (now: number) => { draw((now - start) / 1000); raf = requestAnimationFrame(loop) }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [size])
  return <canvas ref={ref} style={{ width: size, height: size, display: "block" }} aria-hidden="true" />
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
    const payload = JSON.stringify({ messages: next.filter(m => m !== GREETING) })
    // La función de Cloudflare a veces arranca en frío y cierra la conexión
    // antes de responder (el primer mensaje de un visitante fallaba). Reintenta
    // hasta 3 veces ante errores de red o 5xx; un 4xx no se reintenta.
    const ask = async (): Promise<string> => {
      let lastErr: unknown = null
      for (let attempt = 0; attempt < 3; attempt++) {
        if (attempt > 0) await new Promise(res => setTimeout(res, 500 * attempt))
        try {
          const r = await fetch("/api/iris", {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: payload,
          })
          if (r.ok) {
            const data = await r.json()
            return data.reply || "…"
          }
          lastErr = new Error(String(r.status))
          if (r.status < 500) break
        } catch (e) {
          lastErr = e
        }
      }
      throw lastErr
    }
    try {
      const reply = await ask()
      setMsgs(m => [...m, { role: "assistant", content: reply }])
    } catch {
      setMsgs(m => [...m, { role: "assistant", content: "Ahora mismo no puedo responder. Escríbele a Andres por WhatsApp: wa.me/573195768097" }])
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
            {msgs.map((m, i) => {
              const { text, lead } = m.role === "assistant" ? extractLead(m.content) : { text: m.content, lead: null }
              return (
                <div key={i} style={{ alignSelf: m.role === "user" ? "flex-end" : "flex-start", maxWidth: "86%", display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 8 }}>
                  <div style={{ padding: "9px 12px", borderRadius: 14, fontSize: 13, lineHeight: 1.5, background: m.role === "user" ? bubbleUser : bubbleIris, border: m.role === "user" ? `1px solid ${isDark ? "rgba(195,196,242,.25)" : "rgba(99,91,255,.2)"}` : `1px solid ${line}`, whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
                    {renderWithLinks(text, isDark ? LAV : "#635bff")}
                  </div>
                  {lead && (
                    <a href={`https://wa.me/573195768097?text=${encodeURIComponent(lead)}`} target="_blank" rel="noopener noreferrer"
                      style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "10px 14px", borderRadius: 12, background: "#25D366", color: "#fff", fontSize: 12.5, fontWeight: 700, textDecoration: "none", boxShadow: "0 4px 14px rgba(37,211,102,.35)" }}>
                      <svg width="15" height="15" viewBox="0 0 32 32" fill="#fff" aria-hidden="true"><path d="M16.001 0C7.165 0 0 7.163 0 15.998a15.94 15.94 0 0 0 2.255 8.166L0 32l8.045-2.106A15.99 15.99 0 0 0 16 32C24.836 32 32 24.836 32 16S24.836 0 16.001 0zm0 29.336a13.27 13.27 0 0 1-6.78-1.862l-.487-.29-5.014 1.312 1.337-4.882-.318-.503a13.297 13.297 0 0 1-2.04-7.113c0-7.351 5.98-13.331 13.336-13.331 7.357 0 13.336 5.98 13.336 13.336s-5.98 13.333-13.37 13.333z"/></svg>
                      Enviar a Andres por WhatsApp →
                    </a>
                  )}
                </div>
              )
            })}
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
