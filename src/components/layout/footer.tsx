import Link from "next/link"
import { Mail, Github, Linkedin, Instagram, Camera, Code, Palette, Calendar } from "lucide-react"

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <>
      {/* Footer cyberpunk */}
      <footer className="relative bg-black/60 backdrop-blur-md border-t border-cyan-400/30 cyberpunk-footer">
        <div className="max-w-7xl mx-auto w-full px-4 py-12">
          {/* Scan line supérieure */}
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-pulse"></div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {/* Logo et description cyberpunk */}
            <div className="space-y-6">
              <Link href="/" className="flex items-center space-x-3 group">
                <div className="relative">
                  <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-purple-500 rounded-lg flex items-center justify-center relative overflow-hidden cyberpunk-logo-glow">
                    <span className="text-black font-bold text-lg font-mono">C</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                  </div>
                  <div className="absolute -inset-1 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-lg blur opacity-30 group-hover:opacity-50 transition-opacity"></div>
                </div>
                <div>
                  <span className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent font-mono">
                    CORENTIN BASSON
                  </span>
                  <div className="h-0.5 bg-gradient-to-r from-cyan-400 to-purple-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
                </div>
              </Link>
              <p className="text-sm text-gray-300 max-w-xs font-mono leading-relaxed">
                <span className="text-cyan-400">&gt;</span> Photographe - Graphiste Freelance<br />
                <span className="text-purple-400">&gt;</span> BTS Communication en alternance<br />
                <span className="text-pink-400">&gt;</span> 5+ années d'expérience, 50+ projets
              </p>
              
              {/* Icônes de compétences */}
              <div className="flex space-x-3">
                {[
                  { icon: Palette, color: "text-cyan-400" },
                  { icon: Camera, color: "text-purple-400" },
                  { icon: Code, color: "text-pink-400" }
                ].map((item, index) => (
                  <div key={index} className="relative group">
                    <div className="w-8 h-8 bg-black/60 border border-gray-600 rounded-lg flex items-center justify-center group-hover:border-cyan-400 transition-all duration-300">
                      <item.icon className={`w-4 h-4 ${item.color} group-hover:text-white transition-colors duration-300`} />
                    </div>
                    <div className="absolute -inset-1 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-lg blur opacity-0 group-hover:opacity-30 transition-opacity duration-300"></div>
                  </div>
                ))}
              </div>
            </div>

            {/* Navigation cyberpunk */}
            <div className="space-y-6">
              <h3 className="text-sm font-bold text-cyan-400 uppercase tracking-wider font-mono">
                <span className="text-pink-400">[</span> Navigation <span className="text-pink-400">]</span>
              </h3>
              <nav className="flex flex-col space-y-3">
                {[
                  { name: "ACCUEIL", href: "/" },
                  { name: "À PROPOS", href: "/about" },
                  { name: "PROJETS", href: "/projects" }
                ].map((item) => (
                  <Link 
                    key={item.name}
                    href={item.href} 
                    className="group relative text-sm text-gray-300 hover:text-cyan-400 transition-all duration-300 font-mono w-fit"
                  >
                    <span className="relative z-10">&gt; {item.name}</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/10 to-transparent opacity-0 group-hover:opacity-100 rounded transition-opacity duration-300 -inset-1"></div>
                  </Link>
                ))}
              </nav>
            </div>

            {/* Contact cyberpunk */}
            <div className="space-y-6">
              <h3 className="text-sm font-bold text-cyan-400 uppercase tracking-wider font-mono">
                <span className="text-pink-400">[</span> Contact <span className="text-pink-400">]</span>
              </h3>
              <div className="space-y-4">
                <p className="text-sm text-gray-300 font-mono">
                  <span className="text-purple-400">&gt;</span> Ready.to.collaborate()?
                </p>
                <Link 
                  href="mailto:corentinbassonpro@gmail.com" 
                  className="group flex items-center space-x-2 text-sm text-cyan-400 hover:text-pink-400 transition-colors duration-300 font-mono"
                >
                  <Mail className="w-4 h-4" />
                  <span>corentinbassonpro@gmail.com</span>
                  <div className="w-0 h-px bg-gradient-to-r from-cyan-400 to-pink-400 group-hover:w-full transition-all duration-300"></div>
                </Link>

                <Link 
                  href="https://calendly.com/corentinbassonpro/30min" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center space-x-2 text-sm text-purple-400 hover:text-cyan-400 transition-colors duration-300 font-mono"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Planifier un appel</span>
                  <div className="w-0 h-px bg-gradient-to-r from-purple-400 to-cyan-400 group-hover:w-full transition-all duration-300"></div>
                </Link>

                {/* Réseaux sociaux */}
                <div className="flex space-x-3 pt-2">
                  {[
                    { icon: Github, href: "#", label: "GitHub" },
                    { icon: Linkedin, href: "https://www.linkedin.com/in/corentin-basson-6a6425275", label: "LinkedIn" },
                    { icon: Instagram, href: "https://www.instagram.com/cbsn.studio/", label: "Instagram" }
                  ].map((social, index) => (
                    <Link
                      key={index}
                      href={social.href}
                      target={social.href !== "#" ? "_blank" : undefined}
                      rel={social.href !== "#" ? "noopener noreferrer" : undefined}
                      className="group relative w-8 h-8 bg-black/60 border border-gray-600 rounded-lg flex items-center justify-center hover:border-cyan-400 transition-all duration-300"
                    >
                      <social.icon className="w-4 h-4 text-gray-400 group-hover:text-cyan-400 transition-colors duration-300" />
                      <div className="absolute -inset-1 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-lg blur opacity-0 group-hover:opacity-30 transition-opacity duration-300"></div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Séparateur cyberpunk */}
          <div className="my-8 relative">
            <div className="h-px bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent"></div>
            <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
          </div>
          
          {/* Bas de page cyberpunk */}
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-xs text-gray-400 font-mono">
              <span className="text-cyan-400">©</span> {currentYear} <span className="text-purple-400">Corentin Basson</span> - Tous droits réservés
            </p>
            <div className="flex items-center gap-6">
              {process.env.NODE_ENV === 'development' && (
                <Link 
                  href="/test" 
                  className="text-xs text-pink-400 hover:text-cyan-400 transition-colors font-mono"
                >
                  [DEV.MODE] Test_Galeries
                </Link>
              )}
              <p className="text-xs text-gray-400 font-mono">
                <span className="text-cyan-400">Built.with:</span> Next.js <span className="text-purple-400">+</span> Decap.CMS
              </p>
            </div>
          </div>

          {/* Particules flottantes */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {Array.from({length: 8}, (_, i) => (
              <div 
                key={i}
                className="absolute w-1 h-1 bg-cyan-400 rounded-full opacity-20 animate-pulse"
                style={{
                  left: `${10 + (i * 12)}%`,
                  top: `${20 + (i % 3) * 30}%`,
                  animationDelay: `${i * 0.7}s`,
                  animationDuration: `${3 + (i * 0.2)}s`
                }}
              ></div>
            ))}
          </div>
        </div>

        {/* Scan line inférieure */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-pink-400 to-transparent opacity-60"></div>
      </footer>


    </>
  )
} 