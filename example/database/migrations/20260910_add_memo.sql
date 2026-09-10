-- 20260910 新增管理端个人备忘录表：纯文本记录，一级 tab 快捷切换多条。
-- 按创建人（created_by）隔离：每个登录用户只能看到自己的备忘录。
-- 适用已有库（新装直接使用 init.sql，无需执行本脚本）。
-- 幂等：CREATE TABLE IF NOT EXISTS。
CREATE TABLE IF NOT EXISTS `memo` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `title` VARCHAR(64) NOT NULL DEFAULT '未命名备忘录',
  `content` TEXT NOT NULL,
  `created_by` BIGINT UNSIGNED NOT NULL,
  `created_at` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updated_at` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `version` INT UNSIGNED NOT NULL DEFAULT 1,
  CONSTRAINT `pk_memo` PRIMARY KEY (`id`),
  CONSTRAINT `fk_memo_created_by_user`
    FOREIGN KEY (`created_by`) REFERENCES `user` (`id`) ON DELETE CASCADE,
  INDEX `ix_memo_created_by` (`created_by`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;