# 在线演示

下面的窗口就是本系统的网页端，直接嵌在本页里；它连的是 **Apifox Mock 服务**，不会写任何真实数据，
可以随便点。

> 演示地址：<https://sakana-1314.github.io/Electrical-Manager/demo/>
> （和本站同域但互不影响：站点在 `/Electrical-Manager/`，演示挂在 `/Electrical-Manager/demo/`）

<iframe
  src="/Electrical-Manager/demo/"
  title="HXNI 电气无忧 在线演示"
  width="100%"
  height="820"
  style="border:1px solid var(--vp-c-divider);border-radius:12px;background:#fff"
  loading="lazy"
  referrerpolicy="no-referrer"
></iframe>

<p style="text-align:right;margin-top:8px">
  <a href="/Electrical-Manager/demo/" target="_blank" rel="noopener">在新窗口打开演示 ↗</a>
</p>

## 演示里能做什么

| 可以做 | 说明 |
| --- | --- |
| 登录 | 演示用 Mock 后端，四个初始账号 `admin` / `warehouse` / `purchase` / `readonly` 密码均为 `123456`；Mock 通常不校验密码 |
| 浏览各模块 | 工作台、二级库物资、库存余额与流水、申购计划、申购记录、物料编码库、华星库存、周期性计划、精简库存、备忘录 |
| 权限差异 | 换不同账号登录，可见菜单与按钮不同（写操作按角色隐藏） |
| 表格与筛选 | 分页、排序、列显示、日期与关键字筛选都能真实交互 |

**看不到真实数据，也不会有副作用**：读写都打到 Mock 服务，返回的是契约里的示例数据
（见 [接口文档与 Mock](/api)）。想看真实业务逻辑请按[使用与部署指南](/guide)自己部署一份。

## 这个演示是怎么发布出来的

同一个仓库里，网页端用不同的构建参数产出两个互不干扰的产物：

| 产物 | 构建 | 后端 | 部署位置 |
| --- | --- | --- | --- |
| 业务网页端 | `vite build`（base `/`） | 真实后端 | 你自己的服务器 / 镜像 |
| 演示 | `vite build --mode demo`（base `/Electrical-Manager/demo/`） | Apifox Mock | 本项目站点同域的 `/demo/` |

- 子路径由 `web/vite.config.ts` 的 `VITE_BASE_PATH` 控制，路由与静态资源都挂在该前缀下，
  默认仍是 `/`，**业务部署行为不变**。
- 演示的构建参数在 `web/.env.demo`（base、Mock 地址）。
- 发布由 `.github/workflows/website.yml` 完成：站点构建完后再构建演示，把产物复制到
  `demo/` 子目录一起发到 `gh-pages`，因此站点与演示同域，页面上可以直接 iframe 引用。
