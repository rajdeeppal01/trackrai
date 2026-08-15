import { NextResponse } from 'next/server';

export function proxy(request) {
  const token = request.cookies.get('access_token');
  const url = request.nextUrl.clone();

  // Redirect logged-in users away from landing page and login page
  if (token && (url.pathname === '/' || url.pathname === '/login')) {
    url.pathname = '/dashboard';
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  // Only run middleware on the root and login paths to handle authenticated redirects.
  // The ProtectedRoute handles the rest of the app dynamically.
  matcher: ['/', '/login'],
};
