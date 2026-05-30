import { motion, useScroll, useTransform } from "framer-motion"
import { useState, useEffect, type FormEvent } from "react"
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
const EMAIL = "aprada.web@gmail.com"

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
   FORM
   ────────────────────────────────────────────────────────── */
const services = [
  "Desarrollo Web",
  "E-commerce / Tienda online",
  "Automation · n8n + IA",
  "Fotografía editorial",
  "Motion graphics",
  "Identidad / dirección de arte",
  "Otro",
]

const budgets = [
  "Menos de USD 500",
  "USD 500 — 2.000",
  "USD 2.000 — 5.000",
  "USD 5.000 — 10.000",
  "Más de USD 10.000",
  "No estoy seguro todavía",
]

function ContactForm({ isDark, isDesktop }: { isDark: boolean; isDesktop: boolean }) {
  const [form, setForm] = useState({
    nombre: "",
    empresa: "",
    email: "",
    servicio: services[0],
    presupuesto: budgets[0],
    mensaje: "",
  })
  const [touched, setTouched] = useState<Record<string, boolean>>({})
  const [sent, setSent] = useState(false)

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm(prev => ({ ...prev, [k]: e.target.value }))
  const blur = (k: string) => () => setTouched(t => ({ ...t, [k]: true }))

  const errors = {
    nombre: !form.nombre.trim() ? "Nombre requerido" : "",
    email: !form.email.trim()
      ? "Email requerido"
      : !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())
        ? "Email inválido"
        : "",
    mensaje: form.mensaje.trim().length < 20 ? "Contame al menos un par de líneas (20 caracteres)" : "",
  }
  const hasErrors = Object.values(errors).some(Boolean)

  const onSubmit = (e: FormEvent) => {
    e.preventDefault()
    setTouched({ nombre: true, email: true, mensaje: true })
    if (hasErrors) return

    const lines = [
      `Hola Andres! Soy ${form.nombre}${form.empresa ? ` de ${form.empresa}` : ""}.`,
      ``,
      `Email: ${form.email}`,
      `Servicio: ${form.servicio}`,
      `Presupuesto: ${form.presupuesto}`,
      ``,
      form.mensaje.trim(),
    ]
    const text = encodeURIComponent(lines.join("\n"))
    const url = `https://wa.me/${WA_NUMBER}?text=${text}`
    window.open(url, "_blank", "noopener,noreferrer")
    setSent(true)
  }

  // Styles
  const labelStyle: React.CSSProperties = {
    fontFamily: "monospace",
    fontSize: 10,
    letterSpacing: ".22em",
    textTransform: "uppercase",
    color: isDark ? "rgba(255,255,255,.65)" : "rgba(0,0,0,.60)",
    display: "block",
    marginBottom: 8,
  }
  const inputStyle: React.CSSProperties = {
    width: "100%",
    background: "transparent",
    border: "none",
    borderBottom: isDark ? "1px solid rgba(255,255,255,.20)" : "1px solid rgba(0,0,0,.20)",
    padding: "10px 0",
    fontSize: 15,
    color: isDark ? "#fff" : "#000",
    outline: "none",
    fontFamily: "inherit",
  }
  const selectStyle: React.CSSProperties = {
    ...inputStyle,
    appearance: "none",
    backgroundImage: `url("data:image/svg+xml,%3Csvg width='12' height='8' viewBox='0 0 12 8' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1.5L6 6.5L11 1.5' stroke='${isDark ? "%23ffffff80" : "%2300000080"}' stroke-width='1.2' fill='none'/%3E%3C/svg%3E")`,
    backgroundRepeat: "no-repeat",
    backgroundPosition: "right 4px center",
    paddingRight: 24,
  }
  const errorStyle: React.CSSProperties = {
    fontFamily: "monospace",
    fontSize: 10,
    letterSpacing: ".15em",
    color: isDark ? "#ef4444" : "#dc2626",
    marginTop: 6,
    display: "block",
  }

  if (sent) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .5 }}
        style={{
          border: isDark ? "1px solid rgba(34,197,94,.40)" : "1px solid rgba(22,163,74,.40)",
          padding: isDesktop ? "40px" : "28px",
          background: isDark ? "rgba(34,197,94,.05)" : "rgba(22,163,74,.04)",
        }}
      >
        <span style={{ fontFamily: "monospace", fontSize: 10, letterSpacing: ".25em", textTransform: "uppercase", color: isDark ? "#22c55e" : "#16a34a", marginBottom: 16, display: "block" }}>
          Mensaje enviado
        </span>
        <h3 style={{ fontSize: "clamp(1.4rem, 3vw, 2rem)", fontWeight: 900, textTransform: "uppercase", letterSpacing: "-.03em", lineHeight: .95, marginBottom: 14, color: isDark ? "#fff" : "#000" }}>
          Abrí WhatsApp en otra pestaña
        </h3>
        <p style={{ fontSize: 14, lineHeight: 1.7, color: isDark ? "rgba(255,255,255,.85)" : "rgba(0,0,0,.80)", marginBottom: 20, maxWidth: 420 }}>
          Si no se abrió automáticamente, click en el botón. Te respondo en menos de 4 horas en horario laboral.
        </p>
        <a
          href={`https://wa.me/${WA_NUMBER}`}
          target="_blank"
          rel="noopener noreferrer"
          style={{ display: "inline-flex", alignItems: "center", gap: 10, padding: "12px 18px", background: isDark ? "#fff" : "#000", color: isDark ? "#000" : "#fff", fontSize: 11, letterSpacing: ".22em", textTransform: "uppercase", textDecoration: "none", fontWeight: 600 }}
        >
          Abrir WhatsApp →
        </a>
        <button
          onClick={() => { setSent(false); setForm({ nombre: "", empresa: "", email: "", servicio: services[0], presupuesto: budgets[0], mensaje: "" }); setTouched({}) }}
          style={{ marginLeft: 18, background: "transparent", border: "none", color: isDark ? "rgba(255,255,255,.55)" : "rgba(0,0,0,.55)", fontSize: 11, letterSpacing: ".22em", textTransform: "uppercase", cursor: "pointer" }}
        >
          Enviar otro
        </button>
      </motion.div>
    )
  }

  return (
    <form onSubmit={onSubmit} style={{ display: "flex", flexDirection: "column", gap: 28 }}>
      <div style={{ display: "grid", gridTemplateColumns: isDesktop ? "1fr 1fr" : "1fr", gap: 24 }}>
        <div>
          <label style={labelStyle}>Nombre *</label>
          <input
            type="text"
            value={form.nombre}
            onChange={set("nombre")}
            onBlur={blur("nombre")}
            style={inputStyle}
            placeholder="Tu nombre"
            autoComplete="name"
          />
          {touched.nombre && errors.nombre && <span style={errorStyle}>{errors.nombre}</span>}
        </div>
        <div>
          <label style={labelStyle}>Empresa <span style={{ opacity: .5 }}>(opcional)</span></label>
          <input
            type="text"
            value={form.empresa}
            onChange={set("empresa")}
            style={inputStyle}
            placeholder="Tu marca o proyecto"
            autoComplete="organization"
          />
        </div>
      </div>

      <div>
        <label style={labelStyle}>Email *</label>
        <input
          type="email"
          value={form.email}
          onChange={set("email")}
          onBlur={blur("email")}
          style={inputStyle}
          placeholder="tu@email.com"
          autoComplete="email"
        />
        {touched.email && errors.email && <span style={errorStyle}>{errors.email}</span>}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: isDesktop ? "1fr 1fr" : "1fr", gap: 24 }}>
        <div>
          <label style={labelStyle}>Servicio</label>
          <select value={form.servicio} onChange={set("servicio")} style={selectStyle}>
            {services.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div>
          <label style={labelStyle}>Presupuesto</label>
          <select value={form.presupuesto} onChange={set("presupuesto")} style={selectStyle}>
            {budgets.map(b => <option key={b} value={b}>{b}</option>)}
          </select>
        </div>
      </div>

      <div>
        <label style={labelStyle}>Cuéntame del proyecto *</label>
        <textarea
          value={form.mensaje}
          onChange={set("mensaje")}
          onBlur={blur("mensaje")}
          rows={5}
          style={{ ...inputStyle, resize: "vertical", borderBottom: "none", border: isDark ? "1px solid rgba(255,255,255,.20)" : "1px solid rgba(0,0,0,.20)", padding: 14 }}
          placeholder="Qué necesitas, plazos, referencias, contexto. Mientras más concreto, mejor te puedo ayudar."
        />
        {touched.mensaje && errors.mensaje && <span style={errorStyle}>{errors.mensaje}</span>}
        <span style={{ fontFamily: "monospace", fontSize: 10, letterSpacing: ".15em", color: isDark ? "rgba(255,255,255,.40)" : "rgba(0,0,0,.45)", marginTop: 6, display: "block" }}>
          {form.mensaje.length} caracteres
        </span>
      </div>

      <motion.button
        type="submit"
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
        style={{
          marginTop: 8,
          padding: "16px 28px",
          background: isDark ? "#fff" : "#000",
          color: isDark ? "#000" : "#fff",
          border: "none",
          fontSize: 12,
          letterSpacing: ".22em",
          textTransform: "uppercase",
          fontWeight: 600,
          cursor: "pointer",
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 12,
        }}
      >
        Enviar por WhatsApp
        <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 22, height: 22, borderRadius: "50%", border: `1px solid ${isDark ? "rgba(0,0,0,.30)" : "rgba(255,255,255,.30)"}`, fontSize: 12 }}>→</span>
      </motion.button>

      <p style={{ fontSize: 11, lineHeight: 1.55, color: isDark ? "rgba(255,255,255,.55)" : "rgba(0,0,0,.55)", maxWidth: 460 }}>
        Al enviar abre WhatsApp con tu mensaje ya escrito. No guardo tus datos en ningún lado.
      </p>
    </form>
  )
}

