import { createContext, useContext, useState, useCallback } from 'react'
import { products as BASE_PRODUCTS } from '../data/products'

// ── Credentials ───────────────────────────────────────────────────────────────
const ADMIN_USER = 'ValeValda'
const ADMIN_PASS = 'ValeValda2024!'

const AdminContext = createContext(null)

const ADMIN_SESSION_KEY  = 'bbv_admin_session'
const STOCK_KEY          = 'bbv_stock_overrides'
const PRODUCT_EDITS_KEY  = 'bbv_product_edits'   // NEW: full product field overrides
const SALES_KEY          = 'bbv_sales_log'
const AGE_VERIF_KEY      = 'bbv_age_verifications'
const NOTIFICATIONS_KEY  = 'bbv_notifications'
const CUSTOM_PRODUCTS_KEY = 'bbv_custom_products' // NEW: admin-created products

function loadAdminSession() {
  try { return JSON.parse(sessionStorage.getItem(ADMIN_SESSION_KEY) || 'null') } catch { return null }
}

export function loadStockOverrides() {
  try { return JSON.parse(localStorage.getItem(STOCK_KEY) || '{}') } catch { return {} }
}
function saveStockOverrides(d) { localStorage.setItem(STOCK_KEY, JSON.stringify(d)) }

// Product edits: { [productId]: { ...patchFields } }
function loadProductEdits() {
  try { return JSON.parse(localStorage.getItem(PRODUCT_EDITS_KEY) || '{}') } catch { return {} }
}
function saveProductEdits(d) { localStorage.setItem(PRODUCT_EDITS_KEY, JSON.stringify(d)) }

// Custom products created by admin
function loadCustomProducts() {
  try { return JSON.parse(localStorage.getItem(CUSTOM_PRODUCTS_KEY) || '[]') } catch { return [] }
}
function saveCustomProducts(d) { localStorage.setItem(CUSTOM_PRODUCTS_KEY, JSON.stringify(d)) }

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

// Merge base products with admin edits and custom products
export function getMergedProducts() {
  const edits   = loadProductEdits()
  const customs = loadCustomProducts()
  const merged  = BASE_PRODUCTS.map(p => {
    const patch = edits[p.id]
    return patch ? { ...p, ...patch } : p
  })
  return [...merged, ...customs]
}

export function AdminProvider({ children }) {
  const [adminUser,      setAdminUser]      = useState(loadAdminSession)
  const [stockOverrides, setStockOverrides] = useState(loadStockOverrides)
  const [productEdits,   setProductEdits]   = useState(loadProductEdits)
  const [customProducts, setCustomProducts] = useState(loadCustomProducts)

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

  // ── Product field editing ──────────────────────────────────────────────────
  // Patch any fields of an existing product (price, name, desc, badge, promoTag, flavors, etc.)
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
    const base  = BASE_PRODUCTS.find(p => p.id === productId)
    const patch = productEdits[productId]
    if (!base) return null
    return patch ? { ...base, ...patch } : base
  }, [productEdits])

  // ── Custom products (created by admin) ───────────────────────────────────
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
    const updated = current.filter(p => p.id !== id)
    saveCustomProducts(updated)
    setCustomProducts(updated)
  }, [])

  // ── Helpers for components ────────────────────────────────────────────────
  // Returns all products with admin overrides applied
  const getAllEffectiveProducts = useCallback(() => {
    const edits = loadProductEdits()
    const merged = BASE_PRODUCTS.map(p => {
      const patch = edits[p.id]
      return patch ? { ...p, ...patch } : p
    })
    return [...merged, ...loadCustomProducts()]
  }, [productEdits, customProducts]) // eslint-disable-line

  return (
    <AdminContext.Provider value={{
      adminUser, adminLogin, adminLogout,
      stockOverrides, setStock, setProductDisabled, getProductStock,
      productEdits,
      editProduct, resetProductEdits, getEffectiveProduct, getAllEffectiveProducts,
      customProducts, addCustomProduct, updateCustomProduct, deleteCustomProduct,
    }}>
      {children}
    </AdminContext.Provider>
  )
}

export const useAdmin = () => useContext(AdminContext)
