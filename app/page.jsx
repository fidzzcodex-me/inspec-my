import Link from 'next/link'

const detectItems = [
  {
    icon: 'fa-palette',
    title: 'Colors',
    desc: 'Palet warna dari inline style, <style>, dan meta theme-color — dikelompokkan jadi background, text, dan accent.'
  },
  {
    icon: 'fa-font',
    title: 'Typography',
    desc: 'Font family dari Google Fonts, @font-face, atau CSS biasa. Ditandai sumbernya: Google, self-hosted, atau system.'
  },
  {
    icon: 'fa-wand-magic-sparkles',
    title: 'Motion',
    desc: 'Library animasi yang terpasang — AOS, GSAP, Framer Motion, Lottie, dan sejenisnya — plus signal @keyframes & transition.'
  },
  {
    icon: 'fa-diagram-project',
    title: 'Layout & Stack',
    desc: 'Landmark HTML, pola card berulang, densitas radius/shadow, sampai tebakan framework: Next.js, Nuxt, WordPress, dll.'
  },
  {
    icon: 'fa-boxes-stacked',
    title: 'Assets',
    desc: 'Jumlah script & stylesheet, domain CDN utama, favicon, dan Open Graph image.'
  }
]

const steps = [
  {
    n: '01',
    title: 'Masukkan URL',
    desc: 'Tempel alamat situs yang mau dibongkar strukturnya.'
  },
  {
    n: '02',
    title: 'Fetch di server',
    desc: 'Halaman diambil dari server, bukan browser kamu — jadi tidak kena batasan CORS.'
  },
  {
    n: '03',
    title: 'Parse & deteksi',
    desc: 'HTML, CSS, dan referensi script dipecah lewat modul-modul detektor.'
  },
  {
    n: '04',
    title: 'Susun laporan',
    desc: 'Hasil deteksi dirangkum jadi satu laporan terstruktur, bukan opini.'
  },
  {
    n: '05',
    title: 'Salin hasil',
    desc: 'Ambil dalam format Markdown atau JSON mentah, siap dipakai lagi.'
  }
]

const positioning = [
  {
    icon: 'fa-ban',
    title: 'Bukan page builder',
    desc: 'Tidak membuatkan halaman baru untuk kamu. Ini alat pembaca struktur, bukan alat produksi.'
  },
  {
    icon: 'fa-scale-balanced',
    title: 'Bukan juri desain',
    desc: 'Tidak ada skor "bagus 9/10". Yang keluar cuma temuan faktual, penilaiannya tetap di tangan kamu.'
  },
  {
    icon: 'fa-bolt',
    title: 'Fokus deteksi & ringkas',
    desc: 'Satu URL masuk, satu laporan struktural keluar — warna, font, motion, layout, stack.'
  }
]

