import Header from '../_components/Header'
import QuoteLeadForm from '../_components/QuoteLeadForm'
import GalleryStrip from '../_components/GalleryStrip'
import BottomCta from '../_components/BottomCta'

export const metadata = {
  title: 'Instant Roof Estimate — Peak Builders & Roofers of San Diego',
  description: 'Enter your address and get an instant roof replacement estimate from satellite imagery. Free on-site inspection to confirm.',
}

export default function PeakBuildersInstantQuote() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--pb-bg)' }}>
      <Header />
      <main style={{
        flex: 1,
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        padding: 'clamp(1.5rem, 4vw, 3rem) 1rem',
      }}>
        <div style={{ width: '100%', maxWidth: 480 }}>
          <QuoteLeadForm />
        </div>
      </main>
      <GalleryStrip />
      <BottomCta />
      <footer style={{
        padding: '20px 24px',
        textAlign: 'center',
        borderTop: '1px solid var(--pb-divider)',
      }}>
        <p style={{ fontSize: 12, color: 'var(--pb-muted-fg)' }}>
          © {new Date().getFullYear()} Peak Builders &amp; Roofers of San Diego. Licensed &amp; Insured.
        </p>
      </footer>
    </div>
  )
}
