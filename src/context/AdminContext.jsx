import { createContext, useContext, useState, useCallback } from 'react'

// ── Credenciales de admin ─────────────────────────────────────────────────────
const ADMIN_USER = 'ValeValda'
const ADMIN_PASS = 'ValeValda2024!' // Cambiá esto a tu contraseña real

const AdminContext = createContext(null)
const ADMIN_SESSION_KEY = 'bbv_admin_session'
const STOCK_KEY = 'bbv_stock_overrides'
const SALES_KEY = 'bbv_sales_log'
const AGE_VERIF_KEY = 'bbv_age_verifications'
const NOTIFICATIONS_KEY = 'bbv_notifications'

function loadAdminSession() {
  try { return JSON.parse(sessionStorage.getItem(ADMIN_SESSION_KEY) || 'null') } catch { return null }
}

// Stock overrides: { [productId]: { stock: number, disabled: boolean } }
export function loadStockOverrides() {
  try { return JSON.parse(localStorage.getItem(STOCK_KEY) || '{}') } catch { return {} }
}

function saveStockOverrides(data) {
  localStorage.setItem(STOCK_KEY, JSON.stringify(data))
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

export function AdminProvider({ children }) {
  const [adminUser, setAdminUser] = useState(loadAdminSession)
  const [stockOverrides, setStockOverrides] = useState(loadStockOverrides)

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
    const updated = { ...loadStockOverrides(), [productId]: { ...(loadStockOverrides()[productId] || {}), stock: stockValue } }
    saveStockOverrides(updated)
    setStockOverrides(updated)
    // Si se agota, notificar
    if (stockValue === 0) {
      saveNotification(`Producto #${productId} marcado como agotado.`)
    }
  }, [])

  const setProductDisabled = useCallback((productId, disabled) => {
    const current = loadStockOverrides()
    const updated = { ...current, [productId]: { ...(current[productId] || {}), disabled } }
    saveStockOverrides(updated)
    setStockOverrides(updated)
  }, [])

  // Retorna estado de stock para un producto
  const getProductStock = useCallback((productId) => {
    return stockOverrides[productId] || { stock: null, disabled: false }
  }, [stockOverrides])

  return (
    <AdminContext.Provider value={{
      adminUser, adminLogin, adminLogout,
      stockOverrides, setStock, setProductDisabled, getProductStock,
    }}>
      {children}
    </AdminContext.Provider>
  )
}

export const useAdmin = () => useContext(AdminContext)
