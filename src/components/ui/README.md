# Guide des Composants Modulaires - Portfolio

Ce guide explique comment utiliser et personnaliser les nouveaux composants modulaires du portfolio.

## 🎯 Composants Disponibles

### 1. PdfViewer (`pdf-viewer.tsx`)

Composant pour afficher des PDFs de manière élégante avec contrôles intégrés.

#### Props principales :
```typescript
interface PdfViewerProps {
  url: string          // URL du PDF (obligatoire)
  title?: string       // Titre affiché dans la barre d'outils
  className?: string   // Classes CSS personnalisées
  height?: number      // Hauteur en pixels (défaut: 600)
  showToolbar?: boolean // Afficher la barre d'outils (défaut: true)
  allowDownload?: boolean // Permettre le téléchargement (défaut: true)
}
```

#### Exemples d'utilisation :

**Basique :**
```jsx
import { PdfViewer } from '@/components/ui/pdf-viewer'

<PdfViewer url="/documents/portfolio.pdf" />
```

**Personnalisé :**
```jsx
<PdfViewer 
  url="/documents/portfolio.pdf"
  title="Portfolio 2024"
  height={500}
  showToolbar={false}
  className="border-2 border-primary"
/>
```

**Minimaliste :**
```jsx
<PdfViewer 
  url="/documents/portfolio.pdf"
  height={300}
  showToolbar={false}
  allowDownload={false}
/>
```

### 2. ProjectObjectives (`project-objectives.tsx`)

Système modulaire pour afficher les objectifs pédagogiques et la stratégie créative.

#### Props de ProjectObjectives :
```typescript
interface ProjectObjectivesProps {
  cognitifs?: string[]     // Objectifs cognitifs (connaissances)
  affectifs?: string[]     // Objectifs affectifs (attitudes)
  conatifs?: string[]      // Objectifs conatifs (comportements)
  className?: string       // Classes CSS personnalisées
  title?: string          // Titre de la section
  compact?: boolean       // Mode compact
}
```

#### Props de ProjectStrategy :
```typescript
interface ProjectStrategyProps {
  cibles?: string          // Description des cibles
  strategie_creative?: string // Stratégie créative
  className?: string       // Classes CSS personnalisées
}
```

#### Exemples d'utilisation :

**Objectifs pédagogiques complets :**
```jsx
import { ProjectObjectives } from '@/components/ui/project-objectives'

<ProjectObjectives 
  cognitifs={project.objectifs_cognitifs}
  affectifs={project.objectifs_affectifs}
  conatifs={project.objectifs_conatifs}
  title="Objectifs d'apprentissage"
/>
```

**Mode compact pour sidebar :**
```jsx
<ProjectObjectives 
  cognitifs={project.objectifs_cognitifs}
  affectifs={project.objectifs_affectifs}
  conatifs={project.objectifs_conatifs}
  compact={true}
  title="Objectifs"
/>
```

**Stratégie et ciblage :**
```jsx
import { ProjectStrategy } from '@/components/ui/project-objectives'

<ProjectStrategy 
  cibles={project.cibles}
  strategie_creative={project.strategie_creative}
/>
```

### 3. ProjectEvidence (`project-evidence.tsx`)

Système modulaire pour afficher différents types de preuves de projet.

#### Types de preuves supportés :
- **Image** : Affichage d'images avec effet hover
- **PDF** : Lecteur PDF intégré avec contrôles
- **URL** : Liens externes avec aperçu
- **Video** : Intégration YouTube avec iframe responsive

#### Composants disponibles :

1. **ProjectEvidenceItem** - Pour une preuve individuelle
2. **ProjectEvidenceList** - Pour une liste de preuves

#### Props de ProjectEvidenceList :
```typescript
interface ProjectEvidenceListProps {
  evidences: ProjectEvidence[]  // Liste des preuves
  className?: string           // Classes CSS personnalisées
  title?: string              // Titre de la section (défaut: "Preuves")
  compact?: boolean           // Mode compact (défaut: false)
  maxDisplay?: number         // Nombre max à afficher
}
```

#### Exemples d'utilisation :

**Affichage complet :**
```jsx
import { ProjectEvidenceList } from '@/components/ui/project-evidence'

<ProjectEvidenceList 
  evidences={project.preuves}
  title="Preuves et éléments complémentaires"
/>
```

