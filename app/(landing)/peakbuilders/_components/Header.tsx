import Image from 'next/image'

export default function Header() {
  return (
    <header style={{
      width: '100%',
      padding: '20px 24px',
      background: 'var(--pb-header-bg)',
      boxShadow: '0 4px 18px rgba(10,31,61,0.10)',
    }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Image
          src="/peakbuilders/logo.png"
          alt="Peak Builders & Roofers of San Diego"
          width={280}
          height={72}
          priority
          style={{ height: 56, width: 'auto', maxWidth: '85vw' }}
        />
      </div>
    </header>
  )
}
