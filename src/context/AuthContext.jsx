import { createContext, useContext, useState, useCallback, useEffect } from 'react'

// ── Limpieza: cupones eliminados del sitio ────────────────────────────────────
// Borra datos de cupones anteriores (IvonneSolidario y usos) de cualquier
// navegador que visite el sitio.
function purgeCouponData() {
  try {
    localStorage.removeItem('bbv_coupon_emails')
    Object.keys(localStorage)
      .filter(k => k.startsWith('bbv_coupon_uses_'))
      .forEach(k => localStorage.removeItem(k))
  } catch { /* storage no disponible */ }
}

// ── Puntos ────────────────────────────────────────────────────────────────────
export const POINTS_PER_500 = 10
export const POINTS_VALUE_BS = 5
export const BS_PER_POINTS_CYCLE = 500
const POINTS_EXPIRY_DAYS = 30 // puntos vencen en 30 días

// ── Insignias ─────────────────────────────────────────────────────────────────
export const BADGES = [
  { id: 'bronze', label: 'Bronce', minOrders: 25,  color: 'text-amber-600',  bg: 'bg-amber-600/20',  border: 'border-amber-600/30',  emoji: '🥉', benefit: '20 Bs de regalo en tu próximo pedido' },
  { id: 'silver', label: 'Plata',  minOrders: 50,  color: 'text-slate-300',  bg: 'bg-slate-400/20',  border: 'border-slate-400/30',  emoji: '🥈', benefit: '20 Bs de regalo en tu próximo pedido' },
  { id: 'gold',   label: 'Oro',    minOrders: 100, color: 'text-amber-400',  bg: 'bg-amber-400/20',  border: 'border-amber-400/30',  emoji: '🏆', benefit: '20 Bs de regalo en tu próximo pedido' },
]

export function getUserBadge(orderCount) {
  const count = orderCount || 0
  if (count >= 100) return BADGES[2]
  if (count >= 50)  return BADGES[1]
  if (count >= 25)  return BADGES[0]
  return null
}

// ── Storage helpers ───────────────────────────────────────────────────────────
const STORAGE_KEY = 'bbv_users'
const SESSION_KEY = 'bbv_session'

function loadUsers() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]') } catch { return [] }
}
function saveUsers(u) { localStorage.setItem(STORAGE_KEY, JSON.stringify(u)) }
function loadSession() {
  try { return JSON.parse(sessionStorage.getItem(SESSION_KEY) || 'null') } catch { return null }
}

