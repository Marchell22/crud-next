// middleware.ts
import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  // Dapatkan token dari cookie
  const token = request.cookies.get('auth_token')?.value;

  // Jika mencoba mengakses dashboard tanpa token
  if (request.nextUrl.pathname.startsWith('/dashboard') && !token) {
    // Redirect ke halaman login
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

// Tentukan path mana yang akan dijalankan middleware ini
export const config = {
  matcher: ['/dashboard/:path*'],
};
