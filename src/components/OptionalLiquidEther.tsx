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
 *
 * Runs on mobile too, but in a lighter mode: el costo del fluido es
 * resolución × pixel ratio, así que en pantallas pequeñas se baja la resolución
 * para conservar el efecto sin freír batería. Con poca RAM o conexión lenta
 * devuelve null y se ve el fondo de color liso. (Ya NO se apaga por
 * prefers-reduced-motion: el usuario lo quiere siempre visible.)
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
      // Nota: antes se ocultaba con prefers-reduced-motion. El usuario quiere su
      // fondo Liquid Ether SIEMPRE visible, así que ya no lo apagamos por esa
      // preferencia; sólo lo saltamos sin WebGL, con poca RAM o conexión lenta.
      // @ts-expect-error — navigator.deviceMemory is non-standard but supported in Chromium
      const lowMem = typeof navigator !== "undefined" && navigator.deviceMemory && navigator.deviceMemory < 4
      // @ts-expect-error — navigator.connection is non-standard
      const conn = typeof navigator !== "undefined" ? navigator.connection : undefined
      const slow = conn && (conn.saveData === true || /(2g|slow-2g)/i.test(conn.effectiveType ?? ""))
      setIsSmall(small)
      setEnabled(hasWebGL && !lowMem && !slow)
    }
    check()
    window.addEventListener("resize", check)
    return () => window.removeEventListener("resize", check)
  }, [])

  if (!enabled) return null

  // Modo ligero en móvil. El costo por cuadro lo dominan la resolución de la
  // simulación y, sobre todo, las iteraciones de Poisson (una pasada a pantalla
  // completa cada una). En celular se recortan sin que el fondo difuso lo note,
  // y se topan los FPS para que las pantallas de 90/120 Hz no frían la GPU y el
  // ritmo quede parejo. Solo pisa lo necesario; el resto de props se respetan.
  const tuned: LiquidEtherProps = isSmall
    ? {
        ...props,
        resolution: Math.min(props.resolution ?? 0.5, 0.5),
        cursorSize: 80,
        iterationsPoisson: Math.min(props.iterationsPoisson ?? 20, 12),
        maxFps: 48,
      }
    : props

  return (
    <WebGLBoundary>
      <Suspense fallback={null}>
        <LiquidEther {...tuned} />
      </Suspense>
    </WebGLBoundary>
  )
}
