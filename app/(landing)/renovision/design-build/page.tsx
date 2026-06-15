import type { Metadata } from 'next'
import DesignBuildLanding from './_components/DesignBuildLanding'

export const metadata: Metadata = {
  title: 'On-Time, Zero-Surprise Remodeling | Renovision Design-Build — Greater Seattle',
  description:
    'Bathroom in ≤10 business days, kitchen in ≤30. Budget & materials locked in 3D before demo. Miss the deadline, you get a daily credit. Serving Greater Seattle, Tacoma & Marysville.',
}

export default function DesignBuildPage() {
  return <DesignBuildLanding />
}
