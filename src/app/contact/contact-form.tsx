'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Send, Mail, MapPin, Calendar, CheckCircle, Linkedin, Instagram } from 'lucide-react'
import Link from 'next/link'
import { NeonTitle } from '@/components/effects/NeonTitle'

type FormState = 'idle' | 'sending' | 'sent'

export default function ContactForm() {
  const [formState, setFormState] = useState<FormState>('idle')
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    type: '',
    message: '',
  })

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setFormState('sending')

    const subject = encodeURIComponent(
      formData.subject || `Demande de contact - ${formData.type || 'Projet'}`
    )
    const body = encodeURIComponent(
      `Bonjour Corentin,\n\n` +
      `Je me permets de vous contacter.\n\n` +
      `Nom : ${formData.name}\n` +
      `Email : ${formData.email}\n` +
      (formData.type ? `Type de projet : ${formData.type}\n` : '') +
      (formData.subject ? `Objet : ${formData.subject}\n` : '') +
      `\nMessage :\n${formData.message}\n\n` +
      `Cordialement,\n${formData.name}`
    )

    setTimeout(() => {
      window.location.href = `mailto:corentinbassonpro@gmail.com?subject=${subject}&body=${body}`
      setFormState('sent')
    }, 400)
  }

  const inputClasses = "w-full bg-transparent border border-white/20 px-5 py-3 text-[#F0F0F0] placeholder:text-white/30 focus:border-[#ff0080] focus:outline-none transition-colors duration-300"
  const labelClasses = "block text-sm uppercase tracking-widest mb-2 text-white/70"
  const fontStyle = { fontFamily: "'Oswald', sans-serif" }

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
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-3"
          >
            {formState === 'sent' ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="border border-white/20 p-12 text-center"
              >
                <CheckCircle className="w-16 h-16 mx-auto mb-6 text-green-400" />
                <h2 className="text-3xl font-bold uppercase mb-4" style={fontStyle}>
                  Votre client mail s'est ouvert
                </h2>
                <p className="text-lg opacity-70 mb-8" style={fontStyle}>
                  Si votre messagerie ne s'est pas ouverte automatiquement, envoyez directement votre message à :
                </p>
                <a
                  href="mailto:corentinbassonpro@gmail.com"
                  className="text-[#00f3ff] text-lg underline underline-offset-4 hover:opacity-80 transition-opacity"
                  style={fontStyle}
                >
                  corentinbassonpro@gmail.com
                </a>
                <div className="mt-10">
                  <button
                    onClick={() => { setFormState('idle'); setFormData({ name: '', email: '', subject: '', type: '', message: '' }) }}
                    className="border-2 border-[#F0F0F0] px-8 py-3 uppercase tracking-widest hover:bg-[#F0F0F0] hover:text-[#050505] transition-all duration-300"
                    style={fontStyle}
                  >
                    Nouveau message
                  </button>
                </div>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className={labelClasses} style={fontStyle}>
                      Nom complet *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Votre nom"
                      className={inputClasses}
                      style={fontStyle}
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className={labelClasses} style={fontStyle}>
                      Email *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="votre@email.com"
                      className={inputClasses}
                      style={fontStyle}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="type" className={labelClasses} style={fontStyle}>
                      Type de projet
                    </label>
                    <select
                      id="type"
                      name="type"
                      value={formData.type}
                      onChange={handleChange}
                      className={`${inputClasses} appearance-none cursor-pointer`}
                      style={fontStyle}
                    >
                      <option value="" className="bg-[#050505]">Sélectionner...</option>
                      {projectTypes.map(type => (
                        <option key={type} value={type} className="bg-[#050505]">{type}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="subject" className={labelClasses} style={fontStyle}>
                      Objet
                    </label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      placeholder="Objet de votre message"
                      className={inputClasses}
                      style={fontStyle}
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="message" className={labelClasses} style={fontStyle}>
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={6}
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Décrivez votre projet, vos besoins, votre calendrier..."
                    className={`${inputClasses} resize-none`}
                    style={fontStyle}
                  />
                </div>

                <button
                  type="submit"
                  disabled={formState === 'sending'}
                  className="w-full border-2 border-[#F0F0F0] px-8 py-4 uppercase tracking-widest text-lg hover:bg-[#F0F0F0] hover:text-[#050505] transition-all duration-300 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                  style={fontStyle}
                >
                  {formState === 'sending' ? (
                    <>
                      <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                      Ouverture...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      Envoyer le message
                    </>
                  )}
                </button>
              </form>
            )}
          </motion.div>

          {/* Sidebar infos */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-2 space-y-8"
          >
            {/* Coordonnées */}
            <div className="border border-white/20 p-6 space-y-6">
              <h3 className="text-xl font-bold uppercase tracking-widest title-h2-sparkle" style={fontStyle}>
                Coordonnées
              </h3>

              <div className="flex items-start gap-4">
                <Mail className="w-5 h-5 mt-1 text-white/70 flex-shrink-0" />
                <div>
                  <p className="text-sm uppercase tracking-wider text-white/50 mb-1" style={fontStyle}>Email</p>
                  <a href="mailto:corentinbassonpro@gmail.com" className="text-white hover:opacity-70 transition-opacity" style={fontStyle}>
                    corentinbassonpro@gmail.com
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <MapPin className="w-5 h-5 mt-1 text-white/70 flex-shrink-0" />
                <div>
                  <p className="text-sm uppercase tracking-wider text-white/50 mb-1" style={fontStyle}>Localisation</p>
                  <p className="text-white" style={fontStyle}>La Réunion (974)</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <Calendar className="w-5 h-5 mt-1 text-white/70 flex-shrink-0" />
                <div>
                  <p className="text-sm uppercase tracking-wider text-white/50 mb-1" style={fontStyle}>Planifier un appel</p>
                  <a
                    href="https://calendly.com/corentinbassonpro/30min"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white hover:opacity-70 transition-opacity underline underline-offset-4"
                    style={fontStyle}
                  >
                    Réserver un créneau de 30 min
                  </a>
                </div>
              </div>
            </div>

            {/* Réseaux sociaux */}
            <div className="border border-white/20 p-6 space-y-4">
              <h3 className="text-xl font-bold uppercase tracking-widest title-h2-sparkle" style={fontStyle}>
                Réseaux
              </h3>
              <div className="space-y-3">
                <a
                  href="https://www.instagram.com/cbsn.studio/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-white hover:opacity-70 transition-opacity"
                  style={fontStyle}
                >
                  <Instagram className="w-5 h-5" />
                  @cbsn.studio
                </a>
                <a
                  href="https://linkedin.com/in/corentin-basson"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-white hover:opacity-70 transition-opacity"
                  style={fontStyle}
                >
                  <Linkedin className="w-5 h-5" />
                  Corentin Basson
                </a>
              </div>
            </div>

            {/* Disponibilité */}
            <div className="border border-white/20 p-6">
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