export default function HomePage() {
  return (
    <main className="relative overflow-hidden">
      <div className="pointer-events-none absolute -top-40 -left-32 h-[420px] w-[420px] rounded-full bg-brand-100/70 blur-3xl animate-glow-pulse" />
      <div className="pointer-events-none absolute top-96 -right-40 h-[380px] w-[380px] rounded-full bg-brand-50 blur-3xl animate-float-soft-delayed" />

      <section className="relative mx-auto max-w-6xl px-6 pt-24 pb-20 sm:pt-32">
        <div className="grid items-center gap-16 lg:grid-cols-[1.1fr_0.9fr]">
          <div data-aos="fade-up">
            <div className="inline-flex items-center gap-2 rounded-full border border-line bg-mist px-4 py-1.5 text-sm text-slate">
              <i className="fa-solid fa-magnifying-glass text-brand-600" />
              Web design inspector
            </div>

            <h1 className="mt-6 text-4xl font-bold leading-[1.12] text-ink sm:text-5xl lg:text-[3.2rem]">
              Bongkar struktur desain sebuah situs, tanpa buka DevTools.
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-relaxed text-slate">
              Masukkan satu URL. Dapatkan laporan faktual soal warna, font, motion, layout, dan stack yang
              dipakai — disusun otomatis, tanpa penilaian bagus atau jelek.
            </p>

            <div className="mt-9 flex flex-wrap items-center gap-4">
              <Link
                href="/analyzer"
                className="group inline-flex items-center gap-2.5 rounded-full bg-brand-600 px-7 py-3.5 font-semibold text-white shadow-soft transition-soft hover:-translate-y-0.5 hover:bg-brand-700 hover:shadow-lg"
              >
                Mulai Analisis
                <i className="fa-solid fa-arrow-right-long transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
              <span className="text-sm text-slate">
                <i className="fa-solid fa-server mr-1.5 text-brand-500" />
                Fetch dilakukan di server, bukan browser kamu
              </span>
            </div>
          </div>

          <div data-aos="fade-left" data-aos-delay="150" className="relative">
            <div className="animate-float-soft rounded-xl2 border border-line bg-white p-6 shadow-card">
              <div className="flex items-center justify-between border-b border-line pb-4">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-brand-500" />
                  <span className="text-sm font-semibold text-ink">Report preview</span>
                </div>
                <span className="rounded-full bg-brand-50 px-2.5 py-1 text-xs font-medium text-brand-700">ok: true</span>
              </div>

              <div className="mt-5 space-y-4 text-sm">
                <div>
                  <p className="mb-2 text-xs font-medium uppercase tracking-wide text-slate-light">Colors</p>
                  <div className="flex gap-2">
                    {['#2563EB', '#EFF6FF', '#0F172A', '#5B9DF9'].map((hex) => (
                      <span
                        key={hex}
                        className="h-8 w-8 rounded-lg border border-line transition-soft hover:scale-110"
                        style={{ backgroundColor: hex }}
                      />
                    ))}
                  </div>
                </div>

                <div>
                  <p className="mb-2 text-xs font-medium uppercase tracking-wide text-slate-light">Typography</p>
                  <span className="inline-flex items-center gap-2 rounded-full border border-line px-3 py-1 text-ink">
                    <i className="fa-solid fa-font text-brand-500" /> Plus Jakarta Sans
                  </span>
                </div>

                <div>
                  <p className="mb-2 text-xs font-medium uppercase tracking-wide text-slate-light">Motion</p>
                  <div className="flex flex-wrap gap-2">
                    <span className="rounded-full bg-mist px-3 py-1 text-brand-700">AOS</span>
                    <span className="rounded-full bg-mist px-3 py-1 text-brand-700">3 @keyframes</span>
                  </div>
                </div>

                <div>
                  <p className="mb-2 text-xs font-medium uppercase tracking-wide text-slate-light">Stack guess</p>
                  <span className="inline-flex items-center gap-2 rounded-full bg-ink px-3 py-1 text-white">
                    Next.js <span className="text-brand-200">· high</span>
                  </span>
                </div>
              </div>
            </div>

            <div className="absolute -bottom-6 -left-6 hidden rounded-xl2 border border-line bg-white px-5 py-4 shadow-card sm:block animate-float-soft-delayed">
              <p className="text-xs text-slate-light">Analyzed in</p>
              <p className="text-lg font-bold text-ink">2.4s</p>
            </div>
          </div>
        </div>
      </section>

      <section className="relative mx-auto max-w-6xl px-6 py-20">
        <div data-aos="fade-up" className="mb-12 max-w-2xl">
          <h2 className="text-3xl font-bold text-ink">Apa ini, dan apa yang bukan</h2>
          <p className="mt-3 text-slate">Biar ekspektasinya jelas dari awal.</p>
        </div>

        <div className="grid gap-6 sm:grid-cols-3">
          {positioning.map((item, i) => (
            <div
              key={item.title}
              data-aos="fade-up"
              data-aos-delay={i * 120}
              className="rounded-xl2 border border-line bg-white p-6 transition-soft hover:-translate-y-1 hover:shadow-card"
            >
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-full bg-brand-50 text-brand-600">
                <i className={`fa-solid ${item.icon}`} />
              </div>
              <h3 className="font-semibold text-ink">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="relative bg-mist py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div data-aos="fade-up" className="mb-14 max-w-2xl">
            <h2 className="text-3xl font-bold text-ink">Alur kerjanya</h2>
            <p className="mt-3 text-slate">Lima langkah, dari URL sampai laporan siap salin.</p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
            {steps.map((step, i) => (
              <div
                key={step.n}
                data-aos="fade-up"
                data-aos-delay={i * 100}
                className="relative rounded-xl2 border border-line bg-white p-6 transition-soft hover:-translate-y-1 hover:border-brand-200 hover:shadow-card"
              >
                <span className="text-sm font-bold text-brand-500">{step.n}</span>
                <h3 className="mt-3 font-semibold text-ink">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative mx-auto max-w-6xl px-6 py-20">
        <div data-aos="fade-up" className="mb-12 max-w-2xl">
          <h2 className="text-3xl font-bold text-ink">Yang dideteksi</h2>
          <p className="mt-3 text-slate">Lima kategori temuan di setiap laporan.</p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {detectItems.map((item, i) => (
            <div
              key={item.title}
              data-aos="fade-up"
              data-aos-delay={(i % 3) * 120}
              className="group rounded-xl2 border border-line bg-white p-6 transition-soft hover:-translate-y-1 hover:shadow-card"
            >
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-full bg-brand-50 text-brand-600 transition-soft group-hover:bg-brand-600 group-hover:text-white">
                <i className={`fa-solid ${item.icon}`} />
              </div>
              <h3 className="font-semibold text-ink">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="relative mx-auto max-w-6xl px-6 py-20">
        <div
          data-aos="fade-up"
          className="rounded-xl2 border border-line bg-gradient-to-br from-mist to-white p-6 sm:p-10"
        >
          <div className="mb-6 flex items-center gap-2 text-sm font-medium text-brand-700">
            <i className="fa-solid fa-shield-heart" />
            Batasan yang jujur
          </div>
          <div className="grid gap-6 sm:grid-cols-3">
            <p className="text-sm leading-relaxed text-slate">
              Animasi runtime murni lewat JavaScript kadang tidak sepenuhnya terdeteksi dari HTML statis.
            </p>
            <p className="text-sm leading-relaxed text-slate">
              Laporan di-cache singkat (10–20 menit) per URL supaya tidak membebani situs target berulang kali.
            </p>
            <p className="text-sm leading-relaxed text-slate">
              Ini alat pembaca sinyal, bukan alat audit hukum atau keamanan. Anggap sebagai titik awal riset.
            </p>
          </div>
        </div>
      </section>

      <section className="relative mx-auto max-w-4xl px-6 pb-28 pt-4 text-center">
        <div data-aos="zoom-in" className="rounded-xl2 border border-line bg-ink px-8 py-14 text-white">
          <h2 className="text-2xl font-bold sm:text-3xl">Coba analisis satu situs sekarang</h2>
          <p className="mx-auto mt-3 max-w-md text-sm text-white/70">
            Tidak perlu instal apa pun. Cukup satu URL, dan laporan strukturnya siap dalam hitungan detik.
          </p>
          <Link
            href="/analyzer"
            className="group mt-8 inline-flex items-center gap-2.5 rounded-full bg-brand-600 px-7 py-3.5 font-semibold text-white shadow-soft transition-soft hover:-translate-y-0.5 hover:bg-brand-500"
          >
            Mulai Analisis
            <i className="fa-solid fa-arrow-right-long transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>
      </section>

      <footer className="border-t border-line py-8">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-6 text-sm text-slate-light sm:flex-row">
          <span>Web Design Inspector</span>
          <span>dibuat oleh fidzzcodex</span>
        </div>
      </footer>
    </main>
  )
}
