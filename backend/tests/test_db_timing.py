"""数据库耗时响应头（X-DB-Time / X-DB-Queries）与采集器行为。"""

from __future__ import annotations

import asyncio
import re

from httpx import AsyncClient
from sqlalchemy import text

from app.core.database import engine
from app.core.db_timing import (
    begin_database_timing,
    current_database_timing,
    finish_database_timing,
)
from tests.conftest import auth_headers


def _duration_ms(value: str) -> float:
    assert re.fullmatch(r"\d+(\.\d+)?", value), value
    return float(value)


async def test_response_reports_server_side_duration_breakdown(client: AsyncClient) -> None:
    """/health 自身会执行一条 SELECT 1：三个耗时头应互相自洽，且条数 >= 1。"""
    response = await client.get("/health")

    assert response.status_code == 200
    total_time = _duration_ms(response.headers["X-Response-Time"])
    db_time = _duration_ms(response.headers["X-DB-Time"])
    compute_time = _duration_ms(response.headers["X-Compute-Time"])
    assert int(response.headers["X-DB-Queries"]) >= 1
    # 总耗时 = 数据库耗时 + 计算耗时，均以毫秒计且都在服务端计量（不含网络）。
    assert db_time <= total_time
    assert compute_time >= 0
    assert abs(total_time - db_time - compute_time) < 0.01


async def test_business_request_reports_database_queries(client: AsyncClient) -> None:
    headers = await auth_headers(client, "readonly")

    response = await client.get("/api/v1/stock-materials", headers=headers)

    assert response.status_code == 200
    assert int(response.headers["X-DB-Queries"]) >= 1
    assert _duration_ms(response.headers["X-DB-Time"]) >= 0
    assert _duration_ms(response.headers["X-Compute-Time"]) >= 0
    assert _duration_ms(response.headers["X-Response-Time"]) > 0


async def test_concurrent_requests_report_their_own_database_work(client: AsyncClient) -> None:
    """并发请求各自累计：任何一个响应都必须带上自己的数据库统计。"""
    headers = await auth_headers(client, "admin")

    responses = await asyncio.gather(
        client.get("/health", headers=headers),
        client.get("/api/v1/stock-materials", headers=headers),
        client.get("/health", headers=headers),
    )

    for response in responses:
        assert response.status_code == 200
        assert int(response.headers["X-DB-Queries"]) >= 1
        assert _duration_ms(response.headers["X-DB-Time"]) >= 0


async def test_database_timing_only_collects_inside_request_scope() -> None:
    """采集器只在 begin/finish 之间累计，请求外的 SQL 不计入，也不会泄漏到请求之外。"""
    assert current_database_timing() is None

    async with engine.connect() as connection:
        await connection.execute(text("SELECT 1"))
    assert current_database_timing() is None

    timing = begin_database_timing()
    try:
        assert current_database_timing() is timing
        async with engine.connect() as connection:
            await connection.execute(text("SELECT 1"))
            await connection.execute(text("SELECT 2"))
    finally:
        finish_database_timing()

    assert timing.statement_count == 2
    assert timing.total_ms > 0
    assert current_database_timing() is None
