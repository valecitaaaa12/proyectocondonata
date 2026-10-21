import { createContext, useContext, useState, useCallback, useEffect, useMemo } from 'react'
import { products as BASE_PRODUCTS } from '../data/products'
import { applyPromo } from '../data/promos'

// ── Credentials ───────────────────────────────────────────────────────────────
const ADMIN_USER = 'ValeValda'
const ADMIN_PASS = 'ValeValda2024!'

const AdminContext = createContext(null)

const ADMIN_SESSION_KEY  = 'bbv_admin_session'
const STOCK_KEY          = 'bbv_stock_overrides'
const PRODUCT_EDITS_KEY  = 'bbv_product_edits'    // borrador local del admin
const SALES_KEY          = 'bbv_sales_log'
const AGE_VERIF_KEY      = 'bbv_age_verifications'
const NOTIFICATIONS_KEY  = 'bbv_notifications'
const CUSTOM_PRODUCTS_KEY = 'bbv_custom_products' // borrador local: productos creados
const DELETED_CUSTOMS_KEY = 'bbv_deleted_customs' // borrador local: customs eliminados
const PUBLISHED_KEY       = 'bbv_catalogo_publicado' // último catálogo publicado (nube)

function loadAdminSession() {
  try { return JSON.parse(sessionStorage.getItem(ADMIN_SESSION_KEY) || 'null') } catch { return null }
}

export function loadStockOverrides() {
  try { return JSON.parse(localStorage.getItem(STOCK_KEY) || '{}') } catch { return {} }
}
function saveStockOverrides(d) { localStorage.setItem(STOCK_KEY, JSON.stringify(d)) }

// Borrador local de ediciones: { [productId]: { ...patchFields } }
function loadProductEdits() {
  try { return JSON.parse(localStorage.getItem(PRODUCT_EDITS_KEY) || '{}') } catch { return {} }
}
function saveProductEdits(d) { localStorage.setItem(PRODUCT_EDITS_KEY, JSON.stringify(d)) }

// Productos creados por el admin (borrador local, se publican al hacerlo)
function loadCustomProducts() {
  try { return JSON.parse(localStorage.getItem(CUSTOM_PRODUCTS_KEY) || '[]') } catch { return [] }
}
function saveCustomProducts(d) { localStorage.setItem(CUSTOM_PRODUCTS_KEY, JSON.stringify(d)) }

function loadDeletedCustoms() {
  try { return JSON.parse(localStorage.getItem(DELETED_CUSTOMS_KEY) || '[]') } catch { return [] }
}
function saveDeletedCustoms(d) { localStorage.setItem(DELETED_CUSTOMS_KEY, JSON.stringify(d)) }

// ── Catálogo publicado (lo que ven TODOS los visitantes) ─────────────────────
// Se guarda en Vercel Blob vía /api/catalogo y se lee al cargar el sitio.
let published = { productEdits: {}, customProducts: [], updatedAt: null }

function readPublishedCache() {
  try {
    const raw = localStorage.getItem(PUBLISHED_KEY)
    if (!raw) return
    const d = JSON.parse(raw)
    published = {
      productEdits:   d.productEdits   || {},
      customProducts: d.customProducts || [],
      updatedAt:      d.updatedAt      || null,
    }
  } catch { /* usar valores por defecto */ }
}
readPublishedCache()

// Descarga lo publicado desde la nube. Devuelve true si hubo respuesta válida.
export async function fetchPublishedCatalog() {
  try {
    const r = await fetch('/api/catalogo', { headers: { Accept: 'application/json' } })
    if (!r.ok) return false
    const d = await r.json()
    published = {
      productEdits:   d && d.productEdits   ? d.productEdits   : {},
      customProducts: d && d.customProducts ? d.customProducts : [],
      updatedAt:      d && d.updatedAt      ? d.updatedAt      : null,
    }
    localStorage.setItem(PUBLISHED_KEY, JSON.stringify(published))
    return true
  } catch {
    // Sin red o en dev local: seguimos con lo que tengamos cacheado/base
    return false
  }
}

