# Linium Frontend

Aplicacao React (Vite) do Linium, uma plataforma para descoberta de servicos locais, validacao de perfis e operacao administrativa.

## Executar localmente

```bash
npm install
npm run dev
```

## Scripts

- `npm run dev` - inicia ambiente de desenvolvimento
- `npm run build` - gera build de producao
- `npm run preview` - serve build localmente
- `npm run lint` - executa lint

## Escopo do MVP

O escopo funcional atual esta definido em [docs/MVP_SCOPE.md](docs/MVP_SCOPE.md).

## Supabase

Para executar com Supabase, ver guia completo em [docs/SUPABASE_SETUP.md](docs/SUPABASE_SETUP.md).

## Estado atual

- Autenticacao local por perfis (`cliente`, `prestador`, `empresa`, `admin`)
- Dashboard por tipo de utilizador
- Painel administrativo com validacao de contas
- Pesquisa de servicos com filtros
- Navegacao principal com paginas institucionais dedicadas
