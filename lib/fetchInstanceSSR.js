import { getServerSession } from 'next-auth'
import { authOptions } from './auth'

const fetchInstanceSSR = async (url, options = {}, auth = true) => {
  const session = await getServerSession(authOptions)
  const token = session.token
  const apiUrl = process.env.NEXT_PUBLIC_API_URL

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
  return response
}

export default fetchInstanceSSR
