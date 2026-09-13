"""示例数据（Apifox Mock）的守卫测试。

`docs/openapi.yaml` 里的 `examples` 是 Apifox「Mock 环境」与文档站演示的全部数据来源，
一旦写成占位符或前后对不上，演示、联调都会直接呈现假数据。这里把几条硬要求固定下来：

1. 不出现生成器的兜底占位符（`xxx-示例`）——出现即说明有新字段没登记示例；
2. 必填字段在示例里必须存在且不为 null（否则 Mock 数据会让前端直接报错）；
3. 带 `enum` 的字段（含 `$ref` 指向的枚举）取值必须落在枚举里；
4. 分页 schema 的 `total` 必须等于 `items` 长度，且不超过 `page_size`；
5. 出入库明细的 `before_qty ± quantity == after_qty`。
"""

from __future__ import annotations

from decimal import Decimal
from typing import Any

from app.main import app
from scripts.openapi_examples import add_examples, resolve_refs

PLACEHOLDER_SUFFIX = "-示例"
OPERATION_TYPES = {"INBOUND": Decimal(1), "OUTBOUND": Decimal(-1)}


def _document() -> dict[str, Any]:
    document = app.openapi()
    add_examples(document)
    resolve_refs(document)
    return document


def _walk(document: dict[str, Any], spec: dict[str, Any], value: Any, path: str) -> list[str]:
    """递归校验示例值，返回问题列表。"""
    problems: list[str] = []
    if "$ref" in spec:
        resolved = document["components"]["schemas"].get(spec["$ref"].rsplit("/", 1)[-1], {})
        return _walk(document, resolved, value, path)
    if "anyOf" in spec and isinstance(value, dict) is False and "enum" not in spec:
        branches = [branch for branch in spec["anyOf"] if branch.get("type") != "null"]
        if value is None:
            return problems
        if branches:
            return _walk(document, branches[0], value, path)
    if spec.get("enum"):
        if value not in spec["enum"]:
            problems.append(f"{path}: 取值 {value!r} 不在枚举 {spec['enum']} 内")
        return problems
    kind = spec.get("type")
    if kind == "object" or isinstance(spec.get("properties"), dict):
        properties = spec.get("properties") or {}
        if not isinstance(value, dict):
            return [f"{path}: 期望对象，实际 {type(value).__name__}"]
        for name in spec.get("required") or []:
            if name not in value or value[name] is None:
                problems.append(f"{path}.{name}: 必填字段缺失或为 null")
        for name, item in value.items():
            if name in properties:
                problems.extend(_walk(document, properties[name], item, f"{path}.{name}"))
        return problems
    if kind == "array":
        if not isinstance(value, list):
            return [f"{path}: 期望数组，实际 {type(value).__name__}"]
        items = spec.get("items") or {}
        for index, item in enumerate(value):
            problems.extend(_walk(document, items, item, f"{path}[{index}]"))
        return problems
    if isinstance(value, str) and value.endswith(PLACEHOLDER_SUFFIX):
        problems.append(f"{path}: 出现占位符 {value!r}")
    return problems


def _examples() -> dict[str, Any]:
    document = _document()
    return {
        name: spec["examples"][0]
        for name, spec in document["components"]["schemas"].items()
        if spec.get("examples")
    }


def test_schema_examples_cover_the_contract() -> None:
    """每个对象 schema 都要有示例（Apifox Mock 才有数据可返回）。"""
    document = _document()
    missing = [
        name
        for name, spec in document["components"]["schemas"].items()
        if isinstance(spec, dict)
        and spec.get("type") in ("object", None)
        and "properties" in spec
        and not spec.get("examples")
    ]
    assert missing == []


def test_no_placeholder_values() -> None:
    """不许出现兜底占位符：它只应该是「新字段忘了登记示例」的信号。"""
    offenders = [
        name for name, example in _examples().items() if PLACEHOLDER_SUFFIX in repr(example)
    ]
    assert offenders == [], f"这些 schema 的示例还是占位符：{offenders}"


def test_examples_are_schema_valid() -> None:
    """必填字段、枚举取值、类型都要和 schema 对得上。"""
    document = _document()
    problems: list[str] = []
    for name, spec in document["components"]["schemas"].items():
        examples = spec.get("examples") or []
        if not examples:
            continue
        problems.extend(_walk(document, spec, examples[0], name))
    assert problems == []


def test_page_examples_are_self_consistent() -> None:
    """分页示例：total 等于本页条数，且不超过 page_size。"""
    offenders = []
    for name, example in _examples().items():
        if not name.startswith("Page_") or not isinstance(example, dict):
            continue
        items = example.get("items") or []
        if example.get("total") != len(items) or len(items) > example.get("page_size", 20):
            offenders.append(
                f"{name}: total={example.get('total')} items={len(items)}"
                f" page_size={example.get('page_size')}"
            )
    assert offenders == []


def test_operation_line_examples_balance() -> None:
    """出入库明细的前后库存必须自洽：before ± quantity == after。"""
    offenders = []
    for name, example in _examples().items():
        if "StockOperation" not in name or not isinstance(example, dict):
            continue
        operation_type = example.get("operation_type")
        if operation_type not in OPERATION_TYPES:
            continue
        for line in example.get("lines") or []:
            expected = Decimal(str(line["before_qty"])) + OPERATION_TYPES[operation_type] * Decimal(
                str(line["quantity"])
            )
            if expected != Decimal(str(line["after_qty"])):
                offenders.append(
                    f"{name} 明细 {line.get('id')}: {line['before_qty']} → {line['after_qty']}"
                )
    assert offenders == []


def test_api_error_example_uses_a_real_error_code() -> None:
    """错误示例得是真实错误码，且文案与错误码总表一致（不能出现 code/message 打架）。"""
    error_example = _examples()["ApiError"]
    assert error_example["code"] == "NOT_FOUND"
    assert error_example["message"] == "二级库物资不存在"
