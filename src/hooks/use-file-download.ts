'use client';

import { useState } from 'react';

interface FileDownloadInfo {
  downloadUrl: string;
  filename: string;
  fileSize: number;
  expiresAt: string;
}

interface UseFileDownloadOptions {
  onSuccess?: (info: FileDownloadInfo) => void;
  onError?: (error: string) => void;
}

export function useFileDownload(options: UseFileDownloadOptions = {}) {
  const [isDownloading, setIsDownloading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const downloadFile = async (fileId: string, autoDownload: boolean = true) => {
    setIsDownloading(true);
    setError(null);

    try {
      // 获取下载链接
      const response = await fetch('/api/project/file/download-url', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ fileId: fileId }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || '获取下载链接失败');
      }

      const downloadInfo: FileDownloadInfo = await response.json();
      
      // 触发成功回调
      options.onSuccess?.(downloadInfo);

      // 自动下载文件
      if (autoDownload) {
        const link = document.createElement('a');
        link.href = downloadInfo.downloadUrl;
        link.download = downloadInfo.filename;
        link.style.display = 'none';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }

      return downloadInfo;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '下载失败';
      setError(errorMessage);
      options.onError?.(errorMessage);
      throw err;
    } finally {
      setIsDownloading(false);
    }
  };

  const previewFile = async (fileId: string) => {
    // 获取下载链接但不自动下载，用于预览
    return downloadFile(fileId, false);
  };

  const copyDownloadLink = async (fileId: string) => {
    try {
      const downloadInfo = await downloadFile(fileId, false);
      await navigator.clipboard.writeText(downloadInfo.downloadUrl);
      return downloadInfo.downloadUrl;
    } catch (err) {
      throw err;
    }
  };

  const formatFileSize = (bytes: number): string => {
    const units = ['B', 'KB', 'MB', 'GB'];
    let size = bytes;
    let unitIndex = 0;
    
    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024;
      unitIndex++;
    }
    
    return `${size.toFixed(1)} ${units[unitIndex]}`;
  };

  return {
    downloadFile,
    previewFile,
    copyDownloadLink,
    formatFileSize,
    isDownloading,
    error,
    clearError: () => setError(null),
  };
}

// 批量下载 Hook
export function useBatchFileDownload() {
  const [isDownloading, setIsDownloading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentFile, setCurrentFile] = useState<string | null>(null);
  const [errors, setErrors] = useState<Array<{ fileId: string; filename: string; error: string }>>([]);

  const downloadFiles = async (
    files: Array<{ id: string; filename: string }>,
    onProgress?: (progress: number, currentFile: string) => void
  ) => {
    setIsDownloading(true);
    setProgress(0);
    setErrors([]);

    const downloadInfos: FileDownloadInfo[] = [];
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      setCurrentFile(file.filename);
      
      try {
        const response = await fetch('/api/project/file/download-url', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ fileId: file.id }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || '获取下载链接失败');
        }

        const downloadInfo: FileDownloadInfo = await response.json();
        downloadInfos.push(downloadInfo);

        // 下载文件
        const link = document.createElement('a');
        link.href = downloadInfo.downloadUrl;
        link.download = downloadInfo.filename;
        link.style.display = 'none';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        // 更新进度
        const currentProgress = ((i + 1) / files.length) * 100;
        setProgress(currentProgress);
        onProgress?.(currentProgress, file.filename);

        // 短暂延迟避免过快请求
        if (i < files.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 500));
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : '下载失败';
        setErrors(prev => [...prev, {
          fileId: file.id,
          filename: file.filename,
          error: errorMessage
        }]);
      }
    }

    setIsDownloading(false);
    setCurrentFile(null);
    return downloadInfos;
  };

  return {
    downloadFiles,
    isDownloading,
    progress,
    currentFile,
    errors,
    clearErrors: () => setErrors([]),
  };
}
