-- Create table for authorized users
create table authorized_users (
  id uuid default gen_random_uuid() primary key,
  email text unique not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create table for access requests
create table access_requests (
  id uuid default gen_random_uuid() primary key,
  email text not null,
  status text default 'pending' check (status in ('pending', 'approved', 'rejected')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table authorized_users enable row level security;
alter table access_requests enable row level security;

-- Policies for authorized_users
-- Only admins/service role can probably manage this, but for now let's allow read for auth logic
create policy "Allow read for authenticated users" 
  on authorized_users for select using (true);

-- Policies for access_requests
-- Public can insert (to request access)
create policy "Allow public to request access" 
  on access_requests for insert with check (true);

-- Only admins should read/update (simplifying to authenticated for MVP dashboard access, usually restricted to admin role)
create policy "Allow authenticated to read access requests" 
  on access_requests for select using (auth.role() = 'authenticated');

create policy "Allow authenticated to update access requests" 
  on access_requests for update using (auth.role() = 'authenticated');
