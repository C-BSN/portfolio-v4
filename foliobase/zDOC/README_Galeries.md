# Système de Galeries - Documentation Complète

Ce système de galeries offre trois types de dispositions élégantes avec **détection automatique des dimensions d'images** et PhotoSwipe lightbox intégré, selon les recommandations techniques modernes.

## ⚡ Nouveautés - Détection Automatique des Dimensions

### 🔍 **Principe fondamental : AUCUNE dimension manuelle !**

Le système détecte automatiquement les vraies dimensions de toutes les images pour :
- ✅ Conserver les proportions naturelles des images
- ✅ Optimiser l'affichage justified et masonry
- ✅ Éviter la déformation des images
- ✅ Améliorer les performances de la lightbox

### 🧠 **Comment ça fonctionne**

1. **Chargement intelligent** : Le système charge les images en arrière-plan pour détecter leurs dimensions natives
2. **Estimation temporaire** : Pendant la détection, utilise des ratios 4:3 pour les images Cloudinary
3. **Mise à jour progressive** : Les galeries se réorganisent automatiquement quand les vraies dimensions sont disponibles
4. **Feedback visuel** : Indicateurs de progression pour informer l'utilisateur

## Installation

Les dépendances nécessaires sont déjà installées :
- `react-photoswipe-gallery` - Wrapper React pour PhotoSwipe
- `photoswipe` - Bibliothèque lightbox
- `react-photo-album` - Dispositions avancées (justifiée, masonry)

## Types de Galeries Disponibles

### 1. GridGallery - Grille CSS Classique

Utilise CSS Grid natif pour des performances optimales. Idéal pour des présentations uniformes.

```tsx
import { GridGallery } from "@/components/ui/grid-gallery"

// ✅ CORRECT : Utiliser avec détection automatique via useGallery
const { images } = useGallery(galleryData, { loadRealDimensions: true })

<GridGallery
  images={images}
  columns={{ default: 2, md: 3, lg: 4 }}
  aspectRatio="auto" // IMPORTANT : toujours "auto" pour préserver les proportions
  withCaption={true}
/>
```

**⚠️ NE JAMAIS FAIRE :**
```tsx
// ❌ INCORRECT : Dimensions manuelles
const images = [
  { src: "/image.jpg", width: 800, height: 600 } // Dimensions codées en dur !
]
```

### 2. JustifiedGallery - Grille Justifiée (Style Google Photos)

Utilise `react-photo-album` pour créer des rangées harmonieuses avec les vraies dimensions.

```tsx
import { JustifiedGallery } from "@/components/ui/justified-gallery"

// ✅ CORRECT : Détection automatique
const { images, isLoading } = useGallery(galleryData, { 
  loadRealDimensions: true 
})

<JustifiedGallery
  images={images}
  targetRowHeight={isLoading ? 150 : 200} // Hauteur adaptative
  spacing={8}
  withCaption={true}
/>
```

### 3. MasonryGallery - Disposition Maçonnerie (Style Pinterest)

Style "Pinterest" avec colonnes de largeur égale et hauteurs variables.

```tsx
import { MasonryGallery } from "@/components/ui/masonry-gallery"

<MasonryGallery
  images={images} // Images avec dimensions détectées automatiquement
  columns={3}
  spacing={8}
  withCaption={true}
/>
```

## Composant Intégré ProjectGallery

Le composant `ProjectGallery` combine les trois types avec détection automatique et sélecteur de disposition.

```tsx
import { ProjectGallery } from "@/components/ui/project-gallery"

<ProjectGallery
  gallery={project.gallery} // Format CMS (string[][] ou ProjectGalleryItem[])
  title="Galerie du projet"
  defaultLayout="justified" // "grid" | "justified" | "masonry"
  showLayoutSwitcher={true}
/>
```

### 🔄 **Indicateurs visuels intégrés**

- **Loader** : Indicateur "Optimisation des dimensions..." pendant la détection
- **Badge de statut** : Nombre d'images détectées une fois terminé
- **Mise à jour progressive** : Les galeries se réorganisent automatiquement

## Hook useGallery - Cœur du Système

### 📊 **Interface et Options**

```tsx
import { useGallery } from "@/hooks/use-gallery"

const { images, hasImages, isLoading, count } = useGallery(
  galleryData, // string[][] (format CMS) ou ProjectGalleryItem[]
  {
    loadRealDimensions: true,    // ✅ TOUJOURS true pour la détection
    defaultWidth: 1200,          // Estimation temporaire
    defaultHeight: 800           // Estimation temporaire
  }
)
```

### 🎯 **Formats de données supportés**

**Format CMS (recommandé) :**
```tsx
// ✅ Format YAML du CMS - string[][]
const galleryData = [
  [
    "https://res.cloudinary.com/demo/image/upload/v1234/image1.jpg",
    "https://res.cloudinary.com/demo/image/upload/v1234/image2.jpg",
    "https://res.cloudinary.com/demo/image/upload/v1234/image3.jpg"
  ]
]

// Le hook détecte automatiquement les dimensions de chaque image
```

