// middleware.ts (or middleware.js)
import { NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'

const AUTH_PAGES = ['/login']
const SEMESTER_LIST = '/admin/semesters/list'

export async function middleware(req) {
  const url = new URL(req.url)
  const pathname = url.pathname

  // Get the NextAuth token (returns null if not authenticated or expired)
  const token = await getToken({ req: req })

  const isAuthenticated = !!token
  const isAuthPage = AUTH_PAGES.includes(pathname)
  const isProtected = pathname.startsWith('/admin')

  // 1) Block protected routes if not authenticated
  if (!isAuthenticated && isProtected) {
    const loginUrl = new URL('/login', url.origin)
    // Preserve where the user wanted to go
    loginUrl.searchParams.set('callbackUrl', pathname + url.search)
    return NextResponse.redirect(loginUrl)
  }

  // 2) If already logged in and visiting an auth page, go to dashboard
  if (isAuthenticated && isAuthPage) {
    const dashUrl = new URL(SEMESTER_LIST, url.origin)
    return NextResponse.redirect(dashUrl)
  }

  // 3) Otherwise, continue
  return NextResponse.next()
}

// Run middleware on the routes we care about:
export const config = {
  matcher: ['/admin/:path*', '/login']
}
