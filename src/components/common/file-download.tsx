'use client';

import { useState } from 'react';
import { Download, Copy, Eye, MoreHorizontal, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';
import { useFileDownload } from '@/hooks/use-file-download';

interface ProjectFile {
  id: string;
  filename: string;
  fileSize?: number;
  uploadStatus: 'pending' | 'uploading' | 'completed' | 'failed';
  createdAt: string;
}

interface FileDownloadButtonProps {
  file: ProjectFile;
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  showDropdown?: boolean;
  className?: string;
}

export function FileDownloadButton({
  file,
  variant = 'outline',
  size = 'sm',
  showDropdown = true,
  className = '',
}: FileDownloadButtonProps) {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  
  const { downloadFile, previewFile, copyDownloadLink, formatFileSize, isDownloading, error } = useFileDownload({
    onSuccess: (info) => {
      toast.success(`文件 ${info.filename} (${formatFileSize(info.fileSize)}) 开始下载`);
    },
    onError: (error) => {
      toast.error(`下载失败: ${error}`);
    },
  });

  const handleDownload = async () => {
    if (file.uploadStatus !== 'completed') {
      toast.error('文件尚未上传完成，无法下载');
      return;
    }

    try {
      await downloadFile(file.id);
    } catch (err) {
      // 错误已在 hook 中处理
    }
  };

  const handlePreview = async () => {
    if (file.uploadStatus !== 'completed') {
      toast.error('文件尚未上传完成，无法预览');
      return;
    }

    try {
      const downloadInfo = await previewFile(file.id);
      // 在新窗口打开文件（适用于图片、PDF等）
      window.open(downloadInfo.downloadUrl, '_blank');
    } catch (err) {
      // 错误已在 hook 中处理
    }
  };

  const handleCopyLink = async () => {
    if (file.uploadStatus !== 'completed') {
      toast.error('文件尚未上传完成，无法获取链接');
      return;
    }

    try {
      await copyDownloadLink(file.id);
      toast.success('下载链接已复制到剪贴板');
    } catch (err) {
      // 错误已在 hook 中处理
    }
  };

  const isFileReady = file.uploadStatus === 'completed';

  if (!showDropdown) {
    return (
      <Button
        variant={variant}
        size={size}
        onClick={handleDownload}
        disabled={!isFileReady || isDownloading}
        className={className}
      >
        {isDownloading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Download className="h-4 w-4" />
        )}
        {size !== 'sm' && size !== 'icon' && <span className="ml-2">下载</span>}
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant={variant}
          size={size}
          disabled={!isFileReady || isDownloading}
          className={className}
        >
          {isDownloading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <MoreHorizontal className="h-4 w-4" />
          )}
          {size !== 'sm' && size !== 'icon' && <span className="ml-2">操作</span>}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
        <DropdownMenuItem onClick={handleDownload} disabled={isDownloading}>
          <Download className="mr-2 h-4 w-4" />
          下载文件
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handlePreview} disabled={isDownloading}>
          <Eye className="mr-2 h-4 w-4" />
          预览文件
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleCopyLink} disabled={isDownloading}>
          <Copy className="mr-2 h-4 w-4" />
          复制链接
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// 文件列表组件
interface FileListProps {
  files: ProjectFile[];
  allowBatchDownload?: boolean;
}

export function FileList({ files, allowBatchDownload = true }: FileListProps) {
  const { formatFileSize } = useFileDownload();
  const [selectedFiles, setSelectedFiles] = useState<Set<string>>(new Set());

  const handleSelectFile = (fileId: string, selected: boolean) => {
    const newSelected = new Set(selectedFiles);
    if (selected) {
      newSelected.add(fileId);
    } else {
      newSelected.delete(fileId);
    }
    setSelectedFiles(newSelected);
  };

  const handleSelectAll = () => {
    const completedFiles = files.filter(f => f.uploadStatus === 'completed');
    if (selectedFiles.size === completedFiles.length) {
      setSelectedFiles(new Set());
    } else {
      setSelectedFiles(new Set(completedFiles.map(f => f.id)));
    }
  };

  const handleBatchDownload = async () => {
    const filesToDownload = files.filter(f => selectedFiles.has(f.id));
    
    for (const file of filesToDownload) {
      try {
        const link = document.createElement('a');
        const response = await fetch('/api/project/file/download-url', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ fileId: file.id }),
        });
        
        if (response.ok) {
          const downloadInfo = await response.json();
          link.href = downloadInfo.downloadUrl;
          link.download = downloadInfo.filename;
          link.style.display = 'none';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          
          // 短暂延迟避免浏览器阻止多个下载
          await new Promise(resolve => setTimeout(resolve, 300));
        }
      } catch (err) {
        console.error(`下载文件 ${file.filename} 失败:`, err);
      }
    }
    
    toast.success(`已开始下载 ${filesToDownload.length} 个文件`);
    setSelectedFiles(new Set());
  };

  const completedFiles = files.filter(f => f.uploadStatus === 'completed');

  return (
    <div className="space-y-4">
      {/* 批量操作栏 */}
      {allowBatchDownload && completedFiles.length > 1 && (
        <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={selectedFiles.size === completedFiles.length && completedFiles.length > 0}
              onChange={handleSelectAll}
              className="rounded border-gray-300"
            />
            <span className="text-sm text-muted-foreground">
              已选择 {selectedFiles.size} / {completedFiles.length} 个文件
            </span>
          </div>
          
          {selectedFiles.size > 0 && (
            <Button size="sm" onClick={handleBatchDownload}>
              <Download className="mr-2 h-4 w-4" />
              批量下载 ({selectedFiles.size})
            </Button>
          )}
        </div>
      )}

      {/* 文件列表 */}
      <div className="space-y-2">
        {files.map((file) => (
          <div
            key={file.id}
            className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50"
          >
            <div className="flex items-center space-x-3">
              {allowBatchDownload && file.uploadStatus === 'completed' && (
                <input
                  type="checkbox"
                  checked={selectedFiles.has(file.id)}
                  onChange={(e) => handleSelectFile(file.id, e.target.checked)}
                  className="rounded border-gray-300"
                />
              )}
              
              <div className="flex-1">
                <div className="font-medium">{file.filename}</div>
                <div className="text-sm text-muted-foreground">
                  {file.fileSize && formatFileSize(file.fileSize)} • 
                  <span className={`ml-1 ${
                    file.uploadStatus === 'completed' ? 'text-green-600' :
                    file.uploadStatus === 'uploading' ? 'text-blue-600' :
                    file.uploadStatus === 'failed' ? 'text-red-600' :
                    'text-yellow-600'
                  }`}>
                    {file.uploadStatus === 'completed' ? '已完成' :
                     file.uploadStatus === 'uploading' ? '上传中' :
                     file.uploadStatus === 'failed' ? '上传失败' : '等待中'}
                  </span>
                </div>
              </div>
            </div>
            
            <FileDownloadButton file={file} />
          </div>
        ))}
      </div>

      {files.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          暂无文件
        </div>
      )}
    </div>
  );
}
