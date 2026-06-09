import type { Metadata } from 'next'
import UndercutLanding from './_components/UndercutLanding'

export const metadata: Metadata = {
  title: 'We Can Beat Your Quote | Free Second-Opinion Proposal Review — Renovision Seattle',
  description:
    'Got a renovation quote in the Seattle area? Our design-build team reviews your quote and shows you whether we can offer a better price, clearer scope, and a safer build process. Free, no obligation.',
}

export default function UndercutPage() {
  return <UndercutLanding />
}
