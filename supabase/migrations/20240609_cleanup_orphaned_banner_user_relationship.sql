-- Delete orphaned rows in banner_user_relationship where banner_id does not exist in banners
DELETE FROM public.banner_user_relationship
WHERE banner_id NOT IN (SELECT id FROM public.banners); 
