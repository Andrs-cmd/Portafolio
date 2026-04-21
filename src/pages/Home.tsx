import { motion, AnimatePresence, useScroll, useTransform, useMotionValue, useSpring } from "framer-motion"
import { useState, useEffect, useRef } from "react"
import { createPortal } from "react-dom"
import { useTheme } from "../context/ThemeContext"
import LiquidEther from "../components/LiquidEther"
import CardNav from "../components/CardNav"
import ScrollStack, { ScrollStackItem } from "../components/ScrollStack"
import "../components/CardNav.css"
import "../components/ScrollStack.css"

/* ─────────────────────────────────────────────────────────────────────────────
   DATOS
───────────────────────────────────────────────────────────────────────────── */

const services = [
  { index: "01", name: "Desarrollo de Software",     desc: "Aplicaciones a medida" },
  { index: "02", name: "Páginas Web",                desc: "Landing · Ecommerce · Académicas" },
  { index: "03", name: "Animaciones Audioreactivas", desc: "Visuales que responden al sonido" },
  { index: "04", name: "Fotografía",                 desc: "Editorial y comercial" },
  { index: "05", name: "Esculturas & Arte",          desc: "Piezas físicas y conceptuales" },
]

const projectsData = [
  {
    id: 1, index: "001", title: "Proyecto Web", category: "Desarrollo Web", year: "2025",
    img: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=900",
    darkBg: "rgba(10,8,18,0.93)", lightBg: "rgba(240,236,228,0.96)",
  },
  {
    id: 2, index: "002", title: "Tienda Online", category: "Ecommerce", year: "2025",
    img: "https://images.unsplash.com/photo-1557821552-17105176677c?auto=format&fit=crop&q=80&w=900",
    darkBg: "rgba(18,10,10,0.93)", lightBg: "rgba(248,240,235,0.96)",
  },
  {
    id: 3, index: "003", title: "Visual Reactivo", category: "Audioreactivo", year: "2024",
    img: "https://images.unsplash.com/photo-1617802690992-15d93263d3a9?auto=format&fit=crop&q=80&w=900",
    darkBg: "rgba(5,15,18,0.93)", lightBg: "rgba(232,242,245,0.96)",
  },
  {
    id: 4, index: "004", title: "Portafolio", category: "Fotografía", year: "2024",
    img: "https://images.unsplash.com/photo-1554080353-a576cf803bda?auto=format&fit=crop&q=80&w=900",
    darkBg: "rgba(12,10,8,0.93)", lightBg: "rgba(245,242,235,0.96)",
  },
]

