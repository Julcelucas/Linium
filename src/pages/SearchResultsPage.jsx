import { useEffect, useMemo, useState } from 'react'
import { Link, useLocation, useSearchParams } from 'react-router-dom'
import { filterProfiles, marketplaceProfiles } from '../data/marketplaceData'
import { useAuth } from '../auth/AuthContext'

const PAGE_SIZE = 6

const sortOptions = [
  { value: 'relevance', label: 'Mais relevantes' },
  { value: 'rating-desc', label: 'Melhor avaliação' },
  { value: 'response-asc', label: 'Resposta mais rápida' },
  { value: 'jobs-desc', label: 'Mais serviços concluídos' },
  { value: 'name-asc', label: 'Nome (A-Z)' },
]

function parseResponseTime(value) {
  if (!value) {
    return Number.POSITIVE_INFINITY
  }

  const text = String(value).toLowerCase()
  const number = Number.parseInt(text.replace(/[^\d]/g, ''), 10)

  if (Number.isNaN(number)) {
    return Number.POSITIVE_INFINITY
  }

  if (text.includes('h')) {
    return number * 60
  }

  return number
}

function IconPhone() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4" fill="currentColor">
      <path d="M6.6 10.8a15.5 15.5 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.24c1.08.36 2.24.56 3.46.56a1 1 0 0 1 1 1V20a1 1 0 0 1-1 1C10.3 21 3 13.7 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.22.2 2.38.56 3.46a1 1 0 0 1-.24 1l-2.22 2.34Z" />
    </svg>
  )
}

function IconMail() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4" fill="currentColor">
      <path d="M4 5h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Zm0 2v.5l8 5 8-5V7H4Zm16 10V9.8l-7.46 4.66a1 1 0 0 1-1.08 0L4 9.8V17h16Z" />
    </svg>
  )
}

function IconWhatsApp() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4" fill="currentColor">
      <path d="M12 2a9.9 9.9 0 0 0-8.54 14.95L2 22l5.2-1.37A10 10 0 1 0 12 2Zm0 18.18a8.1 8.1 0 0 1-4.12-1.13l-.3-.18-3.08.81.82-3-.2-.32A8.18 8.18 0 1 1 12 20.18Zm4.48-6.06c-.24-.12-1.43-.7-1.65-.78-.22-.08-.38-.12-.54.12-.16.24-.62.78-.76.94-.14.16-.28.18-.52.06-.24-.12-1.02-.38-1.94-1.2-.72-.64-1.2-1.44-1.34-1.68-.14-.24-.02-.37.1-.5.1-.1.24-.28.36-.42.12-.14.16-.24.24-.4.08-.16.04-.3-.02-.42-.06-.12-.54-1.3-.74-1.78-.2-.48-.4-.4-.54-.4h-.46a.88.88 0 0 0-.64.3c-.22.24-.84.82-.84 2s.86 2.32.98 2.48c.12.16 1.68 2.56 4.08 3.6.57.24 1.02.38 1.36.48.57.18 1.08.16 1.48.1.45-.07 1.43-.58 1.63-1.14.2-.56.2-1.04.14-1.14-.06-.1-.22-.16-.46-.28Z" />
    </svg>
  )
}

function IconGlobe() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4" fill="currentColor">
      <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2Zm6.92 9h-3.06a15.7 15.7 0 0 0-1.1-4.02A8.04 8.04 0 0 1 18.92 11ZM12 4.04c.82 1 1.56 2.8 1.86 4.96h-3.72C10.44 6.84 11.18 5.04 12 4.04ZM4.08 13h3.06c.12 1.42.5 2.8 1.1 4.02A8.04 8.04 0 0 1 4.08 13Zm3.06-2H4.08a8.04 8.04 0 0 1 4.16-4.02A15.7 15.7 0 0 0 7.14 11ZM12 19.96c-.82-1-1.56-2.8-1.86-4.96h3.72c-.3 2.16-1.04 3.96-1.86 4.96ZM14.06 13h-4.12a13.66 13.66 0 0 1 0-2h4.12a13.66 13.66 0 0 1 0 2Zm.7 4.02c.6-1.22.98-2.6 1.1-4.02h3.06a8.04 8.04 0 0 1-4.16 4.02Z" />
    </svg>
  )
}

