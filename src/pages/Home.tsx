import { motion, AnimatePresence, useScroll, useTransform, useMotionValue, useSpring } from "framer-motion"
import { useState, useEffect, useRef } from "react"
import { createPortal } from "react-dom"
import { useTheme } from "../context/ThemeContext"
import LiquidEther from "../components/LiquidEther"
import CardNav from "../components/CardNav"
import ScrollStack, { ScrollStackItem, MobileStickyStack } from "../components/ScrollStack"
import "../components/CardNav.css"
import "../components/ScrollStack.css"
import { featuredProjects, type Project } from "../data/projects"
import { photosCaptures, photosStudio, photosEditorial, motionPieces } from "../data/gallery"
import { WhatsAppFAB, WhatsAppPill, WhatsAppBanner } from "../components/WhatsAppCTA"

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
  { index: "01", name: "Desarrollo de Software",     desc: "Aplicaciones a medida" },
  { index: "02", name: "Páginas Web",                desc: "Landing · Ecommerce · Académicas" },
  { index: "03", name: "Animaciones Audioreactivas", desc: "Visuales que responden al sonido" },
  { index: "04", name: "Fotografía",                 desc: "Editorial y comercial" },
  { index: "05", name: "Esculturas & Arte",          desc: "Piezas físicas y conceptuales" },
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

