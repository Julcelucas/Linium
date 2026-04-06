# Supabase Setup

## 1. Variáveis de ambiente
Criar `.env` na raiz com:

```env
VITE_AUTH_MODE=supabase
VITE_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
VITE_SUPABASE_ANON_KEY=YOUR_ANON_KEY
```

## 2. Tabela de perfis
No SQL Editor do Supabase, executar:

```sql
create table if not exists public.profiles (
  id uuid primary key default gen_random_uuid(),
  auth_user_id uuid unique,
  name text not null,
  username text,
  email text not null,
  role text not null check (role in ('admin', 'cliente', 'prestador', 'empresa')),
  nif text,
  phone text,
  public_email text,
  whatsapp text,
  website text,
  admin_note text default '',
  rejection_reason text default '',
  document_ref text,
  validation_status text not null default 'pendente' check (validation_status in ('ativo', 'pendente', 'rejeitado', 'inativo')),
  status_history jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists idx_profiles_auth_user_id on public.profiles(auth_user_id);
create index if not exists idx_profiles_role on public.profiles(role);
create index if not exists idx_profiles_validation_status on public.profiles(validation_status);
```

## 3. Políticas RLS (MVP)
Estas políticas são para ambiente de desenvolvimento. Em produção, recomenda-se separar operações administrativas via backend seguro.

```sql
alter table public.profiles enable row level security;

create policy "Users can view own profile"
on public.profiles
for select
using (auth.uid() = auth_user_id);

create policy "Users can insert own profile"
on public.profiles
for insert
with check (auth.uid() = auth_user_id);

create policy "Users can update own profile"
on public.profiles
for update
using (auth.uid() = auth_user_id);

-- Para admin no MVP frontend-only: permitir leitura/atualização geral quando role=admin no próprio perfil.
create policy "Admin can read all profiles"
on public.profiles
for select
using (
  exists (
    select 1
    from public.profiles me
    where me.auth_user_id = auth.uid()
      and me.role = 'admin'
  )
);

create policy "Admin can update all profiles"
on public.profiles
for update
using (
  exists (
    select 1
    from public.profiles me
    where me.auth_user_id = auth.uid()
      and me.role = 'admin'
  )
);

create policy "Admin can delete profiles"
on public.profiles
for delete
using (
  exists (
    select 1
    from public.profiles me
    where me.auth_user_id = auth.uid()
      and me.role = 'admin'
  )
);
```

## 4. Conta admin
Criar utilizador admin no Supabase Auth (email/senha) e inserir perfil admin:

```sql
insert into public.profiles (auth_user_id, name, email, role, validation_status, status_history)
values (
  'AUTH_USER_UUID_AQUI',
  'Administração Linium',
  'admin@linium.ao',
  'admin',
  'ativo',
  '[{"status":"ativo","changedAt":"2026-04-06T00:00:00.000Z","note":"Conta administrativa ativa."}]'::jsonb
);
```

## 5. Nota de segurança
Para produção, recomenda-se mover operações administrativas para backend server-side com Service Role Key e não executar ações críticas diretamente no cliente.
