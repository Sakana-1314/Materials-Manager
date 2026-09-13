# 系统概述

## 1. 目标与业务范围

### 1.1 系统目标
| 目标 | 实现载体 |
| --- | --- |
| 库存只能由入库/出库流水改变，全部可追溯 | `stock_operation` / `stock_operation_line` + `stock_balance`，`server/app/services/inventory_service.py` |
| 低于安全阈值预警，并可一键生成补库申购计划 | `stock_replenishment_policy`、`inventory_service.inventory_balances`、`replenishment_service.create_replenishment_draft` |
| 申购计划可暂缺物料编码，补录后转入申购记录 | `purchase_material.material_code IS NULL` 即未编码，`purchase_request_service.move_plans_to_record` |
| 申购记录按申购单号整单跟踪采购进度并同步外部平台 | `purchase_request` / `purchase_request_line`、`purchase_record_sync_service` |
| 到货后从申购记录发起入库，库存与申购状态同步 | `inventory_service.create_operation`、`purchase_record_sync_service._STATUS_PROGRESSION` |
| 管理后台、微信小程序、AI Agent 共用同一份契约 | `docs/openapi.yaml` → `web/src/api/generated.raw.ts`；`server/app/mcp_server.py` 复用业务接口 |

### 1.2 当前覆盖的业务域
| 域 | 管理后台页面 | 接口前缀 | 核心表 |
| --- | --- | --- | --- |
| 二级库物资与库存 | `/warehouse/stock`、`/warehouse/materials`、`/warehouse/operations` | `/stock-materials`、`/inventory` | `stock_material`、`stock_balance`、`stock_operation`、`stock_operation_line` |
| 二级库精简模式 | `/warehouse/lite` | `/secondary-warehouse` | `lite_inventory`、`excel_import_job` |
| 申购计划与编码 | `/procurement/materials`、`/procurement/uncoded-materials` | `/purchase-materials` | `purchase_material`、`purchase_material_image` |
| 周期性计划 | `/procurement/purchase-plan-templates` | `/purchase-plan-templates` | `purchase_plan_template`、`purchase_plan_template_image` |
| 申购记录与采购跟踪 | `/procurement/records` | `/purchase-records`、`/purchase-record-sync` | `purchase_request`、`purchase_request_line`、`purchase_request_line_image` |
| 物料编码库 / 华星总库存 | `/procurement/material-code-library`、`/warehouse/hua-xing-stock` | `/material-code-library`、`/huaxing-inventory` | `material_code_library`、`huaxing_inventory` |
| 图片附件 | 各物资/计划表单内 | `/files/images` | `file_object`、`*_image` 关联表 |
| 链接分享 | `/settings/share-links`、公开页 `/share/:token` | `/shares` | `share_link` |
| 备忘录 | `/memos` | `/memos` | `memo` |
| 用户、系统设置与推送 | `/settings/*` | `/auth`、`/users`、`/system-settings`、`/ai-search` | `user`、`mini_program_user`、`mini_program_identity`、`system_setting`、`webhook_channel`、`webhook_delivery` |
| 异步任务 | 导入/导出按钮与进度轮询 | `/excel-export-jobs`、各模块 `/import` | `excel_import_job`、`excel_export_job` |
| 小程序 | 微信小程序 15 个页面 | `/mini-program`、`/mini-program-users` | 复用库存/申购表 |

### 1.3 业务边界
| 边界 | 说明 |
| --- | --- |
| 只管理数量 | 不涉及物资价格、金额、税率与成本核算；`init.sql` 中无任何金额字段 |
| 合同/船期只做记录 | 合同号、船号、集港/发船日期、业务员是申购记录上的自由文本/日期字段；无合同、供应商、付款单据管理 |
| 无通用审批流引擎 | 请购/申购状态为可编辑字段 + 「只进不退」同步规则，见 [/dev-state-machines](/dev-state-machines) |
| 无库位/批次 | 无库位、批次、序列号、保质期、盘点差异单；库存调整只能靠入库、出库、修改流水或冲销流水 |
| 允许负库存 | `stock_balance.quantity` 为 `DECIMAL(18,1) NOT NULL`，出库不做余额充足校验 |

