export interface ProjectTheme {
  // Couleurs principales
  primary: string
  secondary: string
  accent: string
  text: string
  textSecondary: string
  
  // Effets visuels
  rainOpacity: number
  particleOpacity: number
  cursorOpacity: number
  
  // Classes CSS
  badgeClasses: {
    primary: string
    secondary: string
    status: string
    context: string
  }
  
  titleClasses: string
  descriptionClasses: string
  buttonClasses: {
    primary: string
    secondary: string
  }
  
  // Header/Footer
  headerClasses: string
  footerClasses: string
  
  // Mood général
  mood: 'cyberpunk' | 'corporate' | 'creative' | 'minimal' | 'retro' | 'luxury'
}

// Thèmes prédéfinis selon les types de projets
export const projectThemes: Record<string, ProjectTheme> = {
  // Thème par défaut (cyberpunk)
  default: {
    primary: 'cyan-400',
    secondary: 'pink-400',
    accent: 'purple-400',
    text: 'cyan-300',
    textSecondary: 'cyan-300/80',
    rainOpacity: 0.4,
    particleOpacity: 0.3,
    cursorOpacity: 0.2,
    badgeClasses: {
      primary: 'bg-cyan-400/20 text-cyan-400 border-cyan-400/30',
      secondary: 'border-pink-400/30 text-pink-400',
      status: 'border-purple-400/30 text-purple-400',
      context: 'border-cyan-400/30 text-cyan-400'
    },
    titleClasses: 'neon-text gradient-text',
    descriptionClasses: 'text-cyan-300/80 glitch-text',
    buttonClasses: {
      primary: 'bg-gradient-to-r from-cyan-400 to-pink-500 text-black font-bold hologram-btn pulse-glow',
      secondary: 'border-purple-400/30 text-purple-400 hover:bg-purple-400/10 hologram-btn'
    },
    headerClasses: 'bg-black/50 border-cyan-400/30 text-cyan-400',
    footerClasses: 'bg-black/80 border-t border-cyan-400/30 text-cyan-300',
    mood: 'cyberpunk'
  },

  // Thème RSE Air Austral (harmonisé avec l'identité visuelle Air Austral)
  'campagne-eco-responsable': {
    primary: 'sky-400',        // Bleu Air Austral principal
    secondary: 'emerald-400',  // Vert RSE/écologie
    accent: 'slate-300',       // Gris/blanc de l'identité Air Austral
    text: 'sky-300',
    textSecondary: 'emerald-300/90',
    rainOpacity: 0.15,         // Réduit pour un effet plus subtil
    particleOpacity: 0.1,      // Plus discret
    cursorOpacity: 0.08,       // Très subtil
    badgeClasses: {
      primary: 'bg-sky-500/20 text-sky-300 border-sky-400/40',
      secondary: 'border-emerald-400/40 text-emerald-300',
      status: 'border-slate-400/40 text-slate-300',
      context: 'border-sky-400/40 text-sky-300'
    },
    titleClasses: 'text-sky-300 drop-shadow-[0_0_20px_rgba(56,189,248,0.8)] neon-text',
    descriptionClasses: 'text-emerald-300/95',
    buttonClasses: {
      primary: 'bg-gradient-to-r from-sky-500 to-emerald-500 text-white font-bold hologram-btn pulse-glow shadow-[0_0_20px_rgba(56,189,248,0.5)]',
      secondary: 'border-slate-400/40 text-slate-300 hover:bg-slate-400/10 hologram-btn hover:shadow-[0_0_15px_rgba(148,163,184,0.3)]'
    },
    headerClasses: 'bg-sky-900/60 border-sky-400/40 text-sky-300',
    footerClasses: 'bg-sky-900/80 border-t border-emerald-400/40 text-emerald-300',
    mood: 'corporate'
  },

  // Thème Kellogg's (collaboration musicale)
  'collaboration-inattendue-kelloggs': {
    primary: 'red-400',
    secondary: 'yellow-400',
    accent: 'rose-400',
    text: 'red-300',
    textSecondary: 'yellow-300/90',
    rainOpacity: 0.2,
    particleOpacity: 0.1,
    cursorOpacity: 0.1,
    badgeClasses: {
      primary: 'bg-red-500/20 text-red-400 border-red-400/30',
      secondary: 'border-yellow-400/30 text-yellow-400',
      status: 'border-rose-400/30 text-rose-400',
      context: 'border-red-400/30 text-red-400'
    },
    titleClasses: 'text-red-400 drop-shadow-[0_0_10px_rgba(248,113,113,0.5)]',
    descriptionClasses: 'text-yellow-300/90',
    buttonClasses: {
      primary: 'bg-gradient-to-r from-red-500 to-yellow-500 text-black font-bold hologram-btn pulse-glow',
      secondary: 'border-rose-400/30 text-rose-400 hover:bg-rose-400/10 hologram-btn'
    },
    headerClasses: 'bg-red-900/50 border-red-400/30 text-red-400',
    footerClasses: 'bg-red-900/80 border-t border-red-400/30 text-red-300',
    mood: 'creative'
  },

  // Thème Corporate (identité visuelle, branding)
  corporate: {
    primary: 'blue-400',
    secondary: 'slate-400',
    accent: 'indigo-400',
    text: 'blue-300',
    textSecondary: 'slate-300/80',
    rainOpacity: 0.1,
    particleOpacity: 0.05,
    cursorOpacity: 0.05,
    badgeClasses: {
      primary: 'bg-blue-500/20 text-blue-400 border-blue-400/30',
      secondary: 'border-slate-400/30 text-slate-400',
      status: 'border-indigo-400/30 text-indigo-400',
      context: 'border-blue-400/30 text-blue-400'
    },
    titleClasses: 'text-blue-400 drop-shadow-[0_0_8px_rgba(96,165,250,0.4)]',
    descriptionClasses: 'text-slate-300/80',
    buttonClasses: {
      primary: 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-bold hologram-btn',
      secondary: 'border-slate-400/30 text-slate-400 hover:bg-slate-400/10 hologram-btn'
    },
    headerClasses: 'bg-blue-900/50 border-blue-400/30 text-blue-400',
    footerClasses: 'bg-blue-900/80 border-t border-blue-400/30 text-blue-300',
    mood: 'corporate'
  },

  // Thème Luxury (projets haut de gamme)
  luxury: {
    primary: 'amber-400',
    secondary: 'yellow-400',
    accent: 'orange-400',
    text: 'amber-300',
    textSecondary: 'yellow-300/80',
    rainOpacity: 0.15,
    particleOpacity: 0.08,
    cursorOpacity: 0.08,
    badgeClasses: {
      primary: 'bg-amber-500/20 text-amber-400 border-amber-400/30',
      secondary: 'border-yellow-400/30 text-yellow-400',
      status: 'border-orange-400/30 text-orange-400',
      context: 'border-amber-400/30 text-amber-400'
    },
    titleClasses: 'text-amber-400 drop-shadow-[0_0_12px_rgba(251,191,36,0.6)]',
    descriptionClasses: 'text-yellow-300/80',
    buttonClasses: {
      primary: 'bg-gradient-to-r from-amber-500 to-yellow-500 text-black font-bold hologram-btn pulse-glow',
      secondary: 'border-orange-400/30 text-orange-400 hover:bg-orange-400/10 hologram-btn'
    },
    headerClasses: 'bg-amber-900/50 border-amber-400/30 text-amber-400',
    footerClasses: 'bg-amber-900/80 border-t border-amber-400/30 text-amber-300',
    mood: 'luxury'
  },

  // Thème Minimal (design épuré)
  minimal: {
    primary: 'gray-400',
    secondary: 'slate-400',
    accent: 'zinc-400',
    text: 'gray-300',
    textSecondary: 'slate-300/80',
    rainOpacity: 0.05,
    particleOpacity: 0.02,
    cursorOpacity: 0.02,
    badgeClasses: {
      primary: 'bg-gray-500/20 text-gray-400 border-gray-400/30',
      secondary: 'border-slate-400/30 text-slate-400',
      status: 'border-zinc-400/30 text-zinc-400',
      context: 'border-gray-400/30 text-gray-400'
    },
    titleClasses: 'text-gray-400 drop-shadow-[0_0_6px_rgba(156,163,175,0.3)]',
    descriptionClasses: 'text-slate-300/80',
    buttonClasses: {
      primary: 'bg-gradient-to-r from-gray-500 to-slate-500 text-white font-bold hologram-btn',
      secondary: 'border-zinc-400/30 text-zinc-400 hover:bg-zinc-400/10 hologram-btn'
    },
    headerClasses: 'bg-gray-900/50 border-gray-400/30 text-gray-400',
    footerClasses: 'bg-gray-900/80 border-t border-gray-400/30 text-gray-300',
    mood: 'minimal'
  }
}

