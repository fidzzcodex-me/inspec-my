export function detectFonts({ stylesheets, styleBlocks, inlineStyles }) {
  const fonts = []

  const googleLinks = stylesheets.filter((href) => href && href.includes('fonts.googleapis.com'))
  for (const href of googleLinks) {
    try {
      const url = new URL(href, 'https://example.com')
      const familyParam = url.searchParams.get('family')
      if (familyParam) {
        const names = familyParam.split('|').map((f) => f.split(':')[0].replace(/\+/g, ' '))
        for (const name of names) {
          fonts.push({ family: name, source: 'google' })
        }
      }
    } catch {
      fonts.push({ family: 'Google Font (tidak terbaca)', source: 'google' })
    }
  }

  const cssSource = styleBlocks.join(' ')
  const fontFaceBlocks = cssSource.match(/@font-face\s*{[^}]*}/g) || []
  for (const block of fontFaceBlocks) {
    const nameMatch = block.match(/font-family:\s*['"]?([^;'"}]+)['"]?/)
    if (nameMatch) {
      fonts.push({ family: nameMatch[1].trim(), source: 'self-hosted' })
    }
  }

  const familySource = [cssSource, ...inlineStyles].join(' ')
  const familyMatches = familySource.match(/font-family:\s*([^;{}"']+)/g) || []
  for (const m of familyMatches) {
    const value = m.replace('font-family:', '').trim()
    const first = value.split(',')[0].replace(/['"]/g, '').trim()
    if (first && !/var\(/.test(first)) {
      fonts.push({ family: first, source: 'css' })
    }
  }

  const seen = new Set()
  const unique = []
  for (const f of fonts) {
    const key = f.family.toLowerCase()
    if (key && !seen.has(key)) {
      seen.add(key)
      unique.push(f)
    }
  }

  return unique.slice(0, 10)
}
