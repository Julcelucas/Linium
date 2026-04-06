import { createContext, useContext, useMemo, useState } from 'react'

const ACCOUNTS_KEY = 'linium-accounts'
const SESSION_KEY = 'linium-session'
const DEFAULT_ADMIN_USERNAME = 'admin'
const DEFAULT_ADMIN_EMAIL = 'admin@linium.ao'
const DEFAULT_ADMIN_PASSWORD = 'admin02'

const AuthContext = createContext(null)

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

function ensureAdminAccount(accounts) {
  const adminIndex = accounts.findIndex((item) => item.role === 'admin')

  if (adminIndex >= 0) {
    return accounts.map((account, index) => {
      if (index !== adminIndex) {
        return account
      }

      return {
        ...account,
        id: 'admin-linium',
        name: 'Administração Linium',
        username: DEFAULT_ADMIN_USERNAME,
        email: DEFAULT_ADMIN_EMAIL,
        password: DEFAULT_ADMIN_PASSWORD,
        validationStatus: 'ativo',
      }
    })
  }

  return [
    {
      id: 'admin-linium',
      name: 'Administração Linium',
      username: DEFAULT_ADMIN_USERNAME,
      email: DEFAULT_ADMIN_EMAIL,
      password: DEFAULT_ADMIN_PASSWORD,
      role: 'admin',
      nif: null,
      documentRef: null,
      validationStatus: 'ativo',
      createdAt: new Date().toISOString(),
    },
    ...accounts,
  ]
}

