# Configuration de la Base de Données Supabase

## Étape 1 : Créer le fichier .env.local

Créez manuellement un fichier `.env.local` à la racine du projet avec ce contenu :

```env
# Database
DATABASE_URL="postgresql://postgres:[VOTRE_MOT_DE_PASSE]@db.[VOTRE_PROJECT_ID].supabase.co:5432/postgres"

# Supabase
NEXT_PUBLIC_SUPABASE_URL="https://[VOTRE_PROJECT_ID].supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="[VOTRE_ANON_KEY]"
SUPABASE_SERVICE_ROLE_KEY="[VOTRE_SERVICE_ROLE_KEY]"
```

## Étape 2 : Remplacer les placeholders

Remplacez les valeurs entre crochets `[]` par vos vraies informations Supabase :

- `[VOTRE_MOT_DE_PASSE]` : Le mot de passe de votre base de données
- `[VOTRE_PROJECT_ID]` : L'ID de votre projet Supabase
- `[VOTRE_ANON_KEY]` : Clé publique (trouvée dans Settings → API)
- `[VOTRE_SERVICE_ROLE_KEY]` : Clé service (trouvée dans Settings → API)

## Étape 3 : Installer les dépendances Supabase

```bash
npm install @supabase/supabase-js
```

## Étape 4 : Générer le client Prisma

Une fois le fichier .env.local créé :

```bash
npx prisma generate
npx prisma db push
```

## Étape 5 : Structure des tables

Le schéma Prisma créera automatiquement ces tables :

### Tables principales :
- **users** : Utilisateurs et administrateurs
- **categories** : Catégories de votes
- **candidates** : Candidats par catégorie
- **votes** : Votes des utilisateurs
- **sessions** : Sessions d'authentification
- **admin_logs** : Logs d'administration
- **app_settings** : Paramètres de l'application

### Relations :
- Un utilisateur peut voter une fois par catégorie
- Une catégorie contient plusieurs candidats
- Les votes sont liés aux utilisateurs, catégories et candidats

## Étape 6 : Migration des données existantes

Les données du localStorage seront automatiquement migrées vers la base de données lors de la première utilisation.

## Sécurité

- Les mots de passe sont hashés avec bcrypt
- Les sessions ont une expiration
- Les actions d'administration sont loggées
- L'accès est contrôlé par rôles (VOTER / SUPER_ADMIN)
