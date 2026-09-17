'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Aos from 'aos'

const HISTORY_KEY = 'wdi_history_v1'
const MAX_HISTORY = 10

function reportToMarkdown(report) {
  const lines = []
  lines.push(`# Laporan: ${report.finalUrl}`)
  lines.push('')
  lines.push(`Dianalisis pada: ${new Date(report.analyzedAt).toLocaleString('id-ID')}`)
  lines.push(`Mode: ${report.mode}${report.renderFallback ? ' (fallback dari render)' : ''}`)
  lines.push('')
  lines.push('## Overview')
  lines.push(`- Title: ${report.overview.title || '-'}`)
  lines.push(`- Description: ${report.overview.description || '-'}`)
  lines.push(`- Theme color: ${report.overview.themeColor || '-'}`)
  lines.push('')
  lines.push('## Colors')
  if (report.colors.palette.length) {
    for (const c of report.colors.palette) {
      lines.push(`- ${c.hex} (${c.role})`)
    }
  } else {
    lines.push('- Tidak terdeteksi')
  }
  lines.push('')
  lines.push('## Typography')
  if (report.fonts.length) {
    for (const f of report.fonts) {
      lines.push(`- ${f.family} (${f.source})`)
    }
  } else {
    lines.push('- Tidak terdeteksi')
  }
  lines.push('')
  lines.push('## Motion')
  lines.push(`- Libraries: ${report.motion.libraries.join(', ') || '-'}`)
  for (const s of report.motion.cssSignals) {
    lines.push(`- ${s}`)
  }
  lines.push('')
  lines.push('## Layout')
  for (const s of report.layout.signals) {
    lines.push(`- ${s}`)
  }
  lines.push('')
  lines.push('## Stack guess')
  if (report.stack.length) {
    for (const s of report.stack) {
      lines.push(`- ${s.name} (${s.confidence})`)
    }
  } else {
    lines.push('- Tidak terdeteksi')
  }
  lines.push('')
  lines.push('## Assets')
  lines.push(`- Scripts: ${report.assets.scripts}`)
  lines.push(`- Stylesheets: ${report.assets.stylesheets}`)
  if (report.notes.length) {
    lines.push('')
    lines.push('## Notes')
    for (const n of report.notes) {
      lines.push(`- ${n}`)
    }
  }
  return lines.join('\n')
}