// Customs efectivos = publicados − eliminados + borradores locales encima
function effectiveCustoms() {
  const deleted = new Set(loadDeletedCustoms())
  const list = (published.customProducts || []).filter(c => !deleted.has(c.id))
  loadCustomProducts().forEach(c => {
    const i = list.findIndex(x => x.id === c.id)
    if (i >= 0) list[i] = { ...list[i], ...c }
    else list.push(c)
  })
  return list
}

// Ediciones efectivas = publicadas con el borrador local encima (local gana)
function effectiveEdits() {
  const pub = published.productEdits || {}
  const loc = loadProductEdits()
  const merged = {}
  new Set([...Object.keys(pub), ...Object.keys(loc)]).forEach(id => {
    merged[id] = { ...pub[id], ...loc[id] }
  })
  return merged
}

export function loadSalesLog() {
  try { return JSON.parse(localStorage.getItem(SALES_KEY) || '[]') } catch { return [] }
}
export function loadAgeVerifications() {
  try { return JSON.parse(localStorage.getItem(AGE_VERIF_KEY) || '[]') } catch { return [] }
}
export function loadNotifications() {
  try { return JSON.parse(localStorage.getItem(NOTIFICATIONS_KEY) || '[]') } catch { return [] }
}
export function saveNotification(msg) {
  const list = loadNotifications()
  list.unshift({ id: Date.now().toString(), msg, date: new Date().toISOString(), read: false })
  localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(list.slice(0, 50)))
}
export function logAgeVerification(data) {
  const list = loadAgeVerifications()
  list.unshift({ ...data, date: new Date().toISOString() })
  localStorage.setItem(AGE_VERIF_KEY, JSON.stringify(list.slice(0, 200)))
}
export function logSale(data) {
  const list = loadSalesLog()
  list.unshift({ ...data, date: new Date().toISOString() })
  localStorage.setItem(SALES_KEY, JSON.stringify(list.slice(0, 500)))
}

// Catálogo "en bruto": base + cambios publicados + borrador local.
// SIN la promo global del día → es lo que usa el panel admin para editar y
// publicar, así un descuento temporal jamás se le graba al catálogo.
export function getMergedProductsRaw() {
  const edits  = effectiveEdits()
  const merged = BASE_PRODUCTS.map(p => {
    const patch = edits[p.id]
    return patch ? { ...p, ...patch } : p
  })
  return [...merged, ...effectiveCustoms()]
}

// Merge base + publicado + borrador local → catálogo completo que se muestra.
// Si la promo del día está activa, aplica el descuento a todos los productos.
export function getMergedProducts() {
  return applyPromo(getMergedProductsRaw())
}

