alter table staclara_todos enable row level security;
create policy "Individuals can create todos." on staclara_todos for
    insert with check (auth.uid() = user_id);
create policy "Individuals can view their own todos. " on staclara_todos for
    select using (auth.uid() = user_id);
create policy "Individuals can update their own todos." on staclara_todos for
    update using (auth.uid() = user_id);
create policy "Individuals can delete their own todos." on staclara_todos for
    delete using (auth.uid() = user_id);