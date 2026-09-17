import { parseDom } from './parseDom'
import { detectColors } from './detectColors'
import { detectFonts } from './detectFonts'
import { detectMotion } from './detectMotion'
import { detectStack } from './detectStack'
import { detectLayout } from './detectLayout'

export function buildReport({ html, finalUrl, status, requestedUrl, mode = 'static', renderFallback = false, challenge = false }) {
  const dom = parseDom(html)

  const colors = detectColors(dom)
  const fonts = detectFonts(dom)
  const motion = detectMotion(dom)
  const stack = detectStack({ ...dom, html })
  const layout = detectLayout(dom)

  const notes = []
  if (mode === 'static' && !motion.libraries.length && !motion.cssSignals.length) {
    notes.push('Tidak ada signal animasi statis. Coba mode render (JS) untuk menangkap animasi runtime.')
  }
  if (!colors.palette.length) {
    notes.push('Warna sulit dideteksi — situs kemungkinan styling lewat file CSS eksternal yang tidak diparsing penuh.')
  }
  if (!fonts.length) {
    notes.push('Font tidak terdeteksi eksplisit — kemungkinan memakai font sistem atau dimuat lewat JS.')
  }
  if (renderFallback) {
    notes.push('Rendering JS gagal atau timeout — laporan ini memakai HTML statis sebagai fallback.')
  }
  if (challenge) {
    notes.push('Konten terindikasi halaman proteksi bot/captcha (mis. Cloudflare challenge) — hasil bisa tidak akurat.')
  }

  return {
    ok: true,
    analyzedAt: new Date().toISOString(),
    url: requestedUrl,
    finalUrl,
    status,
    mode,
    renderFallback,
    overview: {
      title: dom.title,
      description: dom.description,
      themeColor: dom.themeColor,
      lang: dom.lang,
      dir: dom.dir
    },
    colors,
    fonts,
    motion,
    layout,
    stack,
    assets: {
      scripts: dom.scripts.length,
      stylesheets: dom.stylesheets.length,
      favicon: dom.favicon,
      ogImage: dom.ogImage
    },
    notes
  }
}
