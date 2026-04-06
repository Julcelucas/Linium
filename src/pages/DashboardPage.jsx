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
  ativo: 'bg-emerald-100 text-emerald-700',
  pendente: 'bg-amber-100 text-amber-700',
  rejeitado: 'bg-red-100 text-red-700',
}

const dashboardCopy = {
  cliente: {
    eyebrow: 'Área do cliente',
    title: 'Encontra, compara e contrata com mais confiança.',
    text: 'A tua área foi pensada para acompanhar contactos, guardar profissionais e organizar o histórico de decisões.',
    items: clientDashboardItems,
    accent: 'border-sky-100 bg-sky-50/70',
  },
  prestador: {
    eyebrow: 'Área do prestador',
    title: 'Controla a tua presença digital e acelera novos contactos.',
    text: 'Esta área organiza pedidos recebidos, estado de validação e evolução da tua reputação dentro do Linium.',
    items: providerDashboardItems,
    accent: 'border-orange-100 bg-orange-50/70',
  },
  empresa: {
    eyebrow: 'Área da empresa',
    title: 'Coordena serviços, reputação e crescimento comercial da tua empresa.',
    text: 'A tua área empresarial concentra operação, presença pública e leitura rápida do posicionamento da empresa na plataforma.',
    items: companyDashboardItems,
    accent: 'border-violet-100 bg-violet-50/70',
  },
}

export default function DashboardPage() {
  const { user, logout } = useAuth()
  const config = dashboardCopy[user.role]

  return (
    <main className="min-h-screen bg-[var(--surface)] px-6 py-14">
      <div className="mx-auto w-full max-w-5xl rounded-[2rem] border border-[var(--border)] bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(212,237,247,0.4))] p-8 shadow-[0_24px_60px_rgba(8,42,51,0.1)]">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-orange-600">
          {config.eyebrow}
        </p>
        <h1 className="mt-4 font-display text-5xl leading-[1.05] text-[var(--brand)]">
          Bem-vindo, {user.name}
        </h1>
        <p className="mt-3 text-base leading-8 text-slate-600">
          Perfil atual: <strong>{labels[user.role]}</strong>. Estado de validação:{' '}
          <strong className={`rounded-full px-3 py-1 text-sm ${statusClasses[user.validationStatus]}`}>
            {user.validationStatus}
          </strong>
        </p>
        <p className="mt-4 max-w-3xl text-base leading-8 text-slate-600">{config.text}</p>

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          <article className={`rounded-2xl border p-5 ${config.accent}`}>
            <h2 className="font-display text-3xl text-[var(--brand)]">Área operacional</h2>
            <ul className="mt-3 list-disc pl-5 text-sm leading-7 text-slate-600">
              {config.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>

          <article className="rounded-2xl border border-sky-100 bg-sky-50/65 p-5">
            <h2 className="font-display text-3xl text-[var(--brand)]">Resumo do perfil</h2>
            <p className="mt-3 text-sm leading-7 text-slate-600">
              {config.title}
            </p>
            <div className="mt-4 rounded-xl bg-white/70 px-4 py-3 text-sm leading-7 text-slate-600">
              {user.role === 'cliente'
                ? 'Podes começar já a explorar resultados e selecionar profissionais validados.'
                : user.validationStatus === 'ativo'
                  ? 'O teu perfil está ativo e pronto para receber novas oportunidades.'
                  : 'A tua conta está registada, mas ainda aguarda validação da administração.'}
            </div>
          </article>
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            to="/"
            className="rounded-xl border border-[var(--border)] px-5 py-3 text-sm font-semibold text-[var(--brand)]"
          >
            Voltar ao site
          </Link>
          <button
            type="button"
            onClick={logout}
            className="rounded-xl bg-[var(--brand)] px-5 py-3 text-sm font-semibold text-white"
          >
            Terminar sessão
          </button>
        </div>
      </div>
    </main>
  )
}
