import { AppType } from '@/api/app'
import { hc } from 'hono/client'
// server
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

const baseUrl = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000'

// 可用, 但是 如果 服务端在本地服务端, 则没有必要, 因为这个 hc 是走网络的
export const sApi = hc<AppType>(baseUrl).api
