"""校验「错误码总表」文档与代码一致。

文档：docs/websites/pages/api-error-codes.md
代码：server/app/**/*.py 里所有 AppError(...) / code="..." 出现过的错误码，
      以及 server/app/core/errors.py 的 _DEFAULT_STATUS_BY_CODE 默认状态码映射。

本测试只做两件事：
1. 代码里出现过的每个错误码，文档里必须能查到（漏登记会让 CI 失败）；
2. 文档里写的 HTTP 状态码必须与「默认映射或调用点显式指定」的结果一致。

这样新增错误码时忘了登记文档，或改了默认状态码忘了改文档，都会被 CI 拦下。
"""

from __future__ import annotations

import re
from pathlib import Path

import app  # noqa: F401  （确保 server/ 在 sys.path 上）

SERVER_DIR = Path(__file__).resolve().parents[1]
REPO_ROOT = SERVER_DIR.parent
DOC = REPO_ROOT / "docs" / "websites" / "pages" / "api-error-codes.md"

APP_ERROR = re.compile(r'AppError\(\s*"([A-Z][A-Z_]{2,})"')
# 只匹配 HTTP 错误体的 code="X"；error_code="X" 是异步任务记录字段，不是对外错误码。
INLINE_CODE = re.compile(r'(?<![_A-Za-z])code="([A-Z][A-Z_]{2,})"')
# AI 搜索这类服务会按上游状态码算出 code 后动态抛出（raise AppError(code, ...)），
# 需要额外把 code = "X" / response_status = NNN 这种赋值对收集进来。
DYNAMIC_CODE = re.compile(r'^\s*code = "([A-Z][A-Z_]{2,})"', re.MULTILINE)
DYNAMIC_STATUS = re.compile(r'^\s*(?:response_)?status(?:_code)? = (\d{3})$', re.MULTILINE)
DEFAULT_MAP = re.compile(r'"([A-Z][A-Z_]{2,})":\s*(\d+)')
DOC_CODE = re.compile(r"`([A-Z][A-Z_]{2,})`")
# 文档里出现、但代码里找不到的 code（例如纯上游码）允许显式忽略
DOC_ONLY_ALLOWED: set[str] = set()


def _call_arguments(text: str, open_paren: int) -> str:
    """返回 AppError( 之后到配对右括号之间的实参文本（跳过引号内的括号）。"""
    depth = 0
    quote: str | None = None
    index = open_paren
    while index < len(text):
        char = text[index]
        if quote:
            if char == quote and text[index - 1] != "\\":
                quote = None
        elif char in "\"'":
            quote = char
        elif char == "(":
            depth += 1
        elif char == ")":
            depth -= 1
            if depth == 0:
                return text[open_paren:index]
        index += 1
    return text[open_paren : open_paren + 400]


def _enclosing_call(text: str, position: int) -> str:
    """返回包含 position 的最内层 (...) 实参文本（用于 code="X" 这种关键字写法）。"""
    depth = 0
    start: int | None = None
    index = position
    while index >= 0:
        char = text[index]
        if char == ")":
            depth += 1
        elif char == "(":
            if depth == 0:
                start = index
                break
            depth -= 1
        index -= 1
    if start is None:
        return text[max(0, position - 400) : position + 400]
    return _call_arguments(text, start)


def _scan_runtime_codes() -> tuple[dict[str, set[int]], set[str]]:
    """返回 {code: {显式状态码}} 与文档需要覆盖的 code 集合。"""
    explicit: dict[str, set[int]] = {}
    all_codes: set[str] = set()

    for path in (SERVER_DIR / "app").rglob("*.py"):
        text = path.read_text(encoding="utf-8")
        dynamic_codes = DYNAMIC_CODE.findall(text)
        dynamic_statuses = [int(value) for value in DYNAMIC_STATUS.findall(text)]
        for code, status in zip(dynamic_codes, dynamic_statuses, strict=False):
            all_codes.add(code)
            explicit.setdefault(code, set()).add(status)
        for match in APP_ERROR.finditer(text):
            code = match.group(1)
            all_codes.add(code)
            # 只在本次 AppError(...) 的实参里找 status_code，
            # 否则会把后面无关函数的 status_code 误当成显式状态码。
            arguments = _call_arguments(text, match.start())
            status = re.search(r"status_code=(\d+)", arguments)
            if status:
                explicit.setdefault(code, set()).add(int(status.group(1)))
        for match in INLINE_CODE.finditer(text):
            code = match.group(1)
            all_codes.add(code)
            arguments = _enclosing_call(text, match.start())
            status = re.search(r"status_code=(\d+)", arguments)
            if status and code not in explicit:
                explicit.setdefault(code, set()).add(int(status.group(1)))

    errors_py = (SERVER_DIR / "app" / "core" / "errors.py").read_text(encoding="utf-8")
    all_codes.update(code for code, _status in DEFAULT_MAP.findall(errors_py))
    return explicit, all_codes


def _documented_codes() -> str:
    return DOC.read_text(encoding="utf-8")


def test_documented_codes_exist_in_code() -> None:
    """文档里的 code 必须真的在代码里出现，避免写错名字或写已经不存在的码。"""
    _, codes = _scan_runtime_codes()
    documented = set(DOC_CODE.findall(_documented_codes()))
    unknown = sorted(code for code in documented - codes - DOC_ONLY_ALLOWED)
    unknown = [code for code in unknown if code not in {"JPEG", "PNG", "WEBP", "UTF", "GBK"}]
    assert not unknown, f"{DOC.name} 里出现代码中不存在的错误码：{unknown}"


def test_every_runtime_code_is_documented() -> None:
    _, codes = _scan_runtime_codes()
    doc = _documented_codes()
    missing = sorted(code for code in codes if code not in doc)
    assert not missing, f"以下错误码未登记到 {DOC.name}：{missing}"


def test_documented_status_codes_match_code() -> None:
    """文档里每个 code 对应的 HTTP 列，必须与默认映射或显式指定一致。"""
    explicit, _ = _scan_runtime_codes()
    errors_py = (SERVER_DIR / "app" / "core" / "errors.py").read_text(encoding="utf-8")
    defaults = {code: int(status) for code, status in DEFAULT_MAP.findall(errors_py)}

    doc = _documented_codes()
    checked = 0
    for line in doc.splitlines():
        if not line.startswith("| `"):
            continue
        cells = [cell.strip() for cell in line.strip("|").split("|")]
        if len(cells) < 2:
            continue
        status_cell = cells[1]
        if "透传" in status_cell or "无固定" in status_cell:
            # 状态码不固定的码（如框架异常透传）在正文里单独说明，不参与比对。
            continue
        for code in DOC_CODE.findall(cells[0]):
            expected = explicit.get(code) or ({defaults.get(code, 400)})
            documented = {int(value) for value in re.findall(r"\d{3}", status_cell)}
            assert documented, f"{code} 的 HTTP 列没有状态码：{line}"
            assert documented == expected, (
                f"{code} 文档写 {sorted(documented)}，代码实际为 {sorted(expected)}"
            )
            checked += 1
    assert checked >= 50, f"只校验到 {checked} 个 code，文档解析可能失效"
