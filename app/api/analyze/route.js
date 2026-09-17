import { NextResponse } from 'next/server'
import { fetchPage } from '@/lib/fetchPage'
import { renderPage } from '@/lib/renderPage'
import { buildReport } from '@/lib/buildReport'

export const runtime = 'nodejs'
export const maxDuration = 60

const cache = new Map()
const CACHE_TTL_MS = 20 * 60 * 1000

function normalizeUrl(input) {
  let value = input.trim()
  if (!/^https?:\/\//i.test(value)) {
    value = `https://${value}`
  }
  return value
}

function cacheKeyFor(url, mode) {
  return `${mode}:${url}`
}

function getFromCache(key) {
  const entry = cache.get(key)
  if (!entry) return null
  if (Date.now() - entry.timestamp > CACHE_TTL_MS) {
    cache.delete(key)
    return null
  }
  return entry.report
}

export async function POST(request) {
  let body

  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ ok: false, code: 'INVALID_URL', message: 'Body request tidak valid.' }, { status: 400 })
  }

  const rawUrl = typeof body?.url === 'string' ? body.url : ''
  const requestedMode = body?.mode === 'static' ? 'static' : 'render'

  if (!rawUrl) {
    return NextResponse.json({ ok: false, code: 'INVALID_URL', message: 'URL wajib diisi.' }, { status: 400 })
  }

  const normalized = normalizeUrl(rawUrl)

  let parsedUrl
  try {
    parsedUrl = new URL(normalized)
  } catch {
    return NextResponse.json({ ok: false, code: 'INVALID_URL', message: 'Format URL tidak valid.' }, { status: 400 })
  }

  if (!/^https?:$/.test(parsedUrl.protocol)) {
    return NextResponse.json({ ok: false, code: 'INVALID_URL', message: 'Hanya URL http/https yang didukung.' }, { status: 400 })
  }

  const target = parsedUrl.toString()
  const cacheKey = cacheKeyFor(target, requestedMode)
  const cached = getFromCache(cacheKey)
  if (cached) {
    return NextResponse.json(cached)
  }

  let page = null
  let mode = 'static'
  let renderFallback = false
  let lastError = null

  if (requestedMode === 'render') {
    try {
      page = await renderPage(target)
      mode = 'render'
    } catch (err) {
      lastError = err
      renderFallback = true
    }
  }

  if (!page) {
    try {
      page = await fetchPage(target)
      mode = requestedMode === 'render' ? 'static' : 'static'
    } catch (err) {
      const code = err.code || 'FETCH_FAILED'
      const messages = {
        TIMEOUT: 'Situs tidak merespons dalam waktu yang wajar.',
        FORBIDDEN: 'Situs menolak akses (401/403).',
        NOT_HTML: 'Konten yang dituju bukan halaman HTML.',
        REQUEST_FAILED: `Situs merespons dengan status ${err.status || 'error'}.`,
        FETCH_FAILED: 'Gagal mengambil halaman. Coba periksa kembali URL-nya.'
      }
      const httpStatus = code === 'TIMEOUT' ? 504 : code === 'FORBIDDEN' ? 403 : code === 'NOT_HTML' ? 415 : 502
      return NextResponse.json({ ok: false, code, message: messages[code] || 'Terjadi kesalahan.' }, { status: httpStatus })
    }
  }

  const report = buildReport({
    html: page.html,
    finalUrl: page.finalUrl,
    status: page.status,
    requestedUrl: target,
    mode,
    renderFallback,
    challenge: Boolean(page.challenge)
  })

  cache.set(cacheKey, { report, timestamp: Date.now() })
  return NextResponse.json(report)
}
