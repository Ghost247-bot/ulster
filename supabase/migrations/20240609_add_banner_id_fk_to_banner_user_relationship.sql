-- Add missing foreign key from banner_user_relationship.banner_id to banners.id
ALTER TABLE public.banner_user_relationship
ADD CONSTRAINT banner_user_relationship_banner_id_fkey
FOREIGN KEY (banner_id)
REFERENCES public.banners(id)
ON DELETE CASCADE; 

SELECT banner_id
FROM banner_user_relationship
WHERE banner_id NOT IN (SELECT id FROM banners); 

DELETE FROM banner_user_relationship
WHERE banner_id NOT IN (SELECT id FROM banners); 