# 接口文档与 Mock

所有接口都由后端代码生成契约 `docs/openapi.yaml`，再由它驱动前端类型、Apifox 在线文档与 Mock。
没有手写文档，因此不存在文档与实现不一致。

## 契约与生成物

| 产物 | 生成命令（工作目录） | 说明 |
| --- | --- | --- |
| `docs/openapi.yaml` | `cd server && python scripts/export_openapi.py` | 唯一契约来源，含每个 schema 的示例数据 |
| `web/src/api/generated.raw.ts` | `cd web && npm run generate:api` | 由契约生成，**禁止手改** |
| `web/src/api/generated.ts` | 随 `generated.raw.ts` | 手写的引用映射 |
| Apifox 项目 | CI 自动同步（`.github/workflows/apifox.yml`） | 在线文档 + Mock |

改完接口必须重新生成上面两份文件并提交，否则 CI 的契约漂移校验会失败。

## Apifox

| 项 | 值 |
| --- | --- |
| 项目 ID | `8831739`（仓库变量 `APIFOX_PROJECT_ID`） |
| 访问令牌 | 仓库 Secret `APIFOX_ACCESS_TOKEN` |
| 合并策略 | 接口与数据模型按路径 / 名称 `AUTO_MERGE`，不覆盖手写用例 |
| Mock 服务 | `https://m1.apifoxmock.com/m1/8831739-8625818-default` |

| 想做什么 | 怎么做 |
| --- | --- |
| 看接口 | 左侧按 `docs/openapi.yaml` 的 tag 分组；每个接口带字段说明与示例值 |
| 造 Mock | 选「Mock 环境」，请求任意接口即按 schema 示例返回数据 |
| 本地联调 | 把环境前置 URL 指向 `http://localhost:8000`，用真实后端跑通 |

<Tabs :tabs="[
  { id: 't0', title: '鉴权令牌' },
  { id: 't1', title: '前端 Mock' },
  { id: 't2', title: '漂移校验' }
]">
<TabsContent id="t0">
| 场景 | 令牌 | 位置 |
| --- | --- | --- |
| 管理端 / MCP / 联调 | 用户接口令牌（UUID） | `X-API-Token: ＜令牌＞` 或 `Authorization: Bearer ＜令牌＞` |
| 网页端登录态 | 登录返回的 access token | `Authorization: Bearer ＜access_token＞` |

用户接口令牌在管理后台「管理端用户」页可复制、可重新生成。建议在 Apifox 环境变量里放两条：
`baseUrl`（前置 URL）与 `api_token`，接口统一引用 `{{api_token}}`。Mock 环境不需要令牌。
</TabsContent>
<TabsContent id="t1">
`web/src/mocks/` 用 MSW 按同一份契约造响应，`npm run dev` 默认启用：

| 文件 | 作用 |
| --- | --- |
| `web/src/mocks/handlers.ts` | 83 个接口的 handler 与 `DEFAULT_STATUS_BY_CODE`（与后端错误码一致） |
| `web/src/mocks/data.ts` | 演示数据（四类角色、物资、流水、申购等） |
| `public/mockServiceWorker.js` | MSW worker（子路径部署时按 `BASE_URL` 注册） |

演示账号：`admin` / `warehouse` / `purchase` / `readonly`，密码均为 `123456`。
接真实后端时设 `VITE_USE_MOCK=false` 并配 `VITE_API_BASE_URL`。
</TabsContent>
<TabsContent id="t2">
CI 的「契约一致性校验」工作流依次执行：

| 步骤 | 命令 | 失败原因 |
| --- | --- | --- |
| 契约与后端一致 | `python scripts/export_openapi.py` + `git diff --exit-code docs/openapi.yaml` | 改了后端没重新导出 |
| 前端类型与契约一致 | `npx openapi-typescript ../docs/openapi.yaml -o src/api/generated.raw.ts` + `git diff` | 改了契约没重新生成 |
| 类型引用成立 | `npx vue-tsc -b` | 生成类型变了、引用没跟上 |
</TabsContent>
</Tabs>

## 接口命名

| 项 | 规则 |
| --- | --- |
| 接口名（`summary`） | 中文，动词开头、≤12 字、同模块内不重复；写在路由装饰器上，是 Apifox 显示的接口名 |
| `operationId` | 保持英文（机读标识：MCP 的 `operation_call`、生成的前端方法名依赖它） |

新增接口时必须写中文 `summary`，否则 Apifox 里会显示 FastAPI 自动生成的英文名。

## 接口分组

| tag | 路由文件（`server/app/api/v1/`） |
| --- | --- |
| 认证 | `auth.py` |
| 二级库物资 | `stock_materials.py` |
| 库存 | `inventory.py` |
| 申购计划 | `purchase_materials.py` |
| 申购记录 | `purchase_requests.py` |
| 申购记录同步 | `purchase_record_sync.py` |
| 基础数据 | `dictionaries.py` |
| 图片 | `files.py` |
| 导出任务 | `excel_export_jobs.py` |
| 链接分享 | `share.py` |
| 小程序 | `mini_program.py`（`mini_router`） |
| 小程序用户管理 | `mini_program.py`（`management_router`） |
| 精简库存 | `secondary_warehouse.py` |
| 华星库存 | `huaxing_inventory.py` |
| 物料编码库 | `material_code_library.py` |
| 周期性计划 | `purchase_plan_templates.py` |
| 系统设置 | `system_settings.py` |
| 备忘录 | `memos.py` |
| AI 搜索 | `ai_search.py` |
| 版本信息 | `version.py` |
| MCP | `server/app/mcp_server.py` |

字段与示例以 Apifox（或 `docs/openapi.yaml`）为准。
