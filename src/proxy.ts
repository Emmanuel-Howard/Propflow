import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

// Public routes that don't require authentication
const isPublicRoute = createRouteMatcher([
  '/',
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/api/webhooks/(.*)',
])

// Admin-only routes
const isAdminRoute = createRouteMatcher([
  '/overview(.*)',
  '/clients(.*)',
  '/templates(.*)',
  '/admin-settings(.*)',
])

// Client dashboard routes (accessible by both admin and client)
const isClientRoute = createRouteMatcher([
  '/dashboard(.*)',
  '/campaigns(.*)',
  '/analytics(.*)',
  '/contacts(.*)',
  '/settings(.*)',
])

export default clerkMiddleware(async (auth, req) => {
  const { userId } = await auth()
  const url = req.nextUrl

  // Allow public routes
  if (isPublicRoute(req)) {
    // If user is logged in and tries to access auth pages, redirect them
    if (userId && (url.pathname.startsWith('/sign-in') || url.pathname.startsWith('/sign-up'))) {
      // TODO: Once role checking is implemented, redirect based on role
      // For now, redirect to overview (admin view)
      return NextResponse.redirect(new URL('/overview', req.url))
    }
    return NextResponse.next()
  }

  // Require authentication for all non-public routes
  if (!userId) {
    const signInUrl = new URL('/sign-in', req.url)
    signInUrl.searchParams.set('redirect_url', url.pathname)
    return NextResponse.redirect(signInUrl)
  }

  // TODO: Implement role-based access control
  // This will require fetching the user's role from the database
  // For now, we'll allow all authenticated users to access all routes
  //
  // Future implementation:
  // 1. Fetch user role from Supabase using userId (Clerk ID)
  // 2. If role === 'client' and isAdminRoute(req), redirect to /dashboard
  // 3. If role === 'admin', allow all routes
  //
  // const userRole = await getUserRole(userId)
  //
  // if (isAdminRoute(req) && userRole !== 'admin') {
  //   return NextResponse.redirect(new URL('/dashboard', req.url))
  // }

  // For admin routes
  if (isAdminRoute(req)) {
    // Allow access (role check will be added later)
    return NextResponse.next()
  }

  // For client routes
  if (isClientRoute(req)) {
    return NextResponse.next()
  }

  // Default: allow the request
  return NextResponse.next()
})

export const config = {
  matcher: [
    // Skip Next.js internals and all static files
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
}
