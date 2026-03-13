'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useTheme } from 'next-themes'
import { Send, Mail, MapPin, Calendar, CheckCircle, Linkedin, Instagram } from 'lucide-react'
import Link from 'next/link'
import { NeonTitle } from '@/components/effects/NeonTitle'

type FormState = 'idle' | 'sending' | 'sent' | 'error'

export default function ContactForm() {
  const [formState, setFormState] = useState<FormState>('idle')
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', type: '', message: '' })
  const [mounted, setMounted] = useState(false)
  const { resolvedTheme } = useTheme()

  useEffect(() => { setMounted(true) }, [])

  const isDark = !mounted || resolvedTheme === 'dark'

  const projectTypes = [
    'Identité visuelle',
    'Campagne de communication',
    'Photographie',
    'Print / Affiche',
    'Web design',
    'Autre',
  ]

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormState('sending')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      if (!res.ok) throw new Error()
      setFormState('sent')
    } catch {
      setFormState('error')
    }
  }

  const fontStyle = { fontFamily: "'Oswald', sans-serif" }

  const inputClasses = `w-full bg-transparent px-5 py-3 focus:outline-none transition-colors duration-300 border ${
    isDark
      ? 'border-white/20 text-[#F0F0F0] placeholder:text-white/30 focus:border-[#ff0080]'
      : 'border-[#1a2f5a]/25 text-[#1a2f5a] placeholder:text-[#1a2f5a]/40 focus:border-[#c45880] bg-white/50 backdrop-blur-sm'
  }`

  const labelClasses = `block text-sm uppercase tracking-widest mb-2 ${isDark ? 'text-white/70' : 'text-[#1a2f5a]/70'}`

  const borderBox = isDark ? 'border-white/20' : 'border-[#1a2f5a]/20'
  const boxBg = !isDark ? 'bg-white/60 backdrop-blur-sm' : ''
  const textMain = isDark ? 'text-white' : 'text-[#1a2f5a]'
  const textMuted = isDark ? 'text-white/50' : 'text-[#1a2f5a]/50'
  const textMutedSub = isDark ? 'text-white/70' : 'text-[#1a2f5a]/70'
  const emailHighlight = isDark ? 'text-[#00f3ff]' : 'text-[#c45880]'
  const sparkleClass = isDark ? 'title-h2-sparkle' : 'title-h2-sparkle-day'
  const optionBg = isDark ? 'bg-[#050505]' : 'bg-white'

  const btnPrimary = isDark
    ? 'border-2 border-[#F0F0F0] hover:bg-[#F0F0F0] hover:text-[#050505] transition-all duration-300'
    : 'border-2 border-[#1a2f5a] text-[#1a2f5a] hover:bg-[#1a2f5a] hover:text-white transition-all duration-300'

  return (
    <div className="min-h-screen pt-24 pb-20">
      {/* Header */}
      <section className="px-8 py-16 text-center">
        <NeonTitle as="h1" className="text-6xl md:text-8xl font-bold uppercase leading-none mb-6">
          CONTACT
        </NeonTitle>
        <p className="text-xl uppercase tracking-widest opacity-70 max-w-2xl mx-auto" style={fontStyle}>
          Un projet en tête ? Discutons-en.
        </p>
      </section>

      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
          {/* Formulaire */}
          <motion.div
            initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}
            className="lg:col-span-3"
          >
            {formState === 'sent' ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                className={`border p-12 text-center ${borderBox} ${boxBg}`}
              >
                <CheckCircle className="w-16 h-16 mx-auto mb-6 text-green-400" />
                <h2 className="text-3xl font-bold uppercase mb-4" style={fontStyle}>
                  Message envoyé !
                </h2>
                <p className="text-lg opacity-70 mb-8" style={fontStyle}>
                  Votre message a bien été reçu. Je vous répondrai dans les plus brefs délais.
                </p>
                <div className="mt-10">
                  <button
                    onClick={() => { setFormState('idle'); setFormData({ name: '', email: '', subject: '', type: '', message: '' }) }}
                    className={`${btnPrimary} px-8 py-3 uppercase tracking-widest`}
                    style={fontStyle}
                  >
                    Nouveau message
                  </button>
                </div>
              </motion.div>
            ) : formState === 'error' ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                className={`border p-12 text-center ${borderBox} ${boxBg}`}
              >
                <div className="w-16 h-16 mx-auto mb-6 flex items-center justify-center rounded-full border-2 border-red-400">
                  <span className="text-red-400 text-3xl font-bold">!</span>
                </div>
                <h2 className="text-3xl font-bold uppercase mb-4" style={fontStyle}>
                  Une erreur est survenue
                </h2>
                <p className="text-lg opacity-70 mb-4" style={fontStyle}>
                  L'envoi a échoué. Vous pouvez me contacter directement à :
                </p>
                <a href="mailto:corentinbassonpro@gmail.com" className={`${emailHighlight} text-lg underline underline-offset-4 hover:opacity-80 transition-opacity`} style={fontStyle}>
                  corentinbassonpro@gmail.com
                </a>
                <div className="mt-10">
                  <button
                    onClick={() => setFormState('idle')}
                    className={`${btnPrimary} px-8 py-3 uppercase tracking-widest`}
                    style={fontStyle}
                  >
                    Réessayer
                  </button>
                </div>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className={labelClasses} style={fontStyle}>Nom complet *</label>
                    <input type="text" id="name" name="name" required value={formData.name} onChange={handleChange}
                      placeholder="Votre nom" className={inputClasses} style={fontStyle} />
                  </div>
                  <div>
                    <label htmlFor="email" className={labelClasses} style={fontStyle}>Email *</label>
                    <input type="email" id="email" name="email" required value={formData.email} onChange={handleChange}
                      placeholder="votre@email.com" className={inputClasses} style={fontStyle} />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="type" className={labelClasses} style={fontStyle}>Type de projet</label>
                    <select id="type" name="type" value={formData.type} onChange={handleChange}
                      className={`${inputClasses} appearance-none cursor-pointer`} style={fontStyle}>
                      <option value="" className={optionBg}>Sélectionner...</option>
                      {projectTypes.map(type => (
                        <option key={type} value={type} className={optionBg}>{type}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="subject" className={labelClasses} style={fontStyle}>Objet</label>
                    <input type="text" id="subject" name="subject" value={formData.subject} onChange={handleChange}
                      placeholder="Objet de votre message" className={inputClasses} style={fontStyle} />
                  </div>
                </div>

                <div>
                  <label htmlFor="message" className={labelClasses} style={fontStyle}>Message *</label>
                  <textarea id="message" name="message" required rows={6} value={formData.message} onChange={handleChange}
                    placeholder="Décrivez votre projet, vos besoins, votre calendrier..."
                    className={`${inputClasses} resize-none`} style={fontStyle} />
                </div>

                <button type="submit" disabled={formState === 'sending'}
                  className={`w-full ${btnPrimary} px-8 py-4 uppercase tracking-widest text-lg flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed`}
                  style={fontStyle}
                >
                  {formState === 'sending' ? (
                    <><div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />Envoi en cours...</>
                  ) : (
                    <><Send className="w-5 h-5" />Envoyer le message</>
                  )}
                </button>
              </form>
            )}
          </motion.div>

          {/* Sidebar infos */}
          <motion.div
            initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-2 space-y-8"
          >
            {/* Coordonnées */}
            <div className={`border p-6 space-y-6 ${borderBox} ${boxBg}`}>
              <h3 className={`text-xl font-bold uppercase tracking-widest ${sparkleClass}`} style={fontStyle}>
                Coordonnées
              </h3>
              <div className="flex items-start gap-4">
                <Mail className={`w-5 h-5 mt-1 flex-shrink-0 ${textMutedSub}`} />
                <div>
                  <p className={`text-sm uppercase tracking-wider mb-1 ${textMuted}`} style={fontStyle}>Email</p>
                  <a href="mailto:corentinbassonpro@gmail.com" className={`${textMain} hover:opacity-70 transition-opacity`} style={fontStyle}>
                    corentinbassonpro@gmail.com
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <MapPin className={`w-5 h-5 mt-1 flex-shrink-0 ${textMutedSub}`} />
                <div>
                  <p className={`text-sm uppercase tracking-wider mb-1 ${textMuted}`} style={fontStyle}>Localisation</p>
                  <p className={textMain} style={fontStyle}>La Réunion (974)</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <Calendar className={`w-5 h-5 mt-1 flex-shrink-0 ${textMutedSub}`} />
                <div>
                  <p className={`text-sm uppercase tracking-wider mb-1 ${textMuted}`} style={fontStyle}>Planifier un appel</p>
                  <a href="https://calendly.com/corentinbassonpro/30min" target="_blank" rel="noopener noreferrer"
                    className={`${textMain} hover:opacity-70 transition-opacity underline underline-offset-4`} style={fontStyle}>
                    Réserver un créneau de 30 min
                  </a>
                </div>
              </div>
            </div>

            {/* Réseaux sociaux */}
            <div className={`border p-6 space-y-4 ${borderBox} ${boxBg}`}>
              <h3 className={`text-xl font-bold uppercase tracking-widest ${sparkleClass}`} style={fontStyle}>
                Réseaux
              </h3>
              <div className="space-y-3">
                <a href="https://www.instagram.com/cbsn.studio/" target="_blank" rel="noopener noreferrer"
                  className={`flex items-center gap-3 ${textMain} hover:opacity-70 transition-opacity`} style={fontStyle}>
                  <Instagram className="w-5 h-5" />
                  @cbsn.studio
                </a>
                <a href="https://linkedin.com/in/corentin-basson" target="_blank" rel="noopener noreferrer"
                  className={`flex items-center gap-3 ${textMain} hover:opacity-70 transition-opacity`} style={fontStyle}>
                  <Linkedin className="w-5 h-5" />
                  Corentin Basson
                </a>
              </div>
            </div>

            {/* Disponibilité */}
            <div className={`border p-6 ${borderBox} ${boxBg}`}>
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse" />
                <p className="text-sm uppercase tracking-widest" style={fontStyle}>
                  Disponible pour nouveaux projets
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
