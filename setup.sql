drop table if exists animation_commands;
drop table if exists animation_versions;
drop table if exists animations;

create table animations (
  id serial primary key,
  user_id uuid references auth.users not null default auth.uid(),
  name varchar not null,
  pointer bigint not null default 0,
  data jsonb default '{}'::jsonb,
  inserted_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table animation_commands (
  id serial primary key,
  user_id uuid references auth.users not null default auth.uid(),
  animation_id bigint references animations not null,
  index bigint not null,
  type varchar not null,
  args jsonb default '{}'::jsonb,
  previous jsonb default '{}'::jsonb,

  inserted_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table animation_versions (
  id serial primary key,
  user_id uuid references auth.users not null default auth.uid(),
  animation_id bigint references animations not null,
  name varchar not null,
  data jsonb default '{}'::jsonb,
  timestamp timestamp with time zone not null
);

create or replace function handle_updated_animation()
returns trigger as $$
begin
  insert into animation_versions (animation_id, user_id, name, data, timestamp)
  values (old.id, old.user_id, old.name, old.data, old.updated_at);

  return new;
end;
$$ language plpgsql security definer;

create trigger on_animation_updated
  after update on animations
  for each row execute procedure handle_updated_animation();

