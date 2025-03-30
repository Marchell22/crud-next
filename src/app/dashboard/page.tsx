// app/dashboard/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface User {
  email: string;
  name?: string;
}

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Fungsi untuk memeriksa autentikasi
    const checkAuth = async () => {
      try {
        // Dalam aplikasi nyata, ini akan memanggil API untuk memverifikasi token
        const response = await fetch('/api/auth/session');

        if (!response.ok) {
          throw new Error('Tidak terautentikasi');
        }

        const data = await response.json();
        setUser(data.user);
      } catch (error) {
        // Jika tidak terautentikasi, redirect ke halaman login
        router.push('/');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
      });
      router.push('/');
    } catch (error) {
      console.error('Gagal logout:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-xl font-semibold text-gray-700">Memuat...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-md bg-gradient-to-r from-blue-500 to-blue-700 flex items-center justify-center text-white font-bold mr-3">
              D
            </div>
            <h1 className="text-xl font-semibold text-gray-800">Dashboard</h1>
          </div>
          <div className="flex items-center">
            <div className="text-sm text-gray-600 mr-4">
              Selamat datang, {user?.name || user?.email || 'Pengguna'}
            </div>
            <button
              onClick={handleLogout}
              className="px-3 py-1 text-sm bg-gray-700 hover:bg-gray rounded-md"
            >
              Keluar
            </button>
          </div>
        </div>
      </header>

    </div>
  );
}
