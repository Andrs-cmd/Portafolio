import { motion, useScroll, useTransform } from "framer-motion"
import { useState, useEffect } from "react"
import { createPortal } from "react-dom"
import { useTheme } from "../context/ThemeContext"
import LiquidEther from "../components/LiquidEther"
import CardNav from "../components/CardNav"
import "../components/CardNav.css"
import { projects } from "../data/projects"

const LIQUID_DARK  = ['#0a0014', '#7b00cc', '#c026d3', '#60a5fa', '#ffffff']
const LIQUID_LIGHT = ['#f4f1f1', '#747272', '#000000']

const WA_NUMBER = "573195768097"

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

function ScrollBar() {
  const { scrollYProgress } = useScroll()
  const width = useTransform(scrollYProgress, [0, 1], ["0%", "100%"])
  const { isDark } = useTheme()
  return (
    <motion.div style={{ position: "fixed", top: 0, left: 0, height: 1.5, zIndex: 300, pointerEvents: "none", width, background: isDark ? "rgba(255,255,255,.3)" : "rgba(0,0,0,.25)" }}/>
  )
}

function ProjectRow({ project, isDark, isDesktop }: { project: typeof projects[0]; isDark: boolean; isDesktop: boolean }) {
  const [hovered, setHovered] = useState(false)
  const primaryLink = project.links[0]
  return (
    <motion.article
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: .6, ease: [.16, 1, .3, 1] }}
      style={{
        position: "relative",
        display: "flex",
        flexDirection: isDesktop ? "row" : "column",
        gap: isDesktop ? 48 : 24,
        padding: isDesktop ? "40px 0" : "32px 0",
        borderBottom: isDark ? "0.5px solid rgba(255,255,255,0.10)" : "0.5px solid rgba(0,0,0,0.10)",
      }}
    >
      {/* Index + year */}
      <div style={{ flexShrink: 0, width: isDesktop ? 120 : "auto", display: "flex", flexDirection: isDesktop ? "column" : "row", alignItems: isDesktop ? "flex-start" : "center", justifyContent: "space-between", gap: 8 }}>
        <span style={{ fontFamily: "monospace", fontSize: 11, color: isDark ? "rgba(255,255,255,0.55)" : "rgba(0,0,0,0.55)" }}>{project.index}</span>
        <span style={{ fontFamily: "monospace", fontSize: 11, color: isDark ? "rgba(255,255,255,0.55)" : "rgba(0,0,0,0.55)" }}>{project.year}</span>
      </div>

      {/* Title block */}
      <div style={{ flex: 1, minWidth: 0 }}>
        {project.client && (
          <span style={{ display: "block", fontSize: 10, letterSpacing: ".25em", textTransform: "uppercase", marginBottom: 10, color: isDark ? "rgba(255,255,255,0.65)" : "rgba(0,0,0,0.60)" }}>{project.client}</span>
        )}
        <motion.h3
          animate={{ x: hovered && isDesktop ? 8 : 0 }}
          transition={{ duration: .25 }}
          style={{
            fontSize: "clamp(1.8rem, 4vw, 3.2rem)",
            fontWeight: 900,
            textTransform: "uppercase",
            letterSpacing: "-.03em",
            lineHeight: .9,
            color: isDark ? "#fff" : "#111",
            marginBottom: 16,
          }}
        >
          {project.title}
        </motion.h3>
        <p style={{ fontSize: 13, fontWeight: 300, lineHeight: 1.7, maxWidth: 620, color: isDark ? "rgba(255,255,255,0.82)" : "rgba(0,0,0,0.78)", marginBottom: 16 }}>
          {project.description}
        </p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          {project.stack.map(t => (
            <span key={t} style={{ fontFamily: "monospace", fontSize: 9, padding: "4px 10px", borderRadius: 20, color: isDark ? "rgba(255,255,255,0.80)" : "rgba(0,0,0,0.75)", background: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.05)", border: isDark ? "1px solid rgba(255,255,255,0.16)" : "1px solid rgba(0,0,0,0.12)" }}>{t}</span>
          ))}
        </div>
      </div>

      {/* Meta + link */}
      <div style={{ flexShrink: 0, width: isDesktop ? 200 : "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", alignItems: isDesktop ? "flex-end" : "flex-start", gap: 16 }}>
        <span style={{ fontSize: 9, textTransform: "uppercase", letterSpacing: ".25em", padding: "4px 12px", borderRadius: 20, border: isDark ? "0.5px solid rgba(255,255,255,0.25)" : "0.5px solid rgba(0,0,0,0.22)", color: isDark ? "rgba(255,255,255,0.85)" : "rgba(0,0,0,0.80)" }}>{project.category}</span>
        {primaryLink && (
          <motion.a
            href={primaryLink.href}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ x: 4 }}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 10,
              fontSize: 11,
              textTransform: "uppercase",
              letterSpacing: ".22em",
              textDecoration: "none",
              color: isDark ? "rgba(255,255,255,0.95)" : "rgba(0,0,0,0.90)",
            }}
          >
            <span style={{ display: "inline-block", width: 20, height: .5, background: isDark ? "rgba(255,255,255,0.40)" : "rgba(0,0,0,0.35)" }}/>
            {primaryLink.label}
            <span>↗</span>
          </motion.a>
        )}
      </div>
    </motion.article>
  )
}

