# Composants d'Effets Cyberpunk

Ce dossier contient les composants d'effets visuels inspirés du style cyberpunk pour améliorer l'expérience utilisateur.

## Composants Disponibles

### CyberpunkBackground
Composant principal qui englobe tous les effets de fond.

```tsx
<CyberpunkBackground 
  backgroundImage="/cyberpunk-street.webp"
  showRain={true}
  showParticles={true}
  showCursor={true}
  rainOpacity={0.3}
  particleOpacity={0.2}
  cursorOpacity={0.15}
>
  {/* Votre contenu */}
</CyberpunkBackground>
```

### RainEffect
Effet de pluie néon animée.

```tsx
<RainEffect 
  opacity={0.6}
  dropCount={150}
  className="fixed inset-0 pointer-events-none z-[1]"
/>
```

### ParticleBackground
Particules connectées en arrière-plan.

```tsx
<ParticleBackground 
  opacity={0.4}
  particleCount={60}
  className="fixed inset-0 pointer-events-none z-0"
/>
```

### CursorGlow
Effet de lueur qui suit le curseur.

```tsx
<CursorGlow 
  size={384}
  colors={["#ff00ff", "#00ffff"]}
  className="fixed pointer-events-none z-50 rounded-full blur-3xl"
/>
```

### AnimatedText
Composants pour les animations de texte.

```tsx
<TypewriterText 
  text="Votre texte" 
  delay={500} 
  speed={50}
  showCursor={true}
/>

<NeonText color="#00ffff" glowIntensity="medium">
  Texte néon
</NeonText>

<GlitchText intensity="medium">
  Texte avec effet glitch
</GlitchText>
```

## Classes CSS Disponibles

### Animations d'entrée
- `slide-up`, `slide-down`, `slide-left`, `slide-right`
- `scale-up`, `fade-in`
- `animation-delay-200` à `animation-delay-2000`

### Effets spéciaux
- `neon-text` : Effet néon avec animation
- `glitch-text` : Effet de glitch
- `hologram-btn` : Boutons avec effet holographique
- `hologram-card` : Cartes avec effet holographique
- `pulse-glow` : Pulsation lumineuse
- `tech-tag` : Animation pour les tags techniques
- `hero-title` : Animation d'entrée pour les titres
- `gradient-text` : Texte avec dégradé animé

### Police
- `font-cyberpunk` : Police Orbitron pour le style cyberpunk

## Intégration avec le CMS

Les effets sont conçus pour être compatibles avec le système CMS existant. Le contenu provenant du CMS (titres, descriptions, etc.) est préservé et stylisé avec les nouveaux effets.

La page d'accueil récupère toujours les données depuis :
- `content/pages/homepage.md` via le CMS Netlify
- Les données par défaut si le fichier CMS n'existe pas

## Performance

- Les animations utilisent `requestAnimationFrame` pour de meilleures performances
- Les effets de particules sont optimisés avec un nombre limité d'éléments
- Les effets peuvent être désactivés individuellement via les props