/* ──────────────────────────────────────────────────────────
   DIRECT METHODS
   ────────────────────────────────────────────────────────── */
function DirectMethods({ isDark, isDesktop }: { isDark: boolean; isDesktop: boolean }) {
  const methods = [
    { label: "WhatsApp", value: "+57 319 576 8097", href: `https://wa.me/${WA_NUMBER}`, hint: "Lo más rápido", target: "_blank" },
    { label: "Email", value: EMAIL, href: `mailto:${EMAIL}`, hint: "Para briefs más largos", target: undefined },
    { label: "Instagram", value: "@andresprada", href: "https://instagram.com/", hint: "DM si querés ver más obra", target: "_blank" },
  ]

  return (
    <div style={{ display: "grid", gridTemplateColumns: isDesktop ? "repeat(3, 1fr)" : "1fr", gap: 0, borderTop: isDark ? "0.5px solid rgba(255,255,255,.10)" : "0.5px solid rgba(0,0,0,.10)" }}>
      {methods.map((m, i) => (
        <motion.a
          key={m.label}
          href={m.href}
          target={m.target}
          rel={m.target ? "noopener noreferrer" : undefined}
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: .5, delay: i * .08 }}
          whileHover={{ y: -3 }}
          style={{
            display: "block",
            textDecoration: "none",
            color: isDark ? "#fff" : "#000",
            padding: isDesktop ? "32px 28px" : "24px 0",
            borderBottom: isDark ? "0.5px solid rgba(255,255,255,.10)" : "0.5px solid rgba(0,0,0,.10)",
            borderRight: isDesktop && i < methods.length - 1 ? (isDark ? "0.5px solid rgba(255,255,255,.10)" : "0.5px solid rgba(0,0,0,.10)") : "none",
          }}
        >
          <span style={{ fontFamily: "monospace", fontSize: 10, letterSpacing: ".25em", textTransform: "uppercase", color: isDark ? "rgba(255,255,255,.65)" : "rgba(0,0,0,.60)", marginBottom: 12, display: "block" }}>
            {m.label}
          </span>
          <h3 style={{ fontSize: "clamp(1.2rem, 2.5vw, 1.6rem)", fontWeight: 900, letterSpacing: "-.02em", lineHeight: 1.05, marginBottom: 10, color: isDark ? "#fff" : "#000" }}>
            {m.value}
          </h3>
          <span style={{ fontSize: 11, lineHeight: 1.5, color: isDark ? "rgba(255,255,255,.55)" : "rgba(0,0,0,.55)" }}>
            {m.hint}
          </span>
        </motion.a>
      ))}
    </div>
  )
}

