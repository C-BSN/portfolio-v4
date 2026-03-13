'use client'

import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
import { NeonTitle } from '@/components/effects/NeonTitle'

// ─── Données issues du questionnaire (54 répondants) ────────────────────────

const noteFilm = [
  { name: '1/5', value: 2 },
  { name: '2/5', value: 3 },
  { name: '3/5', value: 17 },
  { name: '4/5', value: 20 },
  { name: '5/5', value: 12 },
]

const interetRessortie = [
  { name: 'Oui', value: 34 },
  { name: 'Peut-être', value: 15 },
  { name: 'Non', value: 5 },
]

const joursData = [
  { name: 'Lundi', value: 5 },
  { name: 'Mardi', value: 11 },
  { name: 'Mercredi', value: 12 },
  { name: 'Jeudi', value: 6 },
  { name: 'Vendredi', value: 27 },
  { name: 'Dimanche', value: 25 },
  { name: 'Samedi', value: 41 },
]

const horaireData = [
  { name: 'Matin\n(avant 12h)', value: 3 },
  { name: 'Après-midi\n(12h–18h)', value: 24 },
  { name: 'Soirée\n(après 18h)', value: 42 },
]

const avecQuiData = [
  { name: 'Avec des amis', value: 34 },
  { name: 'En famille', value: 31 },
  { name: 'En couple', value: 27 },
  { name: 'Seul(e)', value: 8 },
]

const ageData = [
  { name: '18-24 ans', value: 35 },
  { name: '25-34 ans', value: 10 },
  { name: '35-44 ans', value: 4 },
  { name: '12-17 ans', value: 3 },
  { name: '< 12 ans', value: 2 },
]

const reseauxData = [
  { name: 'Instagram', value: 40 },
  { name: 'TikTok', value: 28 },
  { name: 'Facebook', value: 6 },
  { name: 'X', value: 6 },
  { name: 'Snapchat', value: 4 },
]

const raisonData = [
  { name: 'Nostalgie', value: 33 },
  { name: 'Curiosité', value: 17 },
  { name: 'Faire découvrir', value: 9 },
  { name: 'Jamais vu', value: 4 },
  { name: 'Pas intéressé', value: 1 },
]

// ─── Palettes ─────────────────────────────────────────────────────────────────

const DARK_COLORS = ['#00f3ff', '#ff0080', '#a855f7', '#22c55e', '#f97316', '#eab308', '#ec4899']
const LIGHT_COLORS = ['#0e7490', '#c45880', '#6d28d9', '#15803d', '#c2410c', '#a16207', '#9d174d']

// ─── Helpers ──────────────────────────────────────────────────────────────────

const pct = (value: number) => `${Math.round((value / 54) * 100)}%`

const CustomTooltip = ({ active, payload, label, isDark }: {
  active?: boolean; payload?: { value: number; name?: string }[]; label?: string; isDark: boolean
}) => {
  if (active && payload && payload.length) {
    const bg = isDark ? 'bg-[#0a0a0a]/90 border-white/20' : 'bg-white/90 border-[#1a2f5a]/20'
    const text = isDark ? 'text-white' : 'text-[#1a2f5a]'
    return (
      <div className={`px-3 py-2 border rounded text-sm ${bg} ${text}`} style={{ fontFamily: "'Oswald', sans-serif" }}>
        <p className="font-bold">{label}</p>
        <p>{payload[0].value} répondants · <span className="opacity-70">{pct(payload[0].value)}</span></p>
      </div>
    )
  }
  return null
}

const PieTooltip = ({ active, payload, isDark }: {
  active?: boolean; payload?: { name: string; value: number }[]; isDark: boolean
}) => {
  if (active && payload && payload.length) {
    const bg = isDark ? 'bg-[#0a0a0a]/90 border-white/20' : 'bg-white/90 border-[#1a2f5a]/20'
    const text = isDark ? 'text-white' : 'text-[#1a2f5a]'
    return (
      <div className={`px-3 py-2 border rounded text-sm ${bg} ${text}`} style={{ fontFamily: "'Oswald', sans-serif" }}>
        <p className="font-bold">{payload[0].name}</p>
        <p>{payload[0].value} répondants · {pct(payload[0].value)}</p>
      </div>
    )
  }
  return null
}

