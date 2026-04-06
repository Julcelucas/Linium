import { createContext, useContext, useEffect, useState } from 'react'
import { appConfig } from '../config/appConfig'
import {
  clearSession,
  readAccounts,
  readSession,
  writeAccounts,
  writeSession,
} from '../services/auth/localStorageAuth'
import {
  deleteSupabaseAccount,
  fetchSupabaseAccounts,
  getSupabaseSessionProfile,
  loginWithSupabase,
  logoutSupabase,
  registerWithSupabase,
  updateSupabaseReview,
  updateSupabaseValidationStatus,
} from '../services/auth/supabaseAuth'

const DEFAULT_ADMIN_USERNAME = 'admin'
const DEFAULT_ADMIN_EMAIL = 'admin@linium.ao'
const DEFAULT_ADMIN_PASSWORD = 'admin02'

const AuthContext = createContext(null)

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
        statusHistory: account.statusHistory || [
          {
            status: 'ativo',
            changedAt: account.createdAt || new Date().toISOString(),
            note: 'Conta administrativa ativa por configuração do sistema.',
          },
        ],
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
      statusHistory: [
        {
          status: 'ativo',
          changedAt: new Date().toISOString(),
          note: 'Conta administrativa ativa por configuração do sistema.',
        },
      ],
    },
    ...accounts,
  ]
}

function toSessionUser(account) {
  return {
    id: account.id,
    name: account.name,
    email: account.email,
    role: account.role,
    validationStatus: account.validationStatus,
  }
}

