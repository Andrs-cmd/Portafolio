import { motion, AnimatePresence, useScroll, useTransform, useMotionValue, useSpring } from "framer-motion"
import { useState, useEffect } from "react"
import { createPortal } from "react-dom"
import { useTheme } from "../context/ThemeContext"
import LiquidEther from "../components/OptionalLiquidEther"
import CameraAssembly from "../components/CameraAssembly"
import CardNav from "../components/CardNav"
import "../components/CardNav.css"
import { featuredProjects, type Project } from "../data/projects"
import { photosCaptures, photosStudio, photosEditorial, motionPieces } from "../data/gallery"
import { WhatsAppFAB, WhatsAppPill, WhatsAppBanner } from "../components/WhatsAppCTA"
import { useSEO } from "../lib/useSEO"
import { getNavItems, NAV_CTA, INSTAGRAM, EMAIL_HREF } from "../data/nav"

const LIQUID_DARK  = ['#0a0014', '#7b00cc', '#c026d3', '#60a5fa', '#ffffff']
const LIQUID_LIGHT = ['#f4f1f1', '#747272', '#000000']

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

const services = [
  { index: "01", name: "Desarrollo de Software",     desc: "Aplicaciones a medida",            what: "Apps web completas a la medida: dashboards, SaaS y plataformas. Del problema real del cliente, no de plantillas." },
  { index: "02", name: "Páginas Web",                desc: "Landing · Ecommerce · Académicas", what: "Landing, ecommerce y sitios con CMS. Rápidos, bonitos y pensados para convertir visitas en clientes." },
  { index: "03", name: "Animaciones Audioreactivas", desc: "Visuales que responden al sonido", what: "Visuales en tiempo real que reaccionan al audio. Three.js, WebGL y Web Audio para marcas y artistas." },
  { index: "04", name: "Fotografía",                 desc: "Editorial y comercial",            what: "Producto, retrato editorial y campañas completas, con dirección de arte de principio a fin." },
  { index: "05", name: "Esculturas & Arte",          desc: "Piezas físicas y conceptuales",    what: "Piezas físicas y digitales: edición limitada en resina, metal, madera e impresión 3D." },
]

const projectsData = featuredProjects

const galleryData = [
  { img: photosStudio[5].src,     label: "Studio",     sub: "Belleza · 2026",   tall: true  },
  { img: photosEditorial[8].src,  label: "GUA Series", sub: "Editorial · 2026", tall: false },
  { img: photosEditorial[15].src, label: "GUA Series", sub: "Editorial · 2026", tall: false },
  { img: photosStudio[3].src,     label: "Studio",     sub: "Belleza · 2026",   tall: true  },
  { img: photosCaptures[0].src,   label: "Captures",   sub: "Daily · 2026",     tall: false },
  { img: photosEditorial[20].src, label: "GUA Series", sub: "Editorial · 2026", tall: false },
]

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

function ScrollBar() {
  const { scrollYProgress } = useScroll()
  const width = useTransform(scrollYProgress, [0,1], ["0%","100%"])
  const { isDark } = useTheme()
  return (
    <motion.div style={{ position:"fixed", top:0, left:0, height:1.5, zIndex:300, pointerEvents:"none", width, background:isDark?"rgba(255,255,255,0.3)":"rgba(0,0,0,0.25)" }}/>
  )
}

