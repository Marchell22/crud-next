// app/api/auth/login/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../../lib/prisma';

// Definisikan interface untuk type assertion
interface UserWithName {
  id: string;
  email: string;
  password: string;
  name: string;
}

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

    // Cari pengguna berdasarkan email di database Prisma
    const user = (await prisma.user.findUnique({
      where: {
        email: email,
      },
    })) as unknown as UserWithName;

    // Jika pengguna tidak ditemukan atau password salah
    if (!user || user.password !== password) {
      return NextResponse.json(
        { error: 'Email atau password salah' },
        { status: 401 }
      );
    }

    // Buat token dengan email pengguna
    const token = `demo-token-${Date.now()}-${email}`;

    // Buat respons dengan data dari database
    const response = NextResponse.json({
      success: true,
      message: 'Login berhasil',
      redirectUrl: '/dashboard',
      user: {
        id: user.id,
        email: user.email,
        name: user.name, // Menggunakan name dari database
      },
    });

    // Set cookie dengan token autentikasi
    response.cookies.set({
      name: 'auth_token',
      value: token,
      httpOnly: true,
      path: '/',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 8, // 8 jam dalam detik
    });

    // Set cookie dengan nama pengguna (opsional, untuk akses di client)
    response.cookies.set({
      name: 'user_name',
      value: user.name,
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
