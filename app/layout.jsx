import { Plus_Jakarta_Sans } from 'next/font/google'
import './globals.css'
import 'aos/dist/aos.css'
import AosInit from '@/components/AosInit'

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-jakarta'
})

export const metadata = {
  title: 'Web Design Inspector — Bongkar struktur desain situs',
  description:
    'Masukkan satu URL, dapatkan laporan faktual soal warna, font, motion, layout, dan stack yang dipakai sebuah website.'
}

export default function RootLayout({ children }) {
  return (
    <html lang="id" className={jakarta.variable}>
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css"
        />
      </head>
      <body className="font-sans bg-white text-ink antialiased">
        <AosInit />
        {children}
      </body>
    </html>
  )
}
