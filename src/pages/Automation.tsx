import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion"
import { useState, useEffect } from "react"
import { createPortal } from "react-dom"
import { useTheme } from "../context/ThemeContext"
import LiquidEther from "../components/OptionalLiquidEther"
import CardNav from "../components/CardNav"
import "../components/CardNav.css"
import { WhatsAppFAB, WhatsAppPill, WhatsAppBanner } from "../components/WhatsAppCTA"
import { useSEO } from "../lib/useSEO"

const LIQUID_DARK = ["#0a0014", "#7b00cc", "#c026d3", "#60a5fa", "#ffffff"]
const LIQUID_LIGHT = ["#f4f1f1", "#747272", "#000000"]

const WA_NUMBER = "573195768097"
const WA_URL = `https://wa.me/${WA_NUMBER}?text=Hola%20Andres%2C%20quiero%20automatizar%20un%20proceso%20con%20IA`

function useIsDesktop() {
  const [isDesktop, setIsDesktop] = useState(false)
  useEffect(() => {
    const check = () => setIsDesktop(window.innerWidth >= 1024)
    check()
    window.addEventListener("resize", check)
    return () => window.removeEventListener("resize", check)
  }, [])
  return isDesktop
}

function ThemeToggle() {
  const { isDark, toggleTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  useEffect(() => { setMounted(true) }, [])
  const ic = isDark ? "#fff" : "#000"
  const el = (
    <div style={{ position: "fixed", top: 20, right: 20, zIndex: 9999, display: "flex", alignItems: "center", gap: 8, userSelect: "none" }}>
      <div style={{ opacity: !isDark ? 1 : 0.28, transition: "opacity .35s", display: "flex", alignItems: "center", justifyContent: "center", width: 20, height: 20 }}>
        <svg width="11" height="15" viewBox="0 0 11 15" fill="none"><path d="M7 1L1 8h4.5L4 14l6.5-7.5H6L7 1z" fill={ic} stroke={ic} strokeWidth=".4" strokeLinejoin="round" /></svg>
      </div>
      <button onClick={toggleTheme} aria-label="Cambiar tema" style={{ position: "relative", width: 52, height: 28, borderRadius: 14, background: isDark ? "rgba(255,255,255,.10)" : "rgba(0,0,0,.08)", border: `1px solid ${isDark ? "rgba(255,255,255,.22)" : "rgba(0,0,0,.16)"}`, cursor: "pointer", outline: "none", padding: 0, flexShrink: 0, transition: "background .4s,border-color .4s" }}>
        <motion.div animate={{ x: isDark ? 26 : 2 }} transition={{ type: "spring", stiffness: 420, damping: 32 }} style={{ position: "absolute", top: 2, left: 0, width: 22, height: 22, borderRadius: "50%", background: isDark ? "#fff" : "#000", boxShadow: isDark ? "0 1px 5px rgba(0,0,0,.55)" : "0 1px 5px rgba(0,0,0,.20)" }} />
      </button>
      <div style={{ opacity: isDark ? 1 : 0.28, transition: "opacity .35s", display: "flex", alignItems: "center", justifyContent: "center", width: 20, height: 20 }}>
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M10.5 7.8A5.5 5.5 0 0 1 4.2 1.5a5 5 0 1 0 6.3 6.3z" fill={ic} stroke={ic} strokeWidth=".4" strokeLinejoin="round" /></svg>
      </div>
    </div>
  )
  return mounted ? createPortal(el, document.body) : null
}

function ScrollBar() {
  const { scrollYProgress } = useScroll()
  const width = useTransform(scrollYProgress, [0, 1], ["0%", "100%"])
  const { isDark } = useTheme()
  return (
    <motion.div style={{ position: "fixed", top: 0, left: 0, height: 1.5, zIndex: 300, pointerEvents: "none", width, background: isDark ? "rgba(255,255,255,.3)" : "rgba(0,0,0,.25)" }} />
  )
}

/* ─────────────────────────────────────────────────────────
   GRID BACKDROP — technical aesthetic
───────────────────────────────────────────────────────── */
function GridBackdrop({ isDark }: { isDark: boolean }) {
  const stroke = isDark ? "rgba(255,255,255,.04)" : "rgba(0,0,0,.05)"
  return (
    <svg
      aria-hidden="true"
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none", zIndex: 1 }}
    >
      <defs>
        <pattern id="auto-grid" width="56" height="56" patternUnits="userSpaceOnUse">
          <path d="M 56 0 L 0 0 0 56" fill="none" stroke={stroke} strokeWidth=".5" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#auto-grid)" />
    </svg>
  )
}

/* ─────────────────────────────────────────────────────────
   NODE — labeled box for flow diagrams
───────────────────────────────────────────────────────── */
type Node = {
  id: string
  label: string
  kind: "input" | "process" | "ai" | "output"
}

function NodeBox({ node, isDark, delay = 0 }: { node: Node; isDark: boolean; delay?: number }) {
  const colors: Record<Node["kind"], { border: string; bg: string; chip: string; chipText: string }> = isDark ? {
    input:   { border: "rgba(96,165,250,.55)", bg: "rgba(10,16,26,.85)", chip: "rgba(96,165,250,.18)", chipText: "#60a5fa" },
    process: { border: "rgba(255,255,255,.20)", bg: "rgba(14,14,18,.85)", chip: "rgba(255,255,255,.10)", chipText: "rgba(255,255,255,.85)" },
    ai:      { border: "rgba(192,38,211,.65)", bg: "rgba(20,8,30,.85)", chip: "rgba(192,38,211,.20)", chipText: "#c026d3" },
    output:  { border: "rgba(34,197,94,.55)", bg: "rgba(8,18,12,.85)", chip: "rgba(34,197,94,.18)", chipText: "#22c55e" },
  } : {
    input:   { border: "rgba(37,99,235,.50)", bg: "rgba(248,250,255,.95)", chip: "rgba(37,99,235,.12)", chipText: "#2563eb" },
    process: { border: "rgba(0,0,0,.16)", bg: "rgba(255,255,255,.95)", chip: "rgba(0,0,0,.06)", chipText: "rgba(0,0,0,.78)" },
    ai:      { border: "rgba(168,28,189,.45)", bg: "rgba(252,248,255,.95)", chip: "rgba(168,28,189,.12)", chipText: "#a81cbd" },
    output:  { border: "rgba(22,163,74,.50)", bg: "rgba(248,253,250,.95)", chip: "rgba(22,163,74,.12)", chipText: "#16a34a" },
  }
  const c = colors[node.kind]
  const kindLabel = node.kind === "input" ? "Input" : node.kind === "process" ? "Logic" : node.kind === "ai" ? "AI" : "Output"

  return (
    <motion.div
      initial={{ opacity: 0, y: 12, scale: .96 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: .5, delay, ease: [.16, 1, .3, 1] }}
      style={{
        position: "relative",
        padding: "14px 18px",
        background: c.bg,
        border: `1px solid ${c.border}`,
        borderRadius: 10,
        backdropFilter: "blur(8px)",
        minWidth: 140,
        textAlign: "center",
      }}
    >
      <span style={{ display: "inline-block", padding: "3px 8px", borderRadius: 4, background: c.chip, color: c.chipText, fontFamily: "monospace", fontSize: 9, letterSpacing: ".22em", textTransform: "uppercase", marginBottom: 6 }}>
        {kindLabel}
      </span>
      <div style={{ fontSize: 12, fontWeight: 600, letterSpacing: "-.005em", color: isDark ? "#fff" : "#000", lineHeight: 1.3 }}>
        {node.label}
      </div>
    </motion.div>
  )
}

/* ─────────────────────────────────────────────────────────
   FLOW DIAGRAM — animates a path between nodes
───────────────────────────────────────────────────────── */
function FlowDiagram({ nodes, isDark, isDesktop }: { nodes: Node[][]; isDark: boolean; isDesktop: boolean }) {
  const strokeColor = isDark ? "rgba(255,255,255,.22)" : "rgba(0,0,0,.20)"
  // nodes is rows. On mobile each row stacks vertically.
  if (!isDesktop) {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 8, padding: "24px 0" }}>
        {nodes.flat().map((n, i) => (
          <div key={n.id} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
            <NodeBox node={n} isDark={isDark} delay={i * 0.06} />
            {i < nodes.flat().length - 1 && (
              <motion.div
                initial={{ height: 0 }}
                whileInView={{ height: 18 }}
                viewport={{ once: true }}
                transition={{ duration: .35, delay: i * .06 + .25 }}
                style={{ width: 1, background: strokeColor }}
              />
            )}
          </div>
        ))}
      </div>
    )
  }

  // Desktop: rows side-by-side, with horizontal arrows
  return (
    <div style={{ padding: "32px 0" }}>
      {nodes.map((row, rowIdx) => (
        <div key={rowIdx} style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 16, marginTop: rowIdx > 0 ? 24 : 0 }}>
          {row.map((n, i) => (
            <div key={n.id} style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <NodeBox node={n} isDark={isDark} delay={rowIdx * 0.2 + i * 0.08} />
              {i < row.length - 1 && (
                <motion.svg
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: .4, delay: rowIdx * .2 + i * .08 + .25 }}
                  width={48} height={20} viewBox="0 0 48 20" fill="none"
                >
                  <motion.path
                    d="M 2 10 L 42 10"
                    stroke={strokeColor} strokeWidth="1" strokeDasharray="4 4"
                    initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ duration: .6, delay: rowIdx * .2 + i * .08 + .3 }}
                  />
                  <path d="M 40 4 L 46 10 L 40 16" stroke={strokeColor} strokeWidth="1" fill="none" />
                </motion.svg>
              )}
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}

