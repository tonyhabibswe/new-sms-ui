import { cookies } from 'next/headers'

export async function GET() {
  // Clear every NextAuth cookie (including chunked session cookies like
  // next-auth.session-token.0). Browsers ignore Set-Cookie for __Secure- and
  // __Host- prefixed names unless the Secure attribute is present, so it must
  // be set for those or the session survives and /login bounces back here.
  const cookieStore = await cookies()
  cookieStore
    .getAll()
    .filter(({ name }) => name.includes('next-auth.'))
    .forEach(({ name }) => {
      cookieStore.set({
        name,
        value: '',
        path: '/',
        expires: new Date(0),
        secure: name.startsWith('__Secure-') || name.startsWith('__Host-')
      })
    })

  // Use a relative Location: behind a reverse proxy request.url is the
  // server's internal address (http://localhost:3000), not the public domain.
  return new Response(null, {
    status: 307,
    headers: { Location: '/login' }
  })
}
