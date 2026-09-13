# 系统概述

本页是开发文档的入口：说明系统当前覆盖的业务范围、术语口径、角色权限边界、技术栈与仓库结构。
所有内容以仓库中的代码、`docs/openapi.yaml` 契约与 `docs/references/database/init.sql` 为准，只描述**当前实现**。

- 表结构与 ORM 对照见 [/dev-data-model](/dev-data-model)
- 状态流转见 [/dev-state-machines](/dev-state-machines)
- 端到端数据流见 [/dev-flows](/dev-flows)
- 后端分层与配置见 [/dev-backend](/dev-backend)、前端见 [/dev-frontend](/dev-frontend)、测试见 [/dev-testing](/dev-testing)

## 1. 目标与业务范围

### 1.1 系统目标

| 目标 | 当前实现载体 |
| --- | --- |
| 库存数量只能通过入库/出库流水改变，全部可追溯 | `stock_operation` / `stock_operation_line` + `stock_balance`，`server/app/services/inventory_service.py` |
| 库存低于安全阈值时预警，并可一键生成补库申购计划 | `stock_replenishment_policy`、`inventory_service.inventory_balances`、`replenishment_service.create_replenishment_draft` |
| 申购计划可暂缺物料编码，编码补录后转入申购记录 | `purchase_material.material_code IS NULL` 即未编码，`purchase_request_service.move_plans_to_record` |
| 申购记录按申购单号整单跟踪采购进度并同步外部平台 | `purchase_request` / `purchase_request_line`、`purchase_record_sync_service` |
| 到货后从申购记录发起入库，库存与申购状态同步更新 | `inventory_service.create_operation` + `source_type=PURCHASE_RECEIPT` 语义、`purchase_record_sync_service._STATUS_PROGRESSION` |
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

- 系统只管理数量，**不涉及物资价格、金额、税率与成本核算**（`README.md`）；`init.sql` 中也没有任何金额字段。
- 合同号、船号、集港/发船日期、业务员等只作为申购记录上的**自由文本/日期字段**记录（见 `/dev-data-model`），当前未实现合同、供应商或付款单据管理。
- 未实现通用审批流引擎：请购/申购状态在代码中是可编辑字段与「只进不退」的同步规则，见 [/dev-state-machines](/dev-state-machines)。
- 未实现库位、批次、序列号、保质期、盘点差异单；库存调整只能通过入库、出库、修改流水或冲销流水完成。
- 库存允许为负数：`stock_balance.quantity` 为 `DECIMAL(18,1) NOT NULL`，出库不做余额充足校验。

### 1.4 关键设计约定

| 约定 | 说明 | 出处 |
| --- | --- | --- |
| 禁止 HTTP 404 | 资源不存在用 `400 + code=NOT_FOUND`；未匹配路由用 `400 + code=ROUTE_NOT_FOUND` | `server/app/core/errors.py`、`exception_handlers.handle_http_exception` |
| 乐观锁 `version` | 所有写入携带版本号，冲突返回 `409 VERSION_CONFLICT`；版本号走 `If-Match` 头 | `server/app/core/permissions.get_if_match_version`、`common.validate_version` |
| 数量用字符串传 | API 数量字段为字符串，避免 JS 浮点误差；后端校验最多 1 位小数 | `web/src/utils/decimal.ts`、`common.validate_quantity_precision` |
| 幂等提交 | 入出库请求必须带 `client_request_id`，重复请求返回首次结果 | `stock_operation.client_request_id` 唯一索引、`inventory_service.create_operation` |
| 数据库结构唯一来源 | 只维护 `docs/references/database/init.sql`，不提交增量迁移脚本，`server/tests/test_init_sql.py` 校验 ORM 与之一致 | `AGENTS.md`、`server/tests/test_init_sql.py` |
| 生成文件禁手改 | `docs/openapi.yaml` 是契约唯一来源，`web/src/api/generated.raw.ts` 由 `npm run generate:api` 生成 | `web/package.json` |
| 凭证加密入库并回显 | 接口令牌、API Key、Webhook 地址与密钥用 Fernet 加密存储，读取接口解密回显 | `server/app/core/security.fernet`、`dictionary_service._echo_api_token` |
| 时间统一 UTC | 数据库存 naive UTC `DATETIME(6)`，API 返回带时区 ISO 8601，前端按 `Asia/Shanghai` 展示 | `common.utc_aware` / `utc_naive`、`server/app/core/constants.SHANGHAI` |

