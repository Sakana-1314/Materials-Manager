# 后端架构

后端是 FastAPI + SQLAlchemy 2.x async（MySQL 8.0 / asyncmy）单进程应用，位于 `server/`，源码包名为 `app`。
它对外提供三类入口：管理端 REST 接口（`/api/v1/*`）、微信小程序接口（`/api/v1/mini-program/*`）、
以及挂载在 `/api/v1/mcp` 的 MCP（Streamable HTTP）服务；同时在同一进程内运行若干常驻后台 worker。
运行方式：开发用 `uvicorn app.main:app --reload`，容器内 CMD 为
`uvicorn app.main:app --host 0.0.0.0 --port 8000`（见 `server/Dockerfile`）。

相关页面：[总览](/dev-overview)、[数据模型](/dev-data-model)、[状态机](/dev-state-machines)、
[业务流程](/dev-flows)、[前端架构](/dev-frontend)、[测试](/dev-testing)、[API 错误约定](/api-error-conventions)。

## 分层架构

| 层 | 目录/文件 | 职责（依据代码/docstring） |
| --- | --- | --- |
| 路由层 | `server/app/api/v1/*.py`、`server/app/api/deps.py` | 参数解析与校验（`Query(ge=1, le=200)`、`max_length`、`Literal["asc","desc"]`）、依赖注入取当前用户/权限、把 service 结果转成 `Page[...]` 等响应模型、抛 `AppError` 表达参数类错误 |
| 服务层 | `server/app/services/*.py` | 业务规则与状态流转校验、乐观锁校验（`common.validate_version`）、事务边界（显式 `await session.commit()`）、审计事件（`common.log_event`）、read 模型组装、后台任务编排 |
| 仓储层 | `server/app/repositories/*.py` | 模块 docstring 统一写明：**只承载纯 SELECT 查询（含 `with_for_update` 锁定查询），不抛业务错误、不组装 read、不自建 session**；可排序列白名单字典也定义在这里 |
| 模型层 | `server/app/models/__init__.py` | 唯一的 ORM 声明文件（表名/列/约束/索引）；`docs/references/database/init.sql` 与其一致，由 `server/tests/test_init_sql.py` 校验 |
| 模型契约层 | `server/app/schemas/__init__.py`、`server/app/domain/enums.py` | pydantic 请求/读模型、`Page[T]`、`ApiError`；领域枚举（`Role`、`OperationType`、`SourceType`、`PurchasePlanStatus` 等） |
| 核心层 | `server/app/core/*.py` + `main.py`、`mcp_server.py` | 配置、引擎/会话、认证与权限、错误码与异常处理器、中间件、日志、常量、UUIDv7 生成、微信凭据 |

分层调用方向为 `api → service → repository → models`，service 之间也可互相调用（如 `inventory_service` 调用 `webhook_service`）。
`grep "from app.repositories"` 只在 `server/app/services/` 下命中，说明 api 层不直接访问仓储层。

## 目录结构

`server/app/` 全部 Python 文件（共 72 个，`find server/app -type f -name '*.py'`）：

```text
server/app/
├── __init__.py
├── main.py                 # FastAPI 实例、lifespan（启动清理 + worker）、/health、router 与 MCP 挂载
├── mcp_server.py           # MCP 服务与 4 个工具、McpTokenAuthMiddleware
├── api/
│   ├── __init__.py
│   ├── deps.py             # PageNo/PageSize/SortOrder/OrSearch/RequireFullSecondaryWarehouse
│   └── v1/
│       ├── __init__.py     # 汇总 router，统一声明错误响应模型
│       ├── ai_search.py                 # /ai-search
│       ├── auth.py                      # /auth
│       ├── dictionaries.py              # （用户/字典类接口）
│       ├── excel_export_jobs.py         # /excel-export-jobs
│       ├── files.py                     # /files/images
│       ├── huaxing_inventory.py         # /huaxing-inventory
│       ├── inventory.py                 # （/inventory/*）
│       ├── material_code_library.py     # /material-code-library
│       ├── memos.py                     # /memos
│       ├── mini_program.py              # /mini-program-users、/mini-program
│       ├── purchase_materials.py        # /purchase-materials
│       ├── purchase_plan_templates.py   # /purchase-plan-templates
│       ├── purchase_record_sync.py      # （申购记录同步）
│       ├── purchase_requests.py         # （/purchase-records 等）
│       ├── secondary_warehouse.py       # /secondary-warehouse
│       ├── share.py                     # /shares
│       ├── stock_materials.py           # /stock-materials
│       ├── system_settings.py           # /system-settings
│       └── version.py                   # /version
├── core/
│   ├── __init__.py
│   ├── config.py           # Settings（env 前缀 APP_）
│   ├── constants.py        # SHANGHAI / DEFAULT_PAGE_SIZE / MAX_PAGE_SIZE / EXPORT_ROW_LIMIT / 默认值
│   ├── database.py         # Base、engine、SessionLocal、get_db
│   ├── db_timing.py        # SQL 条数与耗时采集（ContextVar）
│   ├── errors.py           # AppError、错误码→状态码映射、not_found/version_conflict/invalid_transition
│   ├── exception_handlers.py # 全局异常处理器与 error_response
│   ├── identifiers.py      # uuid7_string()
│   ├── logging.py          # 控制台 + 按月归档的按日轮转文件日志
│   ├── middleware.py       # request_context、RealIPMiddleware、RefererCORSMiddleware
│   ├── permissions.py      # 认证/角色/接口令牌/If-Match 依赖
│   ├── security.py         # JWT、argon2 口令、Fernet 加解密
│   └── wechat.py           # 多小程序 AppID/AppSecret 解析
├── domain/
│   ├── __init__.py
│   └── enums.py
├── models/
│   └── __init__.py
├── repositories/
│   ├── __init__.py
│   ├── dashboard_repository.py
│   ├── inventory_repository.py
│   ├── material_repository.py
│   ├── purchase_plan_template_repository.py
│   └── purchase_request_repository.py
├── schemas/
│   └── __init__.py
└── services/
    ├── __init__.py
    ├── ai_search_service.py
    ├── common.py                     # utcnow/分页/OR 搜索/乐观锁/审计/文件 read 等共用件
    ├── dashboard_service.py
    ├── dictionary_service.py
    ├── excel_export_job_service.py
    ├── excel_export_service.py
    ├── file_service.py
    ├── huaxing_inventory_service.py
    ├── import_file_reader.py
    ├── import_job_service.py
    ├── inventory_service.py
    ├── lite_inventory_service.py
    ├── material_code_library_service.py
    ├── material_service.py
    ├── memo_service.py
    ├── mini_program_service.py
    ├── purchase_plan_cleanup_service.py
    ├── purchase_plan_template_service.py
    ├── purchase_record_sync_service.py
    ├── purchase_request_service.py
    ├── replenishment_service.py
    ├── share_link_service.py
    └── webhook_service.py
```

