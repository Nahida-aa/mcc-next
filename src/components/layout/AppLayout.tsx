"use client"

import { ModalProvider } from '@/components/providers/modal-provider'
import { GlobalModalRenderer } from '@/components/modals/GlobalModalRenderer'

interface AppLayoutProps {
  children: React.ReactNode
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <ModalProvider>
      {/* 您的应用内容 */}
      {children}
      
      {/* 全局模态框渲染器 - 放在最后，确保层级正确 */}
      <GlobalModalRenderer />
    </ModalProvider>
  )
}

// 使用示例：
// 在您的 app/layout.tsx 或主布局组件中：
/*
import { AppLayout } from '@/components/layout/AppLayout'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN">
      <body>
        <AppLayout>
          {children}
        </AppLayout>
      </body>
    </html>
  )
}
*/
