"use client"

/* eslint-disable react/no-unescaped-entities */

import type { ReactNode } from "react"
import Link from "next/link"
import {
  BarChart3,
  Briefcase,
  Bus,
  CalendarRange,
  CheckCircle2,
  ClipboardList,
  FileText,
  Flag,
  Handshake,
  Megaphone,
  MonitorPlay,
  Palette,
  Route,
  Shirt,
  Sparkles,
  Target,
  Trophy,
  Users,
  UtensilsCrossed,
} from "lucide-react"

import { NeonTitle } from "@/components/effects/NeonTitle"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { PdfViewer } from "@/components/ui/pdf-viewer"
import { ProjectGallery } from "@/components/ui/project-gallery"
import type { Project } from "@/lib/content"
import { resolveUrl } from "@/lib/utils"

interface GlowDayBtsCaseStudyProps {
  project: Project
  isDark: boolean
  textColor: string
  accentColor: string
  headingColor: string
  h2Class: string
  panelBg: string
  panelBorder: string
  innerBorder: string
  innerBg: string
  btnPrimary: string
}

interface SectionShellProps {
  title: string
  children: ReactNode
  h2Class: string
  panelBg: string
  panelBorder: string
}

interface SurfaceCardProps {
  title: string
  children: ReactNode
  icon?: ReactNode
  badge?: string
  isDark: boolean
  textColor: string
  headingColor: string
  innerBg: string
  innerBorder: string
}

function SectionShell({
  title,
  children,
  h2Class,
  panelBg,
  panelBorder,
}: SectionShellProps) {
  return (
    <section className={`rounded-2xl border ${panelBorder} ${panelBg} p-6 md:p-8 backdrop-blur-sm`}>
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div className="max-w-3xl">
          <NeonTitle as="h2" className={`text-3xl md:text-4xl font-bold uppercase ${h2Class}`} noAnimation>
            {title}
          </NeonTitle>
        </div>
        <div className="h-px w-full md:w-40 bg-white/0" />
      </div>
      {children}
    </section>
  )
}

function SurfaceCard({
  title,
  children,
  icon,
  badge,
  isDark,
  textColor,
  headingColor,
  innerBg,
  innerBorder,
}: SurfaceCardProps) {
  return (
    <article className={`h-full rounded-2xl border ${innerBorder} ${innerBg} p-5`}>
      <div className="mb-3 flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          {icon && (
            <span
              className={`flex h-10 w-10 items-center justify-center rounded-xl ${isDark ? "bg-white/10" : "bg-white/80"}`}
              style={{ color: headingColor }}
            >
              {icon}
            </span>
          )}
          <h3 className="text-lg font-bold" style={{ fontFamily: "'Oswald', sans-serif", color: headingColor }}>
            {title}
          </h3>
        </div>
        {badge && (
          <Badge
            className={`border uppercase tracking-wide ${isDark ? "border-white/20 bg-white/10 text-white" : "border-[#1a2f5a]/20 bg-white/80 text-[#1a2f5a]"}`}
            style={{ fontFamily: "'Oswald', sans-serif" }}
          >
            {badge}
          </Badge>
        )}
      </div>
      <div className="space-y-3 text-sm md:text-base leading-relaxed" style={{ color: textColor }}>
        {children}
      </div>
    </article>
  )
}