/* ──────────────────────────────────────────────────────────
   FAQ
   ────────────────────────────────────────────────────────── */
const faqs = [
  { q: "¿Cuánto tarda un proyecto típico?", a: "Una landing pulida: 1-2 semanas. Un sitio mediano: 3-6 semanas. Ecommerce: 6-10 semanas. Automation con n8n: 1-3 semanas. Si tu plazo es más corto, hablemos y vemos qué se puede hacer." },
  { q: "¿Trabajás solo o con equipo?", a: "Solo, pero con red. Yo me encargo del diseño y código. Si el proyecto pide motion grande o ilustración específica, sumo gente puntual de mi círculo de confianza." },
  { q: "¿Atendés clientes fuera de Colombia?", a: "Sí, trabajo con marcas en LATAM (Colombia, México, Argentina, Chile) y USA. Cobro en USD y respondo en inglés o español." },
  { q: "¿Cómo cobrás?", a: "50% al arrancar, 50% al entregar. Transferencia local, Wise o crypto. Para proyectos largos partimos en milestones." },
  { q: "¿Aceptás revisiones ilimitadas?", a: "No. Cada fase tiene un set de revisiones acotado (usualmente 2 por entrega). Lo aclaramos en la propuesta. Esto evita el ciclo infinito que no le sirve a nadie." },
]

