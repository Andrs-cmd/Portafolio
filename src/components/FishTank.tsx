import { useEffect, useRef } from "react"

/**
 * Peces y tiburones nadando en un canvas 2D. Va DETRÁS del Liquid Ether (que es
 * transparente salvo donde fluye), así que parece que nadan bajo el "agua".
 * Reaccionan al cursor/dedo con el mismo input que el fluido: cuando te acercas
 * se dispersan. Es una aproximación (no lee el campo de velocidad del fluido, que
 * sería carísimo), pero el efecto se siente coherente. Liviano: solo canvas 2D.
 */

type Creature = {
  x: number; y: number; vx: number; vy: number
  size: number; type: "fish" | "shark"; color: string; wobble: number
}

export default function FishTank({ isDark = true }: { isDark?: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const DPR = Math.min(window.devicePixelRatio || 1, 2)
    let w = 0, h = 0
    const resize = () => {
      w = window.innerWidth; h = window.innerHeight
      canvas.width = Math.floor(w * DPR); canvas.height = Math.floor(h * DPR)
      canvas.style.width = w + "px"; canvas.style.height = h + "px"
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0)
    }
    resize()

    const pointer = { x: -9999, y: -9999, active: false }
    const onMove = (cx: number, cy: number) => { pointer.x = cx; pointer.y = cy; pointer.active = true }
    const mm = (e: MouseEvent) => onMove(e.clientX, e.clientY)
    const tm = (e: TouchEvent) => { if (e.touches[0]) onMove(e.touches[0].clientX, e.touches[0].clientY) }
    const leave = () => { pointer.active = false; pointer.x = -9999; pointer.y = -9999 }
    window.addEventListener("mousemove", mm, { passive: true })
    window.addEventListener("touchmove", tm, { passive: true })
    window.addEventListener("mouseleave", leave)
    window.addEventListener("touchend", leave)
    window.addEventListener("resize", resize)

    const mobile = w < 768
    const fishColors = isDark
      ? ["rgba(195,196,242,0.42)", "rgba(127,227,192,0.38)", "rgba(143,183,255,0.40)", "rgba(234,252,255,0.30)"]
      : ["rgba(40,60,90,0.45)", "rgba(30,120,140,0.40)", "rgba(60,80,120,0.42)"]
    const sharkColor = isDark ? "rgba(14,18,34,0.72)" : "rgba(20,30,55,0.58)"
    const sharkEdge = isDark ? "rgba(195,196,242,0.30)" : "rgba(0,0,0,0.25)"

    const creatures: Creature[] = []
    const fishN = mobile ? 12 : 24
    for (let i = 0; i < fishN; i++) {
      const sp = 0.6 + Math.random() * 0.8
      const a = Math.random() * Math.PI * 2
      creatures.push({
        x: Math.random() * w, y: Math.random() * h,
        vx: Math.cos(a) * sp, vy: Math.sin(a) * sp,
        size: 6 + Math.random() * 7, type: "fish",
        color: fishColors[(Math.random() * fishColors.length) | 0], wobble: Math.random() * 100,
      })
    }
    const sharkN = mobile ? 1 : 2
    for (let i = 0; i < sharkN; i++) {
      const a = Math.random() * Math.PI * 2
      creatures.push({
        x: Math.random() * w, y: Math.random() * h,
        vx: Math.cos(a) * 0.7, vy: Math.sin(a) * 0.7,
        size: 22 + Math.random() * 10, type: "shark",
        color: sharkColor, wobble: Math.random() * 100,
      })
    }

    const drawFish = (c: Creature, t: number) => {
      const ang = Math.atan2(c.vy, c.vx)
      const s = c.size
      const tail = Math.sin(t * 0.18 + c.wobble) * 0.5 * s // coletazo
      ctx.save(); ctx.translate(c.x, c.y); ctx.rotate(ang)
      ctx.fillStyle = c.color
      ctx.beginPath(); ctx.ellipse(0, 0, s, s * 0.42, 0, 0, Math.PI * 2); ctx.fill()
      ctx.beginPath()
      ctx.moveTo(-s * 0.9, 0)
      ctx.lineTo(-s * 1.8, -s * 0.55 + tail)
      ctx.lineTo(-s * 1.8, s * 0.55 + tail)
      ctx.closePath(); ctx.fill()
      ctx.restore()
    }

    const drawShark = (c: Creature, t: number) => {
      const ang = Math.atan2(c.vy, c.vx)
      const s = c.size
      const tail = Math.sin(t * 0.1 + c.wobble) * 0.45 * s
      ctx.save(); ctx.translate(c.x, c.y); ctx.rotate(ang)
      ctx.fillStyle = c.color
      ctx.strokeStyle = sharkEdge; ctx.lineWidth = 1
      // cuerpo
      ctx.beginPath()
      ctx.moveTo(s * 1.7, 0)
      ctx.quadraticCurveTo(s * 0.2, -s * 0.52, -s * 1.3, -s * 0.22)
      ctx.lineTo(-s * 1.9, -s * 0.55 + tail)
      ctx.lineTo(-s * 1.45, 0)
      ctx.lineTo(-s * 1.9, s * 0.55 + tail)
      ctx.lineTo(-s * 1.3, s * 0.22)
      ctx.quadraticCurveTo(s * 0.2, s * 0.52, s * 1.7, 0)
      ctx.closePath(); ctx.fill(); ctx.stroke()
      // aleta dorsal
      ctx.beginPath()
      ctx.moveTo(-s * 0.1, -s * 0.46)
      ctx.lineTo(s * 0.25, -s * 1.05)
      ctx.lineTo(s * 0.45, -s * 0.4)
      ctx.closePath(); ctx.fill()
      ctx.restore()
    }

    let raf = 0
    let t = 0
    let running = true
    const loop = () => {
      if (!running) return
      t += 1
      ctx.clearRect(0, 0, w, h)
      const m = 60
      for (const c of creatures) {
        const isShark = c.type === "shark"
        const maxSp = isShark ? 1.1 : 1.7
        // deambular
        c.vx += (Math.random() - 0.5) * (isShark ? 0.03 : 0.08)
        c.vy += (Math.random() - 0.5) * (isShark ? 0.03 : 0.08)
        // huir del cursor (los peces más asustadizos que los tiburones)
        if (pointer.active) {
          const dx = c.x - pointer.x, dy = c.y - pointer.y
          const d = Math.hypot(dx, dy) || 1
          const R = isShark ? 150 : 130
          if (d < R) {
            const push = ((R - d) / R) * (isShark ? 0.5 : 1.4)
            c.vx += (dx / d) * push; c.vy += (dy / d) * push
          }
        }
        // limitar velocidad
        const sp = Math.hypot(c.vx, c.vy)
        const minSp = isShark ? 0.5 : 0.7
        if (sp > maxSp) { c.vx = (c.vx / sp) * maxSp; c.vy = (c.vy / sp) * maxSp }
        else if (sp < minSp) { c.vx = (c.vx / (sp || 1)) * minSp; c.vy = (c.vy / (sp || 1)) * minSp }
        // mover
        c.x += c.vx; c.y += c.vy
        // envolver bordes
        if (c.x < -m) c.x = w + m; else if (c.x > w + m) c.x = -m
        if (c.y < -m) c.y = h + m; else if (c.y > h + m) c.y = -m
        // dibujar
        if (isShark) drawShark(c, t); else drawFish(c, t)
      }
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)

    const onVis = () => { running = !document.hidden; if (running) { raf = requestAnimationFrame(loop) } }
    document.addEventListener("visibilitychange", onVis)

    return () => {
      running = false
      cancelAnimationFrame(raf)
      window.removeEventListener("mousemove", mm)
      window.removeEventListener("touchmove", tm)
      window.removeEventListener("mouseleave", leave)
      window.removeEventListener("touchend", leave)
      window.removeEventListener("resize", resize)
      document.removeEventListener("visibilitychange", onVis)
    }
  }, [isDark])

  return <canvas ref={canvasRef} aria-hidden="true" style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none" }} />
}