function TimelineStep({
  step,
  title,
  text,
  isDark,
  textColor,
  headingColor,
  innerBg,
  innerBorder,
}: {
  step: string
  title: string
  text: string
  isDark: boolean
  textColor: string
  headingColor: string
  innerBg: string
  innerBorder: string
}) {
  return (
    <div className={`relative rounded-2xl border ${innerBorder} ${innerBg} p-5`}>
      <span
        className={`mb-3 inline-flex h-10 w-10 items-center justify-center rounded-full border ${isDark ? "border-cyan-400/40 bg-cyan-400/10" : "border-[#1a2f5a]/20 bg-white/80"}`}
        style={{ fontFamily: "'Oswald', sans-serif", color: headingColor }}
      >
        {step}
      </span>
      <h3 className="mb-2 text-lg font-bold" style={{ fontFamily: "'Oswald', sans-serif", color: headingColor }}>
        {title}
      </h3>
      <p className="text-sm md:text-base leading-relaxed" style={{ color: textColor }}>
        {text}
      </p>
    </div>
  )
}

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-2">
      {items.map((item) => (
        <li key={item} className="flex items-start gap-2">
          <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-cyan-400" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  )
}

export function GlowDayBtsCaseStudy({
  project,
  isDark,
  textColor,
  accentColor,
  headingColor,
  h2Class,
  panelBg,
  panelBorder,
  innerBorder,
  innerBg,
  btnPrimary,
}: GlowDayBtsCaseStudyProps) {
  const pdfEvidence = project.preuves?.find((preuve) => preuve.type === "PDF" && (preuve.pdf || preuve.file))
  const pdfUrl = resolveUrl(pdfEvidence?.pdf || pdfEvidence?.file)

  const quickFacts = [
    { label: "Projet réel", value: "Journee d'integration EDN organisee dans un cadre collectif." },
    { label: "Role", value: "Chef de projet en coordination avec plusieurs poles." },
    { label: "Lieu", value: "Parc du Colosse a Saint-Andre, avec accueil au Campus Nord." },
    { label: "Temporalite", value: "Projet mene sur 5 mois pour un dispositif prevu de 8h a 15h30." },
  ]

  const workflowSteps = [
    {
      step: "01",
      title: "Creation",
      text: "Definition du concept Glow Day, cadrage des objectifs, repartition des poles et preparation des premiers livrables.",
    },
    {
      step: "02",
      title: "Validation",
      text: "Suivi du retroplanning sur Trello, points d'avancement et arbitrages collectifs lors des reunions hebdomadaires sur Teams.",
    },
    {
      step: "03",
      title: "Diffusion",
      text: "Declinaison du plan de communication sur les reseaux sociaux et les supports print pour faire connaitre l'evenement et le sponsoring.",
    },
    {
      step: "04",
      title: "Evaluation",
      text: "Mesure prevue via participation, engagement social et retours des etudiants comme des partenaires apres l'evenement.",
    },
  ]

  const productionCards = [
    {
      title: "Dossier sponsoring",
      description: "Support central de prospection pour presenter le concept, les objectifs, les packs et les contreparties proposees aux partenaires.",
      icon: <FileText className="h-5 w-5" />,
    },
    {
      title: "Affiches & flyers",
      description: "Supports print destines a annoncer l'evenement, renforcer la visibilite sur le campus et relayer le message de campagne.",
      icon: <Megaphone className="h-5 w-5" />,
    },
    {
      title: "Contenus reseaux sociaux",
      description: "Posts d'annonce, contenus de teasing et formats sponsors pour mobiliser les etudiants et valoriser les partenaires.",
      icon: <MonitorPlay className="h-5 w-5" />,
    },
    {
      title: "Kakemono",
      description: "Support de presence sur site et contrepartie premium pour renforcer la visibilite evenementielle des partenaires.",
      icon: <Flag className="h-5 w-5" />,
    },
    {
      title: "T-shirts",
      description: "Element d'identification des organisateurs et support de visibilite partenaire via l'integration de logos.",
      icon: <Shirt className="h-5 w-5" />,
    },
    {
      title: "Plan de communication & retroplanning",
      description: "Documents de coordination pour structurer les phases de diffusion, le suivi des taches et la validation des etapes.",
      icon: <ClipboardList className="h-5 w-5" />,
    },
  ]

  const proofCards = [
    {
      title: "Dossier sponsoring",
      text: "Prouve la realite du projet, le cadrage professionnel de l'evenement et la formalisation d'une offre partenaire.",
    },
    {
      title: "Plan de communication",
      text: "Prouve une logique de diffusion structuree entre supports print, reseaux sociaux et prise de parole autour du jour J.",
    },
    {
      title: "Supports print",
      text: "Prouvent la production concrete des livrables relies a la promotion de l'evenement et a la visibilite des sponsors.",
    },
    {
      title: "Contenus reseaux",
      text: "Prouvent l'activation digitale du projet et la capacite a adapter le message a plusieurs formats de publication.",
    },
    {
      title: "Organisation projet",
      text: "Prouve la coordination collective, la repartition des roles et le suivi de l'avancement via Trello et Teams.",
    },
    {
      title: "PDF complet",
      text: "Prouve l'ensemble de la demarche: contexte, equipe, programme, ateliers, plan media, packs de sponsoring et coordination globale.",
    },
  ]

  const btsSkills = [
    {
      title: "Veille",
      competence: "Analyser un contexte, les attentes des publics et les contraintes d'un evenement reel.",
      action: "Le projet a ete cadre a partir du contexte EDN, des objectifs d'integration et du choix d'un lieu adapte a une journee collective en plein air.",
      icon: <Sparkles className="h-5 w-5" />,
    },
    {
      title: "Creation",
      competence: "Concevoir une reponse coherente entre message, direction visuelle et experience proposee.",
      action: "L'identite Glow Day a ete declinée sur le dossier sponsoring, les supports print, les formats reseaux, les kakemonos et les t-shirts.",
      icon: <Palette className="h-5 w-5" />,
    },
    {
      title: "Production",
      competence: "Piloter la fabrication de livrables et la diffusion multi-supports.",
      action: "Le projet comprend un dossier complet, des affiches, des flyers, des publications sociales et un plan de communication organise par phases.",
      icon: <Briefcase className="h-5 w-5" />,
    },
    {
      title: "Prestataires",
      competence: "Coordonner des intervenants externes et integrer les contraintes budgetaires dans l'organisation.",
      action: "Le dispositif prevoit la gestion du transport en bus et de la restauration, avec une logique de recherche, demande de devis et selection.",
      icon: <Handshake className="h-5 w-5" />,
    },
    {
      title: "Evaluation",
      competence: "Definir des indicateurs de resultat pour mesurer l'efficacite d'un plan d'action.",
      action: "L'evaluation prevue porte sur la participation, l'engagement social, les retours des participants et les retours partenaires.",
      icon: <BarChart3 className="h-5 w-5" />,
    },
  ]

  return (
    <div className="space-y-8">
      <section className={`rounded-2xl border ${panelBorder} ${panelBg} p-6 md:p-8 backdrop-blur-sm`}>
        <div className="mb-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {quickFacts.map((fact) => (
            <div key={fact.label} className={`rounded-2xl border ${innerBorder} ${innerBg} p-5`}>
              <p
                className="mb-2 text-xs uppercase tracking-[0.25em]"
                style={{ fontFamily: "'Oswald', sans-serif", color: accentColor }}
              >
                {fact.label}
              </p>
              <p className="text-sm md:text-base leading-relaxed" style={{ color: textColor }}>
                {fact.value}
              </p>
            </div>
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.4fr,0.9fr]">
          <div className={`rounded-2xl border ${innerBorder} ${innerBg} p-6`}>
            <p className="text-base md:text-lg leading-relaxed" style={{ color: textColor }}>
              Glow Day by EDN est presente ici comme un projet evenementiel reel, mene en equipe dans le cadre du BTS Communication.
              L'enjeu n'etait pas seulement de produire un rendu visuel, mais de coordonner une organisation complete: sponsoring,
              communication, prestataires, logistique et experience participant.
            </p>
          </div>

          {pdfUrl && (
            <div className={`rounded-2xl border ${innerBorder} ${innerBg} p-4`}>
              <p
                className="mb-3 text-xs uppercase tracking-[0.25em]"
                style={{ fontFamily: "'Oswald', sans-serif", color: accentColor }}
              >
                Preuve principale
              </p>
              <PdfViewer
                url={pdfUrl}
                title="Dossier sponsoring Glow Day"
                isDark={isDark}
                accentColor={accentColor}
                allowDownload
              />
            </div>
          )}
        </div>
      </section>

      <SectionShell
        title="Contexte & objectifs"
        h2Class={h2Class}
        panelBg={panelBg}
        panelBorder={panelBorder}
      >
        <div className="grid gap-6 lg:grid-cols-2">
          <SurfaceCard
            title="Contexte du projet"
            badge="Projet vecu"
            icon={<Target className="h-5 w-5" />}
            isDark={isDark}
            textColor={textColor}
            headingColor={headingColor}
            innerBg={innerBg}
            innerBorder={innerBorder}
          >
            <p>
              Apres une precedente journee d'integration a Boucan Canot, l'EDN a choisi de faire evoluer le format avec un evenement
              relocalise au Parc du Colosse a Saint-Andre, un site plus adapte aux activites de plein air et a l'accueil d'une centaine d'apprentis.
            </p>
            <p>
              Le projet s'inscrit dans une organisation collective impliquant plusieurs poles et une coordination centrale pour faire converger
              communication, animation, logistique et partenariats.
            </p>
          </SurfaceCard>

          <SurfaceCard
            title="Objectifs poursuivis"
            badge="Cohesion"
            icon={<Trophy className="h-5 w-5" />}
            isDark={isDark}
            textColor={textColor}
            headingColor={headingColor}
            innerBg={innerBg}
            innerBorder={innerBorder}
          >
            <BulletList
              items={[
                "Creer du lien entre les etudiants de filieres variees.",
                "Encourager la collaboration via des activites sportives, ludiques et creatives.",
                "Renforcer le sentiment d'appartenance a l'EDN et valoriser l'image de l'ecole.",
                "Soutenir l'engagement des participants autour d'une journee conviviale et participative.",
              ]}
            />
            <div className={`mt-4 grid gap-3 sm:grid-cols-3`}>
              {[
                { label: "Lieu", value: "Parc du Colosse" },
                { label: "Duree evenement", value: "8h - 15h30" },
                { label: "Objectif de participation", value: "~150 participants" },
              ].map((item) => (
                <div key={item.label} className={`rounded-xl border ${innerBorder} ${isDark ? "bg-black/20" : "bg-white/70"} p-3`}>
                  <p className="text-xs uppercase tracking-wider" style={{ fontFamily: "'Oswald', sans-serif", color: accentColor }}>
                    {item.label}
                  </p>
                  <p className="mt-1 text-sm" style={{ color: textColor }}>
                    {item.value}
                  </p>
                </div>
              ))}
            </div>
          </SurfaceCard>
        </div>
      </SectionShell>

      <SectionShell
        title="Role & equipe projet"
        h2Class={h2Class}
        panelBg={panelBg}
        panelBorder={panelBorder}
      >
        <div className="grid gap-6 lg:grid-cols-2">
          <SurfaceCard
            title="Mon role"
            badge="Chef de projet"
            icon={<Users className="h-5 w-5" />}
            isDark={isDark}
            textColor={textColor}
            headingColor={headingColor}
            innerBg={innerBg}
            innerBorder={innerBorder}
          >
            <p>
              Mon role etait d'assurer la coordination globale du projet, le suivi des livrables et la supervision du sponsoring afin de garder
              une vision d'ensemble sur l'avancement.
            </p>
            <BulletList
              items={[
                "Coordination generale entre les differents poles.",
                "Suivi des livrables et de leur coherence.",
                "Supervision du dossier sponsoring et des contreparties partenaires.",
                "Cadrage des priorites pour maintenir une strategie complete et exploitable.",
              ]}
            />
          </SurfaceCard>

          <SurfaceCard
            title="Equipe projet"
            badge="Collectif"
            icon={<Briefcase className="h-5 w-5" />}
            isDark={isDark}
            textColor={textColor}
            headingColor={headingColor}
            innerBg={innerBg}
            innerBorder={innerBorder}
          >
            <p>
              L'equipe organisatrice etait composee d'etudiants de deuxieme annee du BTS Communication, accompagnes de deux formateurs et de membres du BDE.
            </p>
            <p>
              La repartition des roles a structure le travail collectif autour de plusieurs poles: communication, logistique, commercial, animation et creation de contenu.
            </p>
            <p>
              Cette organisation montre une vraie gestion d'equipe: chacun active ses competences, tout en contribuant a un objectif commun de cohesion et de valorisation de l'ecole.
            </p>
          </SurfaceCard>
        </div>
      </SectionShell>

      <SectionShell
        title="Gestion de projet"
        h2Class={h2Class}
        panelBg={panelBg}
        panelBorder={panelBorder}
      >
        <div className="mb-6 grid gap-6 lg:grid-cols-3">
          <SurfaceCard
            title="Trello"
            badge="Retroplanning"
            icon={<ClipboardList className="h-5 w-5" />}
            isDark={isDark}
            textColor={textColor}
            headingColor={headingColor}
            innerBg={innerBg}
            innerBorder={innerBorder}
          >
            <BulletList
              items={[
                "Organisation du retroplanning.",
                "Suivi des taches et des livrables.",
                "Validation progressive des etapes du projet.",
              ]}
            />
          </SurfaceCard>

          <SurfaceCard
            title="Reunions"
            badge="Hebdomadaires"
            icon={<CalendarRange className="h-5 w-5" />}
            isDark={isDark}
            textColor={textColor}
            headingColor={headingColor}
            innerBg={innerBg}
            innerBorder={innerBorder}
          >
            <BulletList
              items={[
                "Reunions hebdomadaires pour synchroniser l'equipe.",
                "Coordination et echanges via Microsoft Teams.",
                "Arbitrages collectifs pour aligner communication, sponsoring et logistique.",
              ]}
            />
          </SurfaceCard>

          <SurfaceCard
            title="Logique de workflow"
            badge="BTS"
            icon={<Route className="h-5 w-5" />}
            isDark={isDark}
            textColor={textColor}
            headingColor={headingColor}
            innerBg={innerBg}
            innerBorder={innerBorder}
          >
            <p>
              Le projet suit un enchainement lisible et professionnel: creation des supports, validation collective, diffusion sur les bons canaux, puis evaluation prevue par indicateurs.
            </p>
          </SurfaceCard>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {workflowSteps.map((item) => (
            <TimelineStep
              key={item.step}
              step={item.step}
              title={item.title}
              text={item.text}
              isDark={isDark}
              textColor={textColor}
              headingColor={headingColor}
              innerBg={innerBg}
              innerBorder={innerBorder}
            />
          ))}
        </div>
      </SectionShell>

      <SectionShell
        title="Sponsoring"
        h2Class={h2Class}
        panelBg={panelBg}
        panelBorder={panelBorder}
      >
        <div className="mb-6 grid gap-6 lg:grid-cols-[1.1fr,1.9fr]">
          <SurfaceCard
            title="Strategie sponsoring"
            badge="Financement"
            icon={<Handshake className="h-5 w-5" />}
            isDark={isDark}
            textColor={textColor}
            headingColor={headingColor}
            innerBg={innerBg}
            innerBorder={innerBorder}
          >
            <p>
              L'objectif du sponsoring etait de financer l'evenement et de structurer une proposition credible pour les partenaires autour d'un dossier clair.
            </p>
            <BulletList
              items={[
                "Creation d'un dossier de sponsoring complet.",
                "Presentation du concept, des objectifs et des valeurs du projet.",
                "Prospection et gestion de la relation partenaires a partir d'offres identifiees.",
              ]}
            />
          </SurfaceCard>

          <div className="grid gap-4 md:grid-cols-3">
            <SurfaceCard
              title="Pack Basic"
              badge="< 500 EUR"
              icon={<FileText className="h-5 w-5" />}
              isDark={isDark}
              textColor={textColor}
              headingColor={headingColor}
              innerBg={innerBg}
              innerBorder={innerBorder}
            >
              <BulletList
                items={[
                  "Logo sur les supports print.",
                  "Presence sur le post d'annonce.",
                  "Visibilite sur les reseaux sociaux.",
                ]}
              />
            </SurfaceCard>

            <SurfaceCard
              title="Pack Pro"
              badge="500 EUR +"
              icon={<Megaphone className="h-5 w-5" />}
              isDark={isDark}
              textColor={textColor}
              headingColor={headingColor}
              innerBg={innerBg}
              innerBorder={innerBorder}
            >
              <BulletList
                items={[
                  "Contreparties du pack basic.",
                  "Logo sur les t-shirts organisateurs.",
                  "Publication dediee sur les reseaux.",
                ]}
              />
            </SurfaceCard>

            <SurfaceCard
              title="Pack Premium"
              badge="800 EUR +"
              icon={<Target className="h-5 w-5" />}
              isDark={isDark}
              textColor={textColor}
              headingColor={headingColor}
              innerBg={innerBg}
              innerBorder={innerBorder}
            >
              <BulletList
                items={[
                  "Contreparties du pack pro.",
                  "Presence sur kakemono.",
                  "Video sponsor et sticker diffuse aux etudiants.",
                ]}
              />
            </SurfaceCard>
          </div>
        </div>

        <div className={`rounded-2xl border ${innerBorder} ${innerBg} p-5`}>
          <p className="text-sm md:text-base leading-relaxed" style={{ color: textColor }}>
            Le dossier prevoit aussi des contributions en argent, cadeaux, lots ou stands. Cette approche montre une recherche de partenariats pragmatique,
            centree a la fois sur le financement du projet et sur la valorisation des entreprises associees.
          </p>
        </div>
      </SectionShell>

      <SectionShell
        title="Prestataires & budget"
        h2Class={h2Class}
        panelBg={panelBg}
        panelBorder={panelBorder}
      >
        <div className="grid gap-6 lg:grid-cols-3">
          <SurfaceCard
            title="Transport"
            badge="Bus"
            icon={<Bus className="h-5 w-5" />}
            isDark={isDark}
            textColor={textColor}
            headingColor={headingColor}
            innerBg={innerBg}
            innerBorder={innerBorder}
          >
            <p>
              L'organisation prevoit un deplacement en bus entre le Campus Nord et le Parc du Colosse, ce qui implique un besoin de coordination transport.
            </p>
          </SurfaceCard>

          <SurfaceCard
            title="Restauration"
            badge="Dejeuner"
            icon={<UtensilsCrossed className="h-5 w-5" />}
            isDark={isDark}
            textColor={textColor}
            headingColor={headingColor}
            innerBg={innerBg}
            innerBorder={innerBorder}
          >
            <p>
              Le programme inclut un dejeuner puis une pause cafe, avec une logique de gestion de l'accueil et du confort sur une journee complete.
            </p>
          </SurfaceCard>

          <SurfaceCard
            title="Demarche de selection"
            badge="Budget"
            icon={<Briefcase className="h-5 w-5" />}
            isDark={isDark}
            textColor={textColor}
            headingColor={headingColor}
            innerBg={innerBg}
            innerBorder={innerBorder}
          >
            <BulletList
              items={[
                "Recherche de prestataires adaptes au format de l'evenement.",
                "Demande de devis pour cadrer les couts.",
                "Selection des solutions en fonction du budget et des besoins logistiques.",
              ]}
            />
          </SurfaceCard>
        </div>
      </SectionShell>

      <SectionShell
        title="Plan de communication"
        h2Class={h2Class}
        panelBg={panelBg}
        panelBorder={panelBorder}
      >
        <div className="mb-6 grid gap-6 lg:grid-cols-3">
          <SurfaceCard
            title="Teasing"
            badge="Phase 1"
            icon={<Sparkles className="h-5 w-5" />}
            isDark={isDark}
            textColor={textColor}
            headingColor={headingColor}
            innerBg={innerBg}
            innerBorder={innerBorder}
          >
            <p>
              Les contenus de teasing servent a installer l'univers Glow Day, susciter l'attente et preparer l'engagement autour de la journee.
            </p>
          </SurfaceCard>

          <SurfaceCard
            title="Annonce"
            badge="Phase 2"
            icon={<Megaphone className="h-5 w-5" />}
            isDark={isDark}
            textColor={textColor}
            headingColor={headingColor}
            innerBg={innerBg}
            innerBorder={innerBorder}
          >
            <p>
              La phase d'annonce mobilise les posts sociaux, les affiches, les flyers et les visuels partenaires pour rendre l'evenement lisible et visible.
            </p>
          </SurfaceCard>

          <SurfaceCard
            title="Jour J"
            badge="Phase 3"
            icon={<Flag className="h-5 w-5" />}
            isDark={isDark}
            textColor={textColor}
            headingColor={headingColor}
            innerBg={innerBg}
            innerBorder={innerBorder}
          >
            <p>
              La communication se prolonge sur site via les kakemonos, les t-shirts, la signaletique et la mise en avant des partenaires pendant l'evenement.
            </p>
          </SurfaceCard>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.4fr,1fr]">
          <SurfaceCard
            title="Canaux mobilises"
            icon={<MonitorPlay className="h-5 w-5" />}
            isDark={isDark}
            textColor={textColor}
            headingColor={headingColor}
            innerBg={innerBg}
            innerBorder={innerBorder}
          >
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <p className="mb-3 text-xs uppercase tracking-wider" style={{ fontFamily: "'Oswald', sans-serif", color: accentColor }}>
                  Reseaux sociaux
                </p>
                <BulletList
                  items={[
                    "Posts d'annonce.",
                    "Stories et contenus de teasing.",
                    "Carrousels sponsors et formats videos.",
                  ]}
                />
              </div>
              <div>
                <p className="mb-3 text-xs uppercase tracking-wider" style={{ fontFamily: "'Oswald', sans-serif", color: accentColor }}>
                  Supports print
                </p>
                <BulletList
                  items={[
                    "Affiches.",
                    "Flyers.",
                    "Kakemono evenementiel.",
                    "Integration logo sur les t-shirts.",
                  ]}
                />
              </div>
            </div>
          </SurfaceCard>

          <SurfaceCard
            title="Audience de reference"
            icon={<Users className="h-5 w-5" />}
            isDark={isDark}
            textColor={textColor}
            headingColor={headingColor}
            innerBg={innerBg}
            innerBorder={innerBorder}
          >
            <div className="grid gap-3 sm:grid-cols-3">
              {[
                { label: "Facebook", value: "289 abonnes" },
                { label: "Instagram", value: "268 abonnes" },
                { label: "LinkedIn", value: "281 abonnes" },
              ].map((item) => (
                <div key={item.label} className={`rounded-xl border ${innerBorder} ${isDark ? "bg-black/20" : "bg-white/70"} p-3`}>
                  <p className="text-xs uppercase tracking-wider" style={{ fontFamily: "'Oswald', sans-serif", color: accentColor }}>
                    {item.label}
                  </p>
                  <p className="mt-1 text-sm" style={{ color: textColor }}>
                    {item.value}
                  </p>
                </div>
              ))}
            </div>
          </SurfaceCard>
        </div>
      </SectionShell>

      <SectionShell
        title="Dispositif evenementiel"
        h2Class={h2Class}
        panelBg={panelBg}
        panelBorder={panelBorder}
      >
        <div className="mb-6 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          {[
            "Arrivee et petit dejeuner au Campus Nord.",
            "Deplacement en bus vers le Parc du Colosse.",
            "Mise en place des equipes, discours et photos.",
            "Ateliers, jeux, activites sportives et moments d'interaction.",
            "Scene ouverte, remise des lots et retour collectif.",
          ].map((step, index) => (
            <TimelineStep
              key={step}
              step={`0${index + 1}`}
              title={["Arrivee", "Transit", "Lancement", "Activites", "Cloture"][index]}
              text={step}
              isDark={isDark}
              textColor={textColor}
              headingColor={headingColor}
              innerBg={innerBg}
              innerBorder={innerBorder}
            />
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <SurfaceCard
            title="Ateliers"
            icon={<Users className="h-5 w-5" />}
            isDark={isDark}
            textColor={textColor}
            headingColor={headingColor}
            innerBg={innerBg}
            innerBorder={innerBorder}
          >
            <BulletList
              items={[
                "Confiance en soi: prise de parole et question qu'on ne se pose pas.",
                "Just Dance: un format collectif, simple et engageant.",
                "Espace detente: yoga, transat et bronzage.",
              ]}
            />
          </SurfaceCard>

          <SurfaceCard
            title="Activites de cohesion"
            icon={<Trophy className="h-5 w-5" />}
            isDark={isDark}
            textColor={textColor}
            headingColor={headingColor}
            innerBg={innerBg}
            innerBorder={innerBorder}
          >
            <BulletList
              items={[
                "Scene ouverte.",
                "Balle au prisonnier.",
                "Foot.",
                "Basket.",
                "Volley.",
              ]}
            />
            <p>
              L'ensemble du parcours a ete pense pour favoriser les interactions, faire circuler les participants entre plusieurs temps forts et renforcer la cohesion entre promotions.
            </p>
          </SurfaceCard>
        </div>
      </SectionShell>

      <SectionShell
        title="Productions"
        h2Class={h2Class}
        panelBg={panelBg}
        panelBorder={panelBorder}
      >
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {productionCards.map((card) => (
            <SurfaceCard
              key={card.title}
              title={card.title}
              icon={card.icon}
              isDark={isDark}
              textColor={textColor}
              headingColor={headingColor}
              innerBg={innerBg}
              innerBorder={innerBorder}
            >
              <p>{card.description}</p>
            </SurfaceCard>
          ))}
        </div>

        {project.gallery && project.gallery.length > 0 && (
          <div className="mt-6">
            <ProjectGallery
              gallery={project.gallery}
              title=""
              defaultLayout="justified"
              showLayoutSwitcher={false}
              className=""
            />
          </div>
        )}
      </SectionShell>

      <SectionShell
        title="Preuves"
        h2Class={h2Class}
        panelBg={panelBg}
        panelBorder={panelBorder}
      >
        <div className="mb-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {proofCards.map((card) => (
            <SurfaceCard
              key={card.title}
              title={card.title}
              icon={<CheckCircle2 className="h-5 w-5" />}
              isDark={isDark}
              textColor={textColor}
              headingColor={headingColor}
              innerBg={innerBg}
              innerBorder={innerBorder}
            >
              <p>{card.text}</p>
            </SurfaceCard>
          ))}
        </div>

        {pdfUrl && (
          <div className="grid gap-6 lg:grid-cols-[1.1fr,1.2fr]">
            <div className={`rounded-2xl border ${innerBorder} ${innerBg} p-5`}>
              <p className="mb-4 text-sm md:text-base leading-relaxed" style={{ color: textColor }}>
                Le PDF complet centralise les preuves les plus solides du projet: contexte, objectifs, equipe, programme, ateliers, plan de communication et packs partenaires.
              </p>
              <Button asChild className={btnPrimary} style={{ fontFamily: "'Oswald', sans-serif" }}>
                <Link href={pdfUrl} target="_blank">
                  <FileText className="mr-2 h-4 w-4" />
                  Ouvrir le PDF complet
                </Link>
              </Button>
            </div>

            <PdfViewer
              url={pdfUrl}
              title="PDF complet Glow Day"
              isDark={isDark}
              accentColor={accentColor}
              allowDownload
            />
          </div>
        )}
      </SectionShell>

      <SectionShell
        title="Evaluation"
        h2Class={h2Class}
        panelBg={panelBg}
        panelBorder={panelBorder}
      >
        <div className="grid gap-6 lg:grid-cols-2">
          <SurfaceCard
            title="Resultats attendus"
            badge="Objectifs"
            icon={<Target className="h-5 w-5" />}
            isDark={isDark}
            textColor={textColor}
            headingColor={headingColor}
            innerBg={innerBg}
            innerBorder={innerBorder}
          >
            <BulletList
              items={[
                "Environ 150 participants.",
                "Un bon niveau d'engagement pendant la journee.",
                "Une cohesion renforcee entre etudiants.",
                "Une image positive et federatrice pour l'EDN.",
              ]}
            />
          </SurfaceCard>

          <SurfaceCard
            title="Evaluation prevue"
            badge="Indicateurs"
            icon={<BarChart3 className="h-5 w-5" />}
            isDark={isDark}
            textColor={textColor}
            headingColor={headingColor}
            innerBg={innerBg}
            innerBorder={innerBorder}
          >
            <BulletList
              items={[
                "Taux de participation a l'evenement.",
                "Engagement sur les reseaux sociaux.",
                "Retours des participants.",
                "Retours des partenaires.",
              ]}
            />
          </SurfaceCard>
        </div>
      </SectionShell>

      <SectionShell
        title="Competences BTS mobilisees"
        h2Class={h2Class}
        panelBg={panelBg}
        panelBorder={panelBorder}
      >
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          {btsSkills.map((skill) => (
            <SurfaceCard
              key={skill.title}
              title={skill.title}
              icon={skill.icon}
              isDark={isDark}
              textColor={textColor}
              headingColor={headingColor}
              innerBg={innerBg}
              innerBorder={innerBorder}
            >
              <p>
                <strong style={{ color: headingColor }}>Competence :</strong> {skill.competence}
              </p>
              <p>
                <strong style={{ color: headingColor }}>Action realisee :</strong> {skill.action}
              </p>
            </SurfaceCard>
          ))}
        </div>
      </SectionShell>
    </div>
  )
}