function FAQItem({ q, a, isDark, idx }: { q: string; a: string; isDark: boolean; idx: number }) {
  const [open, setOpen] = useState(false)
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: .5, delay: idx * .05 }}
      style={{ borderBottom: isDark ? "0.5px solid rgba(255,255,255,.10)" : "0.5px solid rgba(0,0,0,.10)" }}
    >
      <button
        onClick={() => setOpen(o => !o)}
        style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, padding: "22px 0", background: "transparent", border: "none", textAlign: "left", cursor: "pointer", color: isDark ? "#fff" : "#000" }}
      >
        <span style={{ fontSize: "clamp(15px, 2vw, 18px)", fontWeight: 600, letterSpacing: "-.01em" }}>{q}</span>
        <motion.span animate={{ rotate: open ? 45 : 0 }} transition={{ duration: .2 }} style={{ display: "inline-block", fontSize: 22, lineHeight: 1, color: isDark ? "rgba(255,255,255,.70)" : "rgba(0,0,0,.65)" }}>
          +
        </motion.span>
      </button>
      <motion.div
        initial={false}
        animate={{ height: open ? "auto" : 0, opacity: open ? 1 : 0 }}
        transition={{ duration: .35, ease: [.16, 1, .3, 1] }}
        style={{ overflow: "hidden" }}
      >
        <p style={{ paddingBottom: 22, fontSize: 14, lineHeight: 1.75, fontWeight: 300, color: isDark ? "rgba(255,255,255,.85)" : "rgba(0,0,0,.80)", maxWidth: 640 }}>
          {a}
        </p>
      </motion.div>
    </motion.div>
  )
}

/* ──────────────────────────────────────────────────────────
   MAIN
   ────────────────────────────────────────────────────────── */