**Mode compact :**
```jsx
<ProjectEvidenceList 
  evidences={project.preuves}
  title="Preuves"
  compact={true}
  maxDisplay={3}
/>
```

**Dans une sidebar :**
```jsx
<ProjectEvidenceList 
  evidences={project.preuves}
  title="Justificatifs"
  compact={true}
  className="space-y-2"
/>
```

## 🎨 Personnalisation des Styles

### Modifier les couleurs des types de preuves

Dans `project-evidence.tsx`, modifiez la fonction `getTypeColor()` :

```typescript
const getTypeColor = () => {
  switch (evidence.type) {
    case 'Image':
      return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300'
    case 'PDF':
      return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300'
    case 'URL':
      return 'bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-300'
  }
}
```

### Personnaliser l'affichage PDF

Dans `pdf-viewer.tsx`, vous pouvez modifier :

- **Hauteur par défaut :**
```typescript
height = 400  // Au lieu de 600
```

- **Couleurs de la barre d'outils :**
```jsx
<div className="border-b p-3 bg-gray-50 dark:bg-gray-800 flex items-center justify-between">
```

- **Styles du loader :**
```jsx
<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
```

## 🔧 Cas d'Usage Avancés

### 1. Objectifs par catégorie

```jsx
// Afficher seulement certains types d'objectifs
export function CognitiveObjectives({ project }) {
  if (!project.objectifs_cognitifs?.length) return null
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5" />
          Compétences développées
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {project.objectifs_cognitifs.map((obj, index) => (
            <li key={index} className="flex items-start gap-2">
              <CheckCircle className="h-4 w-4 mt-0.5 text-green-500" />
              <span>{obj}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}
```

### 2. Preuves vidéo avec playlist

```jsx
// Créer une playlist de vidéos YouTube
export function VideoPlaylist({ evidences }) {
  const videos = evidences.filter(e => e.type === 'Video')
  
  if (!videos.length) return null
  
  return (
    <div className="space-y-4">
      <h3>Vidéos du projet</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {videos.map((video, index) => (
          <ProjectEvidenceItem key={index} evidence={video} />
        ))}
      </div>
    </div>
  )
}
```

### 3. Galerie de preuves personnalisée

```jsx
// Créer un composant personnalisé
export function CustomEvidenceGallery({ evidences }) {
  const images = evidences.filter(e => e.type === 'Image')
  const videos = evidences.filter(e => e.type === 'Video')
  const pdfs = evidences.filter(e => e.type === 'PDF')
  const urls = evidences.filter(e => e.type === 'URL')

  return (
    <div className="space-y-8">
      {videos.length > 0 && (
        <div>
          <h3>Vidéos de démonstration</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {videos.map((evidence, index) => (
              <ProjectEvidenceItem key={index} evidence={evidence} />
            ))}
          </div>
        </div>
      )}
      
      {images.length > 0 && (
        <div>
          <h3>Galerie d'images</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {images.map((evidence, index) => (
              <ProjectEvidenceItem key={index} evidence={evidence} compact />
            ))}
          </div>
        </div>
      )}
      
      {pdfs.length > 0 && (
        <div>
          <h3>Documents PDF</h3>
          <ProjectEvidenceList evidences={pdfs} compact />
        </div>
      )}
      
      {urls.length > 0 && (
        <div>
          <h3>Liens externes</h3>
          <ProjectEvidenceList evidences={urls} compact />
        </div>
      )}
    </div>
  )
}
```

### 4. Modal pour PDF

```jsx
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'
import { PdfViewer } from '@/components/ui/pdf-viewer'

<Dialog>
  <DialogTrigger asChild>
    <Button variant="outline">Voir le PDF en grand</Button>
  </DialogTrigger>
  <DialogContent className="max-w-4xl max-h-[90vh]">
    <PdfViewer 
      url={evidence.pdf}
      height={600}
      title={evidence.description}
    />
  </DialogContent>
</Dialog>
```

### 3. Carrousel de preuves

```jsx
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel'

<Carousel className="w-full max-w-sm">
  <CarouselContent>
    {evidences.map((evidence, index) => (
      <CarouselItem key={index}>
        <ProjectEvidenceItem evidence={evidence} />
      </CarouselItem>
    ))}
  </CarouselContent>
</Carousel>
```

## 🚀 Intégration dans vos Pages

### Page de projet individuelle

