# Portfolio Template - Graphiste Freelance

Un template moderne et professionnel pour créer un portfolio de graphiste freelance utilisant Next.js, Tailwind CSS et Decap CMS.

## 🚀 Fonctionnalités

- ✅ **Next.js 15** avec App Router
- ✅ **Tailwind CSS 3.x** pour le styling
- ✅ **shadcn/ui** pour les composants
- ✅ **Decap CMS** pour la gestion de contenu
- ✅ **Cloudinary** pour les images
- ✅ **TypeScript** pour la robustesse
- ✅ **Responsive design** mobile-first
- ✅ **Export statique** pour Netlify
- ✅ **SEO optimisé**
- ✅ **Authentification GitHub** (simple et gratuite)

## 📋 Prérequis

- Node.js 18+ (Télécharger depuis le web si utilisation en local)
- pnpm (recommandé)
- Un compte GitHub
- Un compte Netlify
- Un compte Cloudinary (gratuit)

## 🛠️ Installation

### 1. Cloner le repository

```bash
git clone https://github.com/massa974/foliobase
cd foliobase
```

### 2. Installer les dépendances

```bash
pnpm install
```

### 3. Configurer Cloudinary

1. Créez un compte sur [Cloudinary](https://cloudinary.com/)
2. Récupérez votre `cloud_name` et `api_key` dans le dashboard
3. Modifiez `public/admin/config.yml` :

```yaml
media_library:
  name: cloudinary
  config:
    cloud_name: VOTRE_CLOUD_NAME
    api_key: VOTRE_API_KEY
```

### 4. Configurer le repository GitHub

1. Modifiez `public/admin/config.yml` avec votre repository :

```yaml
backend:
  name: github
  repo: votre-username/nom-du-repository
  branch: main
```

### 5. Lancer le serveur de développement

```bash
# Terminal 1 : Serveur Decap CMS (pour le développement local)
npx decap-server

# Terminal 2 : Application Next.js
pnpm dev
```

Ouvrez [http://localhost:3000](http://localhost:3000) pour voir votre portfolio.
Accédez à [http://localhost:3000/admin](http://localhost:3000/admin) pour le CMS.

## 🌐 Déploiement sur Netlify

### 1. Pousser sur GitHub

```bash
git add .
git commit -m "Initial commit"
git push origin main
```

### 2. Connecter à Netlify

1. Allez sur [Netlify](https://netlify.com)
2. Cliquez sur "New site from Git"
3. Connectez votre repository GitHub
4. Configuration :
   - **Build command**: `pnpm build`
   - **Publish directory**: `out`

### 3. Configurer l'authentification GitHub

#### ⚠️ **Important :** Ce template utilise **Netlify Functions** pour l'authentification GitHub OAuth.

#### Configuration en 3 étapes

**Étape 1 : Créer une GitHub OAuth App**

1. Allez sur GitHub : **Settings** → **Developer settings** → **OAuth Apps** → **New OAuth App**
2. Configuration :
   - **Application name** : `Portfolio CMS Auth`
   - **Homepage URL** : `https://votre-site.netlify.app` (Remplacer par la véritable url)
   - **Authorization callback URL** : `https://votre-site.netlify.app/.netlify/functions/auth-callback`
3. Notez le **Client ID** et générez un **Client Secret**

**Étape 2 : Configurer les variables d'environnement**

Sur votre dashboard Netlify :
1. **Site settings** → **Environment variables**
2. Ajoutez ces 2 variables :
   - `GITHUB_CLIENT_ID` = votre_client_id
   - `GITHUB_CLIENT_SECRET` = votre_client_secret

**Étape 3 : Redéployer**

Les Netlify Functions sont déjà incluses dans le template. Un redéploiement activera l'authentification.

**Comment ça marche :**
1. Les utilisateurs vont sur `https://votre-site.netlify.app/admin`
2. Ils cliquent sur "Login with GitHub"
3. Redirection vers nos Netlify Functions qui gèrent l'OAuth
4. Une fois autorisé, l'utilisateur peut modifier le contenu

#### Permissions requises

Les utilisateurs doivent avoir **accès en écriture** au repository GitHub pour pouvoir modifier le contenu :
- **Propriétaire** : Accès complet automatique
- **Collaborateurs** : Ajouter via GitHub Settings > Manage access > Invite a collaborator
- **Membres d'organisation** : Configurer les permissions au niveau de l'organisation

## 🔄 Comment fonctionne le système

### Workflow complet

```
[Utilisateur] → [CMS /admin] → [Commit GitHub] → [Netlify détecte] → [Rebuild auto] → [Site mis à jour]
```

**1. Création de contenu**
- L'utilisateur ajoute un projet via `/admin`
- Decap CMS génère un fichier `.md` dans `content/projects/`
- **Commit automatique** vers GitHub avec message descriptif

**2. Mise à jour automatique**
- Netlify détecte le nouveau commit
- **Rebuild automatique** du site (2-5 minutes)
- Le nouveau projet apparaît sur le site

**3. Persistence**
- ✅ Fichiers `.md` versionnés sur GitHub
- ✅ Images sauvegardées sur Cloudinary
- ✅ Aucune perte de données

### Architecture technique

- **Frontend** : Next.js 15 en mode SSG (Static Site Generation)
- **CMS** : Decap CMS avec authentification Netlify Functions
- **Contenu** : Fichiers Markdown dans le repository
- **Images** : Cloudinary pour l'optimisation
- **Déploiement** : Netlify avec rebuild automatique

## ✏️ Utilisation du CMS

### Accéder au CMS

- **En local**: `http://localhost:3000/admin`
- **En production**: `https://votre-site.netlify.app/admin`

### Première connexion

1. Allez sur `/admin` de votre site déployé
2. Cliquez sur **"Login with GitHub"**
3. Autorisez l'application à accéder à votre repository
4. ✅ Vous pouvez maintenant créer et modifier du contenu !

### Gérer le contenu

#### Pages statiques

- **Accueil**: Titre, sous-titre, description, bouton CTA
- **À propos**: Bio, compétences, photo de profil

#### Projets

- **Informations générales**: Titre, client, type, statut
- **Médias**: Image principale, galerie d'images
- **Fichiers**: PDF portfolio (< 20MB recommandé)
- **Description**: Contenu Markdown riche

### Structure des fichiers

```
content/
├── pages/
│   ├── homepage.md
│   └── about.md
└── projects/
    ├── 2024-01-15-mon-premier-projet.md
    └── 2024-02-20-identite-visuelle-startup.md
```

## 👥 Gestion des utilisateurs

### Ajouter des utilisateurs (pour les enseignants)

Pour permettre à vos étudiants d'accéder au CMS :

1. **Repository privé** : Ajoutez-les comme collaborateurs
   - GitHub Repository > Settings > Manage access
   - Invite a collaborator
   - Rôle : **Write** (pour modifier le contenu)

2. **Repository public** : Les étudiants peuvent fork
   - Ils créent leur propre repository
   - Modifient la config avec leur repository
   - Déploient leur propre version

### Permissions par défaut

- ✅ **Propriétaire** : Accès complet
- ✅ **Collaborateurs Write** : Peut créer/modifier le contenu
- ❌ **Collaborateurs Read** : Lecture seule (pas d'accès CMS)

## 🎨 Personnalisation

### Couleurs et thème

Modifiez `tailwind.config.js` pour personnaliser les couleurs :

```js
theme: {
  extend: {
    colors: {
      primary: {
        // Vos couleurs personnalisées
      },
    },
  },
},
```

### Logo et favicon

- Remplacez le logo dans `src/components/layout/header.tsx`
- Ajoutez votre favicon dans `public/`

### Métadonnées

Modifiez `src/app/layout.tsx` pour vos informations :

```tsx
export const metadata: Metadata = {
  title: "Votre Nom - Graphiste Freelance",
  description: "Votre description personnalisée",
  // ...
}
```

## 📁 Structure du projet

```
src/
├── app/                    # Pages Next.js
│   ├── about/             # Page à propos
│   ├── projects/          # Pages projets
│   │   ├── [slug]/        # Pages projet individuelles
│   │   ├── page.tsx       # Liste des projets
│   │   └── projects-client.tsx # Composant client (filtres)
│   ├── layout.tsx         # Layout principal
│   └── page.tsx           # Page d'accueil
├── components/
│   ├── layout/            # Header, Footer
│   └── ui/                # Composants shadcn/ui
└── lib/
    ├── content.ts         # Utilitaires contenu (SSG)
    └── utils.ts           # Utilitaires shadcn

netlify/
└── functions/             # Authentification OAuth
    ├── auth.js           # Initiation OAuth GitHub
    └── auth-callback.js  # Callback OAuth GitHub

content/                   # Contenu Markdown
├── pages/                 # Pages statiques
│   ├── homepage.md       # Contenu page d'accueil
│   └── about.md          # Contenu page à propos
└── projects/              # Projets (créés via CMS)
    └── YYYY-MM-DD-titre-projet.md

public/
├── admin/                 # Configuration Decap CMS
│   ├── index.html        # Interface CMS
│   └── config.yml        # Configuration backend GitHub
└── uploads/               # Fallback pour gros fichiers
```

## 🔧 Scripts disponibles

```bash
# Développement
pnpm dev                   # Serveur de développement

# Build et déploiement
pnpm build                 # Build de production
pnpm start                 # Serveur de production

# CMS local
npx decap-server          # Serveur CMS pour développement

# Linting
pnpm lint                 # Vérification du code
```

## 📝 Bonnes pratiques

### Images

- **Formats supportés**: JPG, PNG, WebP, GIF
- **Taille recommandée**: 
  - Images principales : 1200x800px
  - Galeries : 800x600px
  - Photos de profil : 400x400px

### PDF

- **Taille maximale recommandée**: 20MB
- **Formats acceptés**: PDF uniquement
- **Utilisation**: CV, portfolios, présentations

### Contenu

- **Titres**: Courts et percutants
- **Descriptions**: 150-200 caractères pour les extraits
- **Mots-clés**: Utilisez des termes pertinents pour le SEO

## 🆘 Dépannage

### Problèmes courants

#### Erreur `"GITHUB_CLIENT_ID not configured"`
- **Cause** : Variables d'environnement manquantes sur Netlify
- **Solution** : 
  1. Vérifiez **Site settings** → **Environment variables**
  2. Ajoutez `GITHUB_CLIENT_ID` et `GITHUB_CLIENT_SECRET`
  3. Redéployez le site

#### Erreur 401 (Unauthorized) lors de la connexion
- **Cause** : Configuration OAuth incorrecte
- **Solution** :
  1. Vérifiez l'URL de callback dans votre GitHub OAuth App
  2. Doit être : `https://votre-site.netlify.app/.netlify/functions/auth-callback`
  3. Vérifiez que vous avez les permissions sur le repository

#### Le CMS ne charge pas en local
- Vérifiez que `npx decap-server` fonctionne sur le port 8081
- Vérifiez la configuration du repository dans `config.yml`
- Assurez-vous d'avoir les permissions d'écriture sur le repository

#### "Error loading the CMS configuration"
- Vérifiez la syntaxe YAML dans `public/admin/config.yml`
- Assurez-vous que le repository GitHub existe et est accessible
- Vérifiez que la branche configurée existe (main/dev)

#### Les nouveaux projets n'apparaissent pas
- **Délai normal** : 2-5 minutes pour le rebuild automatique
- Vérifiez les **Deploy logs** sur Netlify pour voir si le build réussit
- Vérifiez que le commit a bien été fait sur GitHub

#### Images qui ne s'affichent pas
- Vérifiez votre configuration Cloudinary
- Assurez-vous que les clés API sont correctes
- Vérifiez les permissions du dossier Cloudinary

#### Erreur sur les caractères spéciaux dans les titres
- **Normal** : Les slugs avec accents sont supportés
- Si problème persistant, évitez les caractères spéciaux dans les titres

#### "Failed to persist entry"
- L'utilisateur n'a pas les permissions d'écriture sur le repository
- Ajoutez l'utilisateur comme collaborateur avec le rôle "Write"
- Vérifiez que le repository n'est pas en mode "Read-only"

## 🎓 Guide pour les étudiants

### Configuration rapide

1. **Forkez** ce repository
2. **Modifiez** `public/admin/config.yml` avec votre repository :
   ```yaml
   backend:
     name: github
     repo: votre-username/portfolio-template
     branch: main # ou dev selon votre branche principale
   ```
3. **Configurez** Cloudinary avec vos clés
4. **Déployez** sur Netlify (première fois)
5. **Créez une GitHub OAuth App** :
   - Homepage URL : `https://votre-site.netlify.app`
   - Callback URL : `https://votre-site.netlify.app/.netlify/functions/auth-callback`
6. **Ajoutez les variables d'environnement** sur Netlify :
   - `GITHUB_CLIENT_ID` et `GITHUB_CLIENT_SECRET`
7. **Redéployez** le site
8. **Accédez** à `/admin` et connectez-vous avec GitHub ✅

### Workflow recommandé

1. 📝 **Développement local** avec `pnpm dev`
2. ✨ **Ajout de contenu** via `/admin`
3. 🚀 **Push automatique** vers GitHub
4. 🌐 **Déploiement automatique** sur Netlify

## 🔄 Migration depuis Netlify Identity

Si vous avez un projet existant avec Netlify Identity :

### Étapes de migration

1. **Sauvegardez** vos utilisateurs Netlify Identity
2. **Modifiez** `public/admin/config.yml` :
   ```yaml
   # Remplacez :
   backend:
     name: git-gateway
     branch: main
   
   # Par :
   backend:
     name: github
     repo: username/repository-name
     branch: main
   ```
3. **Ajoutez les Netlify Functions** (incluses dans ce template)
4. **Configurez GitHub OAuth App** et variables d'environnement
5. **Redéployez** votre site
6. **Informez** les utilisateurs de se connecter avec GitHub

### Avantages de notre implémentation

- ✅ **Authentification robuste** avec Netlify Functions
- ✅ **100% gratuit** (dans les limites Netlify)
- ✅ **Pas de dépendance** aux services dépréciés  
- ✅ **Formation complète** OAuth + Functions pour les étudiants
- ✅ **Performance optimale** avec SSG
- ✅ **Sécurisé** par défaut

## 📚 Ressources

- [Documentation Next.js](https://nextjs.org/docs)
- [Documentation Decap CMS](https://decapcms.org/docs/)
- [Documentation Tailwind CSS](https://tailwindcss.com/docs)
- [Composants shadcn/ui](https://ui.shadcn.com/)
- [Documentation Cloudinary](https://cloudinary.com/documentation)
- [Guide Netlify](https://docs.netlify.com/)
- [Netlify Functions](https://docs.netlify.com/functions/overview/)
- [GitHub OAuth Apps](https://docs.github.com/en/developers/apps/building-oauth-apps)
- [Guide GitHub Collaborators](https://docs.github.com/en/account-and-profile/setting-up-and-managing-your-personal-account-on-github/managing-access-to-your-personal-repositories/inviting-collaborators-to-a-personal-repository)

## 📄 Licence

Ce template est sous licence MIT. Vous êtes libre de l'utiliser pour vos projets personnels et commerciaux.

---

**✨ Architecture 2025 : Netlify Functions + GitHub OAuth**
**Authentification moderne, sécurisée et 100% gratuite avec rebuild automatique SSG.**

**Créé avec ❤️ pour les étudiants en design graphique**

### 🎯 **Ce qui rend ce template unique**

- **🔐 OAuth complet** : Authentification GitHub via Netlify Functions
- **⚡ SSG optimisé** : Performance maximale avec rebuild automatique  
- **🎨 Interface moderne** : shadcn/ui + Tailwind CSS
- **📝 CMS intuitif** : Decap CMS pour une expérience utilisateur parfaite
- **🚀 Prêt à déployer** : Configuration en 10 minutes chrono
