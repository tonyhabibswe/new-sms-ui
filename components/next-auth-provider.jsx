'use client'
import { SessionProvider, useSession } from 'next-auth/react'
import { useEffect } from 'react'

function SessionSync() {
  const { data: session } = useSession()
  
  useEffect(() => {
    if (session?.token) {
      localStorage.setItem('token', session.token)
    } else {
      localStorage.removeItem('token')
    }
  }, [session])
  
  return null
}

export const NextAuthProvider = ({ children }) => {
  return (
    <SessionProvider>
      <SessionSync />
      {children}
    </SessionProvider>
  )
}