按主题分组，点上方标签切换。

<Tabs :tabs="[
  { id: 't0', title: '认证与权限' },
  { id: 't1', title: '错误、性能头与约定' },
  { id: 't2', title: '数据库与事务' },
  { id: 't3', title: '分页、排序与日志' },
  { id: 't4', title: '配置项清单' },
  { id: 't5', title: '后台任务与运行' }
]">

<TabsContent id="t0">

### 认证与权限

#### 角色与依赖注入器（`server/app/core/permissions.py`、`server/app/domain/enums.py`）

| 名称 | 定义 | 说明 |
| --- | --- | --- |
| `Role` | `SUPER_ADMIN` / `WAREHOUSE_ADMIN` / `PURCHASE_ADMIN` / `READ_ONLY` | 四值 `StrEnum`，存 `user.role` |
| `require_roles(*roles)` | 工厂函数 | 角色不在集合内抛 `FORBIDDEN`（403） |
| `CurrentUser` | `depends(get_current_user)` | 管理端用户（Bearer JWT 或 `X-API-Token`） |
| `WarehouseWriter` | `require_roles(SUPER_ADMIN, WAREHOUSE_ADMIN)` | 库存写操作 |
| `PurchaseWriter` | `require_roles(SUPER_ADMIN, PURCHASE_ADMIN)` | 申购写操作 |
| `SuperAdmin` | `require_roles(SUPER_ADMIN)` | 系统配置、用户、文件治理 |
| `CurrentMiniProgramUser` | `depends(get_current_mini_program_user)` | 小程序用户；未审核（`enabled=False`）抛 `ACCOUNT_DISABLED`（403） |
| `MiniProgramRegistrationOpenId` | `depends(get_mini_program_registration_openid)` | 返回 `(app_id, openid)`，供注册/绑定用 |
| `DbSession` | `depends(get_db)` | 请求级 `AsyncSession` |
| `RequireFullSecondaryWarehouse` | `depends(_require_full_secondary_warehouse)` | 二级库精简模式下拦截写接口，抛 `SECONDARY_WAREHOUSE_LITE_MODE`（403） |
| `IfMatchVersion` | `depends(get_if_match_version)` | 从 `If-Match` 头读乐观锁版本 |

各接口模块实际使用的权限依赖（按源码中出现次数统计）：

