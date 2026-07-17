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
    featured: false,
  },
  {
    id: "agent-lead",
    index: "004",
    title: "Lead Agent",
    client: "Automatización propia",
    category: "Agente IA · n8n",
    year: "2026",
    description:
      "Agente conversacional que responde mensajes entrantes por WhatsApp y formularios, califica el lead en tiempo real (intención, presupuesto, urgencia, ciudad) y lo guarda en Notion/Sheets con un resumen ejecutivo. Reduce el tiempo de respuesta de horas a segundos y nunca deja un mensaje sin contestar.",
    stack: ["n8n", "OpenAI GPT-4", "WhatsApp Cloud API", "Notion", "Google Sheets", "Webhooks"],
    links: [
      { label: "Ver caso", href: "/automation#lead-agent" },
    ],
    img: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=1200",
    darkBg: "rgba(10,18,20,0.93)",
    lightBg: "rgba(232,240,242,0.96)",
    featured: false,
  },
  {
    id: "agent-handoff",
    index: "005",
    title: "Handoff Reader",
    client: "Automatización propia",
    category: "Agente IA · n8n",
    year: "2026",
    description:
      "Agente que ingiere archivos de handoff (Figma JSON, PDFs, briefs en Markdown), extrae componentes, tokens de diseño y copy, y genera una landing estática lista para producción: HTML semántico, variables CSS, meta SEO. De handoff a deploy sin tocar código manualmente.",
    stack: ["n8n", "OpenAI", "Figma API", "GPT-4 Vision", "PDF Parse", "Vercel API"],
    links: [
      { label: "Ver caso", href: "/automation#handoff-reader" },
    ],
    img: "https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&q=80&w=1200",
    darkBg: "rgba(18,12,22,0.93)",
    lightBg: "rgba(242,236,246,0.96)",
    featured: false,
  },
  {
    id: "atropos",
    index: "006",
    title: "Átropos",
    client: "Producto propio",
    category: "App Móvil · Android",
    year: "2026",
    description:
      "App de finanzas personales local-first: los datos nunca salen del teléfono. Registra los gastos sola leyendo las notificaciones push del banco mediante un plugin nativo propio en Java (NotificationListenerService) que interpreta los formatos reales de Nu, Nequi y Daviplata. Incluye motor de alarmas, presupuestos, metas de ahorro, reportes y cinco esquemas de color.",
    stack: ["React", "TypeScript", "Dexie / IndexedDB", "Capacitor", "Java", "Recharts"],
    links: [],
    img: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&q=80&w=1200",
    darkBg: "rgba(16,10,20,0.93)",
    lightBg: "rgba(243,238,246,0.96)",
    featured: true,
  },
  {
    id: "nocturna",
    index: "007",
    title: "Nocturna",
    client: "Producto propio",
    category: "Juego · Android",
    year: "2026",
    description:
      "«Círculo de Sangre»: juego grimdark de defensa 360°. Vista cenital, personaje fijo en el centro y enemigos que llegan por los cuatro lados; tocas el lado correcto para golpearlos en el anillo. 100 personajes en 9 arquetipos, 100 niveles, 10 jefes y desbloqueo por retos en vez de por nivel. Sprites procedurales y combate con knockback, destellos y hit-stop.",
    stack: ["HTML5 Canvas", "JavaScript", "Capacitor", "Gradle"],
    links: [],
    img: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=1200",
    darkBg: "rgba(18,8,10,0.93)",
    lightBg: "rgba(246,236,236,0.96)",
    featured: true,
  },
  {
    id: "cortex",
    index: "008",
    title: "Córtex",
    client: "Producto propio",
    category: "App Escritorio · IA",
    year: "2026",
    description:
      "Segundo cerebro local: notas, ideas y recordatorios como nodos flotantes conectables. La vista «Universo» simula fuerzas con d3-force, donde el radio de cada nodo crece con su grado. Incorpora a Iris, una asistente con voz que crea nodos por comandos en español, prioriza la agenda y sugiere de forma proactiva. Wikilinks, backlinks y carpetas PARA.",
    stack: ["React", "TypeScript", "Tauri 2", "d3-force", "Zustand", "IndexedDB"],
    links: [],
    img: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=1200",
    darkBg: "rgba(8,12,20,0.93)",
    lightBg: "rgba(236,241,248,0.96)",
    featured: true,
  },
  {
    id: "segundo-cerebro",
    index: "009",
    title: "Segundo Cerebro",
    client: "Sistema propio",
    category: "Gestión del Conocimiento",
    year: "2026",
    description:
      "Base de conocimiento en Obsidian construida sobre el patrón LLM Wiki de Andrej Karpathy: wiki persistente en Markdown, no RAG. Tres capas —fuentes crudas inmutables, wiki generado y esquema— con tres operaciones: Ingest, Query y Lint. Un agente hace todo el mantenimiento (resúmenes, entidades, enlaces, bitácora) mientras el humano cura y pregunta.",
    stack: ["Obsidian", "Markdown", "Claude Code", "n8n", "Telegram Bot"],
    links: [],
    img: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&q=80&w=1200",
    darkBg: "rgba(12,12,14,0.93)",
    lightBg: "rgba(240,239,236,0.96)",
    featured: false,
  },
]

export const featuredProjects = projects.filter(p => p.featured)
