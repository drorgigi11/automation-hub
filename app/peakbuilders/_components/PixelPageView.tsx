'use client'

import { useEffect } from 'react'

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void
  }
}

function readCookie(name: string): string | undefined {
  const match = document.cookie.match(new RegExp('(?:^|; )' + name + '=([^;]*)'))
  return match ? decodeURIComponent(match[1]) : undefined
}

/**
 * Fires a deduplicated Meta PageView from both the browser pixel and the server (CAPI).
 *
 * Both events share the same `eventID`, so Meta merges them into one view. The server beacon
 * (/api/peakbuilders/pageview) counts visitors whose browser blocks the pixel — closing the
 * ad-clicks vs landing-page-views gap. Mounted once in the Peak Builders layout.
 */
export default function PixelPageView() {
  useEffect(() => {
    const eventId =
      typeof crypto !== 'undefined' && crypto.randomUUID
        ? crypto.randomUUID()
        : String(Math.random()).slice(2)

    const fbp = readCookie('_fbp')
    const fbc = readCookie('_fbc')
    const fbclid = new URLSearchParams(window.location.search).get('fbclid') ?? undefined
    const url = window.location.href

    // Browser pixel — share the eventID so Meta can dedup against the server event.
    if (typeof window.fbq === 'function') {
      window.fbq('track', 'PageView', {}, { eventID: eventId })
    }

    // Server beacon — survives navigation thanks to keepalive; never blocks the page.
    fetch('/api/peakbuilders/pageview', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      keepalive: true,
      body: JSON.stringify({ eventId, fbp, fbc, fbclid, url }),
    }).catch(() => {})
  }, [])

  return null
}
