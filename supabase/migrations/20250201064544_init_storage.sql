insert into storage.buckets
  (id, name )
values
  ('drivelite', 'drivelite');

create policy "User can delete their own objects"
on storage.objects
for delete
to authenticated
using (
    bucket_id = 'drivelite' and (storage.foldername(name))[1] = auth.uid()::text 
);

create policy "User can insert objects"
on storage.objects
for insert
to authenticated with check
(
    bucket_id = 'drivelite' and (storage.foldername(name))[1] = auth.uid()::text 
);

create policy "User can read objects"
on storage.objects
for select
to authenticated
using (
    bucket_id = 'drivelite' and (storage.foldername(name))[1] = auth.uid()::text 
);

create policy "User can update their own objects"
on storage.objects
for update
to authenticated
using (
    bucket_id = 'drivelite' and (storage.foldername(name))[1] = auth.uid()::text 
);