export default function Archive() {
  const { isDark } = useTheme()
  const isDesktop = useIsDesktop()
  const WA_URL = `https://wa.me/${WA_NUMBER}?text=Hola%20Andres%2C%20me%20interesa%20trabajar%20contigo`

  const pageBg = isDark ? "#060606" : "#f5f1e9"
  const borderC = isDark ? "0.5px solid rgba(255,255,255,0.07)" : "0.5px solid rgba(0,0,0,0.07)"

  const menuItems = [
    { label: "Servicios", bgColor: isDark ? "#111111" : "#f0ece4", textColor: isDark ? "#fff" : "#000",
      links: [{ label: "Desarrollo Web", href: "/lab", ariaLabel: "Web" }, { label: "Ecommerce", href: "/lab", ariaLabel: "Ecommerce" }] },
    { label: "Proyectos", bgColor: isDark ? "#1a1a1a" : "#e8e4dc", textColor: isDark ? "#fff" : "#000",
      links: [{ label: "Home", href: "/", ariaLabel: "Home" }, { label: "Lab / Demos", href: "/lab", ariaLabel: "Lab" }] },
    { label: "Contacto", bgColor: isDark ? "#dde4e6" : "#1a1a1a", textColor: isDark ? "#000" : "#fff",
      links: [{ label: "WhatsApp", href: WA_URL, ariaLabel: "WhatsApp" }, { label: "Email", href: "mailto:aprada.web@gmail.com", ariaLabel: "Email" }] },
  ]

  return (
    <div style={{ minHeight: "100vh", overflowX: "hidden", background: pageBg, color: isDark ? "#fff" : "#111", position: "relative" }}>

      {/* Liquid background */}
      <div style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none" }}>
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
        <div style={{ position: "absolute", inset: 0, zIndex: 1, pointerEvents: "none", background: isDark ? "rgba(0,0,0,.82)" : "rgba(245,241,233,.82)" }}/>
      </div>

      <ScrollBar/>
      <ThemeToggle/>

      <div style={{ position: "relative", zIndex: 50 }}>
        <CardNav logo="/faviconAP.ico" items={menuItems}
          baseColor={isDark ? "rgba(6,6,6,.95)" : "rgba(245,241,233,.95)"}
          menuColor={isDark ? "#fff" : "#111"} buttonBgColor={isDark ? "#dde4e6" : "#111"} buttonTextColor={isDark ? "#000" : "#fff"}/>
      </div>

      {/* HERO */}
      <section style={{ position: "relative", zIndex: 20, paddingTop: 140, paddingBottom: 40, paddingLeft: 48, paddingRight: 48, maxWidth: 1280, margin: "0 auto" }}>
        <motion.div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 28 }}
          initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: .6 }}>
          <div style={{ width: 22, height: .5, background: isDark ? "rgba(255,255,255,.4)" : "rgba(0,0,0,.35)" }}/>
          <span style={{ fontSize: 9, textTransform: "uppercase", letterSpacing: ".35em", color: isDark ? "rgba(255,255,255,.75)" : "rgba(0,0,0,.70)" }}>Archive — Todos los proyectos</span>
        </motion.div>

        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 24, flexWrap: "wrap" }}>
          <div>
            <div style={{ overflow: "hidden", marginBottom: 4 }}>
              <motion.h1 style={{ fontSize: "clamp(2.4rem, 6vw, 6rem)", fontWeight: 900, textTransform: "uppercase", letterSpacing: "-.04em", lineHeight: .85, color: isDark ? "#fff" : "#111" }}
                initial={{ y: 65 }} animate={{ y: 0 }} transition={{ duration: .9, ease: [.16, 1, .3, 1] }}>
                Archivo
              </motion.h1>
            </div>
            <div style={{ overflow: "hidden" }}>
              <motion.h1 style={{ fontSize: "clamp(2.4rem, 6vw, 6rem)", fontWeight: 900, textTransform: "uppercase", letterSpacing: "-.04em", lineHeight: .85, WebkitTextStroke: isDark ? "1.5px rgba(255,255,255,.25)" : "1.5px rgba(0,0,0,.22)", color: "transparent" }}
                initial={{ y: 65 }} animate={{ y: 0 }} transition={{ duration: .9, delay: .07, ease: [.16, 1, .3, 1] }}>
                de obra
              </motion.h1>
            </div>
          </div>
          <motion.p style={{ fontSize: 14, fontWeight: 300, lineHeight: 1.7, maxWidth: 320, paddingBottom: 4, color: isDark ? "rgba(255,255,255,.85)" : "rgba(0,0,0,.80)" }}
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .7, delay: .3 }}>
            Selección completa de proyectos publicados: ecommerce, plataformas y propuestas de diseño. Click en cada uno para ver el sitio real.
          </motion.p>
        </div>

        <div style={{ marginTop: 32, display: "flex", alignItems: "center", justifyContent: "space-between", borderTop: borderC, paddingTop: 12 }}>
          <span style={{ fontSize: 9, letterSpacing: ".3em", textTransform: "uppercase", color: isDark ? "rgba(255,255,255,.60)" : "rgba(0,0,0,.55)" }}>Proyectos publicados</span>
          <span style={{ fontFamily: "monospace", fontSize: 9, color: isDark ? "rgba(255,255,255,.55)" : "rgba(0,0,0,.50)" }}>01 — {String(projects.length).padStart(2, "0")}</span>
        </div>
      </section>

      {/* LIST */}
      <section style={{ position: "relative", zIndex: 20, padding: "32px 48px 96px", maxWidth: 1280, margin: "0 auto" }}>
        {projects.map(p => (
          <ProjectRow key={p.id} project={p} isDark={isDark} isDesktop={isDesktop}/>
        ))}
      </section>

      {/* CTA */}
      <section style={{ position: "relative", zIndex: 20, padding: "112px 48px", maxWidth: 1280, margin: "0 auto", display: "flex", flexDirection: isDesktop ? "row" : "column", alignItems: isDesktop ? "flex-end" : "flex-start", justifyContent: "space-between", gap: 48, borderTop: borderC }}>
        <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: .7 }} viewport={{ once: true }}>
          <span style={{ fontSize: 9, letterSpacing: ".35em", textTransform: "uppercase", display: "block", marginBottom: 16, color: isDark ? "rgba(255,255,255,.70)" : "rgba(0,0,0,.65)" }}>¿Construimos el tuyo?</span>
          <h2 style={{ fontSize: "clamp(2.8rem,7vw,5rem)", fontWeight: 900, textTransform: "uppercase", letterSpacing: "-.04em", lineHeight: .86, color: isDark ? "#fff" : "#111" }}>
            Hablemos<br/>
            <span style={{ WebkitTextStroke: isDark ? "1.5px rgba(255,255,255,.22)" : "1.5px rgba(0,0,0,.20)", color: "transparent" }}>de tu proyecto</span>
          </h2>
        </motion.div>
        <div style={{ display: "flex", flexDirection: "column", gap: 16, flexShrink: 0 }}>
          {[
            { label: "WhatsApp", href: WA_URL },
            { label: "Email", href: "mailto:aprada.web@gmail.com" },
          ].map(({ label, href }, i) => (
            <motion.a key={label} href={href} target={href.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer"
              style={{ display: "flex", alignItems: "center", gap: 16, textDecoration: "none", fontSize: 13, textTransform: "uppercase", letterSpacing: ".2em", color: isDark ? "rgba(255,255,255,.90)" : "rgba(0,0,0,.85)" }}
              initial={{ opacity: 0, x: 12 }} whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: .5, delay: i * .08 }} viewport={{ once: true }}
              whileHover={{ x: 4 }}>
              <span style={{ display: "inline-block", width: 20, height: .5, background: isDark ? "rgba(255,255,255,.4)" : "rgba(0,0,0,.35)" }}/>
              {label}
            </motion.a>
          ))}
        </div>
      </section>

      <footer style={{ position: "relative", zIndex: 20, padding: "32px 48px", display: "flex", alignItems: "center", justifyContent: "space-between", background: pageBg, borderTop: borderC }}>
        <span style={{ fontSize: 9, letterSpacing: ".4em", textTransform: "uppercase", color: isDark ? "rgba(255,255,255,.55)" : "rgba(0,0,0,.55)" }}>Andres Prada</span>
        <span style={{ fontFamily: "monospace", fontSize: 9, color: isDark ? "rgba(255,255,255,.45)" : "rgba(0,0,0,.45)" }}>© 2026</span>
        <span style={{ fontSize: 9, letterSpacing: ".4em", textTransform: "uppercase", color: isDark ? "rgba(255,255,255,.55)" : "rgba(0,0,0,.55)" }}>Bogotá, CO</span>
      </footer>
    </div>
  )
}
