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
   BREAKPOINT HOOK — detecta si es desktop (≥768px)
   Mismo patrón que el Lab fix — garantiza layout sin depender de Tailwind
───────────────────────────────────────────────────────────────────────────── */

function useIsDesktop() {
  const [isDesktop, setIsDesktop] = useState(false)
  useEffect(() => {
    const check = () => setIsDesktop(window.innerWidth >= 768)
    check()
    window.addEventListener("resize", check)
    return () => window.removeEventListener("resize", check)
  }, [])
  return isDesktop
}

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
  const ic = isDark ? "#ffffff" : "#111111"
  const toggle = (
    <div style={{ position:"fixed", top:20, right:20, zIndex:9999, display:"flex", alignItems:"center", gap:8, userSelect:"none" }}>
      <div style={{ opacity:!isDark?1:0.28, transition:"opacity 0.35s", display:"flex", alignItems:"center", justifyContent:"center", width:20, height:20 }}>
        <svg width="11" height="15" viewBox="0 0 11 15" fill="none">
          <path d="M7 1L1 8h4.5L4 14l6.5-7.5H6L7 1z" fill={ic} stroke={ic} strokeWidth="0.4" strokeLinejoin="round"/>
        </svg>
      </div>
      <button onClick={toggleTheme} aria-label="Cambiar tema"
        style={{ position:"relative", width:52, height:28, borderRadius:14, background:isDark?"rgba(255,255,255,0.10)":"rgba(0,0,0,0.08)", border:`1px solid ${isDark?"rgba(255,255,255,0.22)":"rgba(0,0,0,0.16)"}`, cursor:"pointer", outline:"none", padding:0, flexShrink:0, transition:"background 0.4s,border-color 0.4s" }}>
        <motion.div animate={{ x:isDark?26:2 }} transition={{ type:"spring", stiffness:420, damping:32 }}
          style={{ position:"absolute", top:2, left:0, width:22, height:22, borderRadius:"50%", background:isDark?"#fff":"#111", boxShadow:isDark?"0 1px 5px rgba(0,0,0,0.55)":"0 1px 5px rgba(0,0,0,0.20)" }}/>
      </button>
      <div style={{ opacity:isDark?1:0.28, transition:"opacity 0.35s", display:"flex", alignItems:"center", justifyContent:"center", width:20, height:20 }}>
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
          <path d="M10.5 7.8A5.5 5.5 0 0 1 4.2 1.5a5 5 0 1 0 6.3 6.3z" fill={ic} stroke={ic} strokeWidth="0.4" strokeLinejoin="round"/>
        </svg>
      </div>
    </div>
  )
  return mounted ? createPortal(toggle, document.body) : null
}

/* ─────────────────────────────────────────────────────────────────────────────
   SCROLL BAR
───────────────────────────────────────────────────────────────────────────── */

function ScrollBar() {
  const { scrollYProgress } = useScroll()
  const width = useTransform(scrollYProgress, [0,1], ["0%","100%"])
  const { isDark } = useTheme()
  return (
    <motion.div style={{ position:"fixed", top:0, left:0, height:1.5, zIndex:300, pointerEvents:"none", width, background:isDark?"rgba(255,255,255,0.3)":"rgba(0,0,0,0.25)" }}/>
  )
}

