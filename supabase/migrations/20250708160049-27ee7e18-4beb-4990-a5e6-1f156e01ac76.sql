-- Remove all menu management tables and related functionality

-- Drop menu-related tables in correct order (considering dependencies)
DROP TABLE IF EXISTS public.menu_items CASCADE;
DROP TABLE IF EXISTS public.menu_choices CASCADE;
DROP TABLE IF EXISTS public.menu_sections CASCADE;
DROP TABLE IF EXISTS public.menu_selections CASCADE;
DROP TABLE IF EXISTS public.menu_options CASCADE;

-- Drop any menu-related functions
DROP FUNCTION IF EXISTS public.update_menu_choice_category_order_updated_at() CASCADE;