import { supabase } from '../supabase/client'

const PROFILES_TABLE = 'profiles'

function normalizeProfile(row) {
  return {
    id: row.id,
    name: row.name,
    username: row.username || null,
    email: row.email,
    password: null,
    role: row.role,
    nif: row.nif || null,
    phone: row.phone || null,
    publicEmail: row.public_email || null,
    whatsapp: row.whatsapp || null,
    website: row.website || null,
    adminNote: row.admin_note || '',
    rejectionReason: row.rejection_reason || '',
    documentRef: row.document_ref || null,
    validationStatus: row.validation_status,
    createdAt: row.created_at,
    statusHistory: row.status_history || [],
    authUserId: row.auth_user_id || null,
  }
}

function toSessionUser(profile) {
  return {
    id: profile.id,
    name: profile.name,
    email: profile.email,
    role: profile.role,
    validationStatus: profile.validationStatus,
  }
}

function ensureSupabase() {
  if (!supabase) {
    return {
      ok: false,
      message:
        'Supabase não configurado. Define VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY no .env.',
    }
  }

  return { ok: true }
}

export async function fetchSupabaseAccounts() {
  const check = ensureSupabase()
  if (!check.ok) {
    return { ok: false, message: check.message, accounts: [] }
  }

  const { data, error } = await supabase
    .from(PROFILES_TABLE)
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    return { ok: false, message: error.message, accounts: [] }
  }

  return { ok: true, accounts: (data || []).map(normalizeProfile) }
}

export async function getSupabaseSessionProfile() {
  const check = ensureSupabase()
  if (!check.ok) {
    return { ok: false, message: check.message, user: null }
  }

  const {
    data: { session },
    error: sessionError,
  } = await supabase.auth.getSession()

  if (sessionError || !session?.user?.id) {
    return { ok: true, user: null }
  }

  const { data: profile, error: profileError } = await supabase
    .from(PROFILES_TABLE)
    .select('*')
    .eq('auth_user_id', session.user.id)
    .single()

  if (profileError || !profile) {
    return { ok: true, user: null }
  }

  return { ok: true, user: toSessionUser(normalizeProfile(profile)) }
}

export async function registerWithSupabase(payload) {
  const check = ensureSupabase()
  if (!check.ok) {
    return { ok: false, message: check.message }
  }

  const normalizedEmail = payload.email.trim().toLowerCase()

  const { data: authData, error: authError } = await supabase.auth.signUp({
    email: normalizedEmail,
    password: payload.password,
    options: {
      data: {
        name: payload.name.trim(),
        role: payload.role,
      },
    },
  })

  if (authError) {
    return { ok: false, message: authError.message }
  }

  const authUserId = authData.user?.id || null
  const now = new Date().toISOString()
  const initialStatus = payload.role === 'cliente' ? 'ativo' : 'pendente'

  const profileInsert = {
    auth_user_id: authUserId,
    name: payload.name.trim(),
    username: null,
    email: normalizedEmail,
    role: payload.role,
    nif: payload.nif?.trim() || null,
    phone: payload.phone?.trim() || null,
    public_email: payload.publicEmail?.trim() || null,
    whatsapp: payload.whatsapp?.trim() || null,
    website: payload.website?.trim() || null,
    admin_note: '',
    rejection_reason: '',
    document_ref: payload.documentRef || null,
    validation_status: initialStatus,
    created_at: now,
    status_history: [
      {
        status: initialStatus,
        changedAt: now,
        note:
          payload.role === 'cliente'
            ? 'Conta ativada automaticamente para cliente.'
            : 'Conta criada e pendente de validação administrativa.',
      },
    ],
  }

  const { data: profileData, error: profileError } = await supabase
    .from(PROFILES_TABLE)
    .insert(profileInsert)
    .select('*')
    .single()

  if (profileError) {
    return { ok: false, message: profileError.message }
  }

  // Se existir utilizador de auth, tenta autenticar para criar sessão local imediata.
  if (normalizedEmail && payload.password) {
    await supabase.auth.signInWithPassword({
      email: normalizedEmail,
      password: payload.password,
    })
  }

  const profile = normalizeProfile(profileData)
  return { ok: true, message: 'Conta criada com sucesso.', user: toSessionUser(profile) }
}