### 1.4 关键设计约定
| 约定 | 说明 |
| --- | --- |
| 禁止 HTTP 404 | 资源不存在用 `400 + code=NOT_FOUND`；未匹配路由用 `400 + code=ROUTE_NOT_FOUND`（`server/app/core/errors.py`、`exception_handlers.handle_http_exception`） |
| 乐观锁 `version` | 所有写入携带版本号（`If-Match` 头），冲突返回 `409 VERSION_CONFLICT`（`server/app/core/permissions.get_if_match_version`、`common.validate_version`） |
| 数量用字符串传 | API 数量字段为字符串以避开 JS 浮点误差，后端校验最多 1 位小数（`web/src/utils/decimal.ts`、`common.validate_quantity_precision`） |
| 幂等提交 | 入出库必须带 `client_request_id`，重复请求返回首次结果（`stock_operation.client_request_id` 唯一索引、`inventory_service.create_operation`） |
| 单一来源 | `docs/references/database/init.sql` 是数据库结构与种子数据唯一来源（不提交迁移脚本，`server/tests/test_init_sql.py` 校验 ORM 一致）；`docs/openapi.yaml` 是契约唯一来源，`web/src/api/generated.raw.ts` 由 `npm run generate:api` 生成 |
| 凭证加密入库并回显 | 接口令牌、API Key、Webhook 地址与密钥用 Fernet 加密存储，读取接口解密回显（`server/app/core/security.fernet`、`dictionary_service._echo_api_token`） |
| 时间统一 UTC | 数据库存 naive UTC `DATETIME(6)`，API 返回带时区 ISO 8601，前端按 `Asia/Shanghai` 展示（`common.utc_aware` / `utc_naive`、`server/app/core/constants.SHANGHAI`） |

<Tabs :tabs="[
  { id: 't0', title: '术语表' },
  { id: 't1', title: '角色与权限' },
  { id: 't2', title: '技术栈与版本' },
  { id: 't3', title: '目录与运行形态' }
]">

<TabsContent id="t0">

### 2. 术语表

