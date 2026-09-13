# HXNI 电气无忧

电气车间业务管理系统。以二级库库存与申购协同起步，逐步扩展到电气车间其他业务，不涉及物资价格和成本核算。

## 功能

| 功能 | 说明 |
| --- | --- |
| 库存管理 | 二级库物资与库存余额、入出库流水；流水可修正、冲销并自动重算后续余额，保留完整业务轨迹。 |
| 申购计划 | 可暂缺物料编码，到货时关联或新建二级库物资；支持周期性计划模板一键生成。 |
| 请购与到货 | 请购单状态机（草稿 → 提交 → 受理 → 完成 / 退回），从未到货行直接发起入库。 |
| 补库与低库存 | 按近 6 个月出库实时计算建议数量，低库存工作台一键发起补库。 |
| 采购跟踪 | 按申购单号整单同步外部平台数据（采购人、合同号、合同签订日期、船名、状态），只补空值、只进不退。 |
| 精简库存 | 二级库精简/完整模式开关，精简库存独立表、小程序只读、后台单页导入查询。 |
| 图片附件 | 图片上传与缩略图预览按 `file_id` 读取，支持 CDN/图床加速，含悬空文件清理接口。 |
| Excel 导入导出 | 布局模板随代码版本管理，导入导出走异步任务并提供进度查询。 |
| 链接分享 | 生成带失效时间的匿名分享页，可配置公开页展示列。 |
| 管理后台用户 | 四种角色、微信身份按 AppID 记录并支持人工合并，用户接口令牌加密入库并每次回显。 |
| AI 搜索与 MCP | AI 搜索配置（API Key 加密入库）与 MCP 工具，可让 AI Agent 按角色权限调用业务接口。 |
| 备忘录 | 后台多标签纯文本备忘录，字号可调并记录在浏览器本地。 |

## 组成

| 部分 | 技术 | 目录 |
| --- | --- | --- |
| 服务端 | FastAPI + SQLAlchemy 2.x async + MySQL 8.0 | `server/` |
| 网页端 | Vue 3 + TypeScript + Vite + Naive UI + Pinia | `web/` |
| 小程序 | 微信小程序（扫码出库） | `miniprogram/` |
| 项目站点 | VitePress，由 CI 发布到 `gh-pages` | `docs/websites/` |

## 文档

站点：<https://sakana-1314.github.io/Electrical-Manager/>

- [使用与部署指南](https://sakana-1314.github.io/Electrical-Manager/guide)：Compose 部署、环境变量、本地开发与数据库初始化。
- [开发方案](https://sakana-1314.github.io/Electrical-Manager/development-plan)：数据模型与接口设计。
- [API 错误与状态码约定](https://sakana-1314.github.io/Electrical-Manager/api-error-conventions)、[UI 设计规范](https://sakana-1314.github.io/Electrical-Manager/ui-design-guidelines)、[人工功能测试方案](https://sakana-1314.github.io/Electrical-Manager/manual-functional-test-plan)。
- 接口契约：[docs/openapi.yaml](docs/openapi.yaml)；数据库结构与种子数据：[docs/references/database/init.sql](docs/references/database/init.sql)。

开发与提交约定见 [AGENTS.md](AGENTS.md)。
