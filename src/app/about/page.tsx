import { getPageData, type AboutData } from "@/lib/content"
import AboutManga from "./page-manga"

export const metadata = {
  title: "À propos",
  description: "Découvrez mon parcours, mes compétences et ma passion pour le design graphique."
}

export default function AboutPage() {
  const aboutData = getPageData('about') as AboutData | null

  // Données par défaut si le contenu CMS n'existe pas encore
  const defaultData: AboutData = {
    title: "À propos de moi",
    subtitle: "Graphiste Freelance",
    profile_image: "/Cocorentin.jpg",
    skills: [
      "Adobe Creative Suite",
      "Figma", 
      "Sketch",
      "Photographie",
      "Illustration",
      "Branding",
      "Web Design",
      "Print Design"
    ],
    stats: {
      projects: { value: "7", label: "PROJETS" }
    },
    availability: {
      status: true,
      message: "DISPONIBLE POUR NOUVEAUX PROJETS"
    },
    cta_buttons: {
      contact: {
        text: "CONTACT.INIT()",
        email: "corentinbassonpro@gmail.com",
        icon: "mail"
      },
      cv: {
        text: "DOWNLOAD.CV()",
        file_url: "/cv.pdf",
        icon: "download"
      }
    },
    final_cta: {
      title: "PROJECT.INITIALIZE()",
      description_line1: "Ready to create something extraordinary together?",
      description_line2: "Initialize collaboration protocol...",
      buttons: {
        projects: {
          text: "VIEW.PROJECTS()",
          link: "/projects",
          icon: "external-link"
        },
        calendly: {
          text: "PLANIFIER.CALL()",
          link: "https://calendly.com/corentinbassonpro/30min",
          icon: "calendar"
        },
        contact: {
          text: "START.PROJECT()",
          email: "corentinbassonpro@gmail.com",
          icon: "mail"
        }
      }
    },
    body: `## Qui suis-je ?

Graphiste freelance depuis plus de 5 ans, je me spécialise dans la création d'identités visuelles fortes et mémorables. Ma formation en arts appliqués et mon expérience en agence m'ont permis de développer une approche méthodique et créative du design.

## Ma philosophie

Je crois que chaque projet a sa propre personnalité et mérite une approche unique. Mon rôle est de comprendre vos besoins, votre audience et vos objectifs pour créer des solutions visuelles qui vous démarquent.

## Mon processus créatif

1. **Écoute et analyse** : Comprendre votre projet et vos attentes
2. **Recherche et inspiration** : Explorer les tendances et références  
3. **Conception** : Développer les concepts créatifs
4. **Itération** : Affiner et perfectionner les créations
5. **Livraison** : Finaliser et décliner sur tous supports

## Collaborations

J'ai eu le plaisir de travailler avec des startups innovantes, des PME dynamiques et des associations engagées. Chaque collaboration est une opportunité d'apprendre et de créer quelque chose d'unique.

Prêt(e) à donner vie à votre projet ? Contactons-nous !`
  }

  const pageData = aboutData || defaultData

  return <AboutManga pageData={pageData} />
} 