/* ─────────────────────────────────────────────────────────
   METRIC CARD
───────────────────────────────────────────────────────── */
function Metric({ value, label, isDark, delay = 0 }: { value: string; label: string; isDark: boolean; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: .5, delay }}
      style={{
        padding: "20px 22px",
        border: isDark ? "1px solid rgba(255,255,255,.10)" : "1px solid rgba(0,0,0,.10)",
        borderRadius: 12,
        background: isDark ? "rgba(255,255,255,.025)" : "rgba(255,255,255,.55)",
      }}
    >
      <div style={{ fontSize: "clamp(1.6rem, 4vw, 2.4rem)", fontWeight: 900, letterSpacing: "-.03em", lineHeight: 1, color: isDark ? "#fff" : "#000", marginBottom: 6 }}>{value}</div>
      <div style={{ fontFamily: "monospace", fontSize: 10, letterSpacing: ".22em", textTransform: "uppercase", color: isDark ? "rgba(255,255,255,.65)" : "rgba(0,0,0,.60)" }}>{label}</div>
    </motion.div>
  )
}

/* ─────────────────────────────────────────────────────────
   CASE STUDY
───────────────────────────────────────────────────────── */
type CaseStudy = {
  id: string
  num: string
  title: string
  subtitle: string
  problem: string
  solution: string
  flow: Node[][]
  metrics: { value: string; label: string }[]
  stack: string[]
}