| 术语 | 代码标识 | 定义 |
| --- | --- | --- |
| 二级库 | `stock_material` | 电气车间自管小库，物资档案不要求物料编码；每条记录有稳定 `uuid`（小程序码扫码用） |
| 二级库精简模式 | `SecondaryWarehouseMode.LITE` | 二级库运行模式：完整模式 `full`（物资/出入库/流水）与精简模式 `lite`（Excel 全量导入 + 只读查询）；落在 `system_setting.secondary_warehouse_mode`，影响路由、菜单与写接口 |
| 精简库存表 | `lite_inventory` | 精简模式下的独立库存表：物资名称/型号规格/单位/数量/备注，全量替换导入 |
| 库存余额 / 库存流水 | `stock_balance.quantity`；`stock_operation` + `stock_operation_line` | 余额是查询加速数据，每物资一行，唯一合法写入口是流水重放 `inventory_service.replay_materials`；流水是出入库单据与明细，保存操作前后数量快照与物资快照，为审计依据 |
| 入库 / 出库 | `OperationType.INBOUND` / `OUTBOUND` | 两种流水类型；单号形如 `IN20260717000001` / `OUT...` |
| 冲销 | `SourceType.REVERSAL` + `reversal_of_id` | 以反向类型的新流水抵消原流水，按行记录 `remaining_qty`（剩余可冲数量），累计冲销不得超过原数量 |
| 初始化 / 小程序出库 | `SourceType.INITIALIZATION` / `SourceType.MINI_PROGRAM` | 初始化库存是首次建账入库（仍是正常入库流水，且只能是入库）；小程序出库落库时 `source_type` 记为 `MANUAL`，以 `mini_program_user_name_snapshot` 非空作为来源判据 |
| 安全库存 / 最低库存 | `stock_replenishment_policy.minimum_qty` | 每物资一条策略，可单独启用；`enabled=false` 时不计入低库存，`CHECK (minimum_qty >= 0)` |
| 低库存与建议申购数量 | `is_low_stock` / `suggested_purchase_qty` | 均查询时实时计算、不落库：低库存 = `policy.enabled && current_qty <= minimum_qty`；建议数量 = 近 6 个自然月内 `OUTBOUND` 且非冲销、未被冲销的流水数量之和 |
| 补库 | `ReplenishmentDraft` | 低库存物资一键生成一条申购计划（不创建申购记录），复制名称/规格/单位/备注/图片/二级库关联，并尝试复用最近一次编码 |
| 申购计划 | `purchase_material` | 一条记录代表一次申购计划；`plan_no` 形如 `PLAN-20260717-001`，同日序号递增，上限 999 |
| 未编码物资 | `material_code IS NULL` | 无独立状态字段；未编码计划不能转入申购记录，也不能导出采购申请表 |
| 申购记录 | `purchase_request` + `purchase_request_line` | 一条记录行对应一个计划快照 + 采购跟踪字段；转入时把计划字段全部快照到行上 |
| 申购单号 / 追溯号 | `purchase_request.purchase_order_no` / `purchase_request_line.trace_no` | 申购单号是公司系统单据号，默认「申购 2026/7/17」，可编辑，整单同步按它分组；追溯号是外部平台查询键，同一追溯号可命中多行 |
| 子项号 | `subitem_no` | 自由文本，用于标识设备/系统子项，非唯一键 |
| 申购状态 | `purchase_request_line.status` | `VARCHAR(128)`，默认「已申购」；取值由数据决定（筛选项由 `purchase_status_options` 从库中 distinct 得出），同步时「只进不退」 |
| 计划状态 | `PurchasePlanStatus` | `NORMAL`（正常）/ `DEFERRED`（暂不申购）/ `ARCHIVED`（已归档）；仅超级管理员可查询/打开已归档计划 |
| 周期性计划 | `purchase_plan_template` | 计划模板，`generate` 时复制为当天的一条申购计划，模板本身不改动 |
| 编码库 / 华星总库存 | `material_code_library` / `huaxing_inventory` | 均为 Excel 全量替换导入：前者是公司编码参照表（用于编码存在性校验），后者是上游总库库存快照（仅查询） |
| 图片 / 附件与悬空文件 | `file_object` / orphan | 磁盘 `data/uploads/{uuid7}.png` + 元数据行；上传时统一转 PNG 并按 SHA-256 去重。悬空文件指未被任何 `*_image` 关联表引用的记录、无记录的磁盘文件、缺失的磁盘文件，由超管接口清理 |
| 分享链接 | `share_link` | 匿名公开页 `/share/{token}`，token 为 UUIDv7；可配置展示列与失效时间，`columns=NULL` 表示默认列（全部列去掉「状态」） |
| 导出 / 导入任务 | `excel_export_job` / `excel_import_job` | 同一状态机 `PENDING → RUNNING → SUCCEEDED/FAILED`；导出成功后文件保留 3 天、按 uuid 匿名下载；导入同类型同时只允许一个进行中任务（409 `IMPORT_IN_PROGRESS`），完成后删临时文件 |
| 接口令牌 | `user.api_token_hash` / `api_token_enc` | 36 位令牌，SHA-256 哈希用于查找 + Fernet 密文用于界面回显；请求头 `X-API-Token` |
| 小程序功能模式 | `MiniProgramFeatureMode` | 每个小程序功能页三档：`disabled`（隐藏）/ `query_only`（只读）/ `read_write`（可出库） |
| Webhook 投递 / 业务事件日志 | `webhook_delivery` / `business_event_log` | 前者是事件出站队列（最多 5 次尝试，退避 `1/5/15/60/180` 分钟）；后者记录库存流水创建/修改/冲销等动作的前后 JSON 快照与操作者（`common.log_event`） |
| MCP | `server/app/mcp_server.py` | 把 OpenAPI 里的业务接口暴露为 MCP 工具（`operations_list` / `operation_describe` / `operation_call`），按接口令牌对应的用户角色鉴权 |

</TabsContent>

<TabsContent id="t1">

### 3. 角色与权限

#### 3.1 角色、权限点与能力

`Role`（`server/app/domain/enums.py`）只有一个字段一个角色，无多角色组合；权限点为 `web/src/types/navigation.ts` 的 `rolePermissions`。

| 角色 | 权限点 | 能力 |
| --- | --- | --- |
| `SUPER_ADMIN` 超级管理员 | `warehouse:write`、`purchase:write`、`settings:write`、`read` | 全部能力：二级库物资增删改与安全库存、入库/出库/修改流水/冲销、精简二级库 Excel 导入、申购计划增删改与补录编码、关联二级库物资、转入/恢复申购记录与批量修改、采购跟踪同步回写、物料编码库导入与查询、查询已归档计划（`status=ARCHIVED`）、管理端用户/接口令牌/小程序用户合并、高级设置（AI 搜索、精简模式、小程序功能模式、Webhook）、图片孤儿文件排查清理、创建/撤回分享链接、创建导出任务 |
| `WAREHOUSE_ADMIN` 仓库管理员 | `warehouse:write`、`read` | 二级库物资增删改与安全库存、入库/出库/修改流水/冲销、精简二级库 Excel 导入、创建/撤回分享链接、创建导出任务；其余只读 |
| `PURCHASE_ADMIN` 申购管理员 | `purchase:write`、`read` | 申购计划增删改与补录编码、关联二级库物资、转入/恢复申购记录与批量修改、采购跟踪同步回写、物料编码库导入与查询、创建/撤回分享链接、创建导出任务；其余只读 |
| `READ_ONLY` 只读角色 | `read` | 工作台、备忘录、华星总库存、库存/流水查询、创建/撤回自己的分享链接、创建导出任务 |

