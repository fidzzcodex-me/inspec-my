const LIBRARY_SIGNATURES = [
  { name: 'AOS', pattern: /aos(\.min)?\.js/i },
  { name: 'GSAP', pattern: /gsap(\.min)?\.js/i },
  { name: 'Framer Motion', pattern: /framer-motion/i },
  { name: 'Anime.js', pattern: /anime(\.min)?\.js/i },
  { name: 'Lottie', pattern: /lottie(-web)?(\.min)?\.js/i },
  { name: 'Animate.css', pattern: /animate(\.min)?\.css/i },
  { name: 'Motion One', pattern: /motion(\.min)?\.js|@motionone/i },
  { name: 'ScrollReveal', pattern: /scrollreveal/i },
  { name: 'Swiper', pattern: /swiper(\.min)?\.js/i }
]

export function detectMotion({ scripts, stylesheets, dataAttrs, styleBlocks, inlineStyles }) {
  const sourcesToCheck = [...scripts, ...stylesheets].filter(Boolean)
  const libraries = []

  for (const sig of LIBRARY_SIGNATURES) {
    if (sourcesToCheck.some((src) => sig.pattern.test(src))) {
      libraries.push(sig.name)
    }
  }

  const cssSource = [...styleBlocks, ...inlineStyles].join(' ')
  const keyframeCount = (cssSource.match(/@keyframes/g) || []).length
  const animationCount = (cssSource.match(/\banimation\s*:/g) || []).length
  const transitionCount = (cssSource.match(/\btransition\s*:/g) || []).length
  const scrollTimelineCount = (cssSource.match(/scroll-timeline/g) || []).length

  const cssSignals = []
  if (keyframeCount) cssSignals.push(`${keyframeCount} blok @keyframes`)
  if (animationCount) cssSignals.push(`${animationCount} deklarasi animation`)
  if (transitionCount) cssSignals.push(`${transitionCount} deklarasi transition`)
  if (scrollTimelineCount) cssSignals.push(`${scrollTimelineCount} scroll-timeline`)
  if (dataAttrs) cssSignals.push(`${dataAttrs} elemen dengan atribut data-aos/data-motion/data-scroll`)

  return { libraries, cssSignals }
}
