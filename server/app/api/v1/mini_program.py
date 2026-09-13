from typing import Annotated
from uuid import UUID

from fastapi import APIRouter, Header, Query, status

from app.api.deps import OrSearch128, PageNo, PageSize
from app.core.permissions import (
    CurrentMiniProgramUser,
    DbSession,
    IfMatchVersion,
    MiniProgramRegistrationOpenId,
    SuperAdmin,
)
from app.core.security import (
    create_mini_program_access_token,
    create_mini_program_registration_token,
)
from app.domain.enums import MiniProgramStockStatus
from app.schemas import (
    LastImportRead,
    MiniProgramHuaXingInventoryRead,
    MiniProgramInventoryItemRead,
    MiniProgramLiteInventoryItemRead,
    MiniProgramLoginResponse,
    MiniProgramMaterialCodeRead,
    MiniProgramMaterialRead,
    MiniProgramOperationRead,
    MiniProgramOutboundCreate,
    MiniProgramOutboundRead,
    MiniProgramOutboundReasonOptions,
    MiniProgramProfileUpdate,
    MiniProgramPurchasePlanDetailRead,
    MiniProgramPurchasePlanFilterOptions,
    MiniProgramPurchasePlanItemRead,
    MiniProgramPurchaseRecordFilterOptions,
    MiniProgramPurchaseRecordItemRead,
    MiniProgramUserMergeRequest,
    MiniProgramUserRead,
    MiniProgramUserUpdate,
    MiniProgramWechatLoginRequest,
    Page,
)
from app.services import import_job_service, mini_program_service

management_router = APIRouter(prefix="/mini-program-users", tags=["小程序用户管理"])
mini_router = APIRouter(prefix="/mini-program", tags=["小程序"])
AcceptLanguage = Annotated[str | None, Header(alias="Accept-Language")]


@management_router.get(
    "",
    response_model=Page[MiniProgramUserRead],
    summary="小程序用户列表",
)
async def list_mini_program_users(
    session: DbSession,
    user: SuperAdmin,
    page: PageNo = 1,
    page_size: PageSize = 20,
    keyword: Annotated[str | None, Query(max_length=128)] = None,
) -> Page[MiniProgramUserRead]:
    items, total = await mini_program_service.list_users(session, keyword, page, page_size)
    return Page(
        items=[MiniProgramUserRead.model_validate(item) for item in items],
        page=page,
        page_size=page_size,
        total=total,
    )


@management_router.patch(
    "/{user_id}",
    response_model=MiniProgramUserRead,
    summary="编辑小程序用户",
)
async def update_mini_program_user(
    user_id: int,
    data: MiniProgramUserUpdate,
    session: DbSession,
    user: SuperAdmin,
) -> MiniProgramUserRead:
    return MiniProgramUserRead.model_validate(
        await mini_program_service.update_user(session, user_id, data)
    )


@management_router.delete(
    "/{user_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="删除小程序用户",
)
async def delete_mini_program_user(
    user_id: int,
    session: DbSession,
    user: SuperAdmin,
    if_match: IfMatchVersion,
) -> None:
    await mini_program_service.delete_user(session, user_id, if_match)


@management_router.post(
    "/{target_user_id}/merge",
    response_model=MiniProgramUserRead,
    summary="合并小程序用户",
)
async def merge_mini_program_users(
    target_user_id: int,
    data: MiniProgramUserMergeRequest,
    session: DbSession,
    user: SuperAdmin,
) -> MiniProgramUserRead:
    return MiniProgramUserRead.model_validate(
        await mini_program_service.merge_users(session, target_user_id, data)
    )