// ── Check points expiry ───────────────────────────────────────────────────────
function checkPointsExpiry(user) {
  if (!user.pointsEarnedAt) return user
  const earned = new Date(user.pointsEarnedAt).getTime()
  const now = Date.now()
  const days = (now - earned) / (1000 * 60 * 60 * 24)
  if (days >= POINTS_EXPIRY_DAYS && (user.points || 0) > 0) {
    return { ...user, points: 0, pointsAccumulated: 0, pointsEarnedAt: null }
  }
  return user
}

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [users, setUsers]           = useState(loadUsers)
  const [currentUser, setCurrentUser] = useState(() => {
    const s = loadSession()
    return s ? checkPointsExpiry(s) : null
  })
  const [authModal, setAuthModal]   = useState(null)
  const [welcomeMsg, setWelcomeMsg] = useState('')

  // Persist session
  useEffect(() => {
    if (currentUser) sessionStorage.setItem(SESSION_KEY, JSON.stringify(currentUser))
    else sessionStorage.removeItem(SESSION_KEY)
  }, [currentUser])

  // Limpieza de datos de cupones eliminados (una vez al cargar)
  useEffect(() => { purgeCouponData() }, [])

  // Sync current user when users array changes
  useEffect(() => {
    if (currentUser) {
      const updated = users.find(u => u.email === currentUser.email)
      if (updated && JSON.stringify(updated) !== JSON.stringify(currentUser)) {
        setCurrentUser(checkPointsExpiry(updated))
      }
    }
  }, [users]) // eslint-disable-line

  // ── Registro ──────────────────────────────────────────────────────────────
  const register = useCallback((name, email, password, birthdate) => {
    const current = loadUsers()
    if (current.find(u => u.email.toLowerCase() === email.toLowerCase())) {
      return { ok: false, error: 'Ya existe una cuenta con ese email.' }
    }
    const newUser = {
      id: Date.now().toString(),
      name, email: email.toLowerCase(), password,
      birthdate: birthdate || null,
      points: 0, pointsAccumulated: 0, pointsEarnedAt: null,
      orders: [], orderCount: 0,
      favorites: [],
      createdAt: new Date().toISOString(),
    }
    const updated = [...current, newUser]
    saveUsers(updated)
    setUsers(updated)
    setCurrentUser(newUser)
    setAuthModal(null)
    setWelcomeMsg(`¡Bienvenida, ${name.split(' ')[0]}! 🎉 Tu cuenta está lista.`)
    return { ok: true }
  }, [])

  // ── Login ─────────────────────────────────────────────────────────────────
  const login = useCallback((email, password) => {
    const current = loadUsers()
    const user = current.find(
      u => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    )
    if (!user) return { ok: false, error: 'Email o contraseña incorrectos.' }
    const checked = checkPointsExpiry(user)
    setCurrentUser(checked)
    setAuthModal(null)

    // Birthday greeting
    const today = new Date()
    if (user.birthdate) {
      const [bd, bm] = user.birthdate.split('-').reverse().map(Number) // DD-MM-YYYY
      if (bd === today.getDate() && bm === (today.getMonth() + 1)) {
        setWelcomeMsg(`🎂 ¡Feliz cumpleaños, ${user.name.split(' ')[0]}! Tenés 5 Bs de descuento hoy.`)
        return { ok: true, birthday: true }
      }
    }

    // Reorder nudge: last order > 15 days ago and total > 320 Bs
    const lastOrder = user.orders?.[0]
    if (lastOrder) {
      const daysSince = (Date.now() - new Date(lastOrder.date).getTime()) / (1000 * 60 * 60 * 24)
      if (daysSince >= 15 && (lastOrder.total || 0) >= 320) {
        setTimeout(() => setWelcomeMsg(`👋 ¡Hola ${user.name.split(' ')[0]}! Han pasado ${Math.floor(daysSince)} días. Tenés 1 Bs de descuento esperándote. 🎁`), 1500)
        return { ok: true }
      }
    }

    setWelcomeMsg(`¡Hola de vuelta, ${user.name.split(' ')[0]}! 👋`)
    return { ok: true }
  }, [])

  const logout = useCallback(() => {
    setCurrentUser(null)
    setWelcomeMsg('')
  }, [])

  // ── Puntos ────────────────────────────────────────────────────────────────
  const addOrderPoints = useCallback((totalBs) => {
    if (!currentUser) return 0
    const current = loadUsers()
    const idx = current.findIndex(u => u.email === currentUser.email)
    if (idx === -1) return 0
    const u = { ...current[idx] }
    const newAccum = (u.pointsAccumulated || 0) + totalBs
    const cycles = Math.floor(newAccum / BS_PER_POINTS_CYCLE)
    const pointsEarned = cycles * POINTS_PER_500
    u.pointsAccumulated = newAccum % BS_PER_POINTS_CYCLE
    u.points = (u.points || 0) + pointsEarned
    u.pointsEarnedAt = pointsEarned > 0 ? new Date().toISOString() : u.pointsEarnedAt
    u.orderCount = (u.orderCount || 0) + 1
    current[idx] = u
    saveUsers(current)
    setUsers([...current])
    setCurrentUser(u)
    return pointsEarned
  }, [currentUser])

  const redeemPoints = useCallback((pointsToRedeem) => {
    if (!currentUser || (currentUser.points || 0) < pointsToRedeem) return 0
    const discountBs = (pointsToRedeem / POINTS_PER_500) * POINTS_VALUE_BS
    const current = loadUsers()
    const idx = current.findIndex(u => u.email === currentUser.email)
    if (idx === -1) return 0
    const u = { ...current[idx] }
    u.points -= pointsToRedeem
    current[idx] = u
    saveUsers(current)
    setUsers([...current])
    setCurrentUser(u)
    return discountBs
  }, [currentUser])

  // ── Pedidos ───────────────────────────────────────────────────────────────
  const addOrder = useCallback((orderData) => {
    if (!currentUser) return
    const current = loadUsers()
    const idx = current.findIndex(u => u.email === currentUser.email)
    if (idx === -1) return
    const u = { ...current[idx] }
    u.orders = [{ id: Date.now().toString(), date: new Date().toISOString(), ...orderData }, ...(u.orders || [])]
    current[idx] = u
    saveUsers(current)
    setUsers([...current])
    setCurrentUser(u)
  }, [currentUser])

  // ── Favoritos ─────────────────────────────────────────────────────────────
  const toggleFavorite = useCallback((productId) => {
    if (!currentUser) return
    const current = loadUsers()
    const idx = current.findIndex(u => u.email === currentUser.email)
    if (idx === -1) return
    const u = { ...current[idx] }
    const favs = u.favorites || []
    u.favorites = favs.includes(productId)
      ? favs.filter(id => id !== productId)
      : [...favs, productId]
    current[idx] = u
    saveUsers(current)
    setUsers([...current])
    setCurrentUser(u)
  }, [currentUser])

  const isFavorite = useCallback((productId) => {
    return (currentUser?.favorites || []).includes(productId)
  }, [currentUser])

  // ── Admin helpers ─────────────────────────────────────────────────────────
  const getAllUsers = useCallback(() => loadUsers(), [])
  const updateUser = useCallback((email, patch) => {
    const current = loadUsers()
    const idx = current.findIndex(u => u.email === email)
    if (idx === -1) return
    current[idx] = { ...current[idx], ...patch }
    saveUsers(current)
    setUsers([...current])
    if (currentUser?.email === email) setCurrentUser(current[idx])
  }, [currentUser])

  return (
    <AuthContext.Provider value={{
      currentUser, users,
      authModal, setAuthModal,
      welcomeMsg, setWelcomeMsg,
      register, login, logout,
      addOrderPoints, redeemPoints, addOrder,
      toggleFavorite, isFavorite,
      getAllUsers, updateUser,
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
