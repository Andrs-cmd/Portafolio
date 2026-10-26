import { useEffect, useRef, useState } from "react"
import * as THREE from "three"
import { buildCat, POSES, lerpPose } from "../lib/cat"

/**
 * Gato 3D persistente — mascota del Manifesto (modelo del usuario, portado de
 * bigotes-web/cat.js). Como en bigotes, AL HACER SCROLL el gato cambia: cada
 * escena del deck tiene su variante (pelaje / patrón / ojos / orejas / pose).
 * La transición encoge el gato actual, lo cambia y lo hace crecer (los modelos
 * se cachean para no reconstruir texturas). Sigue el cursor con la mirada,
 * parpadea, mueve orejas y se pone feliz al tocarlo; se arrastra para girarlo.
 *
 * Contexto WebGL que se monta al entrar en viewport y se libera al salir.
 */
const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v))
const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2)

// un gato por escena del deck (10). pattern omitido = color sólido.
type CatCfg = { fur: string; pattern?: string; eyes: string; ears?: string; pose: string }
const CATS: CatCfg[] = [
  { fur: "naranja",   pattern: "tabby",   eyes: "ambar", ears: "normal", pose: "sit" },   // intro
  { fur: "negro",                         eyes: "verde", ears: "normal", pose: "alert" }, // 01 decisión
  { fur: "gris",      pattern: "tabby",   eyes: "azul",  ears: "normal", pose: "loaf" },  // 02 código
  { fur: "crema",                         eyes: "ambar", ears: "big",    pose: "sit" },   // 03 criterio
  { fur: "chocolate",                     eyes: "cobre", ears: "fold",   pose: "sleep" }, // 04 lo lento
  { fur: "blanco",    pattern: "bicolor", eyes: "azul",  ears: "normal", pose: "sit" },   // 05 marca
  { fur: "naranja",   pattern: "tabby",   eyes: "ambar", ears: "tufted", pose: "sit" },   // 06 LATAM
  { fur: "negro",                         eyes: "verde", ears: "normal", pose: "alert" }, // quote
  { fur: "gris",      pattern: "bicolor", eyes: "ambar", ears: "normal", pose: "loaf" },  // match
  { fur: "naranja",   pattern: "tabby",   eyes: "ambar", ears: "normal", pose: "alert" }, // cta
]

