"use client"

import { useModal } from '@/components/providers/modal-provider'
import { SignOutModal } from '@/components/modals/SignOutModal'
import { ConfirmModal } from '@/components/modals/ConfirmModal'
import { AlertModal } from '@/components/modals/AlertModal'
import { PromptModal } from '@/components/modals/PromptModal'
import { LoadingModal } from '@/components/modals/LoadingModal'
import { CreateProjectModal } from '@/components/modals/CreateProjectModal'

export function GlobalModalRenderer() {
  const { isOpen, type, data, closeModal } = useModal()

  if (!isOpen || !type || !data) {
    return null
  }

  // 根据类型渲染不同的模态框
  switch (type) {
    case 'signOut':
      return (
        <SignOutModal
          isOpen={isOpen}
          onClose={closeModal}
          userName={data.userName}
        />
      )
    
    case 'confirm':
      return (
        <ConfirmModal
          isOpen={isOpen}
          onClose={closeModal}
          title={data.title || '确认操作'}
          description={data.description}
          onConfirm={data.onConfirm}
          confirmText={data.confirmText}
          cancelText={data.cancelText}
          variant={data.variant}
        />
      )
    
    case 'alert':
      return (
        <AlertModal
          isOpen={isOpen}
          onClose={closeModal}
          title={data.title || '提示'}
          description={data.description}
          confirmText={data.confirmText}
        />
      )
    
    case 'prompt':
      return (
        <PromptModal
          isOpen={isOpen}
          onClose={closeModal}
          title={data.title || '输入信息'}
          placeholder={data.placeholder}
          onSubmit={data.onSubmit}
          defaultValue={data.defaultValue}
          inputType={data.inputType}
          confirmText={data.confirmText}
          cancelText={data.cancelText}
        />
      )
    
    case 'loading':
      return (
        <LoadingModal
          isOpen={isOpen}
          text={data.loadingText}
          progress={data.progress}
        />
      )
    
    case 'createProject':
      return (
        <CreateProjectModal
          open={isOpen}
          onOpenChange={(open) => {
            if (!open) closeModal()
          }}
        />
      )
    
    case 'custom':
      return data.component || null
    
    default:
      return null
  }
}