#### 3.2 后端权限依赖（`server/app/core/permissions.py`）

3 个写依赖 + 1 个只读依赖，路由函数用类型注解声明：

| 依赖别名 | 允许角色 | 越权错误 |
| --- | --- | --- |
| `CurrentUser` | 任意已认证用户（含接口令牌） | 未认证 `401 UNAUTHORIZED` |
| `WarehouseWriter` | `SUPER_ADMIN`、`WAREHOUSE_ADMIN` | `403 FORBIDDEN` |
| `PurchaseWriter` | `SUPER_ADMIN`、`PURCHASE_ADMIN` | `403 FORBIDDEN` |
| `SuperAdmin` | `SUPER_ADMIN` | `403 FORBIDDEN` |
| `CurrentMiniProgramUser` | 小程序 JWT（`token_type=mini_program`） | 待审核 `403 ACCOUNT_DISABLED` |
| `MiniProgramRegistrationOpenId` | 小程序注册凭证（10 分钟有效） | `401 INVALID_TOKEN` |

各接口模块实际使用的依赖：

| 接口模块 | 读 | 写 |
| --- | --- | --- |
| `/auth` | `CurrentUser` | 登录/续期公开 |
| `/users`（`dictionaries.py`） | `SuperAdmin` | `SuperAdmin` |
| `/stock-materials`、`/inventory` | `CurrentUser` | `WarehouseWriter` + `RequireFullSecondaryWarehouse` |
| `/secondary-warehouse` | `CurrentUser` | 导入 `WarehouseWriter` |
| `/purchase-materials` | `CurrentUser` | `PurchaseWriter`；`POST /{id}/link-stock-material` 用局部 `LinkWriter`（三写角色） |
| `/purchase-plan-templates` | `CurrentUser` | `PurchaseWriter` |
| `/purchase-records` | `CurrentUser` | `PurchaseWriter` |
| `/purchase-record-sync` | `PurchaseWriter` | `PurchaseWriter` |
| `/material-code-library`、`/huaxing-inventory` | `CurrentUser` | 导入 `PurchaseWriter` / `WarehouseWriter` |
| `/files/images` | 读取图片公开 | 上传 `SUPER_ADMIN/WAREHOUSE_ADMIN/PURCHASE_ADMIN`，孤儿清理 `SuperAdmin` |
| `/shares`、`/memos` | `CurrentUser` | `CurrentUser`（分享仅创建者本人或超管可改/删） |
| `/excel-export-jobs` | `CurrentUser`（属主或超管可见）；文件下载匿名 | — |
| `/ai-search`、`/system-settings/webhooks` | `SuperAdmin` | `SuperAdmin` |
| `/mini-program*` | 小程序 token | — |

| 越权场景 | 结果 | 实现 |
| --- | --- | --- |
| 写接口权限不足 | `403 FORBIDDEN` | `core.permissions.require_roles` |
| 查询已归档申购计划 | `403 ARCHIVED_PURCHASE_PLAN_FORBIDDEN` | `api/v1/purchase_materials.py` |
| 精简模式下调用完整模式写接口 | `403 SECONDARY_WAREHOUSE_LITE_MODE` | `api/deps._require_full_secondary_warehouse` |

前端按 `auth.can(permission)` 隐藏入口（`layouts/AppLayout.vue`、`router/index.ts` 的 `meta.permission`），**权限的最终判定在后端**。

</TabsContent>

<TabsContent id="t2">

### 4. 技术栈与版本

