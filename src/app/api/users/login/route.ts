// app/api/auth/login/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // Validasi input
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email dan password diperlukan' },
        { status: 400 }
      );
    }

    // Di sini, Anda akan menambahkan logika untuk memverifikasi kredensial dengan database
    // Simulasi token sederhana untuk demonstrasi
    const token = 'demo-token-' + Date.now();

    // Buat respons dengan cookie dan redirect ke dashboard
    const response = NextResponse.json({
      success: true,
      message: 'Login berhasil',
      redirectUrl: '/dashboard',
      user: {
        email,
        name: email.split('@')[0], // Simulasi nama pengguna dari email
      },
    });

    // Set cookie pada respons
    response.cookies.set({
      name: 'auth_token',
      value: token,
      httpOnly: true,
      path: '/',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 8, // 8 jam dalam detik
    });

    return response;
  } catch (error) {
    console.error('Error login:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan server' },
      { status: 500 }
    );
  }
}
