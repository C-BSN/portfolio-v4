# 🎌 Portfolio v4 - Design Manga/Anime

Portfolio créatif avec un design minimaliste inspiré du style manga/anime, combinant contenu professionnel et effets visuels modernes.

## 🚀 Démarrage rapide

```bash
# Installer les dépendances
npm install

# Lancer le serveur de développement
npm run dev

# Construire pour production
npm run build

# Démarrer en production
npm start
```

Le site sera accessible sur **http://localhost:3000**

## ✨ Fonctionnalités

- 🎨 **Design Manga/Anime** - Style minimaliste et élégant
- ✨ **Animations Fluides** - Framer Motion pour des transitions professionnelles
- 🖱️ **Smooth Scroll** - Défilement fluide avec Lenis
- 📱 **Responsive** - Adapté à tous les écrans
- 📝 **CMS Markdown** - Gestion de contenu simple avec des fichiers .md
- 🖼️ **Galeries Projets** - Présentation interactive de vos réalisations
- ⚡ **Next.js 15** - Performance optimale avec Turbopack

## 📂 Structure

```
.
├── src/
│   ├── app/                 # Pages Next.js
│   │   ├── page.tsx         # Accueil
│   │   ├── about/           # Page À propos
│   │   ├── projects/        # Page Projets
│   │   └── layout.tsx       # Layout global
│   ├── components/
│   │   ├── manga/           # Composants design manga
│   │   └── layout/          # Header et Footer
│   ├── lib/                 # Utilitaires et helpers
│   └── styles/              # Styles globaux
├── content/
│   ├── pages/               # Contenu des pages (Markdown)
│   └── projects/            # Contenu des projets (Markdown)
├── public/                  # Images et assets statiques
└── package.json
```

## 🎨 Composants Manga

### Hero
Section hero avec titre animé et effets de parallaxe au scroll.

### StackMarquee
Défilement horizontal infini des compétences et technologies.

### Projects
Grille de projets avec cartes interactives et effets au survol.

### SmoothScroll
Wrapper pour un défilement fluide sur toute l'application.

## 📝 Gestion du contenu

### Ajouter une page

Créez un fichier `.md` dans `/content/pages/` :

```markdown
---
title: Titre de la page
subtitle: Sous-titre
---

Contenu de la page en Markdown...
```

### Ajouter un projet

Créez un fichier `.md` dans `/content/projects/` :

```markdown
---
title: Nom du projet
date: 2024-01-15
project_type:
  - Design
  - Photographie
tools:
  - Photoshop
  - Illustrator
featured_image: /images/projet.jpg
---

Description du projet...
```

## 🎨 Personnalisation

### Couleurs

Les couleurs principales sont définies dans `/src/app/globals.css` :
- Fond : `#050505` (noir profond)
- Texte : `#F0F0F0` (blanc cassé)

### Typographie

Police principale : **Oswald** (Google Fonts)
Style : uppercase, tracking-wide pour l'effet manga

### Effets spéciaux

- `.text-outline` : Texte avec contour blanc
- `.text-outline-thick` : Texte avec contour épais

## 🛠️ Technologies

- **Next.js 15** - Framework React
- **TypeScript** - Typage statique
- **Tailwind CSS** - Styles utilitaires
- **Framer Motion** - Animations
- **Lenis** - Smooth scroll
- **Markdown** - Gestion de contenu
- **Turbopack** - Build ultra-rapide

## 📱 Pages

- **/** - Accueil avec hero, présentation et projets sélectionnés
- **/about** - À propos avec profil, compétences et stats
- **/projects** - Galerie complète des projets
- **/projects/[slug]** - Page détail d'un projet

## 🚀 Déploiement

### Netlify

```bash
npm run build
# Déployer le dossier .next
```

### Vercel

```bash
vercel deploy
```

## 📄 License

© 2026 Corentin Basson - Portfolio personnel

---

Développé avec ❤️ en utilisant Next.js et le design manga/anime