export default function Contact() {
  useSEO({
    title: "Contacto · Hablemos de tu proyecto",
    description: "WhatsApp, email o formulario directo. Respondo en menos de 4 horas en horario laboral. Atiendo LATAM y USA desde Bogotá.",
    path: "/contact",
    keywords: "contacto andres prada, hablar con diseñador, contratar desarrollador colombia, cotización proyecto web",
  })
  const { isDark } = useTheme()
  const isDesktop = useIsDesktop()
  const pageBg = isDark ? "#060606" : "#f5f1e9"
  const borderC = isDark ? "0.5px solid rgba(255,255,255,0.08)" : "0.5px solid rgba(0,0,0,0.08)"
  const WA_URL = `https://wa.me/${WA_NUMBER}`

  const menuItems = [
    { label: "Servicios", bgColor: isDark ? "#111111" : "#f0ece4", textColor: isDark ? "#fff" : "#000",
      links: [{ label: "Lab / Servicios", href: "/lab", ariaLabel: "Lab" }, { label: "Automation · n8n", href: "/automation", ariaLabel: "Automation" }, { label: "Manifiesto", href: "/manifesto", ariaLabel: "Manifiesto" }] },
    { label: "Proyectos", bgColor: isDark ? "#1a1a1a" : "#e8e4dc", textColor: isDark ? "#fff" : "#000",
      links: [{ label: "Archive", href: "/archive", ariaLabel: "Archive" }, { label: "Visual Editorial", href: "/visual", ariaLabel: "Visual" }] },
    { label: "Contacto", bgColor: isDark ? "#dde4e6" : "#1a1a1a", textColor: isDark ? "#000" : "#fff",
      links: [{ label: "WhatsApp", href: WA_URL, ariaLabel: "WhatsApp" }, { label: "Email", href: `mailto:${EMAIL}`, ariaLabel: "Email" }] },
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
        <div style={{ position: "absolute", inset: 0, zIndex: 1, pointerEvents: "none", background: isDark ? "rgba(0,0,0,.90)" : "rgba(245,241,233,.92)" }} />
      </div>

      <ScrollBar />
      <ThemeToggle />
      <WhatsAppFAB />

      <div style={{ position: "relative", zIndex: 50 }}>
        <CardNav logo="/faviconAP.ico" items={menuItems}
          baseColor={isDark ? "rgba(6,6,6,.95)" : "rgba(245,241,233,.95)"}
          menuColor={isDark ? "#fff" : "#000"} buttonBgColor={isDark ? "#dde4e6" : "#000"} buttonTextColor={isDark ? "#000" : "#fff"} />
      </div>

      {/* HERO + FORM */}
      <section style={{ position: "relative", zIndex: 20, paddingTop: isDesktop ? 140 : 110, paddingBottom: isDesktop ? 80 : 56, paddingLeft: "clamp(20px, 5vw, 56px)", paddingRight: "clamp(20px, 5vw, 56px)", maxWidth: 1280, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: isDesktop ? "1fr 1.05fr" : "1fr", gap: isDesktop ? 80 : 40 }}>
          {/* LEFT: hero */}
          <div>
            <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: .7 }}
              style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 28 }}>
              <div style={{ width: 22, height: .5, background: isDark ? "rgba(255,255,255,.45)" : "rgba(0,0,0,.35)" }} />
              <span style={{ fontSize: 9, letterSpacing: ".35em", textTransform: "uppercase", color: isDark ? "#fff" : "#000", fontWeight: 500 }}>
                Section 04 · Contacto
              </span>
            </motion.div>

            <div style={{ overflow: "hidden", marginBottom: 4 }}>
              <motion.h1 initial={{ y: 90 }} animate={{ y: 0 }} transition={{ duration: 1, ease: [.16, 1, .3, 1] }}
                style={{ fontSize: "clamp(3rem, 10vw, 8rem)", fontWeight: 900, textTransform: "uppercase", letterSpacing: "-.045em", lineHeight: .82, color: isDark ? "#fff" : "#000" }}>
                Hablemos
              </motion.h1>
            </div>
            <div style={{ overflow: "hidden", marginBottom: 32 }}>
              <motion.h1 initial={{ y: 90 }} animate={{ y: 0 }} transition={{ duration: 1, delay: .08, ease: [.16, 1, .3, 1] }}
                style={{ fontSize: "clamp(3rem, 10vw, 8rem)", fontWeight: 900, textTransform: "uppercase", letterSpacing: "-.045em", lineHeight: .82, WebkitTextStroke: isDark ? "1.5px rgba(255,255,255,.28)" : "1.5px rgba(0,0,0,.22)", color: "transparent" }}>
                en serio
              </motion.h1>
            </div>

            <motion.p initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .8, delay: .35 }}
              style={{ fontSize: "clamp(15px, 1.8vw, 17px)", fontWeight: 400, lineHeight: 1.7, maxWidth: 460, color: isDark ? "#fff" : "#000", marginBottom: 36 }}>
              Llená el form y abrimos WhatsApp con tu mensaje ya escrito. O si preferís el método directo, los datos están abajo.
            </motion.p>

            {/* Quick stats */}
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .8, delay: .5 }}
              style={{ display: "flex", flexDirection: "column", gap: 16, fontFamily: "monospace", fontSize: 11, letterSpacing: ".18em", color: isDark ? "#fff" : "#000" }}>
              {[
                { k: "Respuesta", v: "< 4 h laborales" },
                { k: "Horario", v: "Bogotá · GMT-5 · L-V 9-19h" },
                { k: "Idiomas", v: "Español · English" },
                { k: "Atiendo", v: "LATAM + USA" },
              ].map(({ k, v }) => (
                <div key={k} style={{ display: "flex", alignItems: "center", gap: 14 }}>
                  <span style={{ width: 70, fontSize: 9, color: isDark ? "rgba(255,255,255,.55)" : "rgba(0,0,0,.55)", textTransform: "uppercase" }}>{k}</span>
                  <div style={{ width: 18, height: .5, background: isDark ? "rgba(255,255,255,.20)" : "rgba(0,0,0,.20)" }} />
                  <span>{v}</span>
                </div>
              ))}
            </motion.div>
          </div>

          {/* RIGHT: form */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .8, delay: .3 }}>
            <ContactForm isDark={isDark} isDesktop={isDesktop} />
          </motion.div>
        </div>
      </section>

      {/* MÉTODOS DIRECTOS */}
      <section style={{ position: "relative", zIndex: 20, padding: isDesktop ? "32px 48px 96px" : "16px 20px 64px", maxWidth: 1280, margin: "0 auto" }}>
        <motion.div initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: .7 }}
          style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 28 }}>
          <div style={{ width: 22, height: .5, background: isDark ? "rgba(255,255,255,.45)" : "rgba(0,0,0,.35)" }} />
          <span style={{ fontSize: 9, letterSpacing: ".35em", textTransform: "uppercase", color: isDark ? "rgba(255,255,255,.80)" : "rgba(0,0,0,.75)" }}>
            Método directo
          </span>
        </motion.div>
        <DirectMethods isDark={isDark} isDesktop={isDesktop} />
      </section>

      {/* FAQ */}
      <section style={{ position: "relative", zIndex: 20, padding: isDesktop ? "32px 48px 96px" : "16px 20px 64px", maxWidth: 1280, margin: "0 auto" }}>
        <motion.div initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: .7 }}
          style={{ marginBottom: 24 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
            <div style={{ width: 22, height: .5, background: isDark ? "rgba(255,255,255,.45)" : "rgba(0,0,0,.35)" }} />
            <span style={{ fontSize: 9, letterSpacing: ".35em", textTransform: "uppercase", color: isDark ? "rgba(255,255,255,.80)" : "rgba(0,0,0,.75)" }}>
              Preguntas frecuentes
            </span>
          </div>
          <h2 style={{ fontSize: "clamp(1.8rem, 4vw, 2.6rem)", fontWeight: 900, textTransform: "uppercase", letterSpacing: "-.03em", lineHeight: .95, color: isDark ? "#fff" : "#000" }}>
            Antes de escribir
          </h2>
        </motion.div>
        <div style={{ borderTop: isDark ? "0.5px solid rgba(255,255,255,.10)" : "0.5px solid rgba(0,0,0,.10)" }}>
          {faqs.map((f, i) => <FAQItem key={i} q={f.q} a={f.a} isDark={isDark} idx={i} />)}
        </div>
      </section>

      <footer style={{ position: "relative", zIndex: 20, padding: "32px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", background: pageBg, borderTop: borderC, gap: 12, flexWrap: "wrap" }}>
        <span style={{ fontSize: 9, letterSpacing: ".4em", textTransform: "uppercase", color: isDark ? "rgba(255,255,255,.55)" : "rgba(0,0,0,.55)" }}>Andres Prada</span>
        <span style={{ fontFamily: "monospace", fontSize: 9, color: isDark ? "rgba(255,255,255,.45)" : "rgba(0,0,0,.45)" }}>© 2026 · Contacto</span>
        <span style={{ fontSize: 9, letterSpacing: ".4em", textTransform: "uppercase", color: isDark ? "rgba(255,255,255,.55)" : "rgba(0,0,0,.55)" }}>Bogotá, CO</span>
      </footer>
    </div>
  )
}