export default function CatMascot({ sceneIndex, className, style }: { sceneIndex: number; className?: string; style?: React.CSSProperties }) {
  const hostRef = useRef<HTMLDivElement>(null)
  const wantRef = useRef(0)
  const [enabled, setEnabled] = useState(false)
  const [near, setNear] = useState(false)

  useEffect(() => { wantRef.current = clamp(sceneIndex, 0, CATS.length - 1) }, [sceneIndex])

  useEffect(() => {
    let ok = false
    try {
      const c = document.createElement("canvas")
      const gl = c.getContext("webgl2") || c.getContext("webgl")
      ok = !!gl
      gl && (gl.getExtension("WEBGL_lose_context") as WEBGL_lose_context | null)?.loseContext()
    } catch { ok = false }
    setEnabled(ok)
  }, [])

  useEffect(() => {
    const el = hostRef.current
    if (!el || !enabled) return
    const io = new IntersectionObserver(([e]) => setNear(e.isIntersecting), { rootMargin: "300px 0px" })
    io.observe(el)
    return () => io.disconnect()
  }, [enabled])

  useEffect(() => {
    if (!enabled || !near || !hostRef.current) return
    const host = hostRef.current
    let disposed = false

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, window.innerWidth < 768 ? 1.5 : 2))
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.0
    host.appendChild(renderer.domElement)
    const cv = renderer.domElement
    cv.style.width = "100%"; cv.style.height = "100%"; cv.style.display = "block"
    cv.style.cursor = "grab"; cv.style.touchAction = "pan-y"

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 100)
    camera.position.set(0.5, 1.8, 6.8); camera.lookAt(0, 1.2, 0)
    scene.add(new THREE.HemisphereLight(0xfff4e6, 0x6b5a4a, 1.5))
    const key = new THREE.DirectionalLight(0xfff0dc, 2.3); key.position.set(4, 6, 7); scene.add(key)
    const rim = new THREE.DirectionalLight(0xdfe6ff, 1.4); rim.position.set(-5, 4, -5); scene.add(rim)
    const fill = new THREE.DirectionalLight(0xffffff, 0.45); fill.position.set(-4, 0, 5); scene.add(fill)

    const spin = new THREE.Group()
    scene.add(spin)

    // caché de gatos por índice de escena
    type CatObj = { group: THREE.Group; update: (t: number, p: object, l: object, f: object) => void; dispose: () => void }
    const cache = new Map<number, CatObj>()
    const getCat = (i: number): CatObj => {
      let c = cache.get(i)
      if (!c) { c = buildCat(CATS[i]) as CatObj; cache.set(i, c) }
      return c
    }

    let cur: CatObj | null = null
    let curKey = -1
    let grow = 0
    const pose = { ...POSES.sit }
    const look = { yaw: 0, pitch: 0, px: 0, py: 0 }
    const lookT = { yaw: 0, pitch: 0, px: 0, py: 0 }
    const fx = { blink: 0, happy: 0, twitch: 0 }
    let nextBlink = 2, nextTwitch = 4, surprise = 0
    let dragYaw = 0, dragVel = 0, dragging = false, downX = 0, lastX = 0, moved = 0
    const ptr = { x: window.innerWidth / 2, y: window.innerHeight / 2 }

    const swap = (i: number) => {
      if (cur) spin.remove(cur.group)
      cur = getCat(i); curKey = i
      spin.add(cur.group)
      dragYaw = 0; dragVel = 0
      Object.assign(pose, POSES[(CATS[i].pose as keyof typeof POSES)] || POSES.sit)
    }

    const onDown = (e: PointerEvent) => { dragging = true; downX = lastX = e.clientX; moved = 0; cv.style.cursor = "grabbing"; cv.setPointerCapture(e.pointerId) }
    const onMove = (e: PointerEvent) => {
      ptr.x = e.clientX; ptr.y = e.clientY
      if (!dragging) return
      const dx = e.clientX - lastX; lastX = e.clientX
      moved = Math.max(moved, Math.abs(e.clientX - downX))
      dragYaw += dx * 0.01; dragVel = dx * 0.01
    }
    const onUp = () => { if (!dragging) return; dragging = false; cv.style.cursor = "grab"; if (moved < 6) { fx.happy = 1; surprise = 0.6 } }
    cv.addEventListener("pointerdown", onDown)
    window.addEventListener("pointermove", onMove)
    window.addEventListener("pointerup", onUp)
    window.addEventListener("pointercancel", onUp)

    const resize = () => {
      const w = host.clientWidth || 1, h = host.clientHeight || 1
      renderer.setSize(w, h, false); camera.aspect = w / h; camera.updateProjectionMatrix()
    }
    const ro = new ResizeObserver(resize); ro.observe(host); resize()

    const clock = new THREE.Clock()
    renderer.setAnimationLoop(() => {
      if (disposed) return
      const dt = Math.min(clock.getDelta(), 0.05), t = clock.elapsedTime
      const want = wantRef.current

      // transición entre gatos: encoge, cambia, crece
      if (want !== curKey) {
        grow = Math.max(0, grow - dt * 3.2)
        if (grow <= 0.001) swap(want)
      } else {
        grow = Math.min(1, grow + dt * 1.6)
      }

      // pose objetivo del gato actual (+ "alert" un instante al tocar)
      surprise = Math.max(0, surprise - dt)
      const base = POSES[(CATS[clamp(curKey, 0, CATS.length - 1)]?.pose as keyof typeof POSES)] || POSES.sit
      lerpPose(pose, surprise > 0 ? POSES.alert : base, 1 - Math.exp(-dt * 4))

      if ((nextBlink -= dt) < 0) { fx.blink = 1; nextBlink = 2 + Math.random() * 3.5 }
      fx.blink = Math.max(0, fx.blink - dt * 7)
      if ((nextTwitch -= dt) < 0) { fx.twitch = 1; nextTwitch = 3 + Math.random() * 5 }
      fx.twitch = Math.max(0, fx.twitch - dt * 6)
      fx.happy = Math.max(0, fx.happy - dt * 0.45)

      const r = cv.getBoundingClientRect()
      const cx = r.left + r.width / 2, cy = r.top + r.height * 0.4
      lookT.yaw = clamp((ptr.x - cx) / window.innerWidth * 2.4, -0.75, 0.75)
      lookT.pitch = clamp((ptr.y - cy) / window.innerHeight * 1.6, -0.45, 0.5)
      lookT.px = lookT.yaw / 0.75; lookT.py = -lookT.pitch / 0.5
      const lk = 1 - Math.exp(-dt * 6)
      for (const k in look) (look as Record<string, number>)[k] += ((lookT as Record<string, number>)[k] - (look as Record<string, number>)[k]) * lk

      if (!dragging) { dragYaw += dragVel; dragVel *= Math.pow(0.05, dt) }
      const e = ease(grow)
      spin.scale.setScalar(0.02 + e * 0.98)
      spin.rotation.y = dragYaw + look.yaw * 0.3 + Math.sin(t * 0.25) * 0.05

      if (cur) cur.update(t, pose, look, fx)
      renderer.render(scene, camera)
    })

    return () => {
      disposed = true
      renderer.setAnimationLoop(null)
      cv.removeEventListener("pointerdown", onDown)
      window.removeEventListener("pointermove", onMove)
      window.removeEventListener("pointerup", onUp)
      window.removeEventListener("pointercancel", onUp)
      ro.disconnect()
      cache.forEach((c) => c.dispose())
      cache.clear()
      renderer.dispose()
      if (cv.parentNode) cv.parentNode.removeChild(cv)
    }
  }, [enabled, near])

  if (!enabled) return null
  return <div ref={hostRef} className={className} style={style} aria-hidden="true" />
}
