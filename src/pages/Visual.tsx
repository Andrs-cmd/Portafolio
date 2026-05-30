import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion"
import { useState, useEffect, useCallback, useRef } from "react"
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
  sculptures,
  type GalleryPhoto,
  type GalleryVideo,
  type Sculpture,
} from "../data/gallery"
import { WhatsAppFAB, WhatsAppPill, WhatsAppBanner } from "../components/WhatsAppCTA"
import { useSEO } from "../lib/useSEO"

const LIQUID_DARK = ["#0a0014", "#7b00cc", "#c026d3", "#60a5fa", "#ffffff"]
const LIQUID_LIGHT = ["#f4f1f1", "#747272", "#000000"]

const WA_NUMBER = "573195768097"
const WA_URL = `https://wa.me/${WA_NUMBER}?text=Hola%20Andres%2C%20vi%20tu%20portafolio%20visual`

/* ──────────────────────────────────────────────────────────
   TIPOS UNIFICADOS
   ────────────────────────────────────────────────────────── */
type UnifiedItem =
  | ({ kind: "photo"; tabId: string } & GalleryPhoto)
  | ({ kind: "video"; tabId: string } & GalleryVideo)
  | ({ kind: "sculpture"; tabId: string } & Sculpture)

type Tab = {
  id: string
  label: string
  desc: string
  items: UnifiedItem[]
}

/* ──────────────────────────────────────────────────────────
   HOOKS
   ────────────────────────────────────────────────────────── */
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

/* ──────────────────────────────────────────────────────────
   THEME TOGGLE
   ────────────────────────────────────────────────────────── */
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
   HERO COVER
   ────────────────────────────────────────────────────────── */
