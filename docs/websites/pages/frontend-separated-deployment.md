# 前后端分离部署

前端用 Vite 构建，后端与图片地址在**构建阶段**注入并写进静态产物，部署后改服务器环境变量不生效，
必须重新构建。

## 构建变量

| 变量 | 必填 | 示例 | 说明 |
| --- | --- | --- | --- |
| `VITE_API_BASE_URL` | 分离部署时必填 | `https://api.example.com` | 后端地址；只填域名会自动补 `/api/v1`，也可填完整 API 根地址 |
| `VITE_IMAGE_BASE_URL` | 否 | `https://img.example.com` | 图床/CDN；只填域名会自动补 `/api/v1/files/images`，留空则从后端读 |
| `VITE_USE_MOCK` | 建议 | `false` | 生产应为 `false` |
| `VITE_API_PROXY` | 否 | `http://localhost:8000` | 仅 `npm run dev` 的本地代理 |
| `VITE_BASE_PATH` | 否 | `/Electrical-Manager/demo/` | 部署到子路径时用，默认 `/` |

所有 `VITE_*` 都会暴露给浏览器，禁止放密钥、Token。地址末尾可带斜杠，构建会自动清理。

## 构建

| 平台 | 命令 |
| --- | --- |
| Linux | `cd web && npm ci && VITE_USE_MOCK=false VITE_API_BASE_URL=https://api.example.com VITE_IMAGE_BASE_URL=https://img.example.com npm run build` |
| PowerShell | `Set-Location web; npm ci; $env:VITE_USE_MOCK='false'; $env:VITE_API_BASE_URL='https://api.example.com'; $env:VITE_IMAGE_BASE_URL='https://img.example.com'; npm run build` |

产物在 `web/dist/`，CD 阶段把它发布到静态站点、对象存储或 CDN 即可。

## 环境划分

| 环境 | `VITE_API_BASE_URL` | `VITE_IMAGE_BASE_URL` |
| --- | --- | --- |
| 测试 | `https://api-test.example.com` | `https://img-test.example.com` |
| 生产 | `https://api.example.com` | `https://img.example.com` |

每套环境单独出产物，避免同一个静态包跨环境复用。

## 后端跨域

后端用 `RefererCORSMiddleware`：优先按 `Referer` 解析前端站点，缺失或无效时回退 `Origin`，并为预检与正常响应（含结构化错误响应）补齐 CORS Header。

```text
Referer: https://spares.example.com/login?redirect=/
Origin: https://spares.example.com
Access-Control-Allow-Origin: https://spares.example.com
Vary: Origin, Referer
```

响应同时暴露 `Content-Disposition`、`X-Request-ID` 与接口性能头 `X-Response-Time`、`X-DB-Time`、`X-Compute-Time`、`X-DB-Queries`（含义见 [server/README.md](https://github.com/Sakana-1314/Electrical-Manager/blob/main/server/README.md) 的「接口性能响应头」）。本项目不使用 HTTP 404，错误响应统一为结构化业务错误体，详见 [API 错误与状态码约定](/api-error-conventions)。

| 配置 | 默认 | 说明 |
| --- | --- | --- |
| `APP_CORS_ALLOW_CREDENTIALS` | `true` | 是否允许携带凭证 |
| `APP_CORS_MAX_AGE` | `86400` | 预检结果缓存秒数 |

正常部署时 `Referer` 所属站点应与浏览器 `Origin` 相同；浏览器不发送 `Referer` 时自动回退 `Origin`。

## 图片 CDN / 图床

`VITE_IMAGE_BASE_URL` 只影响图片展示与预览；上传、删除仍走 `VITE_API_BASE_URL`。

| CDN 规则 | 要求 |
| --- | --- |
| 代理范围 | 仅 `GET /api/v1/files/images/*`，不要切上传/删除接口 |
| 缓存键 | 必须包含 `size` 查询参数，否则不同尺寸预览互相覆盖 |
| 缓存时间 | 遵循后端 `Cache-Control`；文件 ID 不变则内容不变，适合长缓存 |
| 路径处理 | 转发原始路径与查询串，不要重写 `file_id` |
| 协议 | 图床与前端都用 HTTPS |

不用图床时留空 `VITE_IMAGE_BASE_URL` 即可。

## EdgeOne Pages

| 项 | 值 |
| --- | --- |
| 部署配置 | `web/edgeone.json`（EdgeOne 项目根目录为 `web/`） |
| 构建产物 | `dist/`（JS/CSS 在 `dist/yangrucheng-assets/`，文件名带内容 hash） |
| 缓存规则 | `/yangrucheng-assets/*`、`/*.png`、`/*.jpg` → `max-age=1209600`（14 天） |

图片（`logo.png`、`qrcode.png`）在 `dist/` 根目录，因此 png/jpg 规则用全站后缀匹配而非限定在
`yangrucheng-assets/` 内；`edgeone.json` 的 `source` 是 URL 通配符（以 `/` 开头、最多一个 `*`）。