// ─── Stat card ────────────────────────────────────────────────────────────────

function StatCard({ label, value, sub, isDark }: { label: string; value: string; sub?: string; isDark: boolean }) {
  const bg = isDark ? 'bg-white/5 border-white/10' : 'bg-[#1a2f5a]/5 border-[#1a2f5a]/10'
  const accent = isDark ? '#00f3ff' : '#0e7490'
  const text = isDark ? '#F0F0F0' : '#1a2f5a'
  return (
    <div className={`flex flex-col items-center justify-center p-5 border rounded-lg text-center ${bg}`}>
      <span className="text-4xl font-bold" style={{ color: accent, fontFamily: "'Oswald', sans-serif" }}>{value}</span>
      <span className="text-sm mt-2 uppercase tracking-wider" style={{ color: text, fontFamily: "'Oswald', sans-serif" }}>{label}</span>
      {sub && <span className="text-xs mt-1 opacity-60" style={{ color: text, fontFamily: "'Oswald', sans-serif" }}>{sub}</span>}
    </div>
  )
}

// ─── Section wrapper ──────────────────────────────────────────────────────────

function ChartSection({ title, children, isDark }: { title: string; children: React.ReactNode; isDark: boolean }) {
  const panelBg = isDark ? 'bg-[#050505]/80' : 'bg-white/80'
  const panelBorder = isDark ? 'border-white/20' : 'border-[#1a2f5a]/15'
  const text = isDark ? '#F0F0F0' : '#1a2f5a'
  return (
    <div className={`border ${panelBorder} ${panelBg} backdrop-blur-sm rounded-lg p-6`}>
      <h3 className="text-xl font-bold mb-5 uppercase tracking-wider" style={{ color: text, fontFamily: "'Oswald', sans-serif" }}>
        {title}
      </h3>
      {children}
    </div>
  )
}

// ─── Composant principal ──────────────────────────────────────────────────────

