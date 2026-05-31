import type { Metadata } from 'next'
import Header from '../_components/Header'
import LeadForm from '../_components/LeadForm'
import GalleryStrip from '../_components/GalleryStrip'
import BottomCta from '../_components/BottomCta'

export const metadata: Metadata = {
  title: 'Peak Builders — Check if You Qualify for Roof Replacement with No Upfront Cost',
  description: 'Roof replacement from $179/mo in San Diego — no upfront cost, 0% interest. 2,100+ roofs completed.',
}

export default function PeakBuildersFinancingLanding() {
  return (
    <div className="pb-financing" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--pb-bg)' }}>
      <style>{`
        .pb-financing {
          --pb-primary: #15803d;
          --pb-primary-hover: #166534;
          --pb-primary-fg: #ffffff;
        }
        .pb-financing .pb-btn-cta {
          box-shadow: 0 4px 16px rgba(21,128,61,0.40);
        }
        .pb-financing .pb-btn-cta:hover {
          box-shadow: 0 8px 22px rgba(21,128,61,0.50);
        }
        .pb-financing .pb-input:focus {
          box-shadow: 0 0 0 3px rgba(21,128,61,0.18);
        }
        .pb-financing .pb-btn-form:hover {
          background: #f6fbf7;
          box-shadow: 0 2px 12px rgba(21,128,61,0.18);
        }
      `}</style>
      <Header />
      <main style={{
        flex: 1,
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        padding: 'clamp(1.5rem, 4vw, 3rem) 1rem',
      }}>
        <div style={{ width: '100%', maxWidth: 480 }}>
          <LeadForm variant="financing" />
        </div>
      </main>
      <GalleryStrip variant="financing" />
      <BottomCta variant="financing" />
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
