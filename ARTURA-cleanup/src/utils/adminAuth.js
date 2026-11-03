export const ADMIN_SESSION_KEY = 'artura_admin_session'
const ADMIN_USERNAME = 'admin'
const ADMIN_PASSWORD = 'artura123'

export function loginAdmin(username, password) {
  if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
    try { sessionStorage.setItem(ADMIN_SESSION_KEY, 'authenticated') } catch { return false }
    return true
  }
  return false
}

export function logoutAdmin() {
  try { sessionStorage.removeItem(ADMIN_SESSION_KEY) } catch { /* No persisted session. */ }
}

export function isAdminAuthenticated() {
  try { return sessionStorage.getItem(ADMIN_SESSION_KEY) === 'authenticated' } catch { return false }
}
