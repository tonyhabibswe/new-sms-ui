import { useSession, signOut } from 'next-auth/react'
import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useToast } from '@/components/ui/use-toast'

// Custom hook for fetching data from an API
function useFetchApi() {
  const [data, setData] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const { data: session, status } = useSession()
  const router = useRouter()
  const { toast } = useToast()
  const isLoggingOut = useRef(false)

  useEffect(() => {}, [session])

  /**
   * Handle 401 Unauthorized responses (JWT token expired)
   * Redirects user to login page and clears session
   */
  const handleUnauthorized = async () => {
    // Prevent duplicate logout attempts
    if (isLoggingOut.current) {
      return
    }

    isLoggingOut.current = true

    try {
      // Show notification
      toast({
        variant: 'destructive',
        title: 'Session Expired',
        description: 'Your session has expired. Please log in again.'
      })

      // Sign out without NextAuth's default redirect
      await signOut({ redirect: false })

      // Redirect to login page (replace history to prevent back navigation)
      router.replace('/login')
    } catch (err) {
      console.error('Logout error:', err)
      // Still redirect even if signOut fails
      router.replace('/login')
    }
  }

  // Function to call on form submit
  const fetchData = async (url, options, noHeader = false) => {
    const token = session?.token
    const apiUrl =
      process.env.NODE_ENV === 'development'
        ? 'http://127.0.0.1:8000/api'
        : process.env.NEXT_PUBLIC_API_URL
    const fullUrl = apiUrl + url
    let defaultHeaders

    defaultHeaders = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    }

    if (noHeader) {
      defaultHeaders = {
        Authorization: `Bearer ${token}`
      }
    }
    const mergedOptions = {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers
      }
    }
    setData(null) // Reset data for new request
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch(fullUrl, mergedOptions)

      // Check for 401 Unauthorized (JWT token expired)
      if (response.status === 401) {
        await handleUnauthorized()
        throw new Error('Unauthorized')
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      setData(data)
      setIsLoading(false)
      return data // Return the data so it can be used directly
    } catch (e) {
      // Only set error if not 'Unauthorized' (since we're redirecting)
      if (e.message !== 'Unauthorized') {
        setError(e.message)
      }
      setIsLoading(false)
      throw e
    }
  }

  return { data, isLoading, error, fetchData }
}

export default useFetchApi
