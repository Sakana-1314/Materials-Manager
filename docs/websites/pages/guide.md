# 使用与部署指南

## 组成

| 部分 | 目录 | 发布方式 |
| --- | --- | --- |
| 服务端（FastAPI） | `server/` | 镜像 `electrical-manager:server` |
| 网页端（Vue 3 + nginx） | `web/` | 镜像 `electrical-manager:web` |
| 小程序 | `miniprogram/` | CI 上传微信小程序代码 |
| 数据库结构与种子数据 | `docs/references/database/init.sql` | 手工初始化 |
| 项目站点（本站） | `docs/websites/` | CI 构建后发布到 `gh-pages` 分支 |
| 接口文档 / Mock | `docs/openapi.yaml` | CI 同步到 Apifox |

## Docker 部署

前提：外部 MySQL 8.0+（库先建好）与外部网络 `1panel-network`。

```bash
git clone https://github.com/Sakana-1314/Electrical-Manager.git
cd Electrical-Manager
cp docs/env/.env.example .env          # 按注释填写
mysql -h <host> -u <user> -p <database> < docs/references/database/init.sql
docker compose pull
docker compose up -d
```

`docker-compose.yml` 使用 `ghcr.io/sakana-1314/electrical-manager:server` 与 `:web` 两个镜像；端口由 `BACKEND_PORT`（默认 8000）和 `FRONTEND_PORT`（默认 8080）控制。

## 环境变量

至少设置 `APP_DATABASE_URL` 与 `APP_JWT_SECRET`，其余按需：

| 变量 | 说明 |
| --- | --- |
| `APP_DATABASE_URL` | 如 `mysql+asyncmy://user:pass@mysql:3306/db?charset=utf8mb4`，密码需 URL 编码。 |
| `APP_JWT_SECRET` | 至少 32 位随机字符串，生产环境必须修改。 |
| `APP_ACCESS_TOKEN_MINUTES` | 登录有效期（分钟），默认 480。 |
| `APP_FERNET_KEY` | 可选，加密 API Key / Webhook 密钥的专用密钥；留空则从 `APP_JWT_SECRET` 派生。 |
| `APP_WECHAT_MINI_PROGRAM_APP_ID` | 扫码出库小程序 AppID，多个按相同顺序用英文逗号分隔。 |
| `APP_WECHAT_MINI_PROGRAM_APP_SECRET` | 与上一项一一对应，只能保存在服务端。 |
| `BACKEND_PORT` / `FRONTEND_PORT` | 宿主机映射端口，默认 8000 / 8080。 |

模板见 `docs/env/.env.example`（Compose 部署）与 `docs/env/backend.env.example`、`docs/env/frontend.env.example`（本地开发）；完整清单（含日志、跨域、限流等）见 [后端架构](/dev-backend)。

## 数据库

| 事项 | 说明 |
| --- | --- |
| 结构与种子数据 | `docs/references/database/init.sql` 是唯一来源，用于新库初始化；`server/tests/test_init_sql.py` 强制校验它与 ORM 模型一致，改模型必须同步改 `init.sql`。 |
| 初始账号 | `admin`、`warehouse`、`purchase`、`readonly`，初始密码均为 `123456`，首次登录后请修改。 |
| 已有库升级 | 仓库不保存增量迁移脚本：先备份，再参照 `init.sql` 与服务端 ORM 模型的差异，按各自流程改库。 |

表结构说明见 [数据模型](/dev-data-model)。

## 本地开发

服务端（`server/`，Python 3.12 + MySQL 8.0）：

```bash
python -m venv .venv
.venv/Scripts/pip install -e ".[dev]"
copy ..\docs\env\backend.env.example .env
mysql -h <数据库地址> -u <用户名> -p <数据库名> < ../docs/references/database/init.sql
.venv/Scripts/uvicorn app.main:app --reload
```

网页端（`web/`，Node 20+）：

```bash
npm install
npm run dev          # 默认代理到 http://localhost:8000；接 Apifox Mock 见 web/README.md
```

接口文档在 `http://localhost:8000/api/docs`。提交前按 `AGENTS.md` 的验证命令执行 `npx vue-tsc -b`、`npm run lint`、`npm run test`、`npm run build` 与 `pytest`。

## 前后端分离

网页端由独立 CI/CD 构建、与 API 分开部署时，通过构建变量注入 API 与图片地址，并在服务端配置跨域。完整说明见[前后端分离部署](/frontend-separated-deployment)。

## 文档站点

本站由 `docs/websites/` 下的 VitePress 工程构建：CI 在 `main` 变更时构建并推送到 `gh-pages` 分支，由 GitHub Pages 发布。

```bash
cd docs/websites
npm install
npm run dev        # 本地预览
npm run build      # 产物在 .vitepress/dist
```

## 接口文档与 Mock

`docs/openapi.yaml` 是唯一契约来源（由 `server/scripts/export_openapi.py` 从后端生成，含每个 schema 的示例数据）。CI 在 `main` 变更时自动同步到 Apifox 项目，用于在线查看接口与生成 Mock：在 Apifox 里选「Mock 环境」即可按 schema 示例返回数据。
