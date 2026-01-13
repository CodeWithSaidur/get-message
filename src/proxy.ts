import { getToken } from 'next-auth/jwt'
import { NextResponse } from 'next/server'
import { NextRequest } from 'next/server'

export async function proxy(request: NextRequest) {
  const token = await getToken({ req: request })
  const url = request.nextUrl

  // Redirect authenticated users away from auth pages
  if (
    token &&
    (url.pathname.startsWith('/signin') ||
      url.pathname.startsWith('/signup') ||
      url.pathname.startsWith('/verify') ||
      url.pathname === '/')
  ) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  // Redirect unauthenticated users to home
  if (!token && url.pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/home', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/', '/signin', '/signup', '/dashboard/:path*', '/verify/:path*']
}