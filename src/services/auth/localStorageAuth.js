const ACCOUNTS_KEY = 'linium-accounts'
const SESSION_KEY = 'linium-session'
const SESSION_TTL_MS = 8 * 60 * 60 * 1000

function readJson(key, fallback) {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

function writeJson(key, value) {
  localStorage.setItem(key, JSON.stringify(value))
}

export function readAccounts() {
  return readJson(ACCOUNTS_KEY, [])
}

export function writeAccounts(accounts) {
  writeJson(ACCOUNTS_KEY, accounts)
}

export function readSession() {
  const session = readJson(SESSION_KEY, null)

  if (!session) {
    return null
  }

  // Backward compatibility for previously stored plain user objects.
  if (!session.issuedAt || !session.data) {
    return session
  }

  if (Date.now() - session.issuedAt > SESSION_TTL_MS) {
    clearSession()
    return null
  }

  return session.data
}

export function writeSession(user) {
  writeJson(SESSION_KEY, {
    data: user,
    issuedAt: Date.now(),
  })
}

export function clearSession() {
  localStorage.removeItem(SESSION_KEY)
}