| 模块 | 权限/身份依赖 | 路由数 |
| --- | --- | --- |
| `api/v1/auth.py` | `CurrentUser` | 3 |
| `api/v1/ai_search.py` | `SuperAdmin`、`CurrentUser` | 5 |
| `api/v1/system_settings.py` | `SuperAdmin` | 5 |
| `api/v1/dictionaries.py` | `SuperAdmin` | 5 |
| `api/v1/files.py` | `SuperAdmin` | 5 |
| `api/v1/inventory.py` | `CurrentUser`、`WarehouseWriter`、`RequireFullSecondaryWarehouse` | 12 |
| `api/v1/stock_materials.py` | `CurrentUser`、`WarehouseWriter`、`RequireFullSecondaryWarehouse`、`IfMatchVersion` | 8 |
| `api/v1/secondary_warehouse.py` | `CurrentUser`、`WarehouseWriter` | 4 |
| `api/v1/huaxing_inventory.py` | `CurrentUser`、`WarehouseWriter` | 5 |
| `api/v1/material_code_library.py` | `CurrentUser`、`PurchaseWriter` | 5 |
| `api/v1/memos.py` | `CurrentUser` | 4 |
| `api/v1/purchase_materials.py` | `CurrentUser`、`PurchaseWriter`、`IfMatchVersion` | 14 |
| `api/v1/purchase_plan_templates.py` | `CurrentUser`、`PurchaseWriter`、`IfMatchVersion` | 7 |
| `api/v1/purchase_requests.py` | `CurrentUser`、`PurchaseWriter`、`IfMatchVersion` | 7 |
| `api/v1/purchase_record_sync.py` | `PurchaseWriter` | 4 |
| `api/v1/share.py` | `CurrentUser` | 5 |
| `api/v1/excel_export_jobs.py` | `CurrentUser` | 2 |
| `api/v1/mini_program.py` | `CurrentMiniProgramUser`、`SuperAdmin`、`MiniProgramRegistrationOpenId`、`IfMatchVersion` | 25（管理端 4 + 小程序 21） |
| `api/v1/version.py` | 无（公开） | 1 |

#### 接口令牌（`X-API-Token`）与双列存储

- `APIKeyHeader(name="X-API-Token")`；`authenticate_management_user` 的取用顺序是：`X-API-Token` → Bearer 值（若长度 ≤ 36 先按接口令牌试）→ 按 JWT 解析。
- 令牌为 36 位；`find_user_by_api_token` 先用 `len(api_token) != 36` 快速排除，再按 `sha256` 命中 `user.api_token_hash`。
- **懒迁移回写**：命中且 `user.api_token_enc` 为空时，用该明文令牌 `encrypt_secret()` 回写密文再 `flush()`，使管理界面之后可解密回显（`user.api_token_hash` 认证 + `user.api_token_enc` 可逆回显双列）。
- MCP 入口 `McpTokenAuthMiddleware` 同样走 `find_user_by_api_token`，取令牌顺序为 `?token=` → `X-API-Token` → `Authorization: Bearer`，并 `commit()` 持久化懒迁移结果。

#### JWT `token_type` 取值（`server/app/core/security.py` 生成，`permissions.py`/`auth.py` 校验）

| `token_type` | 生成函数 | 有效期 | 校验点 |
| --- | --- | --- | --- |
| `management_access` | `create_access_token` | `APP_ACCESS_TOKEN_MINUTES`（默认 30 分钟） | `authenticate_management_user`，同时兼容历史值 `management` 与缺失 |
| `management_refresh` | `create_refresh_token` | `APP_REFRESH_TOKEN_DAYS`（默认 7 天），带 `version` 声明 | `api/v1/auth.py` 续期接口 |
| `mini_program` | `create_mini_program_access_token` | `APP_ACCESS_TOKEN_MINUTES` | `get_current_mini_program_user` |
| `mini_program_registration` | `create_mini_program_registration_token` | 固定 10 分钟，带 `app_id` 声明 | `get_mini_program_registration_openid` |

即管理端凭据、小程序正式凭据、小程序注册临时凭据三类互不通用；注册令牌只能用于绑定/注册接口（`token_type` 不匹配即 `INVALID_TOKEN`）。

#### 乐观锁版本（`If-Match`）

约定见 `permissions.get_if_match_version` docstring：所有带乐观锁的写操作（PATCH/PUT/DELETE/restore）版本号放 `If-Match` 头，
而非 query 参数，**避免版本号进入访问日志**。缺失或非整数时返回 `None` 由 service 决定是否强制（`common.validate_version` → `VERSION_CONFLICT`，`details` 带 `expected`/`actual`）。

</TabsContent>

<TabsContent id="t1">

### 错误处理与响应头

#### 错误码 → 默认 HTTP 状态码（`server/app/core/errors.py`）

`AppError(code, message, status_code=None, details=None)`：显式传 `status_code` 时以显式值为准，否则查下表；表中没有的 code 兜底为 `400`。

| code | 默认 HTTP |
| --- | --- |
| `NOT_FOUND` | 400 |
| `VERSION_CONFLICT` | 409 |
| `INVALID_STATUS_TRANSITION` | 409 |
| `DATA_CONFLICT` | 409 |
| `INVALID_TOKEN` | 401 |
| `UNAUTHORIZED` | 401 |
| `USER_DISABLED` | 401 |
| `ACCOUNT_DISABLED` | 403 |
| `FORBIDDEN` | 403 |
| `VALIDATION_ERROR` | 422 |

错误响应体统一为 `{code, message, details, request_id}`（`exception_handlers.error_response`），`request_id` 取 `request.state.request_id`。
全量业务错误码清单见 [错误码总表](/api-error-codes)，约定背景见 [API 错误约定](/api-error-conventions)。

#### 全局异常处理器（`register_exception_handlers`）