按主题分组，点上方标签切换。

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
| 二级库 | `stock_material` | 电气车间自管的小库，物资档案不要求物料编码；每条记录有稳定 `uuid`（小程序码扫码用） |
| 二级库精简模式 | `SecondaryWarehouseMode.LITE` | 二级库运行模式开关：完整模式（`full`，物资/出入库/流水）与精简模式（`lite`，Excel 全量导入 + 只读查询）。落在 `system_setting` 的 `secondary_warehouse_mode`，影响路由、菜单与写接口 |
| 精简库存表 | `lite_inventory` | 精简模式下的独立库存表，字段为物资名称/型号规格/单位/数量/备注，全量替换导入 |
| 库存余额 | `stock_balance.quantity` | 查询加速数据，每物资一行；唯一合法写入口是流水重放 `inventory_service.replay_materials` |
| 库存流水 / 操作记录 | `stock_operation` + `stock_operation_line` | 出入库单据与明细，保存操作前后数量快照与物资快照，是审计依据 |
| 入库 / 出库 | `OperationType.INBOUND` / `OUTBOUND` | 两种流水类型；单号形如 `IN20260717000001` / `OUT...` |
| 冲销 | `SourceType.REVERSAL` + `reversal_of_id` | 以反向类型的新流水抵消原流水，按行记录 `remaining_qty`（剩余可冲数量），累计冲销不得超过原数量 |
| 初始化库存 | `SourceType.INITIALIZATION` | 首次建账入库；仍是一笔正常入库流水，且只能是入库 |
| 小程序出库 | `SourceType.MINI_PROGRAM` | 微信小程序扫码出库；落库时 `source_type` 记为 `MANUAL`，以 `mini_program_user_name_snapshot` 非空作为小程序来源判据 |
| 安全库存 / 最低库存 | `stock_replenishment_policy.minimum_qty` | 每物资一条策略，可单独启用；`enabled=false` 时不计入低库存 |
| 低库存 | `is_low_stock` | 查询时实时计算：`policy.enabled && current_qty <= minimum_qty`，不落库 |
| 建议申购数量 | `suggested_purchase_qty` | 近 6 个自然月内 `OUTBOUND` 且非冲销、未被冲销的流水数量之和，实时计算 |
| 补库 | `ReplenishmentDraft` | 低库存物资一键生成一条申购计划（不创建申购记录），复制名称/规格/单位/备注/图片/二级库关联，并尝试复用最近一次编码 |
| 申购计划 | `purchase_material` | 一条记录代表一次申购计划；`plan_no` 形如 `PLAN-20260717-001`，同日序号递增，上限 999 |
| 未编码物资 | `material_code IS NULL` | 无独立状态字段；未编码计划不能转入申购记录，也不能导出采购申请表 |
| 申购记录 | `purchase_request` + `purchase_request_line` | 一条记录行对应一个计划快照 + 采购跟踪字段；转入时把计划字段全部快照到行上 |
| 申购单号 | `purchase_request.purchase_order_no` | 公司系统单据号，默认「申购 2026/7/17」，可编辑；整单同步按它分组 |
| 追溯号 | `purchase_request_line.trace_no` | 外部平台查询键；同一追溯号可命中多行 |
| 子项号 | `subitem_no` | 自由文本，用于标识设备/系统子项，非唯一键 |
| 申购状态 | `purchase_request_line.status` | `VARCHAR(128)`，默认「已申购」；取值由数据决定（筛选项由 `purchase_status_options` 从库中 distinct 得出），同步时「只进不退」 |
| 计划状态 | `PurchasePlanStatus` | `NORMAL`（正常）/ `DEFERRED`（暂不申购）/ `ARCHIVED`（已归档）；仅超级管理员可查询/打开已归档计划 |
| 周期性计划 | `purchase_plan_template` | 计划模板，`generate` 时复制为当天的一条申购计划，模板本身不改动 |
| 物料编码库 | `material_code_library` | 公司编码参照表，Excel 全量替换导入，用于编码存在性校验 |
| 华星总库存 | `huaxing_inventory` | 上游总库库存快照表，Excel 全量替换导入，仅查询 |
| 图片 / 附件 | `file_object` | 磁盘 `data/uploads/{uuid7}.png` + 元数据行；上传时统一转 PNG 并按 SHA-256 去重 |
| 悬空文件 | orphan | 未被任何 `*_image` 关联表引用的记录、无记录的磁盘文件、缺失的磁盘文件，由超管接口清理 |
| 分享链接 | `share_link` | 匿名公开页 `/share/{token}`，token 为 UUIDv7；可配置展示列与失效时间，`columns=NULL` 表示默认列（全部列去掉「状态」） |
| 导出任务 | `excel_export_job` | `PENDING → RUNNING → SUCCEEDED/FAILED`；成功后文件保留 3 天，终态后按 uuid 匿名下载 |
| 导入任务 | `excel_import_job` | 同状态机；同类型同时只允许一个进行中任务（409 `IMPORT_IN_PROGRESS`），完成后删除临时文件 |
| 接口令牌 | `user.api_token_hash` / `api_token_enc` | 36 位令牌，SHA-256 哈希用于查找 + Fernet 密文用于界面回显；请求头 `X-API-Token` |
| 小程序功能模式 | `MiniProgramFeatureMode` | 每个小程序功能页三档：`disabled`（隐藏）/ `query_only`（只读）/ `read_write`（可出库） |
| Webhook 投递 | `webhook_delivery` | 事件出站队列，最多 5 次尝试，退避 `1/5/15/60/180` 分钟 |
| 业务事件日志 | `business_event_log` | 库存流水创建/修改/冲销等动作的前后 JSON 快照与操作者，见 `common.log_event` |
| MCP | `server/app/mcp_server.py` | 把 OpenAPI 里的业务接口暴露为 MCP 工具（`operations_list` / `operation_describe` / `operation_call`），按接口令牌对应的用户角色鉴权 |

