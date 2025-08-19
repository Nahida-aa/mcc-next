-- 迁移脚本：修改项目版本状态默认值
-- 执行时间：2024-07-24

-- 1. 修改版本状态的默认值为 'uploading'
ALTER TABLE project_version 
ALTER COLUMN status SET DEFAULT 'uploading';

-- 2. 可选：更新现有的 draft 状态版本为 uploading（如果需要）
-- UPDATE project_version 
-- SET status = 'uploading' 
-- WHERE status = 'draft' AND created_at > NOW() - INTERVAL '1 hour';

-- 3. 添加注释说明状态流转
COMMENT ON COLUMN project_version.status IS 'Version status: uploading -> draft -> processing -> approved/rejected';

-- 状态说明：
-- uploading: 版本创建中，文件正在上传
-- draft: 所有文件上传完成，等待提交审核
-- processing: 已提交审核，等待管理员处理
-- approved: 审核通过，版本发布
-- rejected: 审核拒绝
-- archived: 已归档
