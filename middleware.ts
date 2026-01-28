import { NextRequest, NextResponse } from 'next/server'

// Simple rate limiting using a Map (in production, use Redis or similar)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>()
const WINDOW_MS = 60 * 1000 // 1 minute
const MAX_REQUESTS = 100 // Max requests per minute per IP

export function middleware(request: NextRequest) {
  const ip = request.ip || request.headers.get('x-forwarded-for') || 'unknown'
  const now = Date.now()
  const windowKey = Math.floor(now / WINDOW_MS)

  const key = `${ip}-${windowKey}`
  const current = rateLimitMap.get(key) || { count: 0, resetTime: now + WINDOW_MS }

  if (current.count >= MAX_REQUESTS) {
    return new NextResponse('Too many requests', { status: 429 })
  }

  current.count++
  rateLimitMap.set(key, current)

  // Clean up old entries
  for (const [k, v] of rateLimitMap.entries()) {
    if (v.resetTime < now) {
      rateLimitMap.delete(k)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}