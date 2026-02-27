"use client"

import dynamic from "next/dynamic"

const StitchInvadersGame = dynamic(
  () => import("@/components/stitch-invaders/StitchInvadersGame"),
  { ssr: false }
)

export default function StitchInvadersWrapper() {
  return (
    <div className="pt-4">
      <StitchInvadersGame />
    </div>
  )
}
