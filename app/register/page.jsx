'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'


export default function RegisterPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('user')
  const [error, setError] = useState('')
  const router = useRouter()
  const supabase = createClient()

  const handleRegister = async () => {
    if (!username || !password) {
      setError('Username dan password wajib diisi.')
      return
    }

    // Cek apakah username sudah ada
    const { data: existingUser, error: checkError } = await supabase
      .from('users')
      .select('*')
      .eq('username', username)
      .maybeSingle()

    if (checkError) {
      setError('Gagal cek username.')
      return
    }

    if (existingUser) {
      setError('Username sudah digunakan.')
      return
    }

    // Insert user baru
    const { error: insertError } = await supabase.from('users').insert({
      username,
      password,
      role,
    })

    if (insertError) {
      setError('Gagal mendaftar. Coba lagi nanti.')
    } else {
      router.push('/login')
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-gray-900 to-gray-700 text-white">
      {/* NAVBAR */}
      <nav className="flex items-center justify-between px-6 py-4 bg-gray-800 shadow">
        <button
          onClick={() => router.push('/')}
          className="text-2xl font-bold text-white hover:text-blue-400"
        >
          MyElectro
        </button>
      </nav>

      {/* REGISTER FORM */}
      <div className="flex flex-col items-center justify-center flex-grow px-6 py-10">
        <div className="bg-gray-800 bg-opacity-80 p-8 rounded-lg shadow-md w-full max-w-md">
          <h1 className="text-3xl font-bold mb-6 text-center">Buat Akun</h1>

          {error && (
            <div className="bg-red-600 bg-opacity-80 p-3 rounded mb-4 text-sm text-center">
              {error}
            </div>
          )}

          <input
            type="text"
            placeholder="Username"
            className="w-full p-2 mb-3 border border-gray-300 bg-gray-900 text-white rounded"
            onChange={(e) => setUsername(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full p-2 mb-3 border border-gray-300 bg-gray-900 text-white rounded"
            onChange={(e) => setPassword(e.target.value)}
          />

          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full p-2 mb-4 border border-gray-300 bg-gray-900 text-white rounded"
          >
            <option value="user">User</option>
            {/* <option value="admin">Admin</option> */}
          </select>

          <button
            onClick={handleRegister}
            className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded mb-3"
          >
            Daftar
          </button>

          <p className="text-center text-sm text-gray-300">
            Sudah punya akun?{' '}
            <button
              onClick={() => router.push('/login')}
              className="text-blue-400 hover:underline"
            >
              Login di sini
            </button>
          </p>
        </div>
      </div>

      {/* FOOTER */}
      <footer className="bg-gray-800 text-center text-gray-400 py-4">
        © {new Date().getFullYear()} MyElectro. All rights reserved.
      </footer>
    </div>
  )
}