function loadHistory() {
  try {
    const raw = window.localStorage.getItem(HISTORY_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function saveHistory(items) {
  try {
    window.localStorage.setItem(HISTORY_KEY, JSON.stringify(items))
  } catch {
    return
  }
}

export default function AnalyzerPage() {
  const [url, setUrl] = useState('')
  const [mode, setMode] = useState('render')
  const [status, setStatus] = useState('idle')
  const [report, setReport] = useState(null)
  const [errorMessage, setErrorMessage] = useState('')
  const [history, setHistory] = useState([])
  const [copied, setCopied] = useState('')

  useEffect(() => {
    setHistory(loadHistory())
  }, [])

  useEffect(() => {
    if (status === 'success' && report) {
      const timer = setTimeout(() => Aos.refreshHard(), 50)
      return () => clearTimeout(timer)
    }
  }, [status, report])

  async function handleAnalyze(e) {
    e.preventDefault()
    if (!url.trim() || status === 'loading') return

    setStatus('loading')
    setErrorMessage('')

    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url, mode })
      })
      const data = await res.json()

      if (!data.ok) {
        setStatus('error')
        setErrorMessage(data.message || 'Terjadi kesalahan saat menganalisis.')
        return
      }

      setReport(data)
      setStatus('success')

      const nextHistory = [
        { url: data.finalUrl, analyzedAt: data.analyzedAt, report: data },
        ...history.filter((h) => h.url !== data.finalUrl)
      ].slice(0, MAX_HISTORY)
      setHistory(nextHistory)
      saveHistory(nextHistory)
    } catch {
      setStatus('error')
      setErrorMessage('Gagal menghubungi server. Coba lagi sebentar.')
    }
  }

  function openHistoryItem(item) {
    setReport(item.report)
    setUrl(item.url)
    setStatus('success')
  }

  function removeHistoryItem(targetUrl) {
    const next = history.filter((h) => h.url !== targetUrl)
    setHistory(next)
    saveHistory(next)
  }

  function clearHistory() {
    setHistory([])
    saveHistory([])
  }

  async function copyText(text, key) {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(key)
      setTimeout(() => setCopied(''), 1800)
    } catch {
      return
    }
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-white">
      <div className="pointer-events-none absolute -top-32 right-0 h-[360px] w-[360px] rounded-full bg-brand-50 blur-3xl animate-float-soft" />

      <div className="relative mx-auto max-w-5xl px-6 py-16">
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-slate transition-soft hover:text-brand-600">
          <i className="fa-solid fa-arrow-left-long" />
          Kembali ke beranda
        </Link>

        <div data-aos="fade-up" className="mt-8 text-center">
          <h1 className="text-3xl font-bold text-ink sm:text-4xl">Analisis struktur desain situs</h1>
          <p className="mx-auto mt-3 max-w-xl text-slate">
            Masukkan URL lengkap, lalu tekan mulai. Fetch dilakukan di server.
          </p>
        </div>

        <form
          onSubmit={handleAnalyze}
          data-aos="fade-up"
          data-aos-delay="100"
          className="mx-auto mt-10 flex max-w-2xl flex-col gap-3 sm:flex-row"
        >
          <div className="relative flex-1">
            <i className="fa-solid fa-link pointer-events-none absolute left-5 top-1/2 -translate-y-1/2 text-slate-light" />
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://contoh-situs.com"
              className="w-full rounded-full border border-line bg-white py-4 pl-12 pr-5 text-ink outline-none transition-soft placeholder:text-slate-light focus:border-brand-500 focus:ring-4 focus:ring-brand-50"
            />
          </div>
          <button
            type="submit"
            disabled={status === 'loading'}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-brand-600 px-8 py-4 font-semibold text-white shadow-soft transition-soft hover:-translate-y-0.5 hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:translate-y-0"
          >
            {status === 'loading' ? (
              <>
                <i className="fa-solid fa-circle-notch animate-spin" />
                Menganalisis
              </>
            ) : (
              <>
                Mulai
                <i className="fa-solid fa-arrow-right" />
              </>
            )}
          </button>
        </form>

        <div data-aos="fade-up" data-aos-delay="150" className="mx-auto mt-4 flex max-w-2xl items-center justify-center gap-2">
          <div className="inline-flex rounded-full border border-line bg-mist p-1">
            <button
              type="button"
              onClick={() => setMode('render')}
              className={`inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium transition-soft ${
                mode === 'render' ? 'bg-white text-brand-700 shadow-sm' : 'text-slate hover:text-ink'
              }`}
            >
              <i className="fa-solid fa-wand-magic-sparkles" />
              Render JS
            </button>
            <button
              type="button"
              onClick={() => setMode('static')}
              className={`inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium transition-soft ${
                mode === 'static' ? 'bg-white text-brand-700 shadow-sm' : 'text-slate hover:text-ink'
              }`}
            >
              <i className="fa-solid fa-bolt" />
              Static (cepat)
            </button>
          </div>
        </div>
        <p className="mt-2 text-center text-xs text-slate-light">
          {mode === 'render'
            ? 'Halaman dirender pakai headless browser — lebih akurat untuk animasi & warna runtime, tapi lebih lambat.'
            : 'Ambil HTML mentah langsung — jauh lebih cepat, tapi animasi/warna yang dipasang lewat JS bisa terlewat.'}
        </p>

        {status === 'loading' && (
          <div className="mx-auto mt-14 max-w-2xl animate-fade-in-up space-y-3">
            {[100, 90, 75, 85].map((w, i) => (
              <div
                key={i}
                className="h-4 rounded-full bg-gradient-to-r from-mist via-brand-50 to-mist animate-shimmer"
                style={{ width: `${w}%` }}
              />
            ))}
            <p className="pt-4 text-center text-sm text-slate-light">
              <i className="fa-solid fa-server mr-2 text-brand-500" />
              Mengambil dan mem-parsing halaman...
            </p>
          </div>
        )}

        {status === 'error' && (
          <div data-aos="fade-up" className="mx-auto mt-10 max-w-2xl rounded-xl2 border border-red-200 bg-red-50 p-6 text-center">
            <i className="fa-solid fa-triangle-exclamation mb-2 text-xl text-red-500" />
            <p className="font-medium text-red-700">{errorMessage}</p>
          </div>
        )}

        {status === 'success' && report && (
          <div className="mx-auto mt-14 max-w-4xl space-y-6">
            <div data-aos="fade-up" className="flex flex-wrap items-center justify-between gap-3 rounded-xl2 border border-line bg-mist px-6 py-4">
              <div>
                <p className="text-sm text-slate-light">Hasil untuk</p>
                <p className="font-semibold text-ink">{report.finalUrl}</p>
                <span
                  className={`mt-2 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${
                    report.renderFallback
                      ? 'bg-amber-50 text-amber-700'
                      : report.mode === 'render'
                        ? 'bg-brand-50 text-brand-700'
                        : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  <i className={`fa-solid ${report.mode === 'render' ? 'fa-wand-magic-sparkles' : 'fa-bolt'}`} />
                  {report.renderFallback
                    ? 'Mode render gagal, pakai static (fallback)'
                    : report.mode === 'render'
                      ? 'Mode: Render JS'
                      : 'Mode: Static'}
                </span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => copyText(reportToMarkdown(report), 'md')}
                  className="rounded-full border border-line bg-white px-4 py-2 text-sm font-medium text-ink transition-soft hover:border-brand-300 hover:text-brand-600"
                >
                  <i className="fa-solid fa-copy mr-1.5" />
                  {copied === 'md' ? 'Tersalin!' : 'Salin Markdown'}
                </button>
                <button
                  onClick={() => copyText(JSON.stringify(report, null, 2), 'json')}
                  className="rounded-full border border-line bg-white px-4 py-2 text-sm font-medium text-ink transition-soft hover:border-brand-300 hover:text-brand-600"
                >
                  <i className="fa-solid fa-code mr-1.5" />
                  {copied === 'json' ? 'Tersalin!' : 'Salin JSON'}
                </button>
              </div>
            </div>

            <div data-aos="fade-up" className="rounded-xl2 border border-line bg-white p-6">
              <h2 className="mb-4 flex items-center gap-2 font-semibold text-ink">
                <i className="fa-solid fa-circle-info text-brand-500" />
                Overview
              </h2>
              <dl className="grid gap-4 text-sm sm:grid-cols-2">
                <div>
                  <dt className="text-slate-light">Title</dt>
                  <dd className="mt-0.5 text-ink">{report.overview.title || '-'}</dd>
                </div>
                <div>
                  <dt className="text-slate-light">Theme color</dt>
                  <dd className="mt-0.5 text-ink">{report.overview.themeColor || '-'}</dd>
                </div>
                <div className="sm:col-span-2">
                  <dt className="text-slate-light">Description</dt>
                  <dd className="mt-0.5 text-ink">{report.overview.description || '-'}</dd>
                </div>
              </dl>
            </div>

            <div data-aos="fade-up" className="rounded-xl2 border border-line bg-white p-6">
              <h2 className="mb-4 flex items-center gap-2 font-semibold text-ink">
                <i className="fa-solid fa-palette text-brand-500" />
                Colors
                <span className="ml-auto rounded-full bg-mist px-2.5 py-0.5 text-xs font-medium text-brand-700">
                  {report.colors.modeGuess}
                </span>
              </h2>
              {report.colors.palette.length ? (
                <div className="flex flex-wrap gap-3">
                  {report.colors.palette.map((c) => (
                    <button
                      key={c.hex}
                      onClick={() => copyText(c.hex, c.hex)}
                      className="group flex flex-col items-center gap-2 transition-soft hover:-translate-y-1"
                    >
                      <span
                        className="h-12 w-12 rounded-xl border border-line shadow-sm"
                        style={{ backgroundColor: c.hex }}
                      />
                      <span className="text-xs text-slate">{copied === c.hex ? 'Tersalin' : c.hex}</span>
                    </button>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-slate-light">Tidak terdeteksi.</p>
              )}
            </div>

            <div data-aos="fade-up" className="rounded-xl2 border border-line bg-white p-6">
              <h2 className="mb-4 flex items-center gap-2 font-semibold text-ink">
                <i className="fa-solid fa-font text-brand-500" />
                Typography
              </h2>
              {report.fonts.length ? (
                <div className="flex flex-wrap gap-2">
                  {report.fonts.map((f) => (
                    <span
                      key={f.family}
                      className="rounded-full border border-line px-3 py-1.5 text-sm text-ink"
                    >
                      {f.family} <span className="text-slate-light">· {f.source}</span>
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-slate-light">Tidak terdeteksi.</p>
              )}
            </div>

            <div data-aos="fade-up" className="rounded-xl2 border border-line bg-white p-6">
              <h2 className="mb-4 flex items-center gap-2 font-semibold text-ink">
                <i className="fa-solid fa-wand-magic-sparkles text-brand-500" />
                Motion
              </h2>
              <div className="flex flex-wrap gap-2">
                {report.motion.libraries.map((lib) => (
                  <span key={lib} className="rounded-full bg-brand-50 px-3 py-1.5 text-sm text-brand-700">
                    {lib}
                  </span>
                ))}
                {!report.motion.libraries.length && (
                  <span className="text-sm text-slate-light">Tidak ada library motion terdeteksi.</span>
                )}
              </div>
              {report.motion.cssSignals.length > 0 && (
                <ul className="mt-4 space-y-1.5 text-sm text-slate">
                  {report.motion.cssSignals.map((s) => (
                    <li key={s}>
                      <i className="fa-solid fa-circle-dot mr-2 text-[6px] text-brand-400 align-middle" />
                      {s}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div data-aos="fade-up" className="rounded-xl2 border border-line bg-white p-6">
              <h2 className="mb-4 flex items-center gap-2 font-semibold text-ink">
                <i className="fa-solid fa-diagram-project text-brand-500" />
                Layout
              </h2>
              <ul className="space-y-1.5 text-sm text-slate">
                {report.layout.signals.map((s) => (
                  <li key={s}>
                    <i className="fa-solid fa-circle-dot mr-2 text-[6px] text-brand-400 align-middle" />
                    {s}
                  </li>
                ))}
              </ul>
            </div>

            <div data-aos="fade-up" className="rounded-xl2 border border-line bg-white p-6">
              <h2 className="mb-4 flex items-center gap-2 font-semibold text-ink">
                <i className="fa-solid fa-boxes-stacked text-brand-500" />
                Stack guess
              </h2>
              {report.stack.length ? (
                <div className="flex flex-wrap gap-2">
                  {report.stack.map((s) => (
                    <span key={s.name} className="inline-flex items-center gap-2 rounded-full bg-ink px-3 py-1.5 text-sm text-white">
                      {s.name}
                      <span className="text-brand-200">· {s.confidence}</span>
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-slate-light">Tidak terdeteksi.</p>
              )}
              <div className="mt-5 grid grid-cols-2 gap-4 border-t border-line pt-5 text-sm">
                <div>
                  <p className="text-slate-light">Scripts</p>
                  <p className="font-semibold text-ink">{report.assets.scripts}</p>
                </div>
                <div>
                  <p className="text-slate-light">Stylesheets</p>
                  <p className="font-semibold text-ink">{report.assets.stylesheets}</p>
                </div>
              </div>
            </div>

            {report.notes.length > 0 && (
              <div data-aos="fade-up" className="rounded-xl2 border border-brand-100 bg-brand-50/60 p-6">
                <h2 className="mb-3 flex items-center gap-2 font-semibold text-brand-700">
                  <i className="fa-solid fa-shield-heart" />
                  Catatan
                </h2>
                <ul className="space-y-1.5 text-sm text-brand-700/90">
                  {report.notes.map((n) => (
                    <li key={n}>{n}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {history.length > 0 && (
          <div data-aos="fade-up" className="mx-auto mt-16 max-w-4xl">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="flex items-center gap-2 font-semibold text-ink">
                <i className="fa-solid fa-clock-rotate-left text-brand-500" />
                Riwayat
              </h2>
              <button onClick={clearHistory} className="text-sm text-slate-light transition-soft hover:text-red-500">
                Hapus semua
              </button>
            </div>
            <div className="scrollbar-thin flex gap-3 overflow-x-auto pb-2">
              {history.map((h) => (
                <div
                  key={h.url}
                  className="group relative min-w-[220px] shrink-0 rounded-xl2 border border-line bg-white p-4 transition-soft hover:border-brand-300 hover:shadow-card"
                >
                  <button onClick={() => openHistoryItem(h)} className="block w-full text-left">
                    <p className="truncate text-sm font-medium text-ink">{h.url}</p>
                    <p className="mt-1 text-xs text-slate-light">
                      {new Date(h.analyzedAt).toLocaleString('id-ID')}
                    </p>
                  </button>
                  <button
                    onClick={() => removeHistoryItem(h.url)}
                    className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full text-slate-light opacity-0 transition-soft hover:bg-red-50 hover:text-red-500 group-hover:opacity-100"
                  >
                    <i className="fa-solid fa-xmark text-xs" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