export function AuthProvider({ children }) {
  const [accounts, setAccounts] = useState([])
  const [user, setUser] = useState(null)
  const [authReady, setAuthReady] = useState(false)

  const isSupabaseMode = appConfig.authMode === 'supabase'

  useEffect(() => {
    let isMounted = true

    async function bootstrapLocal() {
      const storedAccounts = readAccounts()
      const hydratedAccounts = ensureAdminAccount(storedAccounts)

      if (hydratedAccounts.length !== storedAccounts.length) {
        writeAccounts(hydratedAccounts)
      }

      if (!isMounted) {
        return
      }

      setAccounts(hydratedAccounts)
      setUser(readSession())
      setAuthReady(true)
    }

    async function bootstrapSupabase() {
      const [accountsResult, sessionResult] = await Promise.all([
        fetchSupabaseAccounts(),
        getSupabaseSessionProfile(),
      ])

      if (!isMounted) {
        return
      }

      if (!accountsResult.ok) {
        setAccounts([])
        setUser(null)
        setAuthReady(true)
        return
      }

      setAccounts(accountsResult.accounts)
      setUser(sessionResult.ok ? sessionResult.user : null)
      setAuthReady(true)
    }

    if (isSupabaseMode) {
      void bootstrapSupabase()
    } else {
      void bootstrapLocal()
    }

    return () => {
      isMounted = false
    }
  }, [isSupabaseMode])

  function persistLocalAccounts(nextAccounts) {
    setAccounts(nextAccounts)
    writeAccounts(nextAccounts)
  }

  async function refreshSupabaseAccounts() {
    const result = await fetchSupabaseAccounts()

    if (!result.ok) {
      return []
    }

    setAccounts(result.accounts)
    return result.accounts
  }

  async function syncSessionUserFromAccounts(nextAccounts) {
    if (!user) {
      return
    }

    const currentAccount = nextAccounts.find((item) => item.id === user.id)

    if (!currentAccount) {
      setUser(null)
      clearSession()
      return
    }

    const nextSessionUser = toSessionUser(currentAccount)
    setUser(nextSessionUser)

    if (!isSupabaseMode) {
      writeSession(nextSessionUser)
    }
  }

  async function registerAccount(payload) {
    if (isSupabaseMode) {
      const result = await registerWithSupabase(payload)

      if (!result.ok) {
        return result
      }

      await refreshSupabaseAccounts()
      if (result.user) {
        setUser(result.user)
      }

      return result
    }

    const normalizedEmail = payload.email.trim().toLowerCase()
    const exists = accounts.some(
      (item) => item.email.toLowerCase() === normalizedEmail && item.role === payload.role
    )

    if (exists) {
      return { ok: false, message: 'Já existe uma conta com este email para este perfil.' }
    }

    const now = new Date().toISOString()
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
      createdAt: now,
      statusHistory: [
        {
          status: payload.role === 'cliente' ? 'ativo' : 'pendente',
          changedAt: now,
          note:
            payload.role === 'cliente'
              ? 'Conta ativada automaticamente para cliente.'
              : 'Conta criada e pendente de validação administrativa.',
        },
      ],
    }

    const nextAccounts = [account, ...accounts]
    persistLocalAccounts(nextAccounts)

    const sessionUser = toSessionUser(account)
    setUser(sessionUser)
    writeSession(sessionUser)

    return { ok: true, message: 'Conta criada com sucesso.', user: sessionUser }
  }

  async function approveAccount(accountId, metadata = {}) {
    if (isSupabaseMode) {
      const result = await updateSupabaseValidationStatus(accountId, 'ativo', {
        adminNote: metadata.adminNote,
        note: metadata.adminNote?.trim() || 'Conta aprovada pela administração.',
      })

      if (!result.ok) {
        return result
      }

      const nextAccounts = await refreshSupabaseAccounts()
      await syncSessionUserFromAccounts(nextAccounts)
      return { ok: true }
    }

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
        statusHistory: [
          ...(account.statusHistory || []),
          {
            status: 'ativo',
            changedAt: new Date().toISOString(),
            note: metadata.adminNote?.trim() || 'Conta aprovada pela administração.',
          },
        ],
      }

      return approvedUser
    })

    persistLocalAccounts(nextAccounts)

    if (user?.id === accountId && approvedUser) {
      const nextSessionUser = toSessionUser(approvedUser)
      setUser(nextSessionUser)
      writeSession(nextSessionUser)
    }

    return { ok: true }
  }

  async function rejectAccount(accountId, metadata = {}) {
    if (isSupabaseMode) {
      const result = await updateSupabaseValidationStatus(accountId, 'rejeitado', {
        adminNote: metadata.adminNote,
        rejectionReason: metadata.rejectionReason,
        note:
          metadata.rejectionReason?.trim() ||
          metadata.adminNote?.trim() ||
          'Conta rejeitada pela administração.',
      })

      if (!result.ok) {
        return result
      }

      const nextAccounts = await refreshSupabaseAccounts()
      await syncSessionUserFromAccounts(nextAccounts)
      return { ok: true }
    }

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
        statusHistory: [
          ...(account.statusHistory || []),
          {
            status: 'rejeitado',
            changedAt: new Date().toISOString(),
            note:
              metadata.rejectionReason?.trim() ||
              metadata.adminNote?.trim() ||
              'Conta rejeitada pela administração.',
          },
        ],
      }

      return rejectedUser
    })

    persistLocalAccounts(nextAccounts)

    if (user?.id === accountId && rejectedUser) {
      const nextSessionUser = toSessionUser(rejectedUser)
      setUser(nextSessionUser)
      writeSession(nextSessionUser)
    }

    return { ok: true }
  }

  async function deactivateAccount(accountId, metadata = {}) {
    if (isSupabaseMode) {
      const result = await updateSupabaseValidationStatus(accountId, 'inativo', {
        adminNote: metadata.adminNote,
        note: metadata.adminNote?.trim() || 'Conta desativada pela administração.',
      })

      if (!result.ok) {
        return result
      }

      const nextAccounts = await refreshSupabaseAccounts()
      await syncSessionUserFromAccounts(nextAccounts)
      return { ok: true }
    }

    let updatedUser = null

    const nextAccounts = accounts.map((account) => {
      if (account.id !== accountId) {
        return account
      }

      updatedUser = {
        ...account,
        validationStatus: 'inativo',
        adminNote: metadata.adminNote?.trim() || account.adminNote || '',
        statusHistory: [
          ...(account.statusHistory || []),
          {
            status: 'inativo',
            changedAt: new Date().toISOString(),
            note: metadata.adminNote?.trim() || 'Conta desativada pela administração.',
          },
        ],
      }

      return updatedUser
    })

    persistLocalAccounts(nextAccounts)

    if (user?.id === accountId && updatedUser) {
      const nextSessionUser = toSessionUser(updatedUser)
      setUser(nextSessionUser)
      writeSession(nextSessionUser)
    }

    return { ok: true }
  }

  async function reactivateAccount(accountId, metadata = {}) {
    if (isSupabaseMode) {
      const result = await updateSupabaseValidationStatus(accountId, 'ativo', {
        adminNote: metadata.adminNote,
        note: metadata.adminNote?.trim() || 'Conta reativada pela administração.',
      })

      if (!result.ok) {
        return result
      }

      const nextAccounts = await refreshSupabaseAccounts()
      await syncSessionUserFromAccounts(nextAccounts)
      return { ok: true }
    }

    let updatedUser = null

    const nextAccounts = accounts.map((account) => {
      if (account.id !== accountId) {
        return account
      }

      updatedUser = {
        ...account,
        validationStatus: 'ativo',
        adminNote: metadata.adminNote?.trim() || account.adminNote || '',
        statusHistory: [
          ...(account.statusHistory || []),
          {
            status: 'ativo',
            changedAt: new Date().toISOString(),
            note: metadata.adminNote?.trim() || 'Conta reativada pela administração.',
          },
        ],
      }

      return updatedUser
    })

    persistLocalAccounts(nextAccounts)

    if (user?.id === accountId && updatedUser) {
      const nextSessionUser = toSessionUser(updatedUser)
      setUser(nextSessionUser)
      writeSession(nextSessionUser)
    }

    return { ok: true }
  }

  async function deleteAccount(accountId) {
    if (isSupabaseMode) {
      const result = await deleteSupabaseAccount(accountId)

      if (!result.ok) {
        return result
      }

      const nextAccounts = await refreshSupabaseAccounts()
      await syncSessionUserFromAccounts(nextAccounts)
      return { ok: true }
    }

    const nextAccounts = accounts.filter((account) => account.id !== accountId)
    persistLocalAccounts(nextAccounts)

    if (user?.id === accountId) {
      setUser(null)
      clearSession()
    }

    return { ok: true }
  }

  async function login(identifier, password, role) {
    if (isSupabaseMode) {
      const result = await loginWithSupabase(identifier, password, role)

      if (!result.ok) {
        return result
      }

      setUser(result.user)
      await refreshSupabaseAccounts()
      return result
    }

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

    const sessionUser = toSessionUser(account)
    setUser(sessionUser)
    writeSession(sessionUser)

    return { ok: true, message: 'Sessão iniciada.', user: sessionUser }
  }

  async function logout() {
    if (isSupabaseMode) {
      await logoutSupabase()
    }

    setUser(null)
    clearSession()
  }

  async function updateAccountReview(accountId, metadata = {}) {
    if (isSupabaseMode) {
      const result = await updateSupabaseReview(accountId, {
        adminNote: metadata.adminNote,
        rejectionReason: metadata.rejectionReason,
      })

      if (!result.ok) {
        return result
      }

      const nextAccounts = await refreshSupabaseAccounts()
      await syncSessionUserFromAccounts(nextAccounts)
      return { ok: true }
    }

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

    persistLocalAccounts(nextAccounts)
    return { ok: true }
  }

  const value = {
    user,
    isAuthenticated: Boolean(user),
    authReady,
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
    authMode: isSupabaseMode ? 'supabase' : 'local',
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de AuthProvider')
  }
  return context
}
