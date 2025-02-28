import { getToken } from 'next-auth/jwt'
import { NextResponse } from 'next/server'
import jwt from "jsonwebtoken"

// This is the secret used to encrypt your JWT. Ensure this is synced with your NextAuth config.
const secret = process.env.NEXTAUTH_SECRET

export async function middleware(req) {
  const token = await getToken({ req, secret })
  // Your protected paths can be more dynamic depending on your application's needs.
  const protectedPaths = ['/admin']
  const url = req.nextUrl.clone()
  if (!!token?.data?.token && !!jwt.decode(token.data.token)?.exp && jwt.decode(token.data.token).exp * 1000 < Date.now()) {
    console.log("Iam insidee now")
      url.pathname = '/login' // Modify to your sign-in route if needed
      const response = NextResponse.redirect(url)
      response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
      response.cookies.delete('next-auth.session-token')
      response.cookies.delete('next-auth.csrf-token')
      response.cookies.delete('next-auth.callback-url')
      return response
  }
  if (!!token && req.nextUrl.pathname == '/login') {
    
    url.pathname ='/login'
    const response = NextResponse.redirect(url)
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');

    return NextResponse.redirect(url)
  }
  if (
    protectedPaths.some((path) => req.nextUrl.pathname.startsWith(path)) &&
    !token
  ) {
    // Check if the current path is a protected path and if the user doesn't have a valid session.
    url.pathname = `/login` // Modify to your sign-in route if needed
    url.searchParams.set('redirect', req.nextUrl.pathname)
    return NextResponse.redirect(url)
  }

  const response = NextResponse.next();
  response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');

  // For all other requests, allow them to continue.
  return response
}