export async function loginWithSupabase(identifier, password, role) {
  const check = ensureSupabase()
  if (!check.ok) {
    return { ok: false, message: check.message }
  }

  const normalizedIdentifier = identifier.trim().toLowerCase()

  let email = normalizedIdentifier

  if (!normalizedIdentifier.includes('@')) {
    const { data: userByUsername, error: usernameError } = await supabase
      .from(PROFILES_TABLE)
      .select('email')
      .eq('username', normalizedIdentifier)
      .single()

    if (usernameError || !userByUsername?.email) {
      return { ok: false, message: 'Credenciais inválidas.' }
    }

    email = userByUsername.email
  }

  const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (signInError || !signInData.user?.id) {
    return { ok: false, message: 'Credenciais inválidas.' }
  }

  const { data: profile, error: profileError } = await supabase
    .from(PROFILES_TABLE)
    .select('*')
    .eq('auth_user_id', signInData.user.id)
    .eq('role', role)
    .single()

  if (profileError || !profile) {
    await supabase.auth.signOut()
    return { ok: false, message: 'Perfil não corresponde ao papel selecionado.' }
  }

  const normalizedProfile = normalizeProfile(profile)

  return {
    ok: true,
    message: 'Sessão iniciada.',
    user: toSessionUser(normalizedProfile),
  }
}

export async function logoutSupabase() {
  const check = ensureSupabase()
  if (!check.ok) {
    return { ok: false, message: check.message }
  }

  const { error } = await supabase.auth.signOut()

  if (error) {
    return { ok: false, message: error.message }
  }

  return { ok: true }
}

export async function updateSupabaseReview(accountId, metadata = {}) {
  const check = ensureSupabase()
  if (!check.ok) {
    return { ok: false, message: check.message }
  }

  const payload = {
    admin_note: metadata.adminNote !== undefined ? metadata.adminNote.trim() : undefined,
    rejection_reason:
      metadata.rejectionReason !== undefined ? metadata.rejectionReason.trim() : undefined,
  }

  const { error } = await supabase.from(PROFILES_TABLE).update(payload).eq('id', accountId)

  if (error) {
    return { ok: false, message: error.message }
  }

  return { ok: true }
}

export async function updateSupabaseValidationStatus(accountId, status, metadata = {}) {
  const check = ensureSupabase()
  if (!check.ok) {
    return { ok: false, message: check.message }
  }

  const { data: profile, error: fetchError } = await supabase
    .from(PROFILES_TABLE)
    .select('status_history')
    .eq('id', accountId)
    .single()

  if (fetchError) {
    return { ok: false, message: fetchError.message }
  }

  const statusHistory = [...(profile?.status_history || [])]
  statusHistory.push({
    status,
    changedAt: new Date().toISOString(),
    note: metadata.note || metadata.adminNote || 'Estado atualizado pela administração.',
  })

  const payload = {
    validation_status: status,
    admin_note: metadata.adminNote !== undefined ? metadata.adminNote.trim() : undefined,
    rejection_reason:
      metadata.rejectionReason !== undefined ? metadata.rejectionReason.trim() : undefined,
    status_history: statusHistory,
  }

  const { error } = await supabase.from(PROFILES_TABLE).update(payload).eq('id', accountId)

  if (error) {
    return { ok: false, message: error.message }
  }

  return { ok: true }
}

export async function deleteSupabaseAccount(accountId) {
  const check = ensureSupabase()
  if (!check.ok) {
    return { ok: false, message: check.message }
  }

  const { error } = await supabase.from(PROFILES_TABLE).delete().eq('id', accountId)

  if (error) {
    return { ok: false, message: error.message }
  }

  return { ok: true }
}