function HeroCover({ isDark, isDesktop, totalItems }: { isDark: boolean; isDesktop: boolean; totalItems: number }) {
  const [current, setCurrent] = useState(0)
  useEffect(() => {
    const t = setInterval(() => setCurrent(c => (c + 1) % heroPhotos.length), 4200)
    return () => clearInterval(t)
  }, [])

  return (
    <section style={{ position: "relative", zIndex: 20, paddingTop: isDesktop ? 96 : 80, display: "flex", flexDirection: isDesktop ? "row" : "column" }}>
      <div style={{ flex: isDesktop ? "1.1 1 0" : "none", width: "100%", position: "relative", overflow: "hidden", height: isDesktop ? "calc(70vh - 96px)" : "60vw" }}>
        <AnimatePresence>
          <motion.img
            key={current}
            src={heroPhotos[current].src}
            srcSet={heroPhotos[current].srcSet}
            sizes="(min-width: 1024px) 55vw, 100vw"
            alt=""
            loading="eager"
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", filter: isDark ? "grayscale(20%) brightness(.75)" : "grayscale(8%) brightness(.92)" }}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.6, ease: [.16, 1, .3, 1] }}
          />
        </AnimatePresence>
        <div style={{ position: "absolute", inset: 0, background: isDark ? "linear-gradient(to right, rgba(6,6,6,.55) 0%, transparent 55%)" : "linear-gradient(to right, rgba(245,241,233,.6) 0%, transparent 55%)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", top: 24, left: 24, width: 24, height: 24, borderLeft: isDark ? "1px solid rgba(255,255,255,.35)" : "1px solid rgba(0,0,0,.30)", borderTop: isDark ? "1px solid rgba(255,255,255,.35)" : "1px solid rgba(0,0,0,.30)" }} />
        <div style={{ position: "absolute", bottom: 24, right: 24, width: 24, height: 24, borderRight: isDark ? "1px solid rgba(255,255,255,.35)" : "1px solid rgba(0,0,0,.30)", borderBottom: isDark ? "1px solid rgba(255,255,255,.35)" : "1px solid rgba(0,0,0,.30)" }} />
        <div style={{ position: "absolute", top: 24, right: 24, fontFamily: "monospace", fontSize: 9, letterSpacing: ".22em", color: isDark ? "#fff" : "#000" }}>
          {String(current + 1).padStart(2, "0")} / {String(heroPhotos.length).padStart(2, "0")}
        </div>
      </div>

      <div style={{ flex: 1, padding: isDesktop ? "80px 56px" : "40px 24px 32px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
        <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: .7 }} style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 28 }}>
          <div style={{ width: 24, height: .5, background: isDark ? "rgba(255,255,255,.45)" : "rgba(0,0,0,.35)" }} />
          <span style={{ fontSize: 9, letterSpacing: ".35em", textTransform: "uppercase", color: isDark ? "#fff" : "#000", fontWeight: 500 }}>Issue 01 · MMXXVI</span>
        </motion.div>

        <div style={{ overflow: "hidden", marginBottom: 4 }}>
          <motion.h1 initial={{ y: 90 }} animate={{ y: 0 }} transition={{ duration: 1, ease: [.16, 1, .3, 1] }}
            style={{ fontSize: "clamp(3rem, 8vw, 7rem)", fontWeight: 900, textTransform: "uppercase", letterSpacing: "-.045em", lineHeight: .82, color: isDark ? "#fff" : "#000" }}>
            Visual
          </motion.h1>
        </div>
        <div style={{ overflow: "hidden", marginBottom: 24 }}>
          <motion.h1 initial={{ y: 90 }} animate={{ y: 0 }} transition={{ duration: 1, delay: .08, ease: [.16, 1, .3, 1] }}
            style={{ fontSize: "clamp(3rem, 8vw, 7rem)", fontWeight: 900, textTransform: "uppercase", letterSpacing: "-.045em", lineHeight: .82, WebkitTextStroke: isDark ? "1.5px rgba(255,255,255,.28)" : "1.5px rgba(0,0,0,.22)", color: "transparent" }}>
            Editorial
          </motion.h1>
        </div>

        <motion.p initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .8, delay: .35 }}
          style={{ fontSize: 15, fontWeight: 400, lineHeight: 1.65, maxWidth: 420, color: isDark ? "#fff" : "#000", marginBottom: 18 }}>
          {totalItems} piezas entre fotografía, escultura y motion. Click en cualquiera para verla en grande.
        </motion.p>
      </div>
    </section>
  )
}

/* ──────────────────────────────────────────────────────────
   TAB BAR
   ────────────────────────────────────────────────────────── */
