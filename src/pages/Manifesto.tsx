import { motion, useScroll, useTransform } from "framer-motion"
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
const WA_URL = `https://wa.me/${WA_NUMBER}?text=Hola%20Andres%2C%20le%C3%AD%20tu%20manifiesto%20y%20me%20identifico`

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

/* ──────────────────────────────────────────────────────────
   PRINCIPIOS — el corazón del manifiesto
   Edita el title, lead y body para ajustar tu voz.
   ────────────────────────────────────────────────────────── */
type Principle = {
  num: string
  title: string
  lead: string      // Una sola línea fuerte, declarativa
  body: string      // 2-3 frases que expanden la declaración
}

const principles: Principle[] = [
  {
    num: "01",
    title: "Diseño es decisión",
    lead: "No es decoración. Es elegir qué dejar afuera.",
    body: "Cada elemento de pantalla justifica su lugar o se va. La estética minimal no es tendencia, es disciplina: lo que queda tiene que sostener la mirada. Cuando todo grita, nada se escucha.",
  },
  {
    num: "02",
    title: "El código es el medio",
    lead: "No el fin.",
    body: "Los frameworks cambian cada seis meses. Lo que perdura es el producto: que la persona del otro lado entienda, confíe y avance. Si el código es bonito pero el flujo es feo, el código sobra.",
  },
  {
    num: "03",
    title: "Criterio sobre tendencia",
    lead: "Tendencia caduca. Criterio no.",
    body: "Construyo cosas que envejezcan bien. Las modas de UI duran un año. Los principios de tipografía editorial, contraste, ritmo y silencio llevan décadas funcionando. Apuesto por eso.",
  },
  {
    num: "04",
    title: "Lo lento se hace bien",
    lead: "Velocidad es resultado, no método.",
    body: "Construir rápido para luego rehacer todo no es eficiencia. Es deuda. Prefiero dos semanas pensando que dos meses arreglando. Y cuando hay claridad de propósito, lo bueno también sale rápido.",
  },
  {
    num: "05",
    title: "Marca es proceso",
    lead: "Lo que hacés cuando nadie mira.",
    body: "Una marca no son los colores ni el logo. Es la coherencia entre lo que prometés, lo que entregás y cómo respondés cuando algo falla. Construyo lo segundo y lo tercero. El primero es facil.",
  },
  {
    num: "06",
    title: "LATAM con criterio",
    lead: "Local sí, pero sin perder altura.",
    body: "Trabajo desde Bogotá para marcas que no quieren parecer agencias gringas con acento. Hablo castellano, pienso en pesos, entiendo el WhatsApp, pero el nivel de diseño compite globalmente. Esa es la mezcla.",
  },
]

const workWith = [
  "Quien tiene tiempo para hacer las cosas bien",
  "Quien valora el proceso, no solo el output",
  "Quien comunica claro y responde a tiempo",
  "Quien busca socio, no proveedor",
  "Quien tiene una idea con criterio detrás",
]

const dontWorkWith = [
  "Quien dice 'es urgente' antes de explicar qué necesita",
  "Quien copia referencias sin entenderlas",
  "Quien quiere pagar después de ver el resultado",
  "Quien necesita 50 revisiones para una landing",
  "Quien busca el más barato del mercado",
]

/* ──────────────────────────────────────────────────────────
   MAIN
   ────────────────────────────────────────────────────────── */
