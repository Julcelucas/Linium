import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'

const roleLabels = {
  admin: 'Administração',
  cliente: 'Cliente',
  prestador: 'Prestador',
  empresa: 'Empresa',
}

function formatDate(value) {
  return new Intl.DateTimeFormat('pt-PT', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(value))
}

export default function AdminPage() {
  const {
    accounts,
    approveAccount,
    deactivateAccount,
    deleteAccount,
    rejectAccount,
    reactivateAccount,
    updateAccountReview,
    logout,
  } = useAuth()
  const [statusFilter, setStatusFilter] = useState('todos')
  const [selectedAccountId, setSelectedAccountId] = useState(null)
  const [isDetailOpen, setIsDetailOpen] = useState(false)
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false)
  const [adminNoteDraft, setAdminNoteDraft] = useState('')
  const [rejectionReasonDraft, setRejectionReasonDraft] = useState('')

  const nonAdminAccounts = accounts.filter((account) => account.role !== 'admin')
  const duplicateEmailMap = nonAdminAccounts.reduce((accumulator, account) => {
    const key = account.email.toLowerCase()
    accumulator[key] = [...(accumulator[key] || []), account]
    return accumulator
  }, {})
  const duplicatedEmailGroups = Object.values(duplicateEmailMap).filter((group) => group.length > 1)
  const pendingAccounts = nonAdminAccounts.filter((account) => account.validationStatus === 'pendente')
  const clients = nonAdminAccounts.filter((account) => account.role === 'cliente')
  const providers = nonAdminAccounts.filter((account) => account.role === 'prestador')
  const companies = nonAdminAccounts.filter((account) => account.role === 'empresa')
  const activeAccounts = nonAdminAccounts.filter((account) => account.validationStatus === 'ativo')
  const inactiveAccounts = nonAdminAccounts.filter((account) => account.validationStatus === 'inativo')
  const recentAccounts = [...nonAdminAccounts]
    .sort((left, right) => new Date(right.createdAt) - new Date(left.createdAt))
    .slice(0, 6)
  const selectedAccount = nonAdminAccounts.find((account) => account.id === selectedAccountId) || null
  const visibleAccounts = useMemo(() => {
    if (statusFilter === 'todos') {
      return nonAdminAccounts
    }

    return nonAdminAccounts.filter((account) => account.validationStatus === statusFilter)
  }, [nonAdminAccounts, statusFilter])

  useEffect(() => {
    if (selectedAccountId && nonAdminAccounts.some((account) => account.id === selectedAccountId)) {
      return
    }

    const fallbackAccount = pendingAccounts[0] || visibleAccounts[0] || nonAdminAccounts[0] || null
    setSelectedAccountId(fallbackAccount ? fallbackAccount.id : null)
  }, [nonAdminAccounts, pendingAccounts, selectedAccountId, visibleAccounts])

  useEffect(() => {
    if (!selectedAccount) {
      setAdminNoteDraft('')
      setRejectionReasonDraft('')
      return
    }

    setAdminNoteDraft(selectedAccount.adminNote || '')
    setRejectionReasonDraft(selectedAccount.rejectionReason || '')
  }, [selectedAccount])

  function handleSelectAccount(accountId) {
    setSelectedAccountId(accountId)
  }

  function handleOpenDetail(accountId) {
    setSelectedAccountId(accountId)
    setIsDetailOpen(true)
  }

  function handleCloseDetail() {
    setIsDetailOpen(false)
    setIsDeleteConfirmOpen(false)
  }

  function handleApprove(accountId) {
    approveAccount(accountId, { adminNote: adminNoteDraft })
  }

  function handleReject(accountId) {
    rejectAccount(accountId, {
      adminNote: adminNoteDraft,
      rejectionReason: rejectionReasonDraft,
    })
  }

  function handleSaveReview(accountId) {
    updateAccountReview(accountId, {
      adminNote: adminNoteDraft,
      rejectionReason: rejectionReasonDraft,
    })
  }

  const overview = [
    {
      label: 'Perfis registados',
      value: nonAdminAccounts.length,
      tone: 'border-orange-100 bg-orange-50/75 text-orange-700',
    },
    {
      label: 'Clientes',
      value: clients.length,
      tone: 'border-sky-100 bg-sky-50/75 text-sky-700',
    },
    {
      label: 'Prestadores',
      value: providers.length,
      tone: 'border-emerald-100 bg-emerald-50/75 text-emerald-700',
    },
    {
      label: 'Empresas',
      value: companies.length,
      tone: 'border-violet-100 bg-violet-50/75 text-violet-700',
    },
    {
      label: 'Pendentes',
      value: pendingAccounts.length,
      tone: 'border-amber-100 bg-amber-50/75 text-amber-700',
    },
    {
      label: 'Ativos',
      value: activeAccounts.length,
      tone: 'border-teal-100 bg-teal-50/75 text-teal-700',
    },
    {
      label: 'Inativos',
      value: inactiveAccounts.length,
      tone: 'border-slate-200 bg-slate-100/90 text-slate-700',
    },
    {
      label: 'Emails partilhados',
      value: duplicatedEmailGroups.length,
      tone: 'border-rose-100 bg-rose-50/75 text-rose-700',
    },
  ]

  return (
    <main className="min-h-screen bg-[var(--surface)] px-6 py-12">
      <div className="mx-auto w-full max-w-7xl space-y-8">
        <section className="rounded-[2rem] border border-[var(--border)] bg-[linear-gradient(135deg,rgba(8,42,51,0.98),rgba(11,94,130,0.94),rgba(255,122,26,0.88))] p-8 text-white shadow-[0_28px_70px_rgba(8,42,51,0.2)] lg:p-10">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/70">
                Administração do site
              </p>
              <h1 className="mt-4 font-display text-4xl leading-[1.05] sm:text-5xl">
                Centro de controlo do Linium
              </h1>
              <p className="mt-4 max-w-3xl text-base leading-8 text-white/80">
                Esta área concentra aprovação de perfis, leitura do crescimento da plataforma e
                acompanhamento do estado geral do ecossistema registado no site.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                to="/"
                className="inline-flex items-center rounded-full border border-white/20 bg-white/10 px-5 py-3 text-sm font-semibold text-white"
              >
                Ver site
              </Link>
              <button
                type="button"
                onClick={logout}
                className="inline-flex items-center rounded-full bg-white px-5 py-3 text-sm font-semibold text-[var(--brand)]"
              >
                Terminar sessão
              </button>
            </div>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {overview.map((item) => (
            <article
              key={item.label}
              className={`rounded-[1.6rem] border p-6 shadow-[0_18px_40px_rgba(8,42,51,0.06)] ${item.tone}`}
            >
              <p className="text-xs font-semibold uppercase tracking-[0.2em]">{item.label}</p>
              <p className="mt-4 text-4xl font-bold leading-none text-[var(--brand)]">{item.value}</p>
            </article>
          ))}
        </section>

        <section className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
          <article className="rounded-[2rem] border border-[var(--border)] bg-white p-7 shadow-[0_18px_45px_rgba(8,42,51,0.06)]">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-orange-600">
                  Aprovações pendentes
                </p>
                <h2 className="mt-2 font-display text-3xl text-[var(--brand)]">
                  Perfis à espera de validação
                </h2>
              </div>
              <span className="rounded-full bg-orange-100 px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-orange-700">
                {pendingAccounts.length} pendente(s)
              </span>
            </div>

            <div className="mt-6 space-y-4">
              {pendingAccounts.length === 0 ? (
                <div className="rounded-[1.4rem] border border-emerald-100 bg-emerald-50/70 p-5 text-sm leading-7 text-emerald-800">
                  Não existem perfis pendentes neste momento.
                </div>
              ) : (
                pendingAccounts.map((account) => (
                  <div
                    key={account.id}
                    className="rounded-[1.5rem] border border-[var(--border)] bg-[var(--surface)] p-5"
                  >
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                          {roleLabels[account.role]} • {formatDate(account.createdAt)}
                        </p>
                        <h3 className="mt-2 text-xl font-semibold text-[var(--brand)]">{account.name}</h3>
                        <div className="mt-3 space-y-2 text-sm leading-7 text-slate-600">
                          <p>Email: {account.email}</p>
                          {duplicateEmailMap[account.email.toLowerCase()]?.length > 1 ? (
                            <p className="font-semibold text-rose-600">
                              Atenção: este email está associado a mais de um perfil.
                            </p>
                          ) : null}
                          {account.nif ? <p>NIF: {account.nif}</p> : null}
                          <p>
                            Documento: {account.documentRef ? account.documentRef : 'Não submetido'}
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-3">
                        <button
                          type="button"
                          onClick={() => handleApprove(account.id)}
                          className="inline-flex items-center rounded-xl bg-[var(--accent)] px-5 py-3 text-sm font-semibold uppercase tracking-[0.12em] text-white"
                        >
                          Aprovar perfil
                        </button>
                        <button
                          type="button"
                          onClick={() => handleReject(account.id)}
                          className="inline-flex items-center rounded-xl bg-red-600 px-5 py-3 text-sm font-semibold uppercase tracking-[0.12em] text-white"
                        >
                          Rejeitar
                        </button>
                        <button
                          type="button"
                          onClick={() => handleOpenDetail(account.id)}
                          className="inline-flex items-center rounded-xl border border-[var(--border)] bg-white px-5 py-3 text-sm font-semibold text-[var(--brand)]"
                        >
                          Ver detalhe
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </article>

          <div className="space-y-6">
            <article className="rounded-[2rem] border border-[var(--border)] bg-white p-7 shadow-[0_18px_45px_rgba(8,42,51,0.06)]">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-sky-600">
                Informações rápidas
              </p>
              <h2 className="mt-2 font-display text-3xl text-[var(--brand)]">Estado do site</h2>
              <ul className="mt-5 space-y-3 text-sm leading-7 text-slate-600">
                <li>Registo público ativo para cliente, prestador e empresa.</li>
                <li>Aprovação manual disponível para perfis profissionais pendentes.</li>
                <li>Autenticação local pronta para testes internos da experiência.</li>
                <li>Leitura imediata do volume total de utilizadores por categoria.</li>
              </ul>
            </article>

            <article className="rounded-[2rem] border border-[var(--border)] bg-white p-7 shadow-[0_18px_45px_rgba(8,42,51,0.06)]">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-sky-600">
                    Filtro administrativo
                  </p>
                  <h2 className="mt-2 font-display text-3xl text-[var(--brand)]">Lista por estado</h2>
                </div>
                <select
                  value={statusFilter}
                  onChange={(event) => setStatusFilter(event.target.value)}
                  className="rounded-xl border border-[var(--border)] px-4 py-3 text-sm text-slate-700 outline-none focus:border-[var(--accent)]"
                >
                  <option value="todos">Todos</option>
                  <option value="ativo">Ativos</option>
                  <option value="inativo">Inativos</option>
                  <option value="pendente">Pendentes</option>
                  <option value="rejeitado">Rejeitados</option>
                </select>
              </div>
              <div className="mt-5 max-h-[18rem] space-y-3 overflow-auto pr-1">
                {visibleAccounts.map((account) => (
                  <button
                    key={account.id}
                    type="button"
                    onClick={() => handleSelectAccount(account.id)}
                    className={`flex w-full items-center justify-between rounded-[1.2rem] border px-4 py-3 text-left ${
                      selectedAccountId === account.id
                        ? 'border-[var(--accent)] bg-[var(--accent-lt)]/40'
                        : 'border-[var(--border)] bg-[var(--surface)]'
                    }`}
                  >
                    <div>
                      <p className="text-sm font-semibold text-[var(--brand)]">{account.name}</p>
                      <p className="mt-1 text-xs uppercase tracking-[0.16em] text-slate-500">
                        {roleLabels[account.role]}
                      </p>
                    </div>
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-slate-600">
                      {account.validationStatus}
                    </span>
                  </button>
                ))}
              </div>
            </article>

            <article className="rounded-[2rem] border border-[var(--border)] bg-white p-7 shadow-[0_18px_45px_rgba(8,42,51,0.06)]">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-orange-600">
                Registos recentes
              </p>
              <div className="mt-5 space-y-3">
                {recentAccounts.length === 0 ? (
                  <p className="text-sm leading-7 text-slate-600">Ainda não existem registos para mostrar.</p>
                ) : (
                  recentAccounts.map((account) => (
                    <div
                      key={account.id}
                      className="rounded-[1.2rem] border border-[var(--border)] bg-[var(--surface)] px-4 py-3"
                    >
                      <p className="text-sm font-semibold text-[var(--brand)]">{account.name}</p>
                      <p className="mt-1 text-xs uppercase tracking-[0.16em] text-slate-500">
                        {roleLabels[account.role]} • {account.validationStatus}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </article>

            <article className="rounded-[2rem] border border-[var(--border)] bg-white p-7 shadow-[0_18px_45px_rgba(8,42,51,0.06)]">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-rose-600">
                Sinalização de controlo
              </p>
              <h2 className="mt-2 font-display text-3xl text-[var(--brand)]">Emails reutilizados</h2>
              <div className="mt-5 space-y-4">
                {duplicatedEmailGroups.length === 0 ? (
                  <p className="text-sm leading-7 text-slate-600">
                    Não existem emails reutilizados entre perfis neste momento.
                  </p>
                ) : (
                  duplicatedEmailGroups.map((group) => (
                    <div
                      key={group[0].email}
                      className="rounded-[1.2rem] border border-rose-100 bg-rose-50/60 px-4 py-4"
                    >
                      <p className="text-sm font-semibold text-[var(--brand)]">{group[0].email}</p>
                      <p className="mt-1 text-xs uppercase tracking-[0.14em] text-rose-700">
                        {group.length} perfis associados
                      </p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {group.map((account) => (
                          <button
                            key={account.id}
                            type="button"
                            onClick={() => handleOpenDetail(account.id)}
                            className="rounded-full border border-white bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-[var(--brand)]"
                          >
                            {roleLabels[account.role]}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </article>
            <article className="rounded-[2rem] border border-[var(--border)] bg-white p-7 shadow-[0_18px_45px_rgba(8,42,51,0.06)]">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-orange-600">
                Detalhe do perfil
              </p>
              <p className="mt-4 text-sm leading-7 text-slate-600">
                Usa os botões <strong>Ver detalhe</strong> para abrir o perfil numa janela centralizada sem sair desta página.
              </p>
              {selectedAccount ? (
                <div className="mt-5 rounded-[1.2rem] border border-[var(--border)] bg-[var(--surface)] px-4 py-4 text-sm leading-7 text-slate-600">
                  <p><strong className="text-[var(--brand)]">Perfil atual:</strong> {selectedAccount.name}</p>
                  <p><strong className="text-[var(--brand)]">Estado:</strong> {selectedAccount.validationStatus}</p>
                </div>
              ) : null}
            </article>
          </div>
        </section>
      </div>

      {isDetailOpen && selectedAccount ? (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-[rgba(8,42,51,0.52)] px-4 py-8 backdrop-blur-sm">
          <div className="absolute inset-0" onClick={handleCloseDetail} aria-hidden="true" />
          <div className="relative z-[71] max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-[2rem] border border-[var(--border)] bg-white p-7 shadow-[0_30px_80px_rgba(8,42,51,0.24)] lg:p-8">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-orange-600">
                  Detalhe do perfil
                </p>
                <h2 className="mt-2 font-display text-4xl leading-[1.06] text-[var(--brand)]">
                  {selectedAccount.name}
                </h2>
                <p className="mt-2 text-sm uppercase tracking-[0.16em] text-slate-500">
                  {roleLabels[selectedAccount.role]} • {selectedAccount.validationStatus}
                </p>
              </div>

              <button
                type="button"
                onClick={handleCloseDetail}
                className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[var(--border)] bg-white text-xl font-semibold text-[var(--brand)]"
                aria-label="Fechar detalhe"
              >
                ×
              </button>
            </div>

            <div className="mt-6 space-y-3 text-sm leading-7 text-slate-600">
              <p><strong className="text-[var(--brand)]">Perfil:</strong> {roleLabels[selectedAccount.role]}</p>
              <p><strong className="text-[var(--brand)]">Email:</strong> {selectedAccount.email}</p>
              {duplicateEmailMap[selectedAccount.email.toLowerCase()]?.length > 1 ? (
                <p className="font-semibold text-rose-600">
                  Email partilhado com outros perfis. Rever identidade e documentação com atenção.
                </p>
              ) : null}
              <p><strong className="text-[var(--brand)]">Estado:</strong> {selectedAccount.validationStatus}</p>
              <p><strong className="text-[var(--brand)]">Criado em:</strong> {formatDate(selectedAccount.createdAt)}</p>
              {selectedAccount.nif ? <p><strong className="text-[var(--brand)]">NIF:</strong> {selectedAccount.nif}</p> : null}
              {selectedAccount.phone ? <p><strong className="text-[var(--brand)]">Telefone:</strong> {selectedAccount.phone}</p> : null}
              {selectedAccount.publicEmail ? <p><strong className="text-[var(--brand)]">Email público:</strong> {selectedAccount.publicEmail}</p> : null}
              {selectedAccount.whatsapp ? <p><strong className="text-[var(--brand)]">WhatsApp:</strong> {selectedAccount.whatsapp}</p> : null}
              {selectedAccount.website ? <p><strong className="text-[var(--brand)]">Website:</strong> {selectedAccount.website}</p> : null}
              <p><strong className="text-[var(--brand)]">Documento:</strong> {selectedAccount.documentRef || 'Não submetido'}</p>
            </div>

            <div className="mt-6 grid gap-5 lg:grid-cols-2">
              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-[var(--brand)]">Observações internas</span>
                <textarea
                  value={adminNoteDraft}
                  onChange={(event) => setAdminNoteDraft(event.target.value)}
                  rows={5}
                  className="w-full rounded-xl border border-[var(--border)] px-4 py-3 outline-none focus:border-[var(--accent)]"
                  placeholder="Notas internas da equipa de administração"
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-[var(--brand)]">Motivo de rejeição</span>
                <textarea
                  value={rejectionReasonDraft}
                  onChange={(event) => setRejectionReasonDraft(event.target.value)}
                  rows={5}
                  className="w-full rounded-xl border border-[var(--border)] px-4 py-3 outline-none focus:border-[var(--accent)]"
                  placeholder="Explica a razão da rejeição, se aplicável"
                />
              </label>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => handleSaveReview(selectedAccount.id)}
                className="inline-flex items-center rounded-xl border border-[var(--border)] bg-white px-5 py-3 text-sm font-semibold text-[var(--brand)]"
              >
                Guardar observações
              </button>
              <button
                type="button"
                onClick={() => handleApprove(selectedAccount.id)}
                className="inline-flex items-center rounded-xl bg-[var(--accent)] px-5 py-3 text-sm font-semibold uppercase tracking-[0.12em] text-white"
              >
                Aprovar
              </button>
              <button
                type="button"
                onClick={() => handleReject(selectedAccount.id)}
                className="inline-flex items-center rounded-xl bg-red-600 px-5 py-3 text-sm font-semibold uppercase tracking-[0.12em] text-white"
              >
                Rejeitar
              </button>
              {selectedAccount.validationStatus === 'inativo' ? (
                <button
                  type="button"
                  onClick={() => reactivateAccount(selectedAccount.id, { adminNote: adminNoteDraft })}
                  className="inline-flex items-center rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold uppercase tracking-[0.12em] text-white"
                >
                  Reativar
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => deactivateAccount(selectedAccount.id, { adminNote: adminNoteDraft })}
                  className="inline-flex items-center rounded-xl bg-slate-700 px-5 py-3 text-sm font-semibold uppercase tracking-[0.12em] text-white"
                >
                  Colocar inativo
                </button>
              )}
              <button
                type="button"
                onClick={() => setIsDeleteConfirmOpen(true)}
                className="inline-flex items-center rounded-xl border border-red-200 bg-red-50 px-5 py-3 text-sm font-semibold uppercase tracking-[0.12em] text-red-700"
              >
                Eliminar perfil
              </button>
            </div>

            {isDeleteConfirmOpen ? (
              <div className="mt-6 rounded-[1.4rem] border border-red-200 bg-red-50/70 p-5">
                <p className="text-sm font-semibold uppercase tracking-[0.14em] text-red-700">
                  Confirmação necessária
                </p>
                <p className="mt-3 text-sm leading-7 text-slate-700">
                  Tens a certeza de que queres eliminar permanentemente o perfil de{' '}
                  <strong>{selectedAccount.name}</strong>? Esta ação remove o registo da lista do site.
                </p>
                <div className="mt-4 flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      deleteAccount(selectedAccount.id)
                      handleCloseDetail()
                    }}
                    className="inline-flex items-center rounded-xl bg-red-600 px-5 py-3 text-sm font-semibold uppercase tracking-[0.12em] text-white"
                  >
                    Confirmar eliminação
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsDeleteConfirmOpen(false)}
                    className="inline-flex items-center rounded-xl border border-[var(--border)] bg-white px-5 py-3 text-sm font-semibold text-[var(--brand)]"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      ) : null}
    </main>
  )
}