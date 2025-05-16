CREATE POLICY \
Allow
authenticated
users
to
upload
avatars\ ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'avatars'); CREATE POLICY \Allow
public
to
view
avatars\ ON storage.objects FOR SELECT TO public USING (bucket_id = 'avatars');
