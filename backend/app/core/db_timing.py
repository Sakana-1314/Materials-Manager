"""数据库语句耗时统计（服务端实际执行时间，不含网络传输）。

请求进入时由 ``request_context`` 中间件调用 :func:`begin_database_timing` 建立本次请求的
采集器，SQLAlchemy 的 ``before_cursor_execute`` / ``after_cursor_execute`` 事件把每条
语句的实际执行耗时累加进去；响应返回前中间件读取汇总值写入 ``X-DB-Time``（毫秒）与
``X-DB-Queries``（语句条数）响应头，并记入访问日志。

接口性能响应头共三项，都由服务端计量（不含网络传输时间）：``X-Response-Time`` 是服务端
处理总耗时，``X-DB-Time`` 是其中的数据库语句耗时，``X-Compute-Time`` 是剩下的应用计算耗时
（总耗时 - 数据库耗时）。三者配合即可判断接口慢在数据库、慢在应用计算，还是慢在客户端到
服务端的网络链路上。

采集器通过 :class:`contextvars.ContextVar` 传递，因此：

- 只有存在请求上下文的 SQL 才被统计；定时任务、启动清理等后台 SQL 不统计，也几乎无额外开销；
- 并发请求之间互不干扰，各自累计自己的耗时；
- 请求内派生的后台任务会继承采集器，它们在响应生成前执行的 SQL 也会计入（该窗口通常极短）。
"""

from __future__ import annotations

import time
from contextvars import ContextVar
from dataclasses import dataclass, field
from typing import Any

from sqlalchemy import event
from sqlalchemy.ext.asyncio import AsyncEngine

__all__ = [
    "DatabaseTiming",
    "begin_database_timing",
    "current_database_timing",
    "finish_database_timing",
    "register_database_timing",
]

_current: ContextVar[DatabaseTiming | None] = ContextVar("database_timing", default=None)


@dataclass
class DatabaseTiming:
    """单次请求内数据库语句的累计耗时与条数。"""

    total_ms: float = 0.0
    statement_count: int = 0
    # 语句开始时刻栈：同一请求内语句串行执行，先进后出即可正确配对；
    # 即便出现嵌套/重叠执行，累计值也只会略微偏大，不会把时间算到别的请求上。
    _pending_starts: list[float] = field(default_factory=list)

    def statement_started(self) -> None:
        self._pending_starts.append(time.perf_counter())

    def statement_finished(self) -> None:
        if self._pending_starts:
            self.total_ms += (time.perf_counter() - self._pending_starts.pop()) * 1000
        self.statement_count += 1


def begin_database_timing() -> DatabaseTiming:
    """为当前上下文建立采集器（每个请求调用一次），返回本次请求的累计对象。"""
    timing = DatabaseTiming()
    _current.set(timing)
    return timing


def current_database_timing() -> DatabaseTiming | None:
    """返回当前上下文的采集器；不在请求内（后台任务等）时为 None。"""
    return _current.get()


def finish_database_timing() -> None:
    """结束当前上下文的采集（响应返回前调用），之后的 SQL 不再计入本次请求。"""
    _current.set(None)


def register_database_timing(engine: AsyncEngine) -> None:
    """把语句耗时事件挂到引擎上（引擎创建后调用一次即可）。"""
    event.listen(engine.sync_engine, "before_cursor_execute", _statement_started)
    event.listen(engine.sync_engine, "after_cursor_execute", _statement_finished)


def _statement_started(
    conn: Any,
    cursor: Any,
    statement: str,
    parameters: Any,
    context: Any,
    executemany: bool,
) -> None:
    if (timing := _current.get()) is not None:
        timing.statement_started()


def _statement_finished(
    conn: Any,
    cursor: Any,
    statement: str,
    parameters: Any,
    context: Any,
    executemany: bool,
) -> None:
    if (timing := _current.get()) is not None:
        timing.statement_finished()
