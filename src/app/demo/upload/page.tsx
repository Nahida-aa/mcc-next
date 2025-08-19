'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Upload, CheckCircle, XCircle, FileIcon, X, Plus } from 'lucide-react';
import { GeneratePresignedUrlSchemaType, PresignedUrlResponseSchemaType, VerifyUploadResponseSchemaType } from '@/server/apps/upload/router';

interface FileUploadProgress {
  fileId: string;
  file: File;
  loaded: number;
  total: number;
  percentage: number;
  status: 'pending' | 'uploading' | 'success' | 'error';
  error?: string;
  result?: {
    fileKey: string;
    fileUrl?: string;
  };
}

export default function UploadTestPage() {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploadType, setUploadType] = useState<string>('other');
  const [fileProgresses, setFileProgresses] = useState<Map<string, FileUploadProgress>>(new Map());
  const [isUploading, setIsUploading] = useState(false);
  const [globalError, setGlobalError] = useState<string>('');
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 处理文件选择 - 支持追加文件
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newFiles = Array.from(event.target.files || []);
    if (newFiles.length > 0) {
      addFilesToSelection(newFiles);
    }
    
    // 清空input的值，允许重复选择同一个文件
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // 删除单个文件
  const removeFile = (fileIdToRemove: string) => {
    // 从进度状态中移除
    const newProgresses = new Map(fileProgresses);
    const progressToRemove = newProgresses.get(fileIdToRemove);
    newProgresses.delete(fileIdToRemove);
    setFileProgresses(newProgresses);

    // 从文件列表中移除
    if (progressToRemove) {
      const updatedFiles = selectedFiles.filter(file => file !== progressToRemove.file);
      setSelectedFiles(updatedFiles);
    }
  };

  // 处理拖拽事件
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    const droppedFiles = Array.from(e.dataTransfer.files);
    if (droppedFiles.length > 0) {
      addFilesToSelection(droppedFiles);
    }
  };

  // 统一的添加文件逻辑
  const addFilesToSelection = (newFiles: File[]) => {
    // 过滤掉已存在的文件（基于文件名和大小）
    const existingFileKeys = new Set(selectedFiles.map(f => `${f.name}-${f.size}`));
    const uniqueNewFiles = newFiles.filter(file => 
      !existingFileKeys.has(`${file.name}-${file.size}`)
    );

    if (uniqueNewFiles.length > 0) {
      // 追加新文件到现有列表
      const updatedFiles = [...selectedFiles, ...uniqueNewFiles];
      setSelectedFiles(updatedFiles);
      
      // 为新文件初始化进度状态
      const newProgresses = new Map(fileProgresses);
      uniqueNewFiles.forEach((file, index) => {
        const fileId = `${Date.now()}-${selectedFiles.length + index}`;
        newProgresses.set(fileId, {
          fileId,
          file,
          loaded: 0,
          total: file.size,
          percentage: 0,
          status: 'pending',
        });
      });
      setFileProgresses(newProgresses);
    }
    
    setGlobalError('');
  };

  // 重试失败的上传
  const retryFailedUploads = async () => {
    const failedProgresses = Array.from(fileProgresses.entries()).filter(
      ([_, progress]) => progress.status === 'error'
    );

    if (failedProgresses.length === 0) return;

    setIsUploading(true);
    
    const retryPromises = failedProgresses.map(([fileId, progress]) => 
      uploadSingleFile(fileId, progress.file)
    );

    try {
      await Promise.allSettled(retryPromises);
    } catch (err) {
      console.error('Retry error:', err);
    } finally {
      setIsUploading(false);
    }
  };

  // 格式化文件大小
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // 更新单个文件的进度
  const updateFileProgress = (fileId: string, updates: Partial<FileUploadProgress>) => {
    setFileProgresses(prev => {
      const newMap = new Map(prev);
      const current = newMap.get(fileId);
      if (current) {
        newMap.set(fileId, { ...current, ...updates });
      }
      return newMap;
    });
  };

  // 上传单个文件
  const uploadSingleFile = async (fileId: string, file: File): Promise<void> => {
    try {
      updateFileProgress(fileId, { status: 'uploading' });

      // 1. 获取预签名URL
      const presignedResponse = await fetch('/api/upload/presigned-url', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          filename: file.name,
          contentType: file.type,
          fileSize: file.size,
          uploadType: uploadType,
        }),
      });

      if (!presignedResponse.ok) {
        const errorData = await presignedResponse.json();
        throw new Error(errorData.message || '获取预签名URL失败');
      }

      const presignedData = await presignedResponse.json() as PresignedUrlResponseSchemaType;

      // 2. 使用XMLHttpRequest上传文件（支持进度监控）
      const uploadPromise = new Promise<void>((resolve, reject) => {
        const xhr = new XMLHttpRequest();

        // 监听上传进度
        xhr.upload.addEventListener('progress', (event) => {
          if (event.lengthComputable) {
            const percentage = Math.round((event.loaded / event.total) * 100);
            updateFileProgress(fileId, {
              loaded: event.loaded,
              total: event.total,
              percentage: percentage,
            });
          }
        });

        // 监听上传完成
        xhr.addEventListener('load', () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            resolve();
          } else {
            reject(new Error(`上传失败: ${xhr.status} ${xhr.statusText}`));
          }
        });

        // 监听上传错误
        xhr.addEventListener('error', () => {
          reject(new Error('上传过程中发生网络错误'));
        });

        // 监听上传中止
        xhr.addEventListener('abort', () => {
          reject(new Error('上传被中止'));
        });

        // 开始上传
        xhr.open('PUT', presignedData.uploadUrl);
        xhr.setRequestHeader('Content-Type', file.type);
        xhr.send(file);
      });

      await uploadPromise;

      // 3. 验证上传结果（可选）
      const verifyResponse = await fetch('/api/upload/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fileKey: presignedData.fileKey,
        }),
      });

      let fileUrl = '';
      if (verifyResponse.ok) {
        const verifyData = await verifyResponse.json() as VerifyUploadResponseSchemaType;
        fileUrl = verifyData.fileUrl;
      }

      updateFileProgress(fileId, {
        status: 'success',
        result: {
          fileKey: presignedData.fileKey,
          fileUrl: fileUrl,
        }
      });

    } catch (err) {
      console.error(`Upload error for ${file.name}:`, err);
      updateFileProgress(fileId, {
        status: 'error',
        error: err instanceof Error ? err.message : '上传失败',
      });
    }
  };

  // 上传所有文件
  const uploadFiles = async () => {
    if (selectedFiles.length === 0) {
      setGlobalError('请先选择文件');
      return;
    }

    setIsUploading(true);
    setGlobalError('');

    // 并行上传所有文件
    const uploadPromises = Array.from(fileProgresses.entries()).map(([fileId, progress]) => 
      uploadSingleFile(fileId, progress.file)
    );

    try {
      await Promise.allSettled(uploadPromises);
    } catch (err) {
      console.error('Upload batch error:', err);
      setGlobalError('批量上传过程中出现错误');
    } finally {
      setIsUploading(false);
    }
  };

  // 重置状态
  const resetUpload = () => {
    setSelectedFiles([]);
    setFileProgresses(new Map());
    setGlobalError('');
    setIsUploading(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // 计算总体进度
  const calculateOverallProgress = () => {
    const progresses = Array.from(fileProgresses.values());
    if (progresses.length === 0) return { percentage: 0, loaded: 0, total: 0 };
    
    const totalLoaded = progresses.reduce((sum, p) => sum + p.loaded, 0);
    const totalSize = progresses.reduce((sum, p) => sum + p.total, 0);
    const percentage = totalSize > 0 ? Math.round((totalLoaded / totalSize) * 100) : 0;
    
    return { percentage, loaded: totalLoaded, total: totalSize };
  };

  const overallProgress = calculateOverallProgress();
  const completedFiles = Array.from(fileProgresses.values()).filter(p => p.status === 'success').length;
  const errorFiles = Array.from(fileProgresses.values()).filter(p => p.status === 'error').length;

  return (
    <div className="container mx-auto p-6 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="w-6 h-6" />
            文件上传测试
          </CardTitle>
          <CardDescription>
            测试R2预签名URL上传功能，支持实时进度显示
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* 拖拽上传区域 */}
          <div
            className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
              isDragOver 
                ? 'border-blue-500 bg-blue-50' 
                : 'border-muted-foreground/25 hover:border-muted-foreground/50'
            } ${isUploading ? 'pointer-events-none opacity-50' : ''}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <Upload className={`w-8 h-8 mx-auto mb-2 ${isDragOver ? 'text-blue-500' : 'text-muted-foreground'}`} />
            <p className={`text-sm ${isDragOver ? 'text-blue-600' : 'text-muted-foreground'}`}>
              {isDragOver ? '松开以添加文件' : '拖拽文件到此处或点击下方按钮选择'}
            </p>
          </div>

          {/* 文件选择 */}
          <div className="space-y-2">
            <Label htmlFor="file-upload">选择文件</Label>
            <div className="flex gap-2">
              <Input
                ref={fileInputRef}
                id="file-upload"
                type="file"
                multiple
                onChange={handleFileSelect}
                disabled={isUploading}
                className="cursor-pointer flex-1"
              />
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                title="添加更多文件"
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              点击选择文件或使用+按钮追加更多文件。支持多选和拖拽。
            </p>
          </div>

          {/* 上传类型选择 */}
          <div className="space-y-2">
            <Label htmlFor="upload-type">上传类型</Label>
            <Select value={uploadType} onValueChange={setUploadType} disabled={isUploading}>
              <SelectTrigger>
                <SelectValue placeholder="选择上传类型" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="avatar">头像</SelectItem>
                <SelectItem value="project_icon">项目图标</SelectItem>
                <SelectItem value="project_gallery">项目画廊</SelectItem>
                <SelectItem value="mod_file">模组文件</SelectItem>
                <SelectItem value="resource_pack">资源包</SelectItem>
                <SelectItem value="other">其他</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* 文件列表 */}
          {selectedFiles.length > 0 && (
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <Label>已选择文件 ({selectedFiles.length})</Label>
                {!isUploading && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSelectedFiles([]);
                      setFileProgresses(new Map());
                    }}
                    className="text-xs"
                  >
                    清空全部
                  </Button>
                )}
              </div>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {Array.from(fileProgresses.values()).map((progress) => (
                  <Card key={progress.fileId} className="p-3 bg-muted/50">
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <FileIcon className="w-6 h-6 text-muted-foreground flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">{progress.file.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {formatFileSize(progress.file.size)} • {progress.file.type || '未知类型'}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          {progress.status === 'success' && <CheckCircle className="w-4 h-4 text-green-500" />}
                          {progress.status === 'error' && <XCircle className="w-4 h-4 text-red-500" />}
                          {progress.status === 'uploading' && (
                            <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                          )}
                          <span className="text-xs font-medium">{progress.percentage}%</span>
                          {/* 删除按钮 */}
                          {!isUploading && progress.status !== 'uploading' && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeFile(progress.fileId)}
                              className="h-6 w-6 p-0 hover:bg-red-100 hover:text-red-600"
                              title="删除此文件"
                            >
                              <X className="w-3 h-3" />
                            </Button>
                          )}
                        </div>
                      </div>
                      
                      {/* 单个文件进度条 */}
                      {(progress.status === 'uploading' || progress.status === 'success') && (
                        <Progress value={progress.percentage} className="w-full h-2" />
                      )}
                      
                      {/* 错误信息 */}
                      {progress.status === 'error' && progress.error && (
                        <div className="flex items-center justify-between">
                          <p className="text-xs text-red-500 flex-1">{progress.error}</p>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => uploadSingleFile(progress.fileId, progress.file)}
                            className="text-xs ml-2"
                            disabled={isUploading}
                          >
                            重试
                          </Button>
                        </div>
                      )}
                      
                      {/* 成功结果 */}
                      {progress.status === 'success' && progress.result && (
                        <div className="text-xs space-y-1">
                          <p className="font-mono text-green-600 bg-green-50 p-1 rounded">
                            {progress.result.fileKey}
                          </p>
                          {progress.result.fileUrl && (
                            <a
                              href={progress.result.fileUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:underline"
                            >
                              查看文件
                            </a>
                          )}
                        </div>
                      )}
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* 总体上传进度 */}
          {isUploading && selectedFiles.length > 1 && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>总体进度</span>
                <span>{overallProgress.percentage}% ({completedFiles}/{selectedFiles.length} 完成)</span>
              </div>
              <Progress value={overallProgress.percentage} className="w-full" />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>{formatFileSize(overallProgress.loaded)}</span>
                <span>{formatFileSize(overallProgress.total)}</span>
              </div>
              {errorFiles > 0 && (
                <p className="text-xs text-red-500">{errorFiles} 个文件上传失败</p>
              )}
            </div>
          )}

          {/* 全局错误信息 */}
          {globalError && (
            <Alert variant="destructive">
              <XCircle className="h-4 w-4" />
              <AlertDescription>{globalError}</AlertDescription>
            </Alert>
          )}

          {/* 成功总结 */}
          {!isUploading && completedFiles > 0 && (
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                成功上传 {completedFiles} 个文件
                {errorFiles > 0 && `, ${errorFiles} 个文件失败`}
              </AlertDescription>
            </Alert>
          )}

          {/* 操作按钮 */}
          <div className="flex gap-3">
            <Button
              onClick={uploadFiles}
              disabled={selectedFiles.length === 0 || isUploading}
              className="flex-1"
            >
              {isUploading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  上传中... ({completedFiles}/{selectedFiles.length})
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4 mr-2" />
                  开始上传 {selectedFiles.length > 0 && `(${selectedFiles.length}个文件)`}
                </>
              )}
            </Button>
            
            {/* 重试按钮 */}
            {errorFiles > 0 && !isUploading && (
              <Button
                variant="outline"
                onClick={retryFailedUploads}
                className="flex-shrink-0"
              >
                重试失败 ({errorFiles})
              </Button>
            )}
            
            <Button
              variant="outline"
              onClick={resetUpload}
              disabled={isUploading}
            >
              重置
            </Button>
          </div>

          {/* 说明信息 */}
          <div className="text-xs text-muted-foreground space-y-1">
            <p>• 支持多文件选择、拖拽添加和单独删除，最大单文件100MB</p>
            <p>• 使用XMLHttpRequest实现每个文件的实时进度显示</p>
            <p>• 文件并行上传到R2存储，失败文件可单独重试</p>
            <p>• 预签名URL有效期为1小时，支持暂停后继续上传</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
