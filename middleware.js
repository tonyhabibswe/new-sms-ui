import { getToken } from 'next-auth/jwt'
import { NextResponse } from 'next/server'

// This is the secret used to encrypt your JWT. Ensure this is synced with your NextAuth config.
const secret = process.env.NEXTAUTH_SECRET

export async function middleware(req) {
  const token = await getToken({ req, secret })
  // Your protected paths can be more dynamic depending on your application's needs.
  const protectedPaths = ['/admin']
  if (!!token && req.nextUrl.pathname == '/login') {
    const url = req.nextUrl.clone()
    url.pathname = '/admin/semesters/list' // Modify to your sign-in route if needed
    return NextResponse.redirect(url)
  }
  if (
    protectedPaths.some((path) => req.nextUrl.pathname.startsWith(path)) &&
    !token
  ) {
    // Check if the current path is a protected path and if the user doesn't have a valid session.
    const url = req.nextUrl.clone()
    url.pathname = `/login` // Modify to your sign-in route if needed
    url.searchParams.set('redirect', req.nextUrl.pathname)
    return NextResponse.redirect(url)
  }

  // For all other requests, allow them to continue.
  return NextResponse.next()
}
