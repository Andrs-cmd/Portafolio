export type ProjectLink = {
  label: string
  href: string
}

export type Project = {
  id: string
  index: string
  title: string
  client?: string
  category: string
  year: string
  description: string
  stack: string[]
  links: ProjectLink[]
  img: string
  darkBg: string
  lightBg: string
  featured: boolean
}

export const projects: Project[] = [
  {
    id: "be-well-cen",
    index: "001",
    title: "Product Page",
    client: "Be Well — CEN",
    category: "Diseño & Frontend",
    year: "2026",
    description:
      "Dos direcciones visuales para la product page del suplemento CEN: 'Ritual Editorial' (calmada, asimétrica, crema) y 'Aurora Bold' (alto contraste, científica). Misma arquitectura de información, dos atmósferas. Implementación final pensada en Shopify Liquid + Section Groups.",
    stack: ["HTML", "CSS", "JS Vanilla", "Shopify Liquid", "Figma"],
    links: [
      { label: "Ver propuestas", href: "https://cute-mermaid-7b3b34.netlify.app/" },
    ],
    img: "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&q=80&w=1200",
    darkBg: "rgba(14,10,22,0.93)",
    lightBg: "rgba(245,240,235,0.96)",
    featured: true,
  },
  {
    id: "sellu",
    index: "002",
    title: "Sellu",
    client: "Sell-U",
    category: "Plataforma Web",
    year: "2025",
    description:
      "Plataforma para emprendedores latinos que abren LLCs en USA, gestionan impuestos y venden en marketplaces americanos. Desarrollo del front y vistas con Laravel + Blade, integraciones con pagos, panel de tracking y soporte por WhatsApp.",
    stack: ["Laravel", "Blade", "MySQL", "Tailwind", "JavaScript"],
    links: [
      { label: "Ver sitio", href: "https://sellu.co/" },
    ],
    img: "https://images.unsplash.com/photo-1556742044-3c52d6e88c62?auto=format&fit=crop&q=80&w=1200",
    darkBg: "rgba(8,14,22,0.93)",
    lightBg: "rgba(238,243,248,0.96)",
    featured: true,
  },
  {
    id: "convergente",
    index: "003",
    title: "Convergente",
    client: "Convergente Café",
    category: "Ecommerce",
    year: "2025",
    description:
      "Tienda de café de especialidad del Cauca, Colombia. Catálogo de granos y equipos de preparación (V60, Chemex, prensa francesa, moka), carrito y contacto vía WhatsApp. Visual cálido, fotografía de producto y narrativa de comunidad cafetera.",
    stack: ["HTML", "CSS", "JavaScript", "WhatsApp API"],
    links: [
      { label: "Ver tienda", href: "https://convergente.cafe/" },
    ],
    img: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&q=80&w=1200",
    darkBg: "rgba(12,14,8,0.93)",
    lightBg: "rgba(240,238,228,0.96)",
    featured: true,
  },
]

export const featuredProjects = projects.filter(p => p.featured)
