import { useEffect, useRef, useState } from "react"
import * as THREE from "three"
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js"

/**
 * Escultura digital persistente — centro 3D del Manifesto (reemplaza al gato por
 * algo del contexto del portafolio: arte + geometría + código). Como en bigotes,
 * AL HACER SCROLL cambia: cada escena tiene su forma y su acento (cristal, cubo,
 * nudo toroidal, octaedro, anillo…), con transición encoge→cambia→crece. Flota
 * y gira, se arrastra para girar y pulsa al tocar. Un halo del color de acento
 * la acompaña detrás.
 *
 * Contexto WebGL que se monta al entrar en viewport y se libera al salir.
 */
const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v))
const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2)

// un nudo toroidal distinto (p,q) + acento por escena (10)
type Shape = { geo: () => THREE.BufferGeometry; accent: string; spin: [number, number] }
const knot = (r: number, tube: number, p: number, q: number) => () => new THREE.TorusKnotGeometry(r, tube, 220, 24, p, q)
const SHAPES: Shape[] = [
  { geo: knot(1.05, 0.32, 2, 3), accent: "#c3c4f2", spin: [0.16, 0.04] }, // intro — trébol
  { geo: knot(1.00, 0.34, 3, 2), accent: "#8fb7ff", spin: [0.14, 0.06] }, // 01
  { geo: knot(1.00, 0.30, 2, 5), accent: "#7fe3c0", spin: [0.18, 0.00] }, // 02
  { geo: knot(1.00, 0.30, 3, 4), accent: "#c3c4f2", spin: [0.13, 0.07] }, // 03
  { geo: knot(1.02, 0.30, 4, 3), accent: "#f2c28f", spin: [0.10, 0.12] }, // 04
  { geo: knot(0.98, 0.30, 3, 5), accent: "#e79ad0", spin: [0.12, 0.08] }, // 05
  { geo: knot(1.00, 0.30, 5, 2), accent: "#7fe3c0", spin: [0.15, 0.05] }, // 06
  { geo: knot(0.95, 0.28, 2, 7), accent: "#c3c4f2", spin: [0.20, 0.00] }, // cita
  { geo: knot(1.00, 0.30, 5, 3), accent: "#8fb7ff", spin: [0.11, 0.10] }, // match
  { geo: knot(1.08, 0.34, 2, 3), accent: "#c3c4f2", spin: [0.17, 0.06] }, // cta
]

type Piece = { group: THREE.Group; dispose: () => void }

