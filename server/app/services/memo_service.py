"""管理端个人备忘录：纯文本记录，一级 tab 快捷切换多条。

按创建人隔离：每个登录用户只能看到和操作自己的备忘录（个人笔记，不共享）。
对外统一返回 NOT_FOUND 隐藏他人备忘录的存在性；更新走乐观锁（version）。
"""

from __future__ import annotations

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.errors import not_found
from app.models import Memo
from app.schemas import MemoCreate, MemoUpdate
from app.services.common import validate_version

DEFAULT_TITLE = "未命名备忘录"


def _normalize_title(title: str) -> str:
    title = title.strip()
    return title or DEFAULT_TITLE


async def list_memos(session: AsyncSession, user_id: int) -> list[Memo]:
    """当前用户的全部备忘录，最近更新的排前面（tab 顺序即编辑活跃度）。"""
    result = await session.scalars(
        select(Memo)
        .where(Memo.created_by == user_id)
        .order_by(Memo.updated_at.desc(), Memo.id.desc())
    )
    return list(result.all())


async def get_own_memo(session: AsyncSession, memo_id: int, user_id: int) -> Memo:
    """读取当前用户的一条备忘录；不存在或不属于该用户统一视为不存在。"""
    memo = await session.get(Memo, memo_id)
    if memo is None or memo.created_by != user_id:
        raise not_found("备忘录")
    return memo


async def create_memo(session: AsyncSession, user_id: int, data: MemoCreate) -> Memo:
    memo = Memo(
        title=_normalize_title(data.title),
        content=data.content,
        created_by=user_id,
    )
    session.add(memo)
    await session.flush()
    return memo


async def update_memo(
    session: AsyncSession, memo_id: int, user_id: int, data: MemoUpdate
) -> Memo:
    memo = await get_own_memo(session, memo_id, user_id)
    validate_version(data.version, memo.version)
    if data.title is not None:
        memo.title = _normalize_title(data.title)
    if data.content is not None:
        memo.content = data.content
    memo.version += 1
    await session.flush()
    return memo


async def delete_memo(session: AsyncSession, memo_id: int, user_id: int) -> None:
    memo = await get_own_memo(session, memo_id, user_id)
    await session.delete(memo)
    await session.flush()