</TabsContent>

<TabsContent id="t1">

### 3. 角色与权限

#### 3.1 角色定义

`server/app/domain/enums.py` 的 `Role` 只有一个字段一个角色，无多角色组合：

| 角色枚举 | 中文 | 前端权限点（`web/src/types/navigation.ts`） |
| --- | --- | --- |
| `SUPER_ADMIN` | 超级管理员 | `warehouse:write`、`purchase:write`、`settings:write`、`read` |
| `WAREHOUSE_ADMIN` | 仓库管理员 | `warehouse:write`、`read` |
| `PURCHASE_ADMIN` | 申购管理员 | `purchase:write`、`read` |
| `READ_ONLY` | 只读角色 | `read` |

#### 3.2 后端权限依赖

`server/app/core/permissions.py` 提供 3 个写依赖 + 1 个只读依赖，路由函数用类型注解声明：

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
| `/stock-materials` | `CurrentUser` | `WarehouseWriter` + `RequireFullSecondaryWarehouse` |
| `/inventory` | `CurrentUser` | `WarehouseWriter` + `RequireFullSecondaryWarehouse` |
| `/secondary-warehouse` | `CurrentUser` | 导入 `WarehouseWriter` |
| `/purchase-materials` | `CurrentUser` | `PurchaseWriter`；`POST /{id}/link-stock-material` 用局部定义的 `LinkWriter`（`SUPER_ADMIN`+`WAREHOUSE_ADMIN`+`PURCHASE_ADMIN`） |
| `/purchase-plan-templates` | `CurrentUser` | `PurchaseWriter` |
| `/purchase-records` | `CurrentUser` | `PurchaseWriter` |
| `/purchase-record-sync` | `PurchaseWriter` | `PurchaseWriter` |
| `/material-code-library`、`/huaxing-inventory` | `CurrentUser` | 导入 `PurchaseWriter` / `WarehouseWriter` |
| `/files/images` | 读取图片公开 | 上传 `SUPER_ADMIN/WAREHOUSE_ADMIN/PURCHASE_ADMIN`，孤儿清理 `SuperAdmin` |
| `/shares` | `CurrentUser` | `CurrentUser`（仅创建者本人或超管可改/删） |
| `/memos` | `CurrentUser` | `CurrentUser` |
| `/excel-export-jobs` | `CurrentUser`（属主或超管可见）；文件下载匿名 | — |
| `/ai-search`、`/system-settings/webhooks` | `SuperAdmin` | `SuperAdmin` |
| `/mini-program*` | 小程序 token | — |

