import { NextRequest, NextResponse } from 'next/server'
import { verifySessionToken } from '@/lib/auth'

// Public paths that don't require auth
const PUBLIC_PATHS = [
  '/login',
  '/api/auth/login',
  '/api/auth/logout',
  '/api/webhooks',
  '/api/capi-event',
  '/api/debug-sheets',
  '/api/admin',
  '/api/cron',
  '/kitchen',
  '/outdoor',
  '/general',
  '/renovision',
  '/thank-you',
  '/privacy',
]

function isPublic(pathname: string): boolean {
  return PUBLIC_PATHS.some((p) => pathname === p || pathname.startsWith(p + '/') || pathname.startsWith(p + '?'))
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

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
