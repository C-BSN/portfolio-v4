"use client"

/* eslint-disable react/no-unescaped-entities */

import type { ReactNode } from "react"
import Link from "next/link"
import {
  ArrowRight,
  BarChart3,
  Brain,
  CalendarClock,
  CheckCircle2,
  Clapperboard,
  FileText,
  Gamepad2,
  Heart,
  Lightbulb,
  Map,
  Megaphone,
  Search,
  Target,
  Ticket,
  Trophy,
  Users,
} from "lucide-react"

import { NeonTitle } from "@/components/effects/NeonTitle"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { PdfViewer } from "@/components/ui/pdf-viewer"
import { ProjectGallery } from "@/components/ui/project-gallery"
import LiloStitchSurveyCharts from "@/components/ui/lilo-stitch-survey-charts"
import type { Project } from "@/lib/content"
import { resolveUrl } from "@/lib/utils"

interface LiloStitchBtsCaseStudyProps {
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

interface SectionProps {
  title: string
  children: ReactNode
  isDark: boolean
  textColor: string
  h2Class: string
  panelBg: string
  panelBorder: string
}

interface CardProps {
  title: string
  icon?: ReactNode
  badge?: string
  children: ReactNode
  isDark: boolean
  textColor: string
  headingColor: string
  innerBg: string
  innerBorder: string
}

function Section({
  title,
  children,
  h2Class,
  panelBg,
  panelBorder,
}: SectionProps) {
  return (
    <section className={`rounded-2xl border ${panelBorder} ${panelBg} p-6 md:p-8 backdrop-blur-sm`}>
      <div className={`mb-6 border-b pb-4 ${panelBorder}`}>
        <NeonTitle as="h2" className={`text-3xl md:text-4xl font-bold uppercase ${h2Class}`} noAnimation>
          {title}
        </NeonTitle>
      </div>
      {children}
    </section>
  )
}

function Card({
  title,
  icon,
  badge,
  children,
  isDark,
  textColor,
  headingColor,
  innerBg,
  innerBorder,
}: CardProps) {
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

const quickRead = [
  {
    title: "Problématique",
    text: "Comment transformer une simple ressortie cinéma en événement Disney attractif, mémorable et cohérent avec les attentes du public ?",
    icon: <Target className="h-5 w-5" />,
  },
  {
    title: "Cœur de cible",
    text: "Une adolescente d'environ 15 ans, fan de Stitch, active sur les réseaux et sensible aux expériences spéciales en salle.",
    icon: <Users className="h-5 w-5" />,
  },
  {
    title: "Réponse proposée",
    text: "Un dispositif événementiel mêlant communication visuelle, animations sur site, goodies et activation digitale via Stitch Invaders.",
    icon: <Megaphone className="h-5 w-5" />,
  },
]

const keyFigures = [
  { value: "81,5 %", label: "ont déjà vu Lilo & Stitch" },
  { value: "63 %", label: "sont intéressés par la ressortie" },
  { value: "72,2 %", label: "aimeraient revoir le film en salle" },
  { value: "61,1 %", label: "sont motivés d'abord par la nostalgie" },
  { value: "77,8 %", label: "préfèrent un horaire après 18h" },
]

const insights = [
  "Le potentiel de mobilisation repose sur un capital de notoriété déjà installé : la majorité connaît déjà le film, ce qui permet de communiquer sur la redécouverte plus que sur la découverte.",
  "La nostalgie est le moteur le plus visible de l'intérêt. Le discours de campagne doit donc activer le souvenir affectif et la dimension culte du film.",
  "Les répondants préfèrent un événement spécial à une séance standard. La valeur attendue vient autant de l'expérience proposée que de la projection elle-même.",
  "Instagram et TikTok ressortent comme points de contact prioritaires, ce qui justifie une communication pensée pour des formats sociaux rapides et visuels.",
]

const strategicConsequences = [
  {
    title: "Animations",
    text: "Le poids de la nostalgie et l'intérêt pour un événement spécial ont conduit à prévoir des animations visibles et affectives : mascotte, cartes à gratter, stand et goodies autour de Stitch.",
    icon: <Clapperboard className="h-5 w-5" />,
  },
  {
    title: "Format événementiel",
    text: "Les préférences de jour et d'horaire ont orienté un rendez-vous le samedi en soirée, conçu comme un temps de sortie partagé entre amis ou en famille.",
    icon: <CalendarClock className="h-5 w-5" />,
  },
  {
    title: "Expérience proposée",
    text: "L'étude qualitative montre une attente d'immersion et d'interaction. L'expérience a donc été pensée avant, pendant et après la séance, et pas seulement autour de la diffusion du film.",
    icon: <Ticket className="h-5 w-5" />,
  },
]

const competitorCards = [
  {
    studio: "Pixar",
    film: "Le Voyage d'Arlo (2015)",
    angle: "Duo inattendu, séparation familiale, reconstruction émotionnelle.",
    strategic:
      "Montre qu'un récit centré sur le lien affectif et la vulnérabilité reste puissant auprès d'un public large. Cela conforte un axe de communication sensible et familial.",
  },
  {
    studio: "DreamWorks",
    film: "Dragons (2010)",
    angle: "Créature perçue comme dangereuse, relation de confiance, regard qui change.",
    strategic:
      "Renforce la pertinence d'un dispositif qui valorise Stitch comme personnage rebelle mais attachant. Le ton peut être plus énergique et événementiel sans sortir de l'univers du film.",
  },
  {
    studio: "Studio Ghibli",
    film: "Mon voisin Totoro (1988)",
    angle: "Fragilité familiale, refuge émotionnel, créature étrange et réconfortante.",
    strategic:
      "Valide un positionnement plus doux, émotionnel et immersif. L'expérience ne doit pas être seulement spectaculaire, mais aussi chaleureuse et rassurante.",
  },
]

const journeySteps = [
  {
    step: "Arrivée",
    role: "Installer immédiatement l'univers Disney et faire comprendre que la séance est un événement, pas une projection ordinaire.",
    icon: <Ticket className="h-5 w-5" />,
  },
  {
    step: "Animation",
    role: "Créer de l'attente avec la mascotte, les cartes à gratter et le stand partenaire afin d'occuper le temps pré-séance.",
    icon: <Clapperboard className="h-5 w-5" />,
  },
  {
    step: "Interaction",
    role: "Faire participer le public, favoriser les photos, les surprises et les micro-récompenses pour augmenter l'engagement émotionnel.",
    icon: <Users className="h-5 w-5" />,
  },
  {
    step: "Projection",
    role: "Concrétiser la promesse centrale : revivre le film sur grand écran dans un cadre plus convivial et mémorable.",
    icon: <FileText className="h-5 w-5" />,
  },
  {
    step: "Sortie",
    role: "Prolonger l'expérience avec le retrait des goodies, les achats éventuels de produits dérivés et les derniers points photo.",
    icon: <ArrowRight className="h-5 w-5" />,
  },
  {
    step: "Engagement",
    role: "Faire durer la relation avec le projet via le mini-jeu, le partage social et les souvenirs rapportés de l'événement.",
    icon: <Gamepad2 className="h-5 w-5" />,
  },
]

const methodology = [
  {
    step: "01",
    title: "Veille",
    text: "Analyse du film, de sa popularité, de son impact culturel et de sa place dans l'univers Disney.",
    icon: <Search className="h-5 w-5" />,
  },
  {
    step: "02",
    title: "Étude",
    text: "Croisement d'un questionnaire quantitatif et d'entretiens qualitatifs pour comprendre motivations, freins et usages.",
    icon: <BarChart3 className="h-5 w-5" />,
  },
  {
    step: "03",
    title: "Stratégie",
    text: "Définition des cibles, du positionnement, du créneau de séance et des leviers de communication les plus pertinents.",
    icon: <Target className="h-5 w-5" />,
  },
  {
    step: "04",
    title: "Conception",
    text: "Création des supports visuels, des animations événementielles, du partenariat et de l'innovation digitale Stitch Invaders.",
    icon: <Lightbulb className="h-5 w-5" />,
  },
  {
    step: "05",
    title: "Évaluation",
    text: "Définition de critères de réussite et d'indicateurs attendus pour juger la cohérence, l'attractivité et l'engagement générés.",
    icon: <Trophy className="h-5 w-5" />,
  },
]

const evaluationCriteria = [
  "Le concept doit être compris rapidement comme une projection événementielle Disney structurée.",
  "Les animations doivent renforcer la valeur perçue de la séance et justifier le déplacement.",
  "Le dispositif doit rester cohérent avec la cible, les insights consommateurs et l'univers de Lilo & Stitch.",
  "Les supports de communication doivent rendre l'événement identifiable immédiatement et faciliter la mémorisation.",
]

const evaluationIndicators = [
  "Taux d'intérêt élevé pour la projection et intention de participation aux animations.",
  "Capacité du mini-jeu à générer du trafic, des partages et de la curiosité avant la séance.",
  "Bonne lisibilité du positionnement sur les supports et compréhension immédiate de l'offre événementielle.",
  "Adéquation perçue entre créneau choisi, expérience proposée et attentes du public cible.",
]

const evidenceCards = [
  {
    title: "Étude consommateurs",
    proof:
      "Prouve que les choix de format, de créneau et d'animation reposent sur des données visibles : intérêt pour la ressortie, nostalgie, habitudes cinéma et canaux sociaux.",
    icon: <BarChart3 className="h-5 w-5" />,
  },
  {
    title: "Persona",
    proof:
      "Prouve que la recommandation ne vise pas un public abstrait, mais un profil prioritaire avec motivations, freins, usages et attentes identifiés.",
    icon: <Users className="h-5 w-5" />,
  },
  {
    title: "Analyse concurrentielle",
    proof:
      "Prouve que le positionnement a été construit par comparaison, en clarifiant les thèmes émotionnels et les territoires narratifs proches de Lilo & Stitch.",
    icon: <Search className="h-5 w-5" />,
  },
  {
    title: "Supports",
    proof:
      "Prouve la capacité à décliner la stratégie sur plusieurs points de contact visibles : affiches, visuels et activation sur site.",
    icon: <Megaphone className="h-5 w-5" />,
  },
  {
    title: "Innovation",
    proof:
      "Prouve que le projet ne se limite pas à la communication classique grâce à Stitch Invaders, pensé comme levier d'engagement et de modernisation.",
    icon: <Gamepad2 className="h-5 w-5" />,
  },
  {
    title: "PDF complet",
    proof:
      "Prouve la profondeur de la démarche et permet à l'examinateur d'accéder au dossier intégral si une vérification détaillée est nécessaire.",
    icon: <FileText className="h-5 w-5" />,
  },
]

export function LiloStitchBtsCaseStudy({
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
}: LiloStitchBtsCaseStudyProps) {
  const finalPdfUrl = resolveUrl(project.preuves?.find((preuve) => preuve.type === "PDF")?.pdf)
  const stitchInvadersUrl = resolveUrl(project.preuves?.find((preuve) => preuve.type === "URL")?.url)

  return (
    <div className="space-y-6">
      <Section
        title="Contexte"
        isDark={isDark}
        textColor={textColor}
        h2Class={h2Class}
        panelBg={panelBg}
        panelBorder={panelBorder}
      >
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {quickRead.map((item) => (
            <Card
              key={item.title}
              title={item.title}
              icon={item.icon}
              isDark={isDark}
              textColor={textColor}
              headingColor={headingColor}
              innerBg={innerBg}
              innerBorder={innerBorder}
            >
              <p>{item.text}</p>
            </Card>
          ))}
        </div>
      </Section>

      <Section
        title="Cadre stratégique"
        isDark={isDark}
        textColor={textColor}
        h2Class={h2Class}
        panelBg={panelBg}
        panelBorder={panelBorder}
      >
        <div className="grid gap-4 lg:grid-cols-3">
          <Card
            title="Contexte"
            icon={<FileText className="h-5 w-5" />}
            isDark={isDark}
            textColor={textColor}
            headingColor={headingColor}
            innerBg={innerBg}
            innerBorder={innerBorder}
          >
            <p>Projection spéciale de Lilo & Stitch imaginée pour la semaine anniversaire des 100 ans de Disney.</p>
            <p>Le film est retenu pour son capital nostalgique, ses valeurs familiales et son fort potentiel émotionnel.</p>
          </Card>
          <Card
            title="Objectif"
            icon={<Target className="h-5 w-5" />}
            isDark={isDark}
            textColor={textColor}
            headingColor={headingColor}
            innerBg={innerBg}
            innerBorder={innerBorder}
          >
            <p>Faire venir le public à une ressortie cinéma en transformant la séance en expérience visible, immersive et partageable.</p>
          </Card>
          <Card
            title="Dispositif"
            icon={<Megaphone className="h-5 w-5" />}
            isDark={isDark}
            textColor={textColor}
            headingColor={headingColor}
            innerBg={innerBg}
            innerBorder={innerBorder}
          >
            <p>Supports print, animations sur site, goodies, partenariat et mini-jeu Stitch Invaders pour articuler visibilité et engagement.</p>
          </Card>
        </div>
      </Section>

      <Section
        title="Étude consommateurs (quantitative & qualitative)"
        isDark={isDark}
        textColor={textColor}
        h2Class={h2Class}
        panelBg={panelBg}
        panelBorder={panelBorder}
      >
        <div className="grid gap-4 lg:grid-cols-[1.4fr_0.6fr]">
          <div className={`rounded-2xl border ${innerBorder} ${innerBg} p-4 md:p-5`}>
            <LiloStitchSurveyCharts />
          </div>
          <div className="space-y-4">
            <Card
              title="Chiffres clés"
              icon={<BarChart3 className="h-5 w-5" />}
              isDark={isDark}
              textColor={textColor}
              headingColor={headingColor}
              innerBg={innerBg}
              innerBorder={innerBorder}
            >
              <div className="space-y-3">
                {keyFigures.map((item) => (
                  <div key={item.label} className={`rounded-xl border ${innerBorder} ${isDark ? "bg-black/20" : "bg-white/70"} p-3`}>
                    <p className="text-2xl font-bold" style={{ color: accentColor, fontFamily: "'Oswald', sans-serif" }}>
                      {item.value}
                    </p>
                    <p>{item.label}</p>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          <Card
            title="Insights clés"
            icon={<Brain className="h-5 w-5" />}
            badge="À partir des données visibles"
            isDark={isDark}
            textColor={textColor}
            headingColor={headingColor}
            innerBg={innerBg}
            innerBorder={innerBorder}
          >
            {insights.map((item) => (
              <p key={item}>{item}</p>
            ))}
          </Card>
          <Card
            title="Conséquences stratégiques"
            icon={<Lightbulb className="h-5 w-5" />}
            badge="Traduction en choix"
            isDark={isDark}
            textColor={textColor}
            headingColor={headingColor}
            innerBg={innerBg}
            innerBorder={innerBorder}
          >
            <div className="space-y-3">
              {strategicConsequences.map((item) => (
                <div key={item.title} className={`rounded-xl border ${innerBorder} ${isDark ? "bg-black/20" : "bg-white/70"} p-3`}>
                  <div className="mb-2 flex items-center gap-2" style={{ color: headingColor }}>
                    {item.icon}
                    <p className="font-bold" style={{ fontFamily: "'Oswald', sans-serif" }}>
                      {item.title}
                    </p>
                  </div>
                  <p>{item.text}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </Section>

      <Section
        title="Analyse concurrentielle"
        isDark={isDark}
        textColor={textColor}
        h2Class={h2Class}
        panelBg={panelBg}
        panelBorder={panelBorder}
      >
        <div className="grid gap-4 lg:grid-cols-3">
          {competitorCards.map((item) => (
            <Card
              key={item.studio}
              title={item.studio}
              badge={item.film}
              icon={<Search className="h-5 w-5" />}
              isDark={isDark}
              textColor={textColor}
              headingColor={headingColor}
              innerBg={innerBg}
              innerBorder={innerBorder}
            >
              <p>
                <strong style={{ color: accentColor }}>Point commun :</strong> {item.angle}
              </p>
              <p>
                <strong style={{ color: accentColor }}>Lecture stratégique :</strong> {item.strategic}
              </p>
            </Card>
          ))}
        </div>
        <div className={`mt-6 rounded-2xl border ${innerBorder} ${innerBg} p-5`}>
          <p className="text-lg leading-relaxed" style={{ color: textColor }}>
            <strong style={{ color: accentColor }}>Conclusion stratégique :</strong> l'analyse concurrentielle confirme qu'un territoire fort autour de la famille, de l'attachement à une créature atypique et d'une émotion accessible peut fédérer plusieurs générations. Le projet doit donc articuler nostalgie, chaleur relationnelle et dispositif expérientiel.
          </p>
        </div>
      </Section>

      <Section
        title="Persona"
        isDark={isDark}
        textColor={textColor}
        h2Class={h2Class}
        panelBg={panelBg}
        panelBorder={panelBorder}
      >
        <div className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
          <Card
            title="Lisa, 15 ans"
            badge="Cœur de cible"
            icon={<Users className="h-5 w-5" />}
            isDark={isDark}
            textColor={textColor}
            headingColor={headingColor}
            innerBg={innerBg}
            innerBorder={innerBorder}
          >
            <p>
              <strong style={{ color: accentColor }}>Profil :</strong> collégienne au Port, fan de Stitch, active sur les réseaux et attirée par les sorties qui peuvent se vivre et se partager.
            </p>
            <p>
              <strong style={{ color: accentColor }}>Citation :</strong> "Stitch c'est trop ma vie"
            </p>
            <p>
              <strong style={{ color: accentColor }}>Freins :</strong> école, budget, transport.
            </p>
            <p>
              <strong style={{ color: accentColor }}>Habitudes :</strong> va au cinéma le samedi et apprécie l'animation Disney.
            </p>
          </Card>
          <div className="grid gap-4 md:grid-cols-2">
            <Card
              title="Motivations"
              icon={<Heart className="h-5 w-5" />}
              isDark={isDark}
              textColor={textColor}
              headingColor={headingColor}
              innerBg={innerBg}
              innerBorder={innerBorder}
            >
              <p>Retrouver un personnage qu'elle adore.</p>
              <p>Vivre une sortie plus spéciale qu'une séance classique.</p>
              <p>Partager un moment visuel et émotionnel avec ses proches.</p>
            </Card>
            <Card
              title="Attentes"
              icon={<Map className="h-5 w-5" />}
              isDark={isDark}
              textColor={textColor}
              headingColor={headingColor}
              innerBg={innerBg}
              innerBorder={innerBorder}
            >
              <p>Des supports attractifs et immédiatement reconnaissables.</p>
              <p>Des animations amusantes avant la séance.</p>
              <p>Des éléments "Instagrammables" et des petites récompenses.</p>
            </Card>
            <Card
              title="Points de contact"
              icon={<Megaphone className="h-5 w-5" />}
              isDark={isDark}
              textColor={textColor}
              headingColor={headingColor}
              innerBg={innerBg}
              innerBorder={innerBorder}
            >
              <p>Instagram et TikTok pour la découverte.</p>
              <p>Affichage physique à proximité des lieux fréquentés.</p>
              <p>Mini-jeu en ligne pour prolonger l'engagement avant l'événement.</p>
            </Card>
            <Card
              title="Impact sur la conception"
              icon={<Lightbulb className="h-5 w-5" />}
              isDark={isDark}
              textColor={textColor}
              headingColor={headingColor}
              innerBg={innerBg}
              innerBorder={innerBorder}
            >
              <p>Le persona justifie un ton affectif, un dispositif visuel centré sur Stitch et des activations rapides, ludiques et partageables.</p>
            </Card>
          </div>
        </div>
      </Section>

      <Section
        title="Parcours événementiel"
        isDark={isDark}
        textColor={textColor}
        h2Class={h2Class}
        panelBg={panelBg}
        panelBorder={panelBorder}
      >
        <div className="mb-6 flex flex-wrap items-center gap-3 text-sm md:text-base" style={{ color: textColor }}>
          {journeySteps.map((item, index) => (
            <div key={item.step} className="flex items-center gap-3">
              <span className={`rounded-full border px-3 py-1 ${isDark ? "border-white/20 bg-white/10" : "border-[#1a2f5a]/15 bg-white/75"}`}>
                {item.step}
              </span>
              {index < journeySteps.length - 1 && <ArrowRight className="h-4 w-4 opacity-60" />}
            </div>
          ))}
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {journeySteps.map((item) => (
            <Card
              key={item.step}
              title={item.step}
              icon={item.icon}
              isDark={isDark}
              textColor={textColor}
              headingColor={headingColor}
              innerBg={innerBg}
              innerBorder={innerBorder}
            >
              <p>{item.role}</p>
            </Card>
          ))}
        </div>
      </Section>

      <Section
        title="Focus innovation : Stitch Invaders"
        isDark={isDark}
        textColor={textColor}
        h2Class={h2Class}
        panelBg={panelBg}
        panelBorder={panelBorder}
      >
        <div className="grid gap-4 lg:grid-cols-3">
          <Card
            title="Concept"
            icon={<Gamepad2 className="h-5 w-5" />}
            isDark={isDark}
            textColor={textColor}
            headingColor={headingColor}
            innerBg={innerBg}
            innerBorder={innerBorder}
          >
            <p>Mini-jeu inspiré de Space Invaders, lancé un mois avant la ressortie et accessible gratuitement en ligne.</p>
            <p>Le joueur incarne Stitch, expérience 626, dans un univers rétro cohérent avec l'imaginaire du film.</p>
          </Card>
          <Card
            title="Rôle marketing"
            icon={<Megaphone className="h-5 w-5" />}
            isDark={isDark}
            textColor={textColor}
            headingColor={headingColor}
            innerBg={innerBg}
            innerBorder={innerBorder}
          >
            <p>Créer du buzz avant la séance, générer du partage social et rendre la campagne plus active qu'une simple annonce d'événement.</p>
            <p>Le système de scores et de lots donne un motif de retour et de conversation autour du projet.</p>
          </Card>
          <Card
            title="Utilité dans l'expérience"
            icon={<Lightbulb className="h-5 w-5" />}
            isDark={isDark}
            textColor={textColor}
            headingColor={headingColor}
            innerBg={innerBg}
            innerBorder={innerBorder}
          >
            <p>Stitch Invaders prépare le public avant l'événement, prolonge la présence de Stitch hors du cinéma et relie le projet à une logique d'engagement continue.</p>
          </Card>
        </div>
        {stitchInvadersUrl && (
          <div className="mt-6">
            <Button asChild className={btnPrimary} style={{ fontFamily: "'Oswald', sans-serif" }}>
              <Link href={stitchInvadersUrl} target="_blank">
                <Gamepad2 className="mr-2 h-4 w-4" />
                Voir Stitch Invaders
              </Link>
            </Button>
          </div>
        )}
      </Section>

      <Section
        title="Méthodologie"
        isDark={isDark}
        textColor={textColor}
        h2Class={h2Class}
        panelBg={panelBg}
        panelBorder={panelBorder}
      >
        <div className="grid gap-4 xl:grid-cols-5">
          {methodology.map((item) => (
            <Card
              key={item.step}
              title={`${item.step} · ${item.title}`}
              icon={item.icon}
              isDark={isDark}
              textColor={textColor}
              headingColor={headingColor}
              innerBg={innerBg}
              innerBorder={innerBorder}
            >
              <p>{item.text}</p>
            </Card>
          ))}
        </div>
      </Section>

      <Section
        title="Évaluation"
        isDark={isDark}
        textColor={textColor}
        h2Class={h2Class}
        panelBg={panelBg}
        panelBorder={panelBorder}
      >
        <div className="grid gap-4 lg:grid-cols-2">
          <Card
            title="A. Critères de réussite"
            icon={<CheckCircle2 className="h-5 w-5" />}
            isDark={isDark}
            textColor={textColor}
            headingColor={headingColor}
            innerBg={innerBg}
            innerBorder={innerBorder}
          >
            {evaluationCriteria.map((item) => (
              <p key={item}>{item}</p>
            ))}
          </Card>
          <Card
            title="B. Indicateurs attendus"
            icon={<Trophy className="h-5 w-5" />}
            badge="Objectifs / hypothèses"
            isDark={isDark}
            textColor={textColor}
            headingColor={headingColor}
            innerBg={innerBg}
            innerBorder={innerBorder}
          >
            {evaluationIndicators.map((item) => (
              <p key={item}>{item}</p>
            ))}
          </Card>
        </div>
      </Section>

      {project.gallery && project.gallery.length > 0 && (
        <Section
          title="Supports et déclinaisons visuelles"
          isDark={isDark}
          textColor={textColor}
          h2Class={h2Class}
          panelBg={panelBg}
          panelBorder={panelBorder}
        >
          <ProjectGallery gallery={project.gallery} title="" defaultLayout="justified" showLayoutSwitcher={false} className="" />
        </Section>
      )}

      <Section
        title="Preuves"
        isDark={isDark}
        textColor={textColor}
        h2Class={h2Class}
        panelBg={panelBg}
        panelBorder={panelBorder}
      >
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {evidenceCards.map((item) => (
            <Card
              key={item.title}
              title={item.title}
              icon={item.icon}
              isDark={isDark}
              textColor={textColor}
              headingColor={headingColor}
              innerBg={innerBg}
              innerBorder={innerBorder}
            >
              <p>{item.proof}</p>
            </Card>
          ))}
        </div>
        {finalPdfUrl && (
          <div className="mt-6">
            <PdfViewer url={finalPdfUrl} title="PDF complet du dossier Lilo & Stitch" isDark={isDark} accentColor={accentColor} allowDownload />
          </div>
        )}
      </Section>
    </div>
  )
}
