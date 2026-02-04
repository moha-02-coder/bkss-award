-- Script pour créer l'administrateur principal
-- À exécuter directement dans l'éditeur SQL Supabase

-- D'abord, vérifier si l'admin existe déjà
SELECT * FROM users WHERE email = 'winnerboys@bankassaward.com';

-- Si l'admin n'existe pas, le créer
-- Le mot de passe 'winnerboys' hashé
INSERT INTO users (
  name,
  email,
  password,
  role,
  domain,
  city,
  phone,
  created_at,
  updated_at
) VALUES (
  'Administrateur Principal',
  'winnerboys@bankassaward.com',
  '$2b$10$TIiW0AE4qkpdufBvcRNXMec4SQMdE67WUPVqrw5HgAdujLFssLKCW', -- hash de 'winnerboys'
  'SUPER_ADMIN',
  'Administration',
  'Bamako',
  '+22300000000',
  NOW(),
  NOW()
) ON CONFLICT (email) DO NOTHING;

-- Vérifier la création
SELECT * FROM users WHERE email = 'winnerboys@bankassaward.com';
