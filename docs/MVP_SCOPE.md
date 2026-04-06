# Linium MVP Scope

## Objetivo
Entregar uma primeira versao funcional do Linium com foco em autenticacao, validacao de perfis e descoberta de servicos.

## Funcionalidades no MVP (P1)
- Registo e login para `cliente`, `prestador`, `empresa` e `admin`.
- Fluxo de validacao de contas profissionais (`pendente`, `ativo`, `rejeitado`, `inativo`).
- Painel admin para aprovar/rejeitar/reativar/desativar contas.
- Pesquisa de servicos por texto, localizacao, categoria, zona e tipo.
- Area privada do utilizador (`/app`) com resumo do perfil e proximas acoes.
- Controle de acesso por rota (admin e area autenticada).

## Fora do MVP (P2)
- Pagamentos, agenda, chat interno, notificacoes push.
- Ranking avancado com machine learning.
- Multi-idioma e multi-moeda.
- Relatorios BI completos.

## Critérios de aceite
1. Um cliente cria conta e entra imediatamente no dashboard.
2. Um prestador/empresa cria conta e fica com estado `pendente`.
3. O admin consegue aprovar/rejeitar e o estado reflete no acesso do utilizador.
4. Pesquisa retorna resultados consistentes com os filtros aplicados.
5. Rotas protegidas bloqueiam acesso de utilizadores nao autorizados.
6. Build (`npm run build`) executa sem erro.

## Plano de execução
1. Congelar escopo e contratos de dados.
2. Introduzir camada de API (frontend) para remover dependencia direta de localStorage.
3. Conectar backend de autenticacao e validacao.
4. Endurecer seguranca e permissoes.
5. Adicionar testes de regressao para fluxos criticos.
6. Preparar CI/CD e ambiente de staging.
