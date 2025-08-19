"use client"

import { useState, useEffect } from "react"
import { Settings, ChevronUp, ChevronDown, CodeXml } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ModeToggleGradientIcon } from "./theme-toggle"
import { useStyle } from "../context/styleContext"
import { Switch } from "../ui/switch"
import { useAuthSession } from "../providers/auth-provider"

type Position = "top-left" | "top-right" | "bottom-left" | "bottom-right"

export function DebugPanel() {
  const [isOpen, setIsOpen] = useState(false)
  const [position, setPosition] = useState<Position>("bottom-right")
  const [mounted, setMounted] = useState(false)
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 })
  const [authStatusHistory, setAuthStatusHistory] = useState<string[]>([])
  const [currentTime, setCurrentTime] = useState(new Date())
  const { styleState, setStyleState } = useStyle();
  const { data: session, status, update } = useAuthSession()
  
  // 实时时钟
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
    
    return () => clearInterval(timer)
  }, [])
  
  // 监听 auth 状态变化
  useEffect(() => {
    if (mounted && status) {
      setAuthStatusHistory(prev => {
        const newHistory = [...prev, `${new Date().toLocaleTimeString()}: ${status}`]
        // 只保留最近的5条记录
        return newHistory.slice(-5)
      })
    }
  }, [status, mounted])

  const toggleBorder = () => {
    setStyleState(prevState => ({
      ...prevState,
      border: !prevState.border,
    }));
  };
  useEffect(() => {
    setMounted(true)
    // 从 localStorage 恢复位置设置
    const savedPosition = localStorage.getItem("debug-panel-position") as Position
    if (savedPosition) {
      setPosition(savedPosition)
    }
  }, [])

  // 监听窗口尺寸变化
  useEffect(() => {
    const updateWindowSize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      })
    }

    // 初始化窗口尺寸
    updateWindowSize()

    // 添加事件监听器
    window.addEventListener("resize", updateWindowSize)

    // 清理函数
    return () => window.removeEventListener("resize", updateWindowSize)
  }, [])


  const handlePositionChange = (newPosition: Position) => {
    setPosition(newPosition)
    localStorage.setItem("debug-panel-position", newPosition)
  }

  const getPositionClasses = () => {
    switch (position) {
      case "top-left":
        return "top-4 left-4"
      case "top-right":
        return "top-4 right-4"
      case "bottom-left":
        return "bottom-4 left-4"
      case "bottom-right":
        return "bottom-4 right-4"
      default:
        return "bottom-4 right-4"
    }
  }

  const getExpandDirection = () => {
    switch (position) {
      case "top-left":
        return "origin-top-left"
      case "top-right":
        return "origin-top-right"
      case "bottom-left":
        return "origin-bottom-left"
      case "bottom-right":
        return "origin-bottom-right"
      default:
        return "origin-bottom-right"
    }
  }

  if (!mounted) return null

  return (
    <div className={`fixed z-50 ${getPositionClasses()}`}>
      {/* 触发按钮 */}
      <Button
        variant="outline"
        size="icon"
        onClick={() => setIsOpen(!isOpen)}
        className="h-10 w-10 rounded-full shadow-lg bg-background/80 backdrop-blur-sm border-2 hover:scale-110 transition-all duration-200"
      >
        <CodeXml className="h-4 w-4" />
        <span className="sr-only">打开调试面板</span>
      </Button>

      {/* 调试面板 */}
      {isOpen && (
        <Card
          className={`absolute p-2  w-80 shadow-xl border-2 bg-background/95 backdrop-blur-sm transform transition-all duration-300 ease-out ${getExpandDirection()} ${
            position.includes("top") ? "top-12" : "bottom-12"
          } ${position.includes("right") ? "right-0" : "left-0"}`}
        >

          <CardContent className="space-y-4 p-2">
            {/* 位置控制 */}
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-2 block">settings</label>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant={position === "top-left" ? "default" : "outline"}
                  size="sm"
                  onClick={() => handlePositionChange("top-left")}
                  className="text-xs h-8"
                >
                  <ChevronUp className="h-3 w-3 mr-1 -rotate-45" />
                  左上
                </Button>
                <Button
                  variant={position === "top-right" ? "default" : "outline"}
                  size="sm"
                  onClick={() => handlePositionChange("top-right")}
                  className="text-xs h-8"
                >
                  <ChevronUp className="h-3 w-3 mr-1 rotate-45" />
                  右上
                </Button>
                <Button
                  variant={position === "bottom-left" ? "default" : "outline"}
                  size="sm"
                  onClick={() => handlePositionChange("bottom-left")}
                  className="text-xs h-8"
                >
                  <ChevronDown className="h-3 w-3 mr-1 rotate-45" />
                  左下
                </Button>
                <Button
                  variant={position === "bottom-right" ? "default" : "outline"}
                  size="sm"
                  onClick={() => handlePositionChange("bottom-right")}
                  className="text-xs h-8"
                >
                  <ChevronDown className="h-3 w-3 mr-1 -rotate-45" />
                  右下
                </Button>
              </div>
            </div>

            {/* 系统信息 */}
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-2 block">client info</label>
              <div className="space-y-1 text-xs">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">环境:</span>
                  <Badge variant="outline" className="text-xs">
                    {process.env.NODE_ENV}
                  </Badge>
                </div>

                <div className="flex justify-between">
                  <span className="text-muted-foreground">窗口:</span>
                  <span>
                    {windowSize.width}x{windowSize.height}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-muted-foreground">时间:</span>
                  <span className="font-mono">
                    {currentTime.toLocaleTimeString()}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-muted-foreground">挂载状态:</span>
                  <Badge variant={mounted ? "default" : "secondary"} className="text-xs">
                    {mounted ? "已挂载" : "未挂载"}
                  </Badge>
                </div>
              </div>
            </div>

            {/* 快捷操作 */}
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-2 block">action</label>
              <div className="flex gap-2">

                <ModeToggleGradientIcon  className='size-8! [&_svg]:size-5' />
                <Button variant="outline" size="sm" onClick={() => localStorage.clear()} className="text-xs h-8 flex-1">
                  清除缓存
                </Button>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <label htmlFor="border-toggle" style={{ marginRight: '10px', fontSize: '0.9rem' }}>
                  Show Border
                </label>
                <Switch
                  id="border-toggle"
                  checked={styleState.border}
                  onCheckedChange={toggleBorder}
                />
              </div>
            </div>
            {/* auth 状态 */}
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-2 block">auth</label>
              <div className="space-y-2 text-xs">
                {/* 当前状态 */}
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">当前状态:</span>
                  <Badge 
                    variant={
                      status === "authenticated" ? "default" : 
                      status === "loading" ? "secondary" : "outline"
                    } 
                    className={`text-xs ${
                      status === "loading" ? "animate-pulse" : ""
                    }`}
                  >
                    {status === "authenticated" ? "已认证" :
                     status === "loading" ? "加载中..." :
                     status === "unauthenticated" ? "未认证" : status}
                  </Badge>
                </div>

                {/* 用户信息 */}
                {session && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">用户:</span>
                    <span className="truncate max-w-32" title={session.user?.name || session.user?.email}>
                      {session.user?.name || session.user?.email || "未知"}
                    </span>
                  </div>
                )}

                {/* 状态历史 */}
                {authStatusHistory.length > 0 && (
                  <div className="border-t pt-2">
                    <div className="text-muted-foreground mb-1">状态历史:</div>
                    <div className="space-y-1 max-h-20 overflow-y-auto">
                      {authStatusHistory.map((historyItem, index) => (
                        <div key={index} className="text-xs text-muted-foreground font-mono">
                          {historyItem}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 操作按钮 */}
                <div className="flex gap-2 pt-1">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => update()} 
                    className="text-xs h-7 flex-1"
                    disabled={status === "loading"}
                  >
                    {status === "loading" ? "更新中..." : "刷新会话"}
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setAuthStatusHistory([])} 
                    className="text-xs h-7"
                  >
                    清空历史
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
