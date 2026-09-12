from __future__ import annotations

import pytest
from httpx import AsyncClient

from tests.conftest import auth_headers


async def _create_memo(
    client: AsyncClient,
    headers: dict[str, str],
    title: str = "",
    content: str = "",
) -> dict:
    response = await client.post(
        "/api/v1/memos",
        headers=headers,
        json={"title": title, "content": content},
    )
    assert response.status_code == 201, response.text
    return response.json()


@pytest.mark.asyncio
async def test_memo_crud_lifecycle(client: AsyncClient) -> None:
    headers = await auth_headers(client, "readonly")

    # 创建：空标题回退默认名。
    created = await _create_memo(client, headers, title="  ", content="第一条")
    memo_id = int(created["id"])
    assert created["title"] == "未命名备忘录"
    assert created["content"] == "第一条"
    assert created["version"] == 1
    assert created["created_at"]
    assert created["updated_at"]

    # 列表：只有这一条。
    listed = await client.get("/api/v1/memos", headers=headers)
    assert listed.status_code == 200, listed.text
    body = listed.json()
    assert len(body) == 1
    assert body[0]["id"] == memo_id
    assert body[0]["title"] == "未命名备忘录"

    # 更新标题与内容：version 递增。
    v1 = created["version"]
    updated = await client.patch(
        f"/api/v1/memos/{memo_id}",
        headers=headers,
        json={"title": "检修要点", "content": "本周检查低压柜", "version": v1},
    )
    assert updated.status_code == 200, updated.text
    memo = updated.json()
    assert memo["title"] == "检修要点"
    assert memo["content"] == "本周检查低压柜"
    assert memo["version"] == v1 + 1

    # 仅更新内容，标题保持不变。
    patched = await client.patch(
        f"/api/v1/memos/{memo_id}",
        headers=headers,
        json={"content": "内容已改", "version": v1 + 1},
    )
    assert patched.status_code == 200, patched.text
    assert patched.json()["title"] == "检修要点"
    assert patched.json()["content"] == "内容已改"

    # 删除后列表为空。
    deleted = await client.delete(f"/api/v1/memos/{memo_id}", headers=headers)
    assert deleted.status_code == 204, deleted.text
    after = await client.get("/api/v1/memos", headers=headers)
    assert after.json() == []


@pytest.mark.asyncio
async def test_memo_requires_auth(client: AsyncClient) -> None:
    response = await client.get("/api/v1/memos")
    assert response.status_code == 401, response.text
    response = await client.post("/api/v1/memos", json={"title": "x", "content": "y"})
    assert response.status_code == 401, response.text


@pytest.mark.asyncio
async def test_memo_scoped_per_user(client: AsyncClient) -> None:
    purchase_headers = await auth_headers(client, "purchase")
    readonly_headers = await auth_headers(client, "readonly")

    await _create_memo(client, purchase_headers, title="申购备忘", content="记录")
    await _create_memo(client, purchase_headers, title="第二条", content="内容")

    # 只读用户看不到申购管理员创建的备忘录，也看不到 READ_ONLY 权限之外的任何数据。
    own = await client.get("/api/v1/memos", headers=readonly_headers)
    assert own.status_code == 200 and own.json() == []

    # 不同用户创建的备忘录互不可见、不可操作。
    listed = await client.get("/api/v1/memos", headers=purchase_headers)
    assert len(listed.json()) == 2

    # 只读用户操作他人的备忘录 → 400 NOT_FOUND（不泄露存在性）。
    other_id = int(listed.json()[0]["id"])
    access = await client.patch(
        f"/api/v1/memos/{other_id}",
        headers=readonly_headers,
        json={"title": "越权", "version": 1},
    )
    assert access.status_code == 400, access.text
    assert access.json()["code"] == "NOT_FOUND"
    deleted = await client.delete(f"/api/v1/memos/{other_id}", headers=readonly_headers)
    assert deleted.status_code == 400, deleted.text
    assert deleted.json()["code"] == "NOT_FOUND"


@pytest.mark.asyncio
async def test_memo_update_version_conflict(client: AsyncClient) -> None:
    headers = await auth_headers(client, "admin")
    created = await _create_memo(client, headers, title="冲突测试", content="v1")

    conflict = await client.patch(
        f"/api/v1/memos/{created['id']}",
        headers=headers,
        json={"title": "旧版本写入", "version": 999},
    )
    assert conflict.status_code == 409, conflict.text
    assert conflict.json()["code"] == "VERSION_CONFLICT"

    # 冲突后原数据未被修改。
    listed = await client.get("/api/v1/memos", headers=headers)
    memo = next(item for item in listed.json() if item["id"] == created["id"])
    assert memo["title"] == "冲突测试"
    assert memo["version"] == 1


@pytest.mark.asyncio
async def test_memo_update_unknown_id(client: AsyncClient) -> None:
    headers = await auth_headers(client, "readonly")
    response = await client.patch(
        "/api/v1/memos/999999",
        headers=headers,
        json={"title": "找不到", "version": 1},
    )
    assert response.status_code == 400, response.text
    assert response.json()["code"] == "NOT_FOUND"


@pytest.mark.asyncio
async def test_memo_content_length_validation(client: AsyncClient) -> None:
    headers = await auth_headers(client, "admin")
    too_long = "很" * 10001
    response = await client.post(
        "/api/v1/memos", headers=headers, json={"title": "超长", "content": too_long}
    )
    assert response.status_code == 422, response.text