| 注册的异常类型 | handler | 返回 code / status |
| --- | --- | --- |
| `AppError` | `handle_app_error` | 用异常自身的 `code` 与 `status_code`；`details` 原样透出 |
| `StarletteHTTPException` | `handle_http_exception` | 原状态码为 404 时重映射为 `400 ROUTE_NOT_FOUND`；其余原状态码 + `HTTP_ERROR` |
| `RequestValidationError` | `handle_validation_error` | `422 VALIDATION_ERROR`，`details.errors` 为 pydantic 错误列表 |
| `IntegrityError` | `handle_integrity_error` | `409 DATA_CONFLICT`（`logger.warning` + 堆栈） |
| `ProgrammingError` | `handle_database_programming_error` | `500 DATABASE_QUERY_ERROR` |
| `OperationalError` / `InterfaceError` / `DisconnectionError` / `SQLAlchemyTimeoutError` | `handle_database_unavailable` | 若 `exc.orig.args[0]` 落在 MySQL 查询错误码集合（1052/1054/1064/1066/1109/1146）→ `500 DATABASE_QUERY_ERROR`，否则 `503 DATABASE_UNAVAILABLE` |
| `SQLAlchemyError` | `handle_database_error` | `500 DATABASE_ERROR` |
| `Exception` | `handle_unexpected_error` | `500 INTERNAL_SERVER_ERROR`（`logger.exception`） |

#### 「禁止 HTTP 404」

- 资源不存在：service 用 `errors.not_found(resource)` → `400 NOT_FOUND`（message 为「<资源>不存在」），前端按业务码区分。
- 未匹配路由：框架级 404 由 `handle_http_exception` 改为 `400 ROUTE_NOT_FOUND`，message「接口路径不存在」。
- 因此后端对外不会产生 404 状态码；文件类接口同样遵循该约定。

#### 中间件与性能响应头（`server/app/core/middleware.py`）

`request_context` 为每个请求注入 `request_id`（取 `X-Request-ID`，截断到 128 字符，否则 `uuid4`）并写访问日志，响应头均只计量服务端时间：

| 响应头 | 含义与计量方式 |
| --- | --- |
| `X-Request-ID` | 本次请求标识，与日志 `request_id` 一致 |
| `X-Response-Time` | 服务端处理总耗时（毫秒），`time.perf_counter()` 从进入中间件到生成响应 |
| `X-DB-Time` | 其中数据库语句执行耗时合计（毫秒），取 `min(采集值, 总耗时)` |
| `X-Compute-Time` | `总耗时 - DB 耗时`（毫秒），含校验/权限/序列化 |
| `X-DB-Queries` | 本次请求执行的 SQL 条数，用于识别 N+1 |

这 5 个头（加 `Content-Disposition`）都在 `RefererCORSMiddleware._expose_headers` 中，跨域时通过 `Access-Control-Expose-Headers` 暴露。

- `RealIPMiddleware`：把 `scope["client"]` 改写为可信边缘代理给出的真实 IP，取值优先级 `EO-Connecting-IP` → `X-Real-IP` → `X-Forwarded-For` 的第一段；候选值需能被 `ipaddress.ip_address()` 解析，全部无效则不改写。
- `RefererCORSMiddleware`：**Referer 优先**（兼容不发 `Origin` 的内嵌 WebView/微信），无效或缺失时回退 `Origin`；`Referer: null` 原样返回 `null`。白名单规则：白名单为空表示不限制；否则需 `origin` 精确命中、或 `*`、或 `allowed` 以 `.` 开头时按 host 后缀匹配（`.example.com` 匹配 `app.example.com`）。未命中白名单时不回显 CORS 头（浏览器自行拦截）。预检（`OPTIONS` + `Access-Control-Request-Method`）直接返回 200，方法白名单 `DELETE, GET, HEAD, OPTIONS, PATCH, POST, PUT`，回显请求的 `Access-Control-Request-Headers`，`Access-Control-Request-Private-Network: true` 时回私有网络头；正常响应补 `Vary: Origin, Referer`。
- 注册顺序（`main.py`，代码注释：后注册的中间件更外层）：`RefererCORSMiddleware` → `request_context` → `RealIPMiddleware`。即最外层是 `RealIPMiddleware`，最内层是 CORS，`request_context` 位于 RealIP 内层以便读到改写后的真实 IP。

</TabsContent>

<TabsContent id="t2">

### 数据库会话与事务

| 项 | 真实配置（`server/app/core/database.py`） |
| --- | --- |
| engine | `create_async_engine(settings.database_url, pool_pre_ping=True)`；`database_url` 以 `sqlite+aiosqlite:///:memory:` 开头时改用 `StaticPool` |
| 连接池 | 未显式设置 `pool_size`/`max_overflow`/`pool_recycle`/`connect_args`，使用 SQLAlchemy 默认 |
| 会话工厂 | `async_sessionmaker(engine, expire_on_commit=False, autoflush=False)` |
| `Base` | `AsyncAttrs + DeclarativeBase`，`MetaData` 带命名约定（`ix_/uq_/ck_/fk_/pk_`） |
| SQL 计时 | 创建引擎后立即 `register_database_timing(engine)` |

