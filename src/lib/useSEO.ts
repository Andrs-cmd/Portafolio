import { useEffect } from "react"

type SEOProps = {
  title: string
  description: string
  path: string
  image?: string
  keywords?: string
  type?: "website" | "article" | "profile"
}

const SITE_URL = "https://andresprada.com"
const DEFAULT_IMAGE = "https://res.cloudinary.com/dq5tsivzq/image/upload/f_auto,q_auto,w_1200/v1779425407/GUA_4718_gwpah8.jpg"

function setMeta(selector: string, attr: string, value: string) {
  let el = document.querySelector(selector) as HTMLMetaElement | null
  if (!el) {
    el = document.createElement("meta")
    const [name, key] = selector.replace(/[[\]"']/g, "").split("=")
    if (selector.startsWith('meta[property=')) el.setAttribute("property", key || name)
    else if (selector.startsWith('meta[name=')) el.setAttribute("name", key || name)
    document.head.appendChild(el)
  }
  el.setAttribute(attr, value)
}

function setLink(rel: string, href: string) {
  let el = document.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement | null
  if (!el) {
    el = document.createElement("link")
    el.setAttribute("rel", rel)
    document.head.appendChild(el)
  }
  el.setAttribute("href", href)
}

export function useSEO({ title, description, path, image = DEFAULT_IMAGE, keywords, type = "website" }: SEOProps) {
  useEffect(() => {
    const fullUrl = `${SITE_URL}${path}`
    const fullTitle = title.includes("Andres Prada") ? title : `${title} · Andres Prada`

    document.title = fullTitle

    setMeta('meta[name="description"]', "content", description)
    if (keywords) setMeta('meta[name="keywords"]', "content", keywords)

    setMeta('meta[property="og:title"]', "content", fullTitle)
    setMeta('meta[property="og:description"]', "content", description)
    setMeta('meta[property="og:url"]', "content", fullUrl)
    setMeta('meta[property="og:image"]', "content", image)
    setMeta('meta[property="og:type"]', "content", type)

    setMeta('meta[name="twitter:title"]', "content", fullTitle)
    setMeta('meta[name="twitter:description"]', "content", description)
    setMeta('meta[name="twitter:image"]', "content", image)

    setLink("canonical", fullUrl)
  }, [title, description, path, image, keywords, type])
}
