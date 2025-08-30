import app, { AppType } from '@/api/app'
import { wsApp } from '@/api/ws/router';
import { hc } from 'hono/client'
// const baseUrl = process.env.

let baseUrl: string;
if (typeof window === 'undefined') {
  // Server-side, use the environment variable
  baseUrl = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001'
} else {
  // Client-side, construct the URL from window location
  baseUrl = `${window.location.protocol}//${window.location.host}`
}

export const cApi = hc<AppType>(baseUrl)
export type Client = ReturnType<typeof hc<typeof app>>
export const hcWithType = (...args: Parameters<typeof hc>): Client =>
  hc<typeof app>(...args)
export const client = hcWithType(baseUrl)

export const wsClient = hc<typeof wsApp>(baseUrl)
// wsClient.ws.$ws()
