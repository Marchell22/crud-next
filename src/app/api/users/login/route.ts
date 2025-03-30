// app/api/auth/login/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../../lib/prisma';

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

    // Buat nama pengguna dari email jika tidak disediakan
    const userName = email.split('@')[0];

    // Buat token yang menyimpan data pengguna
    // Format: demo-token-TIMESTAMP-EMAIL-NAME
    const token = `demo-token-${Date.now()}-${email}`;

    // Buat respons
    const response = NextResponse.json({
      success: true,
      message: 'Login berhasil',
      redirectUrl: '/dashboard',
      user: {
        email,
        name: userName,
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
