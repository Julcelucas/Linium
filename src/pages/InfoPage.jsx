import { Link } from 'react-router-dom'

const pageContent = {
  visao: {
    eyebrow: 'Visão',
    title: 'Uma plataforma profissional para organizar o mercado de serviços em Angola.',
    text:
      'O Linium existe para transformar procura dispersa em conexões comerciais consistentes, com padrões de confiança, clareza e reputação.',
    bullets: [
      'Aproxima clientes, prestadores e empresas numa experiência única.',
      'Reduz fricção na procura e no contacto comercial.',
      'Cria base digital para crescimento económico local.',
    ],
  },
  estrutura: {
    eyebrow: 'Estrutura',
    title: 'Arquitetura operacional orientada à confiança e desempenho.',
    text:
      'Cada componente da plataforma foi pensado para ser simples de usar e robusto para escalar com qualidade.',
    bullets: [
      'Perfis com validação documental antes da publicação.',
      'Filtros e descoberta por categoria, zona e urgência.',
      'Gestão diferenciada para cliente, prestador e empresa.',
    ],
  },
  categorias: {
    eyebrow: 'Categorias',
    title: 'Cobertura de setores alinhada à realidade do mercado.',
    text:
      'A classificação de serviços prioriza leitura rápida da oferta e tomada de decisão objetiva para quem contrata.',
    bullets: [
      'Serviços técnicos e manutenção.',
      'Logística, mobilidade e suporte digital.',
      'Educação, consultoria e serviços empresariais.',
    ],
  },
  impacto: {
    eyebrow: 'Impacto',
    title: 'Valor comercial com relevância social e institucional.',
    text:
      'Além de facilitar contratação, o Linium gera sinais de mercado úteis para planeamento e políticas de desenvolvimento.',
    bullets: [
      'Formalização e visibilidade para profissionais locais.',
      'Mais segurança para clientes em decisões de contratação.',
      'Leitura estratégica de oferta e procura por território.',
    ],
  },
  expansao: {
    eyebrow: 'Expansão',
    title: 'Escala nacional com base operacional sólida.',
    text:
      'A plataforma foi concebida para evoluir por fases, mantendo consistência visual, qualidade de dados e experiência de uso.',
    bullets: [
      'Piloto com estrutura replicável para outras províncias.',
      'Capacidade de integração com novos módulos de negócio.',
      'Governança de produto para crescimento sustentável.',
    ],
  },
  contacto: {
    eyebrow: 'Contacto',
    title: 'Entrada simples para começar a operar no Linium.',
    text:
      'Clientes entram e pesquisam de imediato. Prestadores e empresas criam perfil e seguem processo de validação.',
    bullets: [
      'Criação de conta em poucos passos.',
      'Processo claro de validação para publicação.',
      'Acompanhamento contínuo da reputação do perfil.',
    ],
  },
}

export default function InfoPage({ section }) {
  const content = pageContent[section] ?? pageContent.visao

  return (
    <main className="min-h-screen bg-[var(--surface)] px-5 py-12 md:px-8">
      <div className="mx-auto w-full max-w-4xl rounded-3xl border border-[var(--border)] bg-white p-8 shadow-[0_24px_55px_rgba(62,44,35,0.08)] md:p-10">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--accent)]">{content.eyebrow}</p>
        <h1 className="mt-4 font-display text-4xl leading-[1.1] text-[var(--brand)] md:text-5xl">{content.title}</h1>
        <p className="mt-5 text-base leading-8 text-[var(--text-muted)]">{content.text}</p>

        <ul className="mt-8 space-y-3 border-t border-[var(--border)] pt-6">
          {content.bullets.map((item) => (
            <li
              key={item}
              className="rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-sm leading-6 text-[var(--text)]"
            >
              {item}
            </li>
          ))}
        </ul>

        <div className="mt-8 flex flex-wrap gap-3 border-t border-[var(--border)] pt-6">
          <Link
            to="/"
            className="rounded-xl bg-[var(--brand)] px-5 py-3 text-sm font-semibold text-white"
          >
            Voltar ao inicio
          </Link>
          <Link
            to="/servicos"
            className="rounded-xl border border-[var(--border)] bg-white px-5 py-3 text-sm font-semibold text-[var(--brand)]"
          >
            Ver serviços
          </Link>
        </div>
      </div>
    </main>
  )
}
