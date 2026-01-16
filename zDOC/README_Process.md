# Guide des Bonnes Pratiques - Portfolio Template
## Référence pour l'IA - Interactions avec les Étudiants

Ce document doit être consulté à **chaque requête** d'un étudiant pour assurer la cohérence, la qualité et la maintenabilité du code généré.

---

## 🎯 Principes Généraux

### 1. **Toujours partir de l'existant**
- **JAMAIS** créer un nouveau fichier sans vérifier s'il existe déjà un fichier similaire
- **TOUJOURS** modifier les fichiers existants plutôt que d'en créer de nouveaux, quand pertinent
- **ANALYSER** la structure actuelle avant toute modification

### 2. **Approche non-technique pour les étudiants**
- Expliquer **POURQUOI** chaque modification est nécessaire
- Utiliser un langage simple et pédagogique
- Proposer des alternatives et expliquer les implications
- **CHALLENGER** les demandes inappropriées de manière constructive

---

## 🎨 Gestion des Couleurs et Styles

### Règles strictes pour les couleurs

#### ✅ **À FAIRE**
```css
/* TOUJOURS définir les couleurs dans src/app/globals.css */
:root {
  --brand-primary: 220 70% 50%;
  --brand-secondary: 160 60% 45%;
  --accent-color: 30 80% 55%;
}

/* Puis les utiliser via Tailwind */
.brand-primary { @apply bg-[hsl(var(--brand-primary))] }
```

#### ❌ **À ÉVITER**
```tsx
// JAMAIS de couleurs hardcodées dans les composants
<div className="bg-blue-500"> {/* NON */}
<div style={{backgroundColor: '#3B82F6'}}> {/* NON */}
```

### Workflow couleurs
1. **Définir** les nouvelles couleurs dans `globals.css`
2. **Créer** les classes Tailwind correspondantes
3. **Utiliser** ces classes dans les composants
4. **Tester** la cohérence sur toutes les pages

---

## 🔤 Gestion des Polices

### Centralisation obligatoire

#### Dans `globals.css`
```css
@layer base {
  /* Polices principales */
  .font-heading {
    font-family: 'Inter', system-ui, sans-serif;
    font-weight: 600;
  }
  
  .font-body {
    font-family: 'Inter', system-ui, sans-serif;
    font-weight: 400;
  }
  
  .font-accent {
    font-family: 'Playfair Display', serif;
    font-weight: 400;
  }
}
```

#### Dans `tailwind.config.js`
```js
theme: {
  extend: {
    fontFamily: {
      'heading': ['Inter', 'system-ui', 'sans-serif'],
      'body': ['Inter', 'system-ui', 'sans-serif'],
      'accent': ['Playfair Display', 'serif'],
    }
  }
}
```

### Règles d'utilisation
- **JAMAIS** de `font-family` directement dans les composants
- **TOUJOURS** utiliser les classes définies par Tailwind
- **TESTER** la lisibilité sur mobile et desktop

---

## 🧩 Composants Modulaires

### Structure des composants

#### Principe de responsabilité unique
```tsx
// ✅ BIEN : Un composant = Une responsabilité
const ProjectCard = ({ project }: { project: Project }) => {
  return (
    <Card>
      <ProjectImage src={project.image} />
      <ProjectContent title={project.title} description={project.description} />
      <ProjectActions projectId={project.id} />
    </Card>
  )
}

// ❌ MAL : Trop de responsabilités dans un seul composant
const ProjectCard = ({ project }: { project: Project }) => {
  // 100+ lignes de logique mélangée...
}
```

### Réutilisabilité
```tsx
// ✅ BIEN : Props typées et flexibles
interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'outline'
  size?: 'sm' | 'md' | 'lg'
  children: React.ReactNode
  onClick?: () => void
}

// ❌ MAL : Props trop spécifiques
interface ProjectButtonProps {
  projectTitle: string
  projectId: number
  isProjectPublished: boolean
}
```

### Organisation des fichiers
```
src/components/
├── ui/           # Composants de base (shadcn/ui)
├── layout/       # Header, Footer, Navigation
├── project/      # Composants spécifiques aux projets
│   ├── project-card.tsx
│   ├── project-gallery.tsx
│   └── project-form.tsx
└── common/       # Composants réutilisables
    ├── image-uploader.tsx
    └── loading-spinner.tsx
```

---

## 📁 Scope et Organisation des Fichiers

### Règles de limitation du scope

#### Un fichier = Une responsabilité
```tsx
// ✅ BIEN : project-card.tsx
export const ProjectCard = () => { /* logique carte projet */ }

// ✅ BIEN : project-filters.tsx  
export const ProjectFilters = () => { /* logique filtres */ }

// ❌ MAL : projects.tsx (tout mélangé)
export const ProjectCard = () => { /* ... */ }
export const ProjectFilters = () => { /* ... */ }
export const ProjectPagination = () => { /* ... */ }
// + 500 lignes de code...
```