**Format objet (si nécessaire) :**
```tsx
// ✅ Format objet - ProjectGalleryItem[]
const galleryData = [
  {
    image: "https://example.com/image1.jpg",
    caption: "Légende optionnelle"
  }
]

// Les dimensions sont quand même détectées automatiquement
```

### ⚡ **Performance et Optimisations**

- **Chargement parallèle** : Toutes les images sont analysées en parallèle
- **Délais intelligents** : 50ms entre chaque image pour éviter la surcharge
- **Gestion d'erreur** : Fallback vers estimations si détection échoue
- **Cache implicite** : Les dimensions détectées sont mémorisées

## Configuration PhotoSwipe

Toutes les galeries acceptent des options PhotoSwipe via la prop `options` :

```tsx
<JustifiedGallery
  images={images}
  options={{
    bgOpacity: 0.9,
    loop: true,
    showHideOpacity: true,
    zoom: false // Optionnel : désactiver le zoom
  }}
/>
```

## Bonnes Pratiques - Guide Complet

### 🚀 **Performance**

1. **GridGallery** : Le plus performant pour des grilles simples
2. **JustifiedGallery** : Optimal pour des images de ratios variés
3. **MasonryGallery** : Utilise CSS columns, performant mais moins flexible pour responsive

### 📱 **Responsive Design**

- Toutes les galeries sont responsive par défaut
- GridGallery offre le contrôle le plus fin avec les breakpoints Tailwind
- JustifiedGallery et MasonryGallery s'adaptent automatiquement

### 🖼️ **Images et Dimensions**

```tsx
// ✅ TOUJOURS FAIRE
const { images } = useGallery(galleryData, { loadRealDimensions: true })

// ❌ NE JAMAIS FAIRE
const images = [
  { src: "image.jpg", width: 800, height: 600 } // Dimensions manuelles
]
```

**Règles importantes :**
- ✅ Toujours utiliser `loadRealDimensions: true`
- ✅ Laisser le système détecter les dimensions
- ✅ Utiliser `aspectRatio="auto"` pour GridGallery
- ❌ Jamais spécifier de dimensions manuellement
- ❌ Jamais forcer des ratios fixes

### 🔧 **Intégration CMS**

**Dans le frontmatter YAML :**
```yaml
gallery:
  - - https://res.cloudinary.com/demo/image/upload/v1234/image1.jpg
    - https://res.cloudinary.com/demo/image/upload/v1234/image2.jpg
    - https://res.cloudinary.com/demo/image/upload/v1234/image3.jpg
```

**Dans le composant :**
```tsx
// ✅ Le hook gère automatiquement le format CMS
<ProjectGallery 
  gallery={project.gallery} 
  defaultLayout="justified"
/>
```

## Migration et Tests

### 🧪 **Page de Test**

Accédez à `/test` pour valider le fonctionnement :
- Vérification visuelle des 3 types de galeries
- Indicateurs de détection en temps réel
- Informations de debug détaillées
- Test de la lightbox avec vraies dimensions

### 🔄 **Migration depuis l'ancienne version**

**Remplacez :**
```tsx
// ❌ Ancien code avec dimensions manuelles
{project.gallery && project.gallery.length > 0 && (
  <div className="grid grid-cols-2 gap-4">
    {project.gallery.map((item, index) => (
      <img src={item.image} alt={`Image ${index + 1}`} />
    ))}
  </div>
)}
```

**Par :**
```tsx
// ✅ Nouveau code avec détection automatique
<ProjectGallery 
  gallery={project.gallery}
  defaultLayout="justified" 
/>
```

### ⚠️ **Points de Vigilance**

1. **Jamais de dimensions manuelles** : Le système les détecte automatiquement
2. **Format CMS respecté** : Utiliser le format string[][] du YAML
3. **Performance** : La détection se fait une seule fois par session
4. **Lightbox** : Les dimensions détectées garantissent un affichage optimal

## Architecture Technique

### 📋 **Stack Technologique**

- **Logique de disposition** : react-photo-album + CSS Grid
- **Détection dimensions** : API Image native du navigateur  
- **Logique lightbox** : react-photoswipe-gallery
- **Stylisation** : Tailwind CSS avec contrôle total
- **Optimisation** : next/image intégré + mémorisation

### 🎯 **Avantages du Système**

✅ **Zéro configuration** : Aucune dimension à spécifier  
✅ **Performance optimale** : Détection intelligente avec cache  
✅ **Responsive natif** : S'adapte automatiquement  
✅ **Qualité visuelle** : Vraies proportions préservées  
✅ **Maintien du CMS** : Compatible avec le workflow existant  

### 🔮 **Évolutions Futures**

- Détection de métadonnées EXIF pour orientation
- Support d'autres CDN que Cloudinary
- Cache persistant entre sessions
- Optimisation pour images très haute résolution

---

**🎨 Cette architecture modulaire permet d'interchanger facilement les types de galeries sans impact sur la lightbox, tout en garantissant des images parfaitement proportionnées automatiquement.** 