import { useState, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'

const roleCards = [
  {
    value: 'cliente',
    label: 'Sou cliente',
    description: 'Quero encontrar e contratar serviços verificados perto de mim.',
    docRequired: false,
  },
  {
    value: 'prestador',
    label: 'Sou prestador',
    description: 'Ofereço serviços e quero um perfil verificado com visibilidade no mercado.',
    docRequired: true,
    docLabel: 'Bilhete de Identidade ou documento de atividade',
    docHint:
      'Para prestadores informais, o Bilhete de Identidade é suficiente. Para atividade registada, pode enviar o documento de atividade comercial.',
  },
  {
    value: 'empresa',
    label: 'Sou empresa',
    description: 'Represento uma empresa e queremos publicar os nossos serviços na plataforma.',
    docRequired: true,
    docLabel: 'Alvará Comercial',
    docHint:
      'Submeta o Alvará Comercial ou a Certidão de Registo Comercial da empresa. O perfil será validado em até 48 horas úteis.',
  },
]

function IconPerson() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="h-6 w-6">
      <path d="M12 12a5 5 0 1 0 0-10 5 5 0 0 0 0 10Zm0 2c-5.3 0-8 2.7-8 4v1h16v-1c0-1.3-2.7-4-8-4Z" />
    </svg>
  )
}

function IconWrench() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="h-6 w-6">
      <path d="M15.5 2.1a5.5 5.5 0 0 0-5.3 6.9L3 16.2A2.8 2.8 0 0 0 7 20l7.2-7.2a5.5 5.5 0 0 0 5.3-7.5l-2.8 2.8-2-2 2.8-2.8c-.7-.8-1.3-1.2-2-1.2Z" />
    </svg>
  )
}

function IconBuilding() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="h-6 w-6">
      <path d="M3 21V3h12v3h3v15H3Zm2-2h4v-3H5v3Zm0-5h4v-3H5v3Zm0-5h4V7H5v2Zm6 10h4v-3h-4v3Zm0-5h4v-3h-4v3Zm0-5h4V7h-4v2Zm6 10h2v-7h-2v7Z" />
    </svg>
  )
}

function IconUpload() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="h-5 w-5">
      <path d="M19.35 10.04A7.49 7.49 0 0 0 12 4C9.11 4 6.6 5.64 5.35 8.04A5.994 5.994 0 0 0 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96ZM14 13v4h-4v-4H7l5-5 5 5h-3Z" />
    </svg>
  )
}

function IconSpark() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5">
      <path
        d="M12 2 9.2 9.2 2 12l7.2 2.8L12 22l2.8-7.2L22 12l-7.2-2.8L12 2Z"
        fill="currentColor"
      />
    </svg>
  )
}

function IconCheckCircle() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="h-8 w-8">
      <path d="M20 12a8 8 0 1 1-16 0 8 8 0 0 1 16 0Zm-9.1 3.8L7.5 12.4l1.4-1.4 2 2 4.7-4.7 1.4 1.4-6.1 6.1Z" />
    </svg>
  )
}

const roleIcons = {
  cliente: <IconPerson />,
  prestador: <IconWrench />,
  empresa: <IconBuilding />,
}

