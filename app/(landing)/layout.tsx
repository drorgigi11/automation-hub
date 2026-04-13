import type { Metadata } from 'next'
import Script from 'next/script'

export const metadata: Metadata = {
  title: 'Renovision Design and Build',
  description: 'Free Design Consultation & Estimate',
}

export default function LandingLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* Facebook Pixel */}
      <Script id="fb-pixel" strategy="afterInteractive">{`
        !function(f,b,e,v,n,t,s)
        {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
        n.callMethod.apply(n,arguments):n.queue.push(arguments)};
        if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
        n.queue=[];t=b.createElement(e);t.async=!0;
        t.src=v;s=b.getElementsByTagName(e)[0];
        s.parentNode.insertBefore(t,s)}(window, document,'script',
        'https://connect.facebook.net/en_US/fbevents.js');
        fbq('init', '626988439937509');
        fbq('track', 'PageView');
      `}</Script>
      {/* eslint-disable-next-line @next/next/no-page-custom-font */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap" rel="stylesheet" />
    <div className="renovision-theme">
      <style>{`
        * { font-family: 'Poppins', system-ui, sans-serif !important; }
        .renovision-theme {
          --rv-bg: hsl(30, 20%, 98%);
          --rv-card: hsl(165, 45%, 25%);
          --rv-card-fg: #ffffff;
          --rv-primary: hsl(40, 80%, 50%);
          --rv-primary-fg: hsl(220, 20%, 15%);
          --rv-muted-fg: rgba(255,255,255,0.6);
          --rv-input-bg: hsl(165, 30%, 35%);
          --rv-input-border: hsl(165, 30%, 40%);
          --rv-destructive: hsl(0, 84%, 60%);
          font-family: 'Poppins', system-ui, sans-serif;
          background: var(--rv-bg);
          min-height: 100vh;
        }
        .rv-slide-up { animation: rvSlideUp 0.5s cubic-bezier(0.4,0,0.2,1) forwards; }
        .rv-slide-down { animation: rvSlideDown 0.5s cubic-bezier(0.4,0,0.2,1) forwards; }
        .rv-fade-in { animation: rvFadeIn 0.4s ease-out forwards; }
        @keyframes rvSlideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes rvSlideDown {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes rvFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .rv-btn-form {
          display: flex; width: 100%; align-items: center; justify-content: space-between;
          padding: 16px 20px; border-radius: 8px; border: none; cursor: pointer;
          background: rgba(255,255,255,0.1); color: #fff; font-size: 15px; font-weight: 500;
          transition: background 0.2s; text-align: left;
        }
        .rv-btn-form:hover { background: rgba(255,255,255,0.18); }
        .rv-btn-selected {
          background: var(--rv-primary) !important; color: var(--rv-primary-fg) !important;
        }
        .rv-btn-cta {
          display: flex; width: 100%; align-items: center; justify-content: center;
          padding: 16px 20px; border-radius: 8px; border: none; cursor: pointer;
          background: var(--rv-primary); color: var(--rv-primary-fg);
          font-size: 16px; font-weight: 600; transition: opacity 0.2s; gap: 8px;
        }
        .rv-btn-cta:hover { opacity: 0.9; }
        .rv-btn-cta:disabled { opacity: 0.6; cursor: not-allowed; }
        .rv-input {
          width: 100%; padding: 14px 16px; border-radius: 8px;
          background: var(--rv-input-bg); border: 1px solid var(--rv-input-border);
          color: #fff; font-size: 16px; outline: none;
        }
        .rv-input::placeholder { color: rgba(255,255,255,0.5); }
        .rv-input:focus { border-color: var(--rv-primary); }
        .rv-input-error { border-color: var(--rv-destructive) !important; }
      `}</style>
      {children}
    </div>
    </>
  )
}
