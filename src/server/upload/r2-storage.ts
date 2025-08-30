import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

// R2 配置
const R2_CONFIG = {
  region: 'auto',
  endpoint: process.env.R2_ENDPOINT, // https://账户id.r2.cloudflarestorage.com
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
};

const r2Client = new S3Client(R2_CONFIG);

/**
 * 生成R2预签名上传URL
 * @param storageKey 存储键名
 * @param mimeType 文件MIME类型
 * @param expiresIn 链接有效期（秒）
 * @returns 预签名上传URL
 */
export async function generatePresignedUploadUrl(
  storageKey: string, 
  mimeType?: string, 
  expiresIn: number = 3600 // 默认1小时
): Promise<string> {
  const command = new PutObjectCommand({
    Bucket: process.env.R2_BUCKET_NAME!,
    Key: storageKey,
    ContentType: mimeType,
    // 可以添加其他元数据 R2 貌似不支持 用 S3 的 metadata, 这不是必要功能,因此省略, 另外 R2 会自己记录创建时间
    // Metadata: {
    //   'upload-timestamp': Date.now().toString(),
    // },
  });

  try {
    const signedUrl = await getSignedUrl(r2Client, command, { 
      expiresIn 
    });
    return signedUrl;
  } catch (error) {
    console.error('生成预签名URL失败:', error);
    throw new Error('生成上传链接失败');
  }
}

/**
 * 生成R2预签名下载URL
 * @param storageKey 存储键名
 * @param filename 自定义下载文件名
 * @param expiresIn 链接有效期（秒）
 * @returns 预签名下载URL
 */
export async function generatePresignedDownloadUrl(
  storageKey: string, 
  filename?: string,
  expiresIn: number = 3600
): Promise<string> {
  const command = new GetObjectCommand({
    Bucket: process.env.R2_BUCKET_NAME!,
    Key: storageKey,
    // 自定义下载文件名
    ...(filename && {
      ResponseContentDisposition: `attachment; filename="${filename}"`
    })
  });

  try {
    const signedUrl = await getSignedUrl(r2Client, command, { 
      expiresIn 
    });
    return signedUrl;
  } catch (error) {
    console.error('生成预签名下载URL失败:', error);
    throw new Error('生成下载链接失败');
  }
}

/**
 * 构建公共访问URL（如果文件是公开的）
 * @param storageKey 存储键名
 * @returns 公共访问URL
 */
export function buildPublicUrl(storageKey: string): string {
  const publicDomain = process.env.R2_PUBLIC_DOMAIN; // 自定义域名
  if (publicDomain) {
    return `https://${publicDomain}/${storageKey}`;
  }
  // 使用默认的R2公共URL格式
  return `https://pub-${process.env.R2_ACCOUNT_ID}.r2.dev/${storageKey}`;
}

/**
 * 删除R2文件
 * @param storageKey 存储键名
 */
export async function deleteFile(storageKey: string): Promise<void> {
  const { DeleteObjectCommand } = await import('@aws-sdk/client-s3');
  
  try {
    const command = new DeleteObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME!,
      Key: storageKey,
    });
    
    await r2Client.send(command);
  } catch (error) {
    console.error('删除文件失败:', error);
    throw new Error('删除文件失败');
  }
}

// 文件上传配置
export const UPLOAD_CONFIG = {
  // 允许的文件类型
  ALLOWED_MIME_TYPES: {
    // 项目文件
    'mod': ['application/java-archive', 'application/zip'],
    'resource_pack': ['application/zip'],
    'data_pack': ['application/zip'], 
    'shader': ['application/zip'],
    'world': ['application/zip'],
    
    // 图片
    'image': ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
    
    // 文档
    'document': ['text/markdown', 'text/plain', 'application/pdf']
  },
  
  // 最大文件大小 (字节)
  MAX_FILE_SIZES: {
    'mod': 100 * 1024 * 1024, // 100MB
    'resource_pack': 500 * 1024 * 1024, // 500MB
    'data_pack': 10 * 1024 * 1024, // 10MB
    'shader': 50 * 1024 * 1024, // 50MB
    'world': 1024 * 1024 * 1024, // 1GB
    'image': 10 * 1024 * 1024, // 10MB
    'document': 10 * 1024 * 1024, // 10MB
  },
  
  // 预签名URL有效期
  PRESIGNED_URL_EXPIRES: 3600, // 1小时
}
