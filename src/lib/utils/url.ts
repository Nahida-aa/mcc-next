export const getBaseUrl = async () => process.env.NODE_ENV === 'development' ? process.env.__NEXT_PRIVATE_ORIGIN : process.env.NEXT_PUBLIC_URL

import { headers as nextHeaders } from "next/headers"

export const inferBaseUrl = async () => {
  const headers = new Headers(await nextHeaders())
  // console.log('headers', headers)
  const detectedHost = headers.get("x-forwarded-host") ?? headers.get("host")
  const detectedProtocol = headers.get("x-forwarded-proto") ?? "https"
  const _protocol = detectedProtocol.endsWith(":")
    ? detectedProtocol
    : detectedProtocol + ":"

  const url = new URL(`${_protocol}//${detectedHost}`)
  const sanitizedUrl = url.toString().replace(/\/$/, "")

  return sanitizedUrl
}

