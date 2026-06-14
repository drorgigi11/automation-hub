import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Peak Builders Denver — Free Basement Design Consultation',
  description:
    'Need more space at home? Your unfinished basement may be the answer. Answer a few quick questions to request a free basement design consultation with Peak Builders Denver.',
}

export default function PeakBuildersDenverLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/*
        Tracking pixels (Meta Pixel / Clarity) intentionally omitted for now —
        drop the Denver-specific pixel + Clarity <Script> tags in when ready.
      */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link
        href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap"
        rel="stylesheet"
      />
      <div className="pb-theme">
        <style>{`
          .pb-theme {
            --pb-bg: #F7F3EC;
            --pb-bg-soft: #EFE9DD;
            --pb-charcoal: #1E2127;
            --pb-charcoal-2: #14161A;
            --pb-card: #ffffff;
            --pb-card-fg: #1E2127;
            --pb-body-fg: #44474E;
            --pb-primary: #F2B705;
            --pb-primary-hover: #DBA300;
            --pb-primary-fg: #1E2127;
            --pb-muted-fg: #6E7178;
            --pb-input-bg: #ffffff;
            --pb-input-border: #E3DCCD;
            --pb-input-border-focus: #F2B705;
            --pb-destructive: #dc2626;
            --pb-divider: #E7E0D3;
            --pb-gold: #F2B705;
            --pb-gold-soft: #FFF6DB;
            font-family: 'Inter', system-ui, sans-serif;
            background: var(--pb-bg);
            min-height: 100vh;
            color: var(--pb-card-fg);
            -webkit-font-smoothing: antialiased;
            overflow-x: hidden;
          }
          .pb-theme * { font-family: 'Inter', system-ui, sans-serif; box-sizing: border-box; }
          .pb-theme img { max-width: 100%; }
          .pbd-headline, .pbd-sub, .pbd-eyebrow { overflow-wrap: break-word; }

          /* ---------- animations ---------- */
          .pb-slide-up { animation: pbSlideUp 0.45s cubic-bezier(0.4,0,0.2,1) forwards; }
          .pb-fade-in { animation: pbFadeIn 0.5s ease-out forwards; }
          @keyframes pbSlideUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
          @keyframes pbFadeIn { from { opacity: 0; } to { opacity: 1; } }
          @keyframes pbSpin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }

          /* ---------- hero ---------- */
          .pbd-hero {
            position: relative;
            background: var(--pb-charcoal);
            overflow: hidden;
          }
          .pbd-hero-bg {
            position: absolute; inset: 0;
            background-image: url('/denver_basements/basement-hero.jpg');
            background-size: cover; background-position: center;
            transform: scale(1.04);
          }
          .pbd-hero-overlay {
            position: absolute; inset: 0;
            background:
              linear-gradient(110deg, rgba(20,22,26,0.96) 0%, rgba(20,22,26,0.88) 38%, rgba(20,22,26,0.55) 70%, rgba(20,22,26,0.40) 100%);
          }
          @media (max-width: 919px) {
            .pbd-hero-overlay {
              background: linear-gradient(180deg, rgba(20,22,26,0.86) 0%, rgba(20,22,26,0.78) 45%, rgba(20,22,26,0.90) 100%);
            }
          }
          .pbd-hero-inner {
            position: relative;
            max-width: 1120px; margin: 0 auto;
            padding: clamp(1.4rem, 4vw, 3.2rem) clamp(1rem, 4vw, 2.5rem) clamp(1.8rem, 4vw, 3.2rem);
            display: grid; grid-template-columns: 1fr; gap: clamp(1.2rem, 3vw, 2.6rem);
            align-items: center;
          }
          .pbd-hero-inner > * { min-width: 0; }
          @media (min-width: 920px) {
            .pbd-hero-inner { grid-template-columns: minmax(0,1.02fr) minmax(0,0.98fr); gap: 3rem; }
          }

          .pbd-eyebrow {
            display: inline-flex; align-items: center; gap: 8px;
            font-size: 12px; font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase;
            color: var(--pb-gold); margin-bottom: 14px;
          }
          .pbd-eyebrow::before { content: ''; width: 22px; height: 2px; background: var(--pb-gold); display: inline-block; }
          .pbd-headline {
            font-size: clamp(2.1rem, 6.4vw, 3.4rem);
            font-weight: 900; line-height: 1.04; letter-spacing: -0.02em;
            color: #ffffff; margin: 0 0 14px;
          }
          .pbd-headline .pbd-accent { color: var(--pb-gold); }
          .pbd-sub {
            font-size: clamp(1rem, 2.4vw, 1.18rem); line-height: 1.55;
            color: #D9DadE; margin: 0 0 16px; max-width: min(30em, 100%);
          }
          .pbd-support {
            font-size: 13.5px; line-height: 1.5; color: #AEB1B8; max-width: min(30em, 100%);
          }
          .pbd-trust-points { display: none; }
          @media (min-width: 920px) {
            .pbd-trust-points { display: flex; flex-direction: column; gap: 11px; margin-top: 24px; }
          }
          .pbd-tp { display: flex; align-items: center; gap: 11px; color: #E8E9EC; font-size: 14.5px; font-weight: 500; }
          .pbd-tp-check {
            flex-shrink: 0; width: 22px; height: 22px; border-radius: 50%;
            background: var(--pb-gold); color: var(--pb-charcoal);
            display: flex; align-items: center; justify-content: center;
          }

          /* ---------- quiz card ---------- */
          .pbd-card {
            background: var(--pb-card);
            border-radius: 18px;
            padding: clamp(1.4rem, 4vw, 2rem);
            border: 1px solid rgba(255,255,255,0.6);
            box-shadow: 0 30px 60px rgba(0,0,0,0.34), 0 8px 20px rgba(0,0,0,0.20);
            border-top: 4px solid var(--pb-gold);
          }
          .pbd-card-kicker {
            font-size: 12px; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase;
            color: var(--pb-muted-fg); margin-bottom: 14px; display: flex; align-items: center; gap: 7px;
          }

          /* ---------- progress bar ---------- */
          .pbd-progress { display: flex; gap: 6px; margin-bottom: 22px; }
          .pbd-progress-seg {
            height: 6px; flex: 1; border-radius: 9999px; background: #ECE6DA;
            overflow: hidden; transition: background 0.4s;
          }
          .pbd-progress-seg.is-done { background: var(--pb-gold); }

          /* ---------- option / input buttons ---------- */
          .pb-btn-form {
            display: flex; width: 100%; align-items: center; justify-content: space-between;
            padding: 17px 20px; border-radius: 12px;
            border: 1.5px solid var(--pb-input-border);
            cursor: pointer; background: #ffffff;
            color: var(--pb-card-fg); font-size: 15.5px; font-weight: 600;
            transition: transform 0.15s, border-color 0.15s, background 0.15s, box-shadow 0.15s; text-align: left;
          }
          .pb-btn-form:hover {
            border-color: var(--pb-gold);
            background: var(--pb-gold-soft);
            box-shadow: 0 6px 18px rgba(242,183,5,0.28);
            transform: translateY(-2px);
          }
          .pb-btn-form:active { transform: translateY(0); }
          .pb-btn-selected {
            background: var(--pb-gold) !important;
            color: var(--pb-charcoal) !important;
            border-color: var(--pb-gold) !important;
            box-shadow: 0 6px 18px rgba(242,183,5,0.40) !important;
          }
          .pb-btn-cta {
            display: flex; width: 100%; align-items: center; justify-content: center;
            padding: 17px 22px; border-radius: 12px; border: none; cursor: pointer;
            background: var(--pb-primary); color: var(--pb-primary-fg);
            font-size: 16px; font-weight: 800; transition: all 0.18s; gap: 9px;
            letter-spacing: 0.005em;
            box-shadow: 0 8px 22px rgba(242,183,5,0.45);
          }
          .pb-btn-cta:hover { background: var(--pb-primary-hover); transform: translateY(-2px); box-shadow: 0 12px 28px rgba(242,183,5,0.55); }
          .pb-btn-cta:disabled { opacity: 0.55; cursor: not-allowed; transform: none; }

          /* ---------- inputs ---------- */
          .pb-input {
            width: 100%; padding: 16px 18px; border-radius: 12px;
            background: var(--pb-input-bg); border: 1.5px solid var(--pb-input-border);
            color: var(--pb-card-fg); font-size: 16px; outline: none;
            transition: border-color 0.2s, box-shadow 0.2s;
          }
          .pb-input::placeholder { color: #A8A39A; }
          .pb-input:focus { border-color: var(--pb-input-border-focus); box-shadow: 0 0 0 3px rgba(242,183,5,0.22); }
          .pb-input-error { border-color: var(--pb-destructive) !important; }
          .pb-why {
            font-size: 13px; color: var(--pb-muted-fg); line-height: 1.5;
            background: var(--pb-bg-soft); border: 1px solid var(--pb-divider);
            border-radius: 10px; padding: 12px 14px; margin-bottom: 18px;
          }
          .pb-why b { color: var(--pb-card-fg); font-weight: 600; }

          /* ---------- trust badges section ---------- */
          .pbd-badges {
            max-width: 1120px; margin: 0 auto;
            padding: clamp(1.6rem, 4vw, 2.4rem) clamp(1rem, 4vw, 2.5rem) 0;
            display: grid; grid-template-columns: minmax(0,1fr); gap: 12px;
          }
          @media (min-width: 720px) { .pbd-badges { grid-template-columns: repeat(3, minmax(0,1fr)); gap: 16px; } }
          .pbd-badge-card {
            min-width: 0;
            display: flex; align-items: center; gap: 13px;
            background: var(--pb-card); border: 1px solid var(--pb-divider);
            border-radius: 14px; padding: 15px 16px;
            box-shadow: 0 8px 22px rgba(30,33,39,0.06);
          }
          .pbd-badge-ic {
            flex-shrink: 0; width: 42px; height: 42px; border-radius: 50%;
            background: var(--pb-gold); color: var(--pb-charcoal);
            display: flex; align-items: center; justify-content: center;
            box-shadow: 0 4px 12px rgba(242,183,5,0.45);
          }
          .pbd-badge-title { font-size: 14px; font-weight: 800; color: var(--pb-card-fg); line-height: 1.2; margin-bottom: 3px; }
          .pbd-badge-sub { font-size: 12.5px; color: var(--pb-muted-fg); line-height: 1.35; }

          /* ---------- before / after ---------- */
          .pbd-ba-wrap { max-width: 1120px; margin: 0 auto; padding: clamp(1.6rem, 4vw, 2.6rem) clamp(1rem, 4vw, 2.5rem) clamp(1.8rem,4vw,3rem); }
          .pbd-ba-card {
            background: var(--pb-card); border: 1px solid var(--pb-divider);
            border-radius: 18px; padding: clamp(1.2rem, 3vw, 1.8rem);
            box-shadow: 0 16px 40px rgba(30,33,39,0.08);
          }
          .pbd-ba-head { text-align: center; margin-bottom: 18px; }
          .pbd-ba-title { font-size: clamp(1.3rem, 3.4vw, 1.7rem); font-weight: 900; letter-spacing: -0.01em; color: var(--pb-card-fg); margin: 0 0 6px; }
          .pbd-ba-titleq { color: var(--pb-gold); }
          .pbd-ba-sub { font-size: 14px; color: var(--pb-muted-fg); margin: 0; }
          .pbd-ba-grid { display: grid; grid-template-columns: minmax(0,1fr) minmax(0,1fr); gap: 12px; align-items: stretch; }
          @media (min-width: 560px) { .pbd-ba-grid { gap: 18px; } }
          .pbd-ba-item { position: relative; min-width: 0; }
          .pbd-ba-img {
            width: 100%; aspect-ratio: 4 / 3; object-fit: cover;
            border-radius: 12px; display: block; border: 1px solid var(--pb-divider);
          }
          .pbd-ba-tag {
            position: absolute; top: 10px; left: 10px;
            font-size: 11px; font-weight: 800; letter-spacing: 0.08em; text-transform: uppercase;
            padding: 5px 10px; border-radius: 7px;
          }
          .pbd-ba-tag.before { background: rgba(20,22,26,0.82); color: #fff; }
          .pbd-ba-tag.after { background: var(--pb-gold); color: var(--pb-charcoal); }
          .pbd-ba-cap { text-align: center; font-size: 13px; font-weight: 600; color: var(--pb-body-fg); margin-top: 9px; }
        `}</style>
        {children}
      </div>
    </>
  )
}
