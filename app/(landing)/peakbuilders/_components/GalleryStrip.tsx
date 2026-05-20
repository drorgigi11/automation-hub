import Image from 'next/image'
import { MapPin } from 'lucide-react'

interface GalleryItem {
  family: string
  location: string
  src: string
}

const ITEMS: GalleryItem[] = [
  { family: 'The Carl Family', location: 'La Jolla, San Diego', src: '/peakbuilders/gallery/carl.jpg' },
  { family: 'The Rem Family', location: 'Carmel Valley, San Diego', src: '/peakbuilders/gallery/rem.jpg' },
  { family: 'The Lanahan Family', location: 'Encinitas, San Diego', src: '/peakbuilders/gallery/lanahan.jpg' },
  { family: 'The Holeva Family', location: 'Point Loma, San Diego', src: '/peakbuilders/gallery/holeva.jpg' },
  { family: 'The Mizrachi Family', location: 'Del Mar, San Diego', src: '/peakbuilders/gallery/mizrachi.jpg' },
  { family: 'The Diaz Family', location: 'Chula Vista, San Diego', src: '/peakbuilders/gallery/diaz.jpg' },
  { family: 'The Gonzales Family', location: 'Mira Mesa, San Diego', src: '/peakbuilders/gallery/gonzales.jpg' },
  { family: 'The Weisbach Family', location: 'Rancho Bernardo, San Diego', src: '/peakbuilders/gallery/weisbach.jpg' },
  { family: 'The Sommer Family', location: 'Rancho Santa Fe, San Diego', src: '/peakbuilders/gallery/sommer.jpg' },
  { family: 'The Green Family', location: 'Carlsbad, San Diego', src: '/peakbuilders/gallery/green.jpg' },
  { family: 'The Fishbein Family', location: 'North Park, San Diego', src: '/peakbuilders/gallery/fishbein.jpg' },
  { family: 'The Castillo Family', location: 'Scripps Ranch, San Diego', src: '/peakbuilders/gallery/castillo.jpg' },
  { family: 'The Barry Family', location: 'Solana Beach, San Diego', src: '/peakbuilders/gallery/barry.jpg' },
  { family: 'The Rendone Family', location: 'Poway, San Diego', src: '/peakbuilders/gallery/rendone.jpg' },
  { family: 'The Betts Family', location: 'Coronado, San Diego', src: '/peakbuilders/gallery/betts.jpg' },
  { family: 'The Levy Family', location: 'Pacific Beach, San Diego', src: '/peakbuilders/gallery/levy.jpg' },
  { family: 'The Dang Family', location: 'Mission Hills, San Diego', src: '/peakbuilders/gallery/dang.jpg' },
  { family: 'The Nguyen Family', location: 'Escondido, San Diego', src: '/peakbuilders/gallery/nguyen.jpg' },
  { family: 'The Gray Family', location: 'Tierrasanta, San Diego', src: '/peakbuilders/gallery/gray.jpg' },
  { family: 'The Rowe Family', location: 'Bonita, San Diego', src: '/peakbuilders/gallery/rowe.jpg' },
  { family: 'The Saake Family', location: 'Ocean Beach, San Diego', src: '/peakbuilders/gallery/saake.jpg' },
  { family: 'The Hodges Family', location: 'Solana Beach, San Diego', src: '/peakbuilders/gallery/hodges.jpg' },
  { family: 'The Ferrari Family', location: 'Hillcrest, San Diego', src: '/peakbuilders/gallery/ferrari.jpg' },
  { family: 'The Kitchen Family', location: 'El Cajon, San Diego', src: '/peakbuilders/gallery/kitchen.jpg' },
]

const LOOP = [...ITEMS, ...ITEMS]

export default function GalleryStrip() {
  return (
    <section style={{
      width: '100%',
      padding: '36px 0 28px',
      borderTop: '1px solid var(--pb-divider)',
      borderBottom: '1px solid var(--pb-divider)',
      background: 'var(--pb-bg-soft)',
    }}>
      <style>{`
        @keyframes pbMarquee {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        .pb-marquee {
          display: flex;
          gap: 14px;
          width: max-content;
          animation: pbMarquee 70s linear infinite;
        }
        .pb-marquee:hover { animation-play-state: paused; }
        .pb-marquee-mask {
          mask-image: linear-gradient(to right, transparent, #000 5%, #000 95%, transparent);
          -webkit-mask-image: linear-gradient(to right, transparent, #000 5%, #000 95%, transparent);
        }
        @media (max-width: 640px) {
          .pb-marquee { animation-duration: 50s; }
        }
      `}</style>
      <div style={{ textAlign: 'center', marginBottom: 24, padding: '0 1rem' }}>
        <p style={{
          fontSize: 11,
          letterSpacing: '0.18em',
          textTransform: 'uppercase',
          color: 'var(--pb-gold-dark)',
          fontWeight: 700,
          marginBottom: 8,
        }}>
          Recent Projects
        </p>
        <h2 className="pb-serif" style={{
          fontSize: 'clamp(1.4rem, 3.5vw, 1.8rem)',
          fontWeight: 700,
          color: 'var(--pb-card-fg)',
          margin: 0,
          lineHeight: 1.2,
        }}>
          2,100+ Roofs Completed Across San Diego
        </h2>
      </div>

      <div className="pb-marquee-mask" style={{ overflow: 'hidden' }}>
        <div className="pb-marquee">
          {LOOP.map((item, i) => (
            <GalleryCard key={`${item.family}-${i}`} item={item} priority={i < 4} />
          ))}
        </div>
      </div>
    </section>
  )
}

function GalleryCard({ item, priority }: { item: GalleryItem; priority: boolean }) {
  return (
    <div style={{
      flex: '0 0 auto',
      width: 260,
      borderRadius: 12,
      overflow: 'hidden',
      background: 'var(--pb-card)',
      border: '1px solid var(--pb-divider)',
      boxShadow: '0 6px 20px rgba(10,31,61,0.08)',
      position: 'relative',
    }}>
      <div style={{ position: 'relative', width: 260, height: 175, background: '#e5e7eb' }}>
        <Image
          src={item.src}
          alt={`Roof project — ${item.family}`}
          fill
          sizes="260px"
          style={{ objectFit: 'cover' }}
          priority={priority}
        />
      </div>
      <div style={{ padding: '12px 14px 14px' }}>
        <div style={{
          fontSize: 14,
          fontWeight: 600,
          color: 'var(--pb-card-fg)',
          marginBottom: 4,
          lineHeight: 1.3,
        }}>
          {item.family}
        </div>
        <div style={{
          fontSize: 12,
          color: 'var(--pb-muted-fg)',
          display: 'flex',
          alignItems: 'center',
          gap: 4,
        }}>
          <MapPin size={11} color="var(--pb-gold-dark)" />
          {item.location}
        </div>
      </div>
    </div>
  )
}
