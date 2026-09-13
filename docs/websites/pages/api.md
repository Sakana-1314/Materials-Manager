# 接口文档与 Mock

本项目所有 API 都由后端代码生成契约（`docs/openapi.yaml`），再用同一份契约驱动三件事：
**在线文档 / Mock（Apifox）**、**前端类型（`web/src/api/generated.ts`）**、**联调 Mock（MSW）**。
不存在手写的接口文档，因此不会出现"文档与实现不一致"。

## 契约是怎么来的

```
server/app/**（FastAPI + Pydantic 模型）
        │  cd server && python scripts/export_openapi.py
        ▼
docs/openapi.yaml            ← 唯一契约来源（含每个 schema 的示例数据）
        ├─ npx openapi-typescript ../docs/openapi.yaml -o src/api/generated.raw.ts   （web/ 下执行）
        │        ▼
        │  web/src/api/generated.ts（+ 手写的引用映射）
        └─ CI 自动同步 ──► Apifox 项目（在线文档 + Mock）
```

- **示例数据（Mock）**：`server/scripts/openapi_examples.py` 按字段名与类型为每个 schema 生成
  确定性示例（如 `material_code` → `DQ-000123`、`*_at` → 带时区时间），写入 schema 的 `examples`。
  同一份代码必然生成同一份示例，所以 CI 的契约漂移校验保持稳定。
- **禁止手改**：`docs/openapi.yaml` 与 `web/src/api/generated.raw.ts` 都是生成物；
  改接口请改后端代码后重新导出（`AGENTS.md` 的验证命令里有完整步骤）。

## Apifox（在线文档 / Mock）

CI 工作流 `.github/workflows/apifox.yml` 在 `main` 上 `docs/openapi.yaml` 或后端代码变更时，
自动把契约同步到 Apifox，无需手工导入。

| 项 | 值 |
| --- | --- |
| 项目 ID | `8831739`（仓库变量 `APIFOX_PROJECT_ID`） |
| 访问令牌 | 仓库 Secret `APIFOX_ACCESS_TOKEN` |
| 合并策略 | 接口与数据模型按路径/名称 `AUTO_MERGE`，不会覆盖 Apifox 里手写的测试用例 |

在 Apifox 里的用法：

1. **看接口**：左侧按 `docs/openapi.yaml` 的 tag 分组，每个接口带请求/响应字段说明与示例值。
2. **造 Mock**：项目里选「Mock 环境」，请求任意接口即按 schema `examples` 返回示例数据；
   需要登录态的接口用环境变量配置 `Authorization: Bearer <令牌>`（见下）。
3. **本地联调**：把环境的前置 URL 指向 `http://localhost:8000`，即可用真实后端跑通。

<Tabs :tabs="[
  { id: 't0', title: '用哪些令牌' },
  { id: 't1', title: 'MSW（前端本地 Mock）' },
  { id: 't2', title: '契约漂移校验' }
]">
<TabsContent id="t0">
接口鉴权支持两种等价写法（详见 `server/README.md`）：

| 场景 | 令牌 | 位置 |
| --- | --- | --- |
| 管理端 / MCP / 联调 | 用户接口令牌（UUID，管理后台「用户」页可复制、可重新生成） | `X-API-Token: <令牌>` 或 `Authorization: Bearer <令牌>` |
| 网页端登录态 | 登录返回的 access token | `Authorization: Bearer <access_token>` |

Apifox 环境变量建议建两条：

| 变量 | 示例值 | 说明 |
| --- | --- | --- |
| `baseUrl` | `http://localhost:8000` | 前置 URL |
| `api_token` | `admin` 的接口令牌 | 在「环境 → 变量」里保存，接口统一引用 `{{api_token}}` |

拿令牌：登录管理后台 → 「管理端用户」→ 复制自己的接口令牌（超级管理员可为他人生成）。
Mock 环境不需要真实令牌；只有指向真实后端时才需要。
</TabsContent>
<TabsContent id="t1">
`web/src/mocks/` 用 MSW 按同一份契约造响应，`npm run dev` 默认启用：

- `web/src/mocks/handlers.ts`：各接口的 handler 与 `DEFAULT_STATUS_BY_CODE`（与后端错误码一致）。
- `web/src/mocks/data.ts`：演示数据（四类角色、物资、流水、申购等）。
- 演示账号：`admin` / `warehouse` / `purchase` / `readonly`，密码均为 `123456`。

需要连真实后端时，把 `VITE_USE_MOCK=false` 并配 `VITE_API_BASE_URL`。
</TabsContent>
<TabsContent id="t2">
CI 的「契约一致性校验」工作流会：

1. 重跑 `python scripts/export_openapi.py`，比对 `docs/openapi.yaml` 有无变化；
2. 重跑 `npx openapi-typescript`，比对 `web/src/api/generated.raw.ts` 有无变化；
3. 跑 `npx vue-tsc -b` 确认类型引用仍成立。

所以改完后端接口后，必须把两份生成物一起提交，否则 CI 会停在第一步。
</TabsContent>
</Tabs>

## 接口分组

`docs/openapi.yaml` 按模块分 tag，与后端路由文件一一对应：

| tag | 路由文件 | 覆盖内容 |
| --- | --- | --- |
| 认证 | `server/app/api/v1/auth.py` | 登录、续期、当前用户 |
| 二级库物资 | `stock_materials.py` | 物资台账、库存余额、图片 |
| 库存流水 | `inventory.py` | 入库、出库、冲销、流水查询 |
| 申购计划 | `purchase_materials.py` | 计划 CRUD、未编码查询、导出 |
| 请购单 | `purchase_requests.py` | 请购单与到货、状态流转、导出 |
| 采购记录同步 | `purchase_record_sync.py` | 外部平台回写（配合油猴脚本） |
| 字典与用户 | `dictionaries.py` | 用户、字典项、接口令牌 |
| 文件 | `files.py` | 图片上传/下载、悬空文件清理 |
| 表格任务 | `excel_export_jobs.py` | 导出任务与下载 |
| 链接分享 | `share.py` | 分享链接管理与公开读取 |
| 小程序 | `mini_program.py` | 扫码登录、出库、只读查询 |
| 精简库存 | `secondary_warehouse.py`、`lite_inventory` 相关 | 精简模式导入与查询 |
| AI 搜索 | `ai_search.py` | 词条扩展与配置 |
| 系统设置 | `system_settings.py`、`memos.py`、`version.py` | 系统参数、备忘录、版本信息 |
| MCP | `server/app/mcp_server.py` | 供 AI Agent 调用的工具接口 |

具体字段与示例以 Apifox（或 `docs/openapi.yaml`）为准。
