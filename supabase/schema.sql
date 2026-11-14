create extension if not exists "pgcrypto";

create table if not exists roles (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  description text default 'ריכוז ידע, מחזורים והעברות מקל',
  handover_message text,
  handover_author text,
  sort_order int default 0
);

create table if not exists cycles (
  id uuid primary key default gen_random_uuid(),
  role_id uuid not null references roles(id) on delete cascade,
  name text not null,
  officer_name text,
  officer_phone text,
  created_at timestamptz default now()
);

create table if not exists files (
  id uuid primary key default gen_random_uuid(),
  cycle_id uuid not null references cycles(id) on delete cascade,
  role_id uuid not null references roles(id) on delete cascade,
  category text not null check (category in ('format','handover')),
  title text not null,
  uploader_name text not null,
  file_name text not null,
  file_size bigint,
  mime_type text,
  storage_path text not null,
  public_url text,
  created_at timestamptz default now()
);

alter table roles enable row level security;
alter table cycles enable row level security;
alter table files enable row level security;

create policy "roles all" on roles for all using (true) with check (true);
create policy "cycles all" on cycles for all using (true) with check (true);
create policy "files all" on files for all using (true) with check (true);

insert into storage.buckets (id, name, public, file_size_limit)
values ('knowledge-files', 'knowledge-files', true, 52428800)
on conflict (id) do nothing;

create policy "kf read" on storage.objects for select using (bucket_id = 'knowledge-files');
create policy "kf insert" on storage.objects for insert with check (bucket_id = 'knowledge-files');
create policy "kf delete" on storage.objects for delete using (bucket_id = 'knowledge-files');

insert into roles (slug, name, sort_order) values
 ('agam','ק. אג"מ',1),('kalag','קל"ג',2),('kamat','קמ"ת',3),('kahad','קה"ד',4),
 ('kafah-digital','קפ"ח דיגיטל',5),('simulations','ק. סימולציות',6),
 ('kachom','קחו"ם',7),('kaag','קא"ג',8)
on conflict (slug) do nothing;

insert into cycles (role_id, name)
select id, 'ארז 94' from roles
where not exists (select 1 from cycles c where c.role_id = roles.id and c.name = 'ארז 94');
