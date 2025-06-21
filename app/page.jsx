'use client'
import { useRouter } from 'next/navigation'

export default function HomePage() {
  const router = useRouter()

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-gray-900 to-gray-700 text-white">
      
      {/* NAVBAR */}
      <nav className="flex items-center justify-between px-6 py-4 bg-gray-800 shadow">
        <button onClick={() => router.push('/')} 
          className="text-2xl font-bold text-white hover:text-blue-400">
          MyElectro
        </button>

        <div className="space-x-4">
          <button
            onClick={() => router.push('/login')}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded"
          >
            Login
          </button>
          <button
            onClick={() => router.push('/register')}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded"
          >
            Register
          </button>
        </div>
      </nav>

      {/* MAIN CONTENT */}
      <main
        className="flex-grow flex flex-col items-center justify-center px-4 py-10 bg-cover bg-center text-center"
        style={{
          backgroundImage: 'url("/bg.png")',
        }}
      >
        <h2 className="text-4xl md:text-5xl font-bold mb-4 text-white drop-shadow-lg">
          Selamat Datang di Jual Barang Electronic
        </h2>
        <p className="mb-8 text-lg text-gray-200 drop-shadow">
          Silakan masuk atau daftar untuk melanjutkan
        </p>
        <div className="flex justify-center space-x-4">
          <button
            onClick={() => router.push('/login')}
            className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Login
          </button>
          <button
            onClick={() => router.push('/register')}
            className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Register
          </button>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="bg-gray-800 text-center text-gray-400 py-4">
        © {new Date().getFullYear()} MyElectro. All rights reserved.
      </footer>
    </div>
  )
}
