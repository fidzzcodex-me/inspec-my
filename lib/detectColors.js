function hexToLuminance(hex) {
  let c = hex.replace('#', '')
  if (c.length === 3) c = c.split('').map((x) => x + x).join('')
  if (c.length !== 6) return null
  const r = parseInt(c.slice(0, 2), 16) / 255
  const g = parseInt(c.slice(2, 4), 16) / 255
  const b = parseInt(c.slice(4, 6), 16) / 255
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

export function detectColors({ styleBlocks, inlineStyles, themeColor }) {
  const source = [...styleBlocks, ...inlineStyles].join(' ')
  const hexMatches = source.match(/#(?:[0-9a-fA-F]{6}|[0-9a-fA-F]{3})\b/g) || []
  const rgbMatches = source.match(/rgba?\([^)]+\)/g) || []

  const freq = new Map()
  for (const hex of hexMatches) {
    const key = hex.toLowerCase()
    freq.set(key, (freq.get(key) || 0) + 1)
  }

  const sorted = [...freq.entries()].sort((a, b) => b[1] - a[1])
  const palette = sorted.slice(0, 8).map(([hex, count]) => {
    const lum = hexToLuminance(hex)
    let role = 'accent'
    if (lum !== null) {
      if (lum > 0.85) role = 'background'
      else if (lum < 0.15) role = 'text'
    }
    return { hex, count, role }
  })

  if (themeColor) {
    const normalized = themeColor.toLowerCase()
    if (!palette.find((p) => p.hex === normalized)) {
      palette.unshift({ hex: normalized, count: 0, role: 'theme' })
    }
  }

  const bgCandidates = palette.filter((p) => p.role === 'background')
  const textCandidates = palette.filter((p) => p.role === 'text')
  const hasDark = palette.some((p) => {
    const lum = hexToLuminance(p.hex)
    return lum !== null && lum < 0.2
  })

  const modeGuess = bgCandidates.length && textCandidates.length ? 'light' : hasDark ? 'dark' : 'light'

  return {
    palette: palette.slice(0, 8),
    modeGuess,
    rgbSampleCount: rgbMatches.length
  }
}