```jsx
// Dans src/app/projects/[slug]/page.tsx
import { ProjectEvidenceList } from '@/components/ui/project-evidence'
import { ProjectObjectives, ProjectStrategy } from '@/components/ui/project-objectives'

export default function ProjectPage({ project }) {
  return (
    <div>
      {/* Contenu du projet */}
      
      {/* Stratégie et ciblage */}
      <ProjectStrategy 
        cibles={project.cibles}
        strategie_creative={project.strategie_creative}
        className="mb-8"
      />

      {/* Objectifs pédagogiques */}
      <ProjectObjectives 
        cognitifs={project.objectifs_cognitifs}
        affectifs={project.objectifs_affectifs}
        conatifs={project.objectifs_conatifs}
        className="mb-8"
      />
      
      {/* Preuves - Section dédiée */}
      {project.preuves && project.preuves.length > 0 && (
        <section className="mt-12">
          <ProjectEvidenceList 
            evidences={project.preuves}
            title="Justificatifs et preuves"
          />
        </section>
      )}
    </div>
  )
}
```

### Dans une sidebar

```jsx
// Sidebar d'informations projet
<Card className="sticky top-24">
  <CardContent className="p-6">
    <h3>Informations du projet</h3>
    
    {/* Infos basiques */}
    
    {/* Objectifs en mode compact */}
    <ProjectObjectives 
      cognitifs={project.objectifs_cognitifs}
      affectifs={project.objectifs_affectifs}
      conatifs={project.objectifs_conatifs}
      title="Objectifs"
      compact={true}
      className="my-6"
    />
    
    {/* Preuves en mode compact */}
    {project.preuves && project.preuves.length > 0 && (
      <>
        <Separator className="my-4" />
        <ProjectEvidenceList 
          evidences={project.preuves}
          title="Preuves"
          compact={true}
          maxDisplay={3}
        />
      </>
    )}
  </CardContent>
</Card>
```

## 📚 Types de Données

### Structure ProjectEvidence

```typescript
export interface ProjectEvidence {
  type: 'Image' | 'URL' | 'PDF' | 'Video'
  description: string
  file?: string        // Pour les images
  pdf?: string         // Pour les PDFs  
  url?: string         // Pour les URLs
  youtube_url?: string // Pour les vidéos YouTube
}
```

### Structure Project (mise à jour)

```typescript
export interface Project {
  // ... champs existants
  annonceur?: string                    // Nouveau: remplace "client"
  contexte: 'Alternance' | 'École' | 'Projet personnel' | 'Client' | 'Autre'
  contexte_autre?: string               // Obligatoire si contexte = "Autre"
  cibles?: string                       // Nouveau: description des cibles
  strategie_creative?: string           // Nouveau: stratégie créative
  objectifs_cognitifs?: string[]        // Nouveau: objectifs cognitifs
  objectifs_affectifs?: string[]        // Nouveau: objectifs affectifs  
  objectifs_conatifs?: string[]         // Nouveau: objectifs conatifs
  preuves?: ProjectEvidence[]          // Nouveau: système de preuves
}
```

## 🎯 Conseils pour les Étudiants

### Bonnes pratiques

1. **Modularité** : Chaque composant est indépendant, vous pouvez les utiliser séparément
2. **Personnalisation** : Modifiez les couleurs, tailles, et layouts selon vos besoins
3. **Performance** : Les PDFs et vidéos se chargent uniquement quand nécessaire
4. **Responsive** : Tous les composants s'adaptent aux différentes tailles d'écran
5. **Accessibilité** : Les composants respectent les standards d'accessibilité

### Objectifs pédagogiques efficaces

- **Cognitifs** : "Maîtriser les principes de typographie", "Comprendre la théorie des couleurs"
- **Affectifs** : "Développer sa sensibilité esthétique", "Apprécier l'impact émotionnel du design"
- **Conatifs** : "Utiliser Figma de manière autonome", "Présenter son travail à un client"

### Intégration YouTube

Les URLs YouTube supportées :
- `https://www.youtube.com/watch?v=VIDEO_ID`
- `https://youtu.be/VIDEO_ID`
- `https://www.youtube.com/embed/VIDEO_ID`

### Types de preuves recommandés

- **Images** : Mockups, wireframes, inspirations
- **PDFs** : Cahiers des charges, présentations clients
- **URLs** : Sites web déployés, prototypes interactifs
- **Vidéos** : Démonstrations, processus créatif, témoignages

N'hésitez pas à expérimenter et créer vos propres variations ! 🚀 