export function AdminProvider({ children }) {
  const [adminUser,      setAdminUser]      = useState(loadAdminSession)
  const [stockOverrides, setStockOverrides] = useState(loadStockOverrides)
  const [productEdits,   setProductEdits]   = useState(loadProductEdits)
  const [customProducts, setCustomProducts] = useState(loadCustomProducts)
  const [deletedCustoms, setDeletedCustoms] = useState(loadDeletedCustoms)

  // Estado de "lo publicado" en la nube
  const [publishedInfo, setPublishedInfo] = useState(() => ({
    updatedAt: published.updatedAt,
    count: Object.keys(published.productEdits).length + (published.customProducts || []).length,
  }))
  const [publishing,   setPublishing]   = useState(false)
  const [publishError, setPublishError] = useState(null)
  // Bump para forzar re-render de los consumidores cuando cambia lo publicado
  const [catalogVersion, setCatalogVersion] = useState(0)

  const syncPublishedInfo = useCallback(() => {
    setPublishedInfo({
      updatedAt: published.updatedAt,
      count: Object.keys(published.productEdits || {}).length + (published.customProducts || []).length,
    })
    setCatalogVersion(v => v + 1)
  }, [])

  // ── Auth ──────────────────────────────────────────────────────────────────
  const adminLogin = useCallback((user, pass) => {
    if (user === ADMIN_USER && pass === ADMIN_PASS) {
      const session = { user: ADMIN_USER, loginAt: new Date().toISOString() }
      sessionStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify(session))
      setAdminUser(session)
      return { ok: true }
    }
    return { ok: false, error: 'Credenciales incorrectas.' }
  }, [])

  const adminLogout = useCallback(() => {
    sessionStorage.removeItem(ADMIN_SESSION_KEY)
    setAdminUser(null)
  }, [])

  // ── Stock ─────────────────────────────────────────────────────────────────
  const setStock = useCallback((productId, stockValue) => {
    const current = loadStockOverrides()
    const updated = { ...current, [productId]: { ...(current[productId] || {}), stock: stockValue } }
    saveStockOverrides(updated)
    setStockOverrides(updated)
    if (stockValue === 0) saveNotification(`Producto #${productId} marcado como agotado.`)
  }, [])

  const setProductDisabled = useCallback((productId, disabled) => {
    const current = loadStockOverrides()
    const updated = { ...current, [productId]: { ...(current[productId] || {}), disabled } }
    saveStockOverrides(updated)
    setStockOverrides(updated)
  }, [])

  const getProductStock = useCallback((productId) => {
    return stockOverrides[productId] || { stock: null, disabled: false }
  }, [stockOverrides])

  // ── Product field editing (borrador local) ─────────────────────────────────
  // Patch any fields of an existing product (price, oldPrice, name, desc, badge…)
  const editProduct = useCallback((productId, patch) => {
    const current = loadProductEdits()
    const existing = current[productId] || {}
    const updated = { ...current, [productId]: { ...existing, ...patch } }
    saveProductEdits(updated)
    setProductEdits(updated)
  }, [])

  // Reset all edits for a product back to base
  const resetProductEdits = useCallback((productId) => {
    const current = loadProductEdits()
    const { [productId]: _, ...rest } = current
    saveProductEdits(rest)
    setProductEdits(rest)
  }, [])

  // Get the effective (merged) version of a single product
  const getEffectiveProduct = useCallback((productId) => {
    const base = BASE_PRODUCTS.find(p => p.id === productId)
    if (base) {
      const patch = { ...(published.productEdits || {})[productId], ...productEdits[productId] }
      return patch && Object.keys(patch).length ? { ...base, ...patch } : base
    }
    return effectiveCustoms().find(c => c.id === productId) || null
  }, [productEdits, customProducts, deletedCustoms]) // eslint-disable-line

  // ── Custom products (creados por el admin) ────────────────────────────────
  const addCustomProduct = useCallback((productData) => {
    const current = loadCustomProducts()
    const newId = `custom_${Date.now()}`
    const newProduct = { ...productData, id: newId, isCustom: true }
    const updated = [...current, newProduct]
    saveCustomProducts(updated)
    setCustomProducts(updated)
    return newId
  }, [])

  const updateCustomProduct = useCallback((id, patch) => {
    const current = loadCustomProducts()
    const updated = current.map(p => p.id === id ? { ...p, ...patch } : p)
    saveCustomProducts(updated)
    setCustomProducts(updated)
  }, [])

  const deleteCustomProduct = useCallback((id) => {
    const current = loadCustomProducts()
    saveCustomProducts(current.filter(p => p.id !== id))
    setCustomProducts(current.filter(p => p.id !== id))
    // Si ya estaba publicado, marcar como eliminado para que no vuelva a aparecer
    if ((published.customProducts || []).some(c => c.id === id)) {
      const deleted = [...new Set([...loadDeletedCustoms(), id])]
      saveDeletedCustoms(deleted)
      setDeletedCustoms(deleted)
    }
  }, [])

  // ── Publicar cambios (esto es lo que ven TODOS los visitantes) ────────────
  const pendingCount = useMemo(() => {
    const edits = loadProductEdits()
    const customs = loadCustomProducts()
    return Object.keys(edits).length + customs.length + loadDeletedCustoms().length
  }, [productEdits, customProducts, deletedCustoms])

  const refreshPublished = useCallback(async () => {
    const ok = await fetchPublishedCatalog()
    if (ok) syncPublishedInfo()
    return ok
  }, [syncPublishedInfo])

  // ¿Este producto tiene cambios publicados en la nube?
  const isProductPublished = useCallback((productId) => {
    const inEdits   = !!((published.productEdits || {})[productId])
    const inCustoms = (published.customProducts || []).some(c => c.id === productId)
    return inEdits || inCustoms
  }, [catalogVersion, publishedInfo])

  const publishChanges = useCallback(async () => {
    setPublishing(true)
    setPublishError(null)
    try {
      const payload = {
        productEdits:   effectiveEdits(),
        customProducts: effectiveCustoms(),
      }
      const r = await fetch('/api/catalogo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-Admin-Key': ADMIN_PASS },
        body: JSON.stringify(payload),
      })
      const data = await r.json().catch(() => null)
      if (!r.ok || !data || !data.ok) {
        throw new Error((data && data.error) || 'No se pudo publicar. Intentá de nuevo.')
      }

      // Lo publicado ahora es la verdad: limpiar borradores locales
      published = {
        productEdits:   payload.productEdits,
        customProducts: payload.customProducts,
        updatedAt:      data.updatedAt,
      }
      localStorage.setItem(PUBLISHED_KEY, JSON.stringify(published))
      saveProductEdits({})
      setProductEdits({})
      saveCustomProducts([])
      setCustomProducts([])
      saveDeletedCustoms([])
      setDeletedCustoms([])
      syncPublishedInfo()

      saveNotification(`Catálogo publicado: ${Object.keys(payload.productEdits).length} producto(s) con cambios.`)
      return { ok: true, updatedAt: data.updatedAt }
    } catch (e) {
      setPublishError(e.message || 'Error desconocido al publicar.')
      return { ok: false, error: e.message || 'Error desconocido al publicar.' }
    } finally {
      setPublishing(false)
    }
  }, [syncPublishedInfo])

  // ── Helpers para componentes ───────────────────────────────────────────────
  // Returns all products with published + local admin overrides applied
  const getAllEffectiveProducts = useCallback(() => getMergedProducts(), [catalogVersion, productEdits, customProducts, deletedCustoms])

  // ── Descarga lo publicado al montar y al volver a la pestaña ──────────────
  useEffect(() => {
    let alive = true
    refreshPublished()

    const onFocus = () => { refreshPublished() }
    const onVisible = () => { if (document.visibilityState === 'visible') refreshPublished() }
    const interval = setInterval(() => refreshPublished(), 5 * 60 * 1000) // 5 min

    window.addEventListener('focus', onFocus)
    document.addEventListener('visibilitychange', onVisible)
    return () => {
      alive = false
      window.removeEventListener('focus', onFocus)
      document.removeEventListener('visibilitychange', onVisible)
      clearInterval(interval)
      void alive
    }
  }, [refreshPublished])

  return (
    <AdminContext.Provider value={{
      adminUser, adminLogin, adminLogout,
      stockOverrides, setStock, setProductDisabled, getProductStock,
      productEdits,
      editProduct, resetProductEdits, getEffectiveProduct, getAllEffectiveProducts,
      customProducts, addCustomProduct, updateCustomProduct, deleteCustomProduct,
      publishedInfo, pendingCount, publishing, publishError,
      publishChanges, refreshPublished, isProductPublished, catalogVersion,
    }}>
      {children}
    </AdminContext.Provider>
  )
}

export const useAdmin = () => useContext(AdminContext)