const cases: CaseStudy[] = [
  {
    id: "lead-agent",
    num: "01",
    title: "Lead Agent",
    subtitle: "Agente conversacional para captura y calificación de leads",
    problem:
      "Los mensajes entrantes (WhatsApp + formulario) tardaban horas en ser respondidos. Muchos leads se enfriaban antes del primer contacto y no había forma escalable de calificarlos a mano.",
    solution:
      "Construí un agente en n8n que escucha los webhooks de WhatsApp Cloud API y del formulario web. GPT-4 detecta intención (cotización, soporte, info), extrae datos (presupuesto, urgencia, ciudad) y responde en segundos. El lead calificado se sincroniza a Notion con resumen automático y se notifica por correo si es de alta prioridad.",
    flow: [
      [
        { id: "wa", label: "WhatsApp Cloud API", kind: "input" },
        { id: "form", label: "Webhook formulario", kind: "input" },
        { id: "n8n", label: "n8n Trigger", kind: "process" },
        { id: "gpt", label: "GPT-4 · Intent + Extract", kind: "ai" },
        { id: "reply", label: "Respuesta WhatsApp", kind: "output" },
      ],
      [
        { id: "notion", label: "Notion CRM", kind: "output" },
        { id: "sheets", label: "Google Sheets", kind: "output" },
        { id: "mail", label: "Email a sales", kind: "output" },
      ],
    ],
    metrics: [
      { value: "<5 s", label: "Tiempo de respuesta" },
      { value: "100%", label: "Mensajes contestados" },
      { value: "0 USD", label: "Costo de operación/lead" },
    ],
    stack: ["n8n", "OpenAI GPT-4", "WhatsApp Cloud API", "Notion API", "Google Sheets", "Webhooks", "Node.js"],
  },
  {
    id: "handoff-reader",
    num: "02",
    title: "Handoff Reader",
    subtitle: "Agente que convierte handoffs de diseño en landings listas para producción",
    problem:
      "Cada handoff (Figma export + PDF + brief en Markdown) implicaba 4–8 horas de traducir specs a código: estructura HTML, variables CSS, copy, imágenes. Tedioso, error-prone y poco escalable.",
    solution:
      "Un workflow en n8n vigila una carpeta de Drive. Cuando llega un handoff, parsea cada formato (Figma JSON, PDF con OCR, Markdown). GPT-4 Vision analiza el mock, identifica componentes y tokens. Otro nodo genera HTML semántico + CSS variables + meta SEO. El resultado se commitea a un repo y dispara deploy en Vercel.",
    flow: [
      [
        { id: "drive", label: "Drive Watch", kind: "input" },
        { id: "parser", label: "Figma · PDF · MD Parser", kind: "process" },
        { id: "vision", label: "GPT-4 Vision · Layout", kind: "ai" },
      ],
      [
        { id: "tokens", label: "Token Extractor", kind: "ai" },
        { id: "builder", label: "HTML Builder", kind: "process" },
        { id: "deploy", label: "Vercel Deploy", kind: "output" },
      ],
    ],
    metrics: [
      { value: "12 min", label: "De handoff a deploy" },
      { value: "≈ 8 h", label: "Tiempo ahorrado/landing" },
      { value: "94%", label: "Tokens detectados ok" },
    ],
    stack: ["n8n", "OpenAI", "GPT-4 Vision", "Figma API", "PDF Parse", "Markdown", "Vercel API", "Git"],
  },
]