`get_db` 依赖：`yield` 会话 → 正常路径 `await session.commit()` → 异常路径 `await session.rollback()` 并重新抛出。
因此路由内的 service 调用默认由依赖收尾提交；需要「先落库再返回/再抛错」的 service 会自行提交：

- 显式提交示例：`file_service` 上传（注释：上传是独立事务，只有数据库记录真正提交后才返回成功；失败回滚并删除已写磁盘文件）、`excel_export_job_service._run_job`、`webhook_service`、`import_job_service.enqueue_import`、`share_link_service.cleanup_expired`。
- 后台任务（worker、导入/导出子任务）**不使用 `get_db`**，而是 `async with SessionLocal() as session:` 自建会话并自行 `commit()`。
- 并发控制：锁定查询在仓储层构造 `with_for_update()`（如 `inventory_repository` 的余额/流水查询，`inventory_service` 在写路径内调用）；申购计划清理用 `with_for_update(skip_locked=True)` 逐个批次抢锁。
- 未使用 `async with session.begin()` 事务块（`grep "session.begin"` 仅命中 `material_service` 的 `session.begin_nested()` 保存点用法）。

#### DB 计时实现（`server/app/core/db_timing.py`）

`DatabaseTiming(total_ms, statement_count)` 通过 `contextvars.ContextVar` 传递；`request_context` 在请求开始 `begin_database_timing()`、响应前 `finish_database_timing()`。
SQLAlchemy 的 `before_cursor_execute` / `after_cursor_execute` 事件分别入栈/出栈 `time.perf_counter()`，出栈时累加耗时并 `statement_count += 1`。
只有存在请求上下文的 SQL 才被统计：启动清理与常驻 worker 的 SQL 不计入任何请求；并发请求互不干扰；请求内派生的后台任务会继承采集器（窗口极短）。

</TabsContent>

<TabsContent id="t3">

### 分页与排序约定

- 列表响应统一为 `Page[T]`（`server/app/schemas/__init__.py`）：`items` / `page` / `page_size` / `total`。
- 分页参数经 `server/app/api/deps.py` 注入：`PageNo = Query(ge=1)`、`PageSize = Query(ge=1, le=200)`；路由默认值为 `page=1`、`page_size=20`。
- `server/app/core/constants.py` 定义 `DEFAULT_PAGE_SIZE = 20`、`MAX_PAGE_SIZE = 200`，但 `deps.py` 是直接写死 `le=200`，**这两个常量当前未被引用**。
- 服务层通用实现 `services/common.paginate()`：先 `select(func.count()).select_from(query.order_by(None).subquery())` 取 `total`，再 `offset((page-1)*page_size).limit(page_size)` 并 `unique()` 去重；`common.page_result()` 组装 `Page`。
- 导出路径用 `EXPORT_ROW_LIMIT = 10_000`：导出发起前以 `page_size=EXPORT_ROW_LIMIT + 1` 试探，超限抛 `VALIDATION_ERROR`（`details` 带 `total`/`limit`）。
- 排序参数写法为 `sort_by` + `sort_order`：`sort_order` 用 `deps.SortOrder`（`Literal["asc", "desc"]`，默认 `"asc"`）；`sort_by` 类型随接口不同——申购计划/申购记录用 `Literal` 列名（`PurchasePlanResultColumn` 15 值、`PurchaseRecordResultColumn` 23 值），周期性计划用 `str | None`。
- 排序列白名单在仓储层：`PURCHASE_MATERIAL_SORT_COLUMNS`、`PURCHASE_PLAN_TEMPLATE_SORT_COLUMNS`、`PURCHASE_RECORD_SORT_COLUMNS`，注释写明「防止任意属性注入」；`sort_by` 不在白名单时回退默认排序，固定次级排序键为 `id desc`（如 `purchase_plan_template_repository.search_templates`）。
- 关键词 OR 搜索：`OrSearch`/`OrSearch128`/`OrSearch255` 用 `|` 或 `｜` 分隔，`common.contains_any` 生成 `OR ... contains(..., autoescape=True)`。

### 日志与 request_id

- 初始化在 `lifespan` 中：`configure_logging(settings.log_dir, settings.log_backup_count)`（`server/app/core/logging.py`）。
- 文件：`<log_dir>/spare-parts-api.log`（默认 `server/data/logs/`），UTF-8，`when="midnight", interval=1, utc=False`，`suffix="%Y-%m-%d"`。
- 归档：自定义 `MonthlyTimedRotatingFileHandler` 把每天轮转出的文件放进 `YYYY-MM` 子目录，删除时跨目录按日期排序，`backupCount`（默认 90）控制保留份数。
- 控制台：`StreamHandler(sys.stdout)`，未设置 `NO_COLOR` 时使用 ANSI 彩色格式；且控制台 handler 挂了 `IgnoreHealthCheckFilter`（消息含 `/health` 则不输出），文件 handler 未过滤。
- root logger 级别 INFO 并清空既有 handler；`uvicorn`/`uvicorn.error` 清空自身 handler 改为向 root 传播，`uvicorn.access` 与 `httpx` 提到 WARNING，`logging.captureWarnings(True)`。
- 统一日志 logger 名为 `spare_parts.api`（`main.py` 与各 core 模块）。
- 访问日志一行字段：`method`、`path`、`status`、`elapsed ms`、`db=<ms>/<query 数>`、`compute=<ms>`、`client_ip`、`user`（`request.state.username`，未认证为 `anonymous`；小程序为 `mini:<id>`）、`request_id`。
- 不记录的敏感信息：访问日志不打印请求体、查询参数与请求头（`Authorization`/`X-API-Token` 均不出现在日志字段中）；乐观锁版本号刻意放 `If-Match` 头而非 query，正是「避免版本号进入访问日志」。代码中没有统一的字段级脱敏黑名单（`grep` 未命中「脱敏/sensitive」实现）。

