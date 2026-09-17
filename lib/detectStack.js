const STACK_SIGNATURES = [
  { name: 'Next.js', confidence: 'high', test: (ctx) => ctx.html.includes('__NEXT_DATA__') || ctx.scripts.some((s) => s.includes('/_next/')) },
  { name: 'Nuxt', confidence: 'high', test: (ctx) => ctx.html.includes('__NUXT__') || ctx.scripts.some((s) => s.includes('/_nuxt/')) },
  { name: 'Gatsby', confidence: 'high', test: (ctx) => ctx.html.includes('___gatsby') || ctx.scripts.some((s) => s.includes('/page-data/')) },
  { name: 'WordPress', confidence: 'high', test: (ctx) => ctx.generator.toLowerCase().includes('wordpress') || ctx.stylesheets.some((s) => s.includes('/wp-content/')) },
  { name: 'Shopify', confidence: 'high', test: (ctx) => ctx.html.includes('cdn.shopify.com') || ctx.html.includes('Shopify.theme') },
  { name: 'Webflow', confidence: 'high', test: (ctx) => ctx.html.includes('data-wf-page') || ctx.html.includes('webflow.js') },
  { name: 'React', confidence: 'medium', test: (ctx) => ctx.html.includes('data-reactroot') || ctx.scripts.some((s) => /react-dom/.test(s)) },
  { name: 'Vue', confidence: 'medium', test: (ctx) => ctx.html.includes('data-v-') || ctx.scripts.some((s) => /vue(\.runtime)?(\.min)?\.js/.test(s)) },
  { name: 'jQuery', confidence: 'medium', test: (ctx) => ctx.scripts.some((s) => /jquery/.test(s)) },
  {
    name: 'Bootstrap',
    confidence: 'medium',
    test: (ctx) => ctx.stylesheets.some((s) => /bootstrap/.test(s)) || ctx.classSample.some((c) => c === 'container' || c.startsWith('col-'))
  },
  {
    name: 'Tailwind CSS',
    confidence: 'medium',
    test: (ctx) => {
      const tailwindLike = ctx.classSample.filter((c) =>
        /^(flex|grid|px-\d|py-\d|text-(xs|sm|base|lg|xl)|bg-\w+-\d{3}|rounded(-\w+)?)$/.test(c)
      )
      return tailwindLike.length >= 8
    }
  }
]

export function detectStack(ctx) {
  const results = []
  for (const sig of STACK_SIGNATURES) {
    if (sig.test(ctx)) {
      results.push({ name: sig.name, confidence: sig.confidence })
    }
  }
  return results
}
