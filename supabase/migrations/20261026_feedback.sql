-- Feedback button. Already applied to the "tally" Supabase project through the connector;
-- kept here as a record.

-- Feedback from signed-in traders. Traders can send it; only the team reads it (Supabase dashboard).
create table if not exists public.feedback (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users on delete cascade,
  page text check (char_length(page) <= 200),
  message text not null check (char_length(btrim(message)) between 1 and 2000),
  created_at timestamptz not null default now()
);

create index if not exists feedback_user_id_idx on public.feedback (user_id);

alter table public.feedback enable row level security;

-- Each trader can add feedback only as themselves. No select/update/delete policy, so nobody reads it through the app.
create policy "Traders can send feedback as themselves"
  on public.feedback for insert to authenticated
  with check (user_id = (select auth.uid()));

revoke all on table public.feedback from anon, authenticated;
grant insert on table public.feedback to authenticated;