const galleryData = [
  { img: "https://images.unsplash.com/photo-1554080353-a576cf803bda?auto=format&fit=crop&q=80&w=600",  label: "Fotografía", sub: "Editorial · 2025",   tall: true  },
  { img: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&q=80&w=600",  label: "Escultura",  sub: "Arte físico · 2024", tall: false },
  { img: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&q=80&w=600",label: "Fotografía", sub: "Naturaleza · 2024",  tall: false },
  { img: "https://images.unsplash.com/photo-1531305653978-e7a47a16e93e?auto=format&fit=crop&q=80&w=600",label: "Escultura",  sub: "Conceptual · 2023",  tall: true  },
  { img: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&q=80&w=600",label: "Fotografía", sub: "Retrato · 2025",     tall: false },
  { img: "https://images.unsplash.com/photo-1561214115-f2f134cc4912?auto=format&fit=crop&q=80&w=600",  label: "Arte",       sub: "Mixto · 2024",       tall: false },
]

/* ─────────────────────────────────────────────────────────────────────────────
   THEME TOGGLE — portal a document.body
───────────────────────────────────────────────────────────────────────────── */

function ThemeToggle() {
  const { isDark, toggleTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  useEffect(() => { setMounted(true) }, [])

  const trackBg     = isDark ? "rgba(255,255,255,0.10)" : "rgba(0,0,0,0.08)"
  const trackBorder = isDark ? "rgba(255,255,255,0.22)" : "rgba(0,0,0,0.16)"
  const thumbBg     = isDark ? "#ffffff" : "#111111"
  const iconColor   = isDark ? "#ffffff" : "#111111"

  const toggle = (
    <div style={{ position: "fixed", top: 20, right: 20, zIndex: 9999, display: "flex", alignItems: "center", gap: 8, userSelect: "none" }}>
      <div style={{ opacity: !isDark ? 1 : 0.28, transition: "opacity 0.35s", display: "flex", alignItems: "center", justifyContent: "center", width: 20, height: 20 }}>
        <svg width="11" height="15" viewBox="0 0 11 15" fill="none">
          <path d="M7 1L1 8h4.5L4 14l6.5-7.5H6L7 1z" fill={iconColor} stroke={iconColor} strokeWidth="0.4" strokeLinejoin="round" />
        </svg>
      </div>
      <button
        onClick={toggleTheme}
        aria-label="Cambiar tema"
        style={{ position: "relative", width: 52, height: 28, borderRadius: 14, background: trackBg, border: `1px solid ${trackBorder}`, cursor: "pointer", outline: "none", padding: 0, flexShrink: 0, transition: "background 0.4s, border-color 0.4s" }}
      >
        <motion.div
          animate={{ x: isDark ? 26 : 2 }}
          transition={{ type: "spring", stiffness: 420, damping: 32 }}
          style={{ position: "absolute", top: 2, left: 0, width: 22, height: 22, borderRadius: "50%", background: thumbBg, boxShadow: isDark ? "0 1px 5px rgba(0,0,0,0.55)" : "0 1px 5px rgba(0,0,0,0.20)" }}
        />
      </button>
      <div style={{ opacity: isDark ? 1 : 0.28, transition: "opacity 0.35s", display: "flex", alignItems: "center", justifyContent: "center", width: 20, height: 20 }}>
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
          <path d="M10.5 7.8A5.5 5.5 0 0 1 4.2 1.5a5 5 0 1 0 6.3 6.3z" fill={iconColor} stroke={iconColor} strokeWidth="0.4" strokeLinejoin="round" />
        </svg>
      </div>
    </div>
  )

  return mounted ? createPortal(toggle, document.body) : null
}

/* ─────────────────────────────────────────────────────────────────────────────
   SCROLL PROGRESS BAR
───────────────────────────────────────────────────────────────────────────── */

function ScrollBar() {
  const { scrollYProgress } = useScroll()
  const width = useTransform(scrollYProgress, [0, 1], ["0%", "100%"])
  const { isDark } = useTheme()
  return (
    <motion.div
      className="fixed top-0 left-0 h-[1.5px] z-[300] pointer-events-none"
      style={{ width, background: isDark ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.25)" }}
    />
  )
}

/* ─────────────────────────────────────────────────────────────────────────────
   HERO IMAGE PANEL
───────────────────────────────────────────────────────────────────────────── */

const heroImages = [
  "https://images.unsplash.com/photo-1554080353-a576cf803bda?auto=format&fit=crop&q=80&w=800",
  "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&q=80&w=800",
  "https://images.unsplash.com/photo-1617802690992-15d93263d3a9?auto=format&fit=crop&q=80&w=800",
]

function HeroImagePanel() {
  const { isDark } = useTheme()
  const [current, setCurrent] = useState(0)
  useEffect(() => {
    const timer = setInterval(() => setCurrent(c => (c + 1) % heroImages.length), 4000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="relative w-full h-full overflow-hidden">
      <AnimatePresence>
        <motion.img
          key={current} src={heroImages[current]} alt="hero"
          className="absolute inset-0 w-full h-full object-cover"
          style={{ filter: isDark ? "grayscale(30%) brightness(0.75)" : "grayscale(0%) brightness(0.92)" }}
          initial={{ opacity: 0, scale: 1.04 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: "easeInOut" }}
        />
      </AnimatePresence>
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: isDark ? "linear-gradient(to right, rgba(6,6,6,0.45) 0%, transparent 40%)" : "linear-gradient(to right, rgba(245,241,233,0.45) 0%, transparent 40%)" }}
      />
      <div className={`absolute top-6 left-6 w-6 h-6 border-l border-t pointer-events-none transition-colors duration-500 ${isDark ? "border-white/30" : "border-black/20"}`} />
      <div className={`absolute bottom-6 right-6 w-6 h-6 border-r border-b pointer-events-none transition-colors duration-500 ${isDark ? "border-white/30" : "border-black/20"}`} />
      <div className="absolute bottom-6 left-6 flex items-center gap-2">
        {heroImages.map((_, i) => (
          <motion.div key={i} className="rounded-full"
            animate={{ width: i === current ? 16 : 4, height: 4 }}
            style={{ background: isDark ? (i === current ? "rgba(255,255,255,0.8)" : "rgba(255,255,255,0.2)") : (i === current ? "rgba(0,0,0,0.5)" : "rgba(0,0,0,0.15)") }}
            transition={{ duration: 0.3 }}
          />
        ))}
      </div>
      <div className={`absolute top-6 right-6 text-[9px] tracking-[0.3em] uppercase transition-colors duration-500 ${isDark ? "text-white/40" : "text-black/35"}`}>
        Fotografía · Arte
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────────────────────────────────────────
   HERO TEXT — componente separado con su propio listener de mouse
   CLAVE: useMotionValue + useSpring en lugar de useState
   → Framer interpola internamente sin causar re-renders de React
   → El CardNav (GSAP) nunca ve un re-render cuando mueves el mouse
───────────────────────────────────────────────────────────────────────────── */

function HeroText() {
  const { isDark } = useTheme()

  // MotionValues — actualizan el DOM directamente, sin re-render
  const rawX = useMotionValue(0)
  const rawY = useMotionValue(0)
  const x = useSpring(rawX, { stiffness: 40, damping: 20 })
  const y = useSpring(rawY, { stiffness: 40, damping: 20 })

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      rawX.set((e.clientX / window.innerWidth  - 0.5) * 18)
      rawY.set((e.clientY / window.innerHeight - 0.5) * 18)
    }
    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [rawX, rawY])

  return (
    <motion.div
      className="flex flex-col px-10 md:px-14 py-20 md:py-0 w-full pointer-events-none"
      style={{ x, y }}
    >
      <motion.div className="flex items-center gap-3 mb-10" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.1 }}>
        <div className={`w-6 h-px transition-colors duration-500 ${isDark ? "bg-white/20" : "bg-black/20"}`} />
        <span className={`text-[9px] tracking-[0.3em] uppercase transition-colors duration-500 ${isDark ? "text-white/30" : "text-black/30"}`}>Developer & Visual Creator</span>
      </motion.div>

      <div className="overflow-hidden mb-1">
        <motion.h1
          className="text-[4.5rem] md:text-[6rem] lg:text-[7.5rem] font-black uppercase tracking-[-0.04em] leading-[0.85] transition-colors duration-500"
          style={{ color: isDark ? "#fff" : "#111" }}
          initial={{ y: 90 }} animate={{ y: 0 }}
          transition={{ duration: 0.9, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
        >Andres</motion.h1>
      </div>
      <div className="overflow-hidden mb-10">
        <motion.h1
          className="text-[4.5rem] md:text-[6rem] lg:text-[7.5rem] font-black uppercase tracking-[-0.04em] leading-[0.85]"
          style={{ WebkitTextStroke: isDark ? "1.5px rgba(255,255,255,0.25)" : "1.5px rgba(0,0,0,0.2)", color: "transparent", transition: "all 0.5s" }}
          initial={{ y: 90 }} animate={{ y: 0 }}
          transition={{ duration: 0.9, delay: 0.22, ease: [0.16, 1, 0.3, 1] }}
        >Prada</motion.h1>
      </div>

      <motion.p
        className={`text-base md:text-lg font-light leading-relaxed max-w-xs mb-12 transition-colors duration-500 ${isDark ? "text-white/40" : "text-black/45"}`}
        initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.5 }}
      >
        Construyo experiencias digitales que viven entre el código, el movimiento y el arte.
      </motion.p>

      <motion.div className="flex flex-col gap-1" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}>
        {services.slice(0, 4).map((s) => (
          <div key={s.index} className="flex items-center gap-3">
            <span className={`font-mono text-[9px] transition-colors duration-500 ${isDark ? "text-white/15" : "text-black/15"}`}>{s.index}</span>
            <span className={`text-xs transition-colors duration-500 ${isDark ? "text-white/35" : "text-black/40"}`}>{s.name}</span>
          </div>
        ))}
      </motion.div>
    </motion.div>
  )
}

/* ─────────────────────────────────────────────────────────────────────────────
   SERVICE ROW
───────────────────────────────────────────────────────────────────────────── */

function ServiceRow({ index, name, desc, delay, isDark }: { index: string; name: string; desc: string; delay: number; isDark: boolean }) {
  const [hovered, setHovered] = useState(false)
  return (
    <motion.div
      className={`relative flex items-center gap-5 py-5 border-b overflow-hidden cursor-default transition-colors duration-500 ${isDark ? "border-white/[0.06]" : "border-black/[0.06]"}`}
      onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      initial={{ opacity: 0, x: -16 }} whileInView={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay }} viewport={{ once: true }}
    >
      <motion.div className={`absolute inset-0 ${isDark ? "bg-white/[0.025]" : "bg-black/[0.025]"}`} initial={{ scaleX: 0 }} animate={{ scaleX: hovered ? 1 : 0 }} style={{ originX: 0 }} transition={{ duration: 0.35 }} />
      <span className={`font-mono text-[10px] w-6 shrink-0 transition-colors duration-500 ${isDark ? "text-white/20" : "text-black/20"}`}>{index}</span>
      <div className="flex-1 flex flex-col md:flex-row md:items-center md:justify-between gap-0.5 md:gap-0">
        <motion.span className={`text-sm md:text-base font-light tracking-wide transition-colors duration-500 ${isDark ? "text-white/80" : "text-black/75"}`} animate={{ x: hovered ? 6 : 0 }} transition={{ duration: 0.25 }}>{name}</motion.span>
        <span className={`text-[10px] tracking-widest uppercase transition-colors duration-500 ${isDark ? "text-white/20" : "text-black/20"}`}>{desc}</span>
      </div>
      <motion.span className={`text-xs shrink-0 transition-colors duration-500 ${isDark ? "text-white/30" : "text-black/25"}`} animate={{ x: hovered ? 0 : 8, opacity: hovered ? 1 : 0 }} transition={{ duration: 0.2 }}>→</motion.span>
    </motion.div>
  )
}

/* ─────────────────────────────────────────────────────────────────────────────
   GALLERY ITEM
───────────────────────────────────────────────────────────────────────────── */

function GalleryItem({ item, i, isDark }: { item: typeof galleryData[0]; i: number; isDark: boolean }) {
  const [hovered, setHovered] = useState(false)
  return (
    <motion.div className="relative overflow-hidden cursor-pointer" style={{ gridRow: item.tall ? "span 2" : "span 1", aspectRatio: item.tall ? undefined : "4/3" }} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: i * 0.07 }} viewport={{ once: true }}>
      <motion.img src={item.img} alt={item.label} className="w-full h-full object-cover"
        animate={{ scale: hovered ? 1.06 : 1, filter: isDark ? hovered ? "grayscale(0%) brightness(0.9)" : "grayscale(50%) brightness(0.7)" : hovered ? "grayscale(0%) brightness(1.0)" : "grayscale(30%) brightness(0.95)" }}
        transition={{ duration: 0.55 }}
      />
      <motion.div className={`absolute inset-0 flex flex-col justify-end p-4 ${isDark ? "bg-black/55" : "bg-white/60"}`} animate={{ opacity: hovered ? 1 : 0 }} transition={{ duration: 0.3 }}>
        <span className={`text-[9px] tracking-[0.25em] uppercase mb-1 ${isDark ? "text-white/50" : "text-black/40"}`}>{item.sub}</span>
        <span className={`text-sm font-light ${isDark ? "text-white" : "text-black"}`}>{item.label}</span>
      </motion.div>
      <motion.div className={`absolute top-3 left-3 w-4 h-4 border-l border-t transition-colors duration-500 ${isDark ? "border-white/40" : "border-black/30"}`} animate={{ opacity: hovered ? 1 : 0, scale: hovered ? 1 : 0.6 }} transition={{ duration: 0.2 }} />
      <motion.div className={`absolute bottom-3 right-3 w-4 h-4 border-r border-b transition-colors duration-500 ${isDark ? "border-white/40" : "border-black/30"}`} animate={{ opacity: hovered ? 1 : 0, scale: hovered ? 1 : 0.6 }} transition={{ duration: 0.2 }} />
    </motion.div>
  )
}

