// app/api/users/register/route.ts
import { NextResponse } from 'next/server';
import prisma from '../../../../../lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
  try {
    // Parse data dari request body
    const { name, email, password, role } = await request.json();

    // Validasi input dasar
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email dan password diperlukan' },
        { status: 400 }
      );
    }

    // Cek apakah email sudah terdaftar
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'Email sudah terdaftar' },
        { status: 400 }
      );
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Buat user baru
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        role: role || 'USER',
        name, // Tambahkan field name
      } as any, // Tambahkan type assertion
    });
    // Return user tanpa password
    const { password: _, ...userWithoutPassword } = user;

    return NextResponse.json(
      {
        message: 'Pendaftaran berhasil',
        user: userWithoutPassword,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Registration error:', error);

    // Handle database/prisma errors
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'Email sudah digunakan' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Terjadi kesalahan saat mendaftar' },
      { status: 500 }
    );
  }
}
