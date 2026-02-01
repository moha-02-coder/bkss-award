# Guide de Migration vers la Base de Données Supabase

## 🎯 Objectif
Migrer l'application de localStorage vers une base de données Supabase pour permettre la synchronisation en temps réel entre l'administration et les utilisateurs.

## 📋 Prérequis

### 1. Compte Supabase
- Créer un compte sur [supabase.com](https://supabase.com)
- Créer un nouveau projet `bankass-awards`

### 2. Configuration du Projet
- Node.js installé
- Projet Next.js configuré

## 🚀 Étapes de Configuration

### Étape 1: Créer le fichier .env.local
Créez un fichier `.env.local` à la racine du projet avec:

```env
# Database
DATABASE_URL="postgresql://postgres:[VOTRE_MOT_DE_PASSE]@db.[VOTRE_PROJECT_ID].supabase.co:5432/postgres"

# Supabase
NEXT_PUBLIC_SUPABASE_URL="https://[VOTRE_PROJECT_ID].supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="[VOTRE_ANON_KEY]"
SUPABASE_SERVICE_ROLE_KEY="[VOTRE_SERVICE_ROLE_KEY]"
```

**Où trouver ces informations:**
1. Allez dans votre projet Supabase
2. Settings → Database → Connection string
3. Settings → API → Project URL + Keys

### Étape 2: Mettre à jour package.json
Ajoutez ces scripts à votre `package.json`:

```json
{
  "scripts": {
    "db:seed": "tsx scripts/seed-database.ts",
    "db:push": "npx prisma db push",
    "db:generate": "npx prisma generate"
  }
}
```

### Étape 3: Installer tsx pour exécuter TypeScript
```bash
npm install -D tsx
```

### Étape 4: Initialiser la base de données
```bash
# Générer le client Prisma
npm run db:generate

# Pousser le schéma vers Supabase
npm run db:push

# Initialiser les données
npm run db:seed
```

## 📊 Structure de la Base de Données

### Tables Créées:

#### `users`
- **id**: Identifiant unique
- **name**: Nom de l'utilisateur
- **email**: Email unique
- **password**: Mot de passe hashé
- **role**: VOTER ou SUPER_ADMIN
- **domain, city, phone**: Informations optionnelles

#### `categories`
- **id**: Identifiant unique
- **name**: Nom de la catégorie
- **subtitle**: Sous-titre
- **special**: Catégorie spéciale
- **is_leadership_prize**: Prix leadership
- **pre_assigned_winner***: Informations du gagnant prédéfini
- **leadership_revealed**: Statut de révélation

#### `candidates`
- **id**: Identifiant unique
- **category_id**: Référence à la catégorie
- **name**: Nom du candidat
- **alias**: Surnom optionnel
- **image**: URL de la photo
- **bio**: Biographie
- **achievements**: Réalisations
- **song_count**: Nombre de chansons
- **candidate_song**: Chanson candidate
- **audio_file**: Fichier audio

#### `votes`
- **id**: Identifiant unique
- **user_id**: Référence à l'utilisateur
- **category_id**: Référence à la catégorie
- **candidate_id**: Référence au candidat
- **candidate_name**: Nom du candidat (compatibilité)
- **timestamp**: Timestamp du vote

#### `sessions`
- **id**: Identifiant unique
- **user_id**: Référence à l'utilisateur
- **token**: Token de session
- **expires_at**: Date d'expiration

#### `admin_logs`
- **id**: Identifiant unique
- **user_id**: Référence à l'utilisateur
- **action**: Action effectuée
- **entity**: Type d'entité
- **entity_id**: ID de l'entité
- **old_values/new_values**: Valeurs avant/après
- **ip_address, user_agent**: Informations de connexion

#### `app_settings`
- **id**: Identifiant unique
- **key**: Clé du paramètre
- **value**: Valeur (JSON)

## 🔄 Migration des Données

### Données Initiales
Le script `seed-database.ts` va créer:
- ✅ 1 administrateur par défaut (`admin@bankassawards.com`)
- ✅ Toutes les catégories existantes
- ✅ Tous les candidats existants
- ✅ Paramètres d'application par défaut

### Synchronisation en Temps Réel
Une fois migré:
- Les modifications de l'admin sont immédiatement visibles par tous les utilisateurs
- Plus besoin de rafraîchir la page
- Les votes sont synchronisés instantanément

## 🛠️ API Routes Disponibles

### Utilisateurs
- `GET /api/users` - Lister tous les utilisateurs
- `POST /api/users` - Créer un utilisateur
- `PUT /api/users` - Mettre à jour un utilisateur
- `DELETE /api/users?id={id}` - Supprimer un utilisateur

### Catégories
- `GET /api/categories` - Lister toutes les catégories (avec candidats)
- `POST /api/categories` - Créer une catégorie
- `PUT /api/categories` - Mettre à jour une catégorie
- `DELETE /api/categories?id={id}` - Supprimer une catégorie

### Candidats
- `GET /api/candidates` - Lister tous les candidats
- `GET /api/candidates?categoryId={id}` - Candidats d'une catégorie
- `POST /api/candidates` - Créer un candidat
- `PUT /api/candidates` - Mettre à jour un candidat
- `DELETE /api/candidates?id={id}` - Supprimer un candidat

### Votes
- `GET /api/votes` - Lister tous les votes
- `POST /api/votes` - Ajouter un vote
- `DELETE /api/votes?id={id}` - Supprimer un vote

## 🎯 Prochaines Étapes

### 1. Mettre à jour les composants
Remplacer `useLocalStorage` par les hooks `use-api-data`:
- `useUsers()` au lieu de `useLocalStorage('users')`
- `useCategories()` au lieu de `useLocalStorage('categories')`
- `useVotes()` au lieu de `useLocalStorage('votes')`

### 2. Mettre à jour les composants principaux
- `app/page.tsx` - Utiliser les nouveaux hooks
- `components/admin-section.tsx` - Appeler les API
- `components/vote-section.tsx` - Voter via API
- `components/results-section.tsx` - Afficher les résultats depuis API

### 3. Tests
- Tester la création d'utilisateurs
- Tester la modification de catégories
- Tester le vote en temps réel
- Tester la révélation du prix leadership

## 🔒 Sécurité

- ✅ Mots de passe hashés avec bcrypt
- ✅ Validation des entrées
- ✅ Protection contre les votes multiples
- ✅ Logs d'administration
- ✅ Rôles et permissions

## 🚨 Dépannage

### Erreur: "Connection refused"
- Vérifiez votre DATABASE_URL
- Assurez-vous que le projet Supabase est actif

### Erreur: "Table does not exist"
- Exécutez `npm run db:push`
- Vérifiez que le schéma Prisma est correct

### Erreur: "Permission denied"
- Vérifiez vos clés Supabase
- Assurez-vous d'utiliser la bonne clé (anon vs service_role)

## 📞 Support

Pour toute question sur la migration:
1. Vérifiez les logs de la console
2. Consultez la documentation Supabase
3. Vérifiez que toutes les étapes ont été suivies correctement
