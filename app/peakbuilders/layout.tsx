import type { Metadata } from 'next'
import Script from 'next/script'

export const metadata: Metadata = {
  title: 'Peak Builders & Roofers — Free Roof Estimate & Consultation',
  description: 'Get your free roofing consultation in San Diego. 2,100+ roofs completed. $0 down financing available.',
}

export default function PeakBuildersLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* Meta Pixel */}
      <Script id="fb-pixel-peakbuilders" strategy="afterInteractive">{`
        !function(f,b,e,v,n,t,s)
        {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
        n.callMethod.apply(n,arguments):n.queue.push(arguments)};
        if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
        n.queue=[];t=b.createElement(e);t.async=!0;
        t.src=v;s=b.getElementsByTagName(e)[0];
        s.parentNode.insertBefore(t,s)}(window, document,'script',
        'https://connect.facebook.net/en_US/fbevents.js');
        fbq('init', '1168941604681692');
        fbq('track', 'PageView');
      `}</Script>
      {/* Microsoft Clarity */}
      <Script id="ms-clarity-peakbuilders" strategy="afterInteractive">{`
        (function(c,l,a,r,i,t,y){
            c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
            t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
            y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
        })(window, document, "clarity", "script", "wxkqvpec9t");
      `}</Script>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link
        href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Playfair+Display:wght@600;700;800&display=swap"
        rel="stylesheet"
      />
      <div className="pb-theme">
        <style>{`
          .pb-theme {
            --pb-bg: #ffffff;
            --pb-bg-soft: #f1f5f9;
            --pb-card: #ffffff;
            --pb-card-fg: #0A1F3D;
            --pb-body-fg: #334155;
            --pb-primary: #15803d;
            --pb-primary-hover: #166534;
            --pb-primary-fg: #ffffff;
            --pb-muted-fg: #64748b;
            --pb-input-bg: #ffffff;
            --pb-input-border: #e2e8f0;
            --pb-input-border-focus: #15803d;
            --pb-destructive: #dc2626;
            --pb-divider: #e2e8f0;
            --pb-header-bg: #000000;
            --pb-gold-dark: #8a6d09;
            font-family: 'Inter', system-ui, sans-serif;
            background: var(--pb-bg);
            min-height: 100vh;
            color: var(--pb-card-fg);
          }
          .pb-theme * { font-family: 'Inter', system-ui, sans-serif; }
          .pb-theme .pb-heading,
          .pb-theme h1, .pb-theme h2.pb-serif {
            font-family: 'Playfair Display', Georgia, serif;
            letter-spacing: -0.01em;
          }
          .pb-slide-up { animation: pbSlideUp 0.45s cubic-bezier(0.4,0,0.2,1) forwards; }
          .pb-fade-in { animation: pbFadeIn 0.4s ease-out forwards; }
          @keyframes pbSlideUp {
            from { opacity: 0; transform: translateY(16px); }
            to { opacity: 1; transform: translateY(0); }
          }
          @keyframes pbFadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          @keyframes pbSpin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          .pb-btn-form {
            display: flex; width: 100%; align-items: center; justify-content: space-between;
            padding: 18px 22px; border-radius: 10px;
            border: 1.5px solid var(--pb-input-border);
            cursor: pointer;
            background: #ffffff;
            color: var(--pb-card-fg); font-size: 15px; font-weight: 500;
            transition: all 0.2s; text-align: left;
          }
          .pb-btn-form:hover {
            border-color: var(--pb-primary);
            background: #f6fbf7;
            box-shadow: 0 2px 12px rgba(21,128,61,0.18);
          }
          .pb-btn-selected {
            background: var(--pb-primary) !important;
            color: var(--pb-primary-fg) !important;
            border-color: var(--pb-primary) !important;
            font-weight: 600 !important;
          }
          .pb-btn-cta {
            display: flex; width: 100%; align-items: center; justify-content: center;
            padding: 16px 22px; border-radius: 10px; border: none; cursor: pointer;
            background: var(--pb-primary); color: var(--pb-primary-fg);
            font-size: 16px; font-weight: 700; transition: all 0.2s; gap: 8px;
            letter-spacing: 0.01em;
            box-shadow: 0 4px 16px rgba(21,128,61,0.40);
          }
          .pb-btn-cta:hover {
            background: var(--pb-primary-hover);
            transform: translateY(-1px);
            box-shadow: 0 8px 22px rgba(21,128,61,0.50);
          }
          .pb-btn-cta:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }
          .pb-input {
            width: 100%; padding: 16px 18px; border-radius: 10px;
            background: var(--pb-input-bg); border: 1.5px solid var(--pb-input-border);
            color: var(--pb-card-fg); font-size: 16px; outline: none;
            transition: border-color 0.2s, box-shadow 0.2s;
          }
          .pb-input::placeholder { color: #94a3b8; }
          .pb-input:focus {
            border-color: var(--pb-input-border-focus);
            box-shadow: 0 0 0 3px rgba(21,128,61,0.18);
          }
          .pb-input-error { border-color: var(--pb-destructive) !important; }
          .pb-badge {
            display: flex; align-items: flex-start; gap: 12px;
            padding: 14px 16px; border-radius: 10px;
            background: var(--pb-bg-soft);
            border: 1px solid var(--pb-divider);
          }
          .pb-badge-icon {
            flex-shrink: 0; width: 28px; height: 28px; border-radius: 50%;
            background: rgba(10,31,61,0.08);
            color: var(--pb-card-fg);
            display: flex; align-items: center; justify-content: center;
            margin-top: 2px;
          }
          .pb-badge-title { font-size: 13px; font-weight: 600; color: var(--pb-card-fg); margin-bottom: 2px; line-height: 1.3; }
          .pb-badge-sub { font-size: 12px; color: var(--pb-muted-fg); line-height: 1.4; }
        `}</style>
        {children}
      </div>
    </>
  )
}