/* ─────────────────────────────────────────────────────────────────────────────
   HERO IMAGE PANEL — crossfade automático cada 4s
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
    const timer = setInterval(() => setCurrent(c => (c+1) % heroImages.length), 4000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div style={{ position:"relative", width:"100%", height:"100%", overflow:"hidden" }}>
      <AnimatePresence>
        <motion.img key={current} src={heroImages[current]} alt="hero"
          style={{ position:"absolute", inset:0, width:"100%", height:"100%", objectFit:"cover", filter:isDark?"grayscale(30%) brightness(0.75)":"grayscale(0%) brightness(0.92)" }}
          initial={{ opacity:0, scale:1.04 }} animate={{ opacity:1, scale:1 }} exit={{ opacity:0 }}
          transition={{ duration:1.2, ease:"easeInOut" }}/>
      </AnimatePresence>

      {/* Overlay lateral */}
      <div style={{ position:"absolute", inset:0, pointerEvents:"none", background:isDark?"linear-gradient(to right, rgba(6,6,6,0.45) 0%, transparent 40%)":"linear-gradient(to right, rgba(245,241,233,0.45) 0%, transparent 40%)" }}/>

      {/* Brackets */}
      <div style={{ position:"absolute", top:24, left:24, width:24, height:24, borderLeft:isDark?"1px solid rgba(255,255,255,0.30)":"1px solid rgba(0,0,0,0.20)", borderTop:isDark?"1px solid rgba(255,255,255,0.30)":"1px solid rgba(0,0,0,0.20)", pointerEvents:"none" }}/>
      <div style={{ position:"absolute", bottom:24, right:24, width:24, height:24, borderRight:isDark?"1px solid rgba(255,255,255,0.30)":"1px solid rgba(0,0,0,0.20)", borderBottom:isDark?"1px solid rgba(255,255,255,0.30)":"1px solid rgba(0,0,0,0.20)", pointerEvents:"none" }}/>

      {/* Dots indicadores */}
      <div style={{ position:"absolute", bottom:24, left:24, display:"flex", alignItems:"center", gap:8 }}>
        {heroImages.map((_,i) => (
          <motion.div key={i} className="rounded-full"
            animate={{ width:i===current?16:4, height:4 }}
            style={{ background:isDark?(i===current?"rgba(255,255,255,0.8)":"rgba(255,255,255,0.2)"):(i===current?"rgba(0,0,0,0.5)":"rgba(0,0,0,0.15)") }}
            transition={{ duration:0.3 }}/>
        ))}
      </div>

      {/* Label */}
      <div style={{ position:"absolute", top:24, right:24, fontSize:9, letterSpacing:".3em", textTransform:"uppercase", color:isDark?"rgba(255,255,255,0.40)":"rgba(0,0,0,0.35)" }}>
        Fotografía · Arte
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────────────────────────────────────────
   HERO TEXT — useMotionValue para parallax sin re-renders
───────────────────────────────────────────────────────────────────────────── */

function HeroText() {
  const { isDark } = useTheme()
  const rawX = useMotionValue(0)
  const rawY = useMotionValue(0)
  const x = useSpring(rawX, { stiffness:40, damping:20 })
  const y = useSpring(rawY, { stiffness:40, damping:20 })

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      rawX.set((e.clientX/window.innerWidth  - 0.5) * 18)
      rawY.set((e.clientY/window.innerHeight - 0.5) * 18)
    }
    window.addEventListener("mousemove", onMove)
    return () => window.removeEventListener("mousemove", onMove)
  }, [rawX, rawY])

  return (
    <motion.div style={{ display:"flex", flexDirection:"column", padding:"80px 56px", width:"100%", pointerEvents:"none", x, y }}>

      {/* Eyebrow */}
      <motion.div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:40 }}
        initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.7, delay:0.1 }}>
        <div style={{ width:24, height:.5, background:isDark?"rgba(255,255,255,0.20)":"rgba(0,0,0,0.20)" }}/>
        <span style={{ fontSize:9, letterSpacing:".3em", textTransform:"uppercase", color:isDark?"rgba(255,255,255,0.30)":"rgba(0,0,0,0.30)" }}>
          Developer & Visual Creator
        </span>
      </motion.div>

      {/* Andres */}
      <div style={{ overflow:"hidden", marginBottom:4 }}>
        <motion.h1
          style={{ fontSize:"clamp(3.5rem,7vw,7.5rem)", fontWeight:900, textTransform:"uppercase", letterSpacing:"-.04em", lineHeight:.85, color:isDark?"#fff":"#111" }}
          initial={{ y:90 }} animate={{ y:0 }} transition={{ duration:0.9, delay:0.15, ease:[0.16,1,0.3,1] }}>
          Andres
        </motion.h1>
      </div>

      {/* Prada — outline */}
      <div style={{ overflow:"hidden", marginBottom:48 }}>
        <motion.h1
          style={{ fontSize:"clamp(3.5rem,7vw,7.5rem)", fontWeight:900, textTransform:"uppercase", letterSpacing:"-.04em", lineHeight:.85, WebkitTextStroke:isDark?"1.5px rgba(255,255,255,0.25)":"1.5px rgba(0,0,0,0.2)", color:"transparent" }}
          initial={{ y:90 }} animate={{ y:0 }} transition={{ duration:0.9, delay:0.22, ease:[0.16,1,0.3,1] }}>
          Prada
        </motion.h1>
      </div>

      {/* Statement */}
      <motion.p
        style={{ fontSize:15, fontWeight:300, lineHeight:1.8, maxWidth:280, marginBottom:48, color:isDark?"rgba(255,255,255,0.40)":"rgba(0,0,0,0.45)" }}
        initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.7, delay:0.5 }}>
        Construyo experiencias digitales que viven entre el código, el movimiento y el arte.
      </motion.p>

      {/* Mini lista servicios */}
      <motion.div style={{ display:"flex", flexDirection:"column", gap:4 }}
        initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.7 }}>
        {services.slice(0,4).map(s => (
          <div key={s.index} style={{ display:"flex", alignItems:"center", gap:12 }}>
            <span style={{ fontFamily:"monospace", fontSize:9, color:isDark?"rgba(255,255,255,0.15)":"rgba(0,0,0,0.15)" }}>{s.index}</span>
            <span style={{ fontSize:11, color:isDark?"rgba(255,255,255,0.35)":"rgba(0,0,0,0.40)" }}>{s.name}</span>
          </div>
        ))}
      </motion.div>
    </motion.div>
  )
}

