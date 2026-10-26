import { useEffect, useRef, useState } from "react"
import * as THREE from "three"
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js"
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js"
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js"

/**
 * Sección "Arme & Desarme": la cámara DSLR (36 piezas) se desarma y se vuelve a
 * armar según el scroll. Portado del demo de C:\Users\aprad\modelado3d\camara-3d
 * a React. El "pin" es manual y determinista: un efecto de scroll conmuta el
 * escenario a position:fixed mientras recorres PIN_DISTANCE px y calcula el
 * progreso 0→1. No depende de position:sticky (lo rompen los contenedores de
 * scroll de la página) ni del pin de una librería. GLB (Draco) y decoder en
 * /public, sin CDN.
 *
 * Es un segundo contexto WebGL (Liquid Ether usa otro): la escena 3D se monta
 * sólo cuando la sección se acerca (IntersectionObserver) y se libera al salir.
 */

type PartRef = {
  obj: THREE.Object3D
  base: THREE.Vector3
  baseRz: number
  ex: THREE.Vector3
  order: number
  spin: number
  label: string
}

const SCALE = 10 // el modelo está en metros (~15 cm) → ~1.5 unidades
const SPREAD = 1.0
const PIN_DISTANCE = 2400 // px de scroll que dura el arme/desarme (pinned)

const smooth = (a: number, b: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)))
  return t * t * (3 - 2 * t)
}
// 0 armada · 0.5 desarmada · 1 armada otra vez
const amountFor = (p: number) => smooth(0.08, 0.42, p) * (1 - smooth(0.62, 0.95, p))
const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2)

