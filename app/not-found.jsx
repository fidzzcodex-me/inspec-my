import Link from 'next/link'

export default function NotFound() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-white px-6">
      <div className="pointer-events-none absolute -top-24 left-1/4 h-[320px] w-[320px] rounded-full bg-brand-50 blur-3xl animate-glow-pulse" />
      <div className="pointer-events-none absolute bottom-0 right-1/4 h-[280px] w-[280px] rounded-full bg-mist blur-3xl animate-float-soft" />

      <div data-aos="zoom-in" className="relative text-center">
        <div className="relative mx-auto mb-8 flex h-24 w-24 items-center justify-center">
          <span className="absolute inset-0 rounded-full border-2 border-dashed border-brand-200 animate-spin-slow" />
          <i className="fa-solid fa-compass text-3xl text-brand-500" />
        </div>

        <p className="text-sm font-semibold uppercase tracking-wide text-brand-600">404</p>
        <h1 className="mt-3 text-3xl font-bold text-ink sm:text-4xl">Halaman tidak ditemukan</h1>
        <p className="mx-auto mt-3 max-w-sm text-slate">
          Alamat yang kamu tuju tidak tersedia. Coba periksa lagi URL-nya, atau kembali ke beranda.
        </p>

        <Link
          href="/"
          className="group mt-9 inline-flex items-center gap-2.5 rounded-full bg-brand-600 px-7 py-3.5 font-semibold text-white shadow-soft transition-soft hover:-translate-y-0.5 hover:bg-brand-700"
        >
          <i className="fa-solid fa-house" />
          Kembali ke beranda
        </Link>
      </div>
    </main>
  )
}
