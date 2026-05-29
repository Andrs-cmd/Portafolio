import { motion, AnimatePresence, useScroll, useTransform, useMotionValue, useSpring } from "framer-motion"
import { useState, useEffect, useRef, useCallback } from "react"
import { createPortal } from "react-dom"
import { useTheme } from "../context/ThemeContext"
import LiquidEther from "../components/OptionalLiquidEther"
import CardNav from "../components/CardNav"
import "../components/CardNav.css"
import {
  photosCaptures,
  photosStudio,
  photosEditorial,
  motionPieces,
  heroPhotos,
  allPhotos,
  type GalleryPhoto,
} from "../data/gallery"
import { WhatsAppFAB, WhatsAppPill, WhatsAppBanner } from "../components/WhatsAppCTA"
import { useSEO } from "../lib/useSEO"

const LIQUID_DARK = ["#0a0014", "#7b00cc", "#c026d3", "#60a5fa", "#ffffff"]
const LIQUID_LIGHT = ["#f4f1f1", "#747272", "#000000"]

const WA_NUMBER = "573195768097"
const WA_URL = `https://wa.me/${WA_NUMBER}?text=Hola%20Andres%2C%20vi%20tu%20portafolio%20visual%20y%20me%20interesa`

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

/* ─────────────────────────────────────────────────────────
   CURSOR PREVIEW — sticky thumbnail follows mouse (desktop)
───────────────────────────────────────────────────────── */
function CursorPreview({ src, label, isDark }: { src: string | null; label: string; isDark: boolean }) {
  const rawX = useMotionValue(0)
  const rawY = useMotionValue(0)
  const x = useSpring(rawX, { stiffness: 350, damping: 30 })
  const y = useSpring(rawY, { stiffness: 350, damping: 30 })
  const [mounted, setMounted] = useState(false)

  useEffect(() => { setMounted(true) }, [])
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      rawX.set(e.clientX + 18)
      rawY.set(e.clientY + 18)
    }
    window.addEventListener("mousemove", onMove)
    return () => window.removeEventListener("mousemove", onMove)
  }, [rawX, rawY])

  if (!mounted) return null
  const el = (
    <AnimatePresence>
      {src && (
        <motion.div
          style={{ position: "fixed", top: 0, left: 0, x, y, zIndex: 9998, pointerEvents: "none" }}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.22, ease: [.16, 1, .3, 1] }}
        >
          <div style={{ width: 220, height: 280, overflow: "hidden", border: isDark ? "1px solid rgba(255,255,255,.20)" : "1px solid rgba(0,0,0,.18)", boxShadow: isDark ? "0 12px 32px rgba(0,0,0,.6)" : "0 12px 32px rgba(0,0,0,.18)", background: isDark ? "#111" : "#fff" }}>
            <img src={src} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }}/>
          </div>
          <div style={{ marginTop: 6, fontFamily: "monospace", fontSize: 9, letterSpacing: ".18em", textTransform: "uppercase", color: isDark ? "#fff" : "#000" }}>{label}</div>
        </motion.div>
      )}
    </AnimatePresence>
  )
  return createPortal(el, document.body)
}

/* ─────────────────────────────────────────────────────────
   LIGHTBOX — modal con teclado + click navigation
───────────────────────────────────────────────────────── */
function Lightbox({ photos, index, onClose, onPrev, onNext, isDark }: {
  photos: GalleryPhoto[]
  index: number | null
  onClose: () => void
  onPrev: () => void
  onNext: () => void
  isDark: boolean
}) {
  const [mounted, setMounted] = useState(false)
  useEffect(() => { setMounted(true) }, [])
  useEffect(() => {
    if (index === null) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
      if (e.key === "ArrowLeft") onPrev()
      if (e.key === "ArrowRight") onNext()
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [index, onClose, onPrev, onNext])

  useEffect(() => {
    if (index === null) return
    const original = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => { document.body.style.overflow = original }
  }, [index])

  if (!mounted) return null
  const photo = index !== null ? photos[index] : null

  const el = (
    <AnimatePresence>
      {photo && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: .35 }}
          onClick={onClose}
          style={{ position: "fixed", inset: 0, zIndex: 10000, background: isDark ? "rgba(0,0,0,.96)" : "rgba(245,241,233,.97)", backdropFilter: "blur(12px)", display: "flex", alignItems: "center", justifyContent: "center", padding: "clamp(56px, 8vw, 60px) clamp(16px, 4vw, 32px)", cursor: "zoom-out" }}
        >
          {/* close */}
          <motion.button
            onClick={(e) => { e.stopPropagation(); onClose() }}
            initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .2 }}
            style={{ position: "absolute", top: 24, right: 24, width: 44, height: 44, border: isDark ? "1px solid rgba(255,255,255,.20)" : "1px solid rgba(0,0,0,.20)", background: "transparent", color: isDark ? "#fff" : "#111", borderRadius: 22, cursor: "pointer", fontSize: 18, lineHeight: 1, display: "flex", alignItems: "center", justifyContent: "center" }}
          >×</motion.button>

          {/* counter + caption */}
          <motion.div
            initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .25 }}
            style={{ position: "absolute", top: 30, left: 32, display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ fontFamily: "monospace", fontSize: 10, letterSpacing: ".22em", color: isDark ? "#fff" : "#000" }}>
              {String((index ?? 0) + 1).padStart(2, "0")} / {String(photos.length).padStart(2, "0")}
            </span>
            <div style={{ width: 28, height: .5, background: isDark ? "rgba(255,255,255,.30)" : "rgba(0,0,0,.30)" }}/>
            <span style={{ fontFamily: "monospace", fontSize: 10, letterSpacing: ".22em", textTransform: "uppercase", color: isDark ? "#fff" : "#000" }}>{photo.alt}</span>
          </motion.div>

          {/* prev */}
          <motion.button
            onClick={(e) => { e.stopPropagation(); onPrev() }}
            whileHover={{ x: -4 }}
            style={{ position: "absolute", left: 8, top: "50%", transform: "translateY(-50%)", width: 56, height: 56, border: "none", background: "rgba(0,0,0,.30)", borderRadius: 28, color: isDark ? "#fff" : "#111", cursor: "pointer", fontSize: 28, opacity: .9, display: "flex", alignItems: "center", justifyContent: "center" }}>‹</motion.button>

          {/* next */}
          <motion.button
            onClick={(e) => { e.stopPropagation(); onNext() }}
            whileHover={{ x: 4 }}
            style={{ position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)", width: 56, height: 56, border: "none", background: "rgba(0,0,0,.30)", borderRadius: 28, color: isDark ? "#fff" : "#111", cursor: "pointer", fontSize: 28, opacity: .9, display: "flex", alignItems: "center", justifyContent: "center" }}>›</motion.button>

          <motion.img
            key={photo.id}
            src={photo.src}
            srcSet={photo.srcSet}
            sizes="100vw"
            alt={photo.alt}
            decoding="async"
            onClick={(e) => e.stopPropagation()}
            initial={{ opacity: 0, scale: .98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: .98 }}
            transition={{ duration: .35, ease: [.16, 1, .3, 1] }}
            style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain", cursor: "default", boxShadow: isDark ? "0 24px 80px rgba(0,0,0,.6)" : "0 24px 80px rgba(0,0,0,.18)" }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  )
  return createPortal(el, document.body)
}