export default function SearchResultsPage() {
  const [searchParams] = useSearchParams()
  const location = useLocation()
  const { accounts } = useAuth()
  const [sortBy, setSortBy] = useState('relevance')
  const [page, setPage] = useState(1)

  const filters = {
    query: searchParams.get('query') || '',
    location: searchParams.get('location') || '',
    category: searchParams.get('category') || 'Todas as categorias',
    zone: searchParams.get('zone') || 'Todas as zonas',
    serviceType: searchParams.get('serviceType') || 'Todos os tipos',
  }

  const registeredProviders = accounts.filter(
    (account) => 
      (account.role === 'empresa' || account.role === 'prestador') && 
      account.validationStatus === 'ativo'
  )

  const allProfiles = [
    ...marketplaceProfiles,
    ...registeredProviders.map((account) => ({
      id: account.id,
      name: account.name,
      category: 'Diversos serviços',
      zone: account.publicEmail ? 'Luanda' : 'Local',
      location: 'Luanda, Angola',
      serviceType: 'Presencial',
      mode: 'Presencial',
      rating: 4.5,
      jobs: 0,
      responseTime: 'Imediato',
      priceLabel: 'Contactar',
      verified: true,
      description: account.name,
      phone: account.phone || '',
      whatsapp: account.whatsapp || '',
      email: account.publicEmail || account.email,
      website: account.website || '',
    }))
  ]

  const results = filterProfiles(filters, allProfiles)
  const initialCount = location.state?.initialCount

  const sortedResults = useMemo(() => {
    const next = [...results]

    switch (sortBy) {
      case 'rating-desc':
        return next.sort((left, right) => right.rating - left.rating)
      case 'response-asc':
        return next.sort(
          (left, right) => parseResponseTime(left.responseTime) - parseResponseTime(right.responseTime)
        )
      case 'jobs-desc':
        return next.sort((left, right) => right.jobs - left.jobs)
      case 'name-asc':
        return next.sort((left, right) => left.name.localeCompare(right.name, 'pt-PT'))
      case 'relevance':
      default:
        return next
    }
  }, [results, sortBy])

  const totalPages = Math.max(1, Math.ceil(sortedResults.length / PAGE_SIZE))
  const paginatedResults = sortedResults.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  useEffect(() => {
    setPage(1)
  }, [searchParams, sortBy])

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages)
    }
  }, [page, totalPages])

  return (
    <main className="min-h-screen bg-[var(--surface)] px-6 py-12">
      <div className="mx-auto w-full max-w-7xl space-y-8">
        <section className="rounded-[2rem] border border-[var(--border)] bg-[linear-gradient(135deg,#fff4ed,#ffffff,#e9f6fb)] p-8 shadow-[0_24px_60px_rgba(8,42,51,0.08)]">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-orange-600">
            Resultados da pesquisa
          </p>
          <h1 className="mt-3 font-display text-4xl leading-[1.06] text-[var(--brand)] sm:text-5xl">
            {results.length} perfil(is) encontrado(s)
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-8 text-slate-600">
            Pesquisa por necessidade, localização, categoria e tipo de atendimento. {typeof initialCount === 'number' ? `Pré-contagem: ${initialCount}.` : ''}
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            {[filters.query, filters.location, filters.category, filters.zone, filters.serviceType]
              .filter((value) => value && value !== 'Todas as categorias' && value !== 'Todas as zonas' && value !== 'Todos os tipos')
              .map((value) => (
                <span
                  key={value}
                  className="rounded-full bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-[var(--brand)] shadow-[0_10px_20px_rgba(8,42,51,0.06)]"
                >
                  {value}
                </span>
              ))}
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-[var(--border)] pt-5">
            <div className="text-sm text-slate-600">
              A mostrar {sortedResults.length === 0 ? 0 : (page - 1) * PAGE_SIZE + 1} -{' '}
              {Math.min(page * PAGE_SIZE, sortedResults.length)} de {sortedResults.length}
            </div>
            <label className="flex items-center gap-3 text-sm text-slate-600">
              Ordenar por
              <select
                value={sortBy}
                onChange={(event) => setSortBy(event.target.value)}
                className="rounded-xl border border-[var(--border)] bg-white px-3 py-2 text-sm text-[var(--text)] outline-none focus:border-[var(--accent)]"
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </section>

        <section className="grid gap-5 lg:grid-cols-2 xl:grid-cols-3">
          {sortedResults.length === 0 ? (
            <div className="rounded-[1.8rem] border border-[var(--border)] bg-white p-7 text-sm leading-7 text-slate-600 lg:col-span-2 xl:col-span-3">
              Não encontrámos perfis para esta combinação de filtros. Ajusta a categoria, a zona ou o tipo de atendimento.
            </div>
          ) : (
            paginatedResults.map((profile) => (
              <article
                key={profile.id}
                className="rounded-[1.8rem] border border-[var(--border)] bg-white p-6 shadow-[0_18px_40px_rgba(8,42,51,0.06)]"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-orange-600">
                      {profile.category}
                    </p>
                    <h2 className="mt-3 font-display text-3xl leading-[1.08] text-[var(--brand)]">
                      {profile.name}
                    </h2>
                  </div>
                  {profile.verified ? (
                    <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-emerald-700">
                      Verificado
                    </span>
                  ) : null}
                </div>

                <p className="mt-4 text-sm leading-7 text-slate-600">{profile.description}</p>

                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-xl bg-slate-50 px-4 py-3 text-sm text-slate-600">
                    <strong className="text-[var(--brand)]">Local:</strong> {profile.location}
                  </div>
                  <div className="rounded-xl bg-slate-50 px-4 py-3 text-sm text-slate-600">
                    <strong className="text-[var(--brand)]">Zona:</strong> {profile.zone}
                  </div>
                  <div className="rounded-xl bg-slate-50 px-4 py-3 text-sm text-slate-600">
                    <strong className="text-[var(--brand)]">Atendimento:</strong> {profile.serviceType}
                  </div>
                  <div className="rounded-xl bg-slate-50 px-4 py-3 text-sm text-slate-600">
                    <strong className="text-[var(--brand)]">Preço:</strong> {profile.priceLabel}
                  </div>
                </div>

                <div className="mt-5 flex flex-wrap gap-3 text-sm text-slate-600">
                  <span>Avaliação: {profile.rating}</span>
                  <span>Serviços concluídos: {profile.jobs}</span>
                  <span>Resposta: {profile.responseTime}</span>
                </div>

                <div className="mt-5 flex flex-wrap gap-3">
                  <span className="inline-flex items-center gap-2 rounded-full bg-slate-50 px-3 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-[var(--brand)]">
                    <IconPhone />
                    {profile.phone}
                  </span>
                  {profile.email ? (
                    <span className="inline-flex items-center gap-2 rounded-full bg-slate-50 px-3 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-[var(--brand)]">
                      <IconMail />
                      Email
                    </span>
                  ) : null}
                  {profile.whatsapp ? (
                    <span className="inline-flex items-center gap-2 rounded-full bg-slate-50 px-3 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-[var(--brand)]">
                      <IconWhatsApp />
                      WhatsApp
                    </span>
                  ) : null}
                  {profile.website ? (
                    <span className="inline-flex items-center gap-2 rounded-full bg-slate-50 px-3 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-[var(--brand)]">
                      <IconGlobe />
                      Website
                    </span>
                  ) : null}
                </div>

                <div className="mt-6 flex flex-wrap gap-3">
                  <a
                    href={`https://wa.me/${(profile.whatsapp || profile.phone).replace(/\D/g, '')}`}
                    className="inline-flex items-center rounded-xl bg-[var(--accent)] px-5 py-3 text-sm font-semibold text-white"
                  >
                    Contactar no WhatsApp
                  </a>
                  {profile.website ? (
                    <a
                      href={profile.website}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center rounded-xl border border-[var(--border)] px-5 py-3 text-sm font-semibold text-[var(--brand)]"
                    >
                      Abrir website
                    </a>
                  ) : null}
                  <Link
                    to="/criar-conta"
                    className="inline-flex items-center rounded-xl border border-[var(--border)] px-5 py-3 text-sm font-semibold text-[var(--brand)]"
                  >
                    Criar conta para contratar
                  </Link>
                </div>
              </article>
            ))
          )}
        </section>

        {sortedResults.length > 0 ? (
          <nav className="flex items-center justify-center gap-3 pb-2">
            <button
              type="button"
              onClick={() => setPage((current) => Math.max(1, current - 1))}
              disabled={page === 1}
              className="rounded-xl border border-[var(--border)] bg-white px-4 py-2 text-sm font-semibold text-[var(--brand)] disabled:cursor-not-allowed disabled:opacity-50"
            >
              Anterior
            </button>
            <span className="rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-2 text-sm font-semibold text-[var(--brand)]">
              Página {page} de {totalPages}
            </span>
            <button
              type="button"
              onClick={() => setPage((current) => Math.min(totalPages, current + 1))}
              disabled={page === totalPages}
              className="rounded-xl border border-[var(--border)] bg-white px-4 py-2 text-sm font-semibold text-[var(--brand)] disabled:cursor-not-allowed disabled:opacity-50"
            >
              Próxima
            </button>
          </nav>
        ) : null}
      </div>
    </main>
  )
}