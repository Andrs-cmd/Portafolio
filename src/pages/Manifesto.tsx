import { motion, useScroll, useTransform, type Variants } from "framer-motion"
import { useState, useEffect, type ReactNode } from "react"
import { createPortal } from "react-dom"
import { useTheme } from "../context/ThemeContext"
import LiquidEther from "../components/OptionalLiquidEther"
import CardNav from "../components/CardNav"
import "../components/CardNav.css"
import SculptureMascot from "../components/SculptureMascot"
import { WhatsAppFAB } from "../components/WhatsAppCTA"
import { useSEO } from "../lib/useSEO"

const LIQUID_DARK = ["#0a0014", "#7b00cc", "#c026d3", "#60a5fa", "#ffffff"]
const LIQUID_LIGHT = ["#f4f1f1", "#747272", "#000000"]
const LAV = "#c3c4f2"

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
  return <motion.div style={{ position: "fixed", top: 0, left: 0, height: 1.5, zIndex: 300, pointerEvents: "none", width, background: isDark ? "rgba(255,255,255,.3)" : "rgba(0,0,0,.25)" }} />
}

/* ──────────────────────────────────────────────────────────
   CONTENIDO DEL DECK — organizado como bigotes:
   título gigante detrás del gato, chip, captions a los lados, CTA abajo.
   ────────────────────────────────────────────────────────── */
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

type Scene = {
  key: string
  label: string
  giant: string
  chip: string
  kind?: "cap" | "quote" | "match" | "cta"
  capL?: string
  capR?: string
  quote?: [string, string]
}
const DECK: Scene[] = [
  { key: "intro", label: "Intro", giant: "CÓMO", chip: "Manifiesto · 02",
    capL: "Seis principios que filtran qué proyectos acepto.", capR: "Si te identificás, hablemos. Si te chocan, también está bien — no somos buen match." },
  { key: "01", label: "01 · Diseño", giant: "DISEÑO", chip: "01 · Diseño es decisión",
    capL: "No es decoración. Es elegir qué dejar afuera.", capR: "Cada elemento justifica su lugar o se va. Cuando todo grita, nada se escucha." },
  { key: "02", label: "02 · Código", giant: "CÓDIGO", chip: "02 · El código es el medio",
    capL: "No el fin.", capR: "Los frameworks cambian cada seis meses. Lo que perdura es que la persona entienda, confíe y avance." },
  { key: "03", label: "03 · Criterio", giant: "CRITERIO", chip: "03 · Criterio sobre tendencia",
    capL: "Tendencia caduca. Criterio no.", capR: "Construyo cosas que envejezcan bien. Tipografía, contraste, ritmo y silencio llevan décadas funcionando." },
  { key: "04", label: "04 · Tiempo", giant: "TIEMPO", chip: "04 · Lo lento se hace bien",
    capL: "Velocidad es resultado, no método.", capR: "Prefiero dos semanas pensando que dos meses arreglando. Con claridad de propósito, lo bueno también sale rápido." },
  { key: "05", label: "05 · Marca", giant: "MARCA", chip: "05 · Marca es proceso",
    capL: "Lo que hacés cuando nadie mira.", capR: "No son los colores ni el logo: es la coherencia entre lo que prometés, lo que entregás y cómo respondés cuando algo falla." },
  { key: "06", label: "06 · LATAM", giant: "LATAM", chip: "06 · LATAM con criterio",
    capL: "Local sí, pero sin perder altura.", capR: "Desde Bogotá, en castellano y pensando en pesos — con un nivel de diseño que compite globalmente." },
  { key: "quote", label: "Cita", giant: "CITA", chip: "Entre líneas", kind: "quote",
    quote: ["“No busco más clientes.", "busco mejores conversaciones.”"] },
  { key: "match", label: "Con quién", giant: "MATCH", chip: "Con quién trabajo", kind: "match" },
  { key: "cta", label: "Contacto", giant: "HABLEMOS", chip: "Si llegaste hasta acá", kind: "cta" },
]
const SCENES = DECK.map(d => d.key)
// acento por escena (coincide con SculptureMascot): tiñe chip y título gigante
const ACCENTS = ["#c3c4f2", "#8fb7ff", "#7fe3c0", "#c3c4f2", "#f2c28f", "#e79ad0", "#7fe3c0", "#c3c4f2", "#8fb7ff", "#c3c4f2"]

const container: Variants = { hidden: {}, show: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } } }
const rise: Variants = { hidden: { opacity: 0, y: 22 }, show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } } }

/* escena activa según el scroll (compartida por el gato y la navegación) */
function useActiveScene() {
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
  return active
}

/* Navegación: puntos (derecha), crumb vertical (izq) y flechas circulares */
function DeckNav({ isDark, isDesktop, active }: { isDark: boolean; isDesktop: boolean; active: number }) {
  const go = (i: number) => {
    const j = Math.min(SCENES.length - 1, Math.max(0, i))
    document.getElementById(`scene-${SCENES[j]}`)?.scrollIntoView({ behavior: "smooth" })
  }
  const dot = isDark ? "rgba(255,255,255,.28)" : "rgba(0,0,0,.26)"
  const fg = isDark ? "#eef0f3" : "#141211"
  const ring = isDark ? "rgba(255,255,255,.22)" : "rgba(0,0,0,.20)"

  return (
    <>
      <div style={{ position: "fixed", right: "clamp(12px,1.6vw,22px)", top: "50%", transform: "translateY(-50%)", zIndex: 90, display: "flex", flexDirection: "column", gap: 11, alignItems: "center" }}>
        {DECK.map((s, i) => (
          <button key={s.key} onClick={() => go(i)} aria-label={`Ir a ${s.label}`} style={{ width: 10, height: 10, padding: 0, border: "none", background: "transparent", cursor: "pointer", display: "grid", placeItems: "center" }}>
            <span style={{ display: "block", width: active === i ? 9 : 6, height: active === i ? 9 : 6, borderRadius: "50%", background: active === i ? LAV : dot, transition: "all .3s ease" }} />
          </button>
        ))}
      </div>

      {isDesktop && (
        <div style={{ position: "fixed", left: "clamp(14px,2vw,30px)", top: "50%", transform: "translateY(-50%) rotate(180deg)", writingMode: "vertical-rl", zIndex: 90, display: "flex", alignItems: "center", gap: 14, pointerEvents: "none" }}>
          <span style={{ fontFamily: "monospace", fontSize: 10, letterSpacing: ".3em", textTransform: "uppercase", color: LAV }}>{DECK[active].label}</span>
          <span style={{ width: 40, height: .5, background: ring }} />
          <span style={{ fontFamily: "monospace", fontSize: 10, letterSpacing: ".2em", color: isDark ? "rgba(255,255,255,.5)" : "rgba(0,0,0,.45)" }}>{String(active + 1).padStart(2, "0")} / {String(SCENES.length).padStart(2, "0")}</span>
        </div>
      )}

      <div style={{ position: "fixed", left: "clamp(16px,3vw,40px)", bottom: "clamp(24px,5vh,48px)", zIndex: 90, display: "flex", gap: 10 }}>
        {[["↑", active - 1], ["↓", active + 1]].map(([label, target], k) => {
          const disabled = k === 0 ? active === 0 : active === SCENES.length - 1
          return (
            <button key={k} onClick={() => go(target as number)} aria-label={k === 0 ? "Escena anterior" : "Escena siguiente"} disabled={disabled}
              style={{ width: 42, height: 42, borderRadius: "50%", border: `1px solid ${ring}`, background: isDark ? "rgba(255,255,255,.04)" : "rgba(0,0,0,.03)", color: fg, cursor: disabled ? "default" : "pointer", opacity: disabled ? 0.3 : 1, display: "grid", placeItems: "center", fontSize: 16, lineHeight: 1, backdropFilter: "blur(6px)" }}>
              {label as string}
            </button>
          )
        })}
      </div>
    </>
  )
}

