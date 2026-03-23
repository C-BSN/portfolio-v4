import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export const metadata: Metadata = {
  title: "Landing page Kellogg's x Artistes",
  description: "Integration de la landing page du projet Collaboration Inattendue - Kellogg's x Artistes Musicaux.",
}

export default function KelloggsLandingPreviewPage() {
  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans">
      <header className="bg-white py-4 border-b">
        <div className="container mx-auto px-4">
          <Image
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Kellogg-Logo-PmaIiykcgoQ49caJqdRJc4JGuenHyE.png"
            alt="Kellogg's"
            width={200}
            height={60}
            className="mx-auto"
          />
        </div>
      </header>

      <section className="relative h-[70vh] bg-pink-100">
        <div className="absolute inset-0 bg-gradient-to-r from-red-500/20 to-pink-500/20" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center px-4">
            <h1 className="text-5xl md:text-6xl font-bold text-red-600 mb-4">L&apos;Amour au Premier Crunch</h1>
            <p className="text-xl md:text-2xl text-gray-800 mb-8">
              Bad Bunny x Frosties | Rose x Miel Pops | Bruno Mars x Coco Pops
            </p>
            <Button className="bg-red-600 hover:bg-red-700 text-white text-lg px-8 py-6 rounded-full">
              Decouvrir la collection
            </Button>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">Notre douce symphonie</h2>
          <p className="text-lg text-center max-w-3xl mx-auto">
            Imaginez un monde ou vos artistes preferes rencontrent vos cereales adorees. C&apos;est exactement ce qui se
            passe quand Bad Bunny, Rose et Bruno Mars entrent dans l&apos;univers Kellogg&apos;s. Cette Saint-Valentin,
            la collaboration transforme le petit-dejeuner en moment collector, musical et emotionnel.
          </p>
        </div>
      </section>

      <section className="py-16 bg-pink-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">EP exclusifs & cereales collector</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                artist: "Bad Bunny",
                cereal: "Frosties",
                song: "Quiereme.",
                description: "Passion brute et nostalgie urbaine",
                image:
                  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/POCHETTE%20VINYLE%20BADBUNNY.png-SXiBys2boueJKrhvrQKH8x5HBPeXgA.jpeg",
                promo:
                  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Kelloggs%20BAD-noNSqD6ty8KlLEjwl2dWagD1t681tm.png",
              },
              {
                artist: "Rose",
                cereal: "Miel Pops",
                song: "Naleul Salanghae",
                description: "Douceur et emotions pures",
                image:
                  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ROSE%20POCHETTE%20VINYLE.png-eADlH347SfXJej7vjAZ8Z1unNqmkL3.jpeg",
                promo:
                  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Kelloggs%20original%20Rose%CC%81-3QrswsybDbSioVHqLMQLLNvAwuP4OI.png",
              },
              {
                artist: "Bruno Mars",
                cereal: "Coco Pops",
                song: "Love Me.",
                description: "Groove et seduction retro",
                image:
                  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/VINYLE%20BRUNO-kdGEETFLBz5fOFJGSyCjrBLNgQX9bl.png",
                promo:
                  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Kelloggs%20original%20Bruno%202-MEBTNcMtMXrPHcjrdPWDeL2tQjOb8y.png",
              },
            ].map((item) => (
              <div key={item.artist} className="bg-white rounded-lg shadow-lg p-6">
                <div className="text-center mb-8">
                  <div className="relative w-full aspect-square mb-4">
                    <Image src={item.image} alt={`${item.artist} EP Cover`} fill className="object-contain rounded-lg" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">
                    {item.artist} x {item.cereal}
                  </h3>
                  <p className="text-lg mb-4">&quot;{item.song}&quot;</p>
                  <p className="text-sm text-gray-600">{item.description}</p>
                </div>
                <div className="relative w-full aspect-[2/1] mt-8">
                  <Image
                    src={item.promo}
                    alt={`${item.artist} x ${item.cereal} Promotion`}
                    fill
                    className="object-contain rounded-lg"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-red-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-8">Trouvez le ticket d&apos;or</h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto">
            Cherchez le ticket d&apos;or dans votre boite de cereales Kellogg&apos;s en edition speciale et gagnez une
            chance de rencontrer Bad Bunny, Rose ou Bruno Mars.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto mb-8">
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Carte_ticket%20BADBUNNY.png-aYaqu8GFTDvu3hQ7R0dSjsxh0RIMiL.jpeg"
              alt="Ticket d'or Bad Bunny"
              width={300}
              height={180}
              className="rounded-lg mx-auto transform hover:scale-105 transition-transform duration-200"
            />
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Carte_Ticket%20Rose%CC%81.png-wufJl3aQWwWilWQMeZUoBILOgv5Vki.jpeg"
              alt="Ticket d'or Rose"
              width={300}
              height={180}
              className="rounded-lg mx-auto transform hover:scale-105 transition-transform duration-200"
            />
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Carte_ticket_Bruno.png-UL40bSWE8rHtxRvmzlo6md9o6iBdks.jpeg"
              alt="Ticket d'or Bruno Mars"
              width={300}
              height={180}
              className="rounded-lg mx-auto transform hover:scale-105 transition-transform duration-200"
            />
          </div>
          <Button className="bg-white text-red-600 hover:bg-gray-100">En savoir plus sur le concours</Button>
        </div>
      </section>

      <section className="py-16 bg-pink-100">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-8">Debloquez du contenu exclusif</h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto">
            Chaque boite contient un code unique pour acceder aux singles exclusifs. Le scan du QR code prolonge
            immediatement l&apos;experience vers la dimension digitale de la campagne.
          </p>
          <div className="relative w-full max-w-sm mx-auto">
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/jhvc.png-fKBdb6FrturgH6g2beaIPCDj50C9Hd.jpeg"
              alt="Exemple de carte avec QR code"
              width={300}
              height={400}
              className="rounded-lg mx-auto shadow-lg"
            />
            <p className="text-sm text-gray-600 mt-4 italic">
              Exemple de carte avec QR code pour acceder au contenu exclusif
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">Restez informe</h2>
          <p className="text-lg mb-8 text-center max-w-2xl mx-auto">
            Inscrivez-vous a la newsletter pour acceder aux actualites de la collaboration et aux contenus exclusifs.
          </p>
          <form className="max-w-md mx-auto flex flex-col sm:flex-row gap-4">
            <Input type="email" placeholder="Entrez votre email" className="flex-grow bg-white" required />
            <Button type="submit" className="bg-red-600 hover:bg-red-700 text-white">
              S&apos;inscrire
            </Button>
          </form>
        </div>
      </section>

      <footer className="bg-gray-900 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; 2025 Kellogg&apos;s x Collaboration Artistes. Tous droits reserves.</p>
          <div className="mt-4">
            <Link href="/projects/collaboration-inattendue-kelloggs" className="text-sm hover:underline mr-4">
              Retour au projet
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