const heroImages = [
  photosStudio[3].src,
  photosEditorial[8].src,
  photosEditorial[18].src,
  photosCaptures[0].src,
  photosStudio[5].src,
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
      <div style={{ position:"absolute", inset:0, pointerEvents:"none", background:isDark?"linear-gradient(to right, rgba(6,6,6,0.45) 0%, transparent 40%)":"linear-gradient(to right, rgba(245,241,233,0.45) 0%, transparent 40%)" }}/>
      <div style={{ position:"absolute", top:24, left:24, width:24, height:24, borderLeft:isDark?"1px solid rgba(255,255,255,0.30)":"1px solid rgba(0,0,0,0.20)", borderTop:isDark?"1px solid rgba(255,255,255,0.30)":"1px solid rgba(0,0,0,0.20)", pointerEvents:"none" }}/>
      <div style={{ position:"absolute", bottom:24, right:24, width:24, height:24, borderRight:isDark?"1px solid rgba(255,255,255,0.30)":"1px solid rgba(0,0,0,0.20)", borderBottom:isDark?"1px solid rgba(255,255,255,0.30)":"1px solid rgba(0,0,0,0.20)", pointerEvents:"none" }}/>
      <div style={{ position:"absolute", bottom:24, left:24, display:"flex", alignItems:"center", gap:8 }}>
        {heroImages.map((_,i) => (
          <motion.div key={i} className="rounded-full"
            animate={{ width:i===current?16:4, height:4 }}
            style={{ background:isDark?(i===current?"rgba(255,255,255,0.8)":"rgba(255,255,255,0.2)"):(i===current?"rgba(0,0,0,0.5)":"rgba(0,0,0,0.15)") }}
            transition={{ duration:0.3 }}/>
        ))}
      </div>
      <div style={{ position:"absolute", top:24, right:24, fontSize:9, letterSpacing:".3em", textTransform:"uppercase", color:isDark?"#fff":"#000" }}>
        Fotografía · Arte
      </div>
    </div>
  )
}

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
    <motion.div style={{ display:"flex", flexDirection:"column", padding:"clamp(48px, 8vw, 80px) clamp(20px, 5vw, 56px)", width:"100%", pointerEvents:"none", x, y }}>
      <motion.div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:40 }}
        initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.7, delay:0.1 }}>
        <div style={{ width:24, height:.5, background:isDark?"rgba(255,255,255,0.20)":"rgba(0,0,0,0.20)" }}/>
        <span style={{ fontSize:9, letterSpacing:".3em", textTransform:"uppercase", color:isDark?"#fff":"#000" }}>
          Developer & Visual Creator
        </span>
      </motion.div>
      <div style={{ overflow:"hidden", marginBottom:4 }}>
        <motion.h1 style={{ fontSize:"clamp(3.5rem,7vw,7.5rem)", fontWeight:900, textTransform:"uppercase", letterSpacing:"-.04em", lineHeight:.85, color:isDark?"#fff":"#111" }}
          initial={{ y:90 }} animate={{ y:0 }} transition={{ duration:0.9, delay:0.15, ease:[0.16,1,0.3,1] }}>Andres</motion.h1>
      </div>
      <div style={{ overflow:"hidden", marginBottom:48 }}>
        <motion.h1 style={{ fontSize:"clamp(3.5rem,7vw,7.5rem)", fontWeight:900, textTransform:"uppercase", letterSpacing:"-.04em", lineHeight:.85, WebkitTextStroke:isDark?"1.5px rgba(255,255,255,0.25)":"1.5px rgba(0,0,0,0.2)", color:"transparent" }}
          initial={{ y:90 }} animate={{ y:0 }} transition={{ duration:0.9, delay:0.22, ease:[0.16,1,0.3,1] }}>Prada</motion.h1>
      </div>
      <motion.p style={{ fontSize:15, fontWeight:300, lineHeight:1.8, maxWidth:280, marginBottom:48, color:isDark?"#fff":"#000" }}
        initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.7, delay:0.5 }}>
        Construyo experiencias digitales que viven entre el código, el movimiento y el arte.
      </motion.p>
      <motion.div style={{ display:"flex", flexDirection:"column", gap:4 }}
        initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.7 }}>
        {services.slice(0,4).map(s => (
          <div key={s.index} style={{ display:"flex", alignItems:"center", gap:12 }}>
            <span style={{ fontFamily:"monospace", fontSize:9, color:isDark?"#fff":"#000" }}>{s.index}</span>
            <span style={{ fontSize:11, color:isDark?"#fff":"#000" }}>{s.name}</span>
          </div>
        ))}
      </motion.div>
    </motion.div>
  )
}

