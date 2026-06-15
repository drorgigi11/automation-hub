import type { Metadata } from 'next'
import RemodelingLanding from './_components/RemodelingLanding'

export const metadata: Metadata = {
  title: 'Home Remodeling Done Right, On Time | Renovision Design-Build — Greater Seattle',
  description:
    'Kitchens, bathrooms, basements, additions & outdoor living. Every decision locked in 3D with a signed materials list before demo, one dedicated crew to the finish line, daily photo reports. Serving Greater Seattle, Tacoma & Marysville.',
}

export default function RenovisionHome() {
  return <RemodelingLanding />
}
