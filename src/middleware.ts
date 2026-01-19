import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

const isPublicRoute = createRouteMatcher([
  '/',
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/offline',
  '/api/webhooks(.*)',
]);

const isAuthRoute = createRouteMatcher([
  '/sign-in(.*)',
  '/sign-up(.*)',
]);

export default clerkMiddleware(async (auth, request) => {
  const { userId } = await auth();
  const { pathname } = request.nextUrl;

  // If user is authenticated
  if (userId) {
    // Redirect authenticated users away from auth pages and home to dashboard
    if (isAuthRoute(request) || pathname === '/') {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
  }

  // If user is not authenticated and trying to access protected route
  if (!userId && !isPublicRoute(request)) {
    return NextResponse.redirect(new URL('/sign-in', request.url));
  }
});

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};
