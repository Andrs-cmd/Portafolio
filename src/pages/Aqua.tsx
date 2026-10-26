import FishTank from "../components/FishTank"
import LiquidEther from "../components/OptionalLiquidEther"
import { useTheme } from "../context/ThemeContext"
import { useSEO } from "../lib/useSEO"

/**
 * Prueba: peces y tiburones nadando bajo el Liquid Ether (como si fuera agua).
 * Ruta aislada /aqua para no afectar el rendimiento del portafolio. Capas:
 *   z0  FishTank (canvas de peces/tiburones)
 *   z1  Liquid Ether con paleta de océano (el "agua")
 *   z2  contenido mínimo
 * Peces y fluido reaccionan al mismo cursor/dedo.
 */
const OCEAN = ["#001018", "#063a52", "#1b7fa8", "#3fd0c9", "#eafcff"]

export default function Aqua() {
  useSEO({ title: "Aqua · prueba", description: "Experimento: peces y tiburones bajo el Liquid Ether.", path: "/aqua" })
  const { isDark } = useTheme()

  return (
    <div style={{ position: "relative", minHeight: "100svh", background: "#02060b", overflow: "hidden" }}>
      <FishTank isDark={isDark} />

      {/* el "agua" encima de los peces */}
      <div style={{ position: "fixed", inset: 0, zIndex: 1, pointerEvents: "none" }}>
        <LiquidEther colors={OCEAN} mouseForce={26} cursorSize={120} resolution={0.6} autoIntensity={1.8} dt={0.016} isViscous={false} />
      </div>

      {/* contenido */}
      <div style={{ position: "relative", zIndex: 2, pointerEvents: "none", minHeight: "100svh", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", textAlign: "center", padding: "0 24px", color: "#eafcff" }}>
        <span style={{ fontFamily: "monospace", fontSize: 11, letterSpacing: ".4em", textTransform: "uppercase", opacity: .7 }}>Prueba</span>
        <h1 style={{ margin: "14px 0 12px", fontSize: "clamp(3rem, 12vw, 9rem)", fontWeight: 900, letterSpacing: "-.04em", lineHeight: .9, textShadow: "0 6px 40px rgba(0,0,0,.5)" }}>AQUA</h1>
        <p style={{ margin: 0, maxWidth: 420, fontSize: 14, lineHeight: 1.7, opacity: .85 }}>
          Peces y tiburones nadando bajo el Liquid Ether. Mueve el dedo o el cursor: el agua se agita y los peces se dispersan.
        </p>
        <a href="/" style={{ pointerEvents: "auto", marginTop: 28, fontSize: 11, letterSpacing: ".2em", textTransform: "uppercase", color: "#eafcff", textDecoration: "none", border: "1px solid rgba(234,252,255,.4)", borderRadius: 999, padding: "11px 22px", backdropFilter: "blur(6px)" }}>
          ← Volver al portafolio
        </a>
      </div>
    </div>
  )
}
