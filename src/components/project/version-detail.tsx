'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileList, FileDownloadButton } from '@/components/common/file-download';
import { FileUpload } from '@/components/common/file-upload';
import { Clock, Download, Upload, FileIcon } from 'lucide-react';

interface ProjectVersion {
  id: string;
  versionName: string;
  versionNumber: string;
  status: 'draft' | 'uploading' | 'processing' | 'completed' | 'rejected';
  description?: string;
  changelog?: string;
  createdAt: string;
  updatedAt: string;
}

interface ProjectFile {
  id: string;
  filename: string;
  fileSize?: number;
  uploadStatus: 'pending' | 'uploading' | 'completed' | 'failed';
  createdAt: string;
}

interface ProjectVersionDetailProps {
  versionId: string;
}

export function ProjectVersionDetail({ versionId }: ProjectVersionDetailProps) {
  const [version, setVersion] = useState<ProjectVersion | null>(null);
  const [files, setFiles] = useState<ProjectFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('files');

  // 获取版本详情
  useEffect(() => {
    const fetchVersionDetail = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/project/version/${versionId}`);
        if (response.ok) {
          const data = await response.json();
          setVersion(data.version);
          setFiles(data.files || []);
        }
      } catch (error) {
        console.error('获取版本详情失败:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchVersionDetail();
  }, [versionId]);

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      draft: { label: '草稿', variant: 'secondary' as const },
      uploading: { label: '上传中', variant: 'default' as const },
      processing: { label: '处理中', variant: 'default' as const },
      completed: { label: '已完成', variant: 'default' as const },
      rejected: { label: '已拒绝', variant: 'destructive' as const },
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.draft;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const canAddFiles = version?.status === 'draft' || version?.status === 'uploading';
  const canSubmitForReview = version?.status === 'draft' && files.some(f => f.uploadStatus === 'completed');

  const handleSubmitForReview = async () => {
    try {
      const response = await fetch(`/api/project/version/${versionId}/submit`, {
        method: 'POST',
      });
      
      if (response.ok) {
        setVersion(prev => prev ? { ...prev, status: 'processing' } : null);
      }
    } catch (error) {
      console.error('提交审核失败:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">加载中...</p>
        </div>
      </div>
    );
  }

  if (!version) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">版本不存在或已被删除</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 版本信息卡片 */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                {version.versionName}
                {getStatusBadge(version.status)}
              </CardTitle>
              <CardDescription className="mt-1">
                版本号: {version.versionNumber}
              </CardDescription>
              {version.description && (
                <p className="mt-2 text-sm text-muted-foreground">
                  {version.description}
                </p>
              )}
            </div>
            
            <div className="flex items-center gap-2">
              {canSubmitForReview && (
                <Button onClick={handleSubmitForReview}>
                  提交审核
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              创建于 {formatDate(version.createdAt)}
            </div>
            <div className="flex items-center gap-1">
              <FileIcon className="h-4 w-4" />
              {files.length} 个文件
            </div>
            <div className="flex items-center gap-1">
              <Download className="h-4 w-4" />
              {files.filter(f => f.uploadStatus === 'completed').length} 个可下载
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 版本内容 */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="files">文件管理</TabsTrigger>
          <TabsTrigger value="changelog">更新日志</TabsTrigger>
          <TabsTrigger value="downloads">下载统计</TabsTrigger>
        </TabsList>

        <TabsContent value="files" className="space-y-4">
          {/* 文件上传区域 */}
          {canAddFiles && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">上传文件</CardTitle>
                <CardDescription>
                  支持拖拽上传，单个文件最大 100MB
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                  <Upload className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground mb-2">
                    将文件拖拽到这里或点击选择文件
                  </p>
                  <input
                    type="file"
                    multiple
                    className="hidden"
                    id="file-upload"
                    onChange={(e) => {
                      const files = Array.from(e.target.files || []);
                      console.log('选择的文件:', files);
                      // TODO: 实现文件上传逻辑
                    }}
                  />
                  <Button 
                    variant="outline" 
                    onClick={() => document.getElementById('file-upload')?.click()}
                  >
                    选择文件
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* 文件列表 */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">文件列表</CardTitle>
              <CardDescription>
                {files.length > 0 ? `共 ${files.length} 个文件` : '暂无文件'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FileList files={files} allowBatchDownload={true} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="changelog" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">更新日志</CardTitle>
            </CardHeader>
            <CardContent>
              {version.changelog ? (
                <div className="prose prose-sm max-w-none">
                  <pre className="whitespace-pre-wrap text-sm">
                    {version.changelog}
                  </pre>
                </div>
              ) : (
                <p className="text-muted-foreground">暂无更新日志</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="downloads" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">下载统计</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <Download className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>下载统计功能即将推出</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

// 简化的文件预览组件
interface FilePreviewProps {
  file: ProjectFile;
}

export function FilePreview({ file }: FilePreviewProps) {
  return (
    <div className="flex items-center justify-between p-3 border rounded-lg">
      <div className="flex items-center space-x-3">
        <FileIcon className="h-5 w-5 text-muted-foreground" />
        <div>
          <div className="font-medium">{file.filename}</div>
          {file.fileSize && (
            <div className="text-sm text-muted-foreground">
              {(file.fileSize / 1024 / 1024).toFixed(1)} MB
            </div>
          )}
        </div>
      </div>
      
      <FileDownloadButton 
        file={file} 
        showDropdown={false}
        size="sm"
      />
    </div>
  );
}