@mini_router.post(
    "/auth/wx-login",
    response_model=MiniProgramLoginResponse,
    summary="微信登录",
)
async def mini_program_wechat_login(
    data: MiniProgramWechatLoginRequest, session: DbSession
) -> MiniProgramLoginResponse:
    user, app_id, openid = await mini_program_service.login_with_wechat(
        session, data.code, data.app_id
    )
    if user is None:
        return MiniProgramLoginResponse(
            registration_token=create_mini_program_registration_token(app_id, openid),
            requires_profile=True,
        )
    return MiniProgramLoginResponse(
        access_token=create_mini_program_access_token(user.id),
        user=MiniProgramUserRead.model_validate(user),
        requires_profile=False,
    )


@mini_router.get(
    "/me",
    response_model=MiniProgramUserRead,
    summary="我的信息",
)
async def mini_program_me(user: CurrentMiniProgramUser) -> MiniProgramUserRead:
    return MiniProgramUserRead.model_validate(user)


@mini_router.post(
    "/profile",
    response_model=MiniProgramLoginResponse,
    summary="补充个人信息",
)
async def create_mini_program_profile(
    data: MiniProgramProfileUpdate,
    session: DbSession,
    identity: MiniProgramRegistrationOpenId,
) -> MiniProgramLoginResponse:
    app_id, openid = identity
    user = await mini_program_service.register_user(
        session, app_id, openid, data.display_name, data.department_name
    )
    return MiniProgramLoginResponse(
        access_token=create_mini_program_access_token(user.id) if user.enabled else None,
        user=MiniProgramUserRead.model_validate(user),
        requires_profile=False,
    )


@mini_router.get(
    "/materials/{material_uuid}",
    response_model=MiniProgramMaterialRead,
    summary="扫码查物资",
)
async def scan_material(
    material_uuid: UUID,
    session: DbSession,
    user: CurrentMiniProgramUser,
    accept_language: AcceptLanguage = None,
) -> MiniProgramMaterialRead:
    return mini_program_service.material_read(
        await mini_program_service.get_material(session, material_uuid), accept_language
    )


@mini_router.get(
    "/inventory",
    response_model=Page[MiniProgramInventoryItemRead],
    summary="库存列表",
)
async def mini_program_inventory(
    session: DbSession,
    user: CurrentMiniProgramUser,
    page: PageNo = 1,
    page_size: PageSize = 20,
    keyword: Annotated[str | None, Query(max_length=255)] = None,
    stock_status: MiniProgramStockStatus | None = None,
    accept_language: AcceptLanguage = None,
) -> Page[MiniProgramInventoryItemRead]:
    items, total = await mini_program_service.list_inventory(
        session,
        keyword=keyword,
        stock_status=stock_status,
        page=page,
        page_size=page_size,
    )
    return Page(
        items=[mini_program_service.inventory_item_read(item, accept_language) for item in items],
        page=page,
        page_size=page_size,
        total=total,
    )


@mini_router.get(
    "/lite-inventory",
    response_model=Page[MiniProgramLiteInventoryItemRead],
    summary="精简库存",
)
async def mini_program_lite_inventory(
    session: DbSession,
    user: CurrentMiniProgramUser,
    page: PageNo = 1,
    page_size: PageSize = 20,
    keyword: Annotated[str | None, Query(max_length=255)] = None,
) -> Page[MiniProgramLiteInventoryItemRead]:
    """精简二级库（仅查看）。小程序端按二级库模式调用本接口或 /inventory。"""
    items, total = await mini_program_service.list_lite_inventory(
        session,
        keyword=keyword,
        page=page,
        page_size=page_size,
    )
    return Page(items=items, page=page, page_size=page_size, total=total)


@mini_router.get(
    "/lite-inventory/last-import",
    response_model=LastImportRead,
    summary="上次导入精简",
)
async def mini_program_lite_inventory_last_import(
    session: DbSession,
    user: CurrentMiniProgramUser,
) -> LastImportRead:
    last_import_at = await import_job_service.latest_import_finished_at(
        session, import_type="LITE_INVENTORY"
    )
    return LastImportRead(last_import_at=last_import_at)


