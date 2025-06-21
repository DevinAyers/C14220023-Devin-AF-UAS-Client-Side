'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function SignInPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()
  const supabase = createClient()

  const handleSignIn = async () => {
    if (!username || !password) {
      setError('Username dan password wajib diisi.')
      return
    }

    const { data: user, error: loginError } = await supabase
      .from('users')
      .select('*')
      .eq('username', username)
      .eq('password', password)
      .maybeSingle()

    if (loginError) {
      console.error(loginError)
      setError('Gagal login. Coba lagi nanti.')
      return
    }

    if (!user) {
      setError('Username atau password salah.')
      return
    }

    localStorage.setItem('user', JSON.stringify(user))

    if (user.role === 'admin') {
      router.push('/dashboard/admin')
    } else {
      router.push('/dashboard/user')
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

      {/* SIGN IN FORM */}
      <div className="flex flex-col items-center justify-center flex-grow px-6 py-10">
        <div className="bg-gray-800 bg-opacity-80 p-8 rounded-lg shadow-md w-full max-w-md">
          <h1 className="text-3xl font-bold mb-6 text-center">Login ke MyElectro</h1>

          {error && (
            <div className="bg-red-600 bg-opacity-80 p-3 rounded mb-4 text-sm text-center">
              {error}
            </div>
          )}

          <input
            type="text"
            placeholder="Username"
            className="w-full p-2 mb-3 border border-gray-300 bg-gray-900 text-white rounded focus:outline-none"
            onChange={(e) => setUsername(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full p-2 mb-4 border border-gray-300 bg-gray-900 text-white rounded focus:outline-none"
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            onClick={handleSignIn}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded mb-3"
          >
            Login
          </button>

          <p className="text-center text-sm text-gray-300">
            Belum punya akun?{' '}
            <button
              onClick={() => router.push('/register')}
              className="text-green-400 hover:underline"
            >
              Daftar sekarang
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
