// ============================================================
//  /api/catalogo — Fuente de verdad de los cambios publicados
// ------------------------------------------------------------
//  GET  → devuelve los cambios que el admin publicó
//         (precios oferta/normal, badges, productos custom…)
//         Usado por el sitio para que TODOS los visitantes vean
//         el catálogo actualizado sin necesidad de redeploy.
//
//  POST → guarda cambios publicados (requiere clave de admin).
//         Se guarda en Vercel Blob (almacenamiento persistente).
//
//  Si algo falla, el sitio usa el catálogo base embebido:
//  nunca se rompe por un error acá.
// ============================================================

import { put, get } from '@vercel/blob'

const BLOB_PATH = 'catalogo/cambios.json'
const MAX_BODY  = 400 * 1024 // 400 KB

const EMPTY = { productEdits: {}, customProducts: [], updatedAt: null }

function json(res, status, data, headers = {}) {
  res.setHeader('Content-Type', 'application/json; charset=utf-8')
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-Admin-Key')
  for (const [k, v] of Object.entries(headers)) res.setHeader(k, v)
  return res.status(status).json(data)
}

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') return json(res, 204, null)

  // ── LECTURA (pública) ──────────────────────────────────────
  if (req.method === 'GET') {
    const cache = { 'Cache-Control': 'public, s-maxage=15, stale-while-revalidate=300' }
    try {
      const blobRes = await get(BLOB_PATH, { access: 'private', token: process.env.BLOB_READ_WRITE_TOKEN })
      const text = await new Response(blobRes.stream).text()
      return json(res, 200, JSON.parse(text), cache)
    } catch (err) {
      // Aún no se publicó nada, o error puntual → catálogo base
      return json(res, 200, EMPTY, cache)
    }
  }

  // ── ESCRITURA (solo admin) ─────────────────────────────────
  if (req.method === 'POST') {
    const expected = process.env.ADMIN_PUBLISH_KEY
    const sent = req.headers['x-admin-key'] || String(req.headers.authorization || '').replace(/^Bearer\s+/i, '')

    if (!expected) {
      return json(res, 500, { ok: false, error: 'Falta configurar ADMIN_PUBLISH_KEY en el proyecto de Vercel.' })
    }
    if (!sent || sent !== expected) {
      return json(res, 401, { ok: false, error: 'Clave de administrador incorrecta.' })
    }

    let body = req.body
    if (typeof body === 'string') {
      try { body = JSON.parse(body) } catch { body = null }
    }
    if (!body || typeof body !== 'object') {
      return json(res, 400, { ok: false, error: 'Cuerpo inválido.' })
    }
    if (JSON.stringify(body).length > MAX_BODY) {
      return json(res, 413, { ok: false, error: 'Demasiados cambios para publicar.' })
    }

    const payload = {
      productEdits:   body.productEdits && typeof body.productEdits === 'object' ? body.productEdits : {},
      customProducts: Array.isArray(body.customProducts) ? body.customProducts : [],
      updatedAt:      new Date().toISOString(),
    }

    try {
      await put(BLOB_PATH, JSON.stringify(payload), {
        access: 'private',
        allowOverwrite: true,
        contentType: 'application/json',
        cacheControlMaxAge: 0,
      })
      return json(res, 200, { ok: true, updatedAt: payload.updatedAt })
    } catch (err) {
      console.error('[catalogo] error guardando blob:', err)
      return json(res, 500, { ok: false, error: 'No se pudo guardar. Intentá de nuevo en unos segundos.' })
    }
  }

  res.setHeader('Allow', 'GET, POST, OPTIONS')
  return json(res, 405, { ok: false, error: 'Método no permitido.' })
}
