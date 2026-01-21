-- Insert the admin and your personal email into the authorized_users whitelist
insert into authorized_users (email) values 
('admin@luxemarket.com'),
('sanskritiagarwal6@gmail.com')
on conflict (email) do nothing;