/* ─────────────────────────────────────────────────────────
   PHOTO CELL — base con hover, click → lightbox
───────────────────────────────────────────────────────── */
function PhotoCell({
  photo, isDark, onOpen, onHover, idx, aspectRatio, gridArea, style, sizes = "(max-width: 768px) 50vw, 33vw",
}: {
  photo: GalleryPhoto
  isDark: boolean
  onOpen: () => void
  onHover: (src: string | null, label: string) => void
  idx: number
  aspectRatio?: string
  gridArea?: string
  style?: React.CSSProperties
  sizes?: string
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: .6, delay: (idx % 6) * .04, ease: [.16, 1, .3, 1] }}
      onClick={onOpen}
      onMouseEnter={() => onHover(photo.thumb, photo.alt)}
      onMouseLeave={() => onHover(null, "")}
      style={{
        position: "relative",
        overflow: "hidden",
        cursor: "zoom-in",
        gridArea,
        aspectRatio,
        ...style,
      }}
    >
      <motion.img
        src={photo.src}
        srcSet={photo.srcSet}
        sizes={sizes}
        alt={photo.alt}
        loading="lazy"
        decoding="async"
        style={{ width: "100%", height: "100%", objectFit: "cover", filter: isDark ? "grayscale(15%) brightness(.95)" : "grayscale(8%) brightness(1)" }}
        whileHover={{ scale: 1.04, filter: isDark ? "grayscale(0%) brightness(1)" : "grayscale(0%) brightness(1)" }}
        transition={{ duration: .7, ease: [.16, 1, .3, 1] }}
      />
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,.45) 0%, transparent 35%)", pointerEvents: "none" }}/>
      <div style={{ position: "absolute", bottom: 12, left: 12, fontFamily: "monospace", fontSize: 9, letterSpacing: ".22em", color: "#fff" }}>
        {String(idx + 1).padStart(3, "0")}
      </div>
    </motion.div>
  )
}

