-- Security hardening for private body-photo storage.
-- Storage object names must be exactly <authenticated-user-id>/<filename>.
-- This prevents nested/path-like names from escaping the owner's namespace.

drop policy if exists "owner all photos" on storage.objects;

create policy "owner photo objects" on storage.objects
  for all
  using (
    bucket_id = 'body-photos'
    and auth.uid() is not null
    and auth.uid()::text = (storage.foldername(name))[1]
    and coalesce(array_length(storage.foldername(name), 1), 0) = 1
    and storage.filename(name) ~ '^[A-Za-z0-9_-]{1,128}$'
  )
  with check (
    bucket_id = 'body-photos'
    and auth.uid() is not null
    and auth.uid()::text = (storage.foldername(name))[1]
    and coalesce(array_length(storage.foldername(name), 1), 0) = 1
    and storage.filename(name) ~ '^[A-Za-z0-9_-]{1,128}$'
  );
