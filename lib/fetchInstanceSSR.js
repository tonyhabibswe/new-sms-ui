import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from './auth'

/**
 * Server-side fetch utility for authenticated API calls
 * Handles JWT expiration by signing out and redirecting to login
 */
const fetchInstanceSSR = async (url, options = {}, auth = true) => {
  const session = await getServerSession(authOptions)

  // If no session exists, redirect to login immediately
  if (auth && !session?.token) {
    redirect('/login')
  }

  const token = session?.token
  const apiUrl = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL

  const fullUrl = apiUrl + url
  const defaultHeaders =
    auth && token
      ? {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      : { Accept: 'application/json', 'Content-Type': 'application/json' }

  const mergedOptions = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers
    }
  }

  const response = await fetch(fullUrl, mergedOptions)

  // Handle 401 Unauthorized (JWT token expired)
  // Redirect to custom signout endpoint that clears session without confirmation
  if (response.status === 401) {
    redirect('/api/auth/signout-ssr')
  }

  return response
}

export default fetchInstanceSSR
