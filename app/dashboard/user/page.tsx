'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

interface Product {
  id: number
  nama_produk: string
  harga_satuan: number
  quantity: number
}

export default function UserDashboard() {
  const [products, setProducts] = useState<Product[]>([])
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}')

    if (!user.username || user.role !== 'user') {
      router.push('/login')
      return
    }

    const fetchProducts = async () => {
      const { data, error } = await supabase.from('products').select('*')
      if (error) {
        console.error('Gagal ambil produk:', error.message)
        return
      }
      setProducts(data as Product[])
    }

    fetchProducts()
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('user')
    router.push('/')
  }

  const username = JSON.parse(localStorage.getItem('user') || '{}').username

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      
      {/* NAVBAR */}
      <nav className="flex items-center justify-between px-6 py-4 bg-gray-800 shadow-md z-20 relative">
        <button
          onClick={() => router.push('/dashboard/user')}
          className="text-2xl font-bold text-white hover:text-blue-400"
        >
          MyElectro
        </button>
        <button
          onClick={handleLogout}
          className="text-sm bg-red-600 hover:bg-red-700 px-4 py-2 rounded-md"
        >
          Logout
        </button>
      </nav>

      {/* HERO HEADER */}
      <header
        className="w-full bg-cover bg-center py-20 px-4 text-center relative"
        style={{ backgroundImage: "url('/bg.png')" }}
      >
        <div className="bg-black bg-opacity-50 absolute inset-0"></div>
        <div className="relative z-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-2 drop-shadow-md">
            Selamat Datang, {username}
          </h1>
          <p className="text-gray-300 text-lg">Lihat daftar produk yang tersedia</p>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="flex-grow px-6 py-12 max-w-6xl mx-auto w-full">
        <h2 className="text-2xl font-semibold mb-6 text-center">Produk Tersedia</h2>

        {products.length === 0 ? (
          <p className="text-center text-gray-400">Tidak ada produk tersedia.</p>
        ) : (
          <div className="overflow-x-auto rounded-lg shadow-md">
            <table className="w-full table-auto bg-gray-800 text-left border border-gray-700">
              <thead className="bg-gray-700 text-gray-300">
                <tr>
                  <th className="p-4 border-b border-gray-600">Nama Produk</th>
                  <th className="p-4 border-b border-gray-600">Harga Satuan</th>
                  <th className="p-4 border-b border-gray-600">Stok</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-700 transition">
                    <td className="p-4 border-b border-gray-700">{p.nama_produk}</td>
                    <td className="p-4 border-b border-gray-700">Rp {p.harga_satuan.toLocaleString()}</td>
                    <td className="p-4 border-b border-gray-700">{p.quantity}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>

      {/* FOOTER */}
      <footer className="text-center text-sm text-gray-400 py-6 border-t border-gray-700">
        © {new Date().getFullYear()} MyElectro. All rights reserved.
      </footer>
    </div>
  )
}