| 部分 | 技术 | 版本约束 |
| --- | --- | --- |
| 服务端语言与框架 | Python（镜像 `python:3.12-slim`）+ FastAPI + SQLAlchemy（asyncio）+ asyncmy | Python `>=3.12,<3.15`；FastAPI `>=0.141,<1`；SQLAlchemy `>=2.0.36,<3`；asyncmy `>=0.2.10,<1`（`server/pyproject.toml`、`server/Dockerfile`） |
| 服务端依赖与数据库 | pydantic-settings（`APP_` 前缀 + `server/.env`）；PyJWT + argon2-cffi（密码哈希）；cryptography（Fernet 凭证加密）；Pillow；openpyxl / xlrd；httpx；mcp；pytest / pytest-asyncio / aiosqlite、ruff、mypy(strict)；MySQL / InnoDB / `utf8mb4_0900_ai_ci` | pydantic-settings `>=2.7,<3`；PyJWT `>=2.10,<3`、argon2-cffi `>=23.1,<26`；cryptography `>=44,<47`；Pillow `>=11,<13`；openpyxl `>=3.1.5,<4`、xlrd `>=2.0,<3`；httpx `>=0.28,<1`；mcp `>=2,<3`；pytest `>=8.3,<9`、pytest-asyncio `>=0.25,<1`；MySQL 8.0（`server/app/core/config.py`、`server/app/core/security.py`、`server/app/services/file_service.py`、`server/app/services/import_file_reader.py`、`server/app/mcp_server.py`） |
| 网页端 | Vue、Vue Router、Pinia、Naive UI、Axios、VueUse | `^3.5.17`、`^4.5.1`、`^3.0.3`、`^2.42.0`、`^1.10.0`、`^13.5.0` |
| 网页端构建与测试 | Vite、TypeScript、vue-tsc；Vitest、Vue Test Utils、jsdom、MSW；openapi-typescript（契约生成） | Vite `^7.0.4`、TypeScript `~5.8.3`、vue-tsc `^3.0.3`；Vitest `^3.2.4`、Vue Test Utils `^2.4.6`、MSW `^2.10.4`；openapi-typescript `^7.8.0`（`web/package.json`） |
| 小程序与站点 | 微信小程序原生（WXML/WXSS/JS）+ tdesign-miniprogram、miniprogram-ci；VitePress 站点（`srcDir: pages`、`base: /Electrical-Manager/`） | tdesign `^1.15.3`、miniprogram-ci `2.1.31`；VitePress `^1.6.4`（`miniprogram/package.json`、`docs/websites/package.json`、`docs/websites/.vitepress/config.ts`） |
| 部署 | Docker Compose；镜像 `ghcr.io/sakana-1314/electrical-manager:server` / `:web`；replica `nginx:1.27-alpine`（`docker-compose.yml`、`web/Dockerfile`） | — |

</TabsContent>

<TabsContent id="t3">

### 5. 仓库目录结构

```text
Electrical-Manager/
├── AGENTS.md / CLAUDE.md / README.md / docker-compose.yml（backend:8000 + frontend:80→8080，外部 1panel-network）
├── docs/   openapi.yaml（契约唯一来源）、env/、references/database/init.sql（结构唯一来源）、websites/（VitePress）
├── server/ Dockerfile（python:3.12-slim）、pyproject.toml、scripts/（导出 OpenAPI 等）、data/（uploads/imports/exports、logs/）、tests/（unit/、integration/）
│   └── app/  main.py（FastAPI、lifespan worker、MCP 挂载）、mcp_server.py
│       ├── api/deps.py（分页/排序/精简模式守卫）、api/v1/（19 个路由模块）
│       ├── core/（config、database、security、permissions、errors、middleware、logging、constants…）
│       ├── domain/enums.py、models/__init__.py、schemas/__init__.py、templates/（Excel 布局 JSON）
│       └── repositories/（5 个查询仓储）、services/（27 个业务服务）
├── web/    Dockerfile（node:22-alpine → nginx:1.27-alpine）、nginx.conf、vite.config.ts、vitest.config.ts、src/（api、router、stores、views、components、composables…）
└── miniprogram/  app.json（15 个页面）、pages/、components/、utils/、scripts/（check.js / upload.js）
```

### 6. 运行形态

| 组件 | 端口 | 说明 |
| --- | --- | --- |
| 后端 | 8000 | `/health`（含 DB 探测）、`/api/docs`（Swagger）、`/api/v1/openapi.json`、`/api/v1/*`、`/api/v1/mcp` |
| 前端 | 容器 80，宿主默认 8080 | Nginx 托管静态资源并代理 `/api` 到后端 |
| 数据库 | 外部 MySQL 8.0 | 由部署方用 `docs/references/database/init.sql` 初始化；容器不自动执行脚本 |
| 持久化 | `uploads`、`logs` 两个命名卷 | 图片、导入临时文件、导出文件与日志 |

部署与环境变量清单见 [/guide](/guide)、[/frontend-separated-deployment](/frontend-separated-deployment)，配置项逐条说明见 [/dev-backend](/dev-backend)。

</TabsContent>

</Tabs>