/* ─────────────────────────────────────────────────────────────────────────────
   SERVICE ROW
───────────────────────────────────────────────────────────────────────────── */

function ServiceRow({ index, name, desc, delay, isDark }: { index:string; name:string; desc:string; delay:number; isDark:boolean }) {
  const [hovered, setHovered] = useState(false)
  return (
    <motion.div
      style={{ position:"relative", display:"flex", alignItems:"center", gap:20, paddingTop:20, paddingBottom:20, borderBottom:isDark?"1px solid rgba(255,255,255,0.06)":"1px solid rgba(0,0,0,0.06)", overflow:"hidden", cursor:"default" }}
      onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      initial={{ opacity:0, x:-16 }} whileInView={{ opacity:1, x:0 }}
      transition={{ duration:0.5, delay }} viewport={{ once:true }}>
      {/* Hover fill */}
      <motion.div style={{ position:"absolute", inset:0, background:isDark?"rgba(255,255,255,0.025)":"rgba(0,0,0,0.025)", originX:0 }}
        initial={{ scaleX:0 }} animate={{ scaleX:hovered?1:0 }} transition={{ duration:0.35 }}/>
      <span style={{ fontFamily:"monospace", fontSize:10, width:24, flexShrink:0, color:isDark?"rgba(255,255,255,0.20)":"rgba(0,0,0,0.20)" }}>{index}</span>
      <div style={{ flex:1, display:"flex", alignItems:"center", justifyContent:"space-between" }}>
        <motion.span style={{ fontSize:14, fontWeight:300, letterSpacing:".01em", color:isDark?"rgba(255,255,255,0.80)":"rgba(0,0,0,0.75)" }} animate={{ x:hovered?6:0 }} transition={{ duration:0.25 }}>{name}</motion.span>
        <span style={{ fontSize:10, letterSpacing:".15em", textTransform:"uppercase", color:isDark?"rgba(255,255,255,0.20)":"rgba(0,0,0,0.20)" }}>{desc}</span>
      </div>
      <motion.span style={{ fontSize:12, flexShrink:0, color:isDark?"rgba(255,255,255,0.30)":"rgba(0,0,0,0.25)" }}
        animate={{ x:hovered?0:8, opacity:hovered?1:0 }} transition={{ duration:0.2 }}>→</motion.span>
    </motion.div>
  )
}

/* ─────────────────────────────────────────────────────────────────────────────
   GALLERY ITEM
───────────────────────────────────────────────────────────────────────────── */