/* ─────────────────────────────────────────────────────────
   HERO COVER — magazine cover style
───────────────────────────────────────────────────────── */
function HeroCover({ isDark, isDesktop }: { isDark: boolean; isDesktop: boolean }) {
  const [current, setCurrent] = useState(0)
  useEffect(() => {
    const t = setInterval(() => setCurrent(c => (c + 1) % heroPhotos.length), 4200)
    return () => clearInterval(t)
  }, [])

  return (
    <section style={{ position: "relative", zIndex: 20, paddingTop: 96, minHeight: "100vh", display: "flex", flexDirection: isDesktop ? "row" : "column" }}>
      {/* Cover image */}
      <div style={{ flex: isDesktop ? "1.1 1 0" : "none", width: "100%", position: "relative", overflow: "hidden", minHeight: isDesktop ? "auto" : "70vw", height: isDesktop ? "calc(100vh - 96px)" : "70vw" }}>
        <AnimatePresence>
          <motion.img
            key={current}
            src={heroPhotos[current].src}
            srcSet={heroPhotos[current].srcSet}
            sizes="(max-width: 1024px) 100vw, 55vw"
            alt=""
            decoding="async"
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", filter: isDark ? "grayscale(20%) brightness(.78)" : "grayscale(8%) brightness(.95)" }}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.6, ease: [.16, 1, .3, 1] }}
          />
        </AnimatePresence>
        {/* gradient */}
        <div style={{ position: "absolute", inset: 0, background: isDark ? "linear-gradient(to right, rgba(6,6,6,.55) 0%, transparent 55%)" : "linear-gradient(to right, rgba(245,241,233,.6) 0%, transparent 55%)", pointerEvents: "none" }}/>
        {/* corner brackets */}
        <div style={{ position: "absolute", top: 24, left: 24, width: 24, height: 24, borderLeft: isDark ? "1px solid rgba(255,255,255,.35)" : "1px solid rgba(0,0,0,.30)", borderTop: isDark ? "1px solid rgba(255,255,255,.35)" : "1px solid rgba(0,0,0,.30)" }}/>
        <div style={{ position: "absolute", bottom: 24, right: 24, width: 24, height: 24, borderRight: isDark ? "1px solid rgba(255,255,255,.35)" : "1px solid rgba(0,0,0,.30)", borderBottom: isDark ? "1px solid rgba(255,255,255,.35)" : "1px solid rgba(0,0,0,.30)" }}/>
        {/* image counter */}
        <div style={{ position: "absolute", top: 24, right: 24, fontFamily: "monospace", fontSize: 9, letterSpacing: ".22em", color: isDark ? "#fff" : "#000" }}>
          {String(current + 1).padStart(2, "0")} / {String(heroPhotos.length).padStart(2, "0")}
        </div>
      </div>

      {/* Cover text */}
      <div style={{ flex: 1, padding: isDesktop ? "80px 56px" : "48px 28px", display: "flex", flexDirection: "column", justifyContent: "center", position: "relative" }}>
        <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: .7 }}
          style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 32 }}>
          <div style={{ width: 24, height: .5, background: isDark ? "rgba(255,255,255,.35)" : "rgba(0,0,0,.30)" }}/>
          <span style={{ fontSize: 9, letterSpacing: ".35em", textTransform: "uppercase", color: isDark ? "#fff" : "#000" }}>
            Issue 01 · MMXXVI
          </span>
        </motion.div>

        <div style={{ overflow: "hidden", marginBottom: 4 }}>
          <motion.h1 initial={{ y: 90 }} animate={{ y: 0 }} transition={{ duration: 1, ease: [.16, 1, .3, 1] }}
            style={{ fontSize: "clamp(3rem, 8vw, 8rem)", fontWeight: 900, textTransform: "uppercase", letterSpacing: "-.045em", lineHeight: .82, color: isDark ? "#fff" : "#111" }}>
            Visual
          </motion.h1>
        </div>
        <div style={{ overflow: "hidden", marginBottom: 32 }}>
          <motion.h1 initial={{ y: 90 }} animate={{ y: 0 }} transition={{ duration: 1, delay: .08, ease: [.16, 1, .3, 1] }}
            style={{ fontSize: "clamp(3rem, 8vw, 8rem)", fontWeight: 900, textTransform: "uppercase", letterSpacing: "-.045em", lineHeight: .82, WebkitTextStroke: isDark ? "1.5px rgba(255,255,255,.28)" : "1.5px rgba(0,0,0,.22)", color: "transparent" }}>
            Editorial
          </motion.h1>
        </div>

        <motion.p initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .8, delay: .35 }}
          style={{ fontSize: 15, fontWeight: 300, lineHeight: 1.8, maxWidth: 380, color: isDark ? "#fff" : "#000", marginBottom: 32 }}>
          Fotografía, dirección de arte y motion. Una selección curada de proyectos personales y editoriales, pensada para leerse como una revista.
        </motion.p>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: .6 }}
          style={{ display: "flex", flexDirection: "column", gap: 4, fontFamily: "monospace", fontSize: 10, letterSpacing: ".22em", color: isDark ? "#fff" : "#000" }}>
          <span>· {photosCaptures.length + photosStudio.length + photosEditorial.length} fotografías</span>
          <span>· {motionPieces.length} piezas en movimiento</span>
          <span>· Dirección + cámara + edición</span>
        </motion.div>
      </div>
    </section>
  )
}