export default function SculptureMascot({ sceneIndex, className, style }: { sceneIndex: number; className?: string; style?: React.CSSProperties }) {
  const hostRef = useRef<HTMLDivElement>(null)
  const wantRef = useRef(0)
  const [enabled, setEnabled] = useState(false)
  const [near, setNear] = useState(false)

  useEffect(() => { wantRef.current = clamp(sceneIndex, 0, SHAPES.length - 1) }, [sceneIndex])

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
    renderer.toneMappingExposure = 1.05
    host.appendChild(renderer.domElement)
    const cv = renderer.domElement
    cv.style.width = "100%"; cv.style.height = "100%"; cv.style.display = "block"
    cv.style.cursor = "grab"; cv.style.touchAction = "pan-y"

    const scene = new THREE.Scene()
    const pmrem = new THREE.PMREMGenerator(renderer)
    scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.03).texture
    scene.environmentIntensity = 0.5

    const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 100)
    camera.position.set(0, 0, 6)
    scene.add(new THREE.HemisphereLight(0xfff6ee, 0x15151c, 1.0))
    const keyL = new THREE.DirectionalLight(0xfff1e2, 2.2); keyL.position.set(3, 5, 6); scene.add(keyL)
    const rimL = new THREE.DirectionalLight(0xc3c4f2, 2.2); rimL.position.set(-5, 3, -4); scene.add(rimL)
    const fillL = new THREE.DirectionalLight(0xffffff, 0.4); fillL.position.set(-3, -2, 5); scene.add(fillL)

    // halo detrás (sprite con textura radial, teñido por el acento)
    const haloCanvas = document.createElement("canvas"); haloCanvas.width = haloCanvas.height = 128
    const hx = haloCanvas.getContext("2d")!
    const grd = hx.createRadialGradient(64, 64, 2, 64, 64, 64)
    grd.addColorStop(0, "rgba(255,255,255,0.9)"); grd.addColorStop(0.4, "rgba(255,255,255,0.35)"); grd.addColorStop(1, "rgba(255,255,255,0)")
    hx.fillStyle = grd; hx.fillRect(0, 0, 128, 128)
    const halo = new THREE.Sprite(new THREE.SpriteMaterial({ map: new THREE.CanvasTexture(haloCanvas), transparent: true, opacity: 0.5, depthWrite: false, blending: THREE.AdditiveBlending }))
    halo.scale.setScalar(6); halo.position.z = -2
    scene.add(halo)

    const spin = new THREE.Group()
    scene.add(spin)

    const mat = new THREE.MeshPhysicalMaterial({ color: new THREE.Color("#17171f"), metalness: 0.2, roughness: 0.22, clearcoat: 1, clearcoatRoughness: 0.3, sheen: 1, sheenColor: new THREE.Color("#c3c4f2"), sheenRoughness: 0.5, flatShading: true })

    const cache = new Map<number, Piece>()
    const build = (i: number): Piece => {
      const geo = SHAPES[i].geo()
      const m = new THREE.Mesh(geo, mat)
      const edges = new THREE.LineSegments(new THREE.EdgesGeometry(geo, 18), new THREE.LineBasicMaterial({ color: new THREE.Color(SHAPES[i].accent), transparent: true, opacity: 0.25 }))
      const g = new THREE.Group(); g.add(m, edges)
      return { group: g, dispose: () => { geo.dispose(); (edges.geometry as THREE.BufferGeometry).dispose(); (edges.material as THREE.Material).dispose() } }
    }
    const getPiece = (i: number) => { let p = cache.get(i); if (!p) { p = build(i); cache.set(i, p) } return p }

    let cur: Piece | null = null, curKey = -1, grow = 0
    let yaw = 0, yawVel = 0, pitch = 0, pulse = 0, dragging = false, downX = 0, lastX = 0, lastY = 0, moved = 0
    const swap = (i: number) => {
      if (cur) spin.remove(cur.group)
      cur = getPiece(i); curKey = i; spin.add(cur.group)
      halo.material.color.set(SHAPES[i].accent)
      rimL.color.set(SHAPES[i].accent)
      mat.sheenColor.set(SHAPES[i].accent)
      yaw = 0; yawVel = 0
    }

    const onDown = (e: PointerEvent) => { dragging = true; downX = lastX = e.clientX; lastY = e.clientY; moved = 0; cv.style.cursor = "grabbing"; cv.setPointerCapture(e.pointerId) }
    const onMove = (e: PointerEvent) => {
      if (!dragging) return
      const dx = e.clientX - lastX, dy = e.clientY - lastY; lastX = e.clientX; lastY = e.clientY
      moved = Math.max(moved, Math.abs(e.clientX - downX))
      yaw += dx * 0.01; yawVel = dx * 0.01; pitch = clamp(pitch + dy * 0.006, -0.6, 0.6)
    }
    const onUp = () => { if (!dragging) return; dragging = false; cv.style.cursor = "grab"; if (moved < 6) pulse = 1 }
    cv.addEventListener("pointerdown", onDown)
    window.addEventListener("pointermove", onMove)
    window.addEventListener("pointerup", onUp)
    window.addEventListener("pointercancel", onUp)

    const resize = () => { const w = host.clientWidth || 1, h = host.clientHeight || 1; renderer.setSize(w, h, false); camera.aspect = w / h; camera.updateProjectionMatrix() }
    const ro = new ResizeObserver(resize); ro.observe(host); resize()

    const clock = new THREE.Clock()
    renderer.setAnimationLoop(() => {
      if (disposed) return
      const dt = Math.min(clock.getDelta(), 0.05), t = clock.elapsedTime
      const want = wantRef.current
      if (want !== curKey) { grow = Math.max(0, grow - dt * 3.2); if (grow <= 0.001) swap(want) }
      else grow = Math.min(1, grow + dt * 1.6)

      pulse *= Math.pow(0.12, dt)
      if (!dragging) { yaw += yawVel; yawVel *= Math.pow(0.04, dt) }
      const e = ease(grow)
      const breathe = 1 + Math.sin(t * 0.8) * 0.02 + pulse * 0.12
      spin.scale.setScalar((0.02 + e * 0.98) * breathe)
      const sp = SHAPES[clamp(curKey, 0, SHAPES.length - 1)]?.spin ?? [0.14, 0.05]
      spin.rotation.y = yaw + t * sp[0] + (1 - e) * 1.0
      spin.rotation.x = 0.1 + pitch + t * sp[1] + pulse * 0.15
      halo.material.opacity = (0.35 + pulse * 0.4) * e
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
      cache.forEach((p) => p.dispose()); cache.clear()
      mat.dispose(); halo.material.map?.dispose(); halo.material.dispose(); pmrem.dispose()
      renderer.dispose()
      if (cv.parentNode) cv.parentNode.removeChild(cv)
    }
  }, [enabled, near])

  if (!enabled) return null
  return <div ref={hostRef} className={className} style={style} aria-hidden="true" />
}
