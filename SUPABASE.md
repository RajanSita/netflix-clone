# Supabase Setup Instructions

To enable the "My List" feature, you need to create a table in your Supabase database.

## SQL Schema

Run the following SQL in your Supabase SQL Editor:

```sql
create table saved_movies (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users not null,
  movie_id bigint not null,
  movie_data jsonb not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security
alter table saved_movies enable row level security;

-- Create policies
create policy "Users can insert their own saved movies"
  on saved_movies for insert
  with check (auth.uid() = user_id);

create policy "Users can view their own saved movies"
  on saved_movies for select
  using (auth.uid() = user_id);

create policy "Users can delete their own saved movies"
  on saved_movies for delete
  using (auth.uid() = user_id);
```

## Authentication

Make sure you have Email/Password provider enabled in the Supabase Auth settings.
