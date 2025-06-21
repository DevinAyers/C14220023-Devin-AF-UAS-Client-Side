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

export default function AdminDashboard() {
  const [products, setProducts] = useState<Product[]>([])
  const [form, setForm] = useState<Partial<Product>>({})
  const [isEdit, setIsEdit] = useState(false)
  const supabase = createClient()
  const router = useRouter()

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}')
    if (user.role !== 'admin') {
      router.push('/login')
    } else {
      fetchProducts()
    }
  }, [])

  const fetchProducts = async () => {
    const { data, error } = await supabase.from('products').select('*')
    if (!error) setProducts(data as Product[])
  }

  const handleSubmit = async () => {
    if (!form.nama_produk || !form.harga_satuan || !form.quantity) {
      alert('Semua field harus diisi')
      return
    }

    if (isEdit && form.id) {
      await supabase.from('products').update(form).eq('id', form.id)
    } else {
      await supabase.from('products').insert([form])
    }

    setForm({})
    setIsEdit(false)
    fetchProducts()
  }

  const handleDelete = async (id: number) => {
    await supabase.from('products').delete().eq('id', id)
    fetchProducts()
  }

  const handleEdit = (product: Product) => {
    setForm(product)
    setIsEdit(true)
  }

  const handleLogout = () => {
    localStorage.removeItem('user')
    router.push('/')
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-900 to-gray-800 text-white">

      {/* NAVBAR */}
      <nav className="flex items-center justify-between px-6 py-4 bg-gray-800 shadow-md z-20 relative">
        <button
          onClick={() => router.push('/dashboard/admin')}
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

      {/* HERO */}
      <div
        className="w-full bg-cover bg-center py-20 px-4 text-center relative"
        style={{ backgroundImage: "url('/bg.png')" }}
      >
        <div className="bg-black bg-opacity-50 absolute inset-0"></div>
        <div className="relative z-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-2 drop-shadow-md">
            Dashboard Admin
          </h1>
          <p className="text-gray-300 text-lg">Kelola produk MyElectro</p>
        </div>
      </div>

      {/* FORM PRODUK */}
      <div className="bg-gray-800 p-6 rounded-lg shadow-md mb-10 max-w-3xl mx-auto mt-8">
        <h3 className="text-xl font-semibold mb-4">{isEdit ? 'Edit Produk' : 'Tambah Produk'}</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <input
            className="p-2 rounded bg-gray-700 border border-gray-600 placeholder-gray-400 text-white"
            placeholder="Nama Produk"
            value={form.nama_produk || ''}
            onChange={(e) => setForm({ ...form, nama_produk: e.target.value })}
          />
          <input
            className="p-2 rounded bg-gray-700 border border-gray-600 placeholder-gray-400 text-white"
            type="number"
            placeholder="Harga Satuan"
            value={form.harga_satuan || ''}
            onChange={(e) => setForm({ ...form, harga_satuan: Number(e.target.value) })}
          />
          <input
            className="p-2 rounded bg-gray-700 border border-gray-600 placeholder-gray-400 text-white"
            type="number"
            placeholder="Quantity"
            value={form.quantity || ''}
            onChange={(e) => setForm({ ...form, quantity: Number(e.target.value) })}
          />
        </div>
        <div className="flex gap-4">
          <button
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
            onClick={handleSubmit}
          >
            {isEdit ? 'Update' : 'Tambah'}
          </button>
          {isEdit && (
            <button
              className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
              onClick={() => {
                setForm({})
                setIsEdit(false)
              }}
            >
              Batal
            </button>
          )}
        </div>
      </div>

      {/* TABEL PRODUK */}
      <main className="flex-grow px-6 pb-12 max-w-6xl mx-auto w-full">
        <h2 className="text-2xl font-semibold mb-6 text-center">Daftar Produk</h2>
        <div className="overflow-x-auto rounded-lg shadow-md">
          <table className="w-full table-auto bg-gray-800 text-left border border-gray-700">
            <thead className="bg-gray-700 text-gray-300">
              <tr>
                <th className="p-4 border-b border-gray-600">Nama Produk</th>
                <th className="p-4 border-b border-gray-600">Harga Satuan</th>
                <th className="p-4 border-b border-gray-600">Quantity</th>
                <th className="p-4 border-b border-gray-600 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id} className="hover:bg-gray-700 transition">
                  <td className="p-4 border-b border-gray-700">{product.nama_produk}</td>
                  <td className="p-4 border-b border-gray-700">Rp {product.harga_satuan.toLocaleString()}</td>
                  <td className="p-4 border-b border-gray-700">{product.quantity}</td>
                  <td className="p-4 border-b border-gray-700 text-center">
                    <button
                      className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded mr-2"
                      onClick={() => handleEdit(product)}
                    >
                      Edit
                    </button>
                    <button
                      className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
                      onClick={() => handleDelete(product.id)}
                    >
                      Hapus
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="text-center text-sm text-gray-400 py-6 border-t border-gray-700">
        © {new Date().getFullYear()} MyElectro. All rights reserved.
      </footer>
    </div>
  )
}
