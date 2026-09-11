-- 20260913 申购记录新增「合同签订日期」（contract_sign_date）。
-- 语义：物资级字段（挂在 purchase_request_line），同一申购单下不同物资可分别签订；
-- 与合同号/集港日期/发船日期（单据级，挂在 purchase_request）不同，不随整单共享。
-- 适用已有库（新装直接使用 init.sql，无需执行本脚本）；既有行的该列保持 NULL。
-- 注意：MySQL 的 ADD COLUMN 不支持 IF NOT EXISTS，重复执行会报「Duplicate column name」，
-- 可直接忽略该报错（列已存在即目标状态）。
ALTER TABLE `purchase_request_line`
  ADD COLUMN `contract_sign_date` DATE NULL AFTER `salesperson`;
