import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* Header */}
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

      {/* Hero Section */}
      <section className="relative h-[70vh] bg-pink-100">
        <div className="absolute inset-0 bg-gradient-to-r from-red-500/20 to-pink-500/20" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-5xl md:text-6xl font-bold text-red-600 mb-4">L'Amour au Premier Crunch</h2>
            <p className="text-xl md:text-2xl text-gray-800 mb-8">
              Bad Bunny x Frosties | Rosé x Miel Pops | Bruno Mars x Coco Pops
            </p>
            <Button className="bg-red-600 hover:bg-red-700 text-white text-lg px-8 py-6 rounded-full">
              Découvrir la Collection
            </Button>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">Notre Douce Symphonie</h2>
          <p className="text-lg text-center max-w-3xl mx-auto">
            Imaginez un monde où vos artistes préférés rencontrent vos céréales adorées. C'est exactement ce qui s'est
            passé quand Bad Bunny, Rosé et Bruno Mars sont entrés dans la cuisine Kellogg's. Cette Saint-Valentin, nous
            vous apportons une collaboration en édition limitée qui fera battre votre cœur et danser vos papilles !
          </p>
        </div>
      </section>

      {/* Products Section */}
      <section className="py-16 bg-pink-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">
            EP Exclusifs & Céréales Collector
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                artist: "Bad Bunny",
                cereal: "Frosties",
                song: "Quiéreme.",
                description: "Passion brute et nostalgie urbaine",
                image:
                  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/POCHETTE%20VINYLE%20BADBUNNY.png-SXiBys2boueJKrhvrQKH8x5HBPeXgA.jpeg",
                promo:
                  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Kelloggs%20BAD-noNSqD6ty8KlLEjwl2dWagD1t681tm.png",
              },
              {
                artist: "Rosé",
                cereal: "Miel Pops",
                song: "Naleul Salanghae",
                description: "Douceur et émotions pures",
                image:
                  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ROSE%20POCHETTE%20VINYLE.png-eADlH347SfXJej7vjAZ8Z1unNqmkL3.jpeg",
                promo:
                  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Kelloggs%20original%20Rose%CC%81-3QrswsybDbSioVHqLMQLLNvAwuP4OI.png",
              },
              {
                artist: "Bruno Mars",
                cereal: "Coco Pops",
                song: "Love Me.",
                description: "Groove et séduction rétro",
                image:
                  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/VINYLE%20BRUNO-kdGEETFLBz5fOFJGSyCjrBLNgQX9bl.png",
                promo:
                  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Kelloggs%20original%20Bruno%202-MEBTNcMtMXrPHcjrdPWDeL2tQjOb8y.png",
              },
            ].map((item, index) => (
              <div key={index} className="bg-white rounded-lg shadow-lg p-6">
                <div className="text-center mb-8">
                  <div className="relative w-full aspect-square mb-4">
                    <Image
                      src={item.image || "/placeholder.svg"}
                      alt={`${item.artist} EP Cover`}
                      fill
                      className="object-contain rounded-lg"
                    />
                  </div>
                  <h3 className="text-xl font-bold mb-2">
                    {item.artist} x {item.cereal}
                  </h3>
                  <p className="text-lg mb-4">"{item.song}"</p>
                  <p className="text-sm text-gray-600">{item.description}</p>
                </div>
                <div className="relative w-full aspect-[2/1] mt-8">
                  <Image
                    src={item.promo || "/placeholder.svg"}
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

      {/* Contest Section */}
      <section className="py-16 bg-red-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-8">Trouvez le Ticket d'Or !</h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto">
            Cherchez le Ticket d'Or dans votre boîte de céréales Kellogg's en édition spéciale et gagnez une chance de
            rencontrer Bad Bunny, Rosé ou Bruno Mars en personne !
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto mb-8">
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Carte_ticket%20BADBUNNY.png-aYaqu8GFTDvu3hQ7R0dSjsxh0RIMiL.jpeg"
              alt="Ticket d'Or Bad Bunny"
              width={300}
              height={180}
              className="rounded-lg mx-auto transform hover:scale-105 transition-transform duration-200"
            />
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Carte_Ticket%20Rose%CC%81.png-wufJl3aQWwWilWQMeZUoBILOgv5Vki.jpeg"
              alt="Ticket d'Or Rosé"
              width={300}
              height={180}
              className="rounded-lg mx-auto transform hover:scale-105 transition-transform duration-200"
            />
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Carte_ticket_Bruno.png-UL40bSWE8rHtxRvmzlo6md9o6iBdks.jpeg"
              alt="Ticket d'Or Bruno Mars"
              width={300}
              height={180}
              className="rounded-lg mx-auto transform hover:scale-105 transition-transform duration-200"
            />
          </div>
          <Button className="bg-white text-red-600 hover:bg-gray-100">En Savoir Plus sur le Concours</Button>
        </div>
      </section>

      {/* Exclusive Content Section */}
      <section className="py-16 bg-pink-100">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-8">Débloquez du Contenu Exclusif</h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto">
            Vous n'avez pas trouvé de Ticket d'Or ? Pas d'inquiétude ! Chaque boîte contient un code unique pour accéder
            aux singles exclusifs de vos artistes préférés. Scannez simplement le QR code et profitez !
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
              Exemple de carte avec QR code pour accéder au contenu exclusif
            </p>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">Restez Informé</h2>
          <p className="text-lg mb-8 text-center max-w-2xl mx-auto">
            Inscrivez-vous à notre newsletter pour avoir un accès prioritaire aux préventes de billets de concert et du
            contenu exclusif en coulisses !
          </p>
          <form className="max-w-md mx-auto flex flex-col sm:flex-row gap-4">
            <Input type="email" placeholder="Entrez votre email" className="flex-grow" required />
            <Button type="submit" className="bg-red-600 hover:bg-red-700 text-white">
              S'inscrire
            </Button>
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; 2025 Kellogg's x Collaboration Artistes. Tous droits réservés.</p>
          <div className="mt-4">
            <Link href="/privacy" className="text-sm hover:underline mr-4">
              Politique de Confidentialité
            </Link>
            <Link href="/terms" className="text-sm hover:underline">
              Conditions d'Utilisation
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
