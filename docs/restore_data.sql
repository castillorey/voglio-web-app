-- =============================================
-- Voglio — Restore Old Data
-- Run this AFTER creating an account and getting your new user UUID
-- =============================================

-- STEP 1: Get your new user UUID
-- Run this in Supabase SQL Editor after signing up:
-- SELECT auth.uid();
-- Copy the resulting UUID (e.g., 'abc123...')

-- STEP 2: Replace '915b2d04-ffd2-401f-80f1-86b3af7743de' below and uncomment


-- Categories
INSERT INTO public.category (id, created_at, name, description, is_private, user_id, emoji_code) VALUES
    (4,  '2025-02-06 20:23:58.508596+00', 'Everyday',         'Everyday wishes',             false, '915b2d04-ffd2-401f-80f1-86b3af7743de', '🎠'),
    (5,  '2025-02-07 20:59:38.151021+00', 'Christmas',        'My christmas wish list',      false, '915b2d04-ffd2-401f-80f1-86b3af7743de', '🎄'),
    (7,  '2025-02-07 21:45:26.233018+00', 'Test',             'This is a test category',     false, '915b2d04-ffd2-401f-80f1-86b3af7743de', '❔'),
    (2,  '2025-02-06 00:03:43.786816+00', 'Birthday',         'Here will go all my birthday wishes', false, '915b2d04-ffd2-401f-80f1-86b3af7743de', '☘️'),
    (8,  '2025-02-19 22:36:02.640029+00', 'My awesome category', 'awesome category I built to myself', true, '915b2d04-ffd2-401f-80f1-86b3af7743de', '🖐🏼'),
    (9,  '2025-02-19 22:43:59.77471+00',  'Black hole',       'What could be inside?',        true, '915b2d04-ffd2-401f-80f1-86b3af7743de', '🕳️'),
    (10, '2025-02-19 22:57:45.216378+00', '',                 '',                             false, '915b2d04-ffd2-401f-80f1-86b3af7743de', '❔'),
    (11, '2025-09-29 21:43:43.696593+00', 'NN',               '',                             true, '915b2d04-ffd2-401f-80f1-86b3af7743de', '❔'),
    (12, '2025-09-30 17:55:59.657227+00', 'Ejemplo',          'Lovely collection',            true, '915b2d04-ffd2-401f-80f1-86b3af7743de', '💟')
ON CONFLICT (id) DO NOTHING;

SELECT setval('public.category_id_seq', (SELECT max(id) FROM public.category));

-- Voglios (items)
-- Note: old image URLs point to the deactivated project, so images are lost.
-- You can upload new images and update the image_url later.
INSERT INTO public.voglio (id, created_at, name, notes, category_id, reference_link, size_id, image_url, user_id, quantity) VALUES
    (25, '2025-02-06 19:39:37.956583+00', 'Gorra Yankees', 'Buzo negro', 2,
     'https://www.ker-sun.es/products/t-shirt-anti-uv-enfant-manches-longues-solid-streak-quiksilver', 3,
     'https://useejgiprosrfiabgukn.supabase.co/storage/v1/object/public/images/915b2d04-ffd2-401f-80f1-86b3af7743de/placeholder',
     '915b2d04-ffd2-401f-80f1-86b3af7743de', 1),
    (27, '2025-09-30 17:56:31.349242+00', 'Test', '', 9, '', NULL, '',
     '915b2d04-ffd2-401f-80f1-86b3af7743de', 1)
ON CONFLICT (id) DO NOTHING;

SELECT setval('public.voglio_id_seq', (SELECT max(id) FROM public.voglio));

