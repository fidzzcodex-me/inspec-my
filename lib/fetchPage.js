const CHALLENGE_PATTERNS = [
  /just a moment/i,
  /checking your browser/i,
  /cf-browser-verification/i,
  /attention required[\s\S]{0,40}cloudflare/i,
  /verify you are human/i,
  /enable javascript and cookies/i
]

export function isBotChallengePage(html) {
  return CHALLENGE_PATTERNS.some((pattern) => pattern.test(html))
}

async function attemptFetch(url, timeoutMs) {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), timeoutMs)

  try {
    return await fetch(url, {
      signal: controller.signal,
      redirect: 'follow',
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7'
      }
    })
  } finally {
    clearTimeout(timeout)
  }
}

export async function fetchPage(url, { timeoutMs = 14000, retries = 1 } = {}) {
  let response
  let lastError

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      response = await attemptFetch(url, timeoutMs)
      lastError = null
      break
    } catch (err) {
      lastError = err
      if (err.name === 'AbortError') {
        const e = new Error('Request timeout')
        e.code = 'TIMEOUT'
        throw e
      }
    }
  }

  if (!response) {
    const e = new Error('Fetch failed')
    e.code = 'FETCH_FAILED'
    throw e
  }

  if (response.status === 401 || response.status === 403) {
    const e = new Error('Access forbidden')
    e.code = 'FORBIDDEN'
    throw e
  }

  if (!response.ok) {
    const e = new Error(`Request failed with status ${response.status}`)
    e.code = 'REQUEST_FAILED'
    e.status = response.status
    throw e
  }

  const contentType = response.headers.get('content-type') || ''
  if (!contentType.includes('text/html')) {
    const e = new Error('Response is not HTML')
    e.code = 'NOT_HTML'
    throw e
  }

  const buffer = await response.arrayBuffer()
  const maxBytes = 2 * 1024 * 1024
  const sliced = buffer.byteLength > maxBytes ? buffer.slice(0, maxBytes) : buffer
  const html = Buffer.from(sliced).toString('utf-8')

  return {
    html,
    finalUrl: response.url,
    status: response.status,
    challenge: isBotChallengePage(html)
  }
}
