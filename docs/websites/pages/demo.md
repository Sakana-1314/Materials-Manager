# 在线演示

下面的窗口就是本系统的网页端，直接嵌在本页里，可以随便点。
**它连的是前端自带的契约模拟（MSW），数据是固定的真实感数据、断网也能用，不会写任何真实数据。**

> 演示地址：<https://sakana-1314.github.io/Electrical-Manager/demo/offline/>
> （与本站同域：站点在 `/Electrical-Manager/`，演示挂在它的 `/demo/` 子路径下）

<iframe
  src="/Electrical-Manager/demo/offline/"
  title="HXNI 电气无忧 在线演示"
  width="100%"
  height="820"
  style="border:1px solid var(--vp-c-divider);border-radius:12px;background:#fff"
  loading="lazy"
  referrerpolicy="no-referrer"
></iframe>

<p style="text-align:right;margin-top:8px">
  <a href="/Electrical-Manager/demo/offline/" target="_blank" rel="noopener">在新窗口打开 ↗</a>
</p>

## 演示里能做什么

| 可以做 | 说明 |
| --- | --- |
| 登录 | 四个初始账号 `admin` / `warehouse` / `purchase` / `readonly`，密码均为 `123456` |
| 浏览各模块 | 工作台、二级库物资、库存余额与流水、申购计划、申购记录、物料编码库、华星库存、周期性计划、精简库存、备忘录 |
| 真实交互 | 新增 / 编辑 / 删除、入出库、冲销流水、筛选分页排序都能操作；数据在浏览器内维护，刷新后回到初始状态 |
| 权限差异 | 换不同账号登录，可见菜单与按钮不同（写操作按角色隐藏） |

数据来自 `web/src/mocks/`（与 `docs/openapi.yaml` 契约对齐的 83 个接口），不依赖任何外部服务。

## 两份演示：为什么有两个

同一份网页端代码，用不同构建参数产出两份产物，分别演示不同的东西：

| 演示 | 地址 | 后端 | 用途 |
| --- | --- | --- | --- |
| 离线演示（本页嵌的这个） | `/demo/offline/` | 前端 MSW 契约模拟 | 数据真实感强、稳定可复现，适合看功能与交互 |
| Mock 演示 | `/demo/` | [Apifox Mock 服务](/api) | 走真实 HTTP（跨域到 Apifox），适合验证契约与联调链路 |

> Mock 演示的数据由 Apifox「智能 Mock」按字段类型随机生成，会看到随机中文姓名之类无意义数据，
> 且每次请求都不同 —— 这是 Apifox Mock 的特性，不是系统缺陷。要看像样的数据请用本页的离线演示。

## 这是怎么发布出来的

| 产物 | 构建 | base | 后端 | 部署位置 |
| --- | --- | --- | --- | --- |
| 业务网页端 | `npm run build` | `/` | 真实后端 | 你自己的服务器 / 镜像 |
| 离线演示 | `vite build --mode demo-offline` | `/Electrical-Manager/demo/offline/` | MSW | 本站 `/demo/offline/` |
| Mock 演示 | `vite build --mode demo` | `/Electrical-Manager/demo/` | Apifox Mock | 本站 `/demo/` |

- 子路径由 `web/vite.config.ts` 的 `VITE_BASE_PATH` 控制，路由与静态资源都挂在该前缀下；
  **默认仍是 `/`，业务部署行为完全不变**。
- 各构建模式的参数在 `web/.env.demo`、`web/.env.demo-offline`。
- 发布由 `.github/workflows/website.yml` 完成：站点构建完后依次构建两份演示，分别复制到站点输出的
  `demo/offline/` 与 `demo/`，一起发到 `gh-pages`，因此与站点同域、可直接 iframe 引用。

## 已知限制

演示是单页应用（history 路由）：**直接刷新深层路由**（如 `/demo/offline/warehouse/stock`）在
GitHub Pages 上会 404（静态托管没有 SPA fallback）。从演示入口 `/demo/offline/` 进入后在页面内跳转
不受影响；换页后刷新同样会 404，需要回到入口重新进入。