function CaseSection({ c, isDark, isDesktop }: { c: CaseStudy; isDark: boolean; isDesktop: boolean }) {
  return (
    <section id={c.id} style={{ position: "relative", zIndex: 20, padding: isDesktop ? "112px 48px" : "80px 20px", maxWidth: 1280, margin: "0 auto" }}>
      {/* number + title */}
      <motion.div initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: .7 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
          <span style={{ fontFamily: "monospace", fontSize: 11, color: isDark ? "rgba(255,255,255,.65)" : "rgba(0,0,0,.60)" }}>Case · {c.num}</span>
          <div style={{ flex: 1, height: .5, background: isDark ? "rgba(255,255,255,.12)" : "rgba(0,0,0,.10)" }} />
          <span style={{ fontFamily: "monospace", fontSize: 10, color: isDark ? "rgba(255,255,255,.55)" : "rgba(0,0,0,.55)" }}>n8n · OpenAI</span>
        </div>
        <h2 style={{ fontSize: "clamp(2.2rem, 6vw, 4.5rem)", fontWeight: 900, textTransform: "uppercase", letterSpacing: "-.04em", lineHeight: .9, color: isDark ? "#fff" : "#000", marginBottom: 10 }}>
          {c.title}
        </h2>
        <p style={{ fontSize: 15, fontWeight: 300, lineHeight: 1.6, maxWidth: 640, color: isDark ? "rgba(255,255,255,.82)" : "rgba(0,0,0,.78)" }}>
          {c.subtitle}
        </p>
      </motion.div>

      {/* problem + solution */}
      <div style={{ display: "grid", gridTemplateColumns: isDesktop ? "1fr 1fr" : "1fr", gap: isDesktop ? 32 : 20, marginTop: 48 }}>
        <motion.div initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: .6 }}>
          <span style={{ fontFamily: "monospace", fontSize: 10, letterSpacing: ".25em", textTransform: "uppercase", display: "block", marginBottom: 12, color: isDark ? "rgba(255,255,255,.55)" : "rgba(0,0,0,.55)" }}>Problema</span>
          <p style={{ fontSize: 14, lineHeight: 1.75, fontWeight: 300, color: isDark ? "rgba(255,255,255,.88)" : "rgba(0,0,0,.82)" }}>{c.problem}</p>
        </motion.div>
        <motion.div initial={{ opacity: 0, x: 10 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: .6, delay: .1 }}>
          <span style={{ fontFamily: "monospace", fontSize: 10, letterSpacing: ".25em", textTransform: "uppercase", display: "block", marginBottom: 12, color: isDark ? "rgba(255,255,255,.55)" : "rgba(0,0,0,.55)" }}>Solución</span>
          <p style={{ fontSize: 14, lineHeight: 1.75, fontWeight: 300, color: isDark ? "rgba(255,255,255,.88)" : "rgba(0,0,0,.82)" }}>{c.solution}</p>
        </motion.div>
      </div>

      {/* flow diagram */}
      <div style={{ marginTop: 56 }}>
        <span style={{ fontFamily: "monospace", fontSize: 10, letterSpacing: ".25em", textTransform: "uppercase", display: "block", marginBottom: 8, color: isDark ? "rgba(255,255,255,.55)" : "rgba(0,0,0,.55)" }}>Flow</span>
        <div style={{
          padding: isDesktop ? "8px 16px" : "8px 0",
          border: isDark ? "0.5px dashed rgba(255,255,255,.10)" : "0.5px dashed rgba(0,0,0,.10)",
          borderRadius: 14,
          overflowX: "auto",
        }}>
          <FlowDiagram nodes={c.flow} isDark={isDark} isDesktop={isDesktop} />
        </div>
      </div>

      {/* metrics */}
      <div style={{ marginTop: 48, display: "grid", gridTemplateColumns: isDesktop ? "repeat(3, 1fr)" : "1fr", gap: 12 }}>
        {c.metrics.map((m, i) => (
          <Metric key={m.label} value={m.value} label={m.label} isDark={isDark} delay={i * .08} />
        ))}
      </div>

      {/* stack */}
      <div style={{ marginTop: 40 }}>
        <span style={{ fontFamily: "monospace", fontSize: 10, letterSpacing: ".25em", textTransform: "uppercase", display: "block", marginBottom: 12, color: isDark ? "rgba(255,255,255,.55)" : "rgba(0,0,0,.55)" }}>Stack</span>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          {c.stack.map((s) => (
            <span key={s} style={{
              fontFamily: "monospace", fontSize: 10, letterSpacing: ".15em", textTransform: "uppercase",
              padding: "5px 10px", borderRadius: 99,
              border: isDark ? "1px solid rgba(255,255,255,.16)" : "1px solid rgba(0,0,0,.14)",
              color: isDark ? "rgba(255,255,255,.85)" : "rgba(0,0,0,.78)",
            }}>{s}</span>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ─────────────────────────────────────────────────────────
   MAIN
───────────────────────────────────────────────────────── */
export default function Automation() {
  useSEO({
    title: "Automation · Agentes IA con n8n",
    description: "Casos de automatización con n8n + OpenAI: agentes que responden y califican leads, agentes que leen handoffs y generan landings. Workflows productivos en producción.",
    path: "/automation",
    keywords: "n8n colombia, automatización ia, agentes openai, gpt-4, whatsapp api, workflow automation, handoff figma a html, no-code automation",
  })
  const { isDark } = useTheme()
  const isDesktop = useIsDesktop()
  const pageBg = isDark ? "#060606" : "#f5f1e9"
  const borderC = isDark ? "0.5px solid rgba(255,255,255,0.07)" : "0.5px solid rgba(0,0,0,0.07)"

  const menuItems = [
    { label: "Servicios", bgColor: isDark ? "#111111" : "#f0ece4", textColor: isDark ? "#fff" : "#000",
      links: [{ label: "Lab / Servicios", href: "/lab", ariaLabel: "Lab" }, { label: "Home", href: "/", ariaLabel: "Home" }] },
    { label: "Proyectos", bgColor: isDark ? "#1a1a1a" : "#e8e4dc", textColor: isDark ? "#fff" : "#000",
      links: [{ label: "Archive", href: "/archive", ariaLabel: "Archive" }, { label: "Visual Editorial", href: "/visual", ariaLabel: "Visual" }] },
    { label: "Contacto", bgColor: isDark ? "#dde4e6" : "#1a1a1a", textColor: isDark ? "#000" : "#fff",
      links: [{ label: "WhatsApp", href: WA_URL, ariaLabel: "WhatsApp" }, { label: "Email", href: "mailto:aprada.web@gmail.com", ariaLabel: "Email" }] },
  ]

  return (
    <div style={{ minHeight: "100vh", overflowX: "hidden", background: pageBg, color: isDark ? "#fff" : "#000", position: "relative" }}>
      {/* LiquidEther desktop only */}
      <div style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none" }}>
        <LiquidEther
          mouseForce={22} cursorSize={120} resolution={0.8}
          dt={0.016} viscous={15} isViscous={false}
          autoIntensity={isDark ? 2.5 : 1.2}
          colors={isDark ? LIQUID_DARK : LIQUID_LIGHT}
        />
        <div style={{ position: "absolute", inset: 0, zIndex: 1, pointerEvents: "none", background: isDark ? "rgba(0,0,0,.86)" : "rgba(245,241,233,.86)" }} />
      </div>

      <ScrollBar />
      <ThemeToggle />
      <WhatsAppFAB />

      <div style={{ position: "relative", zIndex: 50 }}>
        <CardNav logo="/faviconAP.ico" items={menuItems}
          baseColor={isDark ? "rgba(6,6,6,.95)" : "rgba(245,241,233,.95)"}
          menuColor={isDark ? "#fff" : "#000"} buttonBgColor={isDark ? "#dde4e6" : "#000"} buttonTextColor={isDark ? "#000" : "#fff"} />
      </div>

      {/* HERO */}
      <section style={{ position: "relative", zIndex: 20, paddingTop: isDesktop ? 140 : 110, paddingBottom: isDesktop ? 96 : 64, paddingLeft: "clamp(20px, 5vw, 56px)", paddingRight: "clamp(20px, 5vw, 56px)", maxWidth: 1400, margin: "0 auto" }}>
        <GridBackdrop isDark={isDark} />

        <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: .7 }}
          style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 28, position: "relative", zIndex: 2 }}>
          <div style={{ width: 22, height: .5, background: isDark ? "rgba(255,255,255,.45)" : "rgba(0,0,0,.35)" }} />
          <span style={{ fontSize: 9, letterSpacing: ".35em", textTransform: "uppercase", color: isDark ? "rgba(255,255,255,.80)" : "rgba(0,0,0,.75)" }}>
            Section 03 · Automation
          </span>
        </motion.div>

        <div style={{ overflow: "hidden", marginBottom: 4, position: "relative", zIndex: 2 }}>
          <motion.h1 initial={{ y: 90 }} animate={{ y: 0 }} transition={{ duration: 1, ease: [.16, 1, .3, 1] }}
            style={{ fontSize: "clamp(3rem, 11vw, 9rem)", fontWeight: 900, textTransform: "uppercase", letterSpacing: "-.045em", lineHeight: .82, color: isDark ? "#fff" : "#000" }}>
            Agentes
          </motion.h1>
        </div>
        <div style={{ overflow: "hidden", marginBottom: 32, position: "relative", zIndex: 2 }}>
          <motion.h1 initial={{ y: 90 }} animate={{ y: 0 }} transition={{ duration: 1, delay: .08, ease: [.16, 1, .3, 1] }}
            style={{ fontSize: "clamp(3rem, 11vw, 9rem)", fontWeight: 900, textTransform: "uppercase", letterSpacing: "-.045em", lineHeight: .82, WebkitTextStroke: isDark ? "1.5px rgba(255,255,255,.28)" : "1.5px rgba(0,0,0,.22)", color: "transparent" }}>
            n8n + IA
          </motion.h1>
        </div>

        <motion.p initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .8, delay: .35 }}
          style={{ fontSize: 16, fontWeight: 300, lineHeight: 1.7, maxWidth: 560, color: isDark ? "#fff" : "#000", marginBottom: 40, position: "relative", zIndex: 2 }}>
          Workflows que escuchan, deciden y ejecutan. No demos: agentes en producción que reemplazan tareas repetitivas y conectan herramientas que antes no se hablaban.
        </motion.p>

        {/* TOC compact */}
        <div style={{ position: "relative", zIndex: 2, display: "grid", gridTemplateColumns: isDesktop ? "repeat(2, 1fr)" : "1fr", gap: 0, borderTop: borderC, marginTop: 16 }}>
          {cases.map((c, i) => (
            <motion.a key={c.id} href={`#${c.id}`}
              initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: .6, delay: i * .08 }}
              whileHover={{ y: -3 }}
              style={{ display: "block", padding: "26px 0", borderBottom: borderC, borderRight: i === 0 && isDesktop ? borderC : "none", paddingLeft: i === 1 && isDesktop ? 24 : 0, textDecoration: "none", cursor: "pointer" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                <span style={{ fontFamily: "monospace", fontSize: 10, color: isDark ? "rgba(255,255,255,.65)" : "rgba(0,0,0,.60)" }}>Case {c.num}</span>
                <div style={{ flex: 1, height: .5, background: isDark ? "rgba(255,255,255,.10)" : "rgba(0,0,0,.10)" }} />
                <span style={{ fontFamily: "monospace", fontSize: 10, color: isDark ? "rgba(255,255,255,.65)" : "rgba(0,0,0,.60)" }}>{c.stack.length} nodos</span>
              </div>
              <h3 style={{ fontSize: "clamp(1.4rem, 3vw, 2rem)", fontWeight: 900, textTransform: "uppercase", letterSpacing: "-.03em", lineHeight: .9, color: isDark ? "#fff" : "#000" }}>{c.title}</h3>
            </motion.a>
          ))}
        </div>
      </section>

      <WhatsAppBanner isDesktop={isDesktop} headline="¿Tu equipo pierde tiempo con tareas repetitivas?" message="Te muestro cómo automatizar tu primer flujo en una llamada de 20 min" />

      {/* CASES */}
      {cases.map((c) => (
        <CaseSection key={c.id} c={c} isDark={isDark} isDesktop={isDesktop} />
      ))}

      <WhatsAppPill />

      {/* CTA FINAL */}
      <section style={{ position: "relative", zIndex: 20, padding: isDesktop ? "112px 48px" : "80px 20px", maxWidth: 1280, margin: "0 auto", display: "flex", flexDirection: isDesktop ? "row" : "column", alignItems: isDesktop ? "flex-end" : "flex-start", justifyContent: "space-between", gap: 48, borderTop: borderC }}>
        <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: .7 }} viewport={{ once: true }}>
          <span style={{ fontSize: 9, letterSpacing: ".35em", textTransform: "uppercase", display: "block", marginBottom: 16, color: isDark ? "rgba(255,255,255,.70)" : "rgba(0,0,0,.65)" }}>¿Tienes un proceso repetitivo?</span>
          <h2 style={{ fontSize: "clamp(2.8rem,7vw,5rem)", fontWeight: 900, textTransform: "uppercase", letterSpacing: "-.04em", lineHeight: .86, color: isDark ? "#fff" : "#000" }}>
            Lo automatizamos<br />
            <span style={{ WebkitTextStroke: isDark ? "1.5px rgba(255,255,255,.22)" : "1.5px rgba(0,0,0,.20)", color: "transparent" }}>en una semana</span>
          </h2>
        </motion.div>
        <div style={{ display: "flex", flexDirection: "column", gap: 16, flexShrink: 0 }}>
          {[
            { label: "WhatsApp", href: WA_URL },
            { label: "Email", href: "mailto:aprada.web@gmail.com" },
            { label: "Más proyectos", href: "/archive" },
          ].map(({ label, href }, i) => (
            <motion.a key={label} href={href} target={href.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer"
              style={{ display: "flex", alignItems: "center", gap: 16, textDecoration: "none", fontSize: 13, textTransform: "uppercase", letterSpacing: ".2em", color: isDark ? "#fff" : "#000" }}
              initial={{ opacity: 0, x: 12 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: .5, delay: i * .08 }} viewport={{ once: true }}
              whileHover={{ x: 4 }}>
              <span style={{ display: "inline-block", width: 20, height: .5, background: isDark ? "rgba(255,255,255,.4)" : "rgba(0,0,0,.35)" }} />
              {label}
            </motion.a>
          ))}
        </div>
      </section>

      <footer style={{ position: "relative", zIndex: 20, padding: "32px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", background: pageBg, borderTop: borderC, gap: 12, flexWrap: "wrap" }}>
        <span style={{ fontSize: 9, letterSpacing: ".4em", textTransform: "uppercase", color: isDark ? "rgba(255,255,255,.55)" : "rgba(0,0,0,.55)" }}>Andres Prada</span>
        <span style={{ fontFamily: "monospace", fontSize: 9, color: isDark ? "rgba(255,255,255,.45)" : "rgba(0,0,0,.45)" }}>© 2026 · n8n + IA</span>
        <span style={{ fontSize: 9, letterSpacing: ".4em", textTransform: "uppercase", color: isDark ? "rgba(255,255,255,.55)" : "rgba(0,0,0,.55)" }}>Bogotá, CO</span>
      </footer>

      {/* unused but imported for AnimatePresence types — silence */}
      <AnimatePresence />
    </div>
  )
}
