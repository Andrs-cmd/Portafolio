/* eslint-disable */
// Cloudflare Pages Function: POST /api/subscribe
// Captura opt-in → agrega el contacto a una lista de Brevo (email marketing).
// La API key y el ID de lista van como VARIABLES DE ENTORNO en Cloudflare Pages
// (Settings → Environment variables), NUNCA en el código:
//   - BREVO_API_KEY  (secreto / encrypted)
//   - BREVO_LIST_ID  (número de la lista en Brevo)
// El contacto entra como opt-in explícito (la persona llenó el formulario para
// un recurso gratis). Se puede activar doble opt-in luego desde Brevo.

interface Env {
  BREVO_API_KEY?: string
  BREVO_LIST_ID?: string
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

export const onRequestPost = async (context: { request: Request; env: Env }): Promise<Response> => {
  const { request, env } = context
  const json = (data: unknown, status = 200) =>
    new Response(JSON.stringify(data), { status, headers: { "content-type": "application/json" } })

  try {
    if (!env.BREVO_API_KEY || !env.BREVO_LIST_ID) {
      // diagnóstico temporal: solo booleanos, nunca el valor del secreto
      return json({ error: "La captura aún no está configurada (faltan las variables de Brevo).", _debug: { apiKey: !!env.BREVO_API_KEY, listId: !!env.BREVO_LIST_ID } }, 503)
    }

    const body = (await request.json()) as { name?: string; email?: string; source?: string; website?: string }

    // Honeypot: un bot rellena el campo oculto "website". Si viene con algo,
    // fingimos éxito y no guardamos nada.
    if (body.website && body.website.trim() !== "") return json({ ok: true })

    const name = (body.name || "").toString().trim().slice(0, 80)
    const email = (body.email || "").toString().trim().toLowerCase().slice(0, 120)
    const source = (body.source || "web").toString().trim().slice(0, 40)

    if (!EMAIL_RE.test(email)) return json({ error: "Correo no válido." }, 400)

    const listId = Number(env.BREVO_LIST_ID)
    const headers = {
      "api-key": env.BREVO_API_KEY,
      "content-type": "application/json",
      accept: "application/json",
    }

    const add = (attributes: Record<string, string>) =>
      fetch("https://api.brevo.com/v3/contacts", {
        method: "POST",
        headers,
        body: JSON.stringify({ email, attributes, listIds: [listId], updateEnabled: true }),
      })

    // Intento con SOURCE (si existe ese atributo en Brevo da segmentación).
    let res = await add({ FIRSTNAME: name, SOURCE: source })
    // Si el atributo SOURCE no existe aún en Brevo, reintenta solo con FIRSTNAME.
    if (!res.ok && res.status === 400) {
      const t = await res.text()
      if (/attribute/i.test(t)) res = await add({ FIRSTNAME: name })
    }

    // Brevo responde 201 (creado) o 204 (actualizado) cuando todo va bien.
    if (res.ok || res.status === 204) return json({ ok: true })

    return json({ error: "No pudimos registrar tu correo. Inténtalo de nuevo." }, 502)
  } catch {
    return json({ error: "No pudimos procesar la solicitud." }, 500)
  }
}
