import { getPageData, type AboutData } from "@/lib/content"
import AboutManga from "./_components/AboutPage"

export const metadata = {
  title: "À propos",
  description: "Découvrez mon parcours, mes compétences et ma passion pour le design graphique."
}

export default function AboutPage() {
  const aboutData = getPageData('about') as AboutData | null

  // Données par défaut si le contenu CMS n'existe pas encore
  const defaultData: AboutData = {
    title: "À propos de moi",
    subtitle: "Alternant BTS Communication - Graphiste & Photographe",
    profile_image: "/Cocorentin.jpg",
    skills: [
      "Adobe Creative Suite",
      "Figma",
      "Photographie",
      "Illustration",
      "Web Design"
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
        text: "CONTACT",
        email: "corentinbassonpro@gmail.com",
        icon: "mail"
      },
      cv: {
        text: "TÉLÉCHARGER CV",
        file_url: "/cv.pdf",
        icon: "download"
      }
    },
    final_cta: {
      title: "Un projet en tête ?",
      description_line1: "Prêt pour une collaboration autour d'un projet ?",
      description_line2: "Contactez-moi !",
      buttons: {
        projects: {
          text: "VOIR MES PROJETS",
          link: "/projects",
          icon: "external-link"
        },
        calendly: {
          text: "PLANIFIER UN APPEL",
          link: "https://calendly.com/corentinbassonpro/30min",
          icon: "calendar"
        },
        contact: {
          text: "DÉMARRER UN PROJET",
          email: "corentinbassonpro@gmail.com",
          icon: "mail"
        }
      }
    },
    body: `## Qui suis-je ?

Je m'appelle Corentin Basson, j'ai 24 ans et je prépare un BTS Communication en alternance. Curieux et observateur, j'aime analyser avant d'agir, ce qui me permet de développer des projets créatifs à la fois réfléchis et impactants.

## Ma philosophie

Je crois que la communication ne se résume pas à transmettre un message, mais à créer un lien sincère entre une marque et son public. Pour moi, chaque projet doit être à la fois stratégique et créatif, pensé dans le détail tout en restant simple et authentique.

## Mon processus créatif

1. **Observation & Analyse** → Je prends le temps d'observer et de comprendre l'environnement.
2. **Définition du besoin** → J'identifie les objectifs, les contraintes et les enjeux du projet.
3. **Veille & Inspiration** → Je me nourris de références pour élargir ma vision.
4. **Idéation & Concepts** → Je génère plusieurs pistes créatives.
5. **Réalisation visuelle** → Je conçois les supports avec un style minimaliste et authentique.

`
  }

  const pageData = aboutData || defaultData

  return <AboutManga pageData={pageData} />
} 