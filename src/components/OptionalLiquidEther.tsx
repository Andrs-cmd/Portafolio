import { Component, lazy, Suspense, useEffect, useState, type ReactNode } from "react"
import type { LiquidEtherProps } from "./LiquidEther"

const LiquidEther = lazy(() => import("./LiquidEther"))

/**
 * Aísla los fallos de LiquidEther. Es un fondo decorativo: si el navegador no
 * puede darle un contexto WebGL (aceleración por hardware apagada, driver en
 * lista negra, demasiados contextos vivos), three.js lanza y sin este límite la
 * excepción sube hasta la raíz y deja el sitio en blanco. Aquí se degrada a un
 * fondo liso y el resto de la página sigue viva.
 */
class WebGLBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false }

  static getDerivedStateFromError() {
    return { failed: true }
  }

  componentDidCatch(error: unknown) {
    console.warn("LiquidEther deshabilitado; se continúa sin fondo animado:", error)
  }

  render() {
    if (this.state.failed) return null
    return this.props.children
  }
}

/** ¿El navegador puede realmente entregar un contexto WebGL? */
function supportsWebGL() {
  try {
    const canvas = document.createElement("canvas")
    const gl = canvas.getContext("webgl2") || canvas.getContext("webgl")
    if (!gl) return false
    // Los contextos son un recurso escaso: hay que soltar el de prueba a mano o
    // el navegador termina bloqueándolos, que es el fallo que se quiere evitar.
    gl.getExtension("WEBGL_lose_context")?.loseContext()
    return true
  } catch {
    return false
  }
}

/**
 * Renders LiquidEther when:
 * - the browser can actually create a WebGL context
 * - device has enough memory / CPU and a decent connection
 * - user has not opted into prefers-reduced-motion
 *
 * Runs on mobile too, but in a lighter mode: el costo del fluido es
 * resolución × pixel ratio, así que en pantallas pequeñas se baja la resolución
 * para conservar el efecto sin freír batería. En equipos con poca RAM, conexión
 * lenta o 'reduce movimiento' devuelve null y se ve el fondo de color liso.
 */
export default function OptionalLiquidEther(props: LiquidEtherProps) {
  const [enabled, setEnabled] = useState(false)
  const [isSmall, setIsSmall] = useState(false)

  useEffect(() => {
    // WebGL se consulta una sola vez: crear contextos de prueba en cada resize
    // es justamente lo que hace que el navegador acabe bloqueándolos.
    const hasWebGL = supportsWebGL()

    const check = () => {
      const small = window.innerWidth < 1024
      const reducedMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches
      // @ts-expect-error — navigator.deviceMemory is non-standard but supported in Chromium
      const lowMem = typeof navigator !== "undefined" && navigator.deviceMemory && navigator.deviceMemory < 4
      // @ts-expect-error — navigator.connection is non-standard
      const conn = typeof navigator !== "undefined" ? navigator.connection : undefined
      const slow = conn && (conn.saveData === true || /(2g|slow-2g)/i.test(conn.effectiveType ?? ""))
      setIsSmall(small)
      setEnabled(hasWebGL && !reducedMotion && !lowMem && !slow)
    }
    check()
    window.addEventListener("resize", check)
    return () => window.removeEventListener("resize", check)
  }, [])

  if (!enabled) return null

  // Modo ligero en móvil: menos resolución de simulación y cursor más pequeño.
  // Solo pisa lo que haga falta; el resto de props de desktop se respetan.
  const tuned: LiquidEtherProps = isSmall
    ? { ...props, resolution: Math.min(props.resolution ?? 0.5, 0.5), cursorSize: 80 }
    : props

  return (
    <WebGLBoundary>
      <Suspense fallback={null}>
        <LiquidEther {...tuned} />
      </Suspense>
    </WebGLBoundary>
  )
}
