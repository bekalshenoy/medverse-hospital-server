insert into "User"("userId", name, password, role)
values ('admin', 'admin', '$2a$10$WWdBeFs7WcOFG0G88WVnbOP8NR2fw.FkkSXNpQkxCqSmP3e8eajk6', 'ROLE_ADMIN')
on conflict do nothing;
insert into "User"("userId", name, password, role)
values ('doctor@doctor.com', 'doctor', '$2a$10$WWdBeFs7WcOFG0G88WVnbOP8NR2fw.FkkSXNpQkxCqSmP3e8eajk6',
        'ROLE_DOCTOR')
on conflict do nothing;