/* una escena del deck, con el layout de bigotes */
function BigScene({ s, i, isDesktop, isDark }: { s: Scene; i: number; isDesktop: boolean; isDark: boolean }) {
  const fg = isDark ? "#eef0f3" : "#141211"
  const muted = isDark ? "rgba(240,240,245,.72)" : "rgba(20,20,20,.66)"
  const chipBorder = isDark ? "rgba(255,255,255,.18)" : "rgba(0,0,0,.16)"
  const accent = ACCENTS[i] ?? LAV

  const Chip = (
    <motion.div variants={rise} style={{ display: "inline-flex", alignItems: "center", gap: 9, padding: "7px 14px", borderRadius: 999, border: `1px solid ${chipBorder}`, background: isDark ? "rgba(255,255,255,.04)" : "rgba(0,0,0,.03)", backdropFilter: "blur(6px)", fontSize: 11, letterSpacing: ".04em", color: fg, whiteSpace: "nowrap" }}>
      <span style={{ width: 7, height: 7, borderRadius: "50%", background: accent, boxShadow: `0 0 10px ${accent}` }} />
      {s.chip}
    </motion.div>
  )

  // texto frontal (z20) — distinto por tipo de escena
  let front: ReactNode
  if (s.kind === "quote") {
    front = (
      <div style={{ display: "flex", flexDirection: "column", justifyContent: isDesktop ? "space-between" : "flex-start", gap: isDesktop ? 0 : 26, height: isDesktop ? "100%" : "auto", alignItems: "center", textAlign: "center" }}>
        <div>{Chip}</div>
        <motion.blockquote variants={rise} style={{ margin: 0, fontSize: "clamp(1.5rem, 4.6vw, 3.2rem)", fontWeight: 900, textTransform: "uppercase", letterSpacing: "-.035em", lineHeight: 1.05, color: fg, maxWidth: 820 }}>
          <span style={{ display: "block", marginBottom: 10 }}>{s.quote?.[0]}</span>
          <span style={{ display: "block", color: LAV }}>{s.quote?.[1]}</span>
        </motion.blockquote>
        {isDesktop && <span />}
      </div>
    )
  } else if (s.kind === "match") {
    const List = ({ title, items, color }: { title: string; items: string[]; color: string }) => (
      <div style={{ maxWidth: 300 }}>
        <motion.div variants={rise} style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 16 }}>
          <span style={{ width: 16, height: .5, background: color }} />
          <span style={{ fontFamily: "monospace", fontSize: 10, letterSpacing: ".25em", textTransform: "uppercase", color }}>{title}</span>
        </motion.div>
        <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: 12 }}>
          {items.map((l, i) => (
            <motion.li key={i} variants={rise} style={{ fontSize: "clamp(13px,1.4vw,15px)", lineHeight: 1.5, color: muted }}>{l}</motion.li>
          ))}
        </ul>
      </div>
    )
    front = (
      <div style={{ display: "flex", flexDirection: "column", justifyContent: isDesktop ? "space-between" : "flex-start", gap: isDesktop ? 0 : 26, height: isDesktop ? "100%" : "auto" }}>
        <div>{Chip}</div>
        <div style={{ display: "flex", flexDirection: isDesktop ? "row" : "column", justifyContent: "space-between", gap: isDesktop ? 24 : 24, alignItems: isDesktop ? "flex-end" : "flex-start" }}>
          <List title="Trabajo con" items={workWith} color={isDark ? "#60a5fa" : "#2563eb"} />
          <List title="No trabajo con" items={dontWorkWith} color={isDark ? "#ef4444" : "#dc2626"} />
        </div>
      </div>
    )
  } else if (s.kind === "cta") {
    front = (
      <div style={{ display: "flex", flexDirection: "column", justifyContent: isDesktop ? "space-between" : "flex-start", gap: isDesktop ? 0 : 26, height: isDesktop ? "100%" : "auto" }}>
        <div>{Chip}</div>
        <div style={{ display: "flex", flexDirection: isDesktop ? "row" : "column", justifyContent: "space-between", alignItems: isDesktop ? "flex-end" : "flex-start", gap: 24, pointerEvents: "auto" }}>
          <motion.a variants={rise} href={WA_URL} target="_blank" rel="noopener noreferrer"
            style={{ display: "inline-flex", alignItems: "center", gap: 10, padding: "14px 26px", borderRadius: 999, background: LAV, color: "#141211", fontWeight: 700, fontSize: 13, letterSpacing: ".04em", textDecoration: "none" }}>
            Hablemos por WhatsApp →
          </motion.a>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {[{ l: "Email", h: "mailto:aprada.web@gmail.com" }, { l: "Ver proyectos", h: "/archive" }, { l: "Portafolio visual", h: "/visual" }].map(({ l, h }) => (
              <motion.a key={l} variants={rise} href={h} target={h.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer" whileHover={{ x: 4 }}
                style={{ display: "flex", alignItems: "center", gap: 14, textDecoration: "none", fontSize: 12, textTransform: "uppercase", letterSpacing: ".2em", color: fg }}>
                <span style={{ width: 18, height: .5, background: isDark ? "rgba(255,255,255,.4)" : "rgba(0,0,0,.35)" }} />{l}
              </motion.a>
            ))}
          </div>
        </div>
      </div>
    )
  } else {
    // caption: chip arriba, capL (izq) y capR (der) flanqueando al gato
    front = (
      <div style={{ display: "flex", flexDirection: "column", justifyContent: isDesktop ? "space-between" : "flex-start", gap: isDesktop ? 0 : 26, height: isDesktop ? "100%" : "auto" }}>
        <div>{Chip}</div>
        <div style={{ display: "flex", flexDirection: isDesktop ? "row" : "column", justifyContent: "space-between", alignItems: isDesktop ? "flex-end" : "flex-start", gap: isDesktop ? 24 : 16 }}>
          <motion.p variants={rise} style={{ margin: 0, maxWidth: 280, fontSize: "clamp(1.1rem,2.2vw,1.7rem)", fontStyle: "italic", fontWeight: 300, lineHeight: 1.3, color: fg }}>{s.capL}</motion.p>
          <motion.p variants={rise} style={{ margin: 0, maxWidth: 320, fontSize: "clamp(13px,1.4vw,15px)", fontWeight: 300, lineHeight: 1.75, color: muted, textAlign: isDesktop ? "right" : "left" }}>{s.capR}</motion.p>
        </div>
      </div>
    )
  }

  return (
    <section id={`scene-${s.key}`} data-scene={s.key} aria-label={s.label}
      style={{ position: "relative", minHeight: "100svh", scrollSnapAlign: "start", scrollSnapStop: "always", display: "flex", pointerEvents: "none" }}>
      {/* título gigante DETRÁS del gato */}
      <div style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center", zIndex: 12, overflow: "hidden", pointerEvents: "none" }}>
        <motion.span
          initial={{ opacity: 0, scale: 1.04 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ amount: 0.5 }} transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          style={{ fontSize: "clamp(4rem, 24vw, 22rem)", fontWeight: 900, textTransform: "uppercase", letterSpacing: "-.05em", lineHeight: 1, whiteSpace: "nowrap", color: isDark ? `${accent}1c` : `${accent}16` }}>
          {s.giant}
        </motion.span>
      </div>
      {/* texto frontal (z20), por delante del gato */}
      <motion.div variants={container} initial="hidden" whileInView="show" viewport={{ amount: 0.5 }}
        style={{ position: "relative", zIndex: 20, width: "100%", maxWidth: 1280, margin: "0 auto",
          padding: isDesktop ? "104px clamp(40px,6vw,80px) clamp(40px,8vh,88px)" : "38svh 20px 12svh",
          display: "flex", flexDirection: "column", pointerEvents: "none" }}>
        {front}
      </motion.div>
    </section>
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
  const active = useActiveScene()
  const pageBg = isDark ? "#060606" : "#f5f1e9"
  const fg = isDark ? "#fff" : "#000"

  // scroll-snap tipo "deck" SÓLO mientras Manifesto está montado (en el <html>).
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

  return (
    <div style={{ minHeight: "100svh", overflowX: "clip", background: pageBg, color: fg, position: "relative" }}>
      <div style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none" }}>
        <LiquidEther mouseForce={18} cursorSize={120} resolution={0.7} dt={0.016} viscous={15} isViscous={false} autoIntensity={isDark ? 2 : 1} colors={isDark ? LIQUID_DARK : LIQUID_LIGHT} />
        <div style={{ position: "absolute", inset: 0, zIndex: 1, pointerEvents: "none", background: isDark ? "rgba(0,0,0,.90)" : "rgba(245,241,233,.90)" }} />
      </div>

      <ScrollBar />
      <ThemeToggle />
      <WhatsAppFAB />
      <DeckNav isDark={isDark} isDesktop={isDesktop} active={active} />

      {/* Escultura 3D persistente CENTRADA: cambia de forma/acento con cada escena.
          Queda entre el título gigante (detrás) y el texto frontal. */}
      <SculptureMascot
        sceneIndex={active}
        style={{
          position: "fixed", zIndex: 15, pointerEvents: isDesktop ? "auto" : "none",
          left: "50%", transform: "translateX(-50%)",
          top: isDesktop ? 0 : 58,
          width: isDesktop ? "min(620px, 54vw)" : "92%",
          height: isDesktop ? "100svh" : "34svh",
        }}
      />

      <div style={{ position: "relative", zIndex: 50 }}>
        <CardNav logo="/faviconAP.ico" items={menuItems}
          baseColor={isDark ? "rgba(6,6,6,.95)" : "rgba(245,241,233,.95)"}
          menuColor={isDark ? "#fff" : "#000"} buttonBgColor={isDark ? "#dde4e6" : "#000"} buttonTextColor={isDark ? "#000" : "#fff"} />
      </div>

      <div>
        {DECK.map((s, i) => <BigScene key={s.key} s={s} i={i} isDesktop={isDesktop} isDark={isDark} />)}
      </div>
    </div>
  )
}