/* ─────────────────────────────────────────────────────────
   TOC — table of contents
───────────────────────────────────────────────────────── */
function TableOfContents({ isDark }: { isDark: boolean }) {
  const chapters = [
    { num: "01", title: "Captures", desc: "Diario", count: photosCaptures.length, target: "#capt" },
    { num: "02", title: "Studio Sessions", desc: "DSLR · Retrato", count: photosStudio.length, target: "#studio" },
    { num: "03", title: "GUA Series", desc: "Editorial", count: photosEditorial.length, target: "#gua" },
    { num: "04", title: "Motion", desc: "Animación", count: motionPieces.length, target: "#motion" },
  ]
  return (
    <section style={{ position: "relative", zIndex: 20, padding: "clamp(48px, 10vw, 96px) clamp(20px, 4vw, 48px)", maxWidth: 1280, margin: "0 auto" }}>
      <motion.div initial={{ opacity: 0, x: -12 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: .7 }}
        style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 40 }}>
        <div style={{ width: 22, height: .5, background: isDark ? "rgba(255,255,255,.40)" : "rgba(0,0,0,.35)" }}/>
        <span style={{ fontSize: 9, letterSpacing: ".35em", textTransform: "uppercase", color: isDark ? "#fff" : "#000" }}>Índice</span>
      </motion.div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 0, borderTop: isDark ? "0.5px solid rgba(255,255,255,.12)" : "0.5px solid rgba(0,0,0,.10)" }}>
        {chapters.map((c, i) => (
          <motion.a
            key={c.num}
            href={c.target}
            initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            transition={{ duration: .6, delay: i * .08 }}
            whileHover={{ y: -3 }}
            style={{
              padding: "32px 24px 32px 0",
              borderBottom: isDark ? "0.5px solid rgba(255,255,255,.10)" : "0.5px solid rgba(0,0,0,.10)",
              borderRight: i < chapters.length - 1 ? (isDark ? "0.5px solid rgba(255,255,255,.10)" : "0.5px solid rgba(0,0,0,.10)") : "none",
              paddingLeft: i === 0 ? 0 : 24,
              textDecoration: "none",
              cursor: "pointer",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
              <span style={{ fontFamily: "monospace", fontSize: 10, color: isDark ? "#fff" : "#000" }}>{c.num}</span>
              <div style={{ flex: 1, height: .5, background: isDark ? "rgba(255,255,255,.10)" : "rgba(0,0,0,.10)" }}/>
              <span style={{ fontFamily: "monospace", fontSize: 10, color: isDark ? "#fff" : "#000" }}>{c.count} piezas</span>
            </div>
            <h3 style={{ fontSize: "clamp(1.6rem, 3vw, 2.4rem)", fontWeight: 900, textTransform: "uppercase", letterSpacing: "-.03em", lineHeight: .9, color: isDark ? "#fff" : "#111", marginBottom: 6 }}>{c.title}</h3>
            <span style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: ".25em", color: isDark ? "#fff" : "#000" }}>{c.desc}</span>
          </motion.a>
        ))}
      </div>
    </section>
  )
}

/* ─────────────────────────────────────────────────────────
   CHAPTER HEADER
───────────────────────────────────────────────────────── */
function ChapterHeader({ num, title, kicker, isDark }: { num: string; title: string; kicker: string; isDark: boolean }) {
  return (
    <motion.div initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: .7, ease: [.16, 1, .3, 1] }}
      style={{ padding: "clamp(64px, 12vw, 120px) clamp(20px, 4vw, 48px) clamp(32px, 6vw, 48px)", maxWidth: 1280, margin: "0 auto" }}>
      <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 32, flexWrap: "wrap" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 18 }}>
            <span style={{ fontFamily: "monospace", fontSize: 11, color: isDark ? "#fff" : "#000" }}>Capítulo {num}</span>
            <div style={{ width: 24, height: .5, background: isDark ? "rgba(255,255,255,.30)" : "rgba(0,0,0,.25)" }}/>
            <span style={{ fontSize: 9, letterSpacing: ".25em", textTransform: "uppercase", color: isDark ? "#fff" : "#000" }}>{kicker}</span>
          </div>
          <h2 style={{ fontSize: "clamp(2.2rem, 6vw, 5rem)", fontWeight: 900, textTransform: "uppercase", letterSpacing: "-.04em", lineHeight: .85, color: isDark ? "#fff" : "#111" }}>{title}</h2>
        </div>
      </div>
    </motion.div>
  )
}

