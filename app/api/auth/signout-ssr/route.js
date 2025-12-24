import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET(request) {
  const session = await getServerSession(authOptions)

  if (session) {
    // Clear NextAuth cookies
    const cookieStore = cookies()
    const cookieNames = [
      'next-auth.session-token',
      '__Secure-next-auth.session-token',
      'next-auth.csrf-token',
      '__Host-next-auth.csrf-token',
      'next-auth.callback-url',
      '__Secure-next-auth.callback-url'
    ]

    cookieNames.forEach((name) => {
      try {
        cookieStore.delete(name)
      } catch (e) {
        // Cookie might not exist
      }
    })
  }

  // Redirect to login
  const url = new URL('/login', request.url)
  return NextResponse.redirect(url)
}
