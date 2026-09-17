import * as cheerio from 'cheerio'

export function parseDom(html) {
  const $ = cheerio.load(html)

  const title = $('title').first().text().trim()
  const description = $('meta[name="description"]').attr('content') || ''
  const themeColor = $('meta[name="theme-color"]').attr('content') || ''
  const viewport = $('meta[name="viewport"]').attr('content') || ''
  const generator = $('meta[name="generator"]').attr('content') || ''
  const lang = $('html').attr('lang') || ''
  const dir = $('html').attr('dir') || ''

  const scripts = $('script[src]').map((_, el) => $(el).attr('src')).get().filter(Boolean)
  const stylesheets = $('link[rel="stylesheet"]').map((_, el) => $(el).attr('href')).get().filter(Boolean)
  const styleBlocks = $('style').map((_, el) => $(el).html() || '').get()
  const inlineStyles = $('[style]').map((_, el) => $(el).attr('style') || '').get()

  const classAttr = $('[class]').map((_, el) => $(el).attr('class') || '').get()
  const classSample = classAttr.join(' ').split(/\s+/).filter(Boolean)

  const favicon = $('link[rel="icon"], link[rel="shortcut icon"]').attr('href') || ''
  const ogImage = $('meta[property="og:image"]').attr('content') || ''

  const landmarks = {
    header: $('header').length,
    nav: $('nav').length,
    main: $('main').length,
    footer: $('footer').length
  }

  const dataAttrs = $('[data-aos], [data-framer-name], [data-motion], [data-scroll]').length

  return {
    title,
    description,
    themeColor,
    viewport,
    generator,
    lang,
    dir,
    scripts,
    stylesheets,
    styleBlocks,
    inlineStyles,
    classSample,
    favicon,
    ogImage,
    landmarks,
    dataAttrs
  }
}