/* ─────────────────────────────────────────────────────────
   MAGAZINE SPREAD — editorial layout for GUA Series
   Patterns: cover, triptych, mosaic, full-bleed, pair
───────────────────────────────────────────────────────── */
function EditorialSpreads({ photos, isDark, isDesktop, onOpen, onHover, baseIdx }: {
  photos: GalleryPhoto[]
  isDark: boolean
  isDesktop: boolean
  onOpen: (i: number) => void
  onHover: (src: string | null, label: string) => void
  baseIdx: number
}) {
  // Group of 6 = 1 "spread"
  const spreads: GalleryPhoto[][] = []
  for (let i = 0; i < photos.length; i += 6) spreads.push(photos.slice(i, i + 6))

  return (
    <div style={{ position: "relative", zIndex: 20 }}>
      {spreads.map((sp, si) => {
        const pattern = si % 3
        const startIdx = baseIdx + si * 6
        return (
          <div key={si} style={{ padding: "0 clamp(16px, 4vw, 24px) clamp(48px, 8vw, 96px)", maxWidth: 1280, margin: "0 auto" }}>
            {/* spread label */}
            <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "0 clamp(8px, 2vw, 24px)", marginBottom: 16 }}>
              <span style={{ fontFamily: "monospace", fontSize: 10, color: isDark ? "#fff" : "#000" }}>
                Spread {String(si + 1).padStart(2, "0")}
              </span>
              <div style={{ flex: 1, height: .5, background: isDark ? "rgba(255,255,255,.08)" : "rgba(0,0,0,.08)" }}/>
              <span style={{ fontFamily: "monospace", fontSize: 10, color: isDark ? "#fff" : "#000" }}>
                {String(startIdx + 1).padStart(3, "0")} — {String(startIdx + sp.length).padStart(3, "0")}
              </span>
            </div>

            {/* layout patterns */}
            {pattern === 0 && (
              /* Pattern A: hero + triptych below */
              <div style={{ display: "grid", gridTemplateColumns: isDesktop ? "1fr 1fr 1fr" : "1fr", gap: 12 }}>
                {sp[0] && <PhotoCell photo={sp[0]} isDark={isDark} idx={startIdx} aspectRatio={isDesktop ? "16/9" : "4/5"} onOpen={() => onOpen(startIdx)} onHover={onHover} style={{ gridColumn: isDesktop ? "1 / 4" : "auto" }}/>}
                {sp.slice(1, 4).map((p, i) => (
                  <PhotoCell key={p.id} photo={p} isDark={isDark} idx={startIdx + 1 + i} aspectRatio="4/5" onOpen={() => onOpen(startIdx + 1 + i)} onHover={onHover}/>
                ))}
                {sp.slice(4).map((p, i) => (
                  <PhotoCell key={p.id} photo={p} isDark={isDark} idx={startIdx + 4 + i} aspectRatio="4/5" onOpen={() => onOpen(startIdx + 4 + i)} onHover={onHover} style={{ gridColumn: isDesktop && i === 0 && sp.length === 5 ? "span 3" : undefined }}/>
                ))}
              </div>
            )}

            {pattern === 1 && (
              /* Pattern B: asymmetric — large left, stacked right */
              <div style={{ display: "grid", gridTemplateColumns: isDesktop ? "1.4fr 1fr" : "1fr", gap: 12 }}>
                {sp[0] && <PhotoCell photo={sp[0]} isDark={isDark} idx={startIdx} aspectRatio={isDesktop ? "3/4" : "4/5"} onOpen={() => onOpen(startIdx)} onHover={onHover} style={{ gridRow: isDesktop ? "span 2" : "auto" }}/>}
                {sp.slice(1).map((p, i) => (
                  <PhotoCell key={p.id} photo={p} isDark={isDark} idx={startIdx + 1 + i} aspectRatio="4/3" onOpen={() => onOpen(startIdx + 1 + i)} onHover={onHover}/>
                ))}
              </div>
            )}

            {pattern === 2 && (
              /* Pattern C: full-width band + grid */
              <>
                {sp[0] && (
                  <div style={{ marginBottom: 12 }}>
                    <PhotoCell photo={sp[0]} isDark={isDark} idx={startIdx} aspectRatio="21/9" onOpen={() => onOpen(startIdx)} onHover={onHover}/>
                  </div>
                )}
                <div style={{ display: "grid", gridTemplateColumns: isDesktop ? "repeat(auto-fit, minmax(220px, 1fr))" : "1fr 1fr", gap: 12 }}>
                  {sp.slice(1).map((p, i) => (
                    <PhotoCell key={p.id} photo={p} isDark={isDark} idx={startIdx + 1 + i} aspectRatio="3/4" onOpen={() => onOpen(startIdx + 1 + i)} onHover={onHover}/>
                  ))}
                </div>
              </>
            )}
          </div>
        )
      })}
    </div>
  )
}