function TabBar({ tabs, activeId, onChange, isDark, isDesktop }: {
  tabs: Tab[]
  activeId: string
  onChange: (id: string) => void
  isDark: boolean
  isDesktop: boolean
}) {
  const scrollerRef = useRef<HTMLDivElement | null>(null)

  return (
    <div style={{
      position: "sticky",
      top: 0,
      zIndex: 40,
      background: isDark ? "rgba(6,6,6,.92)" : "rgba(245,241,233,.92)",
      backdropFilter: "blur(12px)",
      borderBottom: isDark ? "0.5px solid rgba(255,255,255,.08)" : "0.5px solid rgba(0,0,0,.08)",
    }}>
      <div ref={scrollerRef} style={{
        maxWidth: 1280,
        margin: "0 auto",
        padding: isDesktop ? "0 48px" : "0 16px",
        overflowX: "auto",
        WebkitOverflowScrolling: "touch",
        scrollbarWidth: "none",
      }}>
        <div style={{ display: "flex", gap: isDesktop ? 4 : 2, minWidth: "max-content" }}>
          {tabs.map(t => {
            const active = t.id === activeId
            return (
              <button
                key={t.id}
                onClick={() => onChange(t.id)}
                style={{
                  position: "relative",
                  background: "transparent",
                  border: "none",
                  padding: isDesktop ? "20px 18px" : "16px 12px",
                  cursor: "pointer",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                  gap: 4,
                  color: isDark ? "#fff" : "#000",
                  opacity: active ? 1 : 0.5,
                  transition: "opacity .25s",
                }}
                onMouseEnter={(e) => { if (!active) e.currentTarget.style.opacity = "0.85" }}
                onMouseLeave={(e) => { if (!active) e.currentTarget.style.opacity = "0.5" }}
              >
                <span style={{ fontFamily: "monospace", fontSize: 9, letterSpacing: ".25em", color: isDark ? "rgba(255,255,255,.6)" : "rgba(0,0,0,.6)" }}>
                  {t.items.length.toString().padStart(2, "0")}
                </span>
                <span style={{ fontSize: isDesktop ? 14 : 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "-.005em", whiteSpace: "nowrap" }}>
                  {t.label}
                </span>
                {active && (
                  <motion.div layoutId="tab-underline"
                    style={{ position: "absolute", bottom: -1, left: 0, right: 0, height: 2, background: isDark ? "#fff" : "#000" }}
                    transition={{ type: "spring", stiffness: 350, damping: 32 }} />
                )}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}

/* ──────────────────────────────────────────────────────────
   CELL — un item de la grilla
   ────────────────────────────────────────────────────────── */
function Cell({ item, idx, isDark, onClick }: {
  item: UnifiedItem
  idx: number
  isDark: boolean
  onClick: () => void
}) {
  const isVideo = item.kind === "video"
  const isSculpture = item.kind === "sculpture"

  return (
    <motion.button
      onClick={onClick}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: .55, delay: (idx % 8) * .03, ease: [.16, 1, .3, 1] }}
      whileHover={{ scale: 1.012 }}
      style={{
        position: "relative",
        overflow: "hidden",
        aspectRatio: isVideo ? "16/9" : "3/4",
        background: isDark ? "#0a0a0a" : "#1a1a1a",
        border: "none",
        padding: 0,
        cursor: "zoom-in",
        outline: "none",
      }}
    >
      {isVideo ? (
        <img
          src={(item as GalleryVideo).poster}
          alt={(item as GalleryVideo).title}
          loading="lazy"
          decoding="async"
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      ) : (
        <img
          src={(item as GalleryPhoto | Sculpture).src}
          srcSet={"srcSet" in item ? (item as GalleryPhoto).srcSet : undefined}
          sizes="(min-width: 1280px) 300px, (min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
          alt={item.kind === "photo" ? (item as GalleryPhoto).alt : (item as Sculpture).alt}
          loading="lazy"
          decoding="async"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            filter: isDark ? "grayscale(10%) brightness(.95)" : "grayscale(5%)",
            transition: "filter .5s",
          }}
        />
      )}

      {/* play badge en videos */}
      {isVideo && (
        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", pointerEvents: "none" }}>
          <div style={{ width: 56, height: 56, borderRadius: "50%", background: "rgba(0,0,0,.55)", border: "1px solid rgba(255,255,255,.35)", display: "flex", alignItems: "center", justifyContent: "center", backdropFilter: "blur(8px)" }}>
            <svg width="18" height="18" viewBox="0 0 18 18" fill="#fff"><path d="M5 3.5v11l9-5.5z" /></svg>
          </div>
        </div>
      )}

      {/* sculpture chip */}
      {isSculpture && (
        <div style={{ position: "absolute", top: 10, right: 10, pointerEvents: "none" }}>
          <span style={{ padding: "3px 8px", borderRadius: 99, background: "rgba(0,0,0,.55)", border: "1px solid rgba(255,255,255,.20)", color: "#fff", fontFamily: "monospace", fontSize: 8, letterSpacing: ".22em", textTransform: "uppercase", backdropFilter: "blur(6px)" }}>
            {(item as Sculpture).medium === "digital" ? "3D" : "Físico"}
          </span>
        </div>
      )}

      {/* number badge */}
      <div style={{ position: "absolute", bottom: 8, left: 10, fontFamily: "monospace", fontSize: 8, letterSpacing: ".22em", color: "rgba(255,255,255,.85)", textShadow: "0 1px 2px rgba(0,0,0,.6)", pointerEvents: "none" }}>
        {String(idx + 1).padStart(3, "0")}
      </div>
    </motion.button>
  )
}

/* ──────────────────────────────────────────────────────────
   LIGHTBOX MODAL — soporta foto, video y escultura
   ────────────────────────────────────────────────────────── */
function Lightbox({ items, index, onClose, onPrev, onNext, isDark, isDesktop }: {
  items: UnifiedItem[]
  index: number | null
  onClose: () => void
  onPrev: () => void
  onNext: () => void
  isDark: boolean
  isDesktop: boolean
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
    const orig = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => { document.body.style.overflow = orig }
  }, [index])

  if (!mounted) return null
  const item = index !== null ? items[index] : null

  // Detalles formateados por tipo
  const meta = item?.kind === "sculpture" ? {
    title: (item as Sculpture).title,
    sub: (item as Sculpture).material,
    extra: (item as Sculpture).year + " · " + ((item as Sculpture).medium === "digital" ? "Digital · 3D" : "Obra física"),
    description: (item as Sculpture).description,
  } : item?.kind === "video" ? {
    title: (item as GalleryVideo).title,
    sub: "Motion · Loop",
    extra: undefined,
    description: undefined,
  } : item?.kind === "photo" ? {
    title: (item as GalleryPhoto).alt,
    sub: "Fotografía",
    extra: undefined,
    description: undefined,
  } : null

  const bg = isDark ? "rgba(0,0,0,.96)" : "rgba(245,241,233,.97)"
  const fg = isDark ? "#fff" : "#000"
  const mute = isDark ? "rgba(255,255,255,.65)" : "rgba(0,0,0,.60)"
  const dim = isDark ? "rgba(255,255,255,.30)" : "rgba(0,0,0,.30)"

  const el = (
    <AnimatePresence>
      {item && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          transition={{ duration: .3 }}
          onClick={onClose}
          style={{
            position: "fixed", inset: 0, zIndex: 10000,
            background: bg,
            backdropFilter: "blur(14px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "zoom-out",
            padding: isDesktop ? 48 : 16,
            paddingTop: isDesktop ? 72 : 56,
            paddingBottom: isDesktop ? 100 : 100,
          }}
        >
          {/* HEADER */}
          <motion.div
            initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .15 }}
            style={{ position: "absolute", top: 0, left: 0, right: 0, display: "flex", alignItems: "center", justifyContent: "space-between", padding: isDesktop ? "20px 28px" : "14px 16px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, minWidth: 0 }}>
              <span style={{ fontFamily: "monospace", fontSize: 10, letterSpacing: ".22em", color: mute, flexShrink: 0 }}>
                {String((index ?? 0) + 1).padStart(2, "0")} / {String(items.length).padStart(2, "0")}
              </span>
              <div style={{ width: 24, height: .5, background: dim, flexShrink: 0 }} />
              <span style={{ fontFamily: "monospace", fontSize: 10, letterSpacing: ".22em", textTransform: "uppercase", color: mute, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                {meta?.sub}
              </span>
            </div>
            <button
              onClick={(e) => { e.stopPropagation(); onClose() }}
              style={{ width: 38, height: 38, border: `1px solid ${dim}`, background: "transparent", color: fg, borderRadius: 19, cursor: "pointer", fontSize: 16, lineHeight: 1, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}
            >×</button>
          </motion.div>

          {/* PREV/NEXT */}
          <button
            onClick={(e) => { e.stopPropagation(); onPrev() }}
            style={{ position: "absolute", left: isDesktop ? 16 : 6, top: "50%", transform: "translateY(-50%)", width: 48, height: 48, border: "none", background: "transparent", color: fg, cursor: "pointer", fontSize: 28, opacity: .6, transition: "opacity .2s" }}
            onMouseEnter={(e) => { e.currentTarget.style.opacity = "1" }}
            onMouseLeave={(e) => { e.currentTarget.style.opacity = "0.6" }}
          >‹</button>
          <button
            onClick={(e) => { e.stopPropagation(); onNext() }}
            style={{ position: "absolute", right: isDesktop ? 16 : 6, top: "50%", transform: "translateY(-50%)", width: 48, height: 48, border: "none", background: "transparent", color: fg, cursor: "pointer", fontSize: 28, opacity: .6, transition: "opacity .2s" }}
            onMouseEnter={(e) => { e.currentTarget.style.opacity = "1" }}
            onMouseLeave={(e) => { e.currentTarget.style.opacity = "0.6" }}
          >›</button>

          {/* CONTENIDO */}
          <motion.div
            key={item.kind === "photo" ? (item as GalleryPhoto).id : item.kind === "video" ? (item as GalleryVideo).id : (item as Sculpture).id}
            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: .35, ease: [.16, 1, .3, 1] }}
            onClick={(e) => e.stopPropagation()}
            style={{
              position: "relative",
              maxWidth: "100%",
              maxHeight: "100%",
              display: "flex",
              flexDirection: isDesktop && item.kind === "sculpture" ? "row" : "column",
              alignItems: "center",
              justifyContent: "center",
              gap: isDesktop && item.kind === "sculpture" ? 36 : 16,
            }}
          >
            {/* MEDIA */}
            <div style={{ position: "relative", maxWidth: "100%", maxHeight: isDesktop ? "78vh" : "60vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
              {item.kind === "video" ? (
                <video
                  src={(item as GalleryVideo).src}
                  poster={(item as GalleryVideo).poster}
                  autoPlay
                  loop
                  controls
                  playsInline
                  style={{ maxWidth: "100%", maxHeight: isDesktop ? "78vh" : "60vh", objectFit: "contain", boxShadow: isDark ? "0 24px 80px rgba(0,0,0,.6)" : "0 24px 80px rgba(0,0,0,.18)" }}
                />
              ) : (
                <img
                  src={(item as GalleryPhoto | Sculpture).src}
                  srcSet={"srcSet" in item ? (item as GalleryPhoto).srcSet : undefined}
                  sizes="90vw"
                  alt={item.kind === "photo" ? (item as GalleryPhoto).alt : (item as Sculpture).alt}
                  style={{ maxWidth: "100%", maxHeight: isDesktop ? "78vh" : "60vh", objectFit: "contain", boxShadow: isDark ? "0 24px 80px rgba(0,0,0,.6)" : "0 24px 80px rgba(0,0,0,.18)" }}
                />
              )}
            </div>

            {/* FICHA — SOLO ESCULTURAS lleva ficha lateral; videos y fotos ficha compacta abajo */}
            {item.kind === "sculpture" ? (
              <div style={{
                width: isDesktop ? 320 : "100%",
                maxWidth: 360,
                flexShrink: 0,
                color: fg,
                padding: isDesktop ? 0 : "8px 16px 0",
              }}>
                <span style={{ fontFamily: "monospace", fontSize: 10, letterSpacing: ".25em", textTransform: "uppercase", color: mute, marginBottom: 12, display: "block" }}>
                  Pieza {String((index ?? 0) + 1).padStart(2, "0")}
                </span>
                <h3 style={{ fontSize: "clamp(1.5rem, 3vw, 2.2rem)", fontWeight: 900, textTransform: "uppercase", letterSpacing: "-.03em", lineHeight: .9, marginBottom: 16 }}>
                  {(item as Sculpture).title}
                </h3>
                <div style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: "8px 14px", marginBottom: 14 }}>
                  <span style={{ fontFamily: "monospace", fontSize: 9, letterSpacing: ".2em", textTransform: "uppercase", color: mute }}>Material</span>
                  <span style={{ fontSize: 12, color: fg }}>{(item as Sculpture).material}</span>
                  <span style={{ fontFamily: "monospace", fontSize: 9, letterSpacing: ".2em", textTransform: "uppercase", color: mute }}>Año</span>
                  <span style={{ fontSize: 12, color: fg }}>{(item as Sculpture).year}</span>
                  <span style={{ fontFamily: "monospace", fontSize: 9, letterSpacing: ".2em", textTransform: "uppercase", color: mute }}>Tipo</span>
                  <span style={{ fontSize: 12, color: fg }}>{(item as Sculpture).medium === "digital" ? "Digital · 3D" : "Obra física"}</span>
                </div>
                {(item as Sculpture).description && (
                  <p style={{ fontSize: 13, fontWeight: 300, lineHeight: 1.7, color: fg, opacity: .9 }}>
                    {(item as Sculpture).description}
                  </p>
                )}
              </div>
            ) : (
              <div style={{ textAlign: "center", color: fg, padding: "0 16px" }}>
                <h3 style={{ fontSize: 13, fontWeight: 600, letterSpacing: "-.005em", color: fg }}>
                  {meta?.title}
                </h3>
              </div>
            )}
          </motion.div>

          {/* FOOTER hint */}
          <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: isDesktop ? "16px 28px" : "12px 16px", display: "flex", justifyContent: "center", gap: 16, fontFamily: "monospace", fontSize: 9, letterSpacing: ".22em", textTransform: "uppercase", color: mute, pointerEvents: "none" }}>
            <span>← →  Navegar</span>
            <span>ESC  Cerrar</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
  return createPortal(el, document.body)
}

/* ──────────────────────────────────────────────────────────
   MAIN
   ────────────────────────────────────────────────────────── */
export default function Visual() {
  useSEO({
    title: "Visual Editorial · Fotografía, Esculturas y Motion",
    description: "Portafolio visual: fotografía editorial, esculturas físicas y digitales, motion graphics. Click en cada pieza para verla en grande.",
    path: "/visual",
    keywords: "fotografía editorial bogotá, escultura, motion graphics colombia, portafolio visual, andres prada",
  })
  const { isDark } = useTheme()
  const isDesktop = useIsDesktop()
  const pageBg = isDark ? "#060606" : "#f5f1e9"
  const borderC = isDark ? "0.5px solid rgba(255,255,255,0.08)" : "0.5px solid rgba(0,0,0,0.08)"

  // Construir tabs con items unificados
  const tabs: Tab[] = [
    {
      id: "captures",
      label: "Captures",
      desc: "Diario",
      items: photosCaptures.map(p => ({ ...p, kind: "photo" as const, tabId: "captures" })),
    },
    {
      id: "studio",
      label: "Studio",
      desc: "Retrato editorial",
      items: photosStudio.map(p => ({ ...p, kind: "photo" as const, tabId: "studio" })),
    },
    {
      id: "gua",
      label: "GUA Series",
      desc: "Long editorial",
      items: photosEditorial.map(p => ({ ...p, kind: "photo" as const, tabId: "gua" })),
    },
    {
      id: "sculpture",
      label: "Sculpture",
      desc: "Físico + digital",
      items: sculptures.map(s => ({ ...s, kind: "sculpture" as const, tabId: "sculpture" })),
    },
    {
      id: "motion",
      label: "Motion",
      desc: "Animación",
      items: motionPieces.map(v => ({ ...v, kind: "video" as const, tabId: "motion" })),
    },
  ]

  const totalItems = tabs.reduce((sum, t) => sum + t.items.length, 0)

  const [activeId, setActiveId] = useState<string>(tabs[0].id)
  const activeTab = tabs.find(t => t.id === activeId) ?? tabs[0]

  // Lightbox state — opera sobre el tab actual
  const [lbIndex, setLbIndex] = useState<number | null>(null)
  const openLb = useCallback((i: number) => setLbIndex(i), [])
  const closeLb = useCallback(() => setLbIndex(null), [])
  const prevLb = useCallback(() => setLbIndex(i => i === null ? null : (i - 1 + activeTab.items.length) % activeTab.items.length), [activeTab.items.length])
  const nextLb = useCallback(() => setLbIndex(i => i === null ? null : (i + 1) % activeTab.items.length), [activeTab.items.length])

  // Cambio de tab cierra el modal
  const handleTabChange = (id: string) => {
    setActiveId(id)
    setLbIndex(null)
  }

  const menuItems = [
    { label: "Servicios", bgColor: isDark ? "#111111" : "#f0ece4", textColor: isDark ? "#fff" : "#000",
      links: [{ label: "Lab / Servicios", href: "/lab", ariaLabel: "Lab" }, { label: "Automation · n8n", href: "/automation", ariaLabel: "Automation" }, { label: "Manifiesto", href: "/manifesto", ariaLabel: "Manifiesto" }] },
    { label: "Proyectos", bgColor: isDark ? "#1a1a1a" : "#e8e4dc", textColor: isDark ? "#fff" : "#000",
      links: [{ label: "Archive", href: "/archive", ariaLabel: "Archive" }, { label: "Visual Editorial", href: "/visual", ariaLabel: "Visual" }] },
    { label: "Contacto", bgColor: isDark ? "#dde4e6" : "#1a1a1a", textColor: isDark ? "#000" : "#fff",
      links: [{ label: "WhatsApp", href: WA_URL, ariaLabel: "WhatsApp" }, { label: "Email", href: "mailto:aprada.web@gmail.com", ariaLabel: "Email" }] },
  ]

  return (
    <div style={{ minHeight: "100vh", overflowX: "hidden", background: pageBg, color: isDark ? "#fff" : "#000", position: "relative" }}>
      <div style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none" }}>
        <LiquidEther
          mouseForce={22} cursorSize={120} resolution={0.7}
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

      <HeroCover isDark={isDark} isDesktop={isDesktop} totalItems={totalItems} />

      <TabBar tabs={tabs} activeId={activeId} onChange={handleTabChange} isDark={isDark} isDesktop={isDesktop} />

      {/* CONTENIDO DEL TAB */}
      <section style={{ position: "relative", zIndex: 20, padding: isDesktop ? "48px 48px 96px" : "32px 16px 64px", maxWidth: 1280, margin: "0 auto" }}>
        {/* Tab header */}
        <motion.div
          key={activeTab.id + "-header"}
          initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .5 }}
          style={{ marginBottom: 28, display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
          <div>
            <span style={{ fontFamily: "monospace", fontSize: 10, letterSpacing: ".25em", textTransform: "uppercase", color: isDark ? "rgba(255,255,255,.65)" : "rgba(0,0,0,.60)", display: "block", marginBottom: 4 }}>
              {activeTab.desc}
            </span>
            <h2 style={{ fontSize: "clamp(1.6rem, 4vw, 2.4rem)", fontWeight: 900, textTransform: "uppercase", letterSpacing: "-.03em", lineHeight: .95, color: isDark ? "#fff" : "#000" }}>
              {activeTab.label}
            </h2>
          </div>
          <span style={{ fontFamily: "monospace", fontSize: 11, letterSpacing: ".22em", color: isDark ? "rgba(255,255,255,.65)" : "rgba(0,0,0,.60)" }}>
            {activeTab.items.length} piezas
          </span>
        </motion.div>

        {/* GRID */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab.id}
            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            transition={{ duration: .4, ease: [.16, 1, .3, 1] }}
            style={{
              display: "grid",
              gridTemplateColumns:
                activeTab.id === "motion"
                  ? (isDesktop ? "repeat(2, 1fr)" : "1fr")
                  : `repeat(${isDesktop ? 4 : 2}, 1fr)`,
              gap: isDesktop ? 12 : 8,
            }}
          >
            {activeTab.items.map((it, i) => (
              <Cell key={(it as { id: string }).id} item={it} idx={i} isDark={isDark} onClick={() => openLb(i)} />
            ))}
          </motion.div>
        </AnimatePresence>
      </section>

      <WhatsAppBanner isDesktop={isDesktop} headline="¿Te gustó lo que viste?" message="Hablemos de tu proyecto visual" />

      <WhatsAppPill />

      {/* CTA FINAL */}
      <section style={{ position: "relative", zIndex: 20, padding: isDesktop ? "112px 48px" : "72px 20px", maxWidth: 1280, margin: "0 auto", display: "flex", flexDirection: isDesktop ? "row" : "column", alignItems: isDesktop ? "flex-end" : "flex-start", justifyContent: "space-between", gap: 48, borderTop: borderC }}>
        <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: .7 }} viewport={{ once: true }}>
          <span style={{ fontSize: 9, letterSpacing: ".35em", textTransform: "uppercase", display: "block", marginBottom: 16, color: isDark ? "rgba(255,255,255,.70)" : "rgba(0,0,0,.65)" }}>Fin del issue</span>
          <h2 style={{ fontSize: "clamp(2.8rem,7vw,5rem)", fontWeight: 900, textTransform: "uppercase", letterSpacing: "-.04em", lineHeight: .86, color: isDark ? "#fff" : "#000" }}>
            ¿Tu marca<br />
            <span style={{ WebkitTextStroke: isDark ? "1.5px rgba(255,255,255,.22)" : "1.5px rgba(0,0,0,.20)", color: "transparent" }}>necesita imagen?</span>
          </h2>
        </motion.div>
        <div style={{ display: "flex", flexDirection: "column", gap: 16, flexShrink: 0 }}>
          {[
            { label: "Cotizar sesión", href: WA_URL },
            { label: "Email", href: "mailto:aprada.web@gmail.com" },
            { label: "Ver proyectos", href: "/archive" },
          ].map(({ label, href }, i) => (
            <motion.a key={label} href={href} target={href.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer"
              style={{ display: "flex", alignItems: "center", gap: 16, textDecoration: "none", fontSize: 13, textTransform: "uppercase", letterSpacing: ".2em", color: isDark ? "#fff" : "#000" }}
              initial={{ opacity: 0, x: 12 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: .5, delay: i * .08 }} viewport={{ once: true }}
              whileHover={{ x: 4 }}>
              <span style={{ display: "inline-block", width: 20, height: .5, background: isDark ? "rgba(255,255,255,.4)" : "rgba(0,0,0,.35)" }} />
              {label}
            </motion.a>
          ))}
        </div>
      </section>

      <footer style={{ position: "relative", zIndex: 20, padding: "32px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", background: pageBg, borderTop: borderC, gap: 12, flexWrap: "wrap" }}>
        <span style={{ fontSize: 9, letterSpacing: ".4em", textTransform: "uppercase", color: isDark ? "rgba(255,255,255,.55)" : "rgba(0,0,0,.55)" }}>Andres Prada</span>
        <span style={{ fontFamily: "monospace", fontSize: 9, color: isDark ? "rgba(255,255,255,.45)" : "rgba(0,0,0,.45)" }}>© 2026 · Issue 01</span>
        <span style={{ fontSize: 9, letterSpacing: ".4em", textTransform: "uppercase", color: isDark ? "rgba(255,255,255,.55)" : "rgba(0,0,0,.55)" }}>Bogotá, CO</span>
      </footer>

      <Lightbox items={activeTab.items} index={lbIndex} onClose={closeLb} onPrev={prevLb} onNext={nextLb} isDark={isDark} isDesktop={isDesktop} />
    </div>
  )
}
