-- 数据库结构优化：版本状态流程简化
-- 移除自动提交审核，用户通过独立API主动控制审核时机

-- 1. 修改 project_version 表的默认状态为 uploading
-- 版本创建后保持上传中状态，等用户主动提交审核
ALTER TABLE project_version 
ALTER COLUMN status SET DEFAULT 'uploading';

-- 2. 更新现有的 processing 状态记录为 uploading（如果它们还没有被审核的话）
-- 只回退那些可能是自动提交但还没开始审核的版本
UPDATE project_version 
SET status = 'uploading' 
WHERE status = 'processing'
AND created_at > NOW() - INTERVAL '1 day'; -- 只回退最近创建的，避免影响正在审核的版本

-- 3. 更新现有的 draft 状态记录为 uploading
-- 因为现在没有draft状态了
UPDATE project_version 
SET status = 'uploading' 
WHERE status = 'draft';

-- 4. 添加注释说明新的状态流转
COMMENT ON COLUMN project_version.status IS '版本状态: uploading(文件上传中), processing(审核中), rejected(被拒绝), approved(已批准), published(已发布), archived(已归档)';

-- 状态流转说明:
-- uploading -> processing (用户主动提交审核)
-- processing -> approved/rejected (管理员审核)
-- rejected -> processing (重新提交审核)
-- approved -> published (发布版本)
-- * -> archived (归档)
