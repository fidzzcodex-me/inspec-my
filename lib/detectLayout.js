export function detectLayout({ viewport, landmarks, classSample, styleBlocks, inlineStyles }) {
  const signals = []

  signals.push(viewport ? 'Meta viewport ditemukan (responsive-ready)' : 'Meta viewport tidak ditemukan')

  const { header, nav, main, footer } = landmarks
  signals.push(`Landmark: ${header} header, ${nav} nav, ${main} main, ${footer} footer`)

  const classFreq = new Map()
  for (const c of classSample) {
    classFreq.set(c, (classFreq.get(c) || 0) + 1)
  }
  const cardLikeClasses = [...classFreq.entries()].filter(([name, count]) => /card|tile|item/i.test(name) && count >= 3)
  if (cardLikeClasses.length) {
    signals.push(`Pola card-like pada class: ${cardLikeClasses.map(([n]) => n).slice(0, 5).join(', ')}`)
  }

  const cssSource = [...styleBlocks, ...inlineStyles].join(' ')
  const radiusCount = (cssSource.match(/border-radius\s*:/g) || []).length
  const shadowCount = (cssSource.match(/box-shadow\s*:/g) || []).length
  signals.push(`Densitas border-radius: ${radiusCount}, box-shadow: ${shadowCount}`)

  return { signals }
}
