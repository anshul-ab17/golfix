import { NextRequest, NextResponse } from 'next/server'
import { jwtVerify } from 'jose'

const secret = new TextEncoder().encode(
  process.env.JWT_SECRET ?? 'golfix-dev-secret-change-in-production'
)

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const token = request.cookies.get('golfix_token')?.value

  if (!token) {
    return NextResponse.redirect(new URL('/auth/login', request.url))
  }

  try {
    const { payload } = await jwtVerify(token, secret)

    if (pathname.startsWith('/admin') && payload['role'] !== 'ADMIN') {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }

    return NextResponse.next()
  } catch {
    return NextResponse.redirect(new URL('/auth/login', request.url))
  }
}

export const config = {
  matcher: ['/dashboard/:path*', '/admin/:path*'],
}