#### 3.3 能力矩阵（4 角色 × 主要能力）

| 能力 | SUPER_ADMIN | WAREHOUSE_ADMIN | PURCHASE_ADMIN | READ_ONLY |
| --- | --- | --- | --- | --- |
| 工作台、备忘录、华星总库存、库存/流水查询 | ✅ | ✅ | ✅ | ✅ |
| 二级库物资增删改、安全库存设置 | ✅ | ✅ | — | — |
| 入库 / 出库 / 修改流水 / 冲销 | ✅ | ✅ | — | — |
| 精简二级库 Excel 导入 | ✅ | ✅ | — | — |
| 申购计划增删改、补录编码、关联二级库物资 | ✅ | — | ✅ | — |
| 转入 / 恢复申购记录、申购记录批量修改 | ✅ | — | ✅ | — |
| 采购跟踪同步回写 | ✅ | — | ✅ | — |
| 物料编码库导入与查询 | ✅ | — | ✅ | — |
| 查询到已归档申购计划（`status=ARCHIVED`） | ✅ | — | — | — |
| 管理端用户、接口令牌、小程序用户合并 | ✅ | — | — | — |
| 高级设置（AI 搜索、精简模式、小程序功能模式、Webhook） | ✅ | — | — | — |
| 图片孤儿文件排查与清理 | ✅ | — | — | — |
| 创建/撤回分享链接 | ✅ | ✅ | ✅ | ✅（仅自己的） |
| 导出任务创建 | ✅ | ✅ | ✅ | ✅ |

越权行为：写接口返回 `403 FORBIDDEN`（`require_roles`）、查询已归档计划返回 `403 ARCHIVED_PURCHASE_PLAN_FORBIDDEN`、精简模式下调用完整模式写接口返回 `403 SECONDARY_WAREHOUSE_LITE_MODE`（`server/app/api/deps._require_full_secondary_warehouse`）。

前端菜单与路由按 `auth.can(permission)` 与后端一致地隐藏入口（`web/src/layouts/AppLayout.vue`、`web/src/router/index.ts` 的 `meta.permission`），但**权限的最终判定在后端**。

</TabsContent>

<TabsContent id="t2">

### 4. 技术栈与版本

| 部分 | 技术 | 版本约束 | 依据 |
| --- | --- | --- | --- |
| 服务端语言 | Python | `>=3.12,<3.15`，镜像 `python:3.12-slim` | `server/pyproject.toml`、`server/Dockerfile` |
| Web 框架 | FastAPI | `>=0.141,<1` | `server/pyproject.toml` |
| ORM | SQLAlchemy（asyncio） | `>=2.0.36,<3` | 同上 |
| MySQL 驱动 | asyncmy | `>=0.2.10,<1` | 同上 |
| 配置 | pydantic-settings | `>=2.7,<3`（`APP_` 前缀 + `server/.env`） | `server/app/core/config.py` |
| 认证 | PyJWT `>=2.10,<3` + argon2-cffi `>=23.1,<26`（密码哈希） | — | `server/app/core/security.py` |
| 凭证加密 | cryptography `>=44,<47`（Fernet） | — | `server/app/core/security.fernet` |
| 图片 | Pillow `>=11,<13` | — | `server/app/services/file_service.py` |
| Excel | openpyxl `>=3.1.5,<4`、xlrd `>=2.0,<3` | — | `server/app/services/import_file_reader.py` |
| HTTP 客户端 | httpx `>=0.28,<1` | — | Webhook / AI 搜索 / 微信接口 / 测试 |
| MCP | `mcp>=2,<3` | — | `server/app/mcp_server.py` |
| 测试/质量 | pytest `>=8.3,<9`、pytest-asyncio `>=0.25,<1`、aiosqlite、ruff、mypy(strict) | — | `server/pyproject.toml` |
| 数据库 | MySQL 8.0 / InnoDB / `utf8mb4_0900_ai_ci` | — | `docs/references/database/init.sql` |
| 网页端 | Vue `^3.5.17`、Vue Router `^4.5.1`、Pinia `^3.0.3`、Naive UI `^2.42.0`、Axios `^1.10.0`、VueUse `^13.5.0` | — | `web/package.json` |
| 网页端构建 | Vite `^7.0.4`、TypeScript `~5.8.3`、vue-tsc `^3.0.3` | — | 同上 |
| 前端测试 | Vitest `^3.2.4`、Vue Test Utils `^2.4.6`、jsdom、MSW `^2.10.4` | — | 同上 |
| 契约代码生成 | openapi-typescript `^7.8.0` | — | `web/package.json` 的 `generate:api` |
| 小程序 | 微信小程序原生（WXML/WXSS/JS）+ `tdesign-miniprogram ^1.15.3`，`miniprogram-ci 2.1.31` | — | `miniprogram/package.json` |
| 项目站点 | VitePress `^1.6.4`，`srcDir: pages`，`base: /Electrical-Manager/` | — | `docs/websites/package.json`、`docs/websites/.vitepress/config.ts` |
| 部署 | Docker Compose，镜像 `ghcr.io/sakana-1314/electrical-manager:server` / `:web`，replica `nginx:1.27-alpine` | — | `docker-compose.yml`、`web/Dockerfile` |

