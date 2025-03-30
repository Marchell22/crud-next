// app/api/auth/session/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../../lib/prisma';

// Definisikan interface untuk type assertion
interface UserWithName {
  id: string;
  email: string;
  name: string;
}

export async function GET(request: NextRequest) {
  try {
    // Dapatkan token dari cookie
    const token = request.cookies.get('auth_token')?.value;

    // Jika tidak ada token, pengguna tidak terautentikasi
    if (!token) {
      return NextResponse.json(
        { error: 'Tidak terautentikasi' },
        { status: 401 }
      );
    }

    // Verifikasi token
    if (token.startsWith('demo-token-')) {
      try {
        const parts = token.split('-');

        // Token format: demo-token-TIMESTAMP-EMAIL
        if (parts.length >= 4) {
          // Email adalah semua bagian setelah timestamp
          const email = parts.slice(3).join('-');

          // Cari user di database dengan email tersebut
          const user = (await prisma.user.findUnique({
            where: {
              email: email,
            },
          })) as unknown as UserWithName;

          if (user) {
            return NextResponse.json({
              user: {
                id: user.id,
                email: user.email,
                name: user.name, // Mengambil name dari database
              },
            });
          }
        }
      } catch (err) {
        console.error('Error verifying token:', err);
      }
    }

    // Token tidak valid atau pengguna tidak ditemukan
    return NextResponse.json({ error: 'Token tidak valid' }, { status: 401 });
  } catch (error) {
    console.error('Error session:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan server' },
      { status: 500 }
    );
  }
}