/* ─────────────────────────────────────────────────────────────────────────────
   SECTION HEADER
───────────────────────────────────────────────────────────────────────────── */

function SectionHeader({ label, title, accent, right, isDark }: { label: string; title: string; accent: string; right?: string; isDark: boolean }) {
  return (
    <motion.div className="flex items-end justify-between mb-14" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true }}>
      <div>
        <span className={`text-[9px] tracking-[0.35em] uppercase block mb-3 transition-colors duration-500 ${isDark ? "text-white/20" : "text-black/25"}`}>{label}</span>
        <h2 className={`text-4xl md:text-6xl font-black uppercase tracking-[-0.03em] leading-[0.85] transition-colors duration-500 ${isDark ? "text-white" : "text-black"}`}>
          {title}<br /><span className={`transition-colors duration-500 ${isDark ? "text-white/[0.12]" : "text-black/[0.10]"}`}>{accent}</span>
        </h2>
      </div>
      {right && <span className={`font-mono text-xs hidden md:block pb-1 transition-colors duration-500 ${isDark ? "text-white/15" : "text-black/15"}`}>{right}</span>}
    </motion.div>
  )
}

/* ─────────────────────────────────────────────────────────────────────────────
   MAIN HOME
───────────────────────────────────────────────────────────────────────────── */

