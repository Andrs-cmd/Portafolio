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
      { step: "01", label: "Diagnóstico",          desc: "Entendemos el problema y los flujos críticos antes de escribir código." },
      { step: "02", label: "Arquitectura",          desc: "Stack, datos y APIs. Sin over-engineering." },
      { step: "03", label: "Desarrollo iterativo",  desc: "Entregas cada 2 semanas. Tú ves el avance real." },
      { step: "04", label: "Deploy & soporte",      desc: "Producción + documentación + soporte incluido." },
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
    description: "Cada página web que construyo tiene un objetivo claro: convertir visitantes en clientes. Diseño, desarrollo y optimización SEO en un solo paquete, sin subcontratar nada.",
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
    description: "Creo experiencias visuales en la intersección del código y la música. VJing en vivo, instalaciones interactivas, visualizadores para artistas y marcas que quieren ir más allá del video convencional.",
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
    description: "Fotografía que comunica antes de leer el copy. Sesiones de producto, retratos editoriales, arquitectura y fotografía conceptual. Cada imagen tiene dirección de arte, no solo técnica.",
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
   THEME TOGGLE
───────────────────────────────────────────────────────────────────────────── */

function ThemeToggle() {
  const { isDark, toggleTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  useEffect(() => { setMounted(true) }, [])
  const ic = isDark ? "#fff" : "#111"
  const el = (
    <div style={{ position:"fixed", top:20, right:20, zIndex:9999, display:"flex", alignItems:"center", gap:8, userSelect:"none" }}>
      <div style={{ opacity:!isDark?1:0.28, transition:"opacity .35s", display:"flex", alignItems:"center", justifyContent:"center", width:20, height:20 }}>
        <svg width="11" height="15" viewBox="0 0 11 15" fill="none"><path d="M7 1L1 8h4.5L4 14l6.5-7.5H6L7 1z" fill={ic} stroke={ic} strokeWidth=".4" strokeLinejoin="round"/></svg>
      </div>
      <button onClick={toggleTheme} aria-label="Cambiar tema" style={{ position:"relative", width:52, height:28, borderRadius:14, background:isDark?"rgba(255,255,255,.10)":"rgba(0,0,0,.08)", border:`1px solid ${isDark?"rgba(255,255,255,.22)":"rgba(0,0,0,.16)"}`, cursor:"pointer", outline:"none", padding:0, flexShrink:0, transition:"background .4s,border-color .4s" }}>
        <motion.div animate={{ x:isDark?26:2 }} transition={{ type:"spring", stiffness:420, damping:32 }} style={{ position:"absolute", top:2, left:0, width:22, height:22, borderRadius:"50%", background:isDark?"#fff":"#111", boxShadow:isDark?"0 1px 5px rgba(0,0,0,.55)":"0 1px 5px rgba(0,0,0,.20)" }}/>
      </button>
      <div style={{ opacity:isDark?1:0.28, transition:"opacity .35s", display:"flex", alignItems:"center", justifyContent:"center", width:20, height:20 }}>
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
  const width = useTransform(scrollYProgress, [0,1], ["0%","100%"])
  const { isDark } = useTheme()
  return <motion.div className="fixed top-0 left-0 h-[1.5px] z-[300] pointer-events-none" style={{ width, background:isDark?"rgba(255,255,255,.3)":"rgba(0,0,0,.25)" }}/>
}

/* ─────────────────────────────────────────────────────────────────────────────
   DETAIL PANEL
───────────────────────────────────────────────────────────────────────────── */

function DetailPanel({ service, isDark }: { service: typeof services[0]; isDark: boolean }) {
  return (
    <motion.div
      key={service.slug}
      initial={{ opacity:0, y:16 }}
      animate={{ opacity:1, y:0 }}
      exit={{ opacity:0, y:8 }}
      transition={{ duration:.4, ease:[.16,1,.3,1] }}
      style={{
        background: isDark?"#111113":"#f0ede6",
        borderTop: isDark?"1px solid rgba(255,255,255,.07)":"1px solid rgba(0,0,0,.07)",
      }}
    >
      <div className="px-6 md:px-10 py-8 md:py-12">

        <p className={`text-sm md:text-base font-light leading-[1.85] mb-10 max-w-2xl ${isDark?"text-white/58":"text-black/60"}`}>
          {service.description}
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-10">

          {/* Proceso */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <span className={`text-[9px] uppercase tracking-[.35em] shrink-0 ${isDark?"text-white/22":"text-black/22"}`}>Proceso</span>
              <div style={{ flex:1, height:".5px", background:isDark?"rgba(255,255,255,.07)":"rgba(0,0,0,.07)" }}/>
            </div>
            <div className="flex flex-col">
              {service.process.map((p, i) => (
                <motion.div key={p.step}
                  className={`flex gap-5 py-4 ${i < service.process.length-1 ? (isDark?"border-b border-white/[0.05]":"border-b border-black/[0.05]") : ""}`}
                  initial={{ opacity:0, x:-10 }} animate={{ opacity:1, x:0 }}
                  transition={{ duration:.35, delay:i*.06 }}>
                  <span className={`font-mono text-[9px] pt-0.5 shrink-0 w-5 ${isDark?"text-white/20":"text-black/20"}`}>{p.step}</span>
                  <div>
                    <p className={`text-xs font-semibold mb-0.5 ${isDark?"text-white/75":"text-black/75"}`}>{p.label}</p>
                    <p className={`text-xs font-light leading-relaxed ${isDark?"text-white/38":"text-black/42"}`}>{p.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Precios */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <span className={`text-[9px] uppercase tracking-[.35em] shrink-0 ${isDark?"text-white/22":"text-black/22"}`}>Inversión</span>
              <div style={{ flex:1, height:".5px", background:isDark?"rgba(255,255,255,.07)":"rgba(0,0,0,.07)" }}/>
            </div>
            <div className="flex flex-col gap-3">
              {service.pricing.map((p, i) => (
                <motion.a key={p.tier}
                  href={`${WA_BASE}${service.waText}%20(${encodeURIComponent(p.tier)})`}
                  target="_blank" rel="noopener noreferrer"
                  className="group flex items-center justify-between px-5 py-4 cursor-pointer"
                  style={{
                    borderRadius:14,
                    background: i===1 ? (isDark?"rgba(255,255,255,.07)":"rgba(0,0,0,.055)") : (isDark?"rgba(255,255,255,.03)":"rgba(0,0,0,.025)"),
                    border: i===1 ? (isDark?"1px solid rgba(255,255,255,.14)":"1px solid rgba(0,0,0,.12)") : (isDark?"1px solid rgba(255,255,255,.06)":"1px solid rgba(0,0,0,.06)"),
                    textDecoration:"none",
                  }}
                  initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }}
                  transition={{ duration:.35, delay:.1+i*.07 }}
                  whileHover={{ scale:1.01 }}>
                  <div>
                    <span className={`text-[9px] uppercase tracking-[.25em] block mb-1 font-mono ${isDark?"text-white/25":"text-black/25"}`}>{p.tier}</span>
                    <span className={`text-base font-black ${isDark?"text-white":"text-black"}`}>{p.price}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`text-xs font-light hidden md:block max-w-[140px] text-right leading-relaxed ${isDark?"text-white/35":"text-black/38"}`}>{p.desc}</span>
                    <span className={`text-[10px] group-hover:translate-x-1 transition-transform duration-200 ${isDark?"text-white/30":"text-black/25"}`}>→</span>
                  </div>
                </motion.a>
              ))}
            </div>
          </div>
        </div>

        {/* Stack */}
        <div>
          <span className={`text-[9px] uppercase tracking-[.3em] block mb-3 ${isDark?"text-white/18":"text-black/18"}`}>Stack & herramientas</span>
          <div className="flex flex-wrap gap-2">
            {service.stack.map(t => (
              <span key={t} className="text-[10px] px-3 py-1.5 rounded-full font-mono"
                style={{
                  background: isDark?"rgba(255,255,255,.06)":"rgba(0,0,0,.05)",
                  border: isDark?"1px solid rgba(255,255,255,.10)":"1px solid rgba(0,0,0,.09)",
                  color: isDark?"rgba(255,255,255,.50)":"rgba(0,0,0,.48)",
                }}>
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
  const [active, setActive]     = useState(0)
  const [expanded, setExpanded] = useState<number | null>(null)

  const current = services[active]
  const WA_URL  = `${WA_BASE}Hola%20Andres%2C%20quiero%20conocer%20tus%20servicios`

  const handleSelect = (i: number) => {
    if (active === i) {
      setExpanded(expanded === i ? null : i)
    } else {
      setActive(i)
      setExpanded(null)
    }
  }

  const menuItems = [
    { label:"Servicios", bgColor:isDark?"#111111":"#f0ece4", textColor:isDark?"#fff":"#000",
      links:[{ label:"Software", href:"/lab", ariaLabel:"Software" },{ label:"Páginas Web", href:"/lab", ariaLabel:"Web" }] },
    { label:"Proyectos", bgColor:isDark?"#1a1a1a":"#e8e4dc", textColor:isDark?"#fff":"#000",
      links:[{ label:"Ver todos", href:"/archive", ariaLabel:"Archive" },{ label:"Home", href:"/", ariaLabel:"Home" }] },
    { label:"Contacto", bgColor:isDark?"#dde4e6":"#1a1a1a", textColor:isDark?"#000":"#fff",
      links:[{ label:"WhatsApp", href:`https://wa.me/${WA_NUMBER}?text=Hola%20Andres`, ariaLabel:"WA" },{ label:"Email", href:"mailto:andres@tudominio.com", ariaLabel:"Email" }] },
  ]

  const colBg  = isDark ? "#0a0a0c" : "#ede9e0"
  const pageBg = isDark ? "#060606" : "#f5f1e9"

  return (
    <div className="min-h-screen overflow-x-hidden relative" style={{ background:pageBg, color:isDark?"#fff":"#111" }}>

      {/* LiquidEther */}
      <div className="fixed inset-0 w-full h-full z-0 pointer-events-none">
        <LiquidEther mouseForce={12} cursorSize={90} resolution={.65} dt={.016} viscous={20} isViscous={false} autoIntensity={isDark?1.5:.6}/>
        <div className="absolute inset-0 z-10 pointer-events-none" style={{ background:isDark?"rgba(0,0,0,.80)":"rgba(245,241,233,.80)" }}/>
      </div>

      <ScrollBar/>
      <ThemeToggle/>

      {/* Nav */}
      <div className="relative">
        <CardNav logo="https://via.placeholder.com/150x50?text=AP" items={menuItems}
          baseColor={isDark?"rgba(6,6,6,.96)":"rgba(245,241,233,.97)"}
          menuColor={isDark?"#fff":"#111"} buttonBgColor={isDark?"#dde4e6":"#111"} buttonTextColor={isDark?"#000":"#fff"}/>
      </div>

      {/* ── HERO ── */}
      <section className="relative z-20 pt-28 pb-10 px-6 md:px-12 max-w-7xl mx-auto">
        <motion.div className="flex items-center gap-3 mb-7"
          initial={{ opacity:0, x:-12 }} animate={{ opacity:1, x:0 }} transition={{ duration:.6 }}>
          <div style={{ width:22, height:.5, background:isDark?"rgba(255,255,255,.2)":"rgba(0,0,0,.2)" }}/>
          <span className={`text-[9px] uppercase tracking-[.35em] ${isDark?"text-white/25":"text-black/25"}`}>Lab — Servicios</span>
        </motion.div>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="overflow-hidden mb-1">
              <motion.h1 className={`text-[2.8rem] md:text-[4.5rem] lg:text-[6rem] font-black uppercase tracking-[-0.04em] leading-[.85] ${isDark?"text-white":"text-black"}`}
                initial={{ y:65 }} animate={{ y:0 }} transition={{ duration:.9, ease:[.16,1,.3,1] }}>
                Lo que
              </motion.h1>
            </div>
            <div className="overflow-hidden">
              <motion.h1 className="text-[2.8rem] md:text-[4.5rem] lg:text-[6rem] font-black uppercase tracking-[-0.04em] leading-[.85]"
                style={{ WebkitTextStroke:isDark?"1.5px rgba(255,255,255,.2)":"1.5px rgba(0,0,0,.18)", color:"transparent" }}
                initial={{ y:65 }} animate={{ y:0 }} transition={{ duration:.9, delay:.07, ease:[.16,1,.3,1] }}>
                construyo
              </motion.h1>
            </div>
          </div>
          <motion.p className={`text-sm md:text-base font-light leading-relaxed max-w-xs pb-1 ${isDark?"text-white/40":"text-black/45"}`}
            initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} transition={{ duration:.7, delay:.3 }}>
            5 disciplinas, un mismo estándar. Selecciona un servicio para ver proceso, tecnología e inversión.
          </motion.p>
        </div>

        <div className="mt-8 flex items-center justify-between"
          style={{ borderTop:isDark?"1px solid rgba(255,255,255,.05)":"1px solid rgba(0,0,0,.06)", paddingTop:12 }}>
          <span className={`text-[9px] tracking-[.3em] uppercase ${isDark?"text-white/14":"text-black/14"}`}>Servicios disponibles</span>
          <span className={`font-mono text-[9px] ${isDark?"text-white/10":"text-black/10"}`}>01 — 05</span>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          SPREAD LATERAL
          ─ Mobile/tablet: columna izq encima (ancho 100%), imagen abajo
          ─ Desktop lg+: columna izq fija 300px sticky, imagen ocupa el resto
      ══════════════════════════════════════════════════════════════════════ */}
      <section className="relative z-20"
        style={{ borderTop:isDark?"1px solid rgba(255,255,255,.06)":"1px solid rgba(0,0,0,.07)" }}>

        {/* Contenedor flex — en lg es row, antes es column */}
        <div className="flex flex-col lg:flex-row lg:items-stretch" style={{ minHeight:"75vh" }}>

          {/* ── COLUMNA IZQUIERDA ──────────────────────────────────────────
              Mobile:  ancho 100%, altura automática, no sticky
              Desktop: ancho fijo 300px, sticky top-0, altura 100vh
          ────────────────────────────────────────────────────────────────── */}
          <div
            className="w-full lg:w-[300px] lg:shrink-0 lg:sticky lg:top-0 lg:self-start lg:h-screen
                       flex flex-col justify-between
                       px-6 py-6 lg:px-7 lg:py-8"
            style={{
              background: colBg,
              borderBottom: isDark?"1px solid rgba(255,255,255,.06)":"1px solid rgba(0,0,0,.07)",
              /* en lg borramos el border-bottom y ponemos border-right */
            }}
          >
            {/* Label "selecciona" — solo desktop */}
            <div className="hidden lg:block mb-8">
              <span className={`text-[9px] uppercase tracking-[.3em] ${isDark?"text-white/18":"text-black/18"}`}>Selecciona un servicio</span>
            </div>

            {/* Lista de servicios
                Mobile: fila horizontal con wrap
                Desktop: columna vertical centrada */}
            <div className="flex flex-row flex-wrap gap-2 lg:flex-col lg:flex-nowrap lg:gap-0 lg:flex-1 lg:justify-center">
              {services.map((s, i) => {
                const isActive = active === i
                return (
                  <button
                    key={s.slug}
                    onClick={() => handleSelect(i)}
                    className="text-left"
                    style={{
                      padding:"11px 14px",
                      borderRadius:10,
                      background: isActive
                        ? (isDark?"rgba(255,255,255,.07)":"rgba(0,0,0,.06)")
                        : "transparent",
                      border: isActive
                        ? (isDark?"1px solid rgba(255,255,255,.10)":"1px solid rgba(0,0,0,.08)")
                        : "1px solid transparent",
                      cursor:"pointer",
                      transition:"background .25s, border-color .25s",
                      /* mobile: ancho auto, desktop: ancho 100% */
                      width: "auto",
                    }}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2.5 min-w-0">
                        {/* Indicador línea */}
                        <motion.div
                          animate={{
                            width: isActive ? 14 : 4,
                            background: isActive
                              ? (isDark?"#fff":"#111")
                              : (isDark?"rgba(255,255,255,.2)":"rgba(0,0,0,.15)"),
                          }}
                          transition={{ duration:.3 }}
                          style={{ height:1.5, borderRadius:1, flexShrink:0 }}
                        />
                        <div className="min-w-0">
                          <span className={`font-mono text-[8px] block mb-0.5 ${isDark?"text-white/20":"text-black/20"}`}>{s.index}</span>
                          <span
                            className="text-xs font-semibold uppercase tracking-[-0.01em] leading-tight block whitespace-nowrap"
                            style={{ color: isActive ? (isDark?"#fff":"#111") : (isDark?"rgba(255,255,255,.42)":"rgba(0,0,0,.42)"), transition:"color .25s" }}
                          >
                            {s.nameFlat}
                          </span>
                        </div>
                      </div>

                      {/* + solo en desktop */}
                      <motion.span
                        className="text-xs shrink-0 hidden lg:block"
                        animate={{ rotate: expanded===i ? 45 : 0, opacity: isActive ? 1 : 0.3 }}
                        transition={{ duration:.2 }}
                        style={{ color:isDark?"rgba(255,255,255,.4)":"rgba(0,0,0,.35)" }}
                      >
                        +
                      </motion.span>
                    </div>

                    {/* Precio — solo cuando activo, solo desktop */}
                    <AnimatePresence>
                      {isActive && (
                        <motion.div
                          initial={{ opacity:0, height:0 }}
                          animate={{ opacity:1, height:"auto" }}
                          exit={{ opacity:0, height:0 }}
                          transition={{ duration:.22 }}
                          className="overflow-hidden hidden lg:block"
                        >
                          <span className={`font-mono text-[8px] block mt-1.5 pl-[26px] ${isDark?"text-white/28":"text-black/28"}`}>
                            {s.pricing[0].price}
                          </span>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </button>
                )
              })}
            </div>

            {/* CTA cotizar — solo desktop, abajo */}
            <motion.a
              href={WA_URL} target="_blank" rel="noopener noreferrer"
              className="hidden lg:flex items-center gap-3 group mt-8"
              style={{ textDecoration:"none" }}
              whileHover={{ x:4 }}
            >
              <span
                className="group-hover:w-10 transition-all duration-300"
                style={{ display:"inline-block", width:20, height:.5, background:isDark?"rgba(255,255,255,.2)":"rgba(0,0,0,.2)" }}
              />
              <span
                className="group-hover:opacity-60 transition-opacity duration-300"
                style={{ fontSize:10, textTransform:"uppercase", letterSpacing:".2em", color:isDark?"rgba(255,255,255,.3)":"rgba(0,0,0,.28)" }}
              >
                Cotizar
              </span>
            </motion.a>
          </div>

          {/* ── COLUMNA DERECHA — imagen full + panel expandible ────────── */}
          <div className="flex-1 flex flex-col min-w-0"
            style={{ borderLeft:isDark?"1px solid rgba(255,255,255,.06)":"1px solid rgba(0,0,0,.07)" }}>

            {/* Imagen con crossfade */}
            <div className="relative overflow-hidden flex-shrink-0"
              style={{ height:"clamp(260px,55vh,600px)" }}>

              <AnimatePresence mode="wait">
                <motion.div
                  key={`img-${active}`}
                  className="absolute inset-0"
                  initial={{ opacity:0, scale:1.04 }}
                  animate={{ opacity:1, scale:1 }}
                  exit={{ opacity:0, scale:1.02 }}
                  transition={{ duration:.7, ease:[.16,1,.3,1] }}
                >
                  <img
                    src={current.img} alt={current.nameFlat}
                    className="w-full h-full object-cover"
                    style={{ filter:isDark?"grayscale(15%) brightness(.78)":"grayscale(0%) brightness(.92)" }}
                  />
                  {/* Overlay izquierdo */}
                  <div className="absolute inset-0" style={{ background: isDark
                    ?"linear-gradient(to right, rgba(10,10,12,.5) 0%, transparent 45%)"
                    :"linear-gradient(to right, rgba(237,233,224,.5) 0%, transparent 45%)" }}/>
                  {/* Overlay inferior — para el texto */}
                  <div className="absolute inset-0" style={{ background: isDark
                    ?"linear-gradient(to top, rgba(0,0,0,.75) 0%, rgba(0,0,0,.1) 45%, transparent 100%)"
                    :"linear-gradient(to top, rgba(237,233,224,.85) 0%, rgba(237,233,224,.1) 45%, transparent 100%)" }}/>
                </motion.div>
              </AnimatePresence>

              {/* Texto sobre imagen */}
              <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10 pointer-events-none">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={`txt-${active}`}
                    initial={{ opacity:0, y:18 }}
                    animate={{ opacity:1, y:0 }}
                    exit={{ opacity:0, y:-10 }}
                    transition={{ duration:.5, ease:[.16,1,.3,1] }}
                  >
                    {/* Eyebrow */}
                    <div className="flex items-center gap-3 mb-3">
                      <span className="font-mono text-[9px] text-white/40">{current.index} / 05</span>
                      <div style={{ width:20, height:.5, background:"rgba(255,255,255,.3)" }}/>
                      <span className="text-[9px] uppercase tracking-[.22em] text-white/45">{current.tagline}</span>
                    </div>

                    {/* Nombre grande */}
                    <h2
                      className="font-black uppercase text-white"
                      style={{ fontSize:"clamp(1.9rem,4.5vw,3.5rem)", letterSpacing:"-.03em", lineHeight:.87, textShadow:"0 2px 24px rgba(0,0,0,.5)" }}
                    >
                      {current.name.split("\n").map((line, i) => (
                        <span key={i} className="block">{line}</span>
                      ))}
                    </h2>

                    {/* Stack pills */}
                    <div className="flex flex-wrap gap-1.5 mt-4">
                      {current.stack.slice(0,4).map(t => (
                        <span key={t} className="text-[8px] px-2.5 py-1 rounded-full font-mono text-white/65"
                          style={{ background:"rgba(255,255,255,.12)", border:"1px solid rgba(255,255,255,.18)" }}>
                          {t}
                        </span>
                      ))}
                      {current.stack.length > 4 && (
                        <span className="text-[8px] px-2.5 py-1 rounded-full font-mono text-white/45"
                          style={{ background:"rgba(255,255,255,.07)", border:"1px solid rgba(255,255,255,.12)" }}>
                          +{current.stack.length-4}
                        </span>
                      )}
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Botón "Ver detalle" */}
              <div className="absolute top-4 right-5 z-10">
                <motion.button
                  onClick={() => setExpanded(expanded===active ? null : active)}
                  className="flex items-center gap-2 px-4 py-2 cursor-pointer"
                  style={{
                    borderRadius:20,
                    background: isDark?"rgba(0,0,0,.55)":"rgba(255,255,255,.7)",
                    border: isDark?"1px solid rgba(255,255,255,.15)":"1px solid rgba(0,0,0,.1)",
                    backdropFilter:"blur(8px)",
                  }}
                  whileHover={{ scale:1.03 }} whileTap={{ scale:.97 }}
                >
                  <span className="text-[9px] uppercase tracking-[.2em]"
                    style={{ color:isDark?"rgba(255,255,255,.75)":"rgba(0,0,0,.65)" }}>
                    {expanded===active ? "Cerrar" : "Ver detalle"}
                  </span>
                  <motion.span
                    animate={{ rotate:expanded===active ? 45 : 0 }}
                    transition={{ duration:.2 }}
                    style={{ fontSize:13, color:isDark?"rgba(255,255,255,.5)":"rgba(0,0,0,.4)" }}
                  >
                    +
                  </motion.span>
                </motion.button>
              </div>

              {/* Bracket decorativo */}
              <div className={`absolute bottom-5 right-6 w-4 h-4 border-r border-b pointer-events-none ${isDark?"border-white/20":"border-white/40"}`}/>
            </div>

            {/* Panel de detalle expandible */}
            <AnimatePresence>
              {expanded === active && (
                <DetailPanel service={current} isDark={isDark}/>
              )}
            </AnimatePresence>

            {/* Barra prev/next */}
            <div
              className="flex items-center justify-between px-6 md:px-10 py-4"
              style={{
                background: colBg,
                borderTop: isDark?"1px solid rgba(255,255,255,.05)":"1px solid rgba(0,0,0,.06)",
                marginTop:"auto",
              }}
            >
              <button
                onClick={() => { setActive(a => (a-1+services.length)%services.length); setExpanded(null) }}
                className="flex items-center gap-2.5 group cursor-pointer"
                style={{ background:"none", border:"none", padding:0 }}
              >
                <motion.span whileHover={{ x:-3 }} className={`text-sm ${isDark?"text-white/30":"text-black/25"}`}>←</motion.span>
                <span className={`text-[9px] uppercase tracking-[.2em] ${isDark?"text-white/28":"text-black/22"}`}>Anterior</span>
              </button>

              {/* Dots */}
              <div className="flex items-center gap-2">
                {services.map((_,i) => (
                  <motion.button
                    key={i}
                    onClick={() => { setActive(i); setExpanded(null) }}
                    animate={{
                      width: active===i ? 16 : 4,
                      background: active===i ? (isDark?"#fff":"#111") : (isDark?"rgba(255,255,255,.2)":"rgba(0,0,0,.15)"),
                    }}
                    transition={{ duration:.3 }}
                    style={{ height:3, borderRadius:2, border:"none", cursor:"pointer", padding:0 }}
                  />
                ))}
              </div>

              <button
                onClick={() => { setActive(a => (a+1)%services.length); setExpanded(null) }}
                className="flex items-center gap-2.5 group cursor-pointer"
                style={{ background:"none", border:"none", padding:0 }}
              >
                <span className={`text-[9px] uppercase tracking-[.2em] ${isDark?"text-white/28":"text-black/22"}`}>Siguiente</span>
                <motion.span whileHover={{ x:3 }} className={`text-sm ${isDark?"text-white/30":"text-black/25"}`}>→</motion.span>
              </button>
            </div>

          </div>
        </div>
      </section>

      {/* ── CTA FINAL ── */}
      <section className="relative z-20 px-6 md:px-12 py-28 max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-end justify-between gap-12"
        style={{ borderTop:isDark?"1px solid rgba(255,255,255,.05)":"1px solid rgba(0,0,0,.06)" }}>
        <motion.div initial={{ opacity:0, y:24 }} whileInView={{ opacity:1, y:0 }} transition={{ duration:.7 }} viewport={{ once:true }}>
          <span className={`text-[9px] tracking-[.35em] uppercase block mb-4 ${isDark?"text-white/20":"text-black/22"}`}>¿Listo para empezar?</span>
          <h2 className={`text-5xl md:text-7xl font-black uppercase tracking-[-0.04em] leading-[.86] ${isDark?"text-white":"text-black"}`}>
            Hablemos<br/>
            <span style={{ WebkitTextStroke:isDark?"1.5px rgba(255,255,255,.2)":"1.5px rgba(0,0,0,.18)", color:"transparent" }}>de tu proyecto</span>
          </h2>
        </motion.div>
        <div className="flex flex-col gap-4 shrink-0">
          {[
            { label:"WhatsApp",  href:WA_URL },
            { label:"Email",     href:"mailto:andres@tudominio.com" },
            { label:"Instagram", href:"https://instagram.com/tu_usuario" },
          ].map(({ label, href }, i) => (
            <motion.a key={label} href={href} target={href.startsWith("http")?"_blank":undefined} rel="noopener noreferrer"
              className={`group flex items-center gap-4 text-sm uppercase tracking-[.2em] transition-all duration-300 ${isDark?"text-white/38 hover:text-white":"text-black/32 hover:text-black"}`}
              initial={{ opacity:0, x:12 }} whileInView={{ opacity:1, x:0 }}
              transition={{ duration:.5, delay:i*.08 }} viewport={{ once:true }}
              whileHover={{ x:4 }} style={{ textDecoration:"none" }}>
              <span className={`h-px transition-all duration-300 group-hover:w-10 ${isDark?"bg-white/18 group-hover:bg-white/48":"bg-black/12 group-hover:bg-black/30"}`} style={{ width:20 }}/>
              {label}
            </motion.a>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-20 py-8 px-6 md:px-12 flex items-center justify-between"
        style={{ background:pageBg, borderTop:isDark?"1px solid rgba(255,255,255,.04)":"1px solid rgba(0,0,0,.05)" }}>
        <span className={`text-[9px] tracking-[.4em] uppercase ${isDark?"text-white/12":"text-black/14"}`}>Andres Prada</span>
        <span className={`font-mono text-[9px] ${isDark?"text-white/10":"text-black/10"}`}>© 2026</span>
        <span className={`text-[9px] tracking-[.4em] uppercase ${isDark?"text-white/12":"text-black/14"}`}>Bogotá, CO</span>
      </footer>
    </div>
  )
}