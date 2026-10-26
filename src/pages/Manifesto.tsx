import { motion, useScroll, useTransform, type Variants } from "framer-motion"
import { useState, useEffect, type ReactNode } from "react"
import { createPortal } from "react-dom"
import { useTheme } from "../context/ThemeContext"
import LiquidEther from "../components/OptionalLiquidEther"
import CardNav from "../components/CardNav"
import "../components/CardNav.css"
import { WhatsAppFAB } from "../components/WhatsAppCTA"
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
type Principle = { num: string; title: string; lead: string; body: string }

const principles: Principle[] = [
  { num: "01", title: "Diseño es decisión", lead: "No es decoración. Es elegir qué dejar afuera.",
    body: "Cada elemento de pantalla justifica su lugar o se va. La estética minimal no es tendencia, es disciplina: lo que queda tiene que sostener la mirada. Cuando todo grita, nada se escucha." },
  { num: "02", title: "El código es el medio", lead: "No el fin.",
    body: "Los frameworks cambian cada seis meses. Lo que perdura es el producto: que la persona del otro lado entienda, confíe y avance. Si el código es bonito pero el flujo es feo, el código sobra." },
  { num: "03", title: "Criterio sobre tendencia", lead: "Tendencia caduca. Criterio no.",
    body: "Construyo cosas que envejezcan bien. Las modas de UI duran un año. Los principios de tipografía editorial, contraste, ritmo y silencio llevan décadas funcionando. Apuesto por eso." },
  { num: "04", title: "Lo lento se hace bien", lead: "Velocidad es resultado, no método.",
    body: "Construir rápido para luego rehacer todo no es eficiencia. Es deuda. Prefiero dos semanas pensando que dos meses arreglando. Y cuando hay claridad de propósito, lo bueno también sale rápido." },
  { num: "05", title: "Marca es proceso", lead: "Lo que hacés cuando nadie mira.",
    body: "Una marca no son los colores ni el logo. Es la coherencia entre lo que prometés, lo que entregás y cómo respondés cuando algo falla. Construyo lo segundo y lo tercero. El primero es fácil." },
  { num: "06", title: "LATAM con criterio", lead: "Local sí, pero sin perder altura.",
    body: "Trabajo desde Bogotá para marcas que no quieren parecer agencias gringas con acento. Hablo castellano, pienso en pesos, entiendo el WhatsApp, pero el nivel de diseño compite globalmente. Esa es la mezcla." },
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
   DECK — escenas a pantalla completa con scroll-snap
   ────────────────────────────────────────────────────────── */
const SCENES = ["intro", ...principles.map(p => p.num), "quote", "match", "cta"]

// reveal: los hijos suben y aparecen en cascada al entrar la escena
const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
}
const rise: Variants = {
  hidden: { opacity: 0, y: 22 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } },
}
// trazo que se "dibuja" solo cuando la escena entra
const draw: Variants = {
  hidden: { pathLength: 0, opacity: 0 },
  show: { pathLength: 1, opacity: 1, transition: { pathLength: { duration: 1.2, ease: "easeInOut" }, opacity: { duration: 0.3 } } },
}

// un ícono de línea por principio, dibujado con la variante `draw`
const ICON_PATHS: Record<string, string[]> = {
  "01": ["M10 18 V10 H18", "M38 30 V38 H30"],                                   // decisión: encuadre / crop marks
  "02": ["M19 16 L11 24 L19 32", "M29 16 L37 24 L29 32", "M26 14 L22 34"],      // código: </>
  "03": ["M24 8 a16 16 0 1 0 0.1 0 Z", "M24 24 L31 16"],                        // criterio: brújula
  "04": ["M15 9 H33", "M15 39 H33", "M16 9 L32 39", "M32 9 L16 39"],            // lo lento: reloj de arena
  "05": ["M24 12 L38 19 L24 26 L10 19 Z", "M10 27 L24 34 L38 27"],             // proceso: capas
  "06": ["M24 8 C17 8 12 13 12 20 C12 29 24 40 24 40 C24 40 36 29 36 20 C36 13 31 8 24 8 Z", "M24 20 m-4 0 a4 4 0 1 0 8 0 a4 4 0 1 0 -8 0"], // LATAM: pin
}

const LAV = "#c3c4f2" // acento lavanda (noctiflora)

