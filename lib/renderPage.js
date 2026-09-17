import puppeteer from 'puppeteer-core'
import chromium from '@sparticuz/chromium'
import { isBotChallengePage } from './fetchPage'

const USER_AGENT =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36'

async function resolveExecutablePath() {
  if (process.env.CHROME_EXECUTABLE_PATH) {
    return process.env.CHROME_EXECUTABLE_PATH
  }
  return chromium.executablePath()
}

export async function renderPage(url, { timeoutMs = 20000, settleMs = 900 } = {}) {
  const executablePath = await resolveExecutablePath()

  const browser = await puppeteer.launch({
    args: chromium.args,
    defaultViewport: { width: 1366, height: 900 },
    executablePath,
    headless: chromium.headless
  })

  try {
    const page = await browser.newPage()
    await page.setUserAgent(USER_AGENT)
    await page.setExtraHTTPHeaders({ 'Accept-Language': 'id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7' })
    page.setDefaultNavigationTimeout(timeoutMs)
    page.setDefaultTimeout(timeoutMs)

    const response = await page.goto(url, {
      waitUntil: 'networkidle2',
      timeout: timeoutMs
    })

    await new Promise((resolve) => setTimeout(resolve, settleMs))

    const html = await page.content()
    const finalUrl = page.url()
    const status = response ? response.status() : 200

    return {
      html,
      finalUrl,
      status,
      challenge: isBotChallengePage(html)
    }
  } finally {
    await browser.close()
  }
}
