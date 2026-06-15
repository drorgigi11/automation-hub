import { NextRequest, NextResponse } from 'next/server'
import { verifySessionToken } from '@/lib/auth'

// Public paths that don't require auth
const PUBLIC_PATHS = [
  '/login',
  '/api/auth/login',
  '/api/auth/logout',
  '/api/webhooks',
  '/api/peakbuilders',
  '/api/denver_basements',
  '/api/capi-event',
  '/api/debug-sheets',
  '/api/admin',
  '/api/cron',
  '/kitchen',
  '/outdoor',
  '/general',
  '/bathroomstyle',
  '/renovision',
  '/peakbuilders',
  '/denver_basements',
  '/thank-you',
  '/privacy',
]

// Custom-domain → app-path mapping. The host serves the app section as if it
// were the root, so peak-builders.net/ renders /peakbuilders, peak-builders.net/thank-you
// renders /peakbuilders/thank-you, etc.
const CUSTOM_DOMAINS: Record<string, string> = {
  'peak-builders.net': '/peakbuilders',
  'www.peak-builders.net': '/peakbuilders',
  'go.renovisiondesignandbuild.com': '/renovision',
  'www.go.renovisiondesignandbuild.com': '/renovision',
}

function isPublic(pathname: string): boolean {
  return PUBLIC_PATHS.some((p) => pathname === p || pathname.startsWith(p + '/') || pathname.startsWith(p + '?'))
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl
  const hostname = req.headers.get('host')?.toLowerCase().split(':')[0] ?? ''

  // Custom-domain rewrite: serve the mapped section as if it were the root.
  const mountPath = CUSTOM_DOMAINS[hostname]
  if (mountPath && !pathname.startsWith(mountPath)
      && !pathname.startsWith('/denver_basements')
      && !pathname.startsWith('/_next')
      && !pathname.startsWith('/api')
      && !pathname.includes('.')) {
    const url = req.nextUrl.clone()
    url.pathname = pathname === '/' ? mountPath : `${mountPath}${pathname}`
    return NextResponse.rewrite(url)
  }

  if (isPublic(pathname)) return NextResponse.next()

  // Allow static files and Next.js internals
  if (pathname.startsWith('/_next') || pathname.startsWith('/fonts') || pathname.includes('.')) {
    return NextResponse.next()
  }

  const token = req.cookies.get('session')?.value
  if (token && await verifySessionToken(token)) {
    return NextResponse.next()
  }

  const loginUrl = req.nextUrl.clone()
  loginUrl.pathname = '/login'
  return NextResponse.redirect(loginUrl)
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