export default function LiloStitchSurveyCharts() {
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  useEffect(() => { setMounted(true) }, [])
  const isDark = !mounted || resolvedTheme === 'dark'

  const colors = isDark ? DARK_COLORS : LIGHT_COLORS
  const axisColor = isDark ? '#ffffff60' : '#1a2f5a60'
  const text = isDark ? '#F0F0F0' : '#1a2f5a'
  return (
    <div className="mt-10 space-y-8">
      <NeonTitle as="h3" className="text-3xl font-bold uppercase mb-4" filled noAnimation>
        Résultats du Questionnaire
      </NeonTitle>
      <p className="text-sm uppercase tracking-wider mb-6" style={{ color: axisColor, fontFamily: "'Oswald', sans-serif" }}>
        54 répondants · Diffusion via Instagram Stories
      </p>

      {/* Chiffres clés */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Ont vu le film" value="81%" isDark={isDark} />
        <StatCard label="Intéressés par la ressortie" value="63%" isDark={isDark} />
        <StatCard label="Aimeraient le revoir en salle" value="72%" isDark={isDark} />
        <StatCard label="Motivés par la nostalgie" value="61%" isDark={isDark} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Note du film */}
        <ChartSection title="Note du film (1 à 5)" isDark={isDark}>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={noteFilm} margin={{ top: 4, right: 10, left: -10, bottom: 0 }}>
              <XAxis dataKey="name" tick={{ fill: axisColor, fontFamily: "'Oswald', sans-serif", fontSize: 13 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: axisColor, fontFamily: "'Oswald', sans-serif", fontSize: 12 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip isDark={isDark} />} />
              <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                {noteFilm.map((_, i) => <Cell key={i} fill={colors[i % colors.length]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartSection>

        {/* Intérêt ressortie */}
        <ChartSection title="Intérêt pour la ressortie" isDark={isDark}>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={interetRessortie} cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={4} dataKey="value">
                {interetRessortie.map((_, i) => <Cell key={i} fill={colors[i % colors.length]} />)}
              </Pie>
              <Tooltip content={<PieTooltip isDark={isDark} />} />
              <Legend formatter={(v) => <span style={{ color: text, fontFamily: "'Oswald', sans-serif", fontSize: 13 }}>{v}</span>} />
            </PieChart>
          </ResponsiveContainer>
        </ChartSection>

        {/* Jours préférés */}
        <ChartSection title="Jours préférés pour aller au cinéma" isDark={isDark}>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={joursData} margin={{ top: 4, right: 10, left: -10, bottom: 0 }}>
              <XAxis dataKey="name" tick={{ fill: axisColor, fontFamily: "'Oswald', sans-serif", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: axisColor, fontFamily: "'Oswald', sans-serif", fontSize: 12 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip isDark={isDark} />} />
              <Bar dataKey="value" radius={[4, 4, 0, 0]} fill={colors[0]}>
                {joursData.map((_, i) => <Cell key={i} fill={i === joursData.length - 1 ? colors[1] : colors[0]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartSection>

        {/* Horaire préféré */}
        <ChartSection title="Horaire idéal pour aller au cinéma" isDark={isDark}>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={horaireData} cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={4} dataKey="value">
                {horaireData.map((_, i) => <Cell key={i} fill={colors[i % colors.length]} />)}
              </Pie>
              <Tooltip content={<PieTooltip isDark={isDark} />} />
              <Legend formatter={(v) => <span style={{ color: text, fontFamily: "'Oswald', sans-serif", fontSize: 12 }}>{v}</span>} />
            </PieChart>
          </ResponsiveContainer>
        </ChartSection>

        {/* Avec qui */}
        <ChartSection title="Avec qui vont-ils au cinéma ?" isDark={isDark}>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={avecQuiData} layout="vertical" margin={{ top: 4, right: 30, left: 10, bottom: 0 }}>
              <XAxis type="number" tick={{ fill: axisColor, fontFamily: "'Oswald', sans-serif", fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis type="category" dataKey="name" tick={{ fill: text, fontFamily: "'Oswald', sans-serif", fontSize: 12 }} axisLine={false} tickLine={false} width={110} />
              <Tooltip content={<CustomTooltip isDark={isDark} />} />
              <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                {avecQuiData.map((_, i) => <Cell key={i} fill={colors[i % colors.length]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartSection>

        {/* Réseaux sociaux */}
        <ChartSection title="Réseaux sociaux les plus utilisés" isDark={isDark}>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={reseauxData} layout="vertical" margin={{ top: 4, right: 30, left: 10, bottom: 0 }}>
              <XAxis type="number" tick={{ fill: axisColor, fontFamily: "'Oswald', sans-serif", fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis type="category" dataKey="name" tick={{ fill: text, fontFamily: "'Oswald', sans-serif", fontSize: 12 }} axisLine={false} tickLine={false} width={80} />
              <Tooltip content={<CustomTooltip isDark={isDark} />} />
              <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                {reseauxData.map((_, i) => <Cell key={i} fill={colors[i % colors.length]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartSection>

        {/* Tranche d'âge */}
        <ChartSection title="Âge des répondants" isDark={isDark}>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={ageData} cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={4} dataKey="value">
                {ageData.map((_, i) => <Cell key={i} fill={colors[i % colors.length]} />)}
              </Pie>
              <Tooltip content={<PieTooltip isDark={isDark} />} />
              <Legend formatter={(v) => <span style={{ color: text, fontFamily: "'Oswald', sans-serif", fontSize: 12 }}>{v}</span>} />
            </PieChart>
          </ResponsiveContainer>
        </ChartSection>

        {/* Raison de voir le film */}
        <ChartSection title="Raison principale de voir le film" isDark={isDark}>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={raisonData} cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={4} dataKey="value">
                {raisonData.map((_, i) => <Cell key={i} fill={colors[i % colors.length]} />)}
              </Pie>
              <Tooltip content={<PieTooltip isDark={isDark} />} />
              <Legend formatter={(v) => <span style={{ color: text, fontFamily: "'Oswald', sans-serif", fontSize: 12 }}>{v}</span>} />
            </PieChart>
          </ResponsiveContainer>
        </ChartSection>

      </div>
    </div>
  )
}
