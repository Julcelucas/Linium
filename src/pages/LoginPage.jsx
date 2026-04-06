import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'

export default function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [identifier, setIdentifier] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('cliente')
  const [feedback, setFeedback] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()
    setFeedback('')
    setIsSubmitting(true)

    const result = await login(identifier, password, role)

    if (!result.ok) {
      setFeedback(result.message)
      setIsSubmitting(false)
      return
    }

    const fallback = result.user.role === 'admin' ? '/admin' : '/app'
    const to = location.state?.from?.pathname || fallback
    navigate(to)
    setIsSubmitting(false)
  }

  return (
    <main className="min-h-screen bg-[var(--surface)] px-6 py-14">
      <div className="mx-auto grid w-full max-w-5xl gap-8 rounded-[2rem] border border-[var(--border)] bg-white p-8 shadow-[0_24px_60px_rgba(8,42,51,0.1)] lg:grid-cols-[1.1fr_0.9fr]">
        <section>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-orange-600">
            Acesso ao ecossistema
          </p>
          <h1 className="mt-4 font-display text-5xl leading-[1.05] text-[var(--brand)]">
            Entrar no Linium
          </h1>
          <p className="mt-4 max-w-lg text-base leading-8 text-slate-600">
            O modelo equilibrado do Linium permite navegação pública, mas exige autenticação para
            contacto com prestadores, publicação de serviços e acesso ao painel.
          </p>

          <div className="mt-8 rounded-2xl bg-[linear-gradient(135deg,#fff1e8,#d4edf7)] p-5">
            <p className="text-sm font-semibold text-[var(--brand)]">Ainda não tens conta?</p>
            <Link
              to="/criar-conta"
              className="mt-2 inline-flex rounded-full bg-[linear-gradient(135deg,#ff7a1a,#0b90c4)] px-4 py-2 text-sm font-semibold text-white"
            >
              Criar conta
            </Link>
            <p className="mt-4 text-xs leading-6 text-slate-500">
              Acesso interno de teste: admin | admin02
            </p>
          </div>
        </section>

        <section className="rounded-2xl border border-[var(--border)] p-6">
          <form className="space-y-5" onSubmit={handleSubmit}>
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-700">Entrar como</span>
              <select
                value={role}
                onChange={(event) => setRole(event.target.value)}
                className="w-full rounded-xl border border-[var(--border)] px-4 py-3 outline-none focus:border-[var(--accent)]"
              >
                <option value="cliente">Cliente</option>
                <option value="prestador">Prestador</option>
                <option value="empresa">Empresa</option>
                <option value="admin">Administração</option>
              </select>
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-700">Email ou utilizador</span>
              <input
                type="text"
                value={identifier}
                onChange={(event) => setIdentifier(event.target.value)}
                className="w-full rounded-xl border border-[var(--border)] px-4 py-3 outline-none focus:border-[var(--accent)]"
                placeholder={role === 'admin' ? 'admin' : 'teuemail@dominio.com'}
                required
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-700">Senha</span>
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="w-full rounded-xl border border-[var(--border)] px-4 py-3 outline-none focus:border-[var(--accent)]"
                placeholder="********"
                required
              />
            </label>

            {feedback ? <p className="text-sm text-red-600">{feedback}</p> : null}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-xl bg-[var(--accent)] px-4 py-3 text-sm font-semibold uppercase tracking-[0.14em] text-white"
            >
              {isSubmitting ? 'A entrar...' : 'Iniciar sessão'}
            </button>
          </form>
        </section>
      </div>
    </main>
  )
}