</TabsContent>

<TabsContent id="t3">

### 5. 仓库目录结构

```text
Electrical-Manager/
├── AGENTS.md                 # 面向 AI 智能体的项目约定（提交、数据库、凭证回显等）
├── CLAUDE.md                 # 一行 @AGENTS.md 导入
├── README.md
├── docker-compose.yml        # backend(:8000) + frontend(:80→8080)，外部 1panel-network
├── docs/
│   ├── openapi.yaml          # 接口契约唯一来源（前端类型由它生成）
│   ├── env/                  # 环境变量模板
│   ├── references/database/init.sql  # 结构与种子数据唯一来源
│   └── websites/             # VitePress 站点（srcDir=pages，.vitepress/ 配置）
├── server/
│   ├── Dockerfile            # python:3.12-slim
│   ├── pyproject.toml        # 依赖、pytest/ruff/mypy 配置
│   ├── scripts/              # 导出 OpenAPI 等运维脚本
│   ├── data/                 # uploads/（图片、imports/、exports/）与 logs/
│   ├── app/
│   │   ├── main.py           # FastAPI 应用、lifespan 后台任务、MCP 挂载
│   │   ├── mcp_server.py     # MCP 工具：把业务接口暴露给 AI Agent
│   │   ├── api/deps.py       # 共享依赖（分页/排序/精简模式守卫）
│   │   ├── api/v1/           # 19 个路由模块（见 /dev-backend）
│   │   ├── core/             # config/database/security/permissions/errors/middleware/logging…
│   │   ├── domain/enums.py   # 全部业务枚举
│   │   ├── models/__init__.py# 全部 SQLAlchemy 模型（单文件，按域分段）
│   │   ├── repositories/     # 5 个查询仓储
│   │   ├── schemas/__init__.py # 全部 Pydantic 模型（单文件）
│   │   ├── services/         # 27 个业务服务
│   │   └── templates/        # Excel 布局 JSON 模板（运行时生成工作簿）
│   └── tests/                # unit/、integration/、根级测试（见 /dev-testing）
├── web/
│   ├── Dockerfile            # node:22-alpine 构建 → nginx:1.27-alpine 运行
│   ├── nginx.conf            # 静态托管与 /api 反向代理
│   ├── vite.config.ts / vitest.config.ts
│   └── src/                  # api/、router/、stores/、views/、components/、composables/…
└── miniprogram/
    ├── app.json              # 15 个页面
    ├── pages/                # home/outbound/inventory/purchase-*/records/bind…
    ├── components/           # material-summary-card
    ├── utils/                # request/auth/features/inventory/navigation/material/i18n
    └── scripts/              # check.js / upload.js（miniprogram-ci）
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
