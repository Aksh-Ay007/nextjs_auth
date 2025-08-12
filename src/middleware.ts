import { NextResponse, NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname
  const publicPaths = ['/', '/login', '/signup']
  const isPublicPath = publicPaths.includes(path)

  const token = request.cookies.get('token')?.value||'';

  if (isPublicPath && token) {
    // If the user is authenticated and tries to access a public path, redirect to profile
    return NextResponse.redirect(new URL('/profile', request.url))
  }

  if (!isPublicPath && !token) {
    // If the user is not authenticated and tries to access a protected path, redirect to login
    return NextResponse.redirect(new URL('/login', request.url))
  }
}

export const config = {
  matcher: [
    '/',
    '/login',
    '/signup',
    '/profile',
  ],
}