function PrincipleIcon({ kind, size = 72 }: { kind: string; size?: number }) {
  const paths = ICON_PATHS[kind]
  if (!paths) return null
  return (
    <motion.svg variants={rise} width={size} height={size} viewBox="0 0 48 48" fill="none" aria-hidden="true" style={{ display: "block", marginBottom: 22 }}>
      {paths.map((d, i) => (
        <motion.path key={i} d={d} variants={draw} stroke={LAV} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" fill="none" />
      ))}
    </motion.svg>
  )
}

function Scene({ id, children, isDesktop }: { id: string; children: ReactNode; isDesktop: boolean }) {
  return (
    <section
      id={`scene-${id}`}
      data-scene={id}
      style={{
        minHeight: "100svh",
        scrollSnapAlign: "start",
        scrollSnapStop: "always",
        position: "relative",
        zIndex: 20,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: isDesktop ? "120px clamp(32px,6vw,80px)" : "96px 22px 88px",
        boxSizing: "border-box",
      }}
    >
      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ amount: 0.55, margin: "-8% 0px" }}
        style={{ width: "100%", maxWidth: 1080, margin: "0 auto" }}
      >
        {children}
      </motion.div>
    </section>
  )
}

const SCENE_LABELS = ["Intro", "01 · Diseño", "02 · Código", "03 · Criterio", "04 · Tiempo", "05 · Marca", "06 · LATAM", "Cita", "Con quién", "Contacto"]

