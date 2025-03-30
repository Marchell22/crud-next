// app/api/auth/session/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Dapatkan token dari cookie
    const token = request.cookies.get('auth_token')?.value;

    // Jika tidak ada token, kita perlu mengubah respons
    // Daripada mengembalikan error 401, lebih baik kirim respons sukses dengan user null
    if (!token) {
      return NextResponse.json({
        authenticated: false,
        user: null,
      });
    }

    // Verifikasi token (untuk demo)
    if (token.startsWith('demo-token-')) {
      return NextResponse.json({
        authenticated: true,
        user: {
          email: 'user@example.com',
          name: 'Demo User',
        },
      });
    }

    // Token tidak valid
    return NextResponse.json({
      authenticated: false,
      user: null,
    });
  } catch (error) {
    console.error('Error session:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan server' },
      { status: 500 }
    );
  }
}
