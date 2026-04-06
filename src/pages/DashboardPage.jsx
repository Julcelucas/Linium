import { Link } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'
import {
  clientDashboardItems,
  companyDashboardItems,
  providerDashboardItems,
} from '../data/marketplaceData'

const labels = {
  admin: 'Administração',
  cliente: 'Cliente',
  prestador: 'Prestador individual',
  empresa: 'Empresa',
}

const statusClasses = {
  ativo: 'border-emerald-200 bg-emerald-50 text-emerald-700',
  pendente: 'border-amber-200 bg-amber-50 text-amber-700',
  rejeitado: 'border-red-200 bg-red-50 text-red-700',
  inativo: 'border-slate-300 bg-slate-100 text-slate-700',
}

const dashboardCopy = {
  cliente: {
    eyebrow: 'Dashboard do cliente',
    title: 'Controlo central de pesquisa e contratação.',
    items: clientDashboardItems,
    summary:
      'Acompanha pesquisa, contactos e decisões num único painel com leitura rápida.',
    primaryAction: {
      label: 'Pesquisar serviços',
      to: '/servicos',
    },
  },
  prestador: {
    eyebrow: 'Dashboard do prestador',
    title: 'Gestão operacional da tua presença profissional.',
    items: providerDashboardItems,
    summary:
      'Organiza pedidos, performance e reputação para manter um fluxo comercial estável.',
    primaryAction: {
      label: 'Ver oportunidades',
      to: '/servicos',
    },
  },
  empresa: {
    eyebrow: 'Dashboard empresarial',
    title: 'Coordenação executiva de operação e crescimento.',
    items: companyDashboardItems,
    summary:
      'Mantém visão consolidada da equipa, reputação e geração de novas oportunidades.',
    primaryAction: {
      label: 'Analisar mercado',
      to: '/servicos',
    },
  },
}

const roleHighlight = {
  cliente: 'from-slate-900 to-slate-700',
  prestador: 'from-slate-900 to-blue-900',
  empresa: 'from-slate-900 to-indigo-900',
  admin: 'from-slate-900 to-slate-700',
}

export default function DashboardPage() {
  const { user, logout } = useAuth()
  const config = dashboardCopy[user.role] ?? dashboardCopy.cliente
  const focusClass = roleHighlight[user.role] ?? roleHighlight.admin

  return (
    <main className="min-h-screen bg-[var(--surface)] px-5 py-10 md:px-8 md:py-12">
      <div className="mx-auto w-full max-w-6xl rounded-3xl border border-[var(--border)] bg-white shadow-[0_22px_48px_rgba(15,23,42,0.08)]">
        <header className={`rounded-t-3xl bg-gradient-to-r ${focusClass} px-6 py-8 text-white md:px-10 md:py-10`}>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-200">{config.eyebrow}</p>
          <h1 className="mt-3 font-display text-4xl leading-[1.06] md:text-5xl">{user.name}</h1>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-200 md:text-base">{config.title}</p>
        </header>

        <div className="grid gap-0 lg:grid-cols-[300px_1fr]">
          <aside className="border-b border-[var(--border)] bg-slate-50/70 p-6 lg:border-r lg:border-b-0 lg:p-8">
            <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Conta</h2>

            <div className="mt-4 space-y-3 rounded-2xl border border-[var(--border)] bg-white p-4">
              <div>
                <p className="text-xs uppercase tracking-[0.14em] text-slate-500">Perfil</p>
                <p className="mt-1 text-sm font-semibold text-slate-800">{labels[user.role]}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.14em] text-slate-500">Estado</p>
                <span
                  className={`mt-1 inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${statusClasses[user.validationStatus] ?? statusClasses.inativo}`}
                >
                  {user.validationStatus}
                </span>
              </div>
            </div>

            <div className="mt-6 space-y-3 border-t border-[var(--border)] pt-5">
              <Link
                to={config.primaryAction.to}
                className="block rounded-xl bg-[var(--brand)] px-4 py-3 text-center text-sm font-semibold text-white"
              >
                {config.primaryAction.label}
              </Link>
              <Link
                to="/"
                className="block rounded-xl border border-[var(--border)] bg-white px-4 py-3 text-center text-sm font-semibold text-[var(--brand)]"
              >
                Voltar ao site
              </Link>
              <button
                type="button"
                onClick={logout}
                className="w-full rounded-xl border border-slate-300 bg-slate-100 px-4 py-3 text-sm font-semibold text-slate-700"
              >
                Terminar sessão
              </button>
            </div>
          </aside>

          <section className="p-6 md:p-8 lg:p-10">
            <div className="rounded-2xl border border-[var(--border)] bg-slate-50/60 p-5 md:p-6">
              <h2 className="font-display text-3xl text-[var(--brand)]">Resumo executivo</h2>
              <p className="mt-2 text-sm leading-7 text-slate-600 md:text-base">{config.summary}</p>
            </div>

            <div className="mt-6 rounded-2xl border border-[var(--border)] bg-white p-5 md:p-6">
              <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Prioridades</h3>
              <ul className="mt-4 space-y-3 border-t border-[var(--border)] pt-4">
                {config.items.map((item, index) => (
                  <li key={item} className="flex items-start gap-3 rounded-xl border border-[var(--border)] bg-slate-50/60 px-4 py-3 text-sm leading-6 text-slate-700">
                    <span className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[var(--brand)] text-xs font-semibold text-white">
                      {index + 1}
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-3">
              <article className="rounded-2xl border border-[var(--border)] bg-white p-4">
                <p className="text-xs uppercase tracking-[0.14em] text-slate-500">Foco</p>
                <p className="mt-2 text-sm font-semibold leading-6 text-slate-800">Operação diária</p>
              </article>
              <article className="rounded-2xl border border-[var(--border)] bg-white p-4">
                <p className="text-xs uppercase tracking-[0.14em] text-slate-500">Objetivo</p>
                <p className="mt-2 text-sm font-semibold leading-6 text-slate-800">Eficiência e confiança</p>
              </article>
              <article className="rounded-2xl border border-[var(--border)] bg-white p-4">
                <p className="text-xs uppercase tracking-[0.14em] text-slate-500">Estado</p>
                <p className="mt-2 text-sm font-semibold leading-6 text-slate-800">Painel estático e profissional</p>
              </article>
            </div>
          </section>
        </div>
      </div>
    </main>
  )
}