</TabsContent>

<TabsContent id="t4">

### 配置项清单

`server/app/core/config.py` 的 `Settings`：`SettingsConfigDict(env_file=BACKEND_DIR/".env", env_prefix="APP_", extra="ignore")`，
即环境文件为 `server/.env`、环境变量前缀 `APP_`（字段名大写，如 `database_url` → `APP_DATABASE_URL`）。
`settings = get_settings()` 是 `@lru_cache` 单例，导入时构造一次。代码层**没有必填字段**（全部有默认值或校验下限）。

| 字段 | 环境变量 | 类型 | 默认值 | 校验/说明 |
| --- | --- | --- | --- | --- |
| `app_name` | `APP_APP_NAME` | `str` | `电气车间备件管理系统` | FastAPI `title` |
| `environment` | `APP_ENVIRONMENT` | `str` | `development` | 启动日志打印；compose 设 `production` |
| `database_url` | `APP_DATABASE_URL` | `str` | `mysql+asyncmy://spare:spare@mysql:3306/spare_parts?charset=utf8mb4` | 引擎 DSN |
| `jwt_secret` | `APP_JWT_SECRET` | `str` | `change-me-in-production` | `min_length=16`，生产必须替换 |
| `jwt_algorithm` | `APP_JWT_ALGORITHM` | `str` | `HS256` | JWT 签名算法 |
| `access_token_minutes` | `APP_ACCESS_TOKEN_MINUTES` | `int` | `30` | `ge=1`；管理端与小程序访问令牌有效期 |
| `refresh_token_days` | `APP_REFRESH_TOKEN_DAYS` | `int` | `7` | `ge=1` |
| `fernet_key` | `APP_FERNET_KEY` | `str` | `""` | 为空时由 `jwt_secret` 派生（见 `security.fernet`），影响接口令牌/API Key 等密文可解密性 |
| `wechat_mini_program_app_id` | `APP_WECHAT_MINI_PROGRAM_APP_ID` | `str` | `""` | 多个 AppID 逗号分隔，顺序须与 secret 一致（`core/wechat.py` 校验数量与唯一性，否则 503） |
| `wechat_mini_program_app_secret` | `APP_WECHAT_MINI_PROGRAM_APP_SECRET` | `str` | `""` | 同上，仅后端保存 |
| `upload_dir` | `APP_UPLOAD_DIR` | `Path` | `<server>/data/uploads` | 启动时 `mkdir(parents=True, exist_ok=True)`；图片与导出文件根目录 |
| `template_dir` | `APP_TEMPLATE_DIR` | `Path` | `<server>/app/templates` | Excel 导出模板目录（`excel_export_service` 读取） |
| `log_dir` | `APP_LOG_DIR` | `Path` | `<server>/data/logs` | 日志目录 |
| `log_backup_count` | `APP_LOG_BACKUP_COUNT` | `int` | `90` | `ge=1`，保留的历史日志文件数 |
| `max_image_bytes` | `APP_MAX_IMAGE_BYTES` | `int` | `10 * 1024 * 1024` | 图片上传上限，比较前多读 1 字节 |
| `cors_origins` | `APP_CORS_ORIGINS` | `list[str]` | `[]` | `Annotated[..., NoDecode]` + `field_validator(mode="before")` 手工按逗号切分；空表示不限制 |
| `cors_allow_credentials` | `APP_CORS_ALLOW_CREDENTIALS` | `bool` | `True` | 是否回 `Access-Control-Allow-Credentials` |
| `cors_max_age` | `APP_CORS_MAX_AGE` | `int` | `86400` | `ge=0`，预检缓存秒数 |
| `purchase_plan_cleanup_enabled` | `APP_PURCHASE_PLAN_CLEANUP_ENABLED` | `bool` | `True` | 关闭后不启动申购计划清理 worker |
| `build_time` | `APP_BUILD_TIME` | `str \| None` | `None` | 构建期注入（Docker ARG/ENV），`/version` 返回 |
| `git_sha` | `APP_GIT_SHA` | `str \| None` | `None` | 同上 |

注意：`cors_origins` 因使用 `NoDecode`，环境变量值必须是逗号分隔字符串（如 `https://a.example.com,.example.com`），不能写成 JSON 数组。