export default function Home() {
  const { isDark } = useTheme()

  const WA_NUMBER = "573195768097"
  const WA_URL    = `https://wa.me/${WA_NUMBER}?text=Hola%20Andres%2C%20me%20interesa%20trabajar%20contigo`

  const menuItems = [
    {
      label: "Servicios",
      bgColor: isDark ? "#111111" : "#f0ece4",
      textColor: isDark ? "#fff" : "#000",
      links: [
        { label: "Desarrollo Web", href: "/servicios#web",       ariaLabel: "Ir a Desarrollo Web" },
        { label: "Ecommerce",      href: "/servicios#ecommerce",  ariaLabel: "Ir a Ecommerce" },
      ],
    },
    {
      label: "Proyectos",
      bgColor: isDark ? "#1a1a1a" : "#e8e4dc",
      textColor: isDark ? "#fff" : "#000",
      links: [
        { label: "Ver todos",   href: "/archive", ariaLabel: "Ver todos los proyectos" },
        { label: "Lab / Demos", href: "/lab",      ariaLabel: "Ir al laboratorio" },
      ],
    },
    {
      label: "Contacto",
      bgColor: isDark ? "#dde4e6" : "#1a1a1a",
      textColor: isDark ? "#000" : "#fff",
      links: [
        { label: "WhatsApp", href: WA_URL,                           ariaLabel: "Escribir por WhatsApp" },
        { label: "Email",    href: "mailto:aprada.web@gmail.com",     ariaLabel: "Enviar email" },
      ],
    },
  ]

  const navBaseColor = isDark ? "rgba(6,6,6,0.92)" : "rgba(245,241,233,0.95)"

  return (
    <div
      className="min-h-screen overflow-x-hidden relative transition-colors duration-700"
      style={{ background: isDark ? "#060606" : "#f5f1e9", color: isDark ? "#fff" : "#111" }}
    >
      {/* ── LiquidEther ────────────────────────────────────────────────────── */}
      <div className="fixed inset-0 w-full h-full z-0 pointer-events-none">
        <LiquidEther mouseForce={22} cursorSize={120} resolution={0.8} dt={0.016} viscous={15} isViscous={false} autoIntensity={isDark ? 2.5 : 1.2} />
        <div className="absolute inset-0 z-10 pointer-events-none transition-all duration-700"
          style={{ background: isDark ? "radial-gradient(circle at center, transparent 0%, rgba(0,0,0,0.65) 100%)" : "radial-gradient(circle at center, transparent 0%, rgba(245,241,233,0.7) 100%)" }}
        />
      </div>

      <ScrollBar />
      <ThemeToggle />

      {/* ── Nav — sin onMouseMove en el padre, GSAP no se interrumpe ────────── */}
      <div className="relative">
        <CardNav
          logo="/faviconAP.ico"
          items={menuItems}
          baseColor={navBaseColor}
          menuColor={isDark ? "#fff" : "#111"}
          buttonBgColor={isDark ? "#dde4e6" : "#111"}
          buttonTextColor={isDark ? "#000" : "#fff"}
        />
      </div>

      {/* ══════════════════════════════════════════════════════════════════════
          HERO — split 50/50
          El parallax ahora usa useMotionValue en HeroText (no useState),
          así el movimiento del mouse NO provoca re-renders en el árbol padre.
      ══════════════════════════════════════════════════════════════════════ */}
      <section className="relative z-20 min-h-screen flex flex-col md:flex-row">
        <div className="w-full md:w-1/2 md:sticky md:top-0 md:h-screen overflow-hidden">
          <HeroImagePanel />
        </div>
        <div className="hidden md:block w-px shrink-0 self-stretch transition-colors duration-700"
          style={{ background: isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.06)" }}
        />
        <div className="w-full md:w-1/2 flex items-center justify-center min-h-[60vh] md:min-h-screen relative">
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="absolute left-1/3 top-0 bottom-0 w-px" style={{ background: isDark ? "rgba(255,255,255,0.025)" : "rgba(0,0,0,0.03)" }} />
            <div className="absolute top-1/3 left-0 right-0 h-px" style={{ background: isDark ? "rgba(255,255,255,0.025)" : "rgba(0,0,0,0.03)" }} />
            <div className="absolute top-2/3 left-0 right-0 h-px" style={{ background: isDark ? "rgba(255,255,255,0.025)" : "rgba(0,0,0,0.03)" }} />
          </div>

          {/* Badge disponible */}
          <div className="absolute top-6 left-8 flex items-center gap-2">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
            </span>
            <span className={`text-[9px] tracking-[0.25em] uppercase transition-colors duration-500 ${isDark ? "text-white/25" : "text-black/30"}`}>Disponible</span>
          </div>

          {/* Indicador scroll */}
          <div className="absolute bottom-8 right-8 flex flex-col items-center gap-2 pointer-events-none">
            <div className={`w-px h-10 transition-colors duration-500 ${isDark ? "bg-white/15" : "bg-black/15"}`} />
            <span className={`text-[8px] tracking-[0.3em] uppercase transition-colors duration-500 ${isDark ? "text-white/20" : "text-black/20"}`}>Scroll</span>
          </div>

          {/* Texto con parallax — componente aislado, sin re-renders del padre */}
          <HeroText />
        </div>
      </section>

      {/* ── Divisor ────────────────────────────────────────────────────────── */}
      <div className="relative z-20 mx-6 md:mx-12 flex items-center justify-between py-4 transition-colors duration-500"
        style={{ borderTop: isDark ? "0.5px solid rgba(255,255,255,0.06)" : "0.5px solid rgba(0,0,0,0.07)" }}
      >
        <span className={`text-[9px] tracking-[0.35em] uppercase transition-colors duration-500 ${isDark ? "text-white/15" : "text-black/15"}`}>Selected Works</span>
        <span className={`font-mono text-[9px] transition-colors duration-500 ${isDark ? "text-white/10" : "text-black/10"}`}>2024 — 2026</span>
      </div>

      {/* ══════════════════════════════════════════════════════════════════════
          PROYECTOS
      ══════════════════════════════════════════════════════════════════════ */}
      <section className="relative z-20 py-24">
        <div className="px-6 md:px-12 max-w-7xl mx-auto">
          <SectionHeader label="Proyectos seleccionados" title="Selected" accent="Works" right={`01 — 0${projectsData.length}`} isDark={isDark} />
        </div>
        <div className="w-full px-6 md:px-12">
          <ScrollStack itemDistance={100} itemStackDistance={35} useWindowScroll={true} baseScale={0.92} stackPosition="10%">
            {projectsData.map((project) => (
              <ScrollStackItem key={project.id}>
                <div className="w-full h-full flex flex-col md:flex-row gap-0 overflow-hidden"
                  style={{ backgroundColor: isDark ? project.darkBg : project.lightBg, borderRadius: "36px", border: isDark ? "0.5px solid rgba(255,255,255,0.07)" : "0.5px solid rgba(0,0,0,0.08)", backdropFilter: "blur(8px)" }}
                >
                  <div className="flex-[1.1] flex flex-col justify-between p-8 md:p-12"
                    style={{ borderRight: isDark ? "0.5px solid rgba(255,255,255,0.05)" : "0.5px solid rgba(0,0,0,0.06)" }}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-8">
                        <span className={`font-mono text-[10px] transition-colors duration-500 ${isDark ? "text-white/15" : "text-black/15"}`}>{project.index}</span>
                        <span className="text-[9px] uppercase tracking-[0.25em] px-3 py-1 rounded-full"
                          style={{ border: isDark ? "0.5px solid rgba(255,255,255,0.12)" : "0.5px solid rgba(0,0,0,0.1)", color: isDark ? "rgba(255,255,255,0.35)" : "rgba(0,0,0,0.35)" }}
                        >{project.category}</span>
                      </div>
                      <h3 className="text-4xl md:text-6xl font-black uppercase tracking-[-0.03em] leading-[0.88] mb-5 transition-colors duration-500" style={{ color: isDark ? "#fff" : "#111" }}>{project.title}</h3>
                      <p className={`text-sm md:text-base font-light leading-relaxed max-w-xs transition-colors duration-500 ${isDark ? "text-white/30" : "text-black/35"}`}>
                        Arquitectura web de alto rendimiento construida para una experiencia inmersiva.
                      </p>
                    </div>
                    <div className="flex items-center justify-between mt-8">
                      <span className={`font-mono text-xs transition-colors duration-500 ${isDark ? "text-white/20" : "text-black/20"}`}>{project.year}</span>
                      <motion.button
                        className="flex items-center gap-2 text-[10px] uppercase tracking-[0.15em] px-5 py-2.5 rounded-full group"
                        style={{ border: isDark ? "0.5px solid rgba(255,255,255,0.2)" : "0.5px solid rgba(0,0,0,0.15)", color: isDark ? "rgba(255,255,255,0.6)" : "rgba(0,0,0,0.55)", background: "transparent" }}
                        whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                      >
                        Ver proyecto <span className="group-hover:translate-x-0.5 transition-transform inline-block">→</span>
                      </motion.button>
                    </div>
                  </div>
                  <div className="flex-1 relative overflow-hidden min-h-[220px] md:min-h-0 group">
                    <img src={project.img} alt={project.title} className="w-full h-full object-cover scale-105 group-hover:scale-100 transition-all duration-700"
                      style={{ filter: isDark ? "grayscale(40%) brightness(0.75)" : "grayscale(10%) brightness(0.95)" }}
                    />
                    <div className={`absolute inset-0 group-hover:opacity-0 transition-opacity duration-500 ${isDark ? "bg-black/20" : "bg-white/15"}`} />
                    <div className={`absolute top-4 right-4 w-5 h-5 border-r border-t transition-colors duration-500 ${isDark ? "border-white/20" : "border-black/15"}`} />
                    <div className={`absolute bottom-4 left-4 w-5 h-5 border-l border-b transition-colors duration-500 ${isDark ? "border-white/20" : "border-black/15"}`} />
                  </div>
                </div>
              </ScrollStackItem>
            ))}
          </ScrollStack>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          SERVICIOS
      ══════════════════════════════════════════════════════════════════════ */}
      <section className="relative z-20 px-6 md:px-12 max-w-4xl mx-auto py-24">
        <SectionHeader label="Lo que ofrezco" title="Servicios" accent="& Disciplinas" isDark={isDark} />
        <div>
          {services.map((s, i) => (
            <ServiceRow key={s.index} index={s.index} name={s.name} desc={s.desc} delay={i * 0.07} isDark={isDark} />
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          GALERÍA
      ══════════════════════════════════════════════════════════════════════ */}
      <section className="relative z-20 px-6 md:px-12 py-24">
        <div className="max-w-7xl mx-auto">
          <SectionHeader label="Objetos visuales" title="Foto &" accent="Arte" right="Fotografía · Escultura · Mixto" isDark={isDark} />
          <div className="grid gap-3" style={{ gridTemplateColumns: "repeat(3, 1fr)", gridAutoRows: "200px" }}>
            {galleryData.map((item, i) => (
              <GalleryItem key={i} item={item} i={i} isDark={isDark} />
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          CTA CONTACTO
      ══════════════════════════════════════════════════════════════════════ */}
      <section className="relative z-20 px-6 md:px-12 py-32 max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-end justify-between gap-12"
        style={{ borderTop: isDark ? "0.5px solid rgba(255,255,255,0.05)" : "0.5px solid rgba(0,0,0,0.06)" }}
      >
        <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} viewport={{ once: true }}>
          <span className={`text-[9px] tracking-[0.35em] uppercase block mb-4 transition-colors duration-500 ${isDark ? "text-white/20" : "text-black/25"}`}>Próximo proyecto</span>
          <h2 className="text-5xl md:text-7xl lg:text-8xl font-black uppercase tracking-[-0.04em] leading-[0.86] transition-colors duration-500" style={{ color: isDark ? "#fff" : "#111" }}>
            Hablemos<br />
            <span style={{ WebkitTextStroke: isDark ? "1.5px rgba(255,255,255,0.2)" : "1.5px rgba(0,0,0,0.18)", color: "transparent" }}>de tu idea</span>
          </h2>
        </motion.div>
        <div className="flex flex-col gap-4 shrink-0">
          {[
            { label: "Email",     href: "mailto:andres@tudominio.com" },
            { label: "WhatsApp",  href: WA_URL },
            { label: "Instagram", href: "https://instagram.com/tu_usuario" },
          ].map(({ label, href }, i) => (
            <motion.a key={label} href={href} target={href.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer"
              className={`group flex items-center gap-4 text-sm uppercase tracking-[0.2em] transition-all duration-300 ${isDark ? "text-white/40 hover:text-white" : "text-black/35 hover:text-black"}`}
              initial={{ opacity: 0, x: 12 }} whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: i * 0.08 }} viewport={{ once: true }}
              whileHover={{ x: 4 }}
            >
              <span className={`h-px transition-all duration-300 group-hover:w-10 ${isDark ? "bg-white/20 group-hover:bg-white/50" : "bg-black/15 group-hover:bg-black/35"}`} style={{ width: 20 }} />
              {label}
            </motion.a>
          ))}
        </div>
      </section>

      {/* ── Footer ─────────────────────────────────────────────────────────── */}
      <footer className="relative z-20 py-8 px-6 md:px-12 flex items-center justify-between transition-colors duration-500"
        style={{ borderTop: isDark ? "0.5px solid rgba(255,255,255,0.04)" : "0.5px solid rgba(0,0,0,0.05)" }}
      >
        <span className={`text-[9px] tracking-[0.4em] uppercase transition-colors duration-500 ${isDark ? "text-white/[0.12]" : "text-black/15"}`}>Andres Prada</span>
        <span className={`font-mono text-[9px] transition-colors duration-500 ${isDark ? "text-white/10" : "text-black/[0.12]"}`}>© 2026</span>
        <span className={`text-[9px] tracking-[0.4em] uppercase transition-colors duration-500 ${isDark ? "text-white/[0.12]" : "text-black/15"}`}>Bogotá, CO</span>
      </footer>
    </div>
  )
}