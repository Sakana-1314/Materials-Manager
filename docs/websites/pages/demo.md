# 在线演示

下面的窗口就是本系统的网页端，可以随便点。后端为前端自带的契约模拟（MSW），数据固定、
断网可用、不写任何真实数据。

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

数据来自 `web/src/mocks/`（与契约对齐的 83 个接口），不依赖外部服务。

## 两份演示

| 演示 | 地址 | 后端 | 适合 |
| --- | --- | --- | --- |
| 离线演示（本页嵌的） | `/demo/offline/` | 前端 MSW，固定数据 | 看功能与交互 |
| Mock 演示 | `/demo/` | [Apifox Mock](/api) | 验证契约与联调链路（数据为随机生成） |

## 构建与发布

| 产物 | 构建命令 | base | 部署位置 |
| --- | --- | --- | --- |
| 业务网页端 | `npm run build` | `/` | 自己的服务器 / 镜像 |
| 离线演示 | `vite build --mode demo-offline` | `/Electrical-Manager/demo/offline/` | 本站 `/demo/offline/` |
| Mock 演示 | `vite build --mode demo` | `/Electrical-Manager/demo/` | 本站 `/demo/` |

各模式的参数见 `web/.env.demo`、`web/.env.demo-offline`；发布由 `.github/workflows/website.yml`
在站点构建后依次构建并复制到站点输出的 `demo/` 下，与站点同域，可直接 iframe 引用。

## 深链刷新

演示使用 history 路由，静态托管本身没有 SPA fallback。这里加了一层回退，**深层路由可以直接刷新**：

| 步骤 | 行为 |
| --- | --- |
| 1 | 刷新 `/demo/offline/warehouse/stock` 时静态托管找不到文件，落到站点 404 页 |
| 2 | 站点 404 页认出这是演示路径，带原路径跳回演示入口（`?path=…`） |
| 3 | 演示入口自带的引导脚本在路由挂载前还原真实路径，页面正常渲染 |

只影响演示产物与站点 404 页：业务构建不带该标记，行为不变；路由配置未改，正常访问时 URL 也不变。