#### Imports organisés
```tsx
// ✅ BIEN : Imports groupés et ordonnés
// React et Next.js
import { useState, useEffect } from 'react'
import Link from 'next/link'

// Composants UI
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

// Composants locaux
import { ProjectCard } from './project-card'

// Types et utils
import type { Project } from '@/types'
import { cn } from '@/lib/utils'
```

### Taille des fichiers
- **Maximum recommandé** : 400 lignes par composant (pas  à la ligne près, mais garder à l'esprit le principe d'optimisation des fichiers)

---

## 🔄 Workflow de Développement

### 1. **Avant toute modification**
```bash
# Vérifier l'état actuel
pnpm dev
# Tester que tout fonctionne avant modification
```

### 2. **Après les modifications**
```bash
# 1. Build pour vérifier les erreurs
pnpm build

# 2. Si succès, test en développement
pnpm dev

# 3. Vérifier visuellement les changements
```

### 3. **Versioning et commits**

#### Messages de commit préformatés
```bash
# Nouvelles fonctionnalités
git commit -m "feat: ajouter galerie projets avec filtres"

# Corrections de bugs
git commit -m "fix: affichage image responsive sur mobile"

# Améliorations styles
git commit -m "style: mettre a jour couleurs theme principal"

# Refactorisation
git commit -m "refactor: diviser composant projet en sous-composants"

# Documentation
git commit -m "docs: ajouter guide utilisation galerie"
```

#### Workflow complet
```bash
# 1. Vérification pre-commit
pnpm build && echo "✅ Build réussi"

# 2. Commit avec message clair
git add .
git commit -m "feat: ajouter filtres projets par categorie"

# 3. Push vers repository
git push origin dev  # ou main selon la branche
```

---

## ✅ Checklist de Vérification Post-Modification

### Frontend - Tests utilisateur
Après chaque modification, **TOUJOURS** demander à l'étudiant de vérifier :

#### 🖥️ **Navigation et liens**
- [ ] Tous les liens fonctionnent
- [ ] Navigation entre pages fluide
- [ ] Boutons réactifs au clic

#### 📱 **Responsive design**
- [ ] Affichage correct sur mobile
- [ ] Affichage correct sur tablette  
- [ ] Affichage correct sur desktop

#### 🎨 **Cohérence visuelle**
- [ ] Couleurs uniformes sur toutes les pages
- [ ] Polices cohérentes
- [ ] Espacement harmonieux

#### ⚡ **Performance**
- [ ] Pages se chargent rapidement
- [ ] Images optimisées
- [ ] Pas d'erreurs en console

#### 📝 **Contenu**
- [ ] Textes s'affichent correctement
- [ ] Images se chargent
- [ ] Formulaires fonctionnent

### Backend - CMS et données
- [ ] `/admin` accessible
- [ ] Connexion GitHub fonctionne
- [ ] Création de contenu possible
- [ ] Sauvegarde automatique

---

## 🚨 Points de Vigilance Critiques

### 1. **Sécurité des données**
- **JAMAIS** exposer les clés API côté client
- **TOUJOURS** utiliser les variables d'environnement
- **VÉRIFIER** les permissions GitHub

### 2. **Performance**
- **OPTIMISER** les images (WebP, tailles appropriées)
- **LIMITER** les imports inutiles
- **UTILISER** le lazy loading pour les galeries

### 3. **SEO et accessibilité**
- **AJOUTER** les attributs `alt` aux images
- **UTILISER** les balises sémantiques (`<article>`, `<section>`)
- **TESTER** la navigation au clavier

### 4. **Compatibilité**
- **TESTER** sur Chrome, Firefox, Safari
- **VÉRIFIER** les CSS Grid et Flexbox
- **VALIDER** le responsive design

---

## 📋 Template de Réponse pour l'IA

```markdown
## 🎯 Analyse de la demande
[Reformuler la demande de l'étudiant]

## 🔍 Fichiers concernés
[Liste des fichiers à modifier/créer]

## ⚠️ Points d'attention
[Risques ou alternatives à considérer]

## 🛠️ Modifications proposées
[Détail des changements]

## ✅ Tests à effectuer
[Checklist spécifique à la demande]

## 🚀 Prochaines étapes
[Ce que l'étudiant doit faire après]
```

---

## 💡 Messages Types pour l'IA

### Remise en question constructive
```
"Avant de créer un nouveau composant, j'ai remarqué qu'il existe déjà [X]. 
Ne serait-il pas plus cohérent de modifier [X] plutôt que de créer [Y] ? 
Cela éviterait la duplication de code et maintiendrait la cohérence."
```

### Proposition d'alternative
```
"Votre idée est intéressante, mais je propose une approche différente : 
[alternative]. Cette solution présente les avantages suivants : [bénéfices]. 
Qu'en pensez-vous ?"
```

### Explication pédagogique
```
"Je vais modifier le fichier [X] pour [raison]. Cette approche est recommandée 
car [explication]. Cela vous permettra de [bénéfice pour l'étudiant]."
```

---

**🎓 Ce guide doit être votre référence permanente pour accompagner les étudiants vers l'excellence technique tout en restant pédagogique et bienveillant.**
