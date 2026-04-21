import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion"
import { useState, useEffect } from "react"
import { createPortal } from "react-dom"
import { useTheme } from "../context/ThemeContext"
import LiquidEther from "../components/LiquidEther"
import CardNav from "../components/CardNav"
import "../components/CardNav.css"

const WA_NUMBER = "573195768097"
const WA_BASE   = `https://wa.me/${WA_NUMBER}?text=`

const services = [
  {
    index: "01", slug: "software",
    name: "Desarrollo\nde Software",
    nameFlat: "Desarrollo de Software",
    tagline: "Aplicaciones a medida que resuelven problemas reales",
    description: "Diseño y construyo aplicaciones web completas desde cero. Desde dashboards internos hasta plataformas SaaS complejas. Cada proyecto parte del problema real del cliente, no de plantillas genéricas.",
    process: [
      { step: "01", label: "Diagnóstico",         desc: "Entendemos el problema y flujos críticos antes de escribir código." },
      { step: "02", label: "Arquitectura",         desc: "Stack, datos y APIs. Sin over-engineering." },
      { step: "03", label: "Desarrollo iterativo", desc: "Entregas cada 2 semanas. Tú ves el avance real." },
      { step: "04", label: "Deploy & soporte",     desc: "Producción + documentación + soporte incluido." },
    ],
    pricing: [
      { tier: "MVP",        price: "desde $1.500 USD", desc: "Features core para validar el concepto." },
      { tier: "Producción", price: "desde $4.000 USD", desc: "Auth, admin, pagos y APIs completas." },
      { tier: "Enterprise", price: "Cotización",        desc: "Proyectos complejos con múltiples módulos." },
    ],
    stack: ["React", "Node.js", "TypeScript", "PostgreSQL", "Prisma", "Docker"],
    img: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=1200",
    waText: "Hola%20Andres%2C%20me%20interesa%20un%20proyecto%20de%20software%20a%20medida",
  },
  {
    index: "02", slug: "web",
    name: "Páginas\nWeb",
    nameFlat: "Páginas Web",
    tagline: "Landing pages, ecommerces y sitios que convierten",
    description: "Cada página web tiene un objetivo claro: convertir visitantes en clientes. Diseño, desarrollo y optimización SEO en un solo paquete, sin subcontratar nada.",
    process: [
      { step: "01", label: "Brief & referentes", desc: "Tono, paleta, tipografía y objetivo de cada página." },
      { step: "02", label: "Wireframes",          desc: "Estructura y flujo antes de diseñar. Sin cambios costosos." },
      { step: "03", label: "Diseño & desarrollo", desc: "Figma + React/Next.js con animaciones optimizadas." },
      { step: "04", label: "SEO & lanzamiento",   desc: "Metadatos, sitemap y analíticas desde día uno." },
    ],
    pricing: [
      { tier: "Landing Page", price: "desde $600 USD",  desc: "Alta conversión, diseño personalizado." },
      { tier: "Sitio web",    price: "desde $1.200 USD", desc: "5-8 páginas con CMS para gestionar contenido." },
      { tier: "Ecommerce",    price: "desde $2.500 USD", desc: "Catálogo, carrito, pagos y panel de gestión." },
    ],
    stack: ["Next.js", "Tailwind CSS", "Framer Motion", "Sanity CMS", "Stripe", "Vercel"],
    img: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=1200",
    waText: "Hola%20Andres%2C%20me%20interesa%20una%20p%C3%A1gina%20web",
  },
  {
    index: "03", slug: "audiovisual",
    name: "Animaciones\nAudioreactivas",
    nameFlat: "Animaciones Audioreactivas",
    tagline: "Visuales que responden al sonido en tiempo real",
    description: "Creo experiencias visuales en la intersección del código y la música. VJing en vivo, instalaciones interactivas, visualizadores para artistas y marcas.",
    process: [
      { step: "01", label: "Concepto sonoro",    desc: "Audio, ritmo y paleta emocional del visual." },
      { step: "02", label: "Prototipo reactivo", desc: "Primera versión que responde al audio en tiempo real." },
      { step: "03", label: "Refinamiento",       desc: "Color, intensidad y sincronización perfecta." },
      { step: "04", label: "Entrega",            desc: "Exportable, instalación en vivo o integración web." },
    ],
    pricing: [
      { tier: "Visualizador web",   price: "desde $500 USD", desc: "Componente embebible reactivo al audio." },
      { tier: "Pieza para artista", price: "desde $900 USD", desc: "Visual para un track. Video + web." },
      { tier: "Instalación / Live", price: "Cotización",      desc: "Setup para eventos o instalaciones físicas." },
    ],
    stack: ["Three.js", "WebGL", "Web Audio API", "GLSL Shaders", "p5.js", "TouchDesigner"],
    img: "https://images.unsplash.com/photo-1617802690992-15d93263d3a9?auto=format&fit=crop&q=80&w=1200",
    waText: "Hola%20Andres%2C%20me%20interesan%20las%20animaciones%20audioreactivas",
  },
  {
    index: "04", slug: "fotografia",
    name: "Fotografía",
    nameFlat: "Fotografía",
    tagline: "Editorial y comercial — imágenes con punto de vista",
    description: "Fotografía que comunica antes de leer el copy. Producto, retratos editoriales, arquitectura y fotografía conceptual. Cada imagen tiene dirección de arte.",
    process: [
      { step: "01", label: "Dirección de arte", desc: "Moodboard, paleta y guión visual antes de la sesión." },
      { step: "02", label: "Sesión",            desc: "Estudio o locación. Iluminación y composición controladas." },
      { step: "03", label: "Selección",         desc: "Galería privada para elegir las mejores tomas." },
      { step: "04", label: "Retoque & entrega", desc: "Alta resolución lista para impresión y digital." },
    ],
    pricing: [
      { tier: "Sesión producto",   price: "desde $250 USD", desc: "10 productos, 20 imágenes editadas." },
      { tier: "Retrato editorial", price: "desde $350 USD", desc: "2h de sesión, 30 imágenes editadas." },
      { tier: "Proyecto completo", price: "desde $800 USD", desc: "Campaña con dirección de arte y piezas." },
    ],
    stack: ["Sony Alpha", "Capture One", "Adobe Lightroom", "Adobe Photoshop", "Profoto"],
    img: "https://images.unsplash.com/photo-1554080353-a576cf803bda?auto=format&fit=crop&q=80&w=1200",
    waText: "Hola%20Andres%2C%20me%20interesa%20una%20sesi%C3%B3n%20fotogr%C3%A1fica",
  },
  {
    index: "05", slug: "esculturas",
    name: "Esculturas\n& Arte",
    nameFlat: "Esculturas & Arte",
    tagline: "Piezas físicas y conceptuales que ocupan espacio real",
    description: "Diseño y produzco piezas escultóricas que dialogan entre lo digital y lo tangible. Ediciones limitadas hasta obras site-specific para espacios comerciales o residenciales.",
    process: [
      { step: "01", label: "Concepto",          desc: "Narrativa, material, escala y diálogo con el espacio." },
      { step: "02", label: "Prototipo / render", desc: "Modelo 3D o prototipo en escala para validar forma." },
      { step: "03", label: "Producción",         desc: "Fabricación de la pieza final. Atención al detalle." },
      { step: "04", label: "Instalación",        desc: "Entrega in situ. Certificado de autenticidad incluido." },
    ],
    pricing: [
      { tier: "Objeto / Edición",  price: "desde $300 USD",  desc: "Edición limitada. Pequeño formato, material selecto." },
      { tier: "Escultura mediana", price: "desde $1.000 USD", desc: "Mediano formato, personalizable. Hasta 3 unidades." },
      { tier: "Site-specific",     price: "Cotización",        desc: "Obra exclusiva para un espacio determinado." },
    ],
    stack: ["Blender 3D", "Impresión 3D", "Fibra de vidrio", "Resina", "Metal", "Madera"],
    img: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&q=80&w=1200",
    waText: "Hola%20Andres%2C%20me%20interesa%20una%20escultura%20o%20pieza%20de%20arte",
  },
]