@mini_router.get(
    "/purchase-plans",
    response_model=Page[MiniProgramPurchasePlanItemRead],
    summary="申购计划",
)
async def mini_program_purchase_plans(
    session: DbSession,
    user: CurrentMiniProgramUser,
    page: PageNo = 1,
    page_size: PageSize = 20,
    keyword: Annotated[str | None, Query(max_length=255)] = None,
    actual_demand_person: OrSearch128 = None,
    subitem_no: Annotated[str | None, Query(max_length=64)] = None,
) -> Page[MiniProgramPurchasePlanItemRead]:
    items, total = await mini_program_service.list_purchase_plans(
        session,
        keyword,
        page,
        page_size,
        actual_demand_person,
        subitem_no,
    )
    return Page(
        items=[mini_program_service.purchase_plan_item_read(item) for item in items],
        page=page,
        page_size=page_size,
        total=total,
    )


@mini_router.get(
    "/purchase-plans/filter-options",
    response_model=MiniProgramPurchasePlanFilterOptions,
    summary="申购计划筛选",
)
async def mini_program_purchase_plan_filter_options(
    session: DbSession,
    user: CurrentMiniProgramUser,
) -> MiniProgramPurchasePlanFilterOptions:
    (
        actual_demand_persons,
        subitem_nos,
    ) = await mini_program_service.list_purchase_plan_filter_options(session)
    return MiniProgramPurchasePlanFilterOptions(
        actual_demand_persons=actual_demand_persons,
        subitem_nos=subitem_nos,
    )


@mini_router.get(
    "/purchase-records",
    response_model=Page[MiniProgramPurchaseRecordItemRead],
    summary="申购记录",
)
async def mini_program_purchase_records(
    session: DbSession,
    user: CurrentMiniProgramUser,
    page: PageNo = 1,
    page_size: PageSize = 20,
    keyword: Annotated[str | None, Query(max_length=255)] = None,
    status: Annotated[str | None, Query(max_length=128)] = None,
    subitem_no: Annotated[str | None, Query(max_length=64)] = None,
) -> Page[MiniProgramPurchaseRecordItemRead]:
    items, total = await mini_program_service.list_purchase_records(
        session,
        keyword=keyword,
        status=status,
        subitem_no=subitem_no,
        page=page,
        page_size=page_size,
    )
    return Page(
        items=[mini_program_service.purchase_record_item_read(item) for item in items],
        page=page,
        page_size=page_size,
        total=total,
    )


@mini_router.get(
    "/purchase-records/filter-options",
    response_model=MiniProgramPurchaseRecordFilterOptions,
    summary="申购记录筛选",
)
async def mini_program_purchase_record_filter_options(
    session: DbSession,
    user: CurrentMiniProgramUser,
) -> MiniProgramPurchaseRecordFilterOptions:
    statuses, subitem_nos = await mini_program_service.list_purchase_record_filter_options(session)
    return MiniProgramPurchaseRecordFilterOptions(statuses=statuses, subitem_nos=subitem_nos)


@mini_router.get(
    "/purchase-records/{line_id}",
    response_model=MiniProgramPurchaseRecordItemRead,
    summary="申购记录详情",
)
async def mini_program_purchase_record_detail(
    line_id: int,
    session: DbSession,
    user: CurrentMiniProgramUser,
) -> MiniProgramPurchaseRecordItemRead:
    return await mini_program_service.purchase_record_detail(session, line_id)


@mini_router.get(
    "/material-codes",
    response_model=Page[MiniProgramMaterialCodeRead],
    summary="物料编码",
)
async def mini_program_material_codes(
    session: DbSession,
    user: CurrentMiniProgramUser,
    page: PageNo = 1,
    page_size: PageSize = 20,
    keyword: Annotated[str | None, Query(max_length=255)] = None,
) -> Page[MiniProgramMaterialCodeRead]:
    items, total = await mini_program_service.list_material_codes(
        session, keyword=keyword, page=page, page_size=page_size
    )
    return Page(items=items, page=page, page_size=page_size, total=total)


