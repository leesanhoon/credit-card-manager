import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Quản lý thẻ tín dụng',
  description: 'Ứng dụng quản lý thẻ tín dụng hiệu quả',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="vi">
      <body className={inter.className}>
        <main className="min-h-screen bg-gray-50">
          <nav className="bg-white shadow-sm fixed top-0 left-0 right-0 z-10">
            <div className="px-4 py-3">
              <h1 className="text-xl font-bold text-gray-900">Quản lý thẻ tín dụng</h1>
            </div>
          </nav>
          <div className="pt-16 pb-20 px-4">
            {children}
          </div>
          {/* Thêm bottom spacing để tránh content bị che bởi mobile browser chrome */}
          <div className="h-safe-bottom" />
        </main>
      </body>
    </html>
  )
}
