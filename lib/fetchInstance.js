const fetchInstance = async (url, options = {}, auth = true) => {
  const token = localStorage.getItem('token')
  const apiUrl = process.env.API_URL
    ? process.env.API_URL
    : process.env.NEXT_PUBLIC_API_URL
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
  // if (response.status === 401) throw new Error('Unauthorized')
  return response
}

export default fetchInstance
