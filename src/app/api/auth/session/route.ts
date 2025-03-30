// app/api/auth/session/route.ts
import { NextRequest, NextResponse } from 'next/server';
// Jika menggunakan JWT, impor jwt dan verifikasi di sini

export async function GET(request: NextRequest) {
  try {
    // Dapatkan token dari cookie
    const token = request.cookies.get('auth_token')?.value;
    
    if (!token) {
      return new Response(
        JSON.stringify({ error: 'Tidak terautentikasi' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    // Dalam aplikasi nyata, verifikasi token JWT
    // const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Sementara untuk demonstrasi
    if (token.startsWith('demo-token-')) {
      return new Response(
        JSON.stringify({ 
          user: { 
            email: 'user@example.com',
            name: 'Demo User' 
          } 
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    return new Response(
      JSON.stringify({ error: 'Token tidak valid' }),
      { status: 401, headers: { 'Content-Type': 'application/json' } }
    );
    
  } catch (error) {
    console.error('Error session:', error);
    return new Response(
      JSON.stringify({ error: 'Terjadi kesalahan server' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}