import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from './auth/AuthContext'
import { filterProfiles, marketplaceProfiles } from './data/marketplaceData'

const navigation = [
  { label: 'Visão', href: '#visao' },
  { label: 'Estrutura', href: '#estrutura' },
  { label: 'Categorias', href: '#categorias' },
  { label: 'Impacto', href: '#impacto' },
  { label: 'Expansão', href: '#expansao' },
  { label: 'Contacto', href: '#contacto' },
]

const quickStats = [
  { value: 'Angola', label: 'de Luanda ao interior, serviços locais com presença digital' },
  { value: '100% verificado', label: 'nenhum perfil publicado sem validação documental da nossa equipa' },
  { value: '3 perfis', label: 'cliente, prestador e empresa num único ecossistema confiável' },
]

const principles = [
  {
    title: 'Presença digital com credibilidade',
    text: 'Cada perfil funciona como uma montra profissional, com dados essenciais, reputação e sinais de validação.',
  },
  {
    title: 'Organização real do mercado',
    text: 'Categorias claras, filtros objetivos e linguagem simples reduzem fricção e aumentam conversão.',
  },
  {
    title: 'Base para crescimento económico',
    text: 'O ecossistema gera dados que podem orientar formação, incentivos e políticas de formalização.',
  },
]

const audiences = [
  {
    title: 'Prestadores e microempreendedores',
    description:
      'Recebem visibilidade digital, reputação pública, uma primeira estrutura comercial online e mais oportunidades de crescimento sustentável.',
    accent: 'Crescimento e formalização',
  },
  {
    title: 'Cidadãos e clientes',
    description:
      'Encontram serviços locais com mais rapidez, mais contexto e maior segurança na decisão de contacto e contratação.',
    accent: 'Confiança e conveniência',
  },
  {
    title: 'Governos e instituições',
    description:
      'Passam a contar com indicadores agregados sobre oferta, procura e distribuição setorial para apoiar decisões públicas.',
    accent: 'Dados e capacidade de leitura',
  },
]

const categories = [
  'Serviços técnicos e manutenção',
  'Mobilidade, entregas e logística local',
  'Tecnologia e suporte informático',
  'Beleza, costura e cuidados pessoais',
  'Saúde privada e apoio domiciliário',
  'Educação, explicações e formação',
  'Consultoria jurídica, fiscal e contabilística',
  'Comércio, restauração e serviços empresariais',
]

const searchCategories = ['Todas as categorias', ...categories]
const searchZones = ['Todas as zonas', 'Luanda Sul', 'Luanda Centro', 'Cacuaco', 'Viana', 'Benfica']
const searchTypes = ['Todos os tipos', 'Urgente', 'Agendado', 'Recorrente', 'Online', 'Presencial']

const flowSteps = [
  {
    step: '01',
    title: 'Entrada estruturada de prestadores',
    text: 'O profissional ou empresa entra com dados relevantes de serviço, localização, disponibilidade e contexto operacional.',
  },
  {
    step: '02',
    title: 'Perfil público com sinais de confiança',
    text: 'A plataforma organiza a apresentação, evidencia reputação e torna a oferta facilmente comparável.',
  },
  {
    step: '03',
    title: 'Descoberta e contacto imediato',
    text: 'O utilizador encontra a opção certa e inicia a conversa por WhatsApp ou por canais integrados.',
  },
  {
    step: '04',
    title: 'Leitura de mercado e evolução do ecossistema',
    text: 'Os dados agregados revelam tendências, lacunas de oferta e oportunidades de desenvolvimento económico local.',
  },
]

const goals = [
  {
    title: 'Digitalizar sem excluir',
    text: 'Criar uma presença digital acessível para quem ainda opera fora dos canais tradicionais de mercado.',
  },
  {
    title: 'Padronizar para gerar confiança',
    text: 'Introduzir linguagem, estrutura e reputação comparável num mercado historicamente disperso.',
  },
  {
    title: 'Acelerar a conexão comercial',
    text: 'Reduzir o tempo entre procura, avaliação e contacto para aumentar a taxa de conversão do serviço.',
  },
  {
    title: 'Transformar dados em inteligência',
    text: 'Converter movimentação económica local em leitura útil para planeamento, incentivo e inclusão.',
  },
]

const provinces = ['Luanda', 'Benguela', 'Huambo', 'Huila', 'Malanje', 'Cabinda']

const featuredServices = [
  { title: 'Eletricista e canalização', meta: 'Maianga, Luanda', tag: 'Perfil validado' },
  { title: 'Transporte e entregas locais', meta: 'Talatona e arredores', tag: 'Resposta rapida' },
  { title: 'Explicações e aulas privadas', meta: 'Benfica', tag: 'Presencial e online' },
]

