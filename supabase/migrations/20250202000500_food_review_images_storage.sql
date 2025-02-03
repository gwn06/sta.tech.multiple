insert into storage.buckets
  (id, name)
values
  ('food_review', 'food_review');


create policy "User can delete their own food_review objects"
on storage.objects
for delete
to authenticated
using (
    bucket_id = 'food_review' and (storage.foldername(name))[1] = auth.uid()::text 
);

create policy "User can insert food_review objects"
on storage.objects
for insert
to authenticated with check
(
    bucket_id = 'food_review' and (storage.foldername(name))[1] = auth.uid()::text 
);

create policy "User can read food_review objects"
on storage.objects
for select
to authenticated
using (
    bucket_id = 'food_review' and (storage.foldername(name))[1] = auth.uid()::text 
);

create policy "User can update their own food_review objects"
on storage.objects
for update
to authenticated
using (
    bucket_id = 'food_review' and (storage.foldername(name))[1] = auth.uid()::text 
);