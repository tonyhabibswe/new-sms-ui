import { useSession } from 'next-auth/react'
import { useState, useEffect } from 'react'

// Custom hook for fetching data from an API
function useFetchApi() {
  const [data, setData] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const { data: session, status } = useSession()

  useEffect(() => {}, [session])

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

    const response = await fetch(fullUrl, mergedOptions)
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    const data = await response.json()
    setData(data)
    setIsLoading(false)
    return data // Return the data so it can be used directly
    // try {
    // } catch (e) {
    //   setError(e.message)
    // } finally {
    //   setIsLoading(false)
    // }
  }

  return { data, isLoading, error, fetchData }
}

export default useFetchApi
