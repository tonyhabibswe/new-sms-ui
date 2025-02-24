import CredentialsProvider from 'next-auth/providers/credentials'

export const authOptions = {
  session: {
    strategy: 'jwt'
  },
  providers: [
    CredentialsProvider({
      type: 'credentials',
      credentials: {},
      async authorize(credentials, req) {
        const { username, password } = credentials
        try {
          const res = await fetch(process.env.NEXTAUTH_URL, {
            method: 'POST',
            body: JSON.stringify({ username, password }),
            headers: {
              'Content-Type': 'application/json'
            }
          })

          if (!res.ok) throw new Error('Invalid Credentials')

          const data = await res.json()
          return data
        } catch (error) {
          return null
        }
      }
    })
  ],
  pages: {
    signIn: '/login'
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        return user
      }
      return token
    },
    async session({ session, token }) {
      // Add the token claims to the session object here
      session.token = token.data.token
      session.user.id = token.data.id
      session.user.email = token.data.email
      session.user.username = token.data.username
      // Again, you can add more token claims to the session here if needed
      return session
    }
  },
  // Enable debug messages in the console if you are having problems
  debug: process.env.NODE_ENV === 'development'
}