function GalleryItem({ item, i, isDark }: { item:typeof galleryData[0]; i:number; isDark:boolean }) {
  const [hovered, setHovered] = useState(false)
  return (
    <motion.div style={{ position:"relative", overflow:"hidden", cursor:"pointer", gridRow:item.tall?"span 2":"span 1", aspectRatio:item.tall?undefined:"4/3" }}
      onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      initial={{ opacity:0, y:24 }} whileInView={{ opacity:1, y:0 }}
      transition={{ duration:0.6, delay:i*0.07 }} viewport={{ once:true }}>
      <motion.img src={item.img} alt={item.label} style={{ width:"100%", height:"100%", objectFit:"cover" }}
        animate={{ scale:hovered?1.06:1, filter:isDark?(hovered?"grayscale(0%) brightness(0.9)":"grayscale(50%) brightness(0.7)"):(hovered?"grayscale(0%) brightness(1.0)":"grayscale(30%) brightness(0.95)") }}
        transition={{ duration:0.55 }}/>
      <motion.div style={{ position:"absolute", inset:0, display:"flex", flexDirection:"column", justifyContent:"flex-end", padding:16, background:isDark?"rgba(0,0,0,0.55)":"rgba(255,255,255,0.60)" }}
        animate={{ opacity:hovered?1:0 }} transition={{ duration:0.3 }}>
        <span style={{ fontSize:9, letterSpacing:".25em", textTransform:"uppercase", marginBottom:4, color:isDark?"rgba(255,255,255,0.50)":"rgba(0,0,0,0.40)" }}>{item.sub}</span>
        <span style={{ fontSize:13, fontWeight:300, color:isDark?"#fff":"#111" }}>{item.label}</span>
      </motion.div>
      <motion.div style={{ position:"absolute", top:12, left:12, width:16, height:16, borderLeft:isDark?"1px solid rgba(255,255,255,0.40)":"1px solid rgba(0,0,0,0.30)", borderTop:isDark?"1px solid rgba(255,255,255,0.40)":"1px solid rgba(0,0,0,0.30)" }}
        animate={{ opacity:hovered?1:0, scale:hovered?1:0.6 }} transition={{ duration:0.2 }}/>
      <motion.div style={{ position:"absolute", bottom:12, right:12, width:16, height:16, borderRight:isDark?"1px solid rgba(255,255,255,0.40)":"1px solid rgba(0,0,0,0.30)", borderBottom:isDark?"1px solid rgba(255,255,255,0.40)":"1px solid rgba(0,0,0,0.30)" }}
        animate={{ opacity:hovered?1:0, scale:hovered?1:0.6 }} transition={{ duration:0.2 }}/>
    </motion.div>
  )
}

/* ─────────────────────────────────────────────────────────────────────────────
   SECTION HEADER
───────────────────────────────────────────────────────────────────────────── */

function SectionHeader({ label, title, accent, right, isDark }: { label:string; title:string; accent:string; right?:string; isDark:boolean }) {
  return (
    <motion.div style={{ display:"flex", alignItems:"flex-end", justifyContent:"space-between", marginBottom:56 }}
      initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }} transition={{ duration:0.6 }} viewport={{ once:true }}>
      <div>
        <span style={{ fontSize:9, letterSpacing:".35em", textTransform:"uppercase", display:"block", marginBottom:12, color:isDark?"rgba(255,255,255,0.20)":"rgba(0,0,0,0.25)" }}>{label}</span>
        <h2 style={{ fontSize:"clamp(2.2rem,5vw,4rem)", fontWeight:900, textTransform:"uppercase", letterSpacing:"-.03em", lineHeight:.85, color:isDark?"#fff":"#111" }}>
          {title}<br/>
          <span style={{ color:isDark?"rgba(255,255,255,0.12)":"rgba(0,0,0,0.10)" }}>{accent}</span>
        </h2>
      </div>
      {right && <span style={{ fontFamily:"monospace", fontSize:11, paddingBottom:4, color:isDark?"rgba(255,255,255,0.15)":"rgba(0,0,0,0.15)" }}>{right}</span>}
    </motion.div>
  )
}

/* ─────────────────────────────────────────────────────────────────────────────
   MAIN HOME
───────────────────────────────────────────────────────────────────────────── */