function ServiceRow({ index, name, desc, delay, isDark }: { index:string; name:string; desc:string; delay:number; isDark:boolean }) {
  const [hovered, setHovered] = useState(false)
  return (
    <motion.div
      style={{ position:"relative", display:"flex", alignItems:"center", gap:20, paddingTop:20, paddingBottom:20, borderBottom:isDark?"1px solid rgba(255,255,255,0.06)":"1px solid rgba(0,0,0,0.06)", overflow:"hidden", cursor:"default" }}
      onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      initial={{ opacity:0, x:-16 }} whileInView={{ opacity:1, x:0 }}
      transition={{ duration:0.5, delay }} viewport={{ once:true }}>
      <motion.div style={{ position:"absolute", inset:0, background:isDark?"rgba(255,255,255,0.025)":"rgba(0,0,0,0.025)", originX:0 }}
        initial={{ scaleX:0 }} animate={{ scaleX:hovered?1:0 }} transition={{ duration:0.35 }}/>
      <span style={{ fontFamily:"monospace", fontSize:10, width:24, flexShrink:0, color:isDark?"#fff":"#000" }}>{index}</span>
      <div style={{ flex:1, display:"flex", alignItems:"center", justifyContent:"space-between" }}>
        <motion.span style={{ fontSize:14, fontWeight:300, letterSpacing:".01em", color:isDark?"#fff":"#000" }} animate={{ x:hovered?6:0 }} transition={{ duration:0.25 }}>{name}</motion.span>
        <span style={{ fontSize:10, letterSpacing:".15em", textTransform:"uppercase", color:isDark?"#fff":"#000" }}>{desc}</span>
      </div>
      <motion.span style={{ fontSize:12, flexShrink:0, color:isDark?"#fff":"#000" }}
        animate={{ x:hovered?0:8, opacity:hovered?1:0 }} transition={{ duration:0.2 }}>→</motion.span>
    </motion.div>
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

/* Card reutilizable en ambos modos */
function ProjectCard({ project, isDesktop, isDark }: { project: Project; isDesktop: boolean; isDark: boolean }) {
  const primaryLink = project.links[0]
  return (
    <div style={{ width:"100%", height:"100%", display:"flex", flexDirection:isDesktop?"row":"column", overflow:"hidden", backgroundColor:isDark?project.darkBg:project.lightBg, borderRadius:36, border:isDark?"0.5px solid rgba(255,255,255,0.07)":"0.5px solid rgba(0,0,0,0.08)", backdropFilter:"blur(8px)" }}>
      <div style={{ flex:"1.1 1 0", display:"flex", flexDirection:"column", justifyContent:"space-between", padding:isDesktop?"48px":"32px", borderRight:isDesktop?(isDark?"0.5px solid rgba(255,255,255,0.05)":"0.5px solid rgba(0,0,0,0.06)"):"none", borderBottom:!isDesktop?(isDark?"0.5px solid rgba(255,255,255,0.05)":"0.5px solid rgba(0,0,0,0.06)"):"none" }}>
        <div>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:32 }}>
            <span style={{ fontFamily:"monospace", fontSize:10, color:isDark?"#fff":"#000" }}>{project.index}</span>
            <span style={{ fontSize:9, textTransform:"uppercase", letterSpacing:".25em", padding:"4px 12px", borderRadius:20, border:isDark?"0.5px solid rgba(255,255,255,0.25)":"0.5px solid rgba(0,0,0,0.22)", color:isDark?"#fff":"#000" }}>{project.category}</span>
          </div>
          {project.client && (
            <span style={{ display:"block", fontSize:10, letterSpacing:".25em", textTransform:"uppercase", marginBottom:12, color:isDark?"#fff":"#000" }}>{project.client}</span>
          )}
          <h3 style={{ fontSize:"clamp(2rem,4vw,3.5rem)", fontWeight:900, textTransform:"uppercase", letterSpacing:"-.03em", lineHeight:.88, marginBottom:20, color:isDark?"#fff":"#111" }}>{project.title}</h3>
          <p style={{ fontSize:13, fontWeight:300, lineHeight:1.7, maxWidth:340, color:isDark?"#fff":"#000" }}>
            {project.description}
          </p>
          <div style={{ display:"flex", flexWrap:"wrap", gap:6, marginTop:18 }}>
            {project.stack.slice(0,4).map(t => (
              <span key={t} style={{ fontFamily:"monospace", fontSize:9, padding:"4px 10px", borderRadius:20, color:isDark?"#fff":"#000", background:isDark?"rgba(255,255,255,0.06)":"rgba(0,0,0,0.05)", border:isDark?"1px solid rgba(255,255,255,0.14)":"1px solid rgba(0,0,0,0.10)" }}>{t}</span>
            ))}
          </div>
        </div>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginTop:32 }}>
          <span style={{ fontFamily:"monospace", fontSize:11, color:isDark?"#fff":"#000" }}>{project.year}</span>
          {primaryLink && (
            <motion.a href={primaryLink.href} target="_blank" rel="noopener noreferrer"
              style={{ display:"flex", alignItems:"center", gap:8, fontSize:10, textTransform:"uppercase", letterSpacing:".15em", padding:"10px 20px", borderRadius:20, border:isDark?"0.5px solid rgba(255,255,255,0.35)":"0.5px solid rgba(0,0,0,0.30)", color:isDark?"#fff":"#000", background:"transparent", cursor:"pointer", textDecoration:"none" }}
              whileHover={{ scale:1.02 }} whileTap={{ scale:0.97 }}>
              {primaryLink.label} <span>↗</span>
            </motion.a>
          )}
        </div>
      </div>
      <div style={{ flex:"1 1 0", position:"relative", overflow:"hidden", minHeight:isDesktop?"auto":220 }} className="group">
        <img src={project.img} alt={project.title} className="group-hover:scale-100 transition-all duration-700"
          style={{ width:"100%", height:"100%", objectFit:"cover", transform:"scale(1.05)", filter:isDark?"grayscale(40%) brightness(0.75)":"grayscale(10%) brightness(0.95)" }}/>
        <div className={`absolute inset-0 group-hover:opacity-0 transition-opacity duration-500 ${isDark?"bg-black/20":"bg-white/15"}`}/>
        <div style={{ position:"absolute", top:16, right:16, width:20, height:20, borderRight:isDark?"0.5px solid rgba(255,255,255,0.20)":"0.5px solid rgba(0,0,0,0.15)", borderTop:isDark?"0.5px solid rgba(255,255,255,0.20)":"0.5px solid rgba(0,0,0,0.15)" }}/>
        <div style={{ position:"absolute", bottom:16, left:16, width:20, height:20, borderLeft:isDark?"0.5px solid rgba(255,255,255,0.20)":"0.5px solid rgba(0,0,0,0.15)", borderBottom:isDark?"0.5px solid rgba(255,255,255,0.20)":"0.5px solid rgba(0,0,0,0.15)" }}/>
      </div>
    </div>
  )
}

