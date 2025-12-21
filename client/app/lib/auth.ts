const AUTH_CHANNEL_NAME = 'app-auth'
const hasBroadcast = typeof BroadcastChannel !== 'undefined'
const channel: BroadcastChannel | null = hasBroadcast ? new BroadcastChannel(AUTH_CHANNEL_NAME) : null

// Store all active listeners for same-tab notifications
const listeners = new Set<(loggedIn: boolean) => void>()

function emitAuthEvent(type: 'login' | 'logout') {
  // Notify all listeners in this tab
  const loggedIn = type === 'login'
  listeners.forEach(callback => callback(loggedIn))

  // Notify other tabs
  try {
    if (channel) channel.postMessage(type)
  } catch {}
  try {
    localStorage.setItem('auth-event', `${type}:${Date.now()}`)
  } catch {}
}

export function getToken() {
  try {
    return localStorage.getItem('token')
  } catch {
    return null
  }
}

export function setToken(token: string) {
  try {
    localStorage.setItem('token', token)
  } catch {}
  emitAuthEvent('login')
}

export function isLoggedIn() {
  return !!getToken()
}

export function logout() {
  try {
    localStorage.removeItem('token')
  } catch {}
  emitAuthEvent('logout')
}

export function onAuthChange(callback: (loggedIn: boolean) => void) {
  // Add to listeners for same-tab notifications
  listeners.add(callback)

  let unsubChannel: (() => void) | null = null
  let unsubStorage: (() => void) | null = null

  if (channel) {
    const handler = (ev: MessageEvent) => {
      const msg = ev.data
      if (msg === 'login' || msg === 'logout') {
        callback(msg === 'login')
      }
    }
    channel.addEventListener('message', handler)
    unsubChannel = () => channel.removeEventListener('message', handler)
  }

  const storageHandler = (e: StorageEvent) => {
    if (e.key === 'auth-event' && e.newValue) {
      const type = e.newValue.split(':')[0]
      if (type === 'login' || type === 'logout') {
        callback(type === 'login')
      }
    }
    if (e.key === 'token') {
      callback(!!e.newValue)
    }
  }

  try {
    window.addEventListener('storage', storageHandler)
    unsubStorage = () => window.removeEventListener('storage', storageHandler)
  } catch {}

  return () => {
    listeners.delete(callback)
    unsubChannel?.()
    unsubStorage?.()
  }
}