export default function Home() {
  const { isDark } = useTheme()
  const isDesktop = useIsDesktop()

  const WA_NUMBER = "573195768097"
  const WA_URL    = `https://wa.me/${WA_NUMBER}?text=Hola%20Andres%2C%20me%20interesa%20trabajar%20contigo`

  const pageBg   = isDark ? "#060606" : "#f5f1e9"
  const borderC  = isDark ? "0.5px solid rgba(255,255,255,0.06)" : "0.5px solid rgba(0,0,0,0.07)"

  const menuItems = [
    { label:"Servicios", bgColor:isDark?"#111111":"#f0ece4", textColor:isDark?"#fff":"#000",
      links:[{ label:"Desarrollo Web", href:"/lab#svc-software", ariaLabel:"Software" },{ label:"Ecommerce", href:"/lab#svc-web", ariaLabel:"Web" }] },
    { label:"Proyectos", bgColor:isDark?"#1a1a1a":"#e8e4dc", textColor:isDark?"#fff":"#000",
      links:[{ label:"Ver todos", href:"/archive", ariaLabel:"Archive" },{ label:"Lab / Demos", href:"/lab", ariaLabel:"Lab" }] },
    { label:"Contacto", bgColor:isDark?"#dde4e6":"#1a1a1a", textColor:isDark?"#000":"#fff",
      links:[{ label:"WhatsApp", href:WA_URL, ariaLabel:"WhatsApp" },{ label:"Email", href:"mailto:aprada.web@gmail.com", ariaLabel:"Email" }] },
  ]

  return (
    <div style={{ minHeight:"100vh", overflowX:"hidden", background:pageBg, color:isDark?"#fff":"#111", position:"relative" }}>

      {/* ── LiquidEther — z-index 0 ── */}
      <div style={{ position:"fixed", inset:0, zIndex:0, pointerEvents:"none" }}>
        <LiquidEther mouseForce={22} cursorSize={120} resolution={0.8} dt={0.016} viscous={15} isViscous={false} autoIntensity={isDark?2.5:1.2}/>
        <div style={{ position:"absolute", inset:0, zIndex:1, pointerEvents:"none", background:isDark?"radial-gradient(circle at center, transparent 0%, rgba(0,0,0,0.65) 100%)":"radial-gradient(circle at center, transparent 0%, rgba(245,241,233,0.70) 100%)" }}/>
      </div>

      <ScrollBar/>
      <ThemeToggle/>

      {/* ── Nav — z-index 50 ── */}
      <div style={{ position:"relative", zIndex:50 }}>
        <CardNav logo="/faviconAP.ico" items={menuItems}
          baseColor={isDark?"rgba(6,6,6,0.92)":"rgba(245,241,233,0.95)"}
          menuColor={isDark?"#fff":"#111"} buttonBgColor={isDark?"#dde4e6":"#111"} buttonTextColor={isDark?"#000":"#fff"}/>
      </div>

      {/* ══════════════════════════════════════════════════════════════════════
          HERO — split 50/50
          isDesktop → flex row: imagen 50% sticky | texto 50%
          mobile    → flex col: imagen encima | texto abajo
      ══════════════════════════════════════════════════════════════════════ */}
      <section style={{ position:"relative", zIndex:20, minHeight:"100vh", display:"flex", flexDirection:isDesktop?"row":"column" }}>

        {/* Columna imagen */}
        <div style={{
          width: isDesktop ? "50%" : "100%",
          height: isDesktop ? "100vh" : "60vw",
          minHeight: isDesktop ? "100vh" : 280,
          position: isDesktop ? "sticky" : "relative",
          top: isDesktop ? 0 : "auto",
          alignSelf: isDesktop ? "flex-start" : "auto",
          flexShrink: 0,
          overflow:"hidden",
        }}>
          <HeroImagePanel/>
        </div>

        {/* Separador vertical — solo desktop */}
        {isDesktop && (
          <div style={{ width:1, flexShrink:0, alignSelf:"stretch", background:isDark?"rgba(255,255,255,0.05)":"rgba(0,0,0,0.06)" }}/>
        )}

        {/* Columna texto */}
        <div style={{
          flex: isDesktop ? 1 : "none",
          width: isDesktop ? "auto" : "100%",
          display:"flex", alignItems:"center", justifyContent:"center",
          minHeight: isDesktop ? "100vh" : "60vh",
          position:"relative",
        }}>
          {/* Grilla decorativa */}
          <div style={{ position:"absolute", inset:0, pointerEvents:"none", overflow:"hidden" }}>
            <div style={{ position:"absolute", left:"33%", top:0, bottom:0, width:.5, background:isDark?"rgba(255,255,255,0.025)":"rgba(0,0,0,0.03)" }}/>
            <div style={{ position:"absolute", top:"33%", left:0, right:0, height:.5, background:isDark?"rgba(255,255,255,0.025)":"rgba(0,0,0,0.03)" }}/>
            <div style={{ position:"absolute", top:"66%", left:0, right:0, height:.5, background:isDark?"rgba(255,255,255,0.025)":"rgba(0,0,0,0.03)" }}/>
          </div>

          {/* Badge disponible */}
          <div style={{ position:"absolute", top:24, left:32, display:"flex", alignItems:"center", gap:8 }}>
            <span style={{ position:"relative", display:"flex", width:6, height:6 }}>
              <span className="animate-ping" style={{ position:"absolute", display:"inline-flex", width:"100%", height:"100%", borderRadius:"50%", background:"rgb(52,211,153)", opacity:.75 }}/>
              <span style={{ position:"relative", display:"inline-flex", width:6, height:6, borderRadius:"50%", background:"rgb(16,185,129)" }}/>
            </span>
            <span style={{ fontSize:9, letterSpacing:".25em", textTransform:"uppercase", color:isDark?"rgba(255,255,255,0.25)":"rgba(0,0,0,0.30)" }}>Disponible</span>
          </div>

          {/* Indicador scroll */}
          <div style={{ position:"absolute", bottom:32, right:32, display:"flex", flexDirection:"column", alignItems:"center", gap:8, pointerEvents:"none" }}>
            <div style={{ width:.5, height:40, background:isDark?"rgba(255,255,255,0.15)":"rgba(0,0,0,0.15)" }}/>
            <span style={{ fontSize:8, letterSpacing:".3em", textTransform:"uppercase", color:isDark?"rgba(255,255,255,0.20)":"rgba(0,0,0,0.20)" }}>Scroll</span>
          </div>

          {/* HeroText — parallax sin re-renders */}
          <HeroText/>
        </div>
      </section>

      {/* ── Divisor editorial ── */}
      <div style={{ position:"relative", zIndex:20, margin:"0 48px", display:"flex", alignItems:"center", justifyContent:"space-between", padding:"16px 0", borderTop:borderC }}>
        <span style={{ fontSize:9, letterSpacing:".35em", textTransform:"uppercase", color:isDark?"rgba(255,255,255,0.15)":"rgba(0,0,0,0.15)" }}>Selected Works</span>
        <span style={{ fontFamily:"monospace", fontSize:9, color:isDark?"rgba(255,255,255,0.10)":"rgba(0,0,0,0.10)" }}>2024 — 2026</span>
      </div>

      {/* ══════════════════════════════════════════════════════════════════════
          PROYECTOS — ScrollStack (sin cambios de lógica)
      ══════════════════════════════════════════════════════════════════════ */}
      <section style={{ position:"relative", zIndex:20, paddingTop:96, paddingBottom:96 }}>
        <div style={{ padding:"0 48px", maxWidth:1280, margin:"0 auto" }}>
          <SectionHeader label="Proyectos seleccionados" title="Selected" accent="Works" right={`01 — 0${projectsData.length}`} isDark={isDark}/>
        </div>
        <div style={{ padding:"0 48px" }}>
          <ScrollStack itemDistance={100} itemStackDistance={35} useWindowScroll={true} baseScale={0.92} stackPosition="10%">
            {projectsData.map(project => (
              <ScrollStackItem key={project.id}>
                <div style={{ width:"100%", height:"100%", display:"flex", flexDirection:isDesktop?"row":"column", overflow:"hidden", backgroundColor:isDark?project.darkBg:project.lightBg, borderRadius:36, border:isDark?"0.5px solid rgba(255,255,255,0.07)":"0.5px solid rgba(0,0,0,0.08)", backdropFilter:"blur(8px)" }}>

                  {/* Texto */}
                  <div style={{ flex:"1.1 1 0", display:"flex", flexDirection:"column", justifyContent:"space-between", padding:isDesktop?"48px":"32px", borderRight:isDesktop?(isDark?"0.5px solid rgba(255,255,255,0.05)":"0.5px solid rgba(0,0,0,0.06)"):"none", borderBottom:!isDesktop?(isDark?"0.5px solid rgba(255,255,255,0.05)":"0.5px solid rgba(0,0,0,0.06)"):"none" }}>
                    <div>
                      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:32 }}>
                        <span style={{ fontFamily:"monospace", fontSize:10, color:isDark?"rgba(255,255,255,0.15)":"rgba(0,0,0,0.15)" }}>{project.index}</span>
                        <span style={{ fontSize:9, textTransform:"uppercase", letterSpacing:".25em", padding:"4px 12px", borderRadius:20, border:isDark?"0.5px solid rgba(255,255,255,0.12)":"0.5px solid rgba(0,0,0,0.10)", color:isDark?"rgba(255,255,255,0.35)":"rgba(0,0,0,0.35)" }}>{project.category}</span>
                      </div>
                      <h3 style={{ fontSize:"clamp(2rem,4vw,3.5rem)", fontWeight:900, textTransform:"uppercase", letterSpacing:"-.03em", lineHeight:.88, marginBottom:20, color:isDark?"#fff":"#111" }}>{project.title}</h3>
                      <p style={{ fontSize:13, fontWeight:300, lineHeight:1.7, maxWidth:280, color:isDark?"rgba(255,255,255,0.30)":"rgba(0,0,0,0.35)" }}>
                        Arquitectura web de alto rendimiento construida para una experiencia inmersiva.
                      </p>
                    </div>
                    <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginTop:32 }}>
                      <span style={{ fontFamily:"monospace", fontSize:11, color:isDark?"rgba(255,255,255,0.20)":"rgba(0,0,0,0.20)" }}>{project.year}</span>
                      <motion.button style={{ display:"flex", alignItems:"center", gap:8, fontSize:10, textTransform:"uppercase", letterSpacing:".15em", padding:"10px 20px", borderRadius:20, border:isDark?"0.5px solid rgba(255,255,255,0.20)":"0.5px solid rgba(0,0,0,0.15)", color:isDark?"rgba(255,255,255,0.60)":"rgba(0,0,0,0.55)", background:"transparent", cursor:"pointer" }}
                        whileHover={{ scale:1.02 }} whileTap={{ scale:0.97 }}>
                        Ver proyecto <span>→</span>
                      </motion.button>
                    </div>
                  </div>

                  {/* Imagen */}
                  <div style={{ flex:"1 1 0", position:"relative", overflow:"hidden", minHeight:isDesktop?"auto":220 }}
                    className="group">
                    <img src={project.img} alt={project.title} className="group-hover:scale-100 transition-all duration-700"
                      style={{ width:"100%", height:"100%", objectFit:"cover", transform:"scale(1.05)", filter:isDark?"grayscale(40%) brightness(0.75)":"grayscale(10%) brightness(0.95)" }}/>
                    <div className={`absolute inset-0 group-hover:opacity-0 transition-opacity duration-500 ${isDark?"bg-black/20":"bg-white/15"}`}/>
                    <div style={{ position:"absolute", top:16, right:16, width:20, height:20, borderRight:isDark?"0.5px solid rgba(255,255,255,0.20)":"0.5px solid rgba(0,0,0,0.15)", borderTop:isDark?"0.5px solid rgba(255,255,255,0.20)":"0.5px solid rgba(0,0,0,0.15)" }}/>
                    <div style={{ position:"absolute", bottom:16, left:16, width:20, height:20, borderLeft:isDark?"0.5px solid rgba(255,255,255,0.20)":"0.5px solid rgba(0,0,0,0.15)", borderBottom:isDark?"0.5px solid rgba(255,255,255,0.20)":"0.5px solid rgba(0,0,0,0.15)" }}/>
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
      <section style={{ position:"relative", zIndex:20, padding:"96px 48px", maxWidth:900, margin:"0 auto" }}>
        <SectionHeader label="Lo que ofrezco" title="Servicios" accent="& Disciplinas" isDark={isDark}/>
        <div>
          {services.map((s,i) => (
            <ServiceRow key={s.index} index={s.index} name={s.name} desc={s.desc} delay={i*0.07} isDark={isDark}/>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          GALERÍA
      ══════════════════════════════════════════════════════════════════════ */}
      <section style={{ position:"relative", zIndex:20, padding:"96px 48px" }}>
        <div style={{ maxWidth:1280, margin:"0 auto" }}>
          <SectionHeader label="Objetos visuales" title="Foto &" accent="Arte" right="Fotografía · Escultura · Mixto" isDark={isDark}/>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gridAutoRows:200, gap:12 }}>
            {galleryData.map((item,i) => (
              <GalleryItem key={i} item={item} i={i} isDark={isDark}/>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          CTA CONTACTO
      ══════════════════════════════════════════════════════════════════════ */}
      <section style={{ position:"relative", zIndex:20, padding:"112px 48px", maxWidth:1280, margin:"0 auto", display:"flex", flexDirection:isDesktop?"row":"column", alignItems:isDesktop?"flex-end":"flex-start", justifyContent:"space-between", gap:48, borderTop:borderC }}>
        <motion.div initial={{ opacity:0, y:24 }} whileInView={{ opacity:1, y:0 }} transition={{ duration:0.7 }} viewport={{ once:true }}>
          <span style={{ fontSize:9, letterSpacing:".35em", textTransform:"uppercase", display:"block", marginBottom:16, color:isDark?"rgba(255,255,255,0.20)":"rgba(0,0,0,0.25)" }}>Próximo proyecto</span>
          <h2 style={{ fontSize:"clamp(2.8rem,7vw,5rem)", fontWeight:900, textTransform:"uppercase", letterSpacing:"-.04em", lineHeight:.86, color:isDark?"#fff":"#111" }}>
            Hablemos<br/>
            <span style={{ WebkitTextStroke:isDark?"1.5px rgba(255,255,255,0.20)":"1.5px rgba(0,0,0,0.18)", color:"transparent" }}>de tu idea</span>
          </h2>
        </motion.div>
        <div style={{ display:"flex", flexDirection:"column", gap:16, flexShrink:0 }}>
          {[
            { label:"Email",     href:"mailto:aprada.web@gmail.com" },
            { label:"WhatsApp",  href:WA_URL },
            { label:"Instagram", href:"https://instagram.com/tu_usuario" },
          ].map(({ label, href }, i) => (
            <motion.a key={label} href={href} target={href.startsWith("http")?"_blank":undefined} rel="noopener noreferrer"
              style={{ display:"flex", alignItems:"center", gap:16, fontSize:13, textTransform:"uppercase", letterSpacing:".2em", textDecoration:"none", color:isDark?"rgba(255,255,255,0.40)":"rgba(0,0,0,0.35)" }}
              initial={{ opacity:0, x:12 }} whileInView={{ opacity:1, x:0 }}
              transition={{ duration:0.5, delay:i*0.08 }} viewport={{ once:true }}
              whileHover={{ x:4 }}>
              <span style={{ display:"inline-block", width:20, height:.5, background:isDark?"rgba(255,255,255,0.20)":"rgba(0,0,0,0.15)" }}/>
              {label}
            </motion.a>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer style={{ position:"relative", zIndex:20, padding:"32px 48px", display:"flex", alignItems:"center", justifyContent:"space-between", background:pageBg, borderTop:borderC }}>
        <span style={{ fontSize:9, letterSpacing:".4em", textTransform:"uppercase", color:isDark?"rgba(255,255,255,0.12)":"rgba(0,0,0,0.15)" }}>Andres Prada</span>
        <span style={{ fontFamily:"monospace", fontSize:9, color:isDark?"rgba(255,255,255,0.10)":"rgba(0,0,0,0.12)" }}>© 2026</span>
        <span style={{ fontSize:9, letterSpacing:".4em", textTransform:"uppercase", color:isDark?"rgba(255,255,255,0.12)":"rgba(0,0,0,0.15)" }}>Bogotá, CO</span>
      </footer>
    </div>
  )
}