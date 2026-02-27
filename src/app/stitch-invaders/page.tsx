import type { Metadata } from "next"
import StitchInvadersWrapper from "./stitch-invaders-wrapper"

export const metadata: Metadata = {
  title: "Stitch Invaders",
  description: "Mini-jeu Stitch Invaders inspiré de Space Invaders, créé dans le cadre du projet événementiel Lilo & Stitch.",
}

export default function StitchInvadersPage() {
  return <StitchInvadersWrapper />
}
