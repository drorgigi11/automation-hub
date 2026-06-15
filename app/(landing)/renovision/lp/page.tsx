import type { Metadata } from 'next'
import LpLanding from './_components/LpLanding'

export const metadata: Metadata = {
  title: 'Remodel Your Home With Confidence | Renovision Design & Build',
  description:
    'Licensed, insured & backed by 500+ happy families. From free 3D design to finished project — one team, start to finish. Kitchens, bathrooms & full-home remodels across Greater Seattle, Tacoma to Marysville.',
}

export default function LpPage() {
  return <LpLanding />
}