// Showcase AUTÓNOMO de disciplinas: se reproduce solo (no depende del mouse).
// Recorre las 5 disciplinas en bucle, resalta la activa (nodo con órbita) y una
// viñeta se actualiza sola explicando "qué es", con barra de progreso.
const DISC_CYCLE_MS = 3200
function DisciplinesShowcase({ isDark, isDesktop }: { isDark:boolean; isDesktop:boolean }) {
  const [active, setActive] = useState(0)
  useEffect(() => {
    const id = setInterval(() => setActive(a => (a + 1) % services.length), DISC_CYCLE_MS)
    return () => clearInterval(id)
  }, [])
  const accent = "#c3c4f2"
  const txt = isDark ? "#fff" : "#141211"
  const dim = isDark ? "rgba(255,255,255,.40)" : "rgba(0,0,0,.40)"
  const s = services[active]
  const nodeBg = isDark ? "#0b0b10" : "#f1ede6"
  const trackC = isDark ? "rgba(255,255,255,.12)" : "rgba(0,0,0,.12)"
  return (
    <div style={{ marginTop: 34 }}>
      <style>{`@keyframes svcOrbit{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>

      {/* STEPPER horizontal — avanza solo por las disciplinas */}
      <div style={{ position:"relative", display:"flex", justifyContent:"space-between", alignItems:"center", width:"100%", maxWidth:480, margin:"0 auto", padding:"6px 17px 0" }}>
        {/* riel */}
        <div style={{ position:"absolute", left:17, right:17, top:"calc(50% + 3px)", height:1.5, background:trackC }}/>
        {/* progreso recorrido */}
        <motion.div style={{ position:"absolute", left:17, top:"calc(50% + 3px)", height:1.5, background:accent }}
          animate={{ width:`calc((100% - 34px) * ${services.length > 1 ? active / (services.length - 1) : 0})` }} transition={{ duration:.5, ease:[.16,1,.3,1] }}/>
        {services.map((d, i) => {
          const on = i === active
          const passed = i <= active
          return (
            <div key={d.index} style={{ position:"relative", width:34, height:34, flexShrink:0 }}>
              {on && (
                <div style={{ position:"absolute", inset:0, animation:"svcOrbit 4s linear infinite" }}>
                  <span style={{ position:"absolute", top:-1, left:"50%", marginLeft:-2.5, width:5, height:5, borderRadius:"50%", background:accent, boxShadow:`0 0 8px ${accent}` }}/>
                </div>
              )}
              <motion.span animate={{ scale:on?1.12:1 }} transition={{ type:"spring", stiffness:340, damping:20 }}
                style={{ position:"absolute", inset:0, borderRadius:"50%", background:nodeBg,
                  border:`1px solid ${passed?accent:trackC}`, display:"grid", placeItems:"center",
                  fontFamily:"monospace", fontSize:10, color:passed?accent:dim,
                  boxShadow:on?`0 0 18px ${accent}55`:"none", transition:"color .4s, border-color .4s, box-shadow .4s" }}>{d.index}</motion.span>
            </div>
          )
        })}
      </div>

      {/* CARD que explica la disciplina activa — se actualiza sola */}
      <div style={{ position:"relative", maxWidth:720, margin:"28px auto 0",
        border:`1px solid ${isDark?"rgba(255,255,255,.10)":"rgba(0,0,0,.10)"}`, borderRadius:18,
        padding: isDesktop ? "30px 30px" : "24px 20px", background:isDark?"rgba(255,255,255,.025)":"rgba(0,0,0,.02)",
        overflow:"hidden", minHeight: isDesktop ? 180 : 210 }}>
        <span aria-hidden="true" style={{ position:"absolute", top:-28, right:-4, fontSize:150, fontWeight:900, lineHeight:1, color:isDark?"rgba(195,196,242,.055)":"rgba(99,91,255,.05)", pointerEvents:"none" }}>{s.index}</span>
        <AnimatePresence mode="wait">
          <motion.div key={s.index} initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:-12 }} transition={{ duration:.45, ease:[.16,1,.3,1] }}>
            <span style={{ fontSize:10, letterSpacing:".22em", textTransform:"uppercase", color:accent }}>{s.desc}</span>
            <h3 style={{ margin:"10px 0 12px", fontSize:"clamp(1.5rem,3.4vw,2.1rem)", fontWeight:800, letterSpacing:"-.02em", lineHeight:1.05, color:txt }}>{s.name}</h3>
            <p style={{ margin:0, fontSize:14, lineHeight:1.7, color:isDark?"rgba(255,255,255,.72)":"rgba(0,0,0,.68)", maxWidth:480 }}>{s.what}</p>
          </motion.div>
        </AnimatePresence>
        <div style={{ position:"absolute", left:0, bottom:0, height:2, width:"100%", background:isDark?"rgba(255,255,255,.06)":"rgba(0,0,0,.06)" }}>
          <motion.div key={s.index} style={{ height:"100%", background:accent, transformOrigin:"left" }}
            initial={{ scaleX:0 }} animate={{ scaleX:1 }} transition={{ duration:DISC_CYCLE_MS/1000, ease:"linear" }}/>
        </div>
      </div>
    </div>
  )
}

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
        <span style={{ fontSize:9, letterSpacing:".25em", textTransform:"uppercase", marginBottom:4, color:isDark?"#fff":"#000" }}>{item.sub}</span>
        <span style={{ fontSize:13, fontWeight:300, color:isDark?"#fff":"#111" }}>{item.label}</span>
      </motion.div>
      <motion.div style={{ position:"absolute", top:12, left:12, width:16, height:16, borderLeft:isDark?"1px solid rgba(255,255,255,0.40)":"1px solid rgba(0,0,0,0.30)", borderTop:isDark?"1px solid rgba(255,255,255,0.40)":"1px solid rgba(0,0,0,0.30)" }}
        animate={{ opacity:hovered?1:0, scale:hovered?1:0.6 }} transition={{ duration:0.2 }}/>
      <motion.div style={{ position:"absolute", bottom:12, right:12, width:16, height:16, borderRight:isDark?"1px solid rgba(255,255,255,0.40)":"1px solid rgba(0,0,0,0.30)", borderBottom:isDark?"1px solid rgba(255,255,255,0.40)":"1px solid rgba(0,0,0,0.30)" }}
        animate={{ opacity:hovered?1:0, scale:hovered?1:0.6 }} transition={{ duration:0.2 }}/>
    </motion.div>
  )
}

function SectionHeader({ label, title, accent, right, isDark }: { label:string; title:string; accent:string; right?:string; isDark:boolean }) {
  return (
    <motion.div style={{ display:"flex", alignItems:"flex-end", justifyContent:"space-between", marginBottom:56 }}
      initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }} transition={{ duration:0.6 }} viewport={{ once:true }}>
      <div>
        <span style={{ fontSize:9, letterSpacing:".35em", textTransform:"uppercase", display:"block", marginBottom:12, color:isDark?"#fff":"#000" }}>{label}</span>
        <h2 style={{ fontSize:"clamp(2.2rem,5vw,4rem)", fontWeight:900, textTransform:"uppercase", letterSpacing:"-.03em", lineHeight:.85, color:isDark?"#fff":"#111" }}>
          {title}<br/>
          <span style={{ color:isDark?"#fff":"#000" }}>{accent}</span>
        </h2>
      </div>
      {right && <span style={{ fontFamily:"monospace", fontSize:11, paddingBottom:4, color:isDark?"#fff":"#000" }}>{right}</span>}
    </motion.div>
  )
}

/* Detalle que se despliega al abrir una fila del índice */
/* Selected Works — estilo "lineup de festival": un radar de círculos concéntricos
   con la imagen del proyecto activo en el centro + etiqueta, y a la derecha la
   lista sincronizada. Auto-avanza; al pasar el cursor por la lista selecciona. */
const RADAR_MS = 3800
function ProjectRadar({ projects, isDark, isDesktop }: { projects: Project[]; isDark: boolean; isDesktop: boolean }) {
  const [active, setActive] = useState(0)
  const [paused, setPaused] = useState(false)
  useEffect(() => {
    if (paused) return
    const id = setInterval(() => setActive(a => (a + 1) % projects.length), RADAR_MS)
    return () => clearInterval(id)
  }, [projects.length, paused])
  const p = projects[active]
  const accent = "#c3c4f2"
  const txt = isDark ? "#fff" : "#141211"
  const meta = isDark ? "rgba(255,255,255,.55)" : "rgba(0,0,0,.52)"
  const panel = isDark ? "rgba(16,16,22,.72)" : "rgba(255,255,255,.74)"
  const ringC = isDark ? "rgba(195,196,242,.22)" : "rgba(99,91,255,.20)"
  const rowLine = isDark ? "rgba(255,255,255,.07)" : "rgba(0,0,0,.07)"

  return (
    <div style={{ marginTop:22, borderRadius:24, border:`0.5px solid ${isDark?"rgba(255,255,255,.08)":"rgba(0,0,0,.08)"}`, background:panel, backdropFilter:"blur(10px)",
      padding: isDesktop ? "48px 52px" : "30px 20px",
      display:"grid", gridTemplateColumns: isDesktop ? "0.92fr 1.08fr" : "1fr", gap: isDesktop ? 50 : 32, alignItems:"center" }}>
      <style>{`@keyframes radarSpin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>

      {/* RADAR concéntrico con la imagen del proyecto activo */}
      <div style={{ position:"relative", width:"100%", maxWidth: isDesktop?360:260, aspectRatio:"1", margin:"0 auto", display:"grid", placeItems:"center" }}>
        <div style={{ position:"absolute", width:"100%", height:"100%", borderRadius:"50%", border:`1px dashed ${ringC}`, animation:"radarSpin 26s linear infinite" }}/>
        <div style={{ position:"absolute", width:"76%", height:"76%", borderRadius:"50%", border:`1px solid ${ringC}` }}/>
        <div style={{ position:"absolute", width:"54%", height:"54%", borderRadius:"50%", border:`1px solid ${ringC}` }}/>
        {/* etiqueta superior: categoría */}
        <AnimatePresence mode="wait">
          <motion.span key={p.id+"-cat"} initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }} transition={{ duration:.35 }}
            style={{ position:"absolute", top:"1%", left:"50%", transform:"translate(-50%,-50%)", padding:"5px 14px", borderRadius:999, border:`1px solid ${ringC}`, background:panel, fontSize:9, letterSpacing:".2em", textTransform:"uppercase", color:meta, whiteSpace:"nowrap", zIndex:3 }}>{p.category}</motion.span>
        </AnimatePresence>
        {/* imagen central */}
        <div style={{ position:"relative", width:"46%", height:"46%", borderRadius:"50%", overflow:"hidden", border:`1px solid ${accent}55`, boxShadow:`0 0 44px ${accent}26`, background:isDark?"#0b0b10":"#eceae3" }}>
          <AnimatePresence mode="wait">
            <motion.img key={p.id} src={p.img} alt="" loading="lazy"
              initial={{ opacity:0, scale:1.14 }} animate={{ opacity:1, scale:1 }} exit={{ opacity:0 }} transition={{ duration:.5, ease:[.16,1,.3,1] }}
              style={{ position:"absolute", inset:0, width:"100%", height:"100%", objectFit:"cover" }}/>
          </AnimatePresence>
        </div>
        {/* pill del título, montado al borde inferior del centro */}
        <AnimatePresence mode="wait">
          <motion.span key={p.id+"-ttl"} initial={{ opacity:0, y:6 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0 }} transition={{ duration:.4 }}
            style={{ position:"absolute", top:"71%", left:"50%", transform:"translate(-50%,-50%)", padding:"7px 16px", borderRadius:999, background:accent, color:"#141211", fontSize:12, fontWeight:700, textTransform:"uppercase", letterSpacing:".02em", whiteSpace:"nowrap", zIndex:4, boxShadow:"0 6px 20px rgba(0,0,0,.3)" }}>{p.title}</motion.span>
        </AnimatePresence>
      </div>

      {/* LISTA sincronizada */}
      <div onMouseEnter={()=>setPaused(true)} onMouseLeave={()=>setPaused(false)} style={{ display:"flex", flexDirection:"column" }}>
        {projects.map((d,i) => {
          const on = i===active
          return (
            <div key={d.id} onMouseEnter={()=>setActive(i)} onClick={()=>setActive(i)}
              style={{ cursor:"pointer", padding:"13px 0", borderBottom:`1px solid ${rowLine}` }}>
              <div style={{ display:"flex", alignItems:"center", gap:12 }}>
                <span style={{ fontFamily:"monospace", fontSize:10, color: on?accent:meta, width:24, flexShrink:0 }}>{String(i+1).padStart(2,"0")}</span>
                <motion.span animate={{ color: on?txt:meta, x: on?4:0 }} transition={{ duration:.3 }}
                  style={{ fontSize:"clamp(1.1rem,2vw,1.55rem)", fontWeight:800, textTransform:"uppercase", letterSpacing:"-.02em", lineHeight:1 }}>{d.title}</motion.span>
                <span style={{ marginLeft:"auto", fontSize:9, letterSpacing:".12em", padding:"3px 10px", borderRadius:999, border:`1px solid ${isDark?"rgba(255,255,255,.16)":"rgba(0,0,0,.14)"}`, color:meta, whiteSpace:"nowrap", flexShrink:0 }}>{d.year}</span>
              </div>
              <AnimatePresence initial={false}>
                {on && (
                  <motion.div initial={{ height:0, opacity:0 }} animate={{ height:"auto", opacity:1 }} exit={{ height:0, opacity:0 }} transition={{ duration:.35, ease:[.16,1,.3,1] }} style={{ overflow:"hidden" }}>
                    <p style={{ margin:"9px 0 2px 36px", fontSize:12.5, lineHeight:1.6, color:meta, maxWidth:430 }}>{d.description}</p>
                    {d.links[0] && <a href={d.links[0].href} target="_blank" rel="noopener noreferrer" style={{ display:"inline-block", margin:"4px 0 4px 36px", fontSize:9.5, letterSpacing:".16em", textTransform:"uppercase", color:accent, textDecoration:"none" }}>{d.links[0].label} ↗</a>}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default function Home() {
  useSEO({
    title: "Andres Prada · Desarrollador y Diseñador Web · Bogotá",
    description: "Desarrollo web, diseño y dirección visual desde Bogotá. Sitios, e-commerce, fotografía editorial y motion graphics para marcas con criterio.",
    path: "/",
    keywords: "desarrollador web bogotá, diseñador web colombia, frontend react, laravel, ui ux, portafolio andres prada, fotografía editorial, motion graphics",
  })
  const { isDark } = useTheme()
  const isDesktop  = useIsDesktop()

  const pageBg   = isDark ? "#060606" : "#f5f1e9"
  const borderC  = isDark ? "0.5px solid rgba(255,255,255,0.06)" : "0.5px solid rgba(0,0,0,0.07)"

  const menuItems = getNavItems(isDark)

  return (
    <div style={{ minHeight:"100vh", overflowX:"clip", background:pageBg, color:isDark?"#fff":"#111", position:"relative" }}>

      <div style={{ position:"fixed", inset:0, zIndex:0, pointerEvents:"none" }}>
        <LiquidEther
          mouseForce={22}
          cursorSize={120}
          resolution={0.8}
          dt={0.016}
          viscous={15}
          isViscous={false}
          autoIntensity={isDark ? 2.5 : 1.2}
          colors={isDark ? LIQUID_DARK : LIQUID_LIGHT}
        />
        <div style={{ position:"absolute", inset:0, zIndex:1, pointerEvents:"none", background:isDark?"radial-gradient(circle at center, transparent 0%, rgba(0,0,0,0.65) 100%)":"radial-gradient(circle at center, transparent 0%, rgba(245,241,233,0.70) 100%)" }}/>
      </div>

      <ScrollBar/>
      <ThemeToggle/>

      <div style={{ position:"relative", zIndex:50 }}>
        <CardNav logo="/faviconAP.ico" items={menuItems} ctaLabel={NAV_CTA.label} ctaHref={NAV_CTA.href}
          baseColor={isDark?"rgba(6,6,6,0.92)":"rgba(245,241,233,0.95)"}
          menuColor={isDark?"#fff":"#111"} buttonBgColor={isDark?"#dde4e6":"#111"} buttonTextColor={isDark?"#000":"#fff"}/>
      </div>

      {/* HERO */}
      <section style={{ position:"relative", zIndex:20, minHeight:"100vh", display:"flex", flexDirection:isDesktop?"row":"column" }}>
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
        {isDesktop && (
          <div style={{ width:1, flexShrink:0, alignSelf:"stretch", background:isDark?"rgba(255,255,255,0.05)":"rgba(0,0,0,0.06)" }}/>
        )}
        <div style={{
          flex: isDesktop ? 1 : "none",
          width: isDesktop ? "auto" : "100%",
          display:"flex", alignItems:"center", justifyContent:"center",
          minHeight: isDesktop ? "100vh" : "60vh",
          position:"relative",
        }}>
          <div style={{ position:"absolute", inset:0, pointerEvents:"none", overflow:"hidden" }}>
            <div style={{ position:"absolute", left:"33%", top:0, bottom:0, width:.5, background:isDark?"rgba(255,255,255,0.025)":"rgba(0,0,0,0.03)" }}/>
            <div style={{ position:"absolute", top:"33%", left:0, right:0, height:.5, background:isDark?"rgba(255,255,255,0.025)":"rgba(0,0,0,0.03)" }}/>
            <div style={{ position:"absolute", top:"66%", left:0, right:0, height:.5, background:isDark?"rgba(255,255,255,0.025)":"rgba(0,0,0,0.03)" }}/>
          </div>
          <div style={{ position:"absolute", top:24, left:32, display:"flex", alignItems:"center", gap:8 }}>
            <span style={{ position:"relative", display:"flex", width:6, height:6 }}>
              <span className="animate-ping" style={{ position:"absolute", display:"inline-flex", width:"100%", height:"100%", borderRadius:"50%", background:"rgb(52,211,153)", opacity:.75 }}/>
              <span style={{ position:"relative", display:"inline-flex", width:6, height:6, borderRadius:"50%", background:"rgb(16,185,129)" }}/>
            </span>
            <span style={{ fontSize:9, letterSpacing:".25em", textTransform:"uppercase", color:isDark?"#fff":"#000" }}>Disponible</span>
          </div>
          <div style={{ position:"absolute", bottom:32, right:32, display:"flex", flexDirection:"column", alignItems:"center", gap:8, pointerEvents:"none" }}>
            <div style={{ width:.5, height:40, background:isDark?"rgba(255,255,255,0.15)":"rgba(0,0,0,0.15)" }}/>
            <span style={{ fontSize:8, letterSpacing:".3em", textTransform:"uppercase", color:isDark?"#fff":"#000" }}>Scroll</span>
          </div>
          <HeroText/>
        </div>
      </section>

      {/* ARME & DESARME — cámara 3D (scroll-driven, se monta sola al acercarse) */}
      <CameraAssembly isDark={isDark}/>

      <div style={{ position:"relative", zIndex:20, margin:"0 clamp(16px, 4vw, 48px)", display:"flex", alignItems:"center", justifyContent:"space-between", padding:"16px 0", borderTop:borderC }}>
        <span style={{ fontSize:9, letterSpacing:".35em", textTransform:"uppercase", color:isDark?"#fff":"#000" }}>Selected Works</span>
        <span style={{ fontFamily:"monospace", fontSize:9, color:isDark?"#fff":"#000" }}>2024 — 2026</span>
      </div>

      {/* ══════════════════════════════════════════════════════════════════════
          PROYECTOS — índice editorial
          Desktop → preview que persigue al cursor + click para desplegar
          Mobile  → mismas filas; la imagen va dentro del detalle desplegado
      ══════════════════════════════════════════════════════════════════════ */}
      <section style={{ position:"relative", zIndex:20, paddingTop:96, paddingBottom:96 }}>
        <div style={{ padding:"0 clamp(16px, 4vw, 48px)", maxWidth:1280, margin:"0 auto" }}>
          <SectionHeader label="Proyectos seleccionados" title="Selected" accent="Works" right={`01 — ${String(projectsData.length).padStart(2, "0")}`} isDark={isDark}/>
          <ProjectRadar projects={projectsData} isDark={isDark} isDesktop={isDesktop}/>
        </div>
      </section>

      {/* SERVICIOS */}
      <section style={{ position:"relative", zIndex:20, padding:"clamp(48px, 10vw, 96px) clamp(20px, 4vw, 48px)", maxWidth:1080, margin:"0 auto" }}>
        <SectionHeader label="Lo que ofrezco" title="Servicios" accent="& Disciplinas" isDark={isDark}/>
        <DisciplinesShowcase isDark={isDark} isDesktop={isDesktop}/>
      </section>

      {/* GALERÍA */}
      <section style={{ position:"relative", zIndex:20, padding:"clamp(48px, 10vw, 96px) clamp(16px, 4vw, 48px)" }}>
        <div style={{ maxWidth:1280, margin:"0 auto" }}>
          <SectionHeader label="Objetos visuales" title="Foto &" accent="Arte" right="Fotografía · Escultura · Mixto" isDark={isDark}/>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gridAutoRows:200, gap:12 }}>
            {galleryData.map((item,i) => (
              <GalleryItem key={i} item={item} i={i} isDark={isDark}/>
            ))}
          </div>
        </div>
      </section>

      {/* WHATSAPP BANNER */}
      <section style={{ position:"relative", zIndex:20, padding: isDesktop ? "48px 48px 0" : "32px 20px 0", maxWidth:1280, margin:"0 auto" }}>
        <WhatsAppBanner isDark={isDark} isDesktop={isDesktop} headline="¿Listo para tu proyecto? Hablemos ya"/>
      </section>

      {/* CTA VISUAL EDITORIAL */}
      <section style={{ position:"relative", zIndex:20, padding: isDesktop ? "96px 48px" : "48px 20px", maxWidth:1280, margin:"0 auto" }}>
        <motion.a href="/visual"
          initial={{ opacity:0, y:32 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} transition={{ duration:0.8, ease:[.16,1,.3,1] }}
          whileHover={{ y:-4 }}
          style={{
            display:"grid",
            gridTemplateColumns: isDesktop ? "1.2fr 1fr" : "1fr",
            gap: isDesktop ? 0 : 12,
            position:"relative",
            overflow:"hidden",
            borderRadius:24,
            background:isDark?"rgba(14,12,20,0.65)":"rgba(255,253,247,0.78)",
            border:isDark?"0.5px solid rgba(255,255,255,0.12)":"0.5px solid rgba(0,0,0,0.10)",
            backdropFilter:"blur(8px)",
            textDecoration:"none",
            cursor:"pointer",
            minHeight: isDesktop ? 360 : "auto",
          }}>
          {/* mini collage */}
          <div style={{ position:"relative", display:"grid", gridTemplateColumns:"repeat(3, 1fr)", gridTemplateRows:"repeat(2, 1fr)", gap:6, padding:24, minHeight: isDesktop ? "auto" : 240 }}>
            {[
              { src: photosEditorial[8].src, span: "1 / span 2 / 3 / span 2" },
              { src: photosStudio[5].src, span: "1 / 3 / 2 / 4" },
              { src: motionPieces[0].id, span: "2 / 3 / 3 / 4", video: motionPieces[0].src },
            ].map((m, i) => (
              <motion.div key={i}
                initial={{ opacity:0, scale:1.04 }} whileInView={{ opacity:1, scale:1 }} viewport={{ once:true }}
                transition={{ duration:0.7, delay:i*0.08 }}
                style={{ position:"relative", overflow:"hidden", gridArea: m.span, borderRadius:12 }}>
                {"video" in m && m.video ? (
                  <video src={m.video} autoPlay loop muted playsInline style={{ width:"100%", height:"100%", objectFit:"cover" }}/>
                ) : (
                  <img src={m.src} alt="" loading="lazy" style={{ width:"100%", height:"100%", objectFit:"cover", filter: isDark ? "grayscale(15%) brightness(.9)" : "grayscale(8%) brightness(.97)" }}/>
                )}
              </motion.div>
            ))}
          </div>

          {/* text side */}
          <div style={{ display:"flex", flexDirection:"column", justifyContent:"center", padding:isDesktop?"56px 56px":"32px 24px 40px", gap:14 }}>
            <div style={{ display:"flex", alignItems:"center", gap:10 }}>
              <div style={{ width:18, height:.5, background:isDark?"rgba(255,255,255,0.35)":"rgba(0,0,0,0.30)" }}/>
              <span style={{ fontFamily:"monospace", fontSize:10, letterSpacing:".22em", textTransform:"uppercase", color:isDark?"#fff":"#000" }}>Nuevo · Issue 01</span>
            </div>
            <h3 style={{ fontSize:"clamp(2rem,4.5vw,3.6rem)", fontWeight:900, textTransform:"uppercase", letterSpacing:"-.04em", lineHeight:.88, color:isDark?"#fff":"#111" }}>
              Visual<br/>
              <span style={{ WebkitTextStroke:isDark?"1.5px rgba(255,255,255,0.25)":"1.5px rgba(0,0,0,0.20)", color:"transparent" }}>Editorial</span>
            </h3>
            <p style={{ fontSize:13, fontWeight:300, lineHeight:1.7, maxWidth:340, color:isDark?"#fff":"#000" }}>
              Fotografía y motion como una revista. Capítulos, spreads y reels para explorar mi trabajo visual.
            </p>
            <div style={{ display:"flex", alignItems:"center", gap:12, marginTop:8, fontSize:11, textTransform:"uppercase", letterSpacing:".22em", color:isDark?"#fff":"#111" }}>
              <span style={{ display:"inline-flex", alignItems:"center", justifyContent:"center", width:36, height:36, borderRadius:"50%", border:isDark?"1px solid rgba(255,255,255,0.30)":"1px solid rgba(0,0,0,0.25)", fontSize:14 }}>→</span>
              <span>Abrir portafolio visual</span>
            </div>
          </div>
        </motion.a>
      </section>

      {/* CTA AUTOMATION */}
      <section style={{ position:"relative", zIndex:20, padding: isDesktop ? "0 48px 96px" : "0 20px 48px", maxWidth:1280, margin:"0 auto" }}>
        <motion.a href="/automation"
          initial={{ opacity:0, y:32 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} transition={{ duration:0.8, ease:[.16,1,.3,1] }}
          whileHover={{ y:-4 }}
          style={{
            display:"grid",
            gridTemplateColumns: isDesktop ? "1fr 1.1fr" : "1fr",
            gap: isDesktop ? 0 : 12,
            position:"relative",
            overflow:"hidden",
            borderRadius:24,
            background: isDark ? "rgba(10,16,26,0.65)" : "rgba(248,250,255,0.78)",
            border: isDark ? "0.5px solid rgba(96,165,250,0.20)" : "0.5px solid rgba(37,99,235,0.18)",
            backdropFilter:"blur(8px)",
            textDecoration:"none",
            cursor:"pointer",
            minHeight: isDesktop ? 320 : "auto",
          }}>
          {/* TEXT side LEFT */}
          <div style={{ display:"flex", flexDirection:"column", justifyContent:"center", padding: isDesktop ? "48px 56px" : "32px 24px 0", gap:14 }}>
            <div style={{ display:"flex", alignItems:"center", gap:10 }}>
              <div style={{ width:18, height:.5, background: isDark ? "rgba(96,165,250,.60)" : "rgba(37,99,235,.55)" }}/>
              <span style={{ fontFamily:"monospace", fontSize:10, letterSpacing:".22em", textTransform:"uppercase", color: isDark ? "#60a5fa" : "#2563eb" }}>n8n + IA · Agentes</span>
            </div>
            <h3 style={{ fontSize:"clamp(2rem,4.5vw,3.6rem)", fontWeight:900, textTransform:"uppercase", letterSpacing:"-.04em", lineHeight:.88, color: isDark ? "#fff" : "#000" }}>
              Automation<br/>
              <span style={{ WebkitTextStroke: isDark ? "1.5px rgba(96,165,250,.45)" : "1.5px rgba(37,99,235,.35)", color:"transparent" }}>Studio</span>
            </h3>
            <p style={{ fontSize:13, fontWeight:300, lineHeight:1.7, maxWidth:380, color: isDark ? "#fff" : "#000" }}>
              Workflows con n8n + GPT-4 que responden, califican y ejecutan. Lead Agent y Handoff Reader en producción.
            </p>
            <div style={{ display:"flex", alignItems:"center", gap:12, marginTop:8, fontSize:11, textTransform:"uppercase", letterSpacing:".22em", color: isDark ? "#fff" : "#000" }}>
              <span style={{ display:"inline-flex", alignItems:"center", justifyContent:"center", width:36, height:36, borderRadius:"50%", border: isDark ? "1px solid rgba(96,165,250,.45)" : "1px solid rgba(37,99,235,.40)", fontSize:14 }}>→</span>
              <span>Ver casos de automatización</span>
            </div>
          </div>

          {/* DIAGRAM side RIGHT — mini flow */}
          <div style={{ position:"relative", padding: isDesktop ? "32px" : "24px", display:"flex", alignItems:"center", justifyContent:"center", minHeight: isDesktop ? "auto" : 220 }}>
            {/* grid backdrop */}
            <svg aria-hidden="true" style={{ position:"absolute", inset:0, width:"100%", height:"100%", pointerEvents:"none" }}>
              <defs>
                <pattern id="auto-cta-grid" width="32" height="32" patternUnits="userSpaceOnUse">
                  <path d="M 32 0 L 0 0 0 32" fill="none" stroke={isDark ? "rgba(255,255,255,.04)" : "rgba(0,0,0,.05)"} strokeWidth=".5"/>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#auto-cta-grid)"/>
            </svg>

            {/* mini flow */}
            <div style={{ position:"relative", display:"flex", flexDirection:"column", gap:12, padding:"8px 0", width:"100%", maxWidth:280 }}>
              {[
                { l: "WhatsApp", k: "in"  },
                { l: "GPT-4 · Intent", k: "ai"  },
                { l: "Notion CRM", k: "out" },
              ].map((n, i, arr) => {
                const c = n.k === "in"
                  ? { border: isDark ? "rgba(96,165,250,.55)" : "rgba(37,99,235,.50)", text: isDark ? "#60a5fa" : "#2563eb" }
                  : n.k === "ai"
                  ? { border: isDark ? "rgba(192,38,211,.65)" : "rgba(168,28,189,.45)", text: isDark ? "#c026d3" : "#a81cbd" }
                  : { border: isDark ? "rgba(34,197,94,.55)" : "rgba(22,163,74,.50)", text: isDark ? "#22c55e" : "#16a34a" }
                return (
                  <div key={n.l} style={{ display:"flex", flexDirection:"column", alignItems:"stretch", gap:8 }}>
                    <motion.div
                      initial={{ opacity:0, scale:.95 }} whileInView={{ opacity:1, scale:1 }} viewport={{ once:true }}
                      transition={{ duration:.45, delay:i*.12 }}
                      style={{ padding:"10px 14px", border:`1px solid ${c.border}`, borderRadius:8, background: isDark ? "rgba(255,255,255,.025)" : "rgba(255,255,255,.7)", display:"flex", alignItems:"center", justifyContent:"space-between", gap:10 }}>
                      <span style={{ fontFamily:"monospace", fontSize:9, letterSpacing:".22em", color: c.text }}>{n.k.toUpperCase()}</span>
                      <span style={{ fontSize:12, fontWeight:600, color: isDark ? "#fff" : "#000" }}>{n.l}</span>
                    </motion.div>
                    {i < arr.length - 1 && (
                      <motion.div
                        initial={{ height:0, opacity:0 }} whileInView={{ height:16, opacity:1 }} viewport={{ once:true }}
                        transition={{ duration:.3, delay:i*.12+.2 }}
                        style={{ width:1, alignSelf:"center", background: isDark ? "rgba(255,255,255,.22)" : "rgba(0,0,0,.20)" }}/>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </motion.a>
      </section>

      {/* CTA */}
      <section style={{ position:"relative", zIndex:20, padding:"clamp(64px, 12vw, 112px) clamp(20px, 4vw, 48px)", maxWidth:1280, margin:"0 auto", display:"flex", flexDirection:isDesktop?"row":"column", alignItems:isDesktop?"flex-end":"flex-start", justifyContent:"space-between", gap:48, borderTop:borderC }}>
        <motion.div initial={{ opacity:0, y:24 }} whileInView={{ opacity:1, y:0 }} transition={{ duration:0.7 }} viewport={{ once:true }}>
          <span style={{ fontSize:9, letterSpacing:".35em", textTransform:"uppercase", display:"block", marginBottom:16, color:isDark?"#fff":"#000" }}>Próximo proyecto</span>
          <h2 style={{ fontSize:"clamp(2.8rem,7vw,5rem)", fontWeight:900, textTransform:"uppercase", letterSpacing:"-.04em", lineHeight:.86, color:isDark?"#fff":"#111" }}>
            Hablemos<br/>
            <span style={{ WebkitTextStroke:isDark?"1.5px rgba(255,255,255,0.20)":"1.5px rgba(0,0,0,0.18)", color:"transparent" }}>de tu idea</span>
          </h2>
        </motion.div>
        <div style={{ display:"flex", flexDirection:"column", gap:16, flexShrink:0 }}>
          <motion.div initial={{ opacity:0, y:8 }} whileInView={{ opacity:1, y:0 }} transition={{ duration:.5 }} viewport={{ once:true }}>
            <WhatsAppPill isDark={isDark} size="lg" label="Escribir por WhatsApp"/>
          </motion.div>
          {[
            { label:"Email",     href:EMAIL_HREF },
            { label:"Instagram", href:INSTAGRAM },
          ].map(({ label, href }, i) => (
            <motion.a key={label} href={href} target={href.startsWith("http")?"_blank":undefined} rel="noopener noreferrer"
              style={{ display:"flex", alignItems:"center", gap:16, fontSize:13, textTransform:"uppercase", letterSpacing:".2em", textDecoration:"none", color:isDark?"#fff":"#000" }}
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
      <footer style={{ position:"relative", zIndex:20, padding:"24px clamp(16px, 4vw, 48px)", display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:12, background:pageBg, borderTop:borderC }}>
        <span style={{ fontSize:9, letterSpacing:".4em", textTransform:"uppercase", color:isDark?"#fff":"#000" }}>Andres Prada</span>
        <a href="/legal" style={{ fontSize:9, letterSpacing:".4em", textTransform:"uppercase", color:isDark?"#fff":"#000", textDecoration:"none", opacity:.8 }}>Aviso legal · Privacidad</a>
        <span style={{ fontFamily:"monospace", fontSize:9, color:isDark?"#fff":"#000" }}>© 2026</span>
        <span style={{ fontSize:9, letterSpacing:".4em", textTransform:"uppercase", color:isDark?"#fff":"#000" }}>Bogotá, CO</span>
      </footer>

      <WhatsAppFAB/>
    </div>
  )
}