"use client"

/* eslint-disable react/no-unescaped-entities */

import type { ReactNode } from "react"
import Link from "next/link"
import {
  ArrowRight,
  BarChart3,
  CheckCircle2,
  Download,
  ExternalLink,
  FileText,
  Globe,
  Heart,
  ImageIcon,
  Lightbulb,
  Megaphone,
  Package,
  Palette,
  QrCode,
  Search,
  Sparkles,
  Smartphone,
  Target,
  Ticket,
  TrendingUp,
  Users,
} from "lucide-react"

import { NeonTitle } from "@/components/effects/NeonTitle"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { PdfViewer } from "@/components/ui/pdf-viewer"
import { ProjectGallery } from "@/components/ui/project-gallery"
import type { Project } from "@/lib/content"
import { fixCloudinaryPdfUrl, resolveUrl } from "@/lib/utils"

interface KelloggsBtsCaseStudyProps {
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
  sidebarBorder: string
  btnPrimary: string
}

type SectionTone = "strategie" | "creation" | "evaluation"

interface SectionShellProps {
  id: string
  tone: SectionTone
  eyebrow: string
  title: string
  intro?: string
  children: ReactNode
  isDark: boolean
  textColor: string
  headingColor: string
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
  id,
  tone,
  eyebrow,
  title,
  intro,
  children,
  isDark,
  textColor,
  headingColor,
  h2Class,
  panelBg,
  panelBorder,
}: SectionShellProps) {
  const toneClass =
    tone === "strategie"
      ? isDark
        ? "border-cyan-400/30 bg-cyan-400/10 text-cyan-100"
        : "border-[#1a2f5a]/25 bg-[#1a2f5a]/8 text-[#1a2f5a]"
      : tone === "creation"
        ? isDark
          ? "border-pink-400/30 bg-pink-400/10 text-pink-100"
          : "border-rose-400/25 bg-rose-500/8 text-rose-700"
        : isDark
          ? "border-emerald-400/30 bg-emerald-400/10 text-emerald-100"
          : "border-emerald-500/25 bg-emerald-500/8 text-emerald-700"

  return (
    <section id={id} className={`border ${panelBorder} ${panelBg} backdrop-blur-sm rounded-2xl p-6 md:p-8`}>
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between mb-8">
        <div className="max-w-3xl">
          <Badge className={`mb-4 border uppercase tracking-[0.25em] ${toneClass}`} style={{ fontFamily: "'Oswald', sans-serif" }}>
            {eyebrow}
          </Badge>
          <NeonTitle as="h2" className={`text-3xl md:text-4xl font-bold uppercase ${h2Class}`} noAnimation>
            {title}
          </NeonTitle>
          {intro && (
            <p className="text-base md:text-lg leading-relaxed mt-4" style={{ color: textColor }}>
              {intro}
            </p>
          )}
        </div>
        <div className={`h-px w-full md:w-40 ${isDark ? "bg-white/20" : "bg-[#1a2f5a]/15"}`} />
      </div>
      <div>{children}</div>
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
      <div className="flex items-start justify-between gap-3 mb-3">
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
            className={`border uppercase tracking-wide ${isDark ? "border-white/20 bg-white/10 text-white" : "border-[#1a2f5a]/20 bg-white/70 text-[#1a2f5a]"}`}
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

export function KelloggsBtsCaseStudy({
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
  sidebarBorder,
  btnPrimary,
}: KelloggsBtsCaseStudyProps) {
  const finalPdfUrl = project.preuves?.find((preuve) => preuve.type === "PDF" && preuve.pdf)?.pdf
  const resolvedProjectUrl = resolveUrl(project.project_url)

  const methodologySteps = [
    {
      step: "01",
      title: "Recherche & veille",
      icon: <Search className="h-5 w-5" />,
      text:
        "Analyse des codes de la pop culture, des éditions limitées et des mécaniques collector capables de créer du désir auprès d'une cible jeune. Cette phase a permis de cadrer une collaboration fictive crédible entre marque alimentaire, artistes musicaux et temps fort saisonnier.",
    },
    {
      step: "02",
      title: "Définition stratégique",
      icon: <Target className="h-5 w-5" />,
      text:
        "Formalisation des cibles, du positionnement, des objectifs cognitifs, affectifs et conatifs, puis construction d'une problématique claire. La stratégie a été pensée pour relier le produit, l'émotion et le digital dans un parcours cohérent.",
    },
    {
      step: "03",
      title: "Direction artistique",
      icon: <Palette className="h-5 w-5" />,
      text:
        "Création d'un territoire premium, pop et romantique, capable d'unifier trois artistes sans diluer la marque Kellogg's. Les choix visuels ont visé la cohérence entre packaging, collectibles, contenus musicaux et landing page.",
    },
    {
      step: "04",
      title: "Production des supports",
      icon: <Package className="h-5 w-5" />,
      text:
        "Déclinaison du concept sur plusieurs livrables: packagings collector, cartes ticket, visuels de vinyles, contenus de campagne et maquette de landing page. Chaque support devait conserver une lecture immédiate du concept et du bénéfice utilisateur.",
    },
    {
      step: "05",
      title: "Deploiement digital / diffusion",
      icon: <Megaphone className="h-5 w-5" />,
      text:
        "Conception d'un dispositif reliant l'achat physique a l'experience digitale via QR code, contenu exclusif, newsletter et engagement social. L'objectif etait de montrer que la diffusion ne s'arrete pas au visuel mais s'inscrit dans un parcours d'activation complet.",
    },
  ]

  const duoCards = [
    {
      title: "Bad Bunny x Frosties",
      text:
        "Bad Bunny apporte une energie brute, un style retro et un charisme audacieux qui font echo a Tony le Tigre et a l'univers des Frosties. Le duo active l'idee d'un packaging collector nerveux, solaire et immediatement memorable.",
    },
    {
      title: "Rosé x Miel Pops",
      text:
        "Rosé incarne une douceur lumineuse, elegante et emotionnelle qui s'aligne naturellement avec les Miel Pops. Cette association donne une lecture plus sensible et premium de la collection, ideale pour la dimension Saint-Valentin.",
    },
    {
      title: "Bruno Mars x Coco Pops",
      text:
        "Bruno Mars convoque le groove, la nostalgie et une energie accessible qui renforcent la convivialite des Coco Pops. Le resultat melange plaisir, souvenir d'enfance et desir de collection dans une execution tres pop.",
    },
  ]

  const deliverables = [
    {
      title: "Packagings collector",
      description:
        "Trois boites Kellogg's repensees comme pieces de collection, chacune associee a un artiste et a un univers graphique distinct.",
    },
    {
      title: "Cartes ticket & QR codes",
      description:
        "Des supports relais destines a scenariser la promesse d'exclusivite et a orienter l'utilisateur vers le parcours digital.",
    },
    {
      title: "Pochettes de single / vinyle",
      description:
        "Des visuels musicaux permettant d'etendre la collaboration au-dela du produit et de renforcer la credibilite du concept.",
    },
    {
      title: "Landing page",
      description:
        "Une page d'atterrissage de campagne structurée pour presenter l'operation, valoriser les contenus exclusifs et capter l'engagement.",
    },
    {
      title: "Galerie de campagne",
      description:
        "Un ensemble de maquettes et visuels servant a montrer la coherence de la direction artistique sur plusieurs formats.",
    },
  ]

  const flowSteps = [
    {
      title: "Packaging collector",
      icon: <Package className="h-5 w-5" />,
      text:
        "Premier point de contact: la boite attire, pose l'univers artiste x cereale et donne envie d'en savoir plus.",
    },
    {
      title: "Ticket ou QR code",
      icon: <QrCode className="h-5 w-5" />,
      text:
        "Le mecanisme d'activation transforme l'achat en experience et fait passer du produit physique vers l'interaction digitale.",
    },
    {
      title: "Landing page",
      icon: <Globe className="h-5 w-5" />,
      text:
        "La page centralise l'histoire, les preuves du concept, l'offre collector et les appels a l'action.",
    },
    {
      title: "Single exclusif / decouverte",
      icon: <Sparkles className="h-5 w-5" />,
      text:
        "Le contenu exclusif recompense la curiosite, renforce la desirabilite et prolonge la relation avec la collaboration.",
    },
    {
      title: "Newsletter / engagement social",
      icon: <Smartphone className="h-5 w-5" />,
      text:
        "Derniere etape: entretenir l'interet, encourager le partage et inscrire la campagne dans une logique de communaute.",
    },
  ]

  const proofCards = [
    {
      title: "Definition des cibles",
      description:
        "Prouve le travail de segmentation et la capacite a faire correspondre publics, usages et messages.",
      href: "#strategie",
      actionLabel: "Voir la strategie",
    },
    {
      title: "Copy strategie",
      description:
        "Demontre la formalisation du message: promesse, preuve, benefices et ton de la campagne.",
      href: "#copy-strategie",
      actionLabel: "Voir la copy strategie",
    },
    {
      title: "Maquettes / packagings",
      description:
        "Prouvent la traduction concrete de la strategie sur des supports visuels et produits coherents.",
      href: "#galerie",
      actionLabel: "Voir la galerie",
    },
    {
      title: "Landing page",
      description:
        "Illustre la logique de parcours, de conversion et de prolongement digital de la campagne.",
      href: resolvedProjectUrl || undefined,
      actionLabel: resolvedProjectUrl ? "Ouvrir la landing page" : undefined,
    },
    {
      title: "Dossier final PDF",
      description:
        "Regroupe l'ensemble de la demarche, des choix créatifs et des productions pour une lecture complete du projet.",
      href: finalPdfUrl ? fixCloudinaryPdfUrl(finalPdfUrl) : undefined,
      actionLabel: finalPdfUrl ? "Ouvrir le dossier" : undefined,
    },
  ].filter((proof) => proof.href && proof.actionLabel)

  const qualityCriteria = [
    "Cohérence graphique entre les packagings, les contenus musicaux et la landing page.",
    "Compréhension immédiate du concept de collaboration et de son temps fort Saint-Valentin.",
    "Lisibilité du parcours utilisateur entre point de vente, QR code et expérience digitale.",
    "Adéquation entre la cible jeune, le message exclusif et les supports sélectionnés.",
    "Attractivité des visuels et capacité à créer de la désirabilité sur une édition limitée.",
    "Pertinence du dispositif digital au regard des objectifs d'engagement et de mémorisation.",
  ]

  const projectedKpis = [
    {
      value: "12 a 18 %",
      title: "Taux de scan QR code envisage",
      description:
        "Hypothese de performance pour mesurer l'attractivite du mecanisme collector et du contenu exclusif.",
    },
    {
      value: "6 a 10 %",
      title: "Taux d'inscription newsletter attendu",
      description:
        "Indicateur projete pour evaluer la capacite de la landing page a transformer l'interet en contact qualifie.",
    },
    {
      value: "Fort",
      title: "Engagement social envisage",
      description:
        "Partages, commentaires, participation a des contenus UGC et relais sur TikTok ou Instagram autour de la collaboration.",
    },
    {
      value: "Hausse de l'intention",
      title: "Intention d'achat projetee",
      description:
        "Critere d'evaluation lie au desir de collection, a la rarete percue et a la force des associations artistes x cereales.",
    },
    {
      value: "Memorisation renforcee",
      title: "Souvenir de campagne attendu",
      description:
        "Hypothese portant sur la capacite du concept a rester identifiable grace au duo packaging + musique + exclusivite.",
    },
  ]

  const skills = [
    {
      title: "Veille creative et technologique",
      icon: <Search className="h-5 w-5" />,
      competence:
        "Mobiliser une veille pour nourrir un concept coherent avec les usages, les references culturelles et les codes visuels actuels.",
      concret:
        "J'ai explore les mecanismes d'edition limitee, les codes de la pop culture et les usages digitaux capables d'activer une cible jeune.",
    },
    {
      title: "Creation de contenus",
      icon: <Palette className="h-5 w-5" />,
      competence:
        "Concevoir des messages et des univers visuels adaptes a une cible, un contexte et un objectif de communication.",
      concret:
        "J'ai construit la copy strategie, le storytelling et la direction artistique de la collaboration sur plusieurs supports.",
    },
    {
      title: "Production et diffusion",
      icon: <Megaphone className="h-5 w-5" />,
      competence:
        "Produire des supports multi-formats et penser leur articulation dans un dispositif de communication coherent.",
      concret:
        "J'ai realise les maquettes packagings, les visuels derives et la logique de diffusion vers la landing page et les activations digitales.",
    },
    {
      title: "Controle et evaluation",
      icon: <BarChart3 className="h-5 w-5" />,
      competence:
        "Definir des criteres de qualite et des indicateurs pertinents pour evaluer la coherence et l'efficacite d'un projet.",
      concret:
        "J'ai formalise des criteres de controle et des KPI projetes afin d'evaluer le dispositif sans presenter de faux resultats mesures.",
    },
  ]

  const infoCards = [
    {
      label: "Date",
      value: new Date(project.date).toLocaleDateString("fr-FR", {
        year: "numeric",
        month: "long",
      }),
    },
    project.annonceur ? { label: "Annonceur", value: project.annonceur } : null,
    project.contexte ? { label: "Contexte", value: project.contexte } : null,
    project.duration ? { label: "Duree", value: project.duration } : null,
    project.status ? { label: "Statut", value: project.status } : null,
  ].filter(Boolean) as Array<{ label: string; value: string }>

  const listMarkerClass = isDark ? "text-cyan-300" : "text-[#1a2f5a]"
  const subtleTextClass = isDark ? "text-white/70" : "text-[#1a2f5a]/70"

  return (
    <div className="space-y-8">
      <SectionShell
        id="contexte-demande"
        tone="strategie"
        eyebrow="Contexte & demande"
        title="Une collaboration fictive pensee comme un cas BTS Communication"
        intro="Ce projet a ete imagine dans un cadre pedagogique pour repondre a une demande de communication complete: concevoir une collaboration de marque credible, desirable et deployable sur plusieurs supports, avec une dimension creative forte mais aussi une vraie logique de preuve, de methode et d'evaluation."
        isDark={isDark}
        textColor={textColor}
        headingColor={headingColor}
        h2Class={h2Class}
        panelBg={panelBg}
        panelBorder={panelBorder}
      >
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <SurfaceCard
            title="Contexte pedagogique"
            icon={<FileText className="h-5 w-5" />}
            isDark={isDark}
            textColor={textColor}
            headingColor={headingColor}
            innerBg={innerBg}
            innerBorder={innerBorder}
          >
            <p>Projet fictif realise dans le cadre du BTS Communication, avec une attente forte sur la demarche, la strategie et la capacite a produire des supports coherents.</p>
          </SurfaceCard>
          <SurfaceCard
            title="Besoin de communication"
            icon={<Megaphone className="h-5 w-5" />}
            isDark={isDark}
            textColor={textColor}
            headingColor={headingColor}
            innerBg={innerBg}
            innerBorder={innerBorder}
          >
            <p>Imaginer une edition speciale Saint-Valentin capable de renouveler l'image de Kellogg's, de generer du desir et de creer un lien plus fort avec une cible jeune et connectee.</p>
          </SurfaceCard>
          <SurfaceCard
            title="Problematique"
            icon={<Lightbulb className="h-5 w-5" />}
            isDark={isDark}
            textColor={textColor}
            headingColor={headingColor}
            innerBg={innerBg}
            innerBorder={innerBorder}
          >
            <p>Comment concevoir une collaboration inattendue entre une marque alimentaire et des artistes musicaux, tout en restant credible, lisible et performante sur des supports physiques et digitaux ?</p>
          </SurfaceCard>
          <SurfaceCard
            title="Contraintes"
            icon={<CheckCircle2 className="h-5 w-5" />}
            isDark={isDark}
            textColor={textColor}
            headingColor={headingColor}
            innerBg={innerBg}
            innerBorder={innerBorder}
          >
            <ul className="space-y-2">
              <li>Temps de production limite dans un cadre pedagogique.</li>
              <li>Cohérence visuelle entre plusieurs artistes et plusieurs supports.</li>
              <li>Dimension digitale indispensable pour rendre la campagne credible.</li>
              <li>Equilibre a trouver entre creativite, lisibilite et realisme de la collaboration.</li>
            </ul>
          </SurfaceCard>
        </div>
      </SectionShell>

      <SectionShell
        id="concept"
        tone="creation"
        eyebrow="Concept"
        title="Un petit-dejeuner collector, musical et emotionnel"
        intro={project.excerpt}
        isDark={isDark}
        textColor={textColor}
        headingColor={headingColor}
        h2Class={h2Class}
        panelBg={panelBg}
        panelBorder={panelBorder}
      >
        <div className="grid gap-4 lg:grid-cols-[1.3fr_0.7fr]">
          <SurfaceCard
            title="Concept du projet"
            icon={<Sparkles className="h-5 w-5" />}
            badge="Creation"
            isDark={isDark}
            textColor={textColor}
            headingColor={headingColor}
            innerBg={innerBg}
            innerBorder={innerBorder}
          >
            <p>
              Pour la Saint-Valentin, Kellogg&apos;s s&apos;associe a trois artistes internationaux pour une edition collector aussi inattendue que coherente:
              <strong style={{ color: accentColor }}> Bad Bunny x Frosties</strong>,
              <strong style={{ color: accentColor }}> Rosé x Miel Pops</strong> et
              <strong style={{ color: accentColor }}> Bruno Mars x Coco Pops</strong>.
            </p>
            <p>
              Chaque duo relie une cereal iconique a un univers musical compatible afin de faire du petit-dejeuner un moment de desir, d'emotion et de decouverte exclusive.
            </p>
          </SurfaceCard>

          <SurfaceCard
            title="Intention de communication"
            icon={<Heart className="h-5 w-5" />}
            badge="Saint-Valentin"
            isDark={isDark}
            textColor={textColor}
            headingColor={headingColor}
            innerBg={innerBg}
            innerBorder={innerBorder}
          >
            <p>La collaboration ne cherche pas seulement a habiller un produit: elle transforme une routine du quotidien en experience collector et partageable.</p>
            <p>Le territoire romantique et pop sert a la fois la desirabilite du packaging, la memoire de campagne et l'envie d'entrer dans l'univers digital.</p>
          </SurfaceCard>
        </div>
      </SectionShell>

      <SectionShell
        id="strategie"
        tone="strategie"
        eyebrow="Strategie"
        title="Une strategie construite pour relier desir, exclusivite et activation digitale"
        intro="La valeur du projet repose sur une articulation claire entre un concept distinctif, une cible jeune et des supports capables de prolonger l'experience au-dela du packaging."
        isDark={isDark}
        textColor={textColor}
        headingColor={headingColor}
        h2Class={h2Class}
        panelBg={panelBg}
        panelBorder={panelBorder}
      >
        <div className="grid gap-4 lg:grid-cols-2">
          <SurfaceCard
            title="Problematique"
            icon={<Lightbulb className="h-5 w-5" />}
            isDark={isDark}
            textColor={textColor}
            headingColor={headingColor}
            innerBg={innerBg}
            innerBorder={innerBorder}
          >
            <p>Comment faire emerger Kellogg's sur une edition speciale en creant une collaboration qui attire une cible jeune, sans perdre la lisibilite de la marque ni la coherence globale du dispositif ?</p>
          </SurfaceCard>

          <SurfaceCard
            title="Insight"
            icon={<Users className="h-5 w-5" />}
            isDark={isDark}
            textColor={textColor}
            headingColor={headingColor}
            innerBg={innerBg}
            innerBorder={innerBorder}
          >
            <p>Les jeunes consommateurs n'attendent plus seulement un produit: ils recherchent des experiences de marque qu'ils peuvent collectionner, partager et vivre comme un moment exclusif a forte valeur emotionnelle.</p>
          </SurfaceCard>

          <SurfaceCard
            title="Cibles"
            icon={<Target className="h-5 w-5" />}
            badge="Segmentation"
            isDark={isDark}
            textColor={textColor}
            headingColor={headingColor}
            innerBg={innerBg}
            innerBorder={innerBorder}
          >
            <p>{project.cibles}</p>
          </SurfaceCard>

          <SurfaceCard
            title="Positionnement"
            icon={<Sparkles className="h-5 w-5" />}
            badge="Edition limitee"
            isDark={isDark}
            textColor={textColor}
            headingColor={headingColor}
            innerBg={innerBg}
            innerBorder={innerBorder}
          >
            <p>{project.strategie_creative}</p>
          </SurfaceCard>
        </div>

        <div className="grid gap-4 xl:grid-cols-3 mt-4">
          <SurfaceCard
            title="Objectifs cognitifs"
            icon={<FileText className="h-5 w-5" />}
            isDark={isDark}
            textColor={textColor}
            headingColor={headingColor}
            innerBg={innerBg}
            innerBorder={innerBorder}
          >
            <ul className="space-y-2">
              {project.objectifs_cognitifs?.map((item) => (
                <li key={item} className="flex gap-2">
                  <span className={listMarkerClass}>•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </SurfaceCard>

          <SurfaceCard
            title="Objectifs affectifs"
            icon={<Heart className="h-5 w-5" />}
            isDark={isDark}
            textColor={textColor}
            headingColor={headingColor}
            innerBg={innerBg}
            innerBorder={innerBorder}
          >
            <ul className="space-y-2">
              {project.objectifs_affectifs?.map((item) => (
                <li key={item} className="flex gap-2">
                  <span className={listMarkerClass}>•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </SurfaceCard>

          <SurfaceCard
            title="Objectifs conatifs"
            icon={<TrendingUp className="h-5 w-5" />}
            isDark={isDark}
            textColor={textColor}
            headingColor={headingColor}
            innerBg={innerBg}
            innerBorder={innerBorder}
          >
            <ul className="space-y-2">
              {project.objectifs_conatifs?.map((item) => (
                <li key={item} className="flex gap-2">
                  <span className={listMarkerClass}>•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </SurfaceCard>
        </div>
      </SectionShell>

      <SectionShell
        id="copy-strategie"
        tone="strategie"
        eyebrow="Copy strategie"
        title="Un discours clair, desirant et credible"
        intro="La copy strategie traduit le concept en promesse de communication et en benefices concrets pour la cible."
        isDark={isDark}
        textColor={textColor}
        headingColor={headingColor}
        h2Class={h2Class}
        panelBg={panelBg}
        panelBorder={panelBorder}
      >
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <SurfaceCard
            title="Promesse"
            icon={<Sparkles className="h-5 w-5" />}
            isDark={isDark}
            textColor={textColor}
            headingColor={headingColor}
            innerBg={innerBg}
            innerBorder={innerBorder}
          >
            <p>"Un petit-dejeuner qui fait battre le coeur: Kellogg's transforme la Saint-Valentin en experience collector, musicale et exclusive avec Bruno Mars, Bad Bunny et Rosé."</p>
          </SurfaceCard>

          <SurfaceCard
            title="Preuve"
            icon={<CheckCircle2 className="h-5 w-5" />}
            isDark={isDark}
            textColor={textColor}
            headingColor={headingColor}
            innerBg={innerBg}
            innerBorder={innerBorder}
          >
            <p>La promesse repose sur une execution tangible: packagings collector, QR codes, tickets, contenus exclusifs, landing page et univers visuels differencies mais relies par une meme campagne.</p>
          </SurfaceCard>

          <SurfaceCard
            title="Benefices"
            icon={<Heart className="h-5 w-5" />}
            badge="3 niveaux"
            isDark={isDark}
            textColor={textColor}
            headingColor={headingColor}
            innerBg={innerBg}
            innerBorder={innerBorder}
          >
            <p><strong style={{ color: accentColor }}>Emotionnels:</strong> vivre un moment de plaisir, de surprise et d'attachement a un univers artistique valorisant.</p>
            <p><strong style={{ color: accentColor }}>Experientiels:</strong> acceder a une experience collector, exclusive et partageable au-dela du simple achat.</p>
            <p><strong style={{ color: accentColor }}>Produit / engagement:</strong> donner une raison concrete d'acheter, scanner, s'inscrire et revenir vers la marque.</p>
          </SurfaceCard>

          <SurfaceCard
            title="Ton"
            icon={<Megaphone className="h-5 w-5" />}
            isDark={isDark}
            textColor={textColor}
            headingColor={headingColor}
            innerBg={innerBg}
            innerBorder={innerBorder}
          >
            <p>Doux, romantique, pop et engageant. Le ton cherche un equilibre entre chaleur emotionnelle, glamour accessible et energie festive, sans perdre la lisibilite commerciale du message.</p>
          </SurfaceCard>
        </div>
      </SectionShell>

      <SectionShell
        id="duos"
        tone="creation"
        eyebrow="Duos artiste x cereale"
        title="Trois associations pensees comme des evidences visuelles et emotionnelles"
        isDark={isDark}
        textColor={textColor}
        headingColor={headingColor}
        h2Class={h2Class}
        panelBg={panelBg}
        panelBorder={panelBorder}
      >
        <div className="grid gap-4 lg:grid-cols-3">
          {duoCards.map((duo) => (
            <SurfaceCard
              key={duo.title}
              title={duo.title}
              icon={<ImageIcon className="h-5 w-5" />}
              badge="Duo creatif"
              isDark={isDark}
              textColor={textColor}
              headingColor={headingColor}
              innerBg={innerBg}
              innerBorder={innerBorder}
            >
              <p>{duo.text}</p>
            </SurfaceCard>
          ))}
        </div>
      </SectionShell>

      <SectionShell
        id="storytelling"
        tone="creation"
        eyebrow="Storytelling"
        title="Une mise en recit qui transforme le produit en experience"
        intro="Le storytelling donne de la valeur au dispositif: il cree l'envie d'acheter, de scanner, puis de prolonger l'experience au-dela du packaging."
        isDark={isDark}
        textColor={textColor}
        headingColor={headingColor}
        h2Class={h2Class}
        panelBg={panelBg}
        panelBorder={panelBorder}
      >
        <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
          <SurfaceCard
            title="La legende des tickets d'or"
            icon={<Ticket className="h-5 w-5" />}
            badge="Narration"
            isDark={isDark}
            textColor={textColor}
            headingColor={headingColor}
            innerBg={innerBg}
            innerBorder={innerBorder}
          >
            <p>La Saint-Valentin approche et cette annee, l'amour s'invite jusque dans le petit-dejeuner. Cache entre les cereales, un ticket d'or devient le symbole de la recompense ultime et de l'acces privilegie a l'univers de l'artiste.</p>
            <p>Cette mecanique permet de justifier la rarete, d'installer une tension narrative simple a comprendre et de rendre l'edition limitee plus memorisable.</p>
          </SurfaceCard>

          <SurfaceCard
            title='Les singles exclusifs "Aime-moi"'
            icon={<Sparkles className="h-5 w-5" />}
            badge="Contenu"
            isDark={isDark}
            textColor={textColor}
            headingColor={headingColor}
            innerBg={innerBg}
            innerBorder={innerBorder}
          >
            <ul className="space-y-2">
              <li><strong style={{ color: accentColor }}>Bad Bunny:</strong> une lecture intense et brutale de l'amour, entre passion et tension.</li>
              <li><strong style={{ color: accentColor }}>Rosé:</strong> une interpretation delicate et melancolique, plus intime et contemplative.</li>
              <li><strong style={{ color: accentColor }}>Bruno Mars:</strong> une approche groovy, sensuelle et lumineuse qui rend l'amour immediatement partageable.</li>
            </ul>
          </SurfaceCard>
        </div>
      </SectionShell>

      <SectionShell
        id="processus"
        tone="strategie"
        eyebrow="Methodologie"
        title="Un processus de travail structure en cinq etapes"
        intro="La demarche a ete construite comme une progression logique: comprendre, cadrer, creer, produire puis penser la diffusion."
        isDark={isDark}
        textColor={textColor}
        headingColor={headingColor}
        h2Class={h2Class}
        panelBg={panelBg}
        panelBorder={panelBorder}
      >
        <div className="grid gap-4 lg:grid-cols-5">
          {methodologySteps.map((step) => (
            <article key={step.step} className={`rounded-2xl border ${innerBorder} ${innerBg} p-5 relative overflow-hidden`}>
              <div className={`absolute top-0 left-0 h-1 w-full ${isDark ? "bg-cyan-300/60" : "bg-[#1a2f5a]/35"}`} />
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-bold tracking-[0.3em]" style={{ fontFamily: "'Oswald', sans-serif", color: accentColor }}>
                  {step.step}
                </span>
                <span style={{ color: headingColor }}>{step.icon}</span>
              </div>
              <h3 className="text-lg font-bold mb-3" style={{ fontFamily: "'Oswald', sans-serif", color: headingColor }}>
                {step.title}
              </h3>
              <p className="text-sm leading-relaxed" style={{ color: textColor }}>
                {step.text}
              </p>
            </article>
          ))}
        </div>
      </SectionShell>

      <SectionShell
        id="livrables"
        tone="creation"
        eyebrow="Livrables"
        title="Des supports concus comme un ensemble coherent"
        intro="Chaque livrable repond a une fonction precise dans le dispositif, avec une logique de complementarite entre print, packaging et digital."
        isDark={isDark}
        textColor={textColor}
        headingColor={headingColor}
        h2Class={h2Class}
        panelBg={panelBg}
        panelBorder={panelBorder}
      >
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          {deliverables.map((item) => (
            <SurfaceCard
              key={item.title}
              title={item.title}
              icon={<Package className="h-5 w-5" />}
              isDark={isDark}
              textColor={textColor}
              headingColor={headingColor}
              innerBg={innerBg}
              innerBorder={innerBorder}
            >
              <p>{item.description}</p>
            </SurfaceCard>
          ))}
        </div>
      </SectionShell>

      <SectionShell
        id="diffusion"
        tone="strategie"
        eyebrow="Parcours utilisateur"
        title="Un dispositif de diffusion pense de bout en bout"
        intro="Le parcours utilisateur montre comment le projet active plusieurs points de contact, depuis le packaging jusqu'a l'engagement relationnel."
        isDark={isDark}
        textColor={textColor}
        headingColor={headingColor}
        h2Class={h2Class}
        panelBg={panelBg}
        panelBorder={panelBorder}
      >
        <div className="flex flex-col xl:flex-row xl:items-stretch gap-3 mb-6">
          {flowSteps.map((step, index) => (
            <div key={step.title} className="flex flex-1 items-stretch gap-3">
              <article className={`flex-1 rounded-2xl border ${innerBorder} ${innerBg} p-5`}>
                <div className="flex items-center gap-3 mb-3">
                  <span className={`flex h-10 w-10 items-center justify-center rounded-xl ${isDark ? "bg-white/10" : "bg-white/75"}`} style={{ color: headingColor }}>
                    {step.icon}
                  </span>
                  <h3 className="text-lg font-bold" style={{ fontFamily: "'Oswald', sans-serif", color: headingColor }}>
                    {step.title}
                  </h3>
                </div>
                <p className="text-sm leading-relaxed" style={{ color: textColor }}>
                  {step.text}
                </p>
              </article>
              {index < flowSteps.length - 1 && (
                <div className="hidden xl:flex items-center justify-center px-1" style={{ color: accentColor }}>
                  <ArrowRight className="h-5 w-5" />
                </div>
              )}
            </div>
          ))}
        </div>

        <div className={`rounded-2xl border ${innerBorder} ${innerBg} p-5`}>
          <p className="text-sm md:text-base leading-relaxed" style={{ color: textColor }}>
            L'ensemble du dispositif a ete pense comme un enchainement de preuves de valeur: le produit capte l'attention, le mecanisme collector declenche l'action, la landing page rassure et structure l'offre, puis le contenu exclusif et l'engagement social prolongent la relation avec la marque.
          </p>
        </div>
      </SectionShell>

      {project.gallery && project.gallery.length > 0 && (
        <SectionShell
          id="galerie"
          tone="creation"
          eyebrow="Galerie"
          title="Apercu des productions visuelles"
          intro="La galerie permet d'observer la coherence formelle du projet sur les differents supports realises."
          isDark={isDark}
          textColor={textColor}
          headingColor={headingColor}
          h2Class={h2Class}
          panelBg={panelBg}
          panelBorder={panelBorder}
        >
          <ProjectGallery gallery={project.gallery} title="" defaultLayout="justified" showLayoutSwitcher={false} className="" />
        </SectionShell>
      )}

      <SectionShell
        id="preuves"
        tone="strategie"
        eyebrow="Preuves"
        title="Des preuves structurees pour documenter la methode"
        intro="Cette section rassemble les elements qui permettent de verifier la logique du projet a travers les supports deja disponibles."
        isDark={isDark}
        textColor={textColor}
        headingColor={headingColor}
        h2Class={h2Class}
        panelBg={panelBg}
        panelBorder={panelBorder}
      >
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {proofCards.map((proof) => (
            <article key={proof.title} className={`rounded-2xl border ${innerBorder} ${innerBg} p-5 flex flex-col`}>
              <div className="mb-4">
                <h3 className="text-lg font-bold" style={{ fontFamily: "'Oswald', sans-serif", color: headingColor }}>
                  {proof.title}
                </h3>
              </div>

              <p className="text-sm leading-relaxed mb-5" style={{ color: textColor }}>
                {proof.description}
              </p>

              <div className="mt-auto">
                <Button asChild className={`w-full ${btnPrimary}`} style={{ fontFamily: "'Oswald', sans-serif" }}>
                  {proof.href?.startsWith("#") ? (
                    <a href={proof.href}>
                      <ArrowRight className="mr-2 h-4 w-4" />
                      {proof.actionLabel}
                    </a>
                  ) : (
                    <Link href={proof.href!} target="_blank" rel="noopener noreferrer">
                      {proof.href?.includes(".pdf") ? <Download className="mr-2 h-4 w-4" /> : <ExternalLink className="mr-2 h-4 w-4" />}
                      {proof.actionLabel}
                    </Link>
                  )}
                </Button>
              </div>
            </article>
          ))}
        </div>

        {finalPdfUrl && (
          <div className={`mt-6 rounded-2xl border ${innerBorder} ${innerBg} p-5`}>
            <h3 className="text-lg font-bold mb-4" style={{ fontFamily: "'Oswald', sans-serif", color: headingColor }}>
              Consultation rapide du dossier final
            </h3>
            <PdfViewer
              url={fixCloudinaryPdfUrl(finalPdfUrl)}
              title="Dossier final PDF"
              isDark={isDark}
              accentColor={accentColor}
              allowDownload
            />
          </div>
        )}
      </SectionShell>

      <SectionShell
        id="evaluation"
        tone="evaluation"
        eyebrow="Evaluation & controle"
        title="Des criteres clairs pour verifier la qualite et envisager la performance"
        intro="Comme il s'agit d'un projet simule, cette partie distingue volontairement les criteres de controle qualitatif des hypotheses de performance attendues."
        isDark={isDark}
        textColor={textColor}
        headingColor={headingColor}
        h2Class={h2Class}
        panelBg={panelBg}
        panelBorder={panelBorder}
      >
        <div className="grid gap-4 xl:grid-cols-[1fr_1.1fr]">
          <SurfaceCard
            title="A. Criteres de controle qualite"
            icon={<CheckCircle2 className="h-5 w-5" />}
            badge="Evaluation qualitative"
            isDark={isDark}
            textColor={textColor}
            headingColor={headingColor}
            innerBg={innerBg}
            innerBorder={innerBorder}
          >
            <ul className="space-y-3">
              {qualityCriteria.map((item) => (
                <li key={item} className="flex gap-3">
                  <CheckCircle2 className="h-4 w-4 mt-1 flex-shrink-0" style={{ color: accentColor }} />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </SurfaceCard>

          <SurfaceCard
            title="B. Indicateurs de performance attendus"
            icon={<BarChart3 className="h-5 w-5" />}
            badge="Hypotheses de performance"
            isDark={isDark}
            textColor={textColor}
            headingColor={headingColor}
            innerBg={innerBg}
            innerBorder={innerBorder}
          >
            <div className="grid gap-3 md:grid-cols-2">
              {projectedKpis.map((kpi) => (
                <div key={kpi.title} className={`rounded-xl border ${sidebarBorder} p-4`}>
                  <p className="text-xs uppercase tracking-[0.2em] mb-2" style={{ fontFamily: "'Oswald', sans-serif", color: accentColor }}>
                    Resultat attendu
                  </p>
                  <p className="text-2xl font-bold mb-2" style={{ fontFamily: "'Oswald', sans-serif", color: headingColor }}>
                    {kpi.value}
                  </p>
                  <h4 className="text-base font-bold mb-2" style={{ fontFamily: "'Oswald', sans-serif", color: textColor }}>
                    {kpi.title}
                  </h4>
                  <p className={`text-sm leading-relaxed ${subtleTextClass}`}>{kpi.description}</p>
                </div>
              ))}
            </div>
          </SurfaceCard>
        </div>
      </SectionShell>

      <SectionShell
        id="competences"
        tone="evaluation"
        eyebrow="Competences mobilisees"
        title="Un projet qui couvre plusieurs attendus du BTS Communication"
        intro="Cette synthese relie la demarche de projet aux competences attendues dans une lecture simple et directement exploitable par un jury."
        isDark={isDark}
        textColor={textColor}
        headingColor={headingColor}
        h2Class={h2Class}
        panelBg={panelBg}
        panelBorder={panelBorder}
      >
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {skills.map((skill) => (
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
              <p>{skill.competence}</p>
              <p><strong style={{ color: accentColor }}>Dans ce projet:</strong> {skill.concret}</p>
            </SurfaceCard>
          ))}
        </div>
      </SectionShell>

      <SectionShell
        id="informations"
        tone="strategie"
        eyebrow="Informations projet"
        title="Repères de lecture"
        isDark={isDark}
        textColor={textColor}
        headingColor={headingColor}
        h2Class={h2Class}
        panelBg={panelBg}
        panelBorder={panelBorder}
      >
        <div className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="grid gap-4 sm:grid-cols-2">
            {infoCards.map((item) => (
              <div key={item.label} className={`rounded-2xl border ${innerBorder} ${innerBg} p-5`}>
                <p className="text-xs uppercase tracking-[0.25em] mb-2" style={{ fontFamily: "'Oswald', sans-serif", color: accentColor }}>
                  {item.label}
                </p>
                <p className="text-base leading-relaxed" style={{ color: textColor }}>
                  {item.value}
                </p>
              </div>
            ))}
          </div>

          <div className={`rounded-2xl border ${innerBorder} ${innerBg} p-5`}>
            <h3 className="text-lg font-bold mb-4" style={{ fontFamily: "'Oswald', sans-serif", color: headingColor }}>
              Outils et environment de production
            </h3>
            <div className="flex flex-wrap gap-2 mb-6">
              {project.tools.map((tool) => (
                <Badge
                  key={tool}
                  className={`border uppercase tracking-wide ${isDark ? "border-white/20 bg-white/10 text-white" : "border-[#1a2f5a]/20 bg-white/70 text-[#1a2f5a]"}`}
                  style={{ fontFamily: "'Oswald', sans-serif" }}
                >
                  {tool}
                </Badge>
              ))}
            </div>
            <p className={`text-sm leading-relaxed mb-4 ${subtleTextClass}`}>
              Les outils ont ete mobilises pour produire un concept complet, du cadrage visuel a la mise en page de la landing page, avec une logique de maquette et de diffusion digitale.
            </p>
            {resolvedProjectUrl ? (
              <Button asChild className={btnPrimary} style={{ fontFamily: "'Oswald', sans-serif" }}>
                <Link href={resolvedProjectUrl} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Ouvrir le projet en ligne
                </Link>
              </Button>
            ) : (
              <div className={`rounded-xl border border-dashed ${sidebarBorder} p-4 text-sm ${subtleTextClass}`}>
                Ajouter ici l'URL finale de la landing page si tu souhaites donner un acces direct au jury.
              </div>
            )}
          </div>
        </div>
      </SectionShell>
    </div>
  )
}
