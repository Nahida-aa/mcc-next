'use client'
import { ClientWsData } from "@/api/ws/router"
import { cApi } from "../api.client"
import { createContext, useContext, useEffect, useState } from "react"

export type WebSocketContextType = {
  socket: WebSocket | null
  isConnected: boolean
  sendData: (data: ClientWsData) => void
}

const WebSocketContext = createContext<WebSocketContextType>({
  socket: null,
  isConnected: false,
  sendData: () => {}
})

export const useWebSocket = () => {
  return useContext(WebSocketContext)
}

export const WebSocketProvider = ({ children }: { children: React.ReactNode }) => {
  const [socket, setSocket] = useState<WebSocket | null>(null)
  const [isConnected, setIsConnected] = useState(false)

  useEffect(() => {
    // 使用原生 WebSocket 连接
    const ws = new WebSocket('ws://localhost:3001/ws')

    ws.onopen = () => {
      console.log('WebSocket connected')
      setIsConnected(true)
    }

    ws.onclose = () => {
      console.log('WebSocket disconnected')
      setIsConnected(false)
    }

    ws.onerror = (error) => {
      console.error('WebSocket error:', error)
    }

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data)
        console.log('Provider:WebSocket message received:', data)
        // 这里可以添加全局消息处理逻辑
      } catch (error) {
        console.error('Error parsing WebSocket message:', error)
      }
    }

    setSocket(ws)

    return () => {
      ws.close()
    }
  }, [])

  const sendData = (message: any) => {
    if (socket && isConnected) {
      socket.send(JSON.stringify(message))
    }
  }

  return (
    <WebSocketContext.Provider value={{ socket, isConnected, sendData }}>
      {children}
    </WebSocketContext.Provider>
  )
}
