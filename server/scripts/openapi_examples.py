"""为导出的 OpenAPI 契约补充示例数据（Mock 数据）。

为什么要做：docs/openapi.yaml 由本脚本从后端 App 生成，同时也是 Apifox 与前端 Mock 的
唯一来源。Apifox 的「智能 Mock」与前端联调都依赖 schema 里的 example / examples，
所以在这里按字段名与类型确定性生成示例，而不是手改 docs/openapi.yaml（手改会被 CI 覆盖）。

生成规则（按优先级）：
1. schema 自己的 enum → 取第一个取值；
2. 字段名命中 _FIELD_EXAMPLES → 用中文业务示例；
3. 字段名后缀命中 _SUFFIX_EXAMPLES（如 *_at、*_id、*_no）；
4. 按 JSON Schema 类型 + format 兜底（date / date-time / uuid / integer / number / boolean / array / object）。

同一份代码必然生成同一份示例，因此契约校验（CI 重跑本脚本后 git diff）保持稳定。
"""

from __future__ import annotations

from typing import Any

# 字段名精确匹配的业务示例
_FIELD_EXAMPLES: dict[str, Any] = {
    "id": 1,
    "uuid": "3f2c1a4e-8b7d-4c1e-9f2a-5d6e7f8a9b0c",
    "client_request_id": "8b1f0c2d-4a5e-4f6b-9c7d-1e2f3a4b5c6d",
    "business_reason": "盘点差异修正",
    "original_name": "stock-material-20260913.png",
    "mime_type": "image/png",
    "size_bytes": 204800,
    "width": 800,
    "height": 600,
    "minimum_qty": "5.000",
    "current_qty": "42.000",
    "before_qty": "45.000",
    "after_qty": "42.000",
    "remaining_qty": "42.000",
    "material_name": "交流接触器",
    "name_id": 1,
    "alias": "接触器",
    "ratio": "0.250",
    "is_reversed": False,
    "has_operation_records": True,
    "permissions": ["stock:read", "purchase:read"],
    "version": 1,
    "page": 1,
    "page_size": 20,
    "total": 128,
    "items": [],
    "enabled": True,
    "remark": "无",
    "status": "正常",
    "name": "二级库物资",
    "display_name": "张三",
    "username": "warehouse",
    "role": "WAREHOUSE_ADMIN",
    "roles": ["WAREHOUSE_ADMIN"],
    "usage": "设备检修更换",
    "category": "低压电器",
    "unit_name": "个",
    "model_spec": "CJX2-2510",
    "material_code": "DQ-000123",
    "subitem_no": "01",
    "quantity": "10.000",
    "planned_qty": "10.000",
    "trace_no": "HX2026080001",
    "salesperson": "李四",
    "purchase_responsible": "王五",
    "actual_demand_person": "赵六",
    "demand_department": "电气自动化车间",
    "purchase_order_no": "申购单-2026年09月13日",
    "plan_no": "CL-20260913-0001",
    "contract_no": "HT-2026-0001",
    "vessel_no": "MV HX 001",
    "consolidation_port": "Morowali",
    "urgency": "正常",
    "columns": ["material_code", "name", "quantity"],
    "image_ids": [],
    "images": [],
    "message": "操作成功",
    "code": "NOT_FOUND",
    "request_id": "3f2c1a4e-8b7d-4c1e-9f2a-5d6e7f8a9b0c",
    "detail": "二级库物资不存在",
    "details": {},
    "url": "https://example.com/api/v1/files/images/1?size=320",
    "size": 320,
    "content_type": "image/png",
    "platform": "FEISHU",
    "event_type": "stock.outbound.created",
    "build_time": "2026-09-13T02:00:00+08:00",
    "git_sha": "cda6a6d",
}

# 字段名后缀匹配的示例
_SUFFIX_EXAMPLES: list[tuple[str, Any]] = [
    ("_at", "2026-09-13T10:30:00+08:00"),
    ("_date", "2026-09-13"),
    ("_time", "2026-09-13T10:30:00+08:00"),
    ("_id", 1),
    ("_no", "CL-20260913-0001"),
    ("_no_", "CL-20260913-0001"),
    ("_code", "DQ-000123"),
    ("_qty", "10.000"),
    ("_name", "低压电器"),
    ("_person", "张三"),
    ("_dept", "电气自动化车间"),
    ("_url", "https://example.com/hook/token"),
    ("_key", "sk-example-key"),
    ("_token", "api-token-example"),
    ("_count", 3),
    ("_port", "Morowali"),
    ("_reason", "盘点差异修正"),
]


