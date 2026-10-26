import { useTheme } from "../context/ThemeContext"
import CardNav from "../components/CardNav"
import "../components/CardNav.css"
import { getNavItems, NAV_CTA, EMAIL, EMAIL_HREF, WA_URL } from "../data/nav"
import { useSEO } from "../lib/useSEO"

/**
 * Aviso legal + Política de privacidad + Cookies. Página de texto, ligera (sin
 * WebGL) para que cargue rápido. El contenido describe de forma honesta lo que el
 * sitio realmente hace: no hay formularios que almacenen datos; el contacto es por
 * WhatsApp/email/Instagram; el chat de Iris envía la pregunta a Cloudflare Workers
 * AI solo para responder; el navegador guarda localmente la preferencia de tema.
 */
export default function Legal() {
  useSEO({
    title: "Aviso legal y privacidad",
    description: "Aviso legal, política de privacidad y uso de cookies del portafolio de Andres Prada.",
    path: "/legal",
    keywords: "aviso legal, política de privacidad, cookies, andres prada",
  })
  const { isDark } = useTheme()
  const bg = isDark ? "#060606" : "#f5f1e9"
  const fg = isDark ? "#eef0f3" : "#141211"
  const muted = isDark ? "rgba(238,240,243,.70)" : "rgba(20,18,17,.70)"
  const line = isDark ? "rgba(255,255,255,.12)" : "rgba(0,0,0,.12)"
  const accent = "#c3c4f2"

  const menuItems = getNavItems(isDark)

  const Section = ({ n, title, children }: { n: string; title: string; children: React.ReactNode }) => (
    <section style={{ borderTop: `1px solid ${line}`, padding: "34px 0" }}>
      <div style={{ display: "flex", gap: 16, alignItems: "baseline", marginBottom: 14 }}>
        <span style={{ fontFamily: "monospace", fontSize: 12, color: accent }}>{n}</span>
        <h2 style={{ margin: 0, fontSize: "clamp(1.1rem,2.4vw,1.5rem)", fontWeight: 800, letterSpacing: "-.02em", color: fg }}>{title}</h2>
      </div>
      <div style={{ fontSize: 15, lineHeight: 1.75, color: muted, maxWidth: 760 }}>{children}</div>
    </section>
  )

  const link = { color: accent, textDecoration: "underline" }

  return (
    <div style={{ minHeight: "100svh", background: bg, color: fg, overflowX: "clip" }}>
      <div style={{ position: "relative", zIndex: 50 }}>
        <CardNav logo="/faviconAP.ico" items={menuItems} ctaLabel={NAV_CTA.label} ctaHref={NAV_CTA.href}
          baseColor={isDark ? "rgba(6,6,6,.95)" : "rgba(245,241,233,.95)"}
          menuColor={isDark ? "#fff" : "#000"} buttonBgColor={isDark ? "#dde4e6" : "#000"} buttonTextColor={isDark ? "#000" : "#fff"} />
      </div>

      <main style={{ maxWidth: 900, margin: "0 auto", padding: "120px clamp(20px,5vw,48px) 100px" }}>
        <span style={{ fontFamily: "monospace", fontSize: 11, letterSpacing: ".3em", textTransform: "uppercase", color: accent }}>Legal</span>
        <h1 style={{ margin: "14px 0 10px", fontSize: "clamp(2rem,6vw,3.4rem)", fontWeight: 900, letterSpacing: "-.03em", lineHeight: 1 }}>
          Aviso legal y privacidad
        </h1>
        <p style={{ fontSize: 14, color: muted, marginBottom: 8 }}>Última actualización: octubre de 2026.</p>

        <Section n="01" title="Responsable">
          Este sitio es el portafolio personal de <strong style={{ color: fg }}>Andres Prada</strong>, desarrollador y
          diseñador en Bogotá, Colombia. Para cualquier consulta sobre este aviso o sobre tus datos, escribe a{" "}
          <a href={EMAIL_HREF} style={link}>{EMAIL}</a> o por{" "}
          <a href={WA_URL} target="_blank" rel="noopener noreferrer" style={link}>WhatsApp</a>.
        </Section>

        <Section n="02" title="Qué datos se recogen">
          El sitio <strong style={{ color: fg }}>no tiene formularios que almacenen tu información</strong> ni crea perfiles
          de visitantes. El único momento en que compartes datos personales es cuando decides contactar por WhatsApp, email o
          Instagram, o cuando escribes en el chat de Iris. En ese caso, los datos que envías son los que tú mismo escribes.
          Como todo sitio web, el proveedor de alojamiento (Cloudflare) puede registrar datos técnicos básicos (como la
          dirección IP) con fines de seguridad y funcionamiento.
        </Section>

        <Section n="03" title="Chat de Iris (asistente con IA)">
          Iris responde preguntas sobre los servicios y proyectos de Andres. Cuando envías un mensaje, el texto se procesa
          mediante <strong style={{ color: fg }}>Cloudflare Workers AI</strong> únicamente para generar la respuesta; no se
          usa para publicidad ni se vende a terceros. Te recomendamos <strong style={{ color: fg }}>no escribir información
          sensible</strong> (contraseñas, datos bancarios, documentos de identidad) en el chat. Para trámites reales, el
          contacto es por WhatsApp o email.
        </Section>

        <Section n="04" title="Cookies y almacenamiento local">
          Este sitio <strong style={{ color: fg }}>no usa cookies de seguimiento ni analítica de terceros</strong>. Solo puede
          guardar en tu navegador (almacenamiento local) una preferencia de uso, como el tema claro u oscuro, que permanece en
          tu dispositivo y no se envía a ningún servidor. Puedes borrarla limpiando los datos del sitio en tu navegador.
        </Section>

        <Section n="05" title="Tus derechos">
          Conforme a la Ley 1581 de 2012 de Colombia sobre protección de datos personales, puedes solicitar el acceso,
          corrección o eliminación de cualquier dato que nos hayas compartido por los canales de contacto. Escríbenos a{" "}
          <a href={EMAIL_HREF} style={link}>{EMAIL}</a> y lo atenderemos.
        </Section>

        <Section n="06" title="Propiedad intelectual">
          Los textos, el diseño, el código, las fotografías y las obras visuales de este sitio son propiedad de Andres Prada.
          No pueden reproducirse, copiarse ni usarse con fines comerciales sin autorización previa por escrito.
        </Section>

        <Section n="07" title="Enlaces externos">
          El sitio puede enlazar a servicios de terceros (WhatsApp, Instagram, GitHub, email). Al seguirlos sales de este sitio
          y pasas a regirte por las políticas de privacidad de cada plataforma, de las que no somos responsables.
        </Section>

        <div style={{ borderTop: `1px solid ${line}`, paddingTop: 28, marginTop: 10, display: "flex", gap: 20, flexWrap: "wrap", alignItems: "center" }}>
          <a href="/" style={{ ...link, fontSize: 13, textTransform: "uppercase", letterSpacing: ".15em" }}>← Volver al inicio</a>
          <a href={WA_URL} target="_blank" rel="noopener noreferrer" style={{ ...link, fontSize: 13, textTransform: "uppercase", letterSpacing: ".15em" }}>Hablemos por WhatsApp</a>
        </div>
      </main>
    </div>
  )
}