export default function Home() {
  const { isDark } = useTheme()
  const isDesktop  = useIsDesktop()
  const isMobile   = !isDesktop

  const WA_NUMBER = "573195768097"
  const WA_URL    = `https://wa.me/${WA_NUMBER}?text=Hola%20Andres%2C%20me%20interesa%20trabajar%20contigo`

  const pageBg   = isDark ? "#060606" : "#f5f1e9"
  const borderC  = isDark ? "0.5px solid rgba(255,255,255,0.06)" : "0.5px solid rgba(0,0,0,0.07)"

  const menuItems = [
    { label:"Servicios", bgColor:isDark?"#111111":"#f0ece4", textColor:isDark?"#fff":"#000",
      links:[{ label:"Desarrollo Web", href:"/lab#svc-software", ariaLabel:"Software" },{ label:"Ecommerce", href:"/lab#svc-web", ariaLabel:"Web" }] },
    { label:"Proyectos", bgColor:isDark?"#1a1a1a":"#e8e4dc", textColor:isDark?"#fff":"#000",
      links:[{ label:"Archive", href:"/archive", ariaLabel:"Archive" },{ label:"Visual Editorial", href:"/visual", ariaLabel:"Visual" }] },
    { label:"Contacto", bgColor:isDark?"#dde4e6":"#1a1a1a", textColor:isDark?"#000":"#fff",
      links:[{ label:"WhatsApp", href:WA_URL, ariaLabel:"WhatsApp" },{ label:"Email", href:"mailto:aprada.web@gmail.com", ariaLabel:"Email" }] },
  ]

  return (
    <div style={{ minHeight:"100vh", overflowX:"hidden", background:pageBg, color:isDark?"#fff":"#111", position:"relative" }}>

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
        <CardNav logo="/faviconAP.ico" items={menuItems}
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

      <div style={{ position:"relative", zIndex:20, margin:"0 clamp(16px, 4vw, 48px)", display:"flex", alignItems:"center", justifyContent:"space-between", padding:"16px 0", borderTop:borderC }}>
        <span style={{ fontSize:9, letterSpacing:".35em", textTransform:"uppercase", color:isDark?"#fff":"#000" }}>Selected Works</span>
        <span style={{ fontFamily:"monospace", fontSize:9, color:isDark?"#fff":"#000" }}>2024 — 2026</span>
      </div>

      {/* ══════════════════════════════════════════════════════════════════════
          PROYECTOS
          Desktop → ScrollStack con Lenis
          Mobile  → MobileStickyStack CSS puro (60fps nativo)
      ══════════════════════════════════════════════════════════════════════ */}
      <section style={{ position:"relative", zIndex:20, paddingTop:96, paddingBottom:96 }}>
        <div style={{ padding:"0 clamp(16px, 4vw, 48px)", maxWidth:1280, margin:"0 auto" }}>
          <SectionHeader label="Proyectos seleccionados" title="Selected" accent="Works" right={`01 — 0${projectsData.length}`} isDark={isDark}/>
        </div>
        <div style={{ padding:"0 clamp(12px, 3vw, 24px)" }}>

          {/* MOBILE: sticky CSS puro */}
          {isMobile && (
            <MobileStickyStack itemStackDistance={18}>
              {projectsData.map(project => (
                <ProjectCard key={project.id} project={project} isDesktop={false} isDark={isDark}/>
              ))}
            </MobileStickyStack>
          )}

          {/* DESKTOP: ScrollStack con Lenis */}
          {!isMobile && (
            <ScrollStack itemDistance={100} itemStackDistance={35} useWindowScroll={true} baseScale={0.92} stackPosition="10%">
              {projectsData.map(project => (
                <ScrollStackItem key={project.id}>
                  <ProjectCard project={project} isDesktop={true} isDark={isDark}/>
                </ScrollStackItem>
              ))}
            </ScrollStack>
          )}

        </div>
      </section>

      {/* SERVICIOS */}
      <section style={{ position:"relative", zIndex:20, padding:"clamp(48px, 10vw, 96px) clamp(20px, 4vw, 48px)", maxWidth:900, margin:"0 auto" }}>
        <SectionHeader label="Lo que ofrezco" title="Servicios" accent="& Disciplinas" isDark={isDark}/>
        <div>
          {services.map((s,i) => (
            <ServiceRow key={s.index} index={s.index} name={s.name} desc={s.desc} delay={i*0.07} isDark={isDark}/>
          ))}
        </div>
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
            { label:"Email",     href:"mailto:aprada.web@gmail.com" },
            { label:"Instagram", href:"https://instagram.com/tu_usuario" },
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
        <span style={{ fontFamily:"monospace", fontSize:9, color:isDark?"#fff":"#000" }}>© 2026</span>
        <span style={{ fontSize:9, letterSpacing:".4em", textTransform:"uppercase", color:isDark?"#fff":"#000" }}>Bogotá, CO</span>
      </footer>

      <WhatsAppFAB/>
    </div>
  )
}