def _example_for(name: str, spec: dict[str, Any], depth: int = 1) -> Any:
    """按字段名 + schema 生成一个确定性的示例值。"""
    if "enum" in spec and spec["enum"]:
        return spec["enum"][0]
    if "example" in spec:
        return spec["example"]
    if "const" in spec:
        return spec["const"]

    if name in _FIELD_EXAMPLES:
        value = _FIELD_EXAMPLES[name]
        # items 之类容器字段按元素 schema 再生成一个元素，便于 Apifox 直接看到结构。
        if isinstance(value, list) and isinstance(spec.get("items"), dict):
            return [_example_from_schema(spec["items"], f"{name}_item", depth + 1)]
        return value

    for suffix, value in _SUFFIX_EXAMPLES:
        if name.endswith(suffix):
            return value

    fmt = spec.get("format")
    if fmt == "date":
        return "2026-09-13"
    if fmt == "date-time":
        return "2026-09-13T10:30:00+08:00"
    if fmt == "uuid":
        return "3f2c1a4e-8b7d-4c1e-9f2a-5d6e7f8a9b0c"

    if "anyOf" in spec:
        # Optional[X] 在 OpenAPI 里是 anyOf: [X, null]，取非 null 分支。
        branches = [b for b in spec["anyOf"] if b.get("type") != "null"]
        if branches:
            return _example_from_schema(branches[0], name, depth + 1)
        return None

    return _example_by_type(name, spec, depth)


def _example_by_type(name: str, spec: dict[str, Any], depth: int) -> Any:
    kind = spec.get("type")
    if kind is None and isinstance(spec.get("properties"), dict):
        kind = "object"
    if kind == "integer":
        return 1
    if kind == "number":
        return "10.000"
    if kind == "boolean":
        return True
    if kind == "array":
        items = spec.get("items")
        if isinstance(items, dict):
            return [_example_from_schema(items, f"{name}_item", depth + 1)]
        return []
    if kind == "null":
        return None
    if kind == "object":
        return _object_example(spec, depth + 1)
    return f"{name}-示例"


def _example_from_schema(spec: dict[str, Any], name: str, depth: int) -> Any:
    if depth > 4:
        return None
    if "$ref" in spec:
        # 就地展开引用：示例里保留结构比保留 $ref 更有用。
        return {"__ref__": spec["$ref"]}
    return _example_for(name, spec, depth)


def _object_example(spec: dict[str, Any], depth: int) -> dict[str, Any]:
    properties = spec.get("properties")
    if not isinstance(properties, dict):
        return {}
    return {key: _example_for(key, sub, depth) for key, sub in properties.items()}


def add_examples(document: dict[str, Any]) -> int:
    """为 components.schemas 的每个对象 schema 写入 examples[0]，返回处理的 schema 数。"""
    schemas = document.get("components", {}).get("schemas", {})
    handled = 0
    for spec in schemas.values():
        if not isinstance(spec, dict):
            continue
        if spec.get("type") not in ("object", None) or "properties" not in spec:
            continue
        if "examples" in spec:
            continue
        spec["examples"] = [_object_example(spec, 1)]
        handled += 1
    return handled


def resolve_refs(document: dict[str, Any]) -> None:
    """把示例中的 __ref__ 占位替换成被引用 schema 的示例（原地修改）。"""
    schemas = document.get("components", {}).get("schemas", {})
    cache: dict[str, Any] = {}

    def lookup(ref: str) -> Any:
        name = ref.rsplit("/", 1)[-1]
        if name in cache:
            return cache[name]
        spec = schemas.get(name)
        if not isinstance(spec, dict):
            return {}
        examples = spec.get("examples")
        if examples:
            value = examples[0]
        else:
            value = {key: {"__ref__": ref} for key in (spec.get("properties") or {})}
            value = {"__object__": True, **value}
        cache[name] = value
        return value

    def walk(node: Any, depth: int = 0) -> Any:
        if depth > 6:
            return None
        if isinstance(node, dict):
            if "__ref__" in node and len(node) == 1:
                return walk(lookup(node["__ref__"]), depth + 1)
            return {k: walk(v, depth + 1) for k, v in node.items() if k != "__object__"}
        if isinstance(node, list):
            return [walk(item, depth + 1) for item in node]
        return node

    for spec in schemas.values():
        if isinstance(spec, dict) and spec.get("examples"):
            spec["examples"] = [walk(spec["examples"][0])]
