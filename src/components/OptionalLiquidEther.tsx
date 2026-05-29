import { lazy, Suspense, useEffect, useState } from "react"
import type { LiquidEtherProps } from "./LiquidEther"

const LiquidEther = lazy(() => import("./LiquidEther"))

/**
 * Renders LiquidEther only when:
 * - viewport is desktop (≥ 1024px wide)
 * - device has enough memory / CPU
 * - user has not opted into prefers-reduced-motion
 *
 * On mobile, low-power, or reduced-motion, returns null and the page's
 * background color shows through. Saves ~250KB of three.js + WebGL work.
 */
export default function OptionalLiquidEther(props: LiquidEtherProps) {
  const [enabled, setEnabled] = useState(false)

  useEffect(() => {
    const check = () => {
      const isDesktop = window.innerWidth >= 1024
      const reducedMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches
      // @ts-expect-error — navigator.deviceMemory is non-standard but supported in Chromium
      const lowMem = typeof navigator !== "undefined" && navigator.deviceMemory && navigator.deviceMemory < 4
      // @ts-expect-error — navigator.connection is non-standard
      const conn = typeof navigator !== "undefined" ? navigator.connection : undefined
      const slow = conn && (conn.saveData === true || /(2g|slow-2g)/i.test(conn.effectiveType ?? ""))
      setEnabled(isDesktop && !reducedMotion && !lowMem && !slow)
    }
    check()
    window.addEventListener("resize", check)
    return () => window.removeEventListener("resize", check)
  }, [])

  if (!enabled) return null

  return (
    <Suspense fallback={null}>
      <LiquidEther {...props} />
    </Suspense>
  )
}