// Fonction pour déterminer le thème d'un projet
export function getProjectTheme(slug: string, projectType?: string[], annonceur?: string): ProjectTheme {
  // Vérifier d'abord si le projet a un thème spécifique
  if (projectThemes[slug]) {
    return projectThemes[slug]
  }

  // Sinon, déterminer le thème selon le type de projet et l'annonceur
  if (projectType && Array.isArray(projectType)) {
    // Projets d'identité visuelle ou branding
    if (projectType.some(type => 
      type.toLowerCase().includes('identité') || 
      type.toLowerCase().includes('branding') ||
      type.toLowerCase().includes('logo')
    )) {
      return projectThemes.corporate
    }

    // Projets de luxe ou haut de gamme
    if (annonceur && (
      annonceur.toLowerCase().includes('luxury') ||
      annonceur.toLowerCase().includes('premium') ||
      annonceur.toLowerCase().includes('haute')
    )) {
      return projectThemes.luxury
    }

    // Projets web ou digitaux minimalistes
    if (projectType.some(type => 
      type.toLowerCase().includes('web') || 
      type.toLowerCase().includes('ui/ux') ||
      type.toLowerCase().includes('minimal')
    )) {
      return projectThemes.minimal
    }
  }

  // Par défaut, retourner le thème cyberpunk
  return projectThemes.default
}

// Fonction pour obtenir l'image de fond d'un projet
export function getProjectBackground(slug: string, featuredImage?: string): string {
  // Si le projet a une image de mise en avant, l'utiliser
  if (featuredImage) {
    return featuredImage
  }
  
  // Sinon, utiliser l'image par défaut cyberpunk
  return "/cyberpunk-street.webp"
}
