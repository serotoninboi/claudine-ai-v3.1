# PixelForge v2.0 - Guide de Déploiement

Cette version de PixelForge est optimisée pour la production avec un design Cyber-Noir amélioré, une persistance des données via Prisma et un système de gestion de crédits.

## 🚀 Étapes de Déploiement

### 1. Base de Données (PostgreSQL)
Vous avez besoin d'une instance PostgreSQL. Nous recommandons :
- **Supabase** (Gratuit/Payant)
- **Neon.tech** (Serverless PostgreSQL)
- **Railway** (Facile à configurer)

Récupérez votre `NEXT_PUBLIC_SUPABASE_URL` (ex: `postgresql://user:password@host:port/dbname`).

### 2. Configuration des Variables d'Environnement
Créez un fichier `.env` à la racine du projet (ou configurez-les sur votre plateforme de déploiement) :

```env
# Base de données
NEXT_PUBLIC_SUPABASE_URL="votre_url_postgresql"

# Hugging Face (pour l'IA)
HUGGINGFACE_TOKEN="votre_token_hf"

# Authentification
JWT_SECRET="une_cle_secrete_tres_longue_et_aleatoire"

# Environnement
NODE_ENV="production"
```

### 3. Initialisation de la Base de Données
Avant de lancer l'application, vous devez synchroniser le schéma Prisma avec votre base de données :

```bash
npx prisma generate
npx prisma db push
```

### 4. Déploiement sur Vercel (Recommandé)
1. Poussez votre code sur un dépôt GitHub.
2. Connectez votre dépôt à Vercel.
3. Ajoutez les variables d'environnement ci-dessus dans les paramètres Vercel.
4. Vercel détectera automatiquement Next.js et lancera le build.

## 🛠️ Améliorations de la v2.0
- **Design Cyber-Noir** : Interface immersive avec effets de flou (glassmorphism) et accents néon.
- **Système de Crédits** : Chaque utilisateur commence avec 10 crédits. Les générations déduisent des crédits.
- **Persistance DB** : Les utilisateurs et les générations sont stockés de manière permanente.
- **Page Tarification** : Structure prête pour l'intégration de processeurs de paiement (SegPay, Epoch).
- **Sécurité** : Authentification JWT robuste et protection des routes API.

## 🔞 Note sur le Contenu Adulte
Pour le déploiement de contenu adulte, assurez-vous de :
1. Utiliser un processeur de paiement compatible (SegPay, CCBill).
2. Ajouter les mentions légales requises (2257 compliance aux USA, etc.).
3. Configurer les filtres de contenu si nécessaire sur vos modèles d'IA.