/* ─────────────────────────────────────────────────────────
   CAPTURES — daily 4-photo block
───────────────────────────────────────────────────────── */
function CapturesBlock({ photos, isDark, isDesktop, onOpen, onHover, baseIdx }: {
  photos: GalleryPhoto[]
  isDark: boolean
  isDesktop: boolean
  onOpen: (i: number) => void
  onHover: (src: string | null, label: string) => void
  baseIdx: number
}) {
  return (
    <div style={{ padding: "0 clamp(16px, 4vw, 48px) 32px", maxWidth: 1280, margin: "0 auto" }}>
      <div style={{ display: "grid", gridTemplateColumns: isDesktop ? "1fr 1fr 1fr 1fr" : "1fr 1fr", gap: 12 }}>
        {photos.map((p, i) => (
          <PhotoCell key={p.id} photo={p} isDark={isDark} idx={baseIdx + i} aspectRatio="3/4" onOpen={() => onOpen(baseIdx + i)} onHover={onHover} sizes="(max-width: 768px) 50vw, 25vw"/>
        ))}
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────────────────────
   STUDIO BLOCK — DSC + BEL editorial layout
   Layout: 1 hero portrait + 4 quad grid + asymmetric pair + closer
───────────────────────────────────────────────────────── */
function StudioBlock({ photos, isDark, isDesktop, onOpen, onHover, baseIdx }: {
  photos: GalleryPhoto[]
  isDark: boolean
  isDesktop: boolean
  onOpen: (i: number) => void
  onHover: (src: string | null, label: string) => void
  baseIdx: number
}) {
  // Split: hero (0), quad (1-4), pair (5-6), closer (7-8)
  const hero = photos[0]
  const quad = photos.slice(1, 5)
  const pair = photos.slice(5, 7)
  const closer = photos.slice(7, 9)

  return (
    <div style={{ padding: "0 clamp(16px, 4vw, 48px) 32px", maxWidth: 1280, margin: "0 auto" }}>
      {/* hero portrait — large center */}
      {hero && (
        <div style={{ marginBottom: 12, display: "grid", gridTemplateColumns: isDesktop ? "1fr 1.4fr 1fr" : "1fr", gap: 12 }}>
          <div style={{ display: "flex", flexDirection: "column", justifyContent: "flex-end", padding: isDesktop ? "0 12px 24px" : "0 4px 4px", order: isDesktop ? 0 : 1 }}>
            <span style={{ fontFamily: "monospace", fontSize: 10, letterSpacing: ".22em", color: isDark ? "#fff" : "#000", marginBottom: 8 }}>
              Opening · {String(baseIdx + 1).padStart(3, "0")}
            </span>
            <p style={{ fontSize: 13, fontWeight: 400, lineHeight: 1.6, color: isDark ? "#fff" : "#000" }}>
              Sesiones de estudio. Retrato editorial con luz controlada — la imagen sostiene la mirada antes que el copy.
            </p>
          </div>
          <PhotoCell photo={hero} isDark={isDark} idx={baseIdx} aspectRatio="3/4" onOpen={() => onOpen(baseIdx)} onHover={onHover} sizes="(max-width: 1024px) 100vw, 40vw"/>
          {isDesktop && <div/>}
        </div>
      )}

      {/* quad */}
      {quad.length > 0 && (
        <div style={{ display: "grid", gridTemplateColumns: isDesktop ? "repeat(4, 1fr)" : "repeat(2, 1fr)", gap: 12, marginBottom: 12 }}>
          {quad.map((p, i) => (
            <PhotoCell key={p.id} photo={p} isDark={isDark} idx={baseIdx + 1 + i} aspectRatio="3/4" onOpen={() => onOpen(baseIdx + 1 + i)} onHover={onHover}/>
          ))}
        </div>
      )}

      {/* asymmetric pair */}
      {pair.length === 2 && (
        <div style={{ display: "grid", gridTemplateColumns: isDesktop ? "1.6fr 1fr" : "1fr", gap: 12, marginBottom: 12 }}>
          <PhotoCell photo={pair[0]} isDark={isDark} idx={baseIdx + 5} aspectRatio={isDesktop ? "4/3" : "3/4"} onOpen={() => onOpen(baseIdx + 5)} onHover={onHover}/>
          <PhotoCell photo={pair[1]} isDark={isDark} idx={baseIdx + 6} aspectRatio="3/4" onOpen={() => onOpen(baseIdx + 6)} onHover={onHover}/>
        </div>
      )}

      {/* closer */}
      {closer.length > 0 && (
        <div style={{ display: "grid", gridTemplateColumns: isDesktop ? "repeat(2, 1fr)" : "repeat(2, 1fr)", gap: 12 }}>
          {closer.map((p, i) => (
            <PhotoCell key={p.id} photo={p} isDark={isDark} idx={baseIdx + 7 + i} aspectRatio="3/4" onOpen={() => onOpen(baseIdx + 7 + i)} onHover={onHover}/>
          ))}
        </div>
      )}
    </div>
  )
}

/* ─────────────────────────────────────────────────────────
   MOTION REEL — autoplay videos with editorial captions
───────────────────────────────────────────────────────── */
function MotionPiece({ piece, idx, isDark, isDesktop }: {
  piece: typeof motionPieces[0]
  idx: number
  isDark: boolean
  isDesktop: boolean
}) {
  const [unmuted, setUnmuted] = useState(false)
  const [hovered, setHovered] = useState(false)
  const [inView, setInView] = useState(false)
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const wrapRef = useRef<HTMLDivElement | null>(null)
  const flip = idx % 2 === 1

  useEffect(() => {
    if (!wrapRef.current) return
    const obs = new IntersectionObserver(
      entries => entries.forEach(e => {
        if (e.isIntersecting) {
          setInView(true)
          videoRef.current?.play().catch(() => {})
        } else {
          videoRef.current?.pause()
        }
      }),
      { rootMargin: "120px", threshold: 0.1 }
    )
    obs.observe(wrapRef.current)
    return () => obs.disconnect()
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: .8, ease: [.16, 1, .3, 1] }}
      style={{ padding: isDesktop ? "0 48px" : "0 20px", maxWidth: 1280, margin: "0 auto 96px" }}
    >
      <div style={{ display: "flex", flexDirection: isDesktop ? (flip ? "row-reverse" : "row") : "column", gap: isDesktop ? 32 : 16, alignItems: "stretch" }}>
        <div
          ref={wrapRef}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          style={{ position: "relative", flex: isDesktop ? "2 1 0" : "none", aspectRatio: "16/9", overflow: "hidden", background: "#0a0a0a", cursor: "pointer" }}
          onClick={() => {
            setUnmuted(u => !u)
            if (videoRef.current) videoRef.current.muted = unmuted
          }}
        >
          {inView && (
            <video
              ref={videoRef}
              src={piece.src}
              poster={piece.poster}
              loop
              muted={!unmuted}
              playsInline
              preload="metadata"
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          )}
          {!inView && (
            <img src={piece.poster} alt={piece.title} loading="lazy" decoding="async" style={{ width: "100%", height: "100%", objectFit: "cover", filter: "brightness(.85)" }}/>
          )}
          <motion.div
            animate={{ opacity: hovered ? 1 : .7 }}
            transition={{ duration: .25 }}
            style={{ position: "absolute", bottom: 16, right: 16, display: "flex", alignItems: "center", gap: 8, padding: "8px 14px", borderRadius: 20, background: "rgba(0,0,0,.65)", border: "1px solid rgba(255,255,255,.30)", backdropFilter: "blur(6px)", color: "#fff", fontSize: 10, letterSpacing: ".25em", textTransform: "uppercase" }}>
            {unmuted ? "Sonido ON" : "Click para audio"}
          </motion.div>
          <div style={{ position: "absolute", top: 16, left: 16, width: 18, height: 18, borderLeft: "1px solid rgba(255,255,255,.5)", borderTop: "1px solid rgba(255,255,255,.5)" }}/>
          <div style={{ position: "absolute", bottom: 16, left: 16, width: 18, height: 18, borderLeft: "1px solid rgba(255,255,255,.5)", borderBottom: "1px solid rgba(255,255,255,.5)" }}/>
        </div>

        <div style={{ flex: isDesktop ? "1 1 0" : "none", display: "flex", flexDirection: "column", justifyContent: "center", paddingTop: isDesktop ? 0 : 12 }}>
          <span style={{ fontFamily: "monospace", fontSize: 10, letterSpacing: ".25em", color: isDark ? "#fff" : "#000", marginBottom: 12 }}>
            Pieza {String(idx + 1).padStart(2, "0")} / {String(motionPieces.length).padStart(2, "0")}
          </span>
          <h3 style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)", fontWeight: 900, textTransform: "uppercase", letterSpacing: "-.03em", lineHeight: .9, color: isDark ? "#fff" : "#000", marginBottom: 16 }}>
            {piece.title}
          </h3>
          <p style={{ fontSize: 13, fontWeight: 400, lineHeight: 1.7, color: isDark ? "#fff" : "#000", maxWidth: 360 }}>
            Loop visual. Auto-reproducción muteada. Click sobre el reel para activar audio.
          </p>
        </div>
      </div>
    </motion.div>
  )
}

