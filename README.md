# 电气车间备件管理系统

面向电气车间二级库的库存与申购协同系统，不涉及物资价格和成本核算。后端在 `server/`（FastAPI + SQLAlchemy 异步），网页端在 `web/`（Vue 3 + TypeScript），小程序在 `miniprogram/`。

## 部署

前端由独立 CI/CD 构建并与后端分离部署时，参见 [前后端分离部署](docs/frontend-separated-deployment.md)。

Docker Compose 方案依赖外部 MySQL 8.0+ 和外部网络 `1panel-network`：

```bash
cp docs/env/.env.example .env
mysql -h <host> -u <user> -p <database> < docs/references/database/init.sql
docker compose pull
docker compose up -d
```

至少设置 `APP_DATABASE_URL` 和 `APP_JWT_SECRET`；启用扫码出库小程序时还需设置 `APP_WECHAT_MINI_PROGRAM_APP_ID` 和 `APP_WECHAT_MINI_PROGRAM_APP_SECRET`，多个小程序按相同顺序用英文逗号分隔。

`docs/references/database/init.sql` 是**唯一的数据库结构来源**，用于新库初始化，同时写入初始账号（`admin`、`warehouse`、`purchase`、`readonly`，初始密码均为 `123456`，首次登录后请修改）。仓库不再保存增量迁移脚本，已有数据库的结构调整由部署方自行完成：先备份，再参照 `init.sql` 与 ORM 模型的差异，按各自流程改库。

前后端契约统一维护在 [docs/openapi.yaml](docs/openapi.yaml)，接口错误约定见 [docs/api-error-conventions.md](docs/api-error-conventions.md)。