export default function CameraAssembly({ isDark = true }: { isDark?: boolean }) {
  const sectionRef = useRef<HTMLDivElement>(null)
  const pinRef = useRef<HTMLDivElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)
  const tipRef = useRef<HTMLDivElement>(null)
  const countRef = useRef<HTMLSpanElement>(null)
  const barRef = useRef<HTMLSpanElement>(null)
  const progRef = useRef(0) // progreso 0→1 que escribe el efecto de scroll (pin manual)
  const [enabled, setEnabled] = useState(false)
  const [failed, setFailed] = useState(false)
  const [loaded, setLoaded] = useState(false)

  // Se muestra en desktop siempre que el navegador pueda crear WebGL. En móvil
  // NO se monta: la Home ya corre el fondo Liquid Ether (otro contexto WebGL) y
  // dos motores 3D a la vez trababan el scroll en el teléfono. Es la sección más
  // pesada, así que en pantallas pequeñas la escena 3D se omite por completo (la
  // sección entera devuelve null y la página fluye sin ese bloque).
  useEffect(() => {
    if (window.innerWidth < 768) { setEnabled(false); return }
    let webgl = false
    try {
      const c = document.createElement("canvas")
      const gl = c.getContext("webgl2") || c.getContext("webgl")
      webgl = !!gl
      gl && (gl.getExtension("WEBGL_lose_context") as WEBGL_lose_context | null)?.loseContext()
    } catch { webgl = false }
    setEnabled(webgl)
  }, [])

  // Pin manual: conmuta el escenario a position:fixed mientras recorres la
  // sección y escribe el progreso 0→1. secTop se cachea (y se recalcula en
  // resize/carga) porque al fijar el wrap el layout de la sección cambia.
  const secTopRef = useRef(0)
  useEffect(() => {
    if (!enabled) return
    const recalc = () => {
      const sec = sectionRef.current
      if (sec) secTopRef.current = sec.getBoundingClientRect().top + window.scrollY
    }
    const update = () => {
      const wrap = pinRef.current
      if (!wrap) return
      const y = window.scrollY
      const secTop = secTopRef.current
      progRef.current = Math.min(1, Math.max(0, (y - secTop) / PIN_DISTANCE))
      if (y < secTop) { wrap.style.position = "absolute"; wrap.style.top = "0px" }
      else if (y > secTop + PIN_DISTANCE) { wrap.style.position = "absolute"; wrap.style.top = PIN_DISTANCE + "px" }
      else { wrap.style.position = "fixed"; wrap.style.top = "0px" }
    }
    recalc(); update()
    // recalc tras el primer layout (fuentes/imagenes) y al redimensionar
    const onResize = () => { recalc(); update() }
    window.addEventListener("scroll", update, { passive: true })
    window.addEventListener("resize", onResize)
    const t = setTimeout(onResize, 300)
    return () => {
      window.removeEventListener("scroll", update)
      window.removeEventListener("resize", onResize)
      clearTimeout(t)
    }
  }, [enabled])

  // Observa la sección: monta la escena 3D sólo cuando se acerca
  const [near, setNear] = useState(false)
  useEffect(() => {
    const el = sectionRef.current
    if (!el || !enabled) return
    const io = new IntersectionObserver(
      ([e]) => setNear(e.isIntersecting),
      { rootMargin: "400px 0px" }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [enabled])

  useEffect(() => {
    if (!enabled || !near || !stageRef.current) return
    const host = stageRef.current
    let disposed = false

    // En móvil el costo de este segundo contexto WebGL es lo que traba el scroll:
    // sin antialias, pixelRatio 1 (DSLR difusa, no se nota) y, abajo, tope de FPS
    // y sin raycast de hover (en táctil no hay hover que mostrar).
    const isMobile = window.innerWidth < 768
    const renderer = new THREE.WebGLRenderer({ antialias: !isMobile, alpha: true, powerPreference: "high-performance" })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1 : 2))
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.05
    host.appendChild(renderer.domElement)
    const cv = renderer.domElement
    cv.style.width = "100%"
    cv.style.height = "100%"
    cv.style.display = "block"
    cv.style.touchAction = "pan-y"
    cv.style.cursor = "grab"

    const scene = new THREE.Scene()
    const pmrem = new THREE.PMREMGenerator(renderer)
    scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture
    scene.environmentIntensity = 0.55

    const camera = new THREE.PerspectiveCamera(32, 1, 0.01, 100)
    const key = new THREE.DirectionalLight(0xffffff, 2.2); key.position.set(3, 4, 5); scene.add(key)
    const rim = new THREE.DirectionalLight(0xbfd4ff, 2.0); rim.position.set(-4, 2, -4); scene.add(rim)
    const red = new THREE.PointLight(0xe3262b, 1.6, 8); red.position.set(-3, -2, 3); scene.add(red)

    const pivot = new THREE.Group()
    scene.add(pivot)

    const parts: PartRef[] = []
    let maxOrder = 1
    let model: THREE.Group | null = null
    const center0 = new THREE.Vector3()
    const explodeShift = new THREE.Vector3()

    const draco = new DRACOLoader().setDecoderPath("/draco/")
    const gltfLoader = new GLTFLoader().setDRACOLoader(draco)
    gltfLoader.load(
      "/models/camara.glb",
      (gltf) => {
        if (disposed) return
        model = gltf.scene
        model.scale.setScalar(SCALE)
        const box = new THREE.Box3().setFromObject(model)
        center0.copy(box.getCenter(new THREE.Vector3())).negate()
        model.position.copy(center0)
        pivot.add(model)

        model.traverse((o) => {
          const mesh = o as THREE.Mesh
          const mat = mesh.material as THREE.MeshPhysicalMaterial | undefined
          if (mesh.isMesh && mat && (mat.transmission ?? 0) > 0) {
            mat.thickness = 0.004
            mat.envMapIntensity = 1.4
          }
          const ud = o.userData as { explode?: number[]; label?: string; order?: number }
          if (ud && ud.explode) {
            parts.push({
              obj: o,
              label: ud.label || o.name,
              order: ud.order || 0,
              base: o.position.clone(),
              baseRz: o.rotation.z,
              ex: new THREE.Vector3().fromArray(ud.explode),
              spin: /anillo|bisel|dial/.test(o.name) ? 1 : 0,
            })
            maxOrder = Math.max(maxOrder, ud.order || 0)
          }
        })
        for (const p of parts) p.obj.position.copy(p.base).addScaledVector(p.ex, SPREAD)
        pivot.updateMatrixWorld(true)
        new THREE.Box3().setFromObject(model).getCenter(explodeShift)
        explodeShift.subVectors(center0, explodeShift)
        for (const p of parts) p.obj.position.copy(p.base)
        if (countRef.current) countRef.current.textContent = `00 / ${parts.length}`
        setLoaded(true)
      },
      undefined,
      (err) => { console.warn("No se pudo cargar camara.glb:", err); setFailed(true) }
    )

    // ---------- arrastre e hover
    let yaw = 0, yawVel = 0, pitch = 0, dragging = false, lastX = 0, lastY = 0
    const mouse = new THREE.Vector2(-9, -9)
    const ray = new THREE.Raycaster()
    let hovered: THREE.Object3D | null = null

    const onDown = (e: PointerEvent) => { dragging = true; lastX = e.clientX; lastY = e.clientY; cv.style.cursor = "grabbing" }
    const onUp = () => { dragging = false; cv.style.cursor = "grab" }
    const onMove = (e: PointerEvent) => {
      mouse.x = (e.clientX / window.innerWidth) * 2 - 1
      mouse.y = -(e.clientY / window.innerHeight) * 2 + 1
      if (tipRef.current) { tipRef.current.style.left = e.clientX + "px"; tipRef.current.style.top = e.clientY + "px" }
      if (!dragging) return
      yawVel = (e.clientX - lastX) * 0.008; yaw += yawVel
      pitch = Math.max(-0.5, Math.min(0.6, pitch + (e.clientY - lastY) * 0.004))
      lastX = e.clientX; lastY = e.clientY
    }
    cv.addEventListener("pointerdown", onDown)
    window.addEventListener("pointerup", onUp)
    window.addEventListener("pointermove", onMove)

    const partOf = (o: THREE.Object3D | null): THREE.Object3D | null => {
      while (o && !(o.userData as { explode?: number[] })?.explode) o = o.parent
      return o
    }
    const setHover = (obj: THREE.Object3D | null) => {
      if (hovered === obj) return
      const paint = (root: THREE.Object3D, on: boolean) => root.traverse((m) => {
        const mesh = m as THREE.Mesh
        if (!mesh.isMesh) return
        const md = mesh.userData as { _mat?: THREE.Material }
        if (on) { md._mat ??= mesh.material as THREE.Material; mesh.material = (mesh.material as THREE.Material).clone();
          (mesh.material as THREE.MeshStandardMaterial).emissive = new THREE.Color(0x3a0b0c) }
        else if (md._mat) { (mesh.material as THREE.Material).dispose(); mesh.material = md._mat }
      })
      if (hovered) paint(hovered, false)
      hovered = obj
      const tip = tipRef.current
      if (hovered && tip) { paint(hovered, true); tip.textContent = (hovered.userData as { label?: string }).label || ""; tip.style.opacity = "1" }
      else if (tip) tip.style.opacity = "0"
    }

    const resize = () => {
      const w = host.clientWidth || window.innerWidth
      const h = host.clientHeight || window.innerHeight
      renderer.setSize(w, h, false)
      camera.aspect = w / h
      camera.updateProjectionMatrix()
    }
    window.addEventListener("resize", resize)
    resize()

    let prog = 0
    const clock = new THREE.Clock()
    // Tope de FPS en móvil: una escena 3D a 120 Hz mientras se hace scroll es lo
    // que se sentía trabado. 36 fps es suave de sobra para el giro/flote.
    const minFrameMs = isMobile ? 1000 / 36 : 0
    let lastFrame = 0
    renderer.setAnimationLoop((time: number) => {
      if (disposed) return
      if (minFrameMs && time - lastFrame < minFrameMs) return
      lastFrame = time
      const dt = Math.min(clock.getDelta(), 0.05), t = clock.elapsedTime
      prog += (progRef.current - prog) * (1 - Math.pow(0.0015, dt))
      const amt = amountFor(prog)

      let loose = 0
      for (const p of parts) {
        const delay = (p.order / maxOrder) * 0.45
        const k = ease(Math.min(1, Math.max(0, (amt - delay) / 0.55)))
        p.obj.position.copy(p.base).addScaledVector(p.ex, k * SPREAD)
        if (p.spin) p.obj.rotation.z = p.baseRz + k * Math.PI * 0.5
        if (k > 0.02) loose++
      }
      if (countRef.current) countRef.current.textContent = `${String(loose).padStart(2, "0")} / ${parts.length}`
      if (barRef.current) barRef.current.style.width = (prog * 100).toFixed(2) + "%"

      if (!dragging) { yaw += yawVel; yawVel *= 0.94; pitch *= 0.97 }
      pivot.rotation.y = -0.65 + prog * Math.PI * 1.25 + yaw + Math.sin(t * 0.4) * 0.05
      pivot.rotation.x = 0.18 + pitch + amt * 0.12
      pivot.position.y = Math.sin(t * 0.8) * 0.02

      if (model) model.position.lerpVectors(center0, explodeShift, amt)

      const narrow = Math.max(1, 1.45 / camera.aspect)
      const dist = (4.2 + amt * 5.6) * narrow
      camera.position.set(0, 0.35 + amt * 0.6, dist)
      camera.lookAt(0, amt * 0.25, 0)

      // El raycast de hover es sólo para desktop (en táctil no hay cursor que
      // resaltar); en móvil se omite para no pagar su costo cada cuadro.
      if (!isMobile && parts.length && !dragging) {
        ray.setFromCamera(mouse, camera)
        const hit = ray.intersectObject(pivot, true)[0]
        setHover(hit ? partOf(hit.object) : null)
      }
      renderer.render(scene, camera)
    })

    return () => {
      disposed = true
      renderer.setAnimationLoop(null)
      cv.removeEventListener("pointerdown", onDown)
      window.removeEventListener("pointerup", onUp)
      window.removeEventListener("pointermove", onMove)
      window.removeEventListener("resize", resize)
      draco.dispose()
      pmrem.dispose()
      scene.traverse((o) => {
        const m = o as THREE.Mesh
        if (m.isMesh) {
          m.geometry?.dispose()
          const mat = m.material
          if (Array.isArray(mat)) mat.forEach((x) => x.dispose())
          else mat?.dispose()
        }
      })
      renderer.dispose()
      if (cv.parentNode) cv.parentNode.removeChild(cv)
    }
  }, [enabled, near])

  if (!enabled || failed) return null

  const fg = isDark ? "#eef0f3" : "#141211"
  const line = isDark ? "rgba(255,255,255,.14)" : "rgba(0,0,0,.14)"
  const muted = isDark ? "rgba(240,240,245,.55)" : "rgba(20,20,20,.55)"

  return (
    <section ref={sectionRef} style={{ position: "relative", zIndex: 20, height: `calc(100svh + ${PIN_DISTANCE}px)` }} aria-label="Cámara 3D que se arma y se desarma">
      {/* el efecto de scroll conmuta este wrap entre absolute y fixed (pin) */}
      <div ref={pinRef} style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100svh", overflow: "hidden" }}>
        <div ref={stageRef} style={{ position: "absolute", inset: 0 }} />

        {/* HUD */}
        <div style={{ position: "absolute", top: 24, left: "clamp(16px,4vw,48px)", fontSize: 10, letterSpacing: ".3em", textTransform: "uppercase", fontWeight: 700, color: fg, pointerEvents: "none" }}>
          Arme <span style={{ color: "#e3262b" }}>&</span> Desarme
        </div>
        <div style={{ position: "absolute", top: 24, right: "clamp(16px,4vw,48px)", textAlign: "right", fontFamily: "monospace", fontSize: 10, letterSpacing: ".2em", color: muted, pointerEvents: "none" }}>
          Piezas sueltas
          <span ref={countRef} style={{ display: "block", fontSize: 30, color: fg, marginTop: 6 }}>00 / 36</span>
        </div>

        {/* copy */}
        <div style={{ position: "absolute", left: "clamp(16px,4vw,48px)", bottom: "clamp(56px,12vh,120px)", maxWidth: 420, pointerEvents: "none" }}>
          <span style={{ fontFamily: "monospace", fontSize: 10, letterSpacing: ".22em", textTransform: "uppercase", color: "#e3262b" }}>DSLR · 24-105 f/4 · 36 piezas</span>
          <h2 style={{ fontSize: "clamp(1.8rem,4.5vw,3.4rem)", fontWeight: 900, textTransform: "uppercase", letterSpacing: "-.03em", lineHeight: .95, margin: "12px 0 14px", color: fg }}>
            Cada pieza,<br />en su lugar.
          </h2>
          <p style={{ fontSize: 13, fontWeight: 300, lineHeight: 1.7, color: muted }}>
            Haz scroll para desarmar la cámara. Arrástrala para girarla y pasa el cursor por una pieza para ver su nombre.
          </p>
        </div>

        {/* barra de progreso */}
        <div style={{ position: "absolute", left: "clamp(16px,4vw,48px)", right: "clamp(16px,4vw,48px)", bottom: 22, height: 2, background: line, pointerEvents: "none" }}>
          <span ref={barRef} style={{ display: "block", height: "100%", width: 0, background: "#e3262b" }} />
        </div>

        {/* etiqueta de pieza (sigue al cursor) */}
        <div ref={tipRef} style={{ position: "fixed", zIndex: 30, pointerEvents: "none", padding: "7px 11px", borderRadius: 8, background: "rgba(15,16,20,.9)", border: `1px solid ${line}`, fontSize: 12, fontWeight: 600, color: "#eef0f3", transform: "translate(14px,14px)", opacity: 0, transition: "opacity .15s" }} />

        {!loaded && (
          <div style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center", fontFamily: "monospace", fontSize: 11, letterSpacing: ".1em", color: muted, pointerEvents: "none" }}>
            CARGANDO MODELO…
          </div>
        )}
      </div>
    </section>
  )
}