export function AuthProvider({ children }) {
  const [accounts, setAccounts] = useState(() => {
    const storedAccounts = readJson(ACCOUNTS_KEY, [])
    const hydratedAccounts = ensureAdminAccount(storedAccounts)

    if (hydratedAccounts.length !== storedAccounts.length) {
      writeJson(ACCOUNTS_KEY, hydratedAccounts)
    }

    return hydratedAccounts
  })
  const [user, setUser] = useState(() => readJson(SESSION_KEY, null))

  function persistAccounts(nextAccounts) {
    setAccounts(nextAccounts)
    writeJson(ACCOUNTS_KEY, nextAccounts)
  }

  function registerAccount(payload) {
    const normalizedEmail = payload.email.trim().toLowerCase()
    const exists = accounts.some(
      (item) => item.email.toLowerCase() === normalizedEmail && item.role === payload.role
    )

    if (exists) {
      return { ok: false, message: 'Já existe uma conta com este email para este perfil.' }
    }

    const account = {
      id: crypto.randomUUID(),
      name: payload.name.trim(),
      username: null,
      email: normalizedEmail,
      password: payload.password,
      role: payload.role,
      nif: payload.nif?.trim() || null,
      phone: payload.phone?.trim() || null,
      publicEmail: payload.publicEmail?.trim() || null,
      whatsapp: payload.whatsapp?.trim() || null,
      website: payload.website?.trim() || null,
      adminNote: '',
      rejectionReason: '',
      documentRef: payload.documentRef || null,
      validationStatus: payload.role === 'cliente' ? 'ativo' : 'pendente',
      createdAt: new Date().toISOString(),
    }

    const nextAccounts = [account, ...accounts]
    persistAccounts(nextAccounts)

    const sessionUser = {
      id: account.id,
      name: account.name,
      email: account.email,
      role: account.role,
      validationStatus: account.validationStatus,
    }

    setUser(sessionUser)
    writeJson(SESSION_KEY, sessionUser)

    return { ok: true, message: 'Conta criada com sucesso.', user: sessionUser }
  }

  function approveAccount(accountId, metadata = {}) {
    let approvedUser = null

    const nextAccounts = accounts.map((account) => {
      if (account.id !== accountId) {
        return account
      }

      approvedUser = {
        ...account,
        validationStatus: 'ativo',
        adminNote: metadata.adminNote?.trim() || account.adminNote || '',
        rejectionReason: '',
      }

      return approvedUser
    })

    persistAccounts(nextAccounts)

    if (user?.id === accountId && approvedUser) {
      const nextSessionUser = {
        id: approvedUser.id,
        name: approvedUser.name,
        email: approvedUser.email,
        role: approvedUser.role,
        validationStatus: approvedUser.validationStatus,
      }

      setUser(nextSessionUser)
      writeJson(SESSION_KEY, nextSessionUser)
    }
  }

  function rejectAccount(accountId, metadata = {}) {
    let rejectedUser = null

    const nextAccounts = accounts.map((account) => {
      if (account.id !== accountId) {
        return account
      }

      rejectedUser = {
        ...account,
        validationStatus: 'rejeitado',
        adminNote: metadata.adminNote?.trim() || account.adminNote || '',
        rejectionReason: metadata.rejectionReason?.trim() || account.rejectionReason || '',
      }

      return rejectedUser
    })

    persistAccounts(nextAccounts)

    if (user?.id === accountId && rejectedUser) {
      const nextSessionUser = {
        id: rejectedUser.id,
        name: rejectedUser.name,
        email: rejectedUser.email,
        role: rejectedUser.role,
        validationStatus: rejectedUser.validationStatus,
      }

      setUser(nextSessionUser)
      writeJson(SESSION_KEY, nextSessionUser)
    }
  }

  function deactivateAccount(accountId, metadata = {}) {
    let updatedUser = null

    const nextAccounts = accounts.map((account) => {
      if (account.id !== accountId) {
        return account
      }

      updatedUser = {
        ...account,
        validationStatus: 'inativo',
        adminNote: metadata.adminNote?.trim() || account.adminNote || '',
      }

      return updatedUser
    })

    persistAccounts(nextAccounts)

    if (user?.id === accountId && updatedUser) {
      const nextSessionUser = {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        validationStatus: updatedUser.validationStatus,
      }

      setUser(nextSessionUser)
      writeJson(SESSION_KEY, nextSessionUser)
    }
  }

  function reactivateAccount(accountId, metadata = {}) {
    let updatedUser = null

    const nextAccounts = accounts.map((account) => {
      if (account.id !== accountId) {
        return account
      }

      updatedUser = {
        ...account,
        validationStatus: 'ativo',
        adminNote: metadata.adminNote?.trim() || account.adminNote || '',
      }

      return updatedUser
    })

    persistAccounts(nextAccounts)

    if (user?.id === accountId && updatedUser) {
      const nextSessionUser = {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        validationStatus: updatedUser.validationStatus,
      }

      setUser(nextSessionUser)
      writeJson(SESSION_KEY, nextSessionUser)
    }
  }

  function deleteAccount(accountId) {
    const nextAccounts = accounts.filter((account) => account.id !== accountId)
    persistAccounts(nextAccounts)

    if (user?.id === accountId) {
      setUser(null)
      localStorage.removeItem(SESSION_KEY)
    }
  }

  function login(identifier, password, role) {
    const normalizedIdentifier = identifier.trim().toLowerCase()
    const account = accounts.find(
      (item) =>
        (item.email.toLowerCase() === normalizedIdentifier || item.username === normalizedIdentifier) &&
        item.role === role &&
        item.password === password
    )

    if (!account) {
      return { ok: false, message: 'Credenciais inválidas.' }
    }

    const sessionUser = {
      id: account.id,
      name: account.name,
      email: account.email,
      role: account.role,
      validationStatus: account.validationStatus,
    }

    setUser(sessionUser)
    writeJson(SESSION_KEY, sessionUser)

    return { ok: true, message: 'Sessão iniciada.', user: sessionUser }
  }

  function logout() {
    setUser(null)
    localStorage.removeItem(SESSION_KEY)
  }

  function updateAccountReview(accountId, metadata = {}) {
    const nextAccounts = accounts.map((account) => {
      if (account.id !== accountId) {
        return account
      }

      return {
        ...account,
        adminNote:
          metadata.adminNote !== undefined ? metadata.adminNote.trim() : account.adminNote || '',
        rejectionReason:
          metadata.rejectionReason !== undefined
            ? metadata.rejectionReason.trim()
            : account.rejectionReason || '',
      }
    })

    persistAccounts(nextAccounts)
  }

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      accounts,
      approveAccount,
      deactivateAccount,
      deleteAccount,
      rejectAccount,
      reactivateAccount,
      updateAccountReview,
      login,
      logout,
      registerAccount,
    }),
    [accounts, user]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de AuthProvider')
  }
  return context
}