const trustPillars = [
  {
    title: 'Documentos verificados',
    text: 'Prestadores individuais submetem o Bilhete de Identidade. Empresas, o Alvará Comercial. A nossa equipa valida cada perfil antes de qualquer publicação.',
  },
  {
    title: 'Avaliações autênticas',
    text: 'Após cada serviço, o cliente avalia o profissional. As avaliações são transparentes e públicas, e não podem ser editadas ou removidas pelo prestador.',
  },
  {
    title: 'Selo Linium verificado',
    text: 'Os perfis aprovados exibem o selo oficial Linium, sinal imediato para o cliente de que o profissional foi revisto, validado e autorizado pela plataforma.',
  },
]



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

function IconShield() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5">
      <path
        d="M12 2 5 5v6c0 4.6 2.9 8.8 7 10 4.1-1.2 7-5.4 7-10V5l-7-3Zm0 5.2a2.8 2.8 0 1 1 0 5.6 2.8 2.8 0 0 1 0-5.6Zm0 10.4a7.2 7.2 0 0 1-4.4-1.5c.2-1.5 3-2.3 4.4-2.3s4.2.8 4.4 2.3a7.2 7.2 0 0 1-4.4 1.5Z"
        fill="currentColor"
      />
    </svg>
  )
}

function IconChart() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5">
      <path
        d="M4 19h16v2H2V3h2v16Zm3-2H5v-6h2v6Zm6 0h-2V7h2v10Zm6 0h-2V4h2v13Z"
        fill="currentColor"
      />
    </svg>
  )
}

function IconSearch() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5">
      <path
        d="M10 4a6 6 0 1 0 3.9 10.6l4.7 4.7 1.4-1.4-4.7-4.7A6 6 0 0 0 10 4Zm0 2a4 4 0 1 1 0 8 4 4 0 0 1 0-8Z"
        fill="currentColor"
      />
    </svg>
  )
}

function IconCheckCircle() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5">
      <path
        d="M20 12a8 8 0 1 1-16 0 8 8 0 0 1 16 0Zm-4.5-3.2-5 5-2.3-2.3-1.4 1.4 3.7 3.7 6.4-6.4-1.4-1.4Z"
        fill="currentColor"
      />
    </svg>
  )
}

function SectionHeading({ eyebrow, title, text, align = 'left' }) {
  const alignment = align === 'center' ? 'mx-auto max-w-3xl text-center' : 'max-w-2xl'

  return (
    <div className={alignment}>
      <span className="inline-flex rounded-full border border-white/60 bg-white/70 px-4 py-1 text-xs font-semibold uppercase tracking-[0.32em] text-[var(--accent)] shadow-[0_10px_30px_rgba(8,42,51,0.08)] backdrop-blur">
        {eyebrow}
      </span>
      <h2 className="mt-5 font-display text-4xl leading-[1.08] text-[var(--brand)] sm:text-5xl">
        {title}
      </h2>
      <p className="mt-4 text-base leading-8 text-slate-600 sm:text-lg">{text}</p>
    </div>
  )
}

