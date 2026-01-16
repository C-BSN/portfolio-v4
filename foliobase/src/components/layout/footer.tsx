import Link from "next/link"
import { Separator } from "@/components/ui/separator"

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="w-full border-t bg-background">
      <div className="max-w-7xl mx-auto w-full px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Logo et description */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">P</span>
              </div>
              <span className="font-bold text-xl">Portfolio</span>
            </Link>
            <p className="text-sm text-muted-foreground max-w-xs">
              Portfolio de graphiste freelance. Découvrez mes créations et réalisations.
            </p>
          </div>

          {/* Navigation */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold">Navigation</h3>
            <nav className="flex flex-col space-y-2">
              <Link 
                href="/" 
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Accueil
              </Link>
              <Link 
                href="/about" 
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                À propos
              </Link>
              <Link 
                href="/projects" 
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Réalisations
              </Link>
            </nav>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold">Contact</h3>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                Prêt(e) à collaborer ?
              </p>
              <Link 
                href="mailto:corentinbassonpro@gmail.com" 
                className="text-sm text-primary hover:underline"
              >
                corentinbassonpro@gmail.com
              </Link>
            </div>
          </div>
        </div>

        <Separator className="my-8" />
        
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <p className="text-xs text-muted-foreground">
            © {currentYear} Portfolio. Tous droits réservés.
          </p>
          <div className="flex items-center gap-4">
            {process.env.NODE_ENV === 'development' && (
              <Link 
                href="/test" 
                className="text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                [Dev] Test Galeries
              </Link>
            )}
            <p className="text-xs text-muted-foreground">
              Créé avec Next.js & Decap CMS
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
} 