export default function RegisterPage() {
  const { registerAccount } = useAuth()
  const navigate = useNavigate()
  const fileRef = useRef(null)

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'cliente',
    nif: '',
    phone: '',
    publicEmail: '',
    whatsapp: '',
    website: '',
  })
  const [documentFile, setDocumentFile] = useState(null)
  const [feedback, setFeedback] = useState('')
  const [registered, setRegistered] = useState(false)
  const [registeredRole, setRegisteredRole] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const selectedRole = roleCards.find((r) => r.value === form.role)

  function updateField(field, value) {
    setForm((current) => ({ ...current, [field]: value }))
    if (field === 'role') {
      setDocumentFile(null)
      setFeedback('')
    }
  }

  function handleDocChange(event) {
    const file = event.target.files?.[0]
    if (!file) return
    const allowed = ['image/jpeg', 'image/png', 'application/pdf']
    if (!allowed.includes(file.type)) {
      setFeedback('Formato não suportado. Use PDF, JPG ou PNG.')
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      setFeedback('Ficheiro demasiado grande. Máximo 5 MB.')
      return
    }
    setFeedback('')
    setDocumentFile(file)
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setFeedback('')

    if (form.password !== form.confirmPassword) {
      setFeedback('A confirmação de senha não corresponde à senha indicada.')
      return
    }
    if (form.role === 'empresa' && !form.nif.trim()) {
      setFeedback('Por favor indique o NIF da empresa.')
      return
    }
    if (selectedRole.docRequired && !form.phone.trim()) {
      setFeedback('Prestadores e empresas devem indicar um número de telefone principal.')
      return
    }
    if (selectedRole.docRequired && !documentFile) {
      setFeedback(`Por favor carregue o documento requerido: ${selectedRole.docLabel}.`)
      return
    }

    setIsSubmitting(true)

    const result = await registerAccount({
      ...form,
      documentRef: documentFile ? documentFile.name : null,
    })

    if (!result.ok) {
      setFeedback(result.message)
      setIsSubmitting(false)
      return
    }

    setRegisteredRole(form.role)
    setRegistered(true)

    if (form.role === 'cliente') {
      setTimeout(() => navigate('/app'), 1500)
    }

    setIsSubmitting(false)
  }

  // --- Ecrã de sucesso para cliente ---
  if (registered && registeredRole === 'cliente') {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[var(--surface)] px-6 py-14">
        <div className="mx-auto w-full max-w-lg rounded-[2rem] border border-white/70 bg-white p-10 text-center shadow-[0_24px_60px_rgba(8,42,51,0.1)]">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-[var(--accent-lt)] text-[var(--accent)]">
            <IconCheckCircle />
          </div>
          <h1 className="font-display text-4xl leading-[1.08] text-[var(--brand)]">
            Bem-vindo ao Linium!
          </h1>
          <p className="mt-4 text-base leading-7 text-slate-600">
            A tua conta de cliente foi criada com sucesso. A redirecionar para a tua área...
          </p>
        </div>
      </main>
    )
  }

  // --- Ecrã pendente para prestador/empresa ---
  if (registered) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[var(--surface)] px-6 py-14">
        <div className="mx-auto w-full max-w-2xl rounded-[2rem] border border-white/70 bg-white p-10 shadow-[0_24px_60px_rgba(8,42,51,0.1)]">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--accent-lt)] text-[var(--accent)]">
            <IconCheckCircle />
          </div>
          <p className="mt-6 text-xs font-semibold uppercase tracking-[0.22em] text-[var(--accent)]">
            Registo recebido
          </p>
          <h1 className="mt-3 font-display text-4xl leading-[1.08] text-[var(--brand)] sm:text-5xl">
            Documento em análise
          </h1>
          <p className="mt-5 text-base leading-8 text-slate-600">
            Recebemos o teu pedido de registo e os documentos submetidos. A nossa equipa ira
            verificar as informações e ativar o teu perfil em breve. Receberás um email de
            confirmação quando a conta estiver ativa.
          </p>

          <div className="mt-8 rounded-[1.5rem] border border-[var(--border)] bg-[var(--surface)] p-6">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--brand)]">
              O que acontece a seguir
            </p>
            <ol className="mt-5 space-y-4">
              {[
                'A nossa equipa analisa o documento submetido (24 a 48 horas úteis).',
                'Receberás um email com a confirmação da ativação da tua conta.',
                'Acedes ao painel, completas o teu perfil e começas a receber contactos de clientes.',
              ].map((step, index) => (
                <li key={index} className="flex items-start gap-4 text-sm leading-7 text-slate-600">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-xl bg-[var(--accent-lt)] text-xs font-bold text-[var(--accent)]">
                    {index + 1}
                  </span>
                  {step}
                </li>
              ))}
            </ol>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/entrar"
              className="inline-flex items-center rounded-xl bg-[var(--accent)] px-5 py-3 text-sm font-semibold uppercase tracking-[0.14em] text-white"
            >
              Acompanhar estado da conta
            </Link>
            <Link
              to="/"
              className="inline-flex items-center rounded-xl border border-[var(--border)] px-5 py-3 text-sm font-semibold text-[var(--brand)]"
            >
              Voltar ao início
            </Link>
          </div>
        </div>
      </main>
    )
  }

  // --- Formulario principal ---
  return (
    <main className="min-h-screen bg-[var(--surface)] px-6 py-14">
      <div className="mx-auto w-full max-w-4xl">
        <div className="mb-8 flex items-center gap-4">
          <Link to="/" className="flex items-center gap-3 no-underline">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[linear-gradient(135deg,var(--brand),var(--accent))] text-white">
              <IconSpark />
            </div>
            <span className="text-base font-bold uppercase tracking-[0.22em] text-[var(--brand)]">
              Linium
            </span>
          </Link>
        </div>

        <div className="rounded-[2rem] border border-[var(--border)] bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(212,237,247,0.42))] p-8 shadow-[0_24px_60px_rgba(8,42,51,0.1)] lg:p-10">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--accent)]">
            Criar conta
          </p>
          <h1 className="mt-3 font-display text-4xl leading-[1.06] text-[var(--brand)] sm:text-5xl">
            Entra no Linium
          </h1>
          <p className="mt-3 max-w-2xl text-base leading-7 text-slate-600">
            Cria a tua conta gratuita. Clientes entram de imediato. Prestadores e empresas passam
            por uma verificação rápida de documentos para garantir a confiança da plataforma.
          </p>

          {/* Seletor de perfil */}
          <div className="mt-8">
            <p className="mb-4 text-sm font-semibold text-slate-700">Como vais usar o Linium?</p>
            <div className="grid gap-4 sm:grid-cols-3">
              {roleCards.map((role) => (
                <button
                  key={role.value}
                  type="button"
                  onClick={() => updateField('role', role.value)}
                  className={`flex flex-col rounded-[1.5rem] border-2 p-5 text-left transition ${
                    form.role === role.value
                      ? 'border-[var(--accent)] bg-[var(--accent-lt)] shadow-[0_12px_30px_rgba(11,144,196,0.18)]'
                      : 'border-[var(--border)] bg-white hover:border-[var(--accent)]/50'
                  }`}
                >
                  <span
                    className={`flex h-11 w-11 items-center justify-center rounded-2xl transition ${
                      form.role === role.value
                        ? 'bg-[var(--accent)] text-white'
                        : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    {roleIcons[role.value]}
                  </span>
                  <span className="mt-4 text-base font-semibold text-[var(--brand)]">
                    {role.label}
                  </span>
                  <span className="mt-2 text-sm leading-6 text-slate-500">{role.description}</span>
                  {role.docRequired && (
                    <span className="mt-4 inline-block rounded-full bg-orange-100 px-3 py-1 text-xs font-semibold text-orange-700">
                      Requer verificação documental
                    </span>
                  )}
                </button>
              ))}
                  disabled={isSubmitting}
            </div>
          </div>
                  {isSubmitting ? 'A criar conta...' : 'Criar conta'}
          {/* Campos do formulario */}
          <form className="mt-8" onSubmit={handleSubmit}>
            <div className="grid gap-5 md:grid-cols-2">
              <label className="block md:col-span-2">
                <span className="mb-2 block text-sm font-medium text-slate-700">
                  {form.role === 'empresa' ? 'Nome da empresa ou responsavel' : 'Nome completo'}
                </span>
                <input
                  type="text"
                  value={form.name}
                  onChange={(event) => updateField('name', event.target.value)}
                  className="w-full rounded-xl border border-[var(--border)] px-4 py-3 outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/15"
                  required
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-medium text-slate-700">Email de acesso</span>
                <input
                  type="email"
                  value={form.email}
                  onChange={(event) => updateField('email', event.target.value)}
                  className="w-full rounded-xl border border-[var(--border)] px-4 py-3 outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/15"
                  required
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-medium text-slate-700">Senha</span>
                <input
                  type="password"
                  value={form.password}
                  onChange={(event) => updateField('password', event.target.value)}
                  className="w-full rounded-xl border border-[var(--border)] px-4 py-3 outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/15"
                  required
                  minLength={6}
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-medium text-slate-700">Confirmar senha</span>
                <input
                  type="password"
                  value={form.confirmPassword}
                  onChange={(event) => updateField('confirmPassword', event.target.value)}
                  className="w-full rounded-xl border border-[var(--border)] px-4 py-3 outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/15"
                  required
                  minLength={6}
                />
              </label>

              {form.role === 'empresa' ? (
                <label className="block md:col-span-2">
                  <span className="mb-2 block text-sm font-medium text-slate-700">NIF da empresa</span>
                  <input
                    type="text"
                    value={form.nif}
                    onChange={(event) => updateField('nif', event.target.value)}
                    className="w-full rounded-xl border border-[var(--border)] px-4 py-3 outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/15"
                    placeholder="Introduz o NIF da empresa"
                    required
                  />
                </label>
              ) : null}

              {selectedRole.docRequired ? (
                <>
                  <label className="block md:col-span-2">
                    <span className="mb-2 block text-sm font-medium text-slate-700">Número de telefone</span>
                    <input
                      type="tel"
                      value={form.phone}
                      onChange={(event) => updateField('phone', event.target.value)}
                      className="w-full rounded-xl border border-[var(--border)] px-4 py-3 outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/15"
                      placeholder="Ex.: +244 923 000 000"
                      required
                    />
                  </label>

                  <label className="block">
                    <span className="mb-2 block text-sm font-medium text-slate-700">Email público (opcional)</span>
                    <input
                      type="email"
                      value={form.publicEmail}
                      onChange={(event) => updateField('publicEmail', event.target.value)}
                      className="w-full rounded-xl border border-[var(--border)] px-4 py-3 outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/15"
                      placeholder="Email visível no perfil público"
                    />
                  </label>

                  <label className="block">
                    <span className="mb-2 block text-sm font-medium text-slate-700">WhatsApp (opcional)</span>
                    <input
                      type="tel"
                      value={form.whatsapp}
                      onChange={(event) => updateField('whatsapp', event.target.value)}
                      className="w-full rounded-xl border border-[var(--border)] px-4 py-3 outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/15"
                      placeholder="Número de WhatsApp"
                    />
                  </label>

                  <label className="block md:col-span-2">
                    <span className="mb-2 block text-sm font-medium text-slate-700">Website (opcional)</span>
                    <input
                      type="url"
                      value={form.website}
                      onChange={(event) => updateField('website', event.target.value)}
                      className="w-full rounded-xl border border-[var(--border)] px-4 py-3 outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/15"
                      placeholder="https://www.teusite.com"
                    />
                  </label>
                </>
              ) : null}
            </div>

            {/* Upload de documento - apenas para prestador/empresa */}
            {selectedRole.docRequired && (
              <div className="mt-8 rounded-[1.5rem] border border-orange-200 bg-orange-50/65 p-6">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-orange-700">
                  Verificação obrigatória
                </p>
                <h3 className="mt-2 text-lg font-semibold text-[var(--brand)]">
                  {selectedRole.docLabel}
                </h3>
                <p className="mt-2 text-sm leading-7 text-slate-600">{selectedRole.docHint}</p>

                <input
                  ref={fileRef}
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={handleDocChange}
                  className="hidden"
                />

                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  className={`mt-5 flex items-center gap-3 rounded-xl border-2 border-dashed px-5 py-4 text-sm font-semibold transition ${
                    documentFile
                      ? 'border-[var(--accent)] bg-[var(--accent-lt)] text-[var(--accent)]'
                      : 'border-orange-300 bg-white text-orange-700 hover:border-orange-500'
                  }`}
                >
                  <IconUpload />
                  {documentFile
                    ? `Documento carregado: ${documentFile.name}`
                    : 'Carregar documento (PDF, JPG ou PNG - max. 5 MB)'}
                </button>

                <p className="mt-3 text-xs leading-6 text-slate-500">
                  O teu documento será analisado pela equipa Linium. O perfil ficará inativo até a
                  validação ser concluída.
                </p>
              </div>
            )}

            {feedback ? <p className="mt-5 text-sm text-red-600">{feedback}</p> : null}

            <div className="mt-7 flex flex-wrap gap-3">
              <button
                type="submit"
                className="rounded-xl bg-[var(--accent)] px-6 py-3 text-sm font-semibold uppercase tracking-[0.14em] text-white transition hover:bg-[var(--brand-mid)]"
              >
                {selectedRole.docRequired ? 'Submeter pedido de registo' : 'Criar conta'}
              </button>
              <Link
                to="/entrar"
                className="rounded-xl border border-[var(--border)] px-6 py-3 text-sm font-semibold text-[var(--brand)]"
              >
                Já tenho conta
              </Link>
            </div>
          </form>
        </div>
      </div>
    </main>
  )
}
