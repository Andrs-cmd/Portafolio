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
 * Renders LiquidEther only when:
 * - viewport is desktop (≥ 1024px wide)
 * - device has enough memory / CPU
 * - the browser can actually create a WebGL context
 * - user has not opted into prefers-reduced-motion
 *
 * On mobile, low-power, or reduced-motion, returns null and the page's
 * background color shows through. Saves ~250KB of three.js + WebGL work.
 */
export default function OptionalLiquidEther(props: LiquidEtherProps) {
  const [enabled, setEnabled] = useState(false)

  useEffect(() => {
    // WebGL se consulta una sola vez: crear contextos de prueba en cada resize
    // es justamente lo que hace que el navegador acabe bloqueándolos.
    const hasWebGL = supportsWebGL()

    const check = () => {
      const isDesktop = window.innerWidth >= 1024
      const reducedMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches
      // @ts-expect-error — navigator.deviceMemory is non-standard but supported in Chromium
      const lowMem = typeof navigator !== "undefined" && navigator.deviceMemory && navigator.deviceMemory < 4
      // @ts-expect-error — navigator.connection is non-standard
      const conn = typeof navigator !== "undefined" ? navigator.connection : undefined
      const slow = conn && (conn.saveData === true || /(2g|slow-2g)/i.test(conn.effectiveType ?? ""))
      setEnabled(hasWebGL && isDesktop && !reducedMotion && !lowMem && !slow)
    }
    check()
    window.addEventListener("resize", check)
    return () => window.removeEventListener("resize", check)
  }, [])

  if (!enabled) return null

  return (
    <WebGLBoundary>
      <Suspense fallback={null}>
        <LiquidEther {...props} />
      </Suspense>
    </WebGLBoundary>
  )
}
