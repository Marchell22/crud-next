// app/api/auth/logout/route.ts
import { NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
  // Buat respons dengan cookie yang sudah kedaluwarsa
  return new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Set-Cookie': `auth_token=; Path=/; HttpOnly; Max-Age=0; SameSite=Lax`,
    },
  });
}
