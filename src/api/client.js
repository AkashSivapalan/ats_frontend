function getBaseUrl() {
  return (import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080').replace(
    /\/+$/,
    '',
  )
}

async function safeReadText(res) {
  try {
    return await res.text()
  } catch {
    return ''
  }
}

export class ApiError extends Error {
  constructor(message, { status, bodyText } = {}) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.bodyText = bodyText
  }
}

/**
 * @param {string} path
 * @param {{
 *   method?: string,
 *   headers?: Record<string,string>,
 *   body?: any,
 *   authToken?: string | null,
 *   isJson?: boolean,
 * }} options
 */
export async function apiFetch(path, options = {}) {
  const {
    method = 'GET',
    headers = {},
    body,
    authToken,
    isJson = true,
  } = options

  const url = `${getBaseUrl()}${path.startsWith('/') ? '' : '/'}${path}`

  const mergedHeaders = { ...headers }
  if (authToken) mergedHeaders.Authorization = `Bearer ${authToken}`
  if (isJson && body !== undefined) mergedHeaders['Content-Type'] = 'application/json'

  const res = await fetch(url, {
    method,
    headers: mergedHeaders,
    body:
      body === undefined
        ? undefined
        : isJson
          ? JSON.stringify(body)
          : body,
  })

  if (!res.ok) {
    const bodyText = await safeReadText(res)
    let message = `Request failed (${res.status})`
    if (bodyText) message = `${message}: ${bodyText}`
    throw new ApiError(message, { status: res.status, bodyText })
  }

  const contentType = res.headers.get('content-type') || ''
  if (contentType.includes('application/json')) return await res.json()
  return await res.text()
}