#### 部署方需要配置的变量

`docs/env/backend.env.example` 当前列出的模板项（`docs/env/frontend.env.example` 对应前端）：

| 模板中的变量 | 示例/说明 |
| --- | --- |
| `APP_ENVIRONMENT` | `development` |
| `APP_DATABASE_URL` | `mysql+asyncmy://user:pass@host:3306/spare_parts?charset=utf8mb4` |
| `APP_JWT_SECRET` | `replace-with-at-least-32-random-characters` |
| `APP_ACCESS_TOKEN_MINUTES` / `APP_REFRESH_TOKEN_DAYS` | `30` / `7` |
| `APP_CORS_ALLOW_CREDENTIALS` / `APP_CORS_MAX_AGE` | `true` / `86400` |
| `APP_WECHAT_MINI_PROGRAM_APP_ID` / `APP_WECHAT_MINI_PROGRAM_APP_SECRET` | 多个小程序按相同顺序逗号分隔 |
| `APP_LOG_DIR` / `APP_LOG_BACKUP_COUNT` | `./data/logs` / `90` |

模板未列出但代码支持的变量：`APP_FERNET_KEY`、`APP_CORS_ORIGINS`、`APP_UPLOAD_DIR`、`APP_TEMPLATE_DIR`、`APP_MAX_IMAGE_BYTES`、`APP_PURCHASE_PLAN_CLEANUP_ENABLED`、`APP_APP_NAME`、`APP_JWT_ALGORITHM`、`APP_BUILD_TIME`、`APP_GIT_SHA`。

容器部署（`docker-compose.yml`）实际注入：`APP_ENVIRONMENT=production`、`APP_DATABASE_URL`（必填，指向外部 MySQL）、`APP_JWT_SECRET`（必填）、`APP_ACCESS_TOKEN_MINUTES`（默认 `480`）、`APP_WECHAT_MINI_PROGRAM_APP_ID`/`APP_WECHAT_MINI_PROGRAM_APP_SECRET`（默认空）、`APP_UPLOAD_DIR=/app/data/uploads`、`APP_LOG_DIR=/app/data/logs`；主机侧 `BACKEND_PORT` 默认 `8000`、`FRONTEND_PORT` 默认 `8080`。

</TabsContent>

<TabsContent id="t5">

### 后台定时任务

#### lifespan 启动时的一次性清理（`server/app/main.py` → `lifespan`）

| 调用 | 作用 | 保留/阈值（真实默认值） |
| --- | --- | --- |
| `settings.upload_dir.mkdir(...)`、`configure_logging(...)` | 准备目录与日志 | — |
| `import_job_service.mark_stale_jobs_failed()` | 重启前遗留的 `PENDING`/`RUNNING` 导入任务标记失败并删除临时文件 | — |
| `import_job_service.cleanup_finished_jobs()` | 删除已终态（`SUCCEEDED`/`FAILED`）导入任务行 | `retention_days=30` |
| `excel_export_job_service.mark_stale_exports_failed()` | 同上，针对导出任务 | — |
| `excel_export_job_service.cleanup_finished_exports()` | 删除已终态导出任务行及其文件 | `EXPORT_RETENTION_DAYS=3` |
| `share_link_service.cleanup_expired()` | 删除已过期分享链接行 | 以 `expires_at < now` 判定 |

每次清理命中的条数会打印 `logger.info`（如 `purged N expired share links`）。
导入任务的终态清理**只在启动时执行一次**，代码中未定义周期性导入清理 worker。

#### 常驻 worker（`asyncio.create_task`，name 即任务名）

| task name | 实现 | 触发/周期 | 关键参数 |
| --- | --- | --- | --- |
| `webhook-delivery-worker` | `webhook_service.run_delivery_worker(stop_event)` | 循环投递待发送 webhook，无可投递时 `asyncio.wait_for(stop_event.wait(), timeout=2.0)` 轮询 | `_POLL_INTERVAL_SECONDS=2.0`；`_MAX_ATTEMPTS=5`；退避 `_RETRY_MINUTES=(1,5,15,60,180)`；`_SENDING_LEASE_MINUTES=5`；HTTP 超时 8s/连接 3s |
| `purchase-plan-cleanup-worker` | `purchase_plan_cleanup_service.run_cleanup_worker(stop_event)` | 睡到下一个北京时间 02:00（`_CLEANUP_HOUR=2`，`SHANGHAI` 时区）后循环清理直到无候选 | 仅当 `settings.purchase_plan_cleanup_enabled` 为真时创建；批次 `_BATCH_SIZE=50`；先解绑 `purchase_request_line.purchase_material_id` 再物理删除计划；`with_for_update(skip_locked=True)` |
| `excel-export-cleanup-worker` | `excel_export_job_service.run_cleanup_worker(stop_event)` | 启动后立即清理一次，随后每 24 小时一次 | 终态任务保留 3 天；顺带清理 `upload_dir/exports` 下超过 24 小时的 `.tmp` 孤儿文件 |
| `share-link-cleanup-worker` | `share_link_service.run_cleanup_worker(stop_event)` | 启动后立即清理一次，随后每 24 小时一次 | 删除 `expires_at < utcnow()` 的行 |