function App() {
  const { isAuthenticated, user, logout, accounts } = useAuth()
  const navigate = useNavigate()
  const dashboardPath = user?.role === 'admin' ? '/admin' : '/app'
  const dashboardLabel = user?.role === 'admin' ? 'Administração' : `Área ${user?.role}`
  
  const registeredProviders = accounts.filter(
    (account) => 
      (account.role === 'empresa' || account.role === 'prestador') && 
      account.validationStatus === 'ativo'
  )

  const allProvidersAndCompanies = [
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
  
  const [quickSearch, setQuickSearch] = useState({
    query: '',
    location: '',
    category: searchCategories[0],
    zone: searchZones[0],
    serviceType: searchTypes[0],
  })
  function updateQuickSearch(field, value) {
    setQuickSearch((current) => ({ ...current, [field]: value }))
  }

  function handleQuickSearch(event) {
    event.preventDefault()

    const params = new URLSearchParams({
      query: quickSearch.query,
      location: quickSearch.location,
      category: quickSearch.category,
      zone: quickSearch.zone,
      serviceType: quickSearch.serviceType,
    })

    const matchedProfiles = filterProfiles(quickSearch)
    navigate(`/servicos?${params.toString()}`, {
      state: { initialCount: matchedProfiles.length },
    })
  }

  return (
    <div className="relative isolate overflow-x-hidden">
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[38rem] bg-[radial-gradient(circle_at_top_left,_rgba(11,144,196,0.18),_transparent_38%),radial-gradient(circle_at_top_right,_rgba(8,42,51,0.22),_transparent_42%)]" />
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(rgba(11,144,196,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(11,144,196,0.05)_1px,transparent_1px)] bg-[size:52px_52px] [mask-image:linear-gradient(to_bottom,white,transparent_80%)]" />

      <header className="sticky top-0 z-50 border-b border-white/60 bg-[rgba(247,249,251,0.92)] backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4 lg:px-8 xl:px-10 xl:py-5">
          <a href="#topo" className="flex min-w-0 items-center gap-3 no-underline xl:gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,var(--brand),var(--accent))] text-white shadow-[0_18px_40px_rgba(8,42,51,0.18)] xl:h-12 xl:w-12">
              <IconSpark />
            </div>
            <div className="min-w-0">
              <p className="text-base font-bold uppercase tracking-[0.2em] text-[var(--brand)] xl:text-lg xl:tracking-[0.24em]">
                Linium
              </p>
              <p className="text-[10px] uppercase tracking-[0.24em] text-slate-500 xl:text-[11px] xl:tracking-[0.3em]">
                Ecossistema digital de serviços em Angola
              </p>
            </div>
          </a>

          <nav className="hidden items-center gap-5 xl:gap-7 lg:flex">
            {navigation.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="text-sm font-semibold tracking-[0.14em] text-slate-600 transition hover:text-[var(--brand)] xl:tracking-[0.18em]"
              >
                {item.label}
              </a>
            ))}
          </nav>

          {isAuthenticated ? (
            <div className="flex shrink-0 items-center gap-2 xl:gap-3">
              <Link
                to={dashboardPath}
                className="inline-flex items-center rounded-full border border-[var(--accent)] bg-[var(--accent)] px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.1em] text-white xl:px-4 xl:py-2.5 xl:text-xs xl:tracking-[0.12em]"
              >
                {dashboardLabel}
              </Link>
              <button
                type="button"
                onClick={logout}
                className="inline-flex items-center rounded-full border border-[var(--border)] bg-white px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.1em] text-[var(--brand)] xl:px-4 xl:py-2.5 xl:text-xs xl:tracking-[0.12em]"
              >
                Sair
              </button>
            </div>
          ) : (
            <div className="flex shrink-0 items-center gap-2 xl:gap-3">
              <Link
                to="/entrar"
                className="inline-flex items-center rounded-full border border-[var(--brand)]/15 bg-white px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.1em] text-[var(--brand)] xl:px-4 xl:py-2.5 xl:text-xs xl:tracking-[0.12em]"
              >
                Entrar
              </Link>
              <Link
                to="/criar-conta"
                className="inline-flex items-center rounded-full border border-[var(--accent)] bg-[var(--accent)] px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.08em] text-white xl:px-4 xl:py-2.5 xl:text-xs xl:tracking-[0.12em]"
              >
                Criar conta
              </Link>
            </div>
          )}
        </div>
      </header>

      <main id="topo">
        <section className="mx-auto grid max-w-7xl gap-12 px-6 pb-20 pt-14 lg:grid-cols-[1.1fr_0.9fr] lg:px-10 lg:pb-28 lg:pt-20">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-3 rounded-full border border-white/70 bg-white/80 px-5 py-2 text-sm font-medium text-slate-700 shadow-[0_18px_40px_rgba(8,42,51,0.08)] backdrop-blur">
              <span className="inline-flex h-2.5 w-2.5 rounded-full bg-[var(--accent)]" />
              Plataforma para organizar, digitalizar e dar escala ao mercado de serviços locais.
            </div>

            <h1 className="mt-8 font-display text-5xl leading-[1.02] text-[var(--brand)] sm:text-6xl xl:text-7xl">
              Digitalizar o mercado de serviços em Angola com uma linguagem de confiança, ordem e proximidade.
            </h1>

            <p className="mt-7 max-w-2xl text-lg leading-8 text-slate-600 sm:text-xl">
              O Linium foi concebido como uma infraestrutura digital para conectar prestadores,
              empresas, consumidores e instituições públicas. Mais do que listar serviços, a
              plataforma organiza o mercado, fortalece a reputação dos profissionais e cria uma
              base sólida para crescimento económico com inteligência territorial.
            </p>

            <div className="mt-10 flex flex-wrap gap-4">
              <a
                href="#visao"
                className="inline-flex items-center rounded-full bg-[var(--brand)] px-6 py-3.5 text-sm font-semibold tracking-[0.16em] text-white transition hover:bg-[var(--brand-mid)]"
              >
                Ver proposta estratégica
              </a>
              {!isAuthenticated ? (
                <Link
                  to="/entrar"
                  className="inline-flex items-center rounded-full border border-[var(--accent)] bg-[var(--accent)] px-6 py-3.5 text-sm font-semibold tracking-[0.16em] text-white"
                >
                  Entrar para contactar
                </Link>
              ) : null}
              <a
                href="#categorias"
                className="inline-flex items-center rounded-full border border-[var(--brand)]/15 bg-white px-6 py-3.5 text-sm font-semibold tracking-[0.16em] text-[var(--brand)] transition hover:border-[var(--accent)] hover:text-[var(--accent)]"
              >
                Explorar categorias
              </a>
            </div>

            <div className="mt-12 grid gap-4 sm:grid-cols-3">
              {quickStats.map((item) => (
                <div
                  key={item.label}
                  className="rounded-[1.6rem] border border-white/70 bg-white/80 p-5 shadow-[0_20px_45px_rgba(8,42,51,0.08)] backdrop-blur"
                >
                  <p className="text-2xl font-bold text-[var(--brand)]">{item.value}</p>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{item.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="absolute -left-5 top-10 h-24 w-24 rounded-full bg-[rgba(11,144,196,0.14)] blur-2xl" />
            <div className="absolute -bottom-4 right-6 h-28 w-28 rounded-full bg-[rgba(8,42,51,0.12)] blur-3xl" />

            <div className="float-card relative rounded-[2rem] border border-white/70 bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(255,255,255,0.78))] p-6 shadow-[0_28px_60px_rgba(8,42,51,0.14)] backdrop-blur-xl sm:p-7">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.32em] text-slate-500">
                    Perspetiva de produto
                  </p>
                  <h3 className="mt-2 font-display text-3xl leading-[1.1] text-[var(--brand)]">
                    Descoberta, reputação e dinâmica comercial num único sistema.
                  </h3>
                </div>
                <div className="rounded-2xl bg-[var(--accent-lt)] p-3 text-[var(--accent)]">
                  <IconSearch />
                </div>
              </div>

              <div className="mt-6 rounded-[1.5rem] border border-[var(--border)] bg-white p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.8)]">
                <div className="flex flex-wrap gap-2 text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
                  <span className="rounded-full bg-slate-100 px-3 py-2">Luanda</span>
                  <span className="rounded-full bg-slate-100 px-3 py-2">Validado</span>
                  <span className="rounded-full bg-slate-100 px-3 py-2">Contacto imediato</span>
                </div>

                <div className="mt-5 space-y-3">
                  {featuredServices.map((item) => (
                    <div
                      key={item.title}
                      className="flex items-center justify-between rounded-[1.25rem] border border-slate-100 px-4 py-3 transition hover:border-[var(--accent)]/30 hover:bg-[var(--surface)]"
                    >
                      <div>
                        <p className="font-semibold text-[var(--brand)]">{item.title}</p>
                        <p className="mt-1 text-sm text-slate-500">{item.meta}</p>
                      </div>
                      <span className="rounded-full bg-[var(--accent-lt)] px-3 py-1 text-xs font-semibold text-[var(--accent)]">
                        {item.tag}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6 grid gap-4 min-[520px]:grid-cols-2">
                <div className="rounded-[1.4rem] bg-[var(--brand)] p-5 text-white">
                  <div className="flex items-start gap-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-white/70">
                    <IconShield />
                    <span>Confiança</span>
                  </div>
                  <p className="mt-3 text-[2rem] leading-[1.05] font-semibold">Perfis validados</p>
                </div>
                <div className="rounded-[1.4rem] bg-[var(--accent)] p-5 text-white">
                  <div className="flex items-start gap-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-white/70">
                    <IconSpark />
                    <span>Visibilidade</span>
                  </div>
                  <p className="mt-3 text-[2rem] leading-[1.05] font-semibold">Montra digital</p>
                </div>
                <div className="rounded-[1.4rem] bg-white p-5 text-[var(--brand)] ring-1 ring-slate-100 min-[520px]:col-span-2">
                  <div className="flex items-start gap-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                    <IconChart />
                    <span>Leitura de mercado</span>
                  </div>
                  <p className="mt-3 text-[2rem] leading-[1.05] font-semibold">Dados agregados</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 pb-8 lg:px-10 lg:pb-14">
          <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--accent)]">
                Pesquisa rapida
              </p>
              <h2 className="mt-4 font-display text-4xl leading-[1.08] text-[var(--brand)] sm:text-5xl">
                Um bloco de pesquisa direta para encontrar serviços em segundos.
              </h2>
              <p className="mt-4 max-w-xl text-base leading-8 text-slate-600">
                Inspirado em experiências de busca objetiva, este módulo permite filtrar por
                necessidade, localização, categoria, zona e tipo de atendimento.
              </p>
            </div>

            <form
              onSubmit={handleQuickSearch}
              className="rounded-[2rem] bg-[linear-gradient(180deg,#ff7a1a,#ff6b1e)] p-6 shadow-[0_28px_60px_rgba(255,107,30,0.32)] sm:p-7"
            >
              <h3 className="font-display text-4xl leading-[1.06] text-white sm:text-[2.7rem]">
                Encontra o serviço certo para a tua necessidade.
              </h3>

              <div className="mt-5 space-y-4">
                <input
                  type="text"
                  value={quickSearch.query}
                  onChange={(event) => updateQuickSearch('query', event.target.value)}
                  placeholder="O que procuras?"
                  className="w-full rounded-xl border border-transparent bg-white px-4 py-3 text-base text-slate-700 outline-none focus:border-[var(--brand)]"
                />

                <input
                  type="text"
                  value={quickSearch.location}
                  onChange={(event) => updateQuickSearch('location', event.target.value)}
                  placeholder="Onde?"
                  className="w-full rounded-xl border border-transparent bg-white px-4 py-3 text-base text-slate-700 outline-none focus:border-[var(--brand)]"
                />

                <p className="text-xl font-semibold text-white">Filtrar por categoria e zona</p>

                <select
                  value={quickSearch.category}
                  onChange={(event) => updateQuickSearch('category', event.target.value)}
                  className="w-full rounded-xl border border-transparent bg-white px-4 py-3 text-base text-slate-700 outline-none focus:border-[var(--brand)]"
                >
                  {searchCategories.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>

                <select
                  value={quickSearch.zone}
                  onChange={(event) => updateQuickSearch('zone', event.target.value)}
                  className="w-full rounded-xl border border-transparent bg-white px-4 py-3 text-base text-slate-700 outline-none focus:border-[var(--brand)]"
                >
                  {searchZones.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>

                <p className="text-xl font-semibold text-white">Tipo de atendimento</p>

                <select
                  value={quickSearch.serviceType}
                  onChange={(event) => updateQuickSearch('serviceType', event.target.value)}
                  className="w-full rounded-xl border border-transparent bg-white px-4 py-3 text-base text-slate-700 outline-none focus:border-[var(--brand)]"
                >
                  {searchTypes.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>

                <button
                  type="submit"
                  className="w-full rounded-xl bg-[#2f63f1] px-4 py-3 text-base font-semibold uppercase tracking-[0.14em] text-white transition hover:bg-[#234fcb]"
                >
                  Pesquisar
                </button>
              </div>

            </form>
          </div>
        </section>

        <section id="estrutura" className="mx-auto max-w-7xl px-6 py-4 lg:px-10 lg:py-8">
          <div className="grid gap-4 rounded-[2rem] border border-white/70 bg-[linear-gradient(135deg,rgba(255,122,26,0.08),rgba(11,144,196,0.06))] p-6 shadow-[0_18px_45px_rgba(8,42,51,0.06)] backdrop-blur lg:grid-cols-3 lg:p-8">
            {principles.map((item, index) => (
              <article
                key={item.title}
                className={`rounded-[1.5rem] border p-5 ${
                  index === 0
                    ? 'border-orange-100 bg-orange-50/70'
                    : index === 1
                      ? 'border-sky-100 bg-sky-50/70'
                      : 'border-[var(--border)] bg-white/80'
                }`}
              >
                <h3 className="font-display text-[2rem] leading-[1.1] text-[var(--brand)]">{item.title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-600">{item.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="visao" className="mx-auto max-w-7xl px-6 py-6 lg:px-10 lg:py-10">
          <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
            <SectionHeading
              eyebrow="Missão central"
              title="Uma plataforma concebida para profissionalizar a oferta local sem perder proximidade com a realidade angolana."
              text="O Linium responde a um problema estrutural: existe oferta, existe procura, mas falta organização, visibilidade e um ambiente confiável para gerar relações comerciais mais simples e consistentes."
            />

            <div className="grid gap-5 md:grid-cols-2 2xl:grid-cols-3">
              {audiences.map((item, index) => (
                <article
                  key={item.title}
                  className={`reveal rounded-[1.8rem] border p-7 shadow-[0_24px_55px_rgba(8,42,51,0.08)] backdrop-blur ${
                    index === 0
                      ? 'border-orange-100 bg-[linear-gradient(180deg,rgba(255,244,237,0.96),rgba(255,255,255,0.92))] 2xl:col-auto md:col-span-2 2xl:md:col-span-1'
                      : index === 1
                        ? 'border-sky-100 bg-[linear-gradient(180deg,rgba(240,249,255,0.96),rgba(255,255,255,0.92))]'
                        : 'border-orange-100/70 bg-[linear-gradient(180deg,rgba(255,247,240,0.94),rgba(255,255,255,0.92))]'
                  }`}
                >
                  <p className={`text-xs font-semibold uppercase tracking-[0.24em] ${index === 1 ? 'text-sky-600' : 'text-orange-600'}`}>
                    {item.accent}
                  </p>
                  <h3 className="mt-4 max-w-[12ch] font-display text-3xl leading-[1.12] text-[var(--brand)] sm:max-w-none">
                    {item.title}
                  </h3>
                  <p className="mt-4 text-[15px] leading-7 text-slate-600">{item.description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="categorias" className="mx-auto max-w-7xl px-6 py-20 lg:px-10">
          <SectionHeading
            eyebrow="Abrangência real"
            title="Conteúdo e categorias pensados para traduzir a economia real, e não uma visão artificial do mercado."
            text="Da manutenção técnica aos serviços empresariais, o ecossistema acomoda profissionais autónomos, pequenos negócios e empresas formais numa mesma estrutura de descoberta e relacionamento."
            align="center"
          />

          <div className="mt-12 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {categories.map((category, index) => (
              <article
                key={category}
                className="group rounded-[1.7rem] border border-[var(--border)] bg-white/90 p-5 shadow-[0_18px_40px_rgba(8,42,51,0.06)] transition hover:-translate-y-1 hover:border-[var(--accent)]/35 hover:shadow-[0_30px_60px_rgba(8,42,51,0.12)]"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
                    Setor {String(index + 1).padStart(2, '0')}
                  </span>
                  <span className="rounded-full bg-[var(--accent-lt)] px-3 py-1 text-xs font-semibold text-[var(--accent)]">
                    Ativo
                  </span>
                </div>
                <h3 className="mt-10 font-display text-3xl leading-[1.1] text-[var(--brand)]">{category}</h3>
                <p className="mt-4 text-sm leading-7 text-slate-600">
                  Categoria desenhada para facilitar pesquisa local, leitura rápida da oferta e contacto comercial sem fricção.
                </p>
              </article>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-8 lg:px-10 lg:py-16">
          <div className="grid gap-8 rounded-[2.2rem] bg-[linear-gradient(135deg,var(--brand),#0f4860_56%,var(--accent))] px-8 py-10 text-white shadow-[0_30px_80px_rgba(8,42,51,0.2)] lg:grid-cols-[0.9fr_1.1fr] lg:px-12 lg:py-12">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-white/70">Fluxo operacional</p>
              <h2 className="mt-4 font-display text-4xl leading-[1.08] sm:text-5xl">
                Claro para o utilizador, útil para o mercado e relevante para o território.
              </h2>
              <p className="mt-5 max-w-xl text-base leading-8 text-white/80">
                A experiência foi desenhada para reduzir o tempo entre procura e contratação, ao mesmo tempo que organiza informação útil para desenvolvimento económico local.
              </p>
            </div>

            <div className="grid gap-4">
              {flowSteps.map((item) => (
                <div
                  key={item.step}
                  className="rounded-[1.5rem] border border-white/12 bg-white/10 p-5 backdrop-blur-sm"
                >
                  <div className="flex items-center gap-4">
                    <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/14 text-sm font-bold tracking-[0.2em] text-white/80">
                      {item.step}
                    </span>
                    <div>
                      <h3 className="text-lg font-semibold text-white">{item.title}</h3>
                      <p className="mt-2 text-sm leading-7 text-white/75">{item.text}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="impacto" className="mx-auto max-w-7xl px-6 py-20 lg:px-10">
          <div className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr]">
            <SectionHeading
              eyebrow="Impacto estrategico"
              title="Um produto com capacidade comercial, valor social e leitura institucional desde a primeira camada."
              text="A apresentacao do Linium precisa comunicar maturidade. Por isso o conteudo foi reescrito para sustentar o projeto perante parceiros, empresas, investidores e entidades publicas."
            />

            <div className="grid gap-5 md:grid-cols-2">
              {goals.map((goal, index) => (
                <article
                  key={goal.title}
                  className={`rounded-[1.8rem] border p-6 shadow-[0_20px_45px_rgba(8,42,51,0.07)] ${
                    index % 2 === 0
                      ? 'border-orange-100 bg-orange-50/70'
                      : 'border-sky-100 bg-sky-50/70'
                  }`}
                >
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-[var(--accent)]">
                    <IconChart />
                  </div>
                  <h3 className="mt-5 font-display text-3xl text-[var(--brand)]">{goal.title}</h3>
                  <p className="mt-4 text-sm leading-7 text-slate-600">{goal.text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-10 lg:px-10 lg:py-16">
          <div className="rounded-[2.2rem] border border-[var(--border)] bg-[linear-gradient(135deg,rgba(8,42,51,0.03),rgba(11,144,196,0.05))] p-8 lg:p-12">
            <div className="mx-auto mb-10 max-w-3xl text-center">
              <span className="inline-flex rounded-full border border-orange-100 bg-orange-50 px-4 py-1 text-xs font-semibold uppercase tracking-[0.32em] text-orange-600 shadow-[0_10px_30px_rgba(8,42,51,0.08)] backdrop-blur">
                Compromisso com a confiança
              </span>
              <h2 className="mt-5 font-display text-4xl leading-[1.08] text-[var(--brand)] sm:text-5xl">
                Uma plataforma onde cada perfil é verificado antes de ser publicado.
              </h2>
              <p className="mt-4 text-base leading-8 text-slate-600">
                A confiança é o núcleo do Linium. Exigimos documentos reais de todos os prestadores e empresas. Clientes nunca encontrarão um perfil que não foi revisto pela nossa equipa.
              </p>
            </div>
            <div className="grid gap-6 md:grid-cols-3">
              {trustPillars.map((pillar, index) => (
                <article
                  key={pillar.title}
                  className={`rounded-[1.8rem] border p-7 shadow-[0_18px_40px_rgba(8,42,51,0.07)] backdrop-blur ${
                    index === 0
                      ? 'border-orange-100 bg-orange-50/65'
                      : index === 1
                        ? 'border-sky-100 bg-sky-50/65'
                        : 'border-white/70 bg-white/85'
                  }`}
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-[var(--accent)]">
                    <IconCheckCircle />
                  </div>
                  <h3 className="mt-5 font-display text-[1.9rem] leading-[1.1] text-[var(--brand)]">{pillar.title}</h3>
                  <p className="mt-4 text-sm leading-7 text-slate-600">{pillar.text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="expansao" className="mx-auto max-w-7xl px-6 py-4 lg:px-10 lg:py-10">
          <div className="rounded-[2.4rem] border border-white/70 bg-white/85 p-8 shadow-[0_28px_65px_rgba(8,42,51,0.08)] backdrop-blur lg:p-12">
            <div className="grid gap-8 lg:grid-cols-[1fr_0.9fr] lg:items-center">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--accent)]">Expansão provincial</p>
                <h2 className="mt-4 font-display text-4xl leading-[1.08] text-[var(--brand)] sm:text-5xl">
                  O piloto pode começar em Luanda, mas a marca nasce preparada para escala nacional.
                </h2>
                <p className="mt-5 max-w-2xl text-base leading-8 text-slate-600">
                  A estrutura visual e narrativa já considera adaptações regionais, desdobramentos provinciais e futuras camadas como pagamentos, agendamento, dashboards e módulos institucionais avançados.
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                {provinces.map((province) => (
                  <div
                    key={province}
                    className="rounded-[1.4rem] border border-[var(--border)] bg-[var(--surface)] px-5 py-4 text-sm font-semibold uppercase tracking-[0.18em] text-[var(--brand)]"
                  >
                    {province}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {allProvidersAndCompanies.length > 0 ? (
          <section className="mx-auto max-w-7xl px-6 py-20 lg:px-10">
            <div className="rounded-[2.4rem] border border-[var(--border)] bg-white p-8 shadow-[0_28px_65px_rgba(8,42,51,0.08)] lg:p-12">
              <div className="mb-10">
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--accent)]">Prestadores e empresas</p>
                <h2 className="mt-4 font-display text-4xl leading-[1.08] text-[var(--brand)] sm:text-5xl">
                  Já temos {allProvidersAndCompanies.length} {allProvidersAndCompanies.length === 1 ? 'profissional' : 'profissionais'} verified no Linium.
                </h2>
                <p className="mt-5 max-w-2xl text-base leading-8 text-slate-600">
                  Empresas e prestadores que já confiam no Linium para ganhar visibilidade e estabelecer relações comerciais na sua região.
                </p>
              </div>

              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {allProvidersAndCompanies.slice(0, 6).map((provider) => (
                  <div
                    key={provider.id}
                    className="rounded-[1.8rem] border border-[var(--border)] bg-[var(--surface)] p-6 transition hover:border-[var(--accent)]/50 hover:shadow-[0_20px_45px_rgba(8,42,51,0.08)]"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                          {provider.description !== provider.name ? 'Profissional' : 'Serviço'}
                        </p>
                        <h3 className="mt-2 font-display text-xl leading-[1.1] text-[var(--brand)]">
                          {provider.name}
                        </h3>
                      </div>
                      <span className="rounded-full bg-[var(--accent-lt)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-[var(--accent)]">
                        Verificado
                      </span>
                    </div>

                    {provider.publicEmail || provider.phone || provider.whatsapp ? (
                      <div className="mt-5 space-y-2">
                        {provider.phone && (
                          <p className="text-sm text-slate-600">
                            <strong>Tel:</strong> {provider.phone}
                          </p>
                        )}
                        {provider.publicEmail && (
                          <p className="text-sm text-slate-600">
                            <strong>Email:</strong> {provider.publicEmail}
                          </p>
                        )}
                        {provider.whatsapp && (
                          <p className="text-sm text-slate-600">
                            <strong>WhatsApp:</strong> {provider.whatsapp}
                          </p>
                        )}
                        {provider.website && (
                          <p className="text-sm text-slate-600">
                            <strong>Website:</strong> <a href={provider.website} target="_blank" rel="noopener noreferrer" className="text-[var(--accent)] hover:underline">{provider.website}</a>
                          </p>
                        )}
                      </div>
                    ) : null}

                    {provider.nif || provider.jobs > 0 ? (
                      <div className="mt-4 rounded-[1rem] border border-[var(--border)] bg-white/60 px-3 py-2 text-xs uppercase tracking-[0.16em] text-slate-500">
                        {provider.nif ? `NIF: ${provider.nif}` : `${provider.jobs} trabalhos realizados`}
                      </div>
                      ) : null}
                  </div>
                ))}
              </div>

              {allProvidersAndCompanies.length > 6 ? (
                <div className="mt-8 text-center">
                  <p className="mb-4 text-sm text-slate-600">
                    E mais {allProvidersAndCompanies.length - 6} {allProvidersAndCompanies.length - 6 === 1 ? 'profissional' : 'profissionais'} no Linium...
                  </p>
                  <Link
                    to="/servicos"
                    className="inline-flex items-center rounded-full border border-[var(--accent)] bg-[var(--accent)] px-6 py-3.5 text-sm font-semibold tracking-[0.16em] text-white transition hover:bg-[var(--brand-mid)]"
                  >
                    Ver todos os prestadores
                  </Link>
                </div>
              ) : null}
            </div>
          </section>
        ) : null}

        <section id="contacto" className="mx-auto max-w-7xl px-6 py-20 lg:px-10">
          <div className="rounded-[2.5rem] border border-[var(--border)] bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(212,237,247,0.65))] p-8 shadow-[0_26px_70px_rgba(8,42,51,0.08)] lg:p-12">
            <div className="grid gap-10 lg:grid-cols-[1fr_0.9fr] lg:items-center">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--accent)]">Entra no Linium</p>
                <h2 className="mt-4 font-display text-4xl leading-[1.08] text-[var(--brand)] sm:text-5xl">
                  Já és prestador, empresa ou consumidor? O Linium é para ti.
                </h2>
                <p className="mt-5 max-w-2xl text-base leading-8 text-slate-600">
                  Cria a tua conta gratuitamente. Se és cliente, começas a encontrar prestadores verificados de imediato. Se és prestador ou empresa, a nossa equipa valida o teu perfil e publicas-te no mercado angolano.
                </p>
                <div className="mt-8 flex flex-wrap gap-4">
                  <Link
                    to="/criar-conta"
                    className="inline-flex items-center rounded-full bg-[var(--accent)] px-6 py-3.5 text-sm font-semibold tracking-[0.16em] text-white transition hover:bg-[var(--brand-mid)]"
                  >
                    Criar conta gratuita
                  </Link>
                  <Link
                    to="/entrar"
                    className="inline-flex items-center rounded-full border border-[var(--brand)]/15 bg-white px-6 py-3.5 text-sm font-semibold tracking-[0.16em] text-[var(--brand)] transition hover:border-[var(--accent)] hover:text-[var(--accent)]"
                  >
                    Já tenho conta
                  </Link>
                </div>
              </div>

              <div className="rounded-[2rem] bg-[linear-gradient(160deg,var(--brand),#0f4860_60%,#ff7a1a)] p-7 text-white shadow-[0_24px_55px_rgba(8,42,51,0.24)]">
                <p className="text-sm font-semibold uppercase tracking-[0.26em] text-white/70">
                  Como funciona
                </p>
                <ol className="mt-6 space-y-5">
                  {[
                    'Cria a tua conta e escolhe o teu perfil: cliente, prestador ou empresa.',
                    'Prestadores e empresas submetem documentos de verificação. Clientes entram de imediato.',
                    'Após validação, o teu perfil fica público e começas a receber contactos de clientes.',
                    'Clientes avaliam. A tua reputação cresce. O Linium amplifica o teu negócio.',
                  ].map((step, index) => (
                    <li key={index} className="flex items-start gap-4">
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-white/12 text-xs font-bold tracking-[0.16em] text-white/80">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                      <p className="text-sm leading-7 text-white/85">{step}</p>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-white/60 bg-white/70 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-8 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between lg:px-10">
          <p>© 2026 Linium. Ecossistema digital de serviços em Angola.</p>
          <div className="flex gap-6">
            <Link to="/criar-conta" className="transition hover:text-[var(--accent)]">Criar conta</Link>
            <Link to="/entrar" className="transition hover:text-[var(--accent)]">Entrar</Link>
            <a href="#visao" className="transition hover:text-[var(--accent)]">Sobre</a>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App