@mini_router.get(
    "/huaxing-inventory",
    response_model=Page[MiniProgramHuaXingInventoryRead],
    summary="华星库存",
)
async def mini_program_huaxing_inventory(
    session: DbSession,
    user: CurrentMiniProgramUser,
    page: PageNo = 1,
    page_size: PageSize = 20,
    keyword: Annotated[str | None, Query(max_length=255)] = None,
) -> Page[MiniProgramHuaXingInventoryRead]:
    items, total = await mini_program_service.list_huaxing_inventory(
        session, keyword=keyword, page=page, page_size=page_size
    )
    return Page(items=items, page=page, page_size=page_size, total=total)


@mini_router.get(
    "/material-codes/last-import",
    response_model=LastImportRead,
    summary="上次导入编码",
)
async def mini_program_material_codes_last_import(
    session: DbSession,
    user: CurrentMiniProgramUser,
) -> LastImportRead:
    last_import_at = await import_job_service.latest_import_finished_at(
        session, import_type="MATERIAL_CODE_LIBRARY"
    )
    return LastImportRead(last_import_at=last_import_at)


@mini_router.get(
    "/huaxing-inventory/last-import",
    response_model=LastImportRead,
    summary="上次导入华星",
)
async def mini_program_huaxing_inventory_last_import(
    session: DbSession,
    user: CurrentMiniProgramUser,
) -> LastImportRead:
    last_import_at = await import_job_service.latest_import_finished_at(
        session, import_type="HUAXING_INVENTORY"
    )
    return LastImportRead(last_import_at=last_import_at)


@mini_router.get(
    "/purchase-plans/{material_id}",
    response_model=MiniProgramPurchasePlanDetailRead,
    summary="申购计划详情",
)
async def mini_program_purchase_plan_detail(
    material_id: int,
    session: DbSession,
    user: CurrentMiniProgramUser,
) -> MiniProgramPurchasePlanDetailRead:
    return await mini_program_service.purchase_plan_detail(session, material_id)


@mini_router.post(
    "/outbound",
    response_model=MiniProgramOutboundRead,
    status_code=status.HTTP_201_CREATED,
    summary="扫码出库",
)
async def mini_program_outbound(
    data: MiniProgramOutboundCreate,
    session: DbSession,
    user: CurrentMiniProgramUser,
) -> MiniProgramOutboundRead:
    return await mini_program_service.create_outbound(session, data, user)


@mini_router.get(
    "/outbound-reasons",
    response_model=MiniProgramOutboundReasonOptions,
    summary="出库用途选项",
)
async def mini_program_outbound_reasons(
    session: DbSession,
    user: CurrentMiniProgramUser,
) -> MiniProgramOutboundReasonOptions:
    personal_reasons, system_reasons = await mini_program_service.recent_outbound_reasons(
        session, user
    )
    return MiniProgramOutboundReasonOptions(
        personal_reasons=personal_reasons,
        system_reasons=system_reasons,
    )


@mini_router.get(
    "/operations",
    response_model=Page[MiniProgramOperationRead],
    summary="操作记录",
)
async def mini_program_operations(
    session: DbSession,
    user: CurrentMiniProgramUser,
    page: PageNo = 1,
    page_size: PageSize = 20,
) -> Page[MiniProgramOperationRead]:
    """按当前用户姓名匹配查询出入库记录（含管理端操作）。"""
    items, total = await mini_program_service.list_operations_by_user(
        session, user, page, page_size
    )
    return Page(items=items, page=page, page_size=page_size, total=total)


@mini_router.get(
    "/outbound/{operation_no}",
    response_model=MiniProgramOutboundRead,
    summary="出库详情",
)
async def mini_program_outbound_by_no(
    operation_no: str,
    session: DbSession,
    user: CurrentMiniProgramUser,
) -> MiniProgramOutboundRead:
    """按流水号查询小程序出库明细（分享结果页恢复数据用）。"""
    return await mini_program_service.get_outbound_by_no(session, operation_no, user)