/* ─────────────────────────────────────────────────────────────────────────────
   BREAKPOINT HOOK — detecta si es desktop (≥1024px)
   Reemplaza las clases lg: de Tailwind con lógica JS pura,
   garantizando que el layout se aplique correctamente
───────────────────────────────────────────────────────────────────────────── */

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

/* ─────────────────────────────────────────────────────────────────────────────
   THEME TOGGLE
───────────────────────────────────────────────────────────────────────────── */

function ThemeToggle() {
  const { isDark, toggleTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  useEffect(() => { setMounted(true) }, [])
  const ic = isDark ? "#fff" : "#111"
  const el = (
    <div style={{ position: "fixed", top: 20, right: 20, zIndex: 9999, display: "flex", alignItems: "center", gap: 8, userSelect: "none" }}>
      <div style={{ opacity: !isDark ? 1 : 0.28, transition: "opacity .35s", display: "flex", alignItems: "center", justifyContent: "center", width: 20, height: 20 }}>
        <svg width="11" height="15" viewBox="0 0 11 15" fill="none"><path d="M7 1L1 8h4.5L4 14l6.5-7.5H6L7 1z" fill={ic} stroke={ic} strokeWidth=".4" strokeLinejoin="round"/></svg>
      </div>
      <button onClick={toggleTheme} aria-label="Cambiar tema" style={{ position: "relative", width: 52, height: 28, borderRadius: 14, background: isDark ? "rgba(255,255,255,.10)" : "rgba(0,0,0,.08)", border: `1px solid ${isDark ? "rgba(255,255,255,.22)" : "rgba(0,0,0,.16)"}`, cursor: "pointer", outline: "none", padding: 0, flexShrink: 0, transition: "background .4s,border-color .4s" }}>
        <motion.div animate={{ x: isDark ? 26 : 2 }} transition={{ type: "spring", stiffness: 420, damping: 32 }} style={{ position: "absolute", top: 2, left: 0, width: 22, height: 22, borderRadius: "50%", background: isDark ? "#fff" : "#111", boxShadow: isDark ? "0 1px 5px rgba(0,0,0,.55)" : "0 1px 5px rgba(0,0,0,.20)" }}/>
      </button>
      <div style={{ opacity: isDark ? 1 : 0.28, transition: "opacity .35s", display: "flex", alignItems: "center", justifyContent: "center", width: 20, height: 20 }}>
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M10.5 7.8A5.5 5.5 0 0 1 4.2 1.5a5 5 0 1 0 6.3 6.3z" fill={ic} stroke={ic} strokeWidth=".4" strokeLinejoin="round"/></svg>
      </div>
    </div>
  )
  return mounted ? createPortal(el, document.body) : null
}

/* ─────────────────────────────────────────────────────────────────────────────
   SCROLL BAR
───────────────────────────────────────────────────────────────────────────── */

function ScrollBar() {
  const { scrollYProgress } = useScroll()
  const width = useTransform(scrollYProgress, [0, 1], ["0%", "100%"])
  const { isDark } = useTheme()
  return (
    <motion.div
      style={{ position: "fixed", top: 0, left: 0, height: 1.5, zIndex: 300, pointerEvents: "none", width, background: isDark ? "rgba(255,255,255,.3)" : "rgba(0,0,0,.25)" }}
    />
  )
}

/* ─────────────────────────────────────────────────────────────────────────────
   DETAIL PANEL
───────────────────────────────────────────────────────────────────────────── */

function DetailPanel({ service, isDark }: { service: typeof services[0]; isDark: boolean }) {
  const border = isDark ? "1px solid rgba(255,255,255,.06)" : "1px solid rgba(0,0,0,.06)"
  return (
    <motion.div
      key={service.slug}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 8 }}
      transition={{ duration: .4, ease: [.16, 1, .3, 1] }}
      style={{ background: isDark ? "#111113" : "#f0ede6", borderTop: isDark ? "1px solid rgba(255,255,255,.07)" : "1px solid rgba(0,0,0,.07)" }}
    >
      <div style={{ padding: "40px 48px", maxWidth: 900 }}>

        {/* Descripción */}
        <p style={{ fontSize: 15, fontWeight: 300, lineHeight: 1.85, marginBottom: 40, maxWidth: 680, color: isDark ? "rgba(255,255,255,.58)" : "rgba(0,0,0,.60)" }}>
          {service.description}
        </p>

        {/* Proceso + Precios en grid */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48, marginBottom: 40 }}>

          {/* Proceso */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
              <span style={{ fontSize: 9, textTransform: "uppercase", letterSpacing: ".35em", color: isDark ? "rgba(255,255,255,.22)" : "rgba(0,0,0,.22)", whiteSpace: "nowrap" }}>Proceso</span>
              <div style={{ flex: 1, height: .5, background: isDark ? "rgba(255,255,255,.07)" : "rgba(0,0,0,.07)" }}/>
            </div>
            {service.process.map((p, i) => (
              <motion.div key={p.step}
                style={{ display: "flex", gap: 20, paddingTop: 14, paddingBottom: 14, borderBottom: i < service.process.length - 1 ? (isDark ? "1px solid rgba(255,255,255,.05)" : "1px solid rgba(0,0,0,.05)") : "none" }}
                initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                transition={{ duration: .35, delay: i * .06 }}>
                <span style={{ fontFamily: "monospace", fontSize: 9, paddingTop: 2, flexShrink: 0, width: 20, color: isDark ? "rgba(255,255,255,.20)" : "rgba(0,0,0,.20)" }}>{p.step}</span>
                <div>
                  <p style={{ fontSize: 12, fontWeight: 600, marginBottom: 3, color: isDark ? "rgba(255,255,255,.75)" : "rgba(0,0,0,.75)" }}>{p.label}</p>
                  <p style={{ fontSize: 11, fontWeight: 300, lineHeight: 1.6, color: isDark ? "rgba(255,255,255,.38)" : "rgba(0,0,0,.42)" }}>{p.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Precios */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
              <span style={{ fontSize: 9, textTransform: "uppercase", letterSpacing: ".35em", color: isDark ? "rgba(255,255,255,.22)" : "rgba(0,0,0,.22)", whiteSpace: "nowrap" }}>Inversión</span>
              <div style={{ flex: 1, height: .5, background: isDark ? "rgba(255,255,255,.07)" : "rgba(0,0,0,.07)" }}/>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {service.pricing.map((p, i) => (
                <motion.a key={p.tier}
                  href={`${WA_BASE}${service.waText}%20(${encodeURIComponent(p.tier)})`}
                  target="_blank" rel="noopener noreferrer"
                  style={{
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    padding: "16px 20px", borderRadius: 14, textDecoration: "none", cursor: "pointer",
                    background: i === 1 ? (isDark ? "rgba(255,255,255,.07)" : "rgba(0,0,0,.055)") : (isDark ? "rgba(255,255,255,.03)" : "rgba(0,0,0,.025)"),
                    border: i === 1 ? (isDark ? "1px solid rgba(255,255,255,.14)" : "1px solid rgba(0,0,0,.12)") : (isDark ? "1px solid rgba(255,255,255,.06)" : "1px solid rgba(0,0,0,.06)"),
                  }}
                  initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: .35, delay: .1 + i * .07 }}
                  whileHover={{ scale: 1.01 }}>
                  <div>
                    <span style={{ fontFamily: "monospace", fontSize: 9, textTransform: "uppercase", letterSpacing: ".25em", display: "block", marginBottom: 4, color: isDark ? "rgba(255,255,255,.25)" : "rgba(0,0,0,.25)" }}>{p.tier}</span>
                    <span style={{ fontSize: 17, fontWeight: 900, color: isDark ? "#fff" : "#111" }}>{p.price}</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <span style={{ fontSize: 11, fontWeight: 300, maxWidth: 130, textAlign: "right", lineHeight: 1.5, color: isDark ? "rgba(255,255,255,.35)" : "rgba(0,0,0,.38)" }}>{p.desc}</span>
                    <span style={{ fontSize: 12, color: isDark ? "rgba(255,255,255,.30)" : "rgba(0,0,0,.25)" }}>→</span>
                  </div>
                </motion.a>
              ))}
            </div>
          </div>
        </div>

        {/* Stack */}
        <div>
          <span style={{ fontSize: 9, textTransform: "uppercase", letterSpacing: ".3em", display: "block", marginBottom: 12, color: isDark ? "rgba(255,255,255,.18)" : "rgba(0,0,0,.18)" }}>Stack & herramientas</span>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {service.stack.map(t => (
              <span key={t} style={{ fontFamily: "monospace", fontSize: 10, padding: "6px 12px", borderRadius: 20, background: isDark ? "rgba(255,255,255,.06)" : "rgba(0,0,0,.05)", border: isDark ? "1px solid rgba(255,255,255,.10)" : "1px solid rgba(0,0,0,.09)", color: isDark ? "rgba(255,255,255,.50)" : "rgba(0,0,0,.48)" }}>
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  )
}

/* ─────────────────────────────────────────────────────────────────────────────
   MAIN LAB
───────────────────────────────────────────────────────────────────────────── */

export default function Lab() {
  const { isDark } = useTheme()
  const isDesktop = useIsDesktop()
  const [active, setActive]     = useState(0)
  const [expanded, setExpanded] = useState<number | null>(null)

  const current = services[active]
  const WA_URL  = `${WA_BASE}Hola%20Andres%2C%20quiero%20conocer%20tus%20servicios`

  const handleSelect = (i: number) => {
    if (active === i) { setExpanded(expanded === i ? null : i) }
    else { setActive(i); setExpanded(null) }
  }

  const pageBg = isDark ? "#060606" : "#f5f1e9"
  const colBg  = isDark ? "#0d0d10" : "#e8e4db"
  const borderC = isDark ? "1px solid rgba(255,255,255,.06)" : "1px solid rgba(0,0,0,.07)"

  const menuItems = [
    { label: "Servicios", bgColor: isDark ? "#111111" : "#f0ece4", textColor: isDark ? "#fff" : "#000",
      links: [{ label: "Software", href: "/lab", ariaLabel: "Software" }, { label: "Páginas Web", href: "/lab", ariaLabel: "Web" }] },
    { label: "Proyectos", bgColor: isDark ? "#1a1a1a" : "#e8e4dc", textColor: isDark ? "#fff" : "#000",
      links: [{ label: "Ver todos", href: "/archive", ariaLabel: "Archive" }, { label: "Home", href: "/", ariaLabel: "Home" }] },
    { label: "Contacto", bgColor: isDark ? "#dde4e6" : "#1a1a1a", textColor: isDark ? "#000" : "#fff",
      links: [{ label: "WhatsApp", href: `https://wa.me/${WA_NUMBER}?text=Hola%20Andres`, ariaLabel: "WA" }, { label: "Email", href: "mailto:andres@tudominio.com", ariaLabel: "Email" }] },
  ]

  return (
    <div style={{ minHeight: "100vh", overflowX: "hidden", background: pageBg, color: isDark ? "#fff" : "#111", position: "relative" }}>

      {/* ── LiquidEther — z-index 0, no interfiere con contenido ── */}
      <div style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none" }}>
        <LiquidEther mouseForce={12} cursorSize={90} resolution={.65} dt={.016} viscous={20} isViscous={false} autoIntensity={isDark ? 1.5 : .6}/>
        <div style={{ position: "absolute", inset: 0, zIndex: 1, pointerEvents: "none", background: isDark ? "rgba(0,0,0,.82)" : "rgba(245,241,233,.82)" }}/>
      </div>

      <ScrollBar/>
      <ThemeToggle/>

      {/* ── Nav — z-index 50 ── */}
      <div style={{ position: "relative", zIndex: 50 }}>
        <CardNav logo="https://via.placeholder.com/150x50?text=AP" items={menuItems}
          baseColor={isDark ? "rgba(6,6,6,.97)" : "rgba(245,241,233,.97)"}
          menuColor={isDark ? "#fff" : "#111"} buttonBgColor={isDark ? "#dde4e6" : "#111"} buttonTextColor={isDark ? "#000" : "#fff"}/>
      </div>

      {/* ── HERO — z-index 20 ── */}
      <section style={{ position: "relative", zIndex: 20, paddingTop: 112, paddingBottom: 40, paddingLeft: 48, paddingRight: 48, maxWidth: 1280, margin: "0 auto" }}>
        <motion.div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 28 }}
          initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: .6 }}>
          <div style={{ width: 22, height: .5, background: isDark ? "rgba(255,255,255,.2)" : "rgba(0,0,0,.2)" }}/>
          <span style={{ fontSize: 9, textTransform: "uppercase", letterSpacing: ".35em", color: isDark ? "rgba(255,255,255,.25)" : "rgba(0,0,0,.25)" }}>Lab — Servicios</span>
        </motion.div>

        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 24, flexWrap: "wrap" }}>
          <div>
            <div style={{ overflow: "hidden", marginBottom: 4 }}>
              <motion.h1 style={{ fontSize: "clamp(2.4rem, 6vw, 6rem)", fontWeight: 900, textTransform: "uppercase", letterSpacing: "-.04em", lineHeight: .85, color: isDark ? "#fff" : "#111" }}
                initial={{ y: 65 }} animate={{ y: 0 }} transition={{ duration: .9, ease: [.16, 1, .3, 1] }}>
                Lo que
              </motion.h1>
            </div>
            <div style={{ overflow: "hidden" }}>
              <motion.h1 style={{ fontSize: "clamp(2.4rem, 6vw, 6rem)", fontWeight: 900, textTransform: "uppercase", letterSpacing: "-.04em", lineHeight: .85, WebkitTextStroke: isDark ? "1.5px rgba(255,255,255,.2)" : "1.5px rgba(0,0,0,.18)", color: "transparent" }}
                initial={{ y: 65 }} animate={{ y: 0 }} transition={{ duration: .9, delay: .07, ease: [.16, 1, .3, 1] }}>
                construyo
              </motion.h1>
            </div>
          </div>
          <motion.p style={{ fontSize: 14, fontWeight: 300, lineHeight: 1.7, maxWidth: 280, paddingBottom: 4, color: isDark ? "rgba(255,255,255,.40)" : "rgba(0,0,0,.45)" }}
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .7, delay: .3 }}>
            5 disciplinas, un mismo estándar. Selecciona un servicio para ver proceso, tecnología e inversión.
          </motion.p>
        </div>

        <div style={{ marginTop: 32, display: "flex", alignItems: "center", justifyContent: "space-between", borderTop: isDark ? "1px solid rgba(255,255,255,.05)" : "1px solid rgba(0,0,0,.06)", paddingTop: 12 }}>
          <span style={{ fontSize: 9, letterSpacing: ".3em", textTransform: "uppercase", color: isDark ? "rgba(255,255,255,.14)" : "rgba(0,0,0,.14)" }}>Servicios disponibles</span>
          <span style={{ fontFamily: "monospace", fontSize: 9, color: isDark ? "rgba(255,255,255,.10)" : "rgba(0,0,0,.10)" }}>01 — 05</span>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          SPREAD LATERAL — layout controlado con JS, no Tailwind breakpoints
          isDesktop=true  → flex row: col izq 300px | col der flex-1
          isDesktop=false → flex col: lista arriba | imagen abajo
      ══════════════════════════════════════════════════════════════════════ */}
      <section style={{ position: "relative", zIndex: 20, borderTop: borderC }}>
        <div style={{
          display: "flex",
          flexDirection: isDesktop ? "row" : "column",
          minHeight: isDesktop ? "80vh" : "auto",
          alignItems: "stretch",
        }}>

          {/* ── COLUMNA IZQUIERDA ── */}
          <div style={{
            // Desktop: ancho fijo 300px, sticky
            width: isDesktop ? 300 : "100%",
            flexShrink: 0,
            position: isDesktop ? "sticky" : "relative",
            top: isDesktop ? 0 : "auto",
            height: isDesktop ? "100vh" : "auto",
            alignSelf: isDesktop ? "flex-start" : "auto",
            background: colBg,
            borderRight: isDesktop ? borderC : "none",
            borderBottom: !isDesktop ? borderC : "none",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: isDesktop ? "36px 28px" : "20px 24px",
          }}>

            {/* Label — solo desktop */}
            {isDesktop && (
              <div>
                <span style={{ fontSize: 9, textTransform: "uppercase", letterSpacing: ".3em", color: isDark ? "rgba(255,255,255,.18)" : "rgba(0,0,0,.18)" }}>
                  Selecciona un servicio
                </span>
              </div>
            )}

            {/* Lista de servicios */}
            <div style={{
              display: "flex",
              flexDirection: isDesktop ? "column" : "row",
              flexWrap: isDesktop ? "nowrap" : "wrap",
              gap: isDesktop ? 0 : 8,
              flex: isDesktop ? 1 : "none",
              justifyContent: isDesktop ? "center" : "flex-start",
              marginTop: isDesktop ? 0 : 0,
            }}>
              {services.map((s, i) => {
                const isActive = active === i
                return (
                  <button key={s.slug} onClick={() => handleSelect(i)}
                    style={{
                      textAlign: "left",
                      width: isDesktop ? "100%" : "auto",
                      padding: "12px 14px",
                      borderRadius: 10,
                      background: isActive ? (isDark ? "rgba(255,255,255,.07)" : "rgba(0,0,0,.06)") : "transparent",
                      border: isActive ? (isDark ? "1px solid rgba(255,255,255,.10)" : "1px solid rgba(0,0,0,.08)") : "1px solid transparent",
                      cursor: "pointer",
                      transition: "background .25s, border-color .25s",
                    }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
                        {/* Indicador */}
                        <motion.div
                          animate={{ width: isActive ? 14 : 4, background: isActive ? (isDark ? "#fff" : "#111") : (isDark ? "rgba(255,255,255,.2)" : "rgba(0,0,0,.15)") }}
                          transition={{ duration: .3 }}
                          style={{ height: 1.5, borderRadius: 1, flexShrink: 0 }}
                        />
                        <div style={{ minWidth: 0 }}>
                          <span style={{ fontFamily: "monospace", fontSize: 8, display: "block", marginBottom: 2, color: isDark ? "rgba(255,255,255,.20)" : "rgba(0,0,0,.20)" }}>{s.index}</span>
                          <span style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "-.01em", lineHeight: 1.2, display: "block", whiteSpace: isDesktop ? "normal" : "nowrap", color: isActive ? (isDark ? "#fff" : "#111") : (isDark ? "rgba(255,255,255,.42)" : "rgba(0,0,0,.42)"), transition: "color .25s" }}>
                            {s.nameFlat}
                          </span>
                        </div>
                      </div>
                      {/* + solo desktop */}
                      {isDesktop && (
                        <motion.span
                          animate={{ rotate: expanded === i ? 45 : 0, opacity: isActive ? 1 : 0.3 }}
                          transition={{ duration: .2 }}
                          style={{ fontSize: 14, flexShrink: 0, color: isDark ? "rgba(255,255,255,.4)" : "rgba(0,0,0,.35)" }}>
                          +
                        </motion.span>
                      )}
                    </div>

                    {/* Precio — activo + desktop */}
                    <AnimatePresence>
                      {isActive && isDesktop && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: .22 }} style={{ overflow: "hidden" }}>
                          <span style={{ fontFamily: "monospace", fontSize: 8, display: "block", marginTop: 6, paddingLeft: 24, color: isDark ? "rgba(255,255,255,.28)" : "rgba(0,0,0,.28)" }}>
                            {s.pricing[0].price}
                          </span>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </button>
                )
              })}
            </div>

            {/* CTA — solo desktop, al fondo */}
            {isDesktop && (
              <motion.a href={WA_URL} target="_blank" rel="noopener noreferrer"
                style={{ display: "flex", alignItems: "center", gap: 12, textDecoration: "none", marginTop: 24 }}
                whileHover={{ x: 4 }}>
                <span style={{ display: "inline-block", width: 20, height: .5, background: isDark ? "rgba(255,255,255,.2)" : "rgba(0,0,0,.2)", transition: "width .3s" }}/>
                <span style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: ".2em", color: isDark ? "rgba(255,255,255,.30)" : "rgba(0,0,0,.28)" }}>
                  Cotizar
                </span>
              </motion.a>
            )}
          </div>

          {/* ── COLUMNA DERECHA ── */}
          <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0, borderLeft: isDesktop ? borderC : "none" }}>

            {/* Imagen con crossfade */}
            <div style={{ position: "relative", overflow: "hidden", flexShrink: 0, height: "clamp(280px,55vh,600px)" }}>
              <AnimatePresence mode="wait">
                <motion.div key={`img-${active}`} style={{ position: "absolute", inset: 0 }}
                  initial={{ opacity: 0, scale: 1.04 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.02 }}
                  transition={{ duration: .7, ease: [.16, 1, .3, 1] }}>
                  <img src={current.img} alt={current.nameFlat} style={{ width: "100%", height: "100%", objectFit: "cover", filter: isDark ? "grayscale(15%) brightness(.78)" : "grayscale(0%) brightness(.92)" }}/>
                  <div style={{ position: "absolute", inset: 0, background: isDark ? "linear-gradient(to right,rgba(13,13,16,.55) 0%,transparent 45%)" : "linear-gradient(to right,rgba(232,228,219,.55) 0%,transparent 45%)" }}/>
                  <div style={{ position: "absolute", inset: 0, background: isDark ? "linear-gradient(to top,rgba(0,0,0,.8) 0%,rgba(0,0,0,.05) 50%,transparent 100%)" : "linear-gradient(to top,rgba(232,228,219,.9) 0%,rgba(232,228,219,.05) 50%,transparent 100%)" }}/>
                </motion.div>
              </AnimatePresence>

              {/* Texto sobre imagen */}
              <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "32px 40px", pointerEvents: "none" }}>
                <AnimatePresence mode="wait">
                  <motion.div key={`txt-${active}`}
                    initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: .5, ease: [.16, 1, .3, 1] }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
                      <span style={{ fontFamily: "monospace", fontSize: 9, color: "rgba(255,255,255,.40)" }}>{current.index} / 05</span>
                      <div style={{ width: 20, height: .5, background: "rgba(255,255,255,.30)" }}/>
                      <span style={{ fontSize: 9, textTransform: "uppercase", letterSpacing: ".22em", color: "rgba(255,255,255,.45)" }}>{current.tagline}</span>
                    </div>
                    <h2 style={{ fontWeight: 900, textTransform: "uppercase", color: "#fff", fontSize: "clamp(2rem,4.5vw,3.5rem)", letterSpacing: "-.03em", lineHeight: .87, textShadow: "0 2px 24px rgba(0,0,0,.5)" }}>
                      {current.name.split("\n").map((line, i) => <span key={i} style={{ display: "block" }}>{line}</span>)}
                    </h2>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 16 }}>
                      {current.stack.slice(0, 4).map(t => (
                        <span key={t} style={{ fontFamily: "monospace", fontSize: 8, padding: "4px 10px", borderRadius: 20, color: "rgba(255,255,255,.65)", background: "rgba(255,255,255,.12)", border: "1px solid rgba(255,255,255,.18)" }}>{t}</span>
                      ))}
                      {current.stack.length > 4 && (
                        <span style={{ fontFamily: "monospace", fontSize: 8, padding: "4px 10px", borderRadius: 20, color: "rgba(255,255,255,.45)", background: "rgba(255,255,255,.07)", border: "1px solid rgba(255,255,255,.12)" }}>+{current.stack.length - 4}</span>
                      )}
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Botón Ver detalle */}
              <div style={{ position: "absolute", top: 16, right: 20, zIndex: 10 }}>
                <motion.button
                  onClick={() => setExpanded(expanded === active ? null : active)}
                  style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 16px", borderRadius: 20, background: isDark ? "rgba(0,0,0,.55)" : "rgba(255,255,255,.75)", border: isDark ? "1px solid rgba(255,255,255,.15)" : "1px solid rgba(0,0,0,.10)", backdropFilter: "blur(8px)", cursor: "pointer" }}
                  whileHover={{ scale: 1.03 }} whileTap={{ scale: .97 }}>
                  <span style={{ fontSize: 9, textTransform: "uppercase", letterSpacing: ".2em", color: isDark ? "rgba(255,255,255,.75)" : "rgba(0,0,0,.65)" }}>
                    {expanded === active ? "Cerrar" : "Ver detalle"}
                  </span>
                  <motion.span animate={{ rotate: expanded === active ? 45 : 0 }} transition={{ duration: .2 }}
                    style={{ fontSize: 13, color: isDark ? "rgba(255,255,255,.5)" : "rgba(0,0,0,.4)" }}>+</motion.span>
                </motion.button>
              </div>

              {/* Bracket */}
              <div style={{ position: "absolute", bottom: 20, right: 24, width: 16, height: 16, borderRight: isDark ? "1px solid rgba(255,255,255,.20)" : "1px solid rgba(255,255,255,.40)", borderBottom: isDark ? "1px solid rgba(255,255,255,.20)" : "1px solid rgba(255,255,255,.40)", pointerEvents: "none" }}/>
            </div>

            {/* Panel detalle expandible */}
            <AnimatePresence>
              {expanded === active && <DetailPanel service={current} isDark={isDark}/>}
            </AnimatePresence>

            {/* Barra prev/next */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 40px", background: colBg, borderTop: isDark ? "1px solid rgba(255,255,255,.05)" : "1px solid rgba(0,0,0,.06)", marginTop: "auto" }}>
              <button onClick={() => { setActive(a => (a - 1 + services.length) % services.length); setExpanded(null) }}
                style={{ display: "flex", alignItems: "center", gap: 10, background: "none", border: "none", cursor: "pointer", padding: 0 }}>
                <span style={{ fontSize: 14, color: isDark ? "rgba(255,255,255,.30)" : "rgba(0,0,0,.25)", transition: "transform .2s" }}>←</span>
                <span style={{ fontSize: 9, textTransform: "uppercase", letterSpacing: ".2em", color: isDark ? "rgba(255,255,255,.28)" : "rgba(0,0,0,.22)" }}>Anterior</span>
              </button>

              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                {services.map((_, i) => (
                  <motion.button key={i} onClick={() => { setActive(i); setExpanded(null) }}
                    animate={{ width: active === i ? 16 : 4, background: active === i ? (isDark ? "#fff" : "#111") : (isDark ? "rgba(255,255,255,.2)" : "rgba(0,0,0,.15)") }}
                    transition={{ duration: .3 }}
                    style={{ height: 3, borderRadius: 2, border: "none", cursor: "pointer", padding: 0 }}/>
                ))}
              </div>

              <button onClick={() => { setActive(a => (a + 1) % services.length); setExpanded(null) }}
                style={{ display: "flex", alignItems: "center", gap: 10, background: "none", border: "none", cursor: "pointer", padding: 0 }}>
                <span style={{ fontSize: 9, textTransform: "uppercase", letterSpacing: ".2em", color: isDark ? "rgba(255,255,255,.28)" : "rgba(0,0,0,.22)" }}>Siguiente</span>
                <span style={{ fontSize: 14, color: isDark ? "rgba(255,255,255,.30)" : "rgba(0,0,0,.25)" }}>→</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA FINAL ── */}
      <section style={{ position: "relative", zIndex: 20, padding: "112px 48px", maxWidth: 1280, margin: "0 auto", display: "flex", flexDirection: isDesktop ? "row" : "column", alignItems: isDesktop ? "flex-end" : "flex-start", justifyContent: "space-between", gap: 48, borderTop: isDark ? "1px solid rgba(255,255,255,.05)" : "1px solid rgba(0,0,0,.06)" }}>
        <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: .7 }} viewport={{ once: true }}>
          <span style={{ fontSize: 9, letterSpacing: ".35em", textTransform: "uppercase", display: "block", marginBottom: 16, color: isDark ? "rgba(255,255,255,.20)" : "rgba(0,0,0,.22)" }}>¿Listo para empezar?</span>
          <h2 style={{ fontSize: "clamp(2.8rem,7vw,5rem)", fontWeight: 900, textTransform: "uppercase", letterSpacing: "-.04em", lineHeight: .86, color: isDark ? "#fff" : "#111" }}>
            Hablemos<br/>
            <span style={{ WebkitTextStroke: isDark ? "1.5px rgba(255,255,255,.2)" : "1.5px rgba(0,0,0,.18)", color: "transparent" }}>de tu proyecto</span>
          </h2>
        </motion.div>
        <div style={{ display: "flex", flexDirection: "column", gap: 16, flexShrink: 0 }}>
          {[{ label: "WhatsApp", href: WA_URL }, { label: "Email", href: "mailto:andres@tudominio.com" }, { label: "Instagram", href: "https://instagram.com/tu_usuario" }].map(({ label, href }, i) => (
            <motion.a key={label} href={href} target={href.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer"
              style={{ display: "flex", alignItems: "center", gap: 16, textDecoration: "none", fontSize: 13, textTransform: "uppercase", letterSpacing: ".2em", color: isDark ? "rgba(255,255,255,.38)" : "rgba(0,0,0,.32)" }}
              initial={{ opacity: 0, x: 12 }} whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: .5, delay: i * .08 }} viewport={{ once: true }}
              whileHover={{ x: 4 }}>
              <span style={{ display: "inline-block", width: 20, height: .5, background: isDark ? "rgba(255,255,255,.18)" : "rgba(0,0,0,.12)" }}/>
              {label}
            </motion.a>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer style={{ position: "relative", zIndex: 20, padding: "32px 48px", display: "flex", alignItems: "center", justifyContent: "space-between", background: pageBg, borderTop: isDark ? "1px solid rgba(255,255,255,.04)" : "1px solid rgba(0,0,0,.05)" }}>
        <span style={{ fontSize: 9, letterSpacing: ".4em", textTransform: "uppercase", color: isDark ? "rgba(255,255,255,.12)" : "rgba(0,0,0,.14)" }}>Andres Prada</span>
        <span style={{ fontFamily: "monospace", fontSize: 9, color: isDark ? "rgba(255,255,255,.10)" : "rgba(0,0,0,.10)" }}>© 2026</span>
        <span style={{ fontSize: 9, letterSpacing: ".4em", textTransform: "uppercase", color: isDark ? "rgba(255,255,255,.12)" : "rgba(0,0,0,.14)" }}>Bogotá, CO</span>
      </footer>
    </div>
  )
}