/* Navegación noctiflora: puntos (derecha), crumb vertical (izq) y flechas circulares */
function DeckNav({ isDark, isDesktop }: { isDark: boolean; isDesktop: boolean }) {
  const [active, setActive] = useState(0)
  useEffect(() => {
    const secs = Array.from(document.querySelectorAll("[data-scene]"))
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        if (e.isIntersecting) { const i = secs.indexOf(e.target); if (i >= 0) setActive(i) }
      }),
      { threshold: 0.55 }
    )
    secs.forEach((s) => io.observe(s))
    return () => io.disconnect()
  }, [])

  const go = (i: number) => {
    const j = Math.min(SCENES.length - 1, Math.max(0, i))
    document.getElementById(`scene-${SCENES[j]}`)?.scrollIntoView({ behavior: "smooth" })
  }

  const dot = isDark ? "rgba(255,255,255,.28)" : "rgba(0,0,0,.26)"
  const fg = isDark ? "#eef0f3" : "#141211"
  const ring = isDark ? "rgba(255,255,255,.22)" : "rgba(0,0,0,.20)"

  return (
    <>
      {/* puntos (centro-derecha) */}
      <div style={{ position: "fixed", right: "clamp(12px,1.6vw,22px)", top: "50%", transform: "translateY(-50%)", zIndex: 90, display: "flex", flexDirection: "column", gap: 11, alignItems: "center" }}>
        {SCENES.map((s, i) => (
          <button key={s} onClick={() => go(i)} aria-label={`Ir a ${SCENE_LABELS[i]}`} style={{ width: 10, height: 10, padding: 0, border: "none", background: "transparent", cursor: "pointer", display: "grid", placeItems: "center" }}>
            <span style={{ display: "block", width: active === i ? 9 : 6, height: active === i ? 9 : 6, borderRadius: "50%", background: active === i ? LAV : dot, transition: "all .3s ease" }} />
          </button>
        ))}
      </div>

      {/* crumb vertical (izquierda) */}
      {isDesktop && (
        <div style={{ position: "fixed", left: "clamp(14px,2vw,30px)", top: "50%", transform: "translateY(-50%) rotate(180deg)", writingMode: "vertical-rl", zIndex: 90, display: "flex", alignItems: "center", gap: 14, pointerEvents: "none" }}>
          <span style={{ fontFamily: "monospace", fontSize: 10, letterSpacing: ".3em", textTransform: "uppercase", color: LAV }}>{SCENE_LABELS[active]}</span>
          <span style={{ width: 40, height: .5, background: ring }} />
          <span style={{ fontFamily: "monospace", fontSize: 10, letterSpacing: ".2em", color: isDark ? "rgba(255,255,255,.5)" : "rgba(0,0,0,.45)" }}>{String(active + 1).padStart(2, "0")} / {String(SCENES.length).padStart(2, "0")}</span>
        </div>
      )}

      {/* flechas circulares (abajo-izquierda; la derecha la ocupa el FAB de WhatsApp) */}
      <div style={{ position: "fixed", left: "clamp(16px,3vw,40px)", bottom: "clamp(24px,5vh,48px)", zIndex: 90, display: "flex", gap: 10 }}>
        {[["↑", active - 1], ["↓", active + 1]].map(([label, target], k) => {
          const disabled = k === 0 ? active === 0 : active === SCENES.length - 1
          return (
            <button key={k} onClick={() => go(target as number)} aria-label={k === 0 ? "Escena anterior" : "Escena siguiente"} disabled={disabled}
              style={{ width: 42, height: 42, borderRadius: "50%", border: `1px solid ${ring}`, background: isDark ? "rgba(255,255,255,.04)" : "rgba(0,0,0,.03)", color: fg, cursor: disabled ? "default" : "pointer", opacity: disabled ? 0.3 : 1, display: "grid", placeItems: "center", fontSize: 16, lineHeight: 1, backdropFilter: "blur(6px)", transition: "opacity .25s, border-color .25s" }}
              onMouseEnter={(e) => { if (!disabled) e.currentTarget.style.borderColor = LAV }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = ring }}>
              {label as string}
            </button>
          )
        })}
      </div>
    </>
  )
}

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
  const fg = isDark ? "#fff" : "#000"
  const muted = isDark ? "rgba(255,255,255,.72)" : "rgba(0,0,0,.68)"
  // scroll-snap tipo "deck" SÓLO mientras Manifesto está montado: va en el <html>
  // (el elemento que hace scroll) y se restaura al salir, sin afectar otras páginas.
  // 'proximity' (no 'mandatory') para no atrapar el scroll: engancha cada escena
  // pero deja recorrer libremente las que tienen más contenido o en móvil.
  useEffect(() => {
    const html = document.documentElement
    const prev = html.style.scrollSnapType
    html.style.scrollSnapType = "y proximity"
    return () => { html.style.scrollSnapType = prev }
  }, [])

  const menuItems = [
    { label: "Servicios", bgColor: isDark ? "#111111" : "#f0ece4", textColor: isDark ? "#fff" : "#000",
      links: [{ label: "Desarrollo Web", href: "/lab", ariaLabel: "Lab" }, { label: "Automation · n8n", href: "/automation", ariaLabel: "Automation" }] },
    { label: "Proyectos", bgColor: isDark ? "#1a1a1a" : "#e8e4dc", textColor: isDark ? "#fff" : "#000",
      links: [{ label: "Archive", href: "/archive", ariaLabel: "Archive" }, { label: "Visual Editorial", href: "/visual", ariaLabel: "Visual" }] },
    { label: "Contacto", bgColor: isDark ? "#dde4e6" : "#1a1a1a", textColor: isDark ? "#000" : "#fff",
      links: [{ label: "WhatsApp", href: WA_URL, ariaLabel: "WhatsApp" }, { label: "Email", href: "mailto:aprada.web@gmail.com", ariaLabel: "Email" }] },
  ]

  const eyebrow = (text: string, color?: string) => (
    <motion.div variants={rise} style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 26 }}>
      <div style={{ width: 22, height: .5, background: color || (isDark ? "rgba(255,255,255,.45)" : "rgba(0,0,0,.35)") }} />
      <span style={{ fontFamily: "monospace", fontSize: 10, letterSpacing: ".3em", textTransform: "uppercase", color: color || muted }}>{text}</span>
    </motion.div>
  )

  return (
    <div style={{ minHeight: "100svh", overflowX: "clip", background: pageBg, color: fg, position: "relative" }}>
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
      <DeckNav isDark={isDark} isDesktop={isDesktop} />

      <div style={{ position: "relative", zIndex: 50 }}>
        <CardNav logo="/faviconAP.ico" items={menuItems}
          baseColor={isDark ? "rgba(6,6,6,.95)" : "rgba(245,241,233,.95)"}
          menuColor={isDark ? "#fff" : "#000"} buttonBgColor={isDark ? "#dde4e6" : "#000"} buttonTextColor={isDark ? "#000" : "#fff"} />
      </div>

      {/* DECK: escenas a pantalla completa (el snap vive en <html>, ver arriba) */}
      <div>

        {/* INTRO */}
        <Scene id="intro" isDesktop={isDesktop}>
          {eyebrow("Section 02 · Manifiesto")}
          <div style={{ overflow: "hidden" }}>
            <motion.h1 variants={rise} style={{ fontSize: "clamp(3rem, 12vw, 9rem)", fontWeight: 900, textTransform: "uppercase", letterSpacing: "-.045em", lineHeight: .82, color: fg }}>Cómo</motion.h1>
          </div>
          <div style={{ overflow: "hidden", marginBottom: 30 }}>
            <motion.h1 variants={rise} style={{ fontSize: "clamp(3rem, 12vw, 9rem)", fontWeight: 900, textTransform: "uppercase", letterSpacing: "-.045em", lineHeight: .82, WebkitTextStroke: isDark ? "1.5px rgba(255,255,255,.28)" : "1.5px rgba(0,0,0,.22)", color: "transparent" }}>trabajo</motion.h1>
          </div>
          <motion.p variants={rise} style={{ fontSize: "clamp(15px, 2vw, 19px)", fontWeight: 300, lineHeight: 1.7, maxWidth: 620, color: isDark ? "#fff" : "#000" }}>
            Seis principios que filtran qué proyectos acepto y qué resultado entrego. Si los leés y te identificás, hablemos. Si te chocan, también está bien — no somos buen match.
          </motion.p>
          <motion.div variants={rise} style={{ marginTop: 40, display: "flex", alignItems: "center", gap: 10, color: muted }}>
            <motion.span animate={{ y: [0, 6, 0] }} transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }} style={{ fontSize: 18 }}>↓</motion.span>
            <span style={{ fontSize: 10, letterSpacing: ".3em", textTransform: "uppercase" }}>Scroll</span>
          </motion.div>
        </Scene>

        {/* PRINCIPIOS — una escena cada uno */}
        {principles.map((p) => (
          <Scene id={p.num} key={p.num} isDesktop={isDesktop}>
            <PrincipleIcon kind={p.num} />
            <motion.span variants={rise} aria-hidden="true" style={{ display: "block", fontFamily: "monospace", fontSize: "clamp(3rem, 9vw, 7rem)", fontWeight: 900, lineHeight: 1, letterSpacing: "-.04em", color: isDark ? "rgba(255,255,255,.07)" : "rgba(0,0,0,.06)", marginBottom: -12 }}>{p.num}</motion.span>
            <motion.h2 variants={rise} style={{ fontSize: "clamp(2.2rem, 7vw, 5rem)", fontWeight: 900, textTransform: "uppercase", letterSpacing: "-.04em", lineHeight: .9, color: fg, marginBottom: 18, maxWidth: 900 }}>{p.title}</motion.h2>
            <motion.p variants={rise} style={{ fontSize: "clamp(1.1rem, 2.6vw, 1.8rem)", fontStyle: "italic", fontWeight: 300, lineHeight: 1.3, color: isDark ? "rgba(255,255,255,.82)" : "rgba(0,0,0,.76)", marginBottom: 22, maxWidth: 560 }}>{p.lead}</motion.p>
            <motion.p variants={rise} style={{ fontSize: "clamp(14px, 1.6vw, 16px)", fontWeight: 300, lineHeight: 1.8, color: isDark ? "rgba(255,255,255,.88)" : "rgba(0,0,0,.82)", maxWidth: 580 }}>{p.body}</motion.p>
          </Scene>
        ))}

        {/* PULL QUOTE */}
        <Scene id="quote" isDesktop={isDesktop}>
          <motion.blockquote variants={rise} style={{ margin: 0, textAlign: "center", fontSize: "clamp(1.9rem, 6vw, 4.2rem)", fontWeight: 900, textTransform: "uppercase", letterSpacing: "-.035em", lineHeight: 1, color: fg }}>
            <span style={{ display: "block", marginBottom: 14 }}>“No busco más clientes.</span>
            <span style={{ display: "block", WebkitTextStroke: isDark ? "1.5px rgba(255,255,255,.24)" : "1.5px rgba(0,0,0,.20)", color: "transparent" }}>busco mejores conversaciones.”</span>
          </motion.blockquote>
        </Scene>

        {/* TRABAJO CON / NO TRABAJO CON */}
        <Scene id="match" isDesktop={isDesktop}>
          <div style={{ display: "grid", gridTemplateColumns: isDesktop ? "1fr 1fr" : "1fr", gap: isDesktop ? 56 : 36 }}>
            <div>
              {eyebrow("Trabajo con", isDark ? "#60a5fa" : "#2563eb")}
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 16 }}>
                {workWith.map((line, i) => (
                  <motion.li key={i} variants={rise} style={{ display: "flex", alignItems: "flex-start", gap: 14, fontSize: "clamp(14px, 1.7vw, 18px)", lineHeight: 1.5, color: isDark ? "rgba(255,255,255,.92)" : "rgba(0,0,0,.85)" }}>
                    <span style={{ display: "inline-block", width: 16, height: 16, flexShrink: 0, marginTop: 3, position: "relative" }}>
                      <span style={{ position: "absolute", inset: 0, border: isDark ? "1px solid rgba(96,165,250,.6)" : "1px solid rgba(37,99,235,.55)", borderRadius: 2 }} />
                      <span style={{ position: "absolute", inset: 4, background: isDark ? "rgba(96,165,250,.7)" : "rgba(37,99,235,.6)", borderRadius: 1 }} />
                    </span>
                    {line}
                  </motion.li>
                ))}
              </ul>
            </div>
            <div>
              {eyebrow("No trabajo con", isDark ? "#ef4444" : "#dc2626")}
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 16 }}>
                {dontWorkWith.map((line, i) => (
                  <motion.li key={i} variants={rise} style={{ display: "flex", alignItems: "flex-start", gap: 14, fontSize: "clamp(14px, 1.7vw, 18px)", lineHeight: 1.5, color: isDark ? "rgba(255,255,255,.78)" : "rgba(0,0,0,.72)", textDecoration: "line-through", textDecorationColor: isDark ? "rgba(239,68,68,.45)" : "rgba(220,38,38,.4)", textDecorationThickness: "1px" }}>
                    <span style={{ display: "inline-block", width: 16, height: 16, flexShrink: 0, marginTop: 3, position: "relative" }}>
                      <span style={{ position: "absolute", inset: 0, border: isDark ? "1px solid rgba(239,68,68,.50)" : "1px solid rgba(220,38,38,.40)", borderRadius: 2 }} />
                    </span>
                    {line}
                  </motion.li>
                ))}
              </ul>
            </div>
          </div>
        </Scene>

        {/* CTA FINAL */}
        <Scene id="cta" isDesktop={isDesktop}>
          <motion.div variants={rise}>
            {eyebrow("Si llegaste hasta acá")}
            <h2 style={{ fontSize: "clamp(2.8rem,8vw,5.5rem)", fontWeight: 900, textTransform: "uppercase", letterSpacing: "-.04em", lineHeight: .86, color: fg, marginBottom: 36 }}>
              Hablemos<br />
              <span style={{ WebkitTextStroke: isDark ? "1.5px rgba(255,255,255,.22)" : "1.5px rgba(0,0,0,.20)", color: "transparent" }}>en serio</span>
            </h2>
          </motion.div>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {[
              { label: "WhatsApp directo", href: WA_URL },
              { label: "Email", href: "mailto:aprada.web@gmail.com" },
              { label: "Ver proyectos", href: "/archive" },
              { label: "Portafolio visual", href: "/visual" },
            ].map(({ label, href }) => (
              <motion.a key={label} variants={rise} href={href} target={href.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer"
                whileHover={{ x: 4 }}
                style={{ display: "flex", alignItems: "center", gap: 16, textDecoration: "none", fontSize: 13, textTransform: "uppercase", letterSpacing: ".2em", color: fg }}>
                <span style={{ display: "inline-block", width: 20, height: .5, background: isDark ? "rgba(255,255,255,.4)" : "rgba(0,0,0,.35)" }} />
                {label}
              </motion.a>
            ))}
          </div>
          <motion.div variants={rise} style={{ marginTop: 56, display: "flex", gap: 18, flexWrap: "wrap", fontSize: 9, letterSpacing: ".4em", textTransform: "uppercase", color: muted }}>
            <span>Andres Prada</span><span style={{ fontFamily: "monospace", letterSpacing: 0 }}>© 2026 · Manifiesto v2</span><span>Bogotá, CO</span>
          </motion.div>
        </Scene>

      </div>
    </div>
  )
}