/* ─────────────────────────────────────────────────────────
   MAIN
───────────────────────────────────────────────────────── */
export default function Visual() {
  useSEO({
    title: "Visual Editorial · Fotografía y Motion",
    description: "Portafolio visual de Andres Prada: fotografía editorial, dirección de arte y motion graphics. 34 piezas curadas como una revista en cuatro capítulos.",
    path: "/visual",
    image: "https://res.cloudinary.com/dq5tsivzq/image/upload/f_auto,q_auto,w_1200/v1779425407/GUA_4718_gwpah8.jpg",
    keywords: "fotografía editorial bogotá, motion graphics colombia, dirección creativa, portafolio visual, reels, after effects, editorial",
  })
  const { isDark } = useTheme()
  const isDesktop = useIsDesktop()
  const [lbIndex, setLbIndex] = useState<number | null>(null)
  const [cursorSrc, setCursorSrc] = useState<string | null>(null)
  const [cursorLabel, setCursorLabel] = useState("")

  const pageBg = isDark ? "#060606" : "#f5f1e9"
  const borderC = isDark ? "0.5px solid rgba(255,255,255,0.07)" : "0.5px solid rgba(0,0,0,0.07)"

  const openLb = useCallback((i: number) => setLbIndex(i), [])
  const closeLb = useCallback(() => setLbIndex(null), [])
  const prevLb = useCallback(() => setLbIndex(i => i === null ? null : (i - 1 + allPhotos.length) % allPhotos.length), [])
  const nextLb = useCallback(() => setLbIndex(i => i === null ? null : (i + 1) % allPhotos.length), [])

  const handleHover = useCallback((src: string | null, label: string) => {
    if (!isDesktop) return
    setCursorSrc(src)
    setCursorLabel(label)
  }, [isDesktop])

  const menuItems = [
    { label: "Servicios", bgColor: isDark ? "#111111" : "#f0ece4", textColor: isDark ? "#fff" : "#000",
      links: [{ label: "Lab / Servicios", href: "/lab", ariaLabel: "Lab" }, { label: "Automation · n8n", href: "/automation", ariaLabel: "Automation" }] },
    { label: "Proyectos", bgColor: isDark ? "#1a1a1a" : "#e8e4dc", textColor: isDark ? "#fff" : "#000",
      links: [{ label: "Archive", href: "/archive", ariaLabel: "Archive" }, { label: "Visual Editorial", href: "/visual", ariaLabel: "Visual" }] },
    { label: "Contacto", bgColor: isDark ? "#dde4e6" : "#1a1a1a", textColor: isDark ? "#000" : "#fff",
      links: [{ label: "WhatsApp", href: WA_URL, ariaLabel: "WhatsApp" }, { label: "Email", href: "mailto:aprada.web@gmail.com", ariaLabel: "Email" }] },
  ]

  return (
    <div style={{ minHeight: "100vh", overflowX: "hidden", background: pageBg, color: isDark ? "#fff" : "#111", position: "relative" }}>

      {/* LiquidEther */}
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
        <div style={{ position: "absolute", inset: 0, zIndex: 1, pointerEvents: "none", background: isDark ? "rgba(0,0,0,.86)" : "rgba(245,241,233,.86)" }}/>
      </div>

      <ScrollBar/>
      <ThemeToggle/>

      <div style={{ position: "relative", zIndex: 50 }}>
        <CardNav logo="/faviconAP.ico" items={menuItems}
          baseColor={isDark ? "rgba(6,6,6,.95)" : "rgba(245,241,233,.95)"}
          menuColor={isDark ? "#fff" : "#111"} buttonBgColor={isDark ? "#dde4e6" : "#111"} buttonTextColor={isDark ? "#000" : "#fff"}/>
      </div>

      <HeroCover isDark={isDark} isDesktop={isDesktop}/>
      <TableOfContents isDark={isDark}/>

      {/* CHAPTER 01 — CAPTURES */}
      <div id="capt">
        <ChapterHeader num="01" title="Captures" kicker="Diario · Spontaneous" isDark={isDark}/>
        <CapturesBlock photos={photosCaptures} isDark={isDark} isDesktop={isDesktop} onOpen={openLb} onHover={handleHover} baseIdx={0}/>
      </div>

      {/* CHAPTER 02 — STUDIO SESSIONS */}
      <div id="studio">
        <ChapterHeader num="02" title="Studio Sessions" kicker="DSLR · Retrato editorial" isDark={isDark}/>
        <StudioBlock photos={photosStudio} isDark={isDark} isDesktop={isDesktop} onOpen={openLb} onHover={handleHover} baseIdx={photosCaptures.length}/>
      </div>

      {/* CHAPTER 03 — GUA SERIES */}
      <div id="gua" style={{ marginTop: 32 }}>
        <ChapterHeader num="03" title="GUA Series" kicker="Editorial · Long form" isDark={isDark}/>
        <EditorialSpreads photos={photosEditorial} isDark={isDark} isDesktop={isDesktop} onOpen={openLb} onHover={handleHover} baseIdx={photosCaptures.length + photosStudio.length}/>
      </div>

      {/* CHAPTER 04 — MOTION */}
      <div id="motion">
        <ChapterHeader num="04" title="Motion" kicker="Animación · Loops" isDark={isDark}/>
        {motionPieces.map((p, i) => (
          <MotionPiece key={p.id} piece={p} idx={i} isDark={isDark} isDesktop={isDesktop}/>
        ))}
      </div>

      {/* WHATSAPP BANNER */}
      <section style={{ position: "relative", zIndex: 20, padding: isDesktop ? "32px 48px 0" : "24px 20px 0", maxWidth: 1280, margin: "0 auto" }}>
        <WhatsAppBanner isDark={isDark} isDesktop={isDesktop} message="Hola Andres, vi tu portafolio visual y quiero una sesión" headline="Tu marca con esta estética. Hablemos"/>
      </section>

      {/* COLOPHON / CTA */}
      <section style={{ position: "relative", zIndex: 20, padding: "clamp(64px, 12vw, 112px) clamp(20px, 4vw, 48px)", maxWidth: 1280, margin: "0 auto", display: "flex", flexDirection: isDesktop ? "row" : "column", alignItems: isDesktop ? "flex-end" : "flex-start", justifyContent: "space-between", gap: 48, borderTop: borderC }}>
        <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: .7 }} viewport={{ once: true }}>
          <span style={{ fontSize: 9, letterSpacing: ".35em", textTransform: "uppercase", display: "block", marginBottom: 16, color: isDark ? "#fff" : "#000" }}>Fin del issue</span>
          <h2 style={{ fontSize: "clamp(2.8rem,7vw,5rem)", fontWeight: 900, textTransform: "uppercase", letterSpacing: "-.04em", lineHeight: .86, color: isDark ? "#fff" : "#111" }}>
            ¿Tu marca<br/>
            <span style={{ WebkitTextStroke: isDark ? "1.5px rgba(255,255,255,.22)" : "1.5px rgba(0,0,0,.20)", color: "transparent" }}>necesita imagen?</span>
          </h2>
        </motion.div>
        <div style={{ display: "flex", flexDirection: "column", gap: 16, flexShrink: 0 }}>
          <motion.div initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: .5 }} viewport={{ once: true }}>
            <WhatsAppPill isDark={isDark} size="lg" label="Cotizar sesión" message="Hola Andres, quiero cotizar una sesión visual"/>
          </motion.div>
          {[
            { label: "Email", href: "mailto:aprada.web@gmail.com" },
            { label: "Instagram", href: "https://instagram.com/" },
          ].map(({ label, href }, i) => (
            <motion.a key={label} href={href} target={href.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer"
              style={{ display: "flex", alignItems: "center", gap: 16, textDecoration: "none", fontSize: 13, textTransform: "uppercase", letterSpacing: ".2em", color: isDark ? "#fff" : "#000" }}
              initial={{ opacity: 0, x: 12 }} whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: .5, delay: i * .08 }} viewport={{ once: true }}
              whileHover={{ x: 4 }}>
              <span style={{ display: "inline-block", width: 20, height: .5, background: isDark ? "rgba(255,255,255,.4)" : "rgba(0,0,0,.35)" }}/>
              {label}
            </motion.a>
          ))}
        </div>
      </section>

      <footer style={{ position: "relative", zIndex: 20, padding: "24px clamp(16px, 4vw, 48px)", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12, background: pageBg, borderTop: borderC }}>
        <span style={{ fontSize: 9, letterSpacing: ".4em", textTransform: "uppercase", color: isDark ? "#fff" : "#000" }}>Andres Prada</span>
        <span style={{ fontFamily: "monospace", fontSize: 9, color: isDark ? "#fff" : "#000" }}>© 2026 · Issue 01</span>
        <span style={{ fontSize: 9, letterSpacing: ".4em", textTransform: "uppercase", color: isDark ? "#fff" : "#000" }}>Bogotá, CO</span>
      </footer>

      <Lightbox photos={allPhotos} index={lbIndex} onClose={closeLb} onPrev={prevLb} onNext={nextLb} isDark={isDark}/>
      <CursorPreview src={cursorSrc} label={cursorLabel} isDark={isDark}/>
      <WhatsAppFAB message="Hola Andres, vi tu portafolio visual y me interesa"/>
    </div>
  )
}