worker 均在退出时由 `finally` 置 `stop_event` 并 `await`，随后关闭 `httpx` 客户端（`webhook_service.close_client()`、`ai_search_service.close_client()`）；
`lifespan` 全程包在 `async with mcp.session_manager.run():` 内。
另有两类请求内派生任务：`import_job_service.enqueue_import` 与 `excel_export_job_service` 发起
`asyncio.create_task(_run_job(...), name=f"import-job-{id}"/f"export-job-{id}")`，引用保存在模块级 `_running_tasks` 集合防止被 GC（单进程有效）。

### 其它

#### MCP 服务（`server/app/mcp_server.py`）

- `MCPServer("spare-parts-management", title="备件管理系统")`，挂载 `app.mount("/api/v1/mcp", mcp_http_app, name="mcp")`，传输为 Streamable HTTP（`streamable_http_path="/"`、`stateless_http=True`、`json_response=True`、`max_request_body_size=16MB`），并显式关闭 DNS rebinding 保护以适配反向代理的 Host 头。
- 暴露 4 个工具：`system_whoami`（返回令牌对应用户与角色）、`operations_list`（按标签/关键字列出操作）、`operation_describe`（返回某操作的参数与响应契约）、`operation_call`（以 `X-API-Token` 调用业务接口；文件用 `file.content_base64` 上传，二进制响应超过 25 MB 报错）。
- 操作目录来自应用自身的 `app.openapi()` 路径，按 `operationId` 索引；排除 `/api/v1/auth/login`、`/api/v1/auth/refresh` 以及前缀 `/api/v1/agent/database`、`/api/v1/mini-program/`（即小程序专用接口与非管理端入口不暴露）。
- `operation_call` 通过 `httpx.ASGITransport` 直接在本进程内回环调用，因此仍完整经过参数校验、角色权限、乐观锁与事务；超时 60 秒。
- 认证：`McpTokenAuthMiddleware` 取 `?token=`、`X-API-Token` 或 `Authorization: Bearer`，命中用户后把身份放进 `ContextVar`，失败返回 `401` + `{"code":"INVALID_TOKEN", ...}`。

#### 健康检查与接口文档

- `GET /health`（`include_in_schema=False`）：执行 `SELECT 1`，成功返回 `{"status":"ok","database":"ok"}`；失败记录 warning 并返回 `503 DATABASE_UNAVAILABLE`。响应体会被 `IgnoreHealthCheckFilter` 从控制台日志中略过。
- Swagger UI 在 `/api/docs`，OpenAPI JSON 在 `/api/v1/openapi.json`（`FastAPI(openapi_url=..., docs_url=...)`）；版本号硬编码为 `1.0.0`。
- 契约文件 `docs/openapi.yaml` 由 `server/scripts/export_openapi.py` 从运行中的应用导出（可用 `?`示例补充见同目录 `openapi_examples.py`），前端类型由它生成。
- 所有路由的 `responses` 在 `api/v1/__init__.py` 统一声明 `400/401/403/409/422` 使用 `ApiError` 模型。

#### Docker 与部署

| 项 | 内容（`server/Dockerfile`、`docker-compose.yml`） |
| --- | --- |
| 基础镜像 | `python:3.12-slim`，`WORKDIR /app` |
| 构建参数 | `ARG BUILD_TIME` / `ARG GIT_SHA` → `ENV APP_BUILD_TIME` / `APP_GIT_SHA` |
| 安装 | `COPY pyproject.toml` + `COPY app ./app` → `pip install --no-cache-dir .`（构建上下文是 `server/` 自身） |
| 目录 | 构建时 `mkdir -p /app/data/uploads /app/data/logs` |
| 端口/启动 | `EXPOSE 8000`；`CMD ["uvicorn","app.main:app","--host","0.0.0.0","--port","8000"]` |
| compose 后端 | 镜像 `ghcr.io/sakana-1314/electrical-manager:server`，端口 `${BACKEND_PORT:-8000}:8000`，卷 `uploads:/app/data/uploads`、`logs:/app/data/logs`，健康检查轮询 `/health`（15s 间隔，30s 起始宽限） |
| compose 前端 | 镜像 `ghcr.io/sakana-1314/electrical-manager:web`，端口 `${FRONTEND_PORT:-8080}:80`，`depends_on: backend: service_healthy` |
| 网络 | 外部网络 `1panel-network` |

依赖与工具链见 `server/pyproject.toml`：运行期依赖 FastAPI、SQLAlchemy[asyncio]、asyncmy、pyjwt、argon2-cffi、cryptography、httpx、mcp、openpyxl、xlrd、pillow、pydantic-settings、uvicorn；开发依赖含 aiosqlite、pytest、pytest-asyncio、mypy(strict)、ruff、pyyaml。Python 版本要求 `>=3.12,<3.15`。

</TabsContent>

</Tabs>
