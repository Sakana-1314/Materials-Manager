"""把演示站的深链回传脚本注入站点 404.html。

为什么需要：演示站是本仓库里的单页应用，直接刷新它的深层路由（如
/Electrical-Manager/demo/offline/warehouse/stock）时，静态托管找不到对应文件。
GitHub Pages 只回「站点根目录」的 404.html（子目录里的 404.html 不生效，已实测），
所以 SPA 回退只能做在这一页：由它把原路径以 ?path= 回传给演示入口，
演示入口自带的引导脚本（web/index.html）还原路径后再挂载 history 路由。

为什么注入在产物上：VitePress 会在 markdown 里剥掉 inline script，而这一页由它生成，
因此在构建产物上注入，不修改任何源文件与站点配置。

用法：python3 scripts/inject_demo_fallback.py <站点输出目录>
"""

from __future__ import annotations

import pathlib
import sys

MARKER = "<!-- demo-spa-fallback -->"

SCRIPT = (
    MARKER
    + """
<script>
  // 演示站（/demo/、/demo/offline/）是本仓库里的单页应用。刷新它们的深层路由时静态托管找不到
  // 对应文件而落到本页，这里把原路径回传给演示入口；入口自带的引导脚本还原路径后再挂载 history
  // 路由，因此不改路由配置，也不影响正常访问时的 URL。文档站与业务部署不受影响。
  ;(function () {
    var bases = ['/Electrical-Manager/demo/offline/', '/Electrical-Manager/demo/']
    var path = window.location.pathname
    for (var i = 0; i < bases.length; i++) {
      var base = bases[i]
      if (path.indexOf(base) === 0) {
        window.location.replace(base + '?path=' + encodeURIComponent(path))
        return
      }
    }
  })()
</script>
"""
)


def inject(site_dir: pathlib.Path) -> bool:
    target = site_dir / "404.html"
    if not target.is_file():
        raise SystemExit(f"找不到 {target}")
    html = target.read_text(encoding="utf-8")
    if MARKER in html:
        print("404.html 已注入过演示回退脚本，跳过")
        return False
    anchor = "</head>"
    if anchor not in html:
        raise SystemExit("404.html 缺少 </head>，无法注入")
    target.write_text(html.replace(anchor, SCRIPT + anchor, 1), encoding="utf-8")
    print("已把演示深链回退脚本注入站点 404.html")
    return True


if __name__ == "__main__":
    if len(sys.argv) != 2:
        raise SystemExit(__doc__)
    inject(pathlib.Path(sys.argv[1]))
