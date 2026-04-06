export const marketplaceProfiles = [
  {
    id: 'prestador-eletricista-maianga',
    name: 'Carlos Manutenção 24H',
    category: 'Serviços técnicos e manutenção',
    zone: 'Luanda Centro',
    location: 'Maianga, Luanda',
    serviceType: 'Urgente',
    mode: 'Presencial',
    rating: 4.8,
    jobs: 128,
    responseTime: '20 min',
    priceLabel: 'Desde 18.000 Kz',
    verified: true,
    description:
      'Serviços de eletricidade, canalização e manutenção urgente para residências e pequenos negócios.',
    phone: '+244 923 000 111',
    whatsapp: '+244 923 000 111',
    email: 'carlos@manutencao24h.ao',
    website: 'https://manutencao24h.ao',
  },
  {
    id: 'prestador-entregas-talatona',
    name: 'Rota Express Angola',
    category: 'Mobilidade, entregas e logística local',
    zone: 'Luanda Sul',
    location: 'Talatona, Luanda',
    serviceType: 'Recorrente',
    mode: 'Presencial',
    rating: 4.6,
    jobs: 214,
    responseTime: '35 min',
    priceLabel: 'Planos desde 25.000 Kz',
    verified: true,
    description:
      'Operação de entregas urbanas, recolha de encomendas e apoio logístico para empresas e famílias.',
    phone: '+244 923 000 222',
    whatsapp: '+244 923 000 222',
    email: 'operacoes@rotaexpress.ao',
    website: 'https://rotaexpress.ao',
  },
  {
    id: 'prestador-aulas-benfica',
    name: 'Centro Explica+ Benfica',
    category: 'Educação, explicações e formação',
    zone: 'Benfica',
    location: 'Benfica, Luanda',
    serviceType: 'Agendado',
    mode: 'Online',
    rating: 4.9,
    jobs: 87,
    responseTime: '1 h',
    priceLabel: 'Sessões desde 12.000 Kz',
    verified: true,
    description:
      'Explicações presenciais e online para ensino geral, reforço escolar e preparação para exames.',
    phone: '+244 923 000 333',
    whatsapp: '+244 923 000 333',
    email: 'contacto@explicamais.ao',
    website: 'https://explicamais.ao',
  },
  {
    id: 'empresa-contabilidade-viana',
    name: 'Prime Fiscal Consultores',
    category: 'Consultoria jurídica, fiscal e contabilística',
    zone: 'Viana',
    location: 'Viana, Luanda',
    serviceType: 'Agendado',
    mode: 'Presencial',
    rating: 4.7,
    jobs: 54,
    responseTime: '2 h',
    priceLabel: 'Pacotes desde 40.000 Kz',
    verified: true,
    description:
      'Apoio fiscal, contabilidade para PMEs, legalização documental e organização de processos empresariais.',
    phone: '+244 923 000 444',
    whatsapp: '+244 923 000 444',
    email: 'geral@primefiscal.ao',
    website: 'https://primefiscal.ao',
  },
  {
    id: 'prestador-beleza-cacuaco',
    name: 'Studio Bela Imagem',
    category: 'Beleza, costura e cuidados pessoais',
    zone: 'Cacuaco',
    location: 'Cacuaco, Luanda',
    serviceType: 'Agendado',
    mode: 'Presencial',
    rating: 4.5,
    jobs: 66,
    responseTime: '50 min',
    priceLabel: 'Atendimento desde 9.000 Kz',
    verified: true,
    description:
      'Serviços de imagem, cabelo, costura rápida e atendimento ao domicílio em zonas selecionadas.',
    phone: '+244 923 000 555',
    whatsapp: '+244 923 000 555',
    email: 'studio@belaimagem.ao',
    website: 'https://belaimagem.ao',
  },
  {
    id: 'empresa-ti-online',
    name: 'Nexo Tech Support',
    category: 'Tecnologia e suporte informático',
    zone: 'Todas as zonas',
    location: 'Luanda e remoto',
    serviceType: 'Online',
    mode: 'Online',
    rating: 4.9,
    jobs: 143,
    responseTime: '15 min',
    priceLabel: 'Suporte desde 15.000 Kz',
    verified: true,
    description:
      'Suporte remoto, manutenção de computadores, redes locais e assistência técnica para empresas.',
    phone: '+244 923 000 666',
    whatsapp: '+244 923 000 666',
    email: 'suporte@nexotech.ao',
    website: 'https://nexotech.ao',
  },
]

export const clientDashboardItems = [
  'Encontrar prestadores validados por categoria, zona e urgência.',
  'Guardar prestadores favoritos para contactos recorrentes.',
  'Acompanhar pedidos enviados e histórico de contratações.',
]

export const providerDashboardItems = [
  'Gerir o perfil público e reforçar sinais de confiança.',
  'Responder rapidamente a pedidos recebidos de clientes.',
  'Acompanhar avaliações, desempenho e volume de contactos.',
]

export const companyDashboardItems = [
  'Gerir múltiplos serviços e equipas num só perfil empresarial.',
  'Controlar documentação, presença digital e reputação pública.',
  'Monitorizar pedidos, propostas e crescimento comercial no Linium.',
]

export function filterProfiles(filters, profiles = marketplaceProfiles) {
  return profiles.filter((profile) => {
    const query = filters.query?.trim().toLowerCase()
    const location = filters.location?.trim().toLowerCase()

    const matchesQuery =
      !query ||
      [profile.name, profile.category, profile.description].some((value) =>
        value.toLowerCase().includes(query)
      )

    const matchesLocation =
      !location || profile.location.toLowerCase().includes(location) || profile.zone.toLowerCase().includes(location)

    const matchesCategory =
      !filters.category ||
      filters.category === 'Todas as categorias' ||
      profile.category === filters.category

    const matchesZone =
      !filters.zone ||
      filters.zone === 'Todas as zonas' ||
      profile.zone === filters.zone ||
      profile.zone === 'Todas as zonas'

    const matchesType =
      !filters.serviceType ||
      filters.serviceType === 'Todos os tipos' ||
      profile.serviceType === filters.serviceType ||
      profile.mode === filters.serviceType

    return matchesQuery && matchesLocation && matchesCategory && matchesZone && matchesType
  })
}