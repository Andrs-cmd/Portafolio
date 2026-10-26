import { useEffect, useRef, useState } from "react"
import * as THREE from "three"
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js"

/**
 * Escultura digital — centro 3D del Manifesto (reemplazo de la flor de noctiflora
 * por algo del contexto del portafolio: arte + código). Una forma facetada
 * (gema/cristal) oscura con brillo lavanda que:
 *  - "florece" al montar (escala 0→1 con ease)
 *  - gira lento y respira
 *  - se arrastra para girar (con inercia)
 *  - pulsa al tocar/soltar sin arrastrar (equivalente al "rustle")
 *
 * Infraestructura de escena portada del app.js de noctiflora (cámara, luces,
 * holder/spin, bloom, drag). Es un contexto WebGL extra: se monta sólo cuando
 * entra en viewport y se libera al salir. Requiere WebGL (no se apaga por
 * reduced-motion: el usuario quiere la pieza visible).
 */
const LAV = "#c3c4f2"
const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2)

export default function ArtObject({ className, style }: { className?: string; style?: React.CSSProperties }) {
  const hostRef = useRef<HTMLDivElement>(null)
  const [enabled, setEnabled] = useState(false)
  const [near, setNear] = useState(false)

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
    cv.style.width = "100%"
    cv.style.height = "100%"
    cv.style.display = "block"
    cv.style.cursor = "grab"
    cv.style.touchAction = "pan-y"

    const scene = new THREE.Scene()
    const pmrem = new THREE.PMREMGenerator(renderer)
    scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.03).texture
    scene.environmentIntensity = 0.5

    const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 100)
    camera.position.set(0, 0, 6)
    scene.add(new THREE.HemisphereLight(0xfff6ee, 0x15151c, 1.0))
    const key = new THREE.DirectionalLight(0xfff1e2, 2.2); key.position.set(3, 5, 6); scene.add(key)
    const rim = new THREE.DirectionalLight(0xc3c4f2, 2.2); rim.position.set(-5, 3, -4); scene.add(rim)
    const fill = new THREE.DirectionalLight(0xffffff, 0.4); fill.position.set(-3, -2, 5); scene.add(fill)

    const holder = new THREE.Group()
    const spin = new THREE.Group()
    holder.add(spin)
    scene.add(holder)

    // la escultura: icosaedro facetado, oscuro y brillante con tinte lavanda
    const geo = new THREE.IcosahedronGeometry(1.5, 1)
    const mat = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color("#17171f"),
      metalness: 0.2, roughness: 0.22,
      clearcoat: 1, clearcoatRoughness: 0.3,
      sheen: 1, sheenColor: new THREE.Color(LAV), sheenRoughness: 0.5,
      flatShading: true,
    })
    const mesh = new THREE.Mesh(geo, mat)
    spin.add(mesh)
    // aristas sutiles para reforzar lo "escultórico"
    const edges = new THREE.LineSegments(
      new THREE.EdgesGeometry(geo, 18),
      new THREE.LineBasicMaterial({ color: new THREE.Color(LAV), transparent: true, opacity: 0.18 })
    )
    spin.add(edges)

    // interacción (arrastre + pulso)
    let grow = 0, yaw = 0, yawVel = 0, pitch = 0, pulse = 0, dragging = false, downX = 0, downY = 0, lastX = 0, lastY = 0, moved = 0
    const onDown = (e: PointerEvent) => { dragging = true; downX = lastX = e.clientX; downY = lastY = e.clientY; moved = 0; cv.style.cursor = "grabbing"; cv.setPointerCapture(e.pointerId) }
    const onMove = (e: PointerEvent) => {
      if (!dragging) return
      const dx = e.clientX - lastX, dy = e.clientY - lastY
      lastX = e.clientX; lastY = e.clientY
      moved = Math.max(moved, Math.abs(e.clientX - downX) + Math.abs(e.clientY - downY))
      yaw += dx * 0.01; yawVel = dx * 0.01
      pitch = Math.max(-0.6, Math.min(0.6, pitch + dy * 0.006))
    }
    const onUp = () => { if (!dragging) return; dragging = false; cv.style.cursor = "grab"; if (moved < 6) pulse = 1 }
    cv.addEventListener("pointerdown", onDown)
    cv.addEventListener("pointermove", onMove)
    cv.addEventListener("pointerup", onUp)
    cv.addEventListener("pointercancel", onUp)

    const resize = () => {
      const w = host.clientWidth || 1, h = host.clientHeight || 1
      renderer.setSize(w, h, false)
      camera.aspect = w / h
      camera.updateProjectionMatrix()
    }
    const ro = new ResizeObserver(resize)
    ro.observe(host)
    resize()

    const clock = new THREE.Clock()
    renderer.setAnimationLoop(() => {
      if (disposed) return
      const dt = Math.min(clock.getDelta(), 0.05), t = clock.elapsedTime
      grow = Math.min(1, grow + dt * 1.2)
      pulse *= Math.pow(0.12, dt)
      if (!dragging) { yaw += yawVel; yawVel *= Math.pow(0.04, dt) }
      const e = ease(grow)
      const breathe = 1 + Math.sin(t * 0.8) * 0.02 + pulse * 0.12
      spin.scale.setScalar((0.001 + e * 0.999) * breathe)
      spin.rotation.y = yaw + t * 0.18 + (1 - e) * 1.0
      spin.rotation.x = 0.1 + pitch + Math.sin(t * 0.5) * 0.04 + pulse * 0.15
      renderer.render(scene, camera)
    })

    return () => {
      disposed = true
      renderer.setAnimationLoop(null)
      cv.removeEventListener("pointerdown", onDown)
      cv.removeEventListener("pointermove", onMove)
      cv.removeEventListener("pointerup", onUp)
      cv.removeEventListener("pointercancel", onUp)
      ro.disconnect()
      geo.dispose(); mat.dispose()
      edges.geometry.dispose(); (edges.material as THREE.Material).dispose()
      pmrem.dispose()
      renderer.dispose()
      if (cv.parentNode) cv.parentNode.removeChild(cv)
    }
  }, [enabled, near])

  if (!enabled) return null
  return <div ref={hostRef} className={className} style={style} aria-hidden="true" />
}
