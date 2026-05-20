import Image from 'next/image'

export default function Header() {
  return (
    <header style={{
      position: 'relative',
      width: '100%',
      padding: '24px',
      minHeight: 120,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
      isolation: 'isolate',
      boxShadow: '0 4px 18px rgba(10,31,61,0.10)',
    }}>
      <Image
        src="/peakbuilders/header-bg.jpg"
        alt=""
        fill
        priority
        sizes="100vw"
        style={{
          objectFit: 'cover',
          objectPosition: 'center',
          zIndex: -2,
        }}
      />
      <div
        aria-hidden
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(180deg, rgba(0,0,0,0.55) 0%, rgba(10,31,61,0.55) 100%)',
          zIndex: -1,
        }}
      />
      <div style={{ position: 'relative', maxWidth: 1200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
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
