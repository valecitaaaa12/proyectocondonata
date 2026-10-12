import { createContext, useContext, useState, useCallback, useEffect } from 'react'

// ── Clientes habilitados para el cupón secreto ────────────────────────────────
// La admin puede agregar emails aquí o desde el panel admin (localStorage)
const DEFAULT_COUPON_ENABLED_EMAILS = ['ivonne@demo.com']

const COUPON_CODE = 'IvonneSolidario'
const COUPON_DISCOUNT = 0.05 // 5%

// ── Sistema de puntos ────────────────────────────────────────────────────────
// 500 Bs = 10 puntos | 10 puntos = 5 Bs de descuento
export const POINTS_PER_500 = 10
export const POINTS_VALUE_BS = 5   // 10 puntos = 5 Bs
export const BS_PER_POINTS_CYCLE = 500

const AuthContext = createContext(null)
const STORAGE_KEY = 'bbv_users'
const SESSION_KEY = 'bbv_session'

// Helpers localStorage --------------------------------------------------------
function loadUsers() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]') } catch { return [] }
}
function saveUsers(users) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(users))
}
function loadSession() {
  try { return JSON.parse(sessionStorage.getItem(SESSION_KEY) || 'null') } catch { return null }
}

export function AuthProvider({ children }) {
  const [users, setUsers] = useState(loadUsers)
  const [currentUser, setCurrentUser] = useState(loadSession)
  const [authModal, setAuthModal] = useState(null) // null | 'login' | 'register'

  // Persistir sesión en sessionStorage
  useEffect(() => {
    if (currentUser) sessionStorage.setItem(SESSION_KEY, JSON.stringify(currentUser))
    else sessionStorage.removeItem(SESSION_KEY)
  }, [currentUser])

  // Sincronizar datos del usuario actual cuando cambian los users
  useEffect(() => {
    if (currentUser) {
      const updated = users.find(u => u.email === currentUser.email)
      if (updated && JSON.stringify(updated) !== JSON.stringify(currentUser)) {
        setCurrentUser(updated)
      }
    }
  }, [users]) // eslint-disable-line react-hooks/exhaustive-deps

  // ── Registro ──────────────────────────────────────────────────────────────
  const register = useCallback((name, email, password) => {
    const current = loadUsers()
    if (current.find(u => u.email.toLowerCase() === email.toLowerCase())) {
      return { ok: false, error: 'Ya existe una cuenta con ese email.' }
    }
    const newUser = {
      id: Date.now().toString(),
      name,
      email: email.toLowerCase(),
      password, // En producción: hash. Aquí es demo local.
      points: 0,
      pointsAccumulated: 0, // Bs acumulados para calcular puntos
      orders: [],
      createdAt: new Date().toISOString(),
    }
    const updated = [...current, newUser]
    saveUsers(updated)
    setUsers(updated)
    setCurrentUser(newUser)
    setAuthModal(null)
    return { ok: true }
  }, [])

  // ── Login ─────────────────────────────────────────────────────────────────
  const login = useCallback((email, password) => {
    const current = loadUsers()
    const user = current.find(
      u => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    )
    if (!user) return { ok: false, error: 'Email o contraseña incorrectos.' }
    setCurrentUser(user)
    setAuthModal(null)
    return { ok: true }
  }, [])

  // ── Logout ────────────────────────────────────────────────────────────────
  const logout = useCallback(() => {
    setCurrentUser(null)
  }, [])

  // ── Agregar puntos tras compra ─────────────────────────────────────────────
  // Llama a esto cuando se confirma un pedido
  const addOrderPoints = useCallback((totalBs) => {
    if (!currentUser) return
    const current = loadUsers()
    const idx = current.findIndex(u => u.email === currentUser.email)
    if (idx === -1) return
    const u = { ...current[idx] }
    const newAccum = (u.pointsAccumulated || 0) + totalBs
    const cycles = Math.floor(newAccum / BS_PER_POINTS_CYCLE)
    const pointsEarned = cycles * POINTS_PER_500
    u.pointsAccumulated = newAccum % BS_PER_POINTS_CYCLE
    u.points = (u.points || 0) + pointsEarned
    current[idx] = u
    saveUsers(current)
    setUsers(current)
    setCurrentUser(u)
    return pointsEarned
  }, [currentUser])

  // ── Canjear puntos ────────────────────────────────────────────────────────
  // Devuelve Bs de descuento canjeados
  const redeemPoints = useCallback((pointsToRedeem) => {
    if (!currentUser || (currentUser.points || 0) < pointsToRedeem) return 0
    const discountBs = (pointsToRedeem / POINTS_PER_500) * POINTS_VALUE_BS
    const current = loadUsers()
    const idx = current.findIndex(u => u.email === currentUser.email)
    if (idx === -1) return 0
    const u = { ...current[idx] }
    u.points = u.points - pointsToRedeem
    current[idx] = u
    saveUsers(current)
    setUsers(current)
    setCurrentUser(u)
    return discountBs
  }, [currentUser])

  // ── Registrar pedido ──────────────────────────────────────────────────────
  const addOrder = useCallback((orderData) => {
    if (!currentUser) return
    const current = loadUsers()
    const idx = current.findIndex(u => u.email === currentUser.email)
    if (idx === -1) return
    const u = { ...current[idx] }
    u.orders = [
      { id: Date.now().toString(), date: new Date().toISOString(), ...orderData },
      ...(u.orders || []),
    ]
    current[idx] = u
    saveUsers(current)
    setUsers(current)
    setCurrentUser(u)
  }, [currentUser])

  // ── Cupón ─────────────────────────────────────────────────────────────────
  const validateCoupon = useCallback((code) => {
    if (code.trim().toLowerCase() !== COUPON_CODE.toLowerCase()) {
      return { ok: false, error: 'Cupón inválido.' }
    }
    // Verificar si el usuario está habilitado
    const enabledList = JSON.parse(localStorage.getItem('bbv_coupon_emails') || 'null')
      || DEFAULT_COUPON_ENABLED_EMAILS
    if (!currentUser) return { ok: false, error: 'Debés iniciar sesión para usar este cupón.' }
    const enabled = enabledList.some(e => e.toLowerCase() === currentUser.email.toLowerCase())
    if (!enabled) return { ok: false, error: 'No estás habilitado para usar este cupón.' }
    return { ok: true, discount: COUPON_DISCOUNT, label: '5% de descuento' }
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
      register, login, logout,
      addOrderPoints, redeemPoints, addOrder,
      validateCoupon,
      getAllUsers, updateUser,
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