export default function Manifesto() {
  useSEO({
    title: "Manifiesto · Cómo trabajo y con quién",
    description: "Los principios detrás de cada proyecto: diseño es decisión, código es medio, criterio sobre tendencia. El manifiesto de Andres Prada — Bogotá.",
    path: "/manifesto",
    keywords: "manifiesto diseñador, principios diseño web, filosofía freelance, andres prada bogotá",
  })
  const { isDark } = useTheme()
  const isDesktop = useIsDesktop()
  const pageBg = isDark ? "#060606" : "#f5f1e9"
  const borderC = isDark ? "0.5px solid rgba(255,255,255,0.08)" : "0.5px solid rgba(0,0,0,0.08)"

  const menuItems = [
    { label: "Servicios", bgColor: isDark ? "#111111" : "#f0ece4", textColor: isDark ? "#fff" : "#000",
      links: [{ label: "Desarrollo Web", href: "/lab", ariaLabel: "Lab" }, { label: "Automation · n8n", href: "/automation", ariaLabel: "Automation" }] },
    { label: "Proyectos", bgColor: isDark ? "#1a1a1a" : "#e8e4dc", textColor: isDark ? "#fff" : "#000",
      links: [{ label: "Archive", href: "/archive", ariaLabel: "Archive" }, { label: "Visual Editorial", href: "/visual", ariaLabel: "Visual" }] },
    { label: "Contacto", bgColor: isDark ? "#dde4e6" : "#1a1a1a", textColor: isDark ? "#000" : "#fff",
      links: [{ label: "WhatsApp", href: WA_URL, ariaLabel: "WhatsApp" }, { label: "Email", href: "mailto:aprada.web@gmail.com", ariaLabel: "Email" }] },
  ]

  return (
    <div style={{ minHeight: "100vh", overflowX: "hidden", background: pageBg, color: isDark ? "#fff" : "#000", position: "relative" }}>
      <div style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none" }}>
        <LiquidEther
          mouseForce={18} cursorSize={120} resolution={0.7}
          dt={0.016} viscous={15} isViscous={false}
          autoIntensity={isDark ? 2 : 1}
          colors={isDark ? LIQUID_DARK : LIQUID_LIGHT}
        />
        <div style={{ position: "absolute", inset: 0, zIndex: 1, pointerEvents: "none", background: isDark ? "rgba(0,0,0,.90)" : "rgba(245,241,233,.90)" }} />
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
      <section style={{ position: "relative", zIndex: 20, paddingTop: isDesktop ? 140 : 110, paddingBottom: isDesktop ? 80 : 56, paddingLeft: "clamp(20px, 5vw, 56px)", paddingRight: "clamp(20px, 5vw, 56px)", maxWidth: 1280, margin: "0 auto" }}>
        <motion.div initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: .7 }}
          style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 28 }}>
          <div style={{ width: 22, height: .5, background: isDark ? "rgba(255,255,255,.45)" : "rgba(0,0,0,.35)" }} />
          <span style={{ fontSize: 9, letterSpacing: ".35em", textTransform: "uppercase", color: isDark ? "rgba(255,255,255,.80)" : "rgba(0,0,0,.75)" }}>
            Section 02 · Manifiesto
          </span>
        </motion.div>

        <div style={{ overflow: "hidden", marginBottom: 4 }}>
          <motion.h1 initial={{ y: 90 }} animate={{ y: 0 }} transition={{ duration: 1, ease: [.16, 1, .3, 1] }}
            style={{ fontSize: "clamp(3rem, 12vw, 10rem)", fontWeight: 900, textTransform: "uppercase", letterSpacing: "-.045em", lineHeight: .82, color: isDark ? "#fff" : "#000" }}>
            Cómo
          </motion.h1>
        </div>
        <div style={{ overflow: "hidden", marginBottom: 32 }}>
          <motion.h1 initial={{ y: 90 }} animate={{ y: 0 }} transition={{ duration: 1, delay: .08, ease: [.16, 1, .3, 1] }}
            style={{ fontSize: "clamp(3rem, 12vw, 10rem)", fontWeight: 900, textTransform: "uppercase", letterSpacing: "-.045em", lineHeight: .82, WebkitTextStroke: isDark ? "1.5px rgba(255,255,255,.28)" : "1.5px rgba(0,0,0,.22)", color: "transparent" }}>
            trabajo
          </motion.h1>
        </div>

        <motion.p initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .8, delay: .35 }}
          style={{ fontSize: "clamp(15px, 2vw, 18px)", fontWeight: 300, lineHeight: 1.7, maxWidth: 620, color: isDark ? "#fff" : "#000", marginBottom: 0 }}>
          Seis principios que filtran qué proyectos acepto y qué resultado entrego. Si los leés y te identificás, hablemos. Si te chocan, también está bien — no somos buen match.
        </motion.p>
      </section>

      {/* PRINCIPIOS */}
      <section style={{ position: "relative", zIndex: 20, padding: isDesktop ? "32px 48px 96px" : "16px 20px 64px", maxWidth: 1280, margin: "0 auto" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: isDesktop ? 0 : 16, borderTop: borderC }}>
          {principles.map((p, i) => (
            <motion.article
              key={p.num}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: .8, delay: (i % 2) * .08, ease: [.16, 1, .3, 1] }}
              style={{
                padding: isDesktop ? "56px 0" : "40px 0",
                borderBottom: borderC,
                display: "grid",
                gridTemplateColumns: isDesktop ? "120px 1fr 1.2fr" : "1fr",
                gap: isDesktop ? 32 : 16,
                alignItems: "start",
              }}
            >
              {/* Número */}
              <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                <span style={{
                  fontFamily: "monospace",
                  fontSize: 11,
                  letterSpacing: ".25em",
                  textTransform: "uppercase",
                  color: isDark ? "rgba(255,255,255,.55)" : "rgba(0,0,0,.50)",
                }}>
                  {p.num}
                </span>
                <div style={{ flex: isDesktop ? 1 : "none", height: .5, background: isDark ? "rgba(255,255,255,.18)" : "rgba(0,0,0,.16)", marginTop: 8 }} />
              </div>

              {/* Título + lead */}
              <div>
                <h2 style={{
                  fontSize: "clamp(1.8rem, 4.5vw, 3.2rem)",
                  fontWeight: 900,
                  textTransform: "uppercase",
                  letterSpacing: "-.04em",
                  lineHeight: .88,
                  color: isDark ? "#fff" : "#000",
                  marginBottom: 12,
                }}>
                  {p.title}
                </h2>
                <p style={{
                  fontSize: "clamp(14px, 1.8vw, 17px)",
                  fontStyle: "italic",
                  fontWeight: 300,
                  lineHeight: 1.4,
                  color: isDark ? "rgba(255,255,255,.78)" : "rgba(0,0,0,.72)",
                  maxWidth: 320,
                }}>
                  {p.lead}
                </p>
              </div>

              {/* Body */}
              <p style={{
                fontSize: "clamp(13px, 1.4vw, 15px)",
                fontWeight: 300,
                lineHeight: 1.8,
                color: isDark ? "rgba(255,255,255,.88)" : "rgba(0,0,0,.82)",
                maxWidth: 540,
                marginTop: isDesktop ? 8 : 0,
              }}>
                {p.body}
              </p>
            </motion.article>
          ))}
        </div>
      </section>

      <WhatsAppBanner isDesktop={isDesktop} headline="¿Resonás con esto?" message="Hablemos de tu proyecto" />

      {/* PULL QUOTE */}
      <section style={{ position: "relative", zIndex: 20, padding: isDesktop ? "112px 48px" : "72px 20px", maxWidth: 1100, margin: "0 auto", textAlign: "center" }}>
        <motion.blockquote
          initial={{ opacity: 0, scale: .96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: [.16, 1, .3, 1] }}
          style={{
            margin: 0,
            fontSize: "clamp(1.8rem, 5vw, 3.6rem)",
            fontWeight: 900,
            textTransform: "uppercase",
            letterSpacing: "-.035em",
            lineHeight: 1,
            color: isDark ? "#fff" : "#000",
          }}
        >
          <span style={{ display: "block", marginBottom: 12 }}>
            “No busco más clientes.
          </span>
          <span style={{ display: "block", WebkitTextStroke: isDark ? "1.5px rgba(255,255,255,.24)" : "1.5px rgba(0,0,0,.20)", color: "transparent" }}>
            busco mejores conversaciones.”
          </span>
        </motion.blockquote>
      </section>

      {/* TRABAJO CON / NO TRABAJO CON */}
      <section style={{ position: "relative", zIndex: 20, padding: isDesktop ? "32px 48px 112px" : "16px 20px 80px", maxWidth: 1280, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: isDesktop ? "1fr 1fr" : "1fr", gap: isDesktop ? 48 : 32, borderTop: borderC, paddingTop: isDesktop ? 64 : 40 }}>
          {/* Trabajo con */}
          <motion.div initial={{ opacity: 0, x: -12 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: .8 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 24 }}>
              <div style={{ width: 18, height: .5, background: isDark ? "rgba(96,165,250,.6)" : "rgba(37,99,235,.55)" }} />
              <span style={{ fontFamily: "monospace", fontSize: 10, letterSpacing: ".25em", textTransform: "uppercase", color: isDark ? "#60a5fa" : "#2563eb" }}>
                Trabajo con
              </span>
            </div>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 18 }}>
              {workWith.map((line, i) => (
                <motion.li key={i}
                  initial={{ opacity: 0, x: -8 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: .5, delay: i * .06 }}
                  style={{ display: "flex", alignItems: "flex-start", gap: 14, fontSize: "clamp(14px, 1.6vw, 17px)", lineHeight: 1.55, color: isDark ? "rgba(255,255,255,.92)" : "rgba(0,0,0,.85)" }}>
                  <span style={{ display: "inline-block", width: 16, height: 16, flexShrink: 0, marginTop: 4, position: "relative" }}>
                    <span style={{ position: "absolute", inset: 0, border: isDark ? "1px solid rgba(96,165,250,.6)" : "1px solid rgba(37,99,235,.55)", borderRadius: 2 }} />
                    <span style={{ position: "absolute", inset: 4, background: isDark ? "rgba(96,165,250,.7)" : "rgba(37,99,235,.6)", borderRadius: 1 }} />
                  </span>
                  {line}
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* No trabajo con */}
          <motion.div initial={{ opacity: 0, x: 12 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: .8, delay: .1 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 24 }}>
              <div style={{ width: 18, height: .5, background: isDark ? "rgba(239,68,68,.55)" : "rgba(220,38,38,.45)" }} />
              <span style={{ fontFamily: "monospace", fontSize: 10, letterSpacing: ".25em", textTransform: "uppercase", color: isDark ? "#ef4444" : "#dc2626" }}>
                No trabajo con
              </span>
            </div>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 18 }}>
              {dontWorkWith.map((line, i) => (
                <motion.li key={i}
                  initial={{ opacity: 0, x: 8 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: .5, delay: i * .06 + .1 }}
                  style={{ display: "flex", alignItems: "flex-start", gap: 14, fontSize: "clamp(14px, 1.6vw, 17px)", lineHeight: 1.55, color: isDark ? "rgba(255,255,255,.78)" : "rgba(0,0,0,.72)", textDecoration: "line-through", textDecorationColor: isDark ? "rgba(239,68,68,.45)" : "rgba(220,38,38,.4)", textDecorationThickness: "1px" }}>
                  <span style={{ display: "inline-block", width: 16, height: 16, flexShrink: 0, marginTop: 4, position: "relative" }}>
                    <span style={{ position: "absolute", inset: 0, border: isDark ? "1px solid rgba(239,68,68,.50)" : "1px solid rgba(220,38,38,.40)", borderRadius: 2 }} />
                  </span>
                  {line}
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </div>
      </section>

      <WhatsAppPill />

      {/* CTA FINAL */}
      <section style={{ position: "relative", zIndex: 20, padding: isDesktop ? "112px 48px" : "80px 20px", maxWidth: 1280, margin: "0 auto", display: "flex", flexDirection: isDesktop ? "row" : "column", alignItems: isDesktop ? "flex-end" : "flex-start", justifyContent: "space-between", gap: 48, borderTop: borderC }}>
        <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: .7 }} viewport={{ once: true }}>
          <span style={{ fontSize: 9, letterSpacing: ".35em", textTransform: "uppercase", display: "block", marginBottom: 16, color: isDark ? "rgba(255,255,255,.70)" : "rgba(0,0,0,.65)" }}>
            Si llegaste hasta acá
          </span>
          <h2 style={{ fontSize: "clamp(2.8rem,7vw,5rem)", fontWeight: 900, textTransform: "uppercase", letterSpacing: "-.04em", lineHeight: .86, color: isDark ? "#fff" : "#000" }}>
            Hablemos<br />
            <span style={{ WebkitTextStroke: isDark ? "1.5px rgba(255,255,255,.22)" : "1.5px rgba(0,0,0,.20)", color: "transparent" }}>
              en serio
            </span>
          </h2>
        </motion.div>
        <div style={{ display: "flex", flexDirection: "column", gap: 16, flexShrink: 0 }}>
          {[
            { label: "WhatsApp directo", href: WA_URL },
            { label: "Email", href: "mailto:aprada.web@gmail.com" },
            { label: "Ver proyectos", href: "/archive" },
            { label: "Portafolio visual", href: "/visual" },
          ].map(({ label, href }, i) => (
            <motion.a key={label} href={href} target={href.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer"
              style={{ display: "flex", alignItems: "center", gap: 16, textDecoration: "none", fontSize: 13, textTransform: "uppercase", letterSpacing: ".2em", color: isDark ? "#fff" : "#000" }}
              initial={{ opacity: 0, x: 12 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: .5, delay: i * .07 }} viewport={{ once: true }}
              whileHover={{ x: 4 }}>
              <span style={{ display: "inline-block", width: 20, height: .5, background: isDark ? "rgba(255,255,255,.4)" : "rgba(0,0,0,.35)" }} />
              {label}
            </motion.a>
          ))}
        </div>
      </section>

      <footer style={{ position: "relative", zIndex: 20, padding: "32px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", background: pageBg, borderTop: borderC, gap: 12, flexWrap: "wrap" }}>
        <span style={{ fontSize: 9, letterSpacing: ".4em", textTransform: "uppercase", color: isDark ? "rgba(255,255,255,.55)" : "rgba(0,0,0,.55)" }}>Andres Prada</span>
        <span style={{ fontFamily: "monospace", fontSize: 9, color: isDark ? "rgba(255,255,255,.45)" : "rgba(0,0,0,.45)" }}>© 2026 · Manifiesto v1</span>
        <span style={{ fontSize: 9, letterSpacing: ".4em", textTransform: "uppercase", color: isDark ? "rgba(255,255,255,.55)" : "rgba(0,0,0,.55)" }}>Bogotá, CO</span>
      </footer>
    </div>
  )
}
