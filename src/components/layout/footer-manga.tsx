import Link from "next/link"
import { Mail, Github, Linkedin, Instagram } from "lucide-react"

export function FooterManga() {
  const currentYear = new Date().getFullYear()

  const socialLinks = [
    { icon: Mail, href: "/contact", label: "Contact" },
    { icon: Instagram, href: "https://www.instagram.com/cbsn.studio/", label: "Instagram" },
    { icon: Linkedin, href: "https://linkedin.com/in/corentin-basson", label: "LinkedIn" },
    { icon: Github, href: "https://github.com/corentinbasson", label: "GitHub" },
  ]

  return (
    <footer className="relative z-[200] bg-white/80 dark:bg-[#050505] backdrop-blur-sm dark:backdrop-blur-none border-t border-foreground/10 transition-colors duration-300">
      <div className="max-w-7xl mx-auto w-full px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Logo et description */}
          <div className="space-y-4">
            <Link href="/" className="inline-block group">
              <h3 className="text-2xl font-bold uppercase tracking-wider text-[#1a2f5a] dark:text-white" style={{ fontFamily: "'Oswald', sans-serif" }}>
                Corentin Basson
              </h3>
            </Link>
            <p className="text-sm text-[#1a2f5a]/70 dark:text-white/70 max-w-xs" style={{ fontFamily: "'Oswald', sans-serif" }}>
              Photographe & Graphiste Freelance<br />
              BTS Communication en alternance<br />
              La Réunion • 974
            </p>
          </div>

          {/* Navigation */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold uppercase tracking-widest text-[#1a2f5a]/70 dark:text-white/70" style={{ fontFamily: "'Oswald', sans-serif" }}>
              Navigation
            </h4>
            <nav className="flex flex-col space-y-2">
              {[
                { name: "Accueil", href: "/" },
                { name: "À propos", href: "/about" },
                { name: "Projets", href: "/projects" },
                { name: "Contact", href: "/contact" }
              ].map((item) => (
                <Link 
                  key={item.name}
                  href={item.href} 
                  className="text-sm text-[#1a2f5a] dark:text-white hover:opacity-70 transition-opacity w-fit uppercase tracking-wider"
                  style={{ fontFamily: "'Oswald', sans-serif" }}
                >
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>

          {/* Contact & Réseaux */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold uppercase tracking-widest text-[#1a2f5a]/70 dark:text-white/70" style={{ fontFamily: "'Oswald', sans-serif" }}>
              Contact & Réseaux
            </h4>
            <div className="flex space-x-4">
              {socialLinks.map((social) => {
                const isInternal = social.href.startsWith('/')
                const cls = "w-10 h-10 border border-[#1a2f5a]/30 dark:border-white/20 text-[#1a2f5a] dark:text-white flex items-center justify-center hover:border-[#1a2f5a] dark:hover:border-white transition-colors"
                if (isInternal) {
                  return (
                    <Link key={social.label} href={social.href} className={cls} aria-label={social.label}>
                      <social.icon className="w-5 h-5" />
                    </Link>
                  )
                }
                return (
                  <a key={social.label} href={social.href} target="_blank" rel="noopener noreferrer" className={cls} aria-label={social.label}>
                    <social.icon className="w-5 h-5" />
                  </a>
                )
              })}
            </div>
            <a
              href="mailto:corentinbassonpro@gmail.com"
              className="block text-sm text-[#1a2f5a] dark:text-white hover:opacity-70 transition-opacity"
              style={{ fontFamily: "'Oswald', sans-serif" }}
            >
              corentinbassonpro@gmail.com
            </a>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-foreground/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-[#1a2f5a]/50 dark:text-white/50 uppercase tracking-widest" style={{ fontFamily: "'Oswald', sans-serif" }}>
            © {currentYear} Corentin Basson • Tous droits réservés
          </p>
          <Link
            href="/neon-run"
            className="text-xs text-[#1a2f5a]/50 dark:text-white/50 uppercase tracking-widest cursor-pointer hover:text-[#1a2f5a] dark:hover:text-white transition-colors duration-300"
            style={{ fontFamily: "'Oswald', sans-serif" }}
          >
            Portfolio v4.0
          </Link>
        </div>
      </div>
    </footer>
  )
}
