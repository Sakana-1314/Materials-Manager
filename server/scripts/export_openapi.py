import os
import sys
from importlib import import_module
from pathlib import Path

import yaml

sys.path.insert(0, str(Path(__file__).resolve().parent))

from openapi_examples import add_examples, add_response_examples, resolve_refs  # noqa: E402

os.environ.setdefault("APP_DATABASE_URL", "sqlite+aiosqlite:///:memory:")

app = import_module("app.main").app

document = app.openapi()
count = add_examples(document)
# 示例里用 __ref__ 占位保留结构，最后统一换成被引用 schema 的示例。
resolve_refs(document)
# 接口响应示例：Apifox「响应示例优先」时作为 Mock 返回值。
responses = add_response_examples(document)

target = Path(__file__).resolve().parents[2] / "docs" / "openapi.yaml"
target.parent.mkdir(parents=True, exist_ok=True)
target.write_text(
    yaml.safe_dump(document, allow_unicode=True, sort_keys=False),
    encoding="utf-8",
    newline="\n",
)
print(f"{target}（已为 {count} 个 schema、{responses} 个响应生成示例）")
