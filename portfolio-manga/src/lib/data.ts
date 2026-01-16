// lib/data.ts

export const PORTFOLIO_DATA = {
  // HERO : Juste le nécessaire pour l'impact visuel
  hero: {
    title: "CORENTIN BASSON",
    subtitle: "DÉVELOPPEUR WEB",
    location: "France",
    status: "Disponible pour freelance"
  },

  // ABOUT : Version "Manifesto" (court et direct)
  about: {
    title: "À PROPOS",
    description: "Développeur passionné par la création d'interfaces web modernes et intuitives. Je transforme des concepts complexes en expériences digitales fluides.",
    // On garde juste les chiffres clés s'il y en a, sinon une phrase de mission
    mission: "FOCUS SUR LA PERFORMANCE ET L'INTERACTIVITÉ." 
  },

  // STACK : Juste les noms, pas de logos, pour un style "Terminal"
  stack: [
    "JavaScript", "TypeScript", "React", "Next.js", 
    "Node.js", "Tailwind CSS", "Sass", "Git", "Figma"
  ],

  // PROJETS : Sélectionne 3 ou 4 projets max pour ne pas surcharger
  projects: [
    {
      id: 1,
      title: "NOM DU PROJET 1",
      category: "Design / Frontend",
      year: "2024",
      description: "Une phrase courte pour décrire le projet.",
      tech: ["Next.js", "GSAP"],
      link: "https://github.com/..."
    },
    {
      id: 2,
      title: "NOM DU PROJET 2",
      category: "Fullstack App",
      year: "2023",
      description: "Application web pour la gestion de...",
      tech: ["Vue.js", "Firebase"],
      link: "https://github.com/..."
    },
    {
      id: 3,
      title: "NOM DU PROJET 3",
      category: "Expérience 3D",
      year: "2023",
      description: "Portfolio immersif utilisant Three.js.",
      tech: ["Three.js", "React Three Fiber"],
      link: "https://github.com/..."
    }
  ],

  // CONTACT : Épuré
  contact: {
    email: "ton-email@exemple.com",
    socials: [
      { name: "GitHub", url: "https://github.com/CorentinBasson" },
      { name: "LinkedIn", url: "https://linkedin.com/in/..." },
      { name: "Twitter", url: "https://twitter.com/..." }
    ]
  }
};
