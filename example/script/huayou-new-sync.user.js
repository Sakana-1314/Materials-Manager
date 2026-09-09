// ==UserScript==
// @name         华友新物资系统同步脚本
// @namespace    https://materials-manager.qcloud.19890605.xyz/
// @version      3.1.2
// @description  从华兴帆软“物料申购跟踪”同步采购人、状态、合同号和船名：按申购单号整单查询、整单批量回写（平台每 10 秒至多查询 1 次）。
// @match        http://43.154.152.157:8080/*
// @updateURL    https://github.com/YangRucheng/Materials-Manager/raw/refs/heads/main/example/script/huayou-new-sync.user.js
// @downloadURL  https://github.com/YangRucheng/Materials-Manager/raw/refs/heads/main/example/script/huayou-new-sync.user.js
// @connect      materials-manager.qcloud.19890605.xyz
// @connect      43.154.152.157
// @grant        GM_xmlhttpRequest
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @grant        GM_openInTab
// @grant        GM_cookie
// @grant        GM_registerMenuCommand
// @run-at       document-idle
// ==/UserScript==

(() => {
  "use strict";

  const PLATFORM_ORIGIN = "http://43.154.152.157:8080";
  const PLATFORM_BASE = `${PLATFORM_ORIGIN}/webroot/decision`;
  const MATERIALS_API = "https://materials-manager.qcloud.19890605.xyz/api/v1";
  const SYNC_FIELDS = "contract_no,vessel_no,salesperson,status";
  const VIEWLET =
    "%252F%25E6%2595%25B0%25E6%258D%25AE%25E6%2584%25B8%25E6%259E%2590" +
    "%252F%25E4%25BB%2593%25E5%2582%25A8%25E7%25AE%25A1%25E7%2590%2586" +
    "%252F%25E7%2589%25A9%25E6%2596%2599%25E7%2594%25B3%25E8%25B4%25AD" +
    "%252F%25E7%2589%25A9%25E6%2596%2599%25E7%2594%25B3%25E8%25B4%25AD%25E8%25B7%259F%25E8%25B8%25AA.cpt";
  const PREFIX = "huaxing_tracking_sync_";
  const TASK_KEY = `${PREFIX}task`;
  const RESPONSE_PREFIX = `${PREFIX}response_`;
  const WORKER_PARAM = "huaxingSyncTask";
  // 平台限频：任意两次报表查询（每个申购单号一次）之间至少间隔 10 秒；登录不计入。
  const MIN_PLATFORM_GAP_MS = 10000;
  const REPORT_LOAD_DEADLINE_MS = 60000;
  const ORDER_QUERY_DEADLINE_MS = 120000;
  const defaults = {
    platformUsername: "huaxing_jianxiu",
    platformPassword: "",
    apiToken: "",
    intervalMinutes: 10,
    batchSize: 30,
    minPurchaseOrderNo: "P05SG0300",
    autoEnabled: false,
    dryRun: false,
    minimized: false,
    panelRight: 20,
    panelBottom: 20,
  };

  const key = (name) => `${PREFIX}${name}`;
  const loadConfig = () =>
    Object.fromEntries(
      Object.entries(defaults).map(([name, value]) => [
        name,
        GM_getValue(key(name), value),
      ]),
    );
  const saveConfig = (values) => {
    config = { ...config, ...values };
    Object.entries(config).forEach(([name, value]) =>
      GM_setValue(key(name), value),
    );
  };
  const saveField = (name, value) => {
    config = { ...config, [name]: value };
    GM_setValue(key(name), value);
  };
  const int = (value, fallback, min, max) => {
    const parsed = Number.parseInt(String(value), 10);
    return Number.isFinite(parsed)
      ? Math.min(max, Math.max(min, parsed))
      : fallback;
  };
  const clean = (value) =>
    String(value ?? "")
      .replace(/\s+/g, " ")
      .trim();
  const form = (data) =>
    Object.entries(data)
      .map(
        ([name, value]) =>
          `${encodeURIComponent(name)}=${encodeURIComponent(value ?? "")}`,
      )
      .join("&");
  const joined = (values) => {
    const value = [...new Set(values.map(clean).filter(Boolean))].join(" / ");
    return value.length <= 128 ? value : `${value.slice(0, 127)}…`;
  };
  const sleep = (milliseconds) =>
    new Promise((resolve) => setTimeout(resolve, milliseconds));
  // 结构性错误：报表模板/接口契约与脚本不符，属于系统性问题，出现即应终止本次同步。
  const structuralError = (message) =>
    Object.assign(new Error(`【结构异常】${message}`), { structural: true });

  // —— 本地更新记录（IndexedDB）：每个申购单记录最近成功同步时间，冷却期内不再请求平台 ——
  const IDB_NAME = `${PREFIX}order_sync`;
  const IDB_STORE = "orders";
  const ORDER_COOLDOWN_DAYS = 3;
  const ORDER_COOLDOWN_MS = ORDER_COOLDOWN_DAYS * 24 * 60 * 60 * 1000;
  // 油猴隔离沙箱里可能拿不到页面的 indexedDB，需回退到 unsafeWindow（同源页面）。
  const idbFactory = () => {
    if (typeof indexedDB !== "undefined") return indexedDB;
    try {
      if (typeof unsafeWindow !== "undefined" && unsafeWindow.indexedDB)
        return unsafeWindow.indexedDB;
    } catch {}
    return null;
  };
  const openIdb = () =>
    new Promise((resolve, reject) => {
      const factory = idbFactory();
      if (!factory) {
        reject(new Error("IndexedDB 不可用，本环境无法做 3 天去重"));
        return;
      }
      let openRequest;
      try {
        openRequest = factory.open(IDB_NAME, 1);
      } catch (error) {
        reject(error);
        return;
      }
      openRequest.onupgradeneeded = () => {
        const db = openRequest.result;
        if (!db.objectStoreNames.contains(IDB_STORE)) {
          db.createObjectStore(IDB_STORE, { keyPath: "orderNo" });
        }
      };
      openRequest.onsuccess = () => resolve(openRequest.result);
      openRequest.onerror = () =>
        reject(openRequest.error || new Error("IndexedDB 打开失败"));
    });
  const idbRecentOrderNos = async (cooldownMs) => {
    const db = await openIdb();
    try {
      return await new Promise((resolve, reject) => {
        const transaction = db.transaction(IDB_STORE, "readonly");
        const store = transaction.objectStore(IDB_STORE);
        const request = store.getAll();
        request.onsuccess = () => {
          const now = Date.now();
          const recent = new Set();
          for (const record of request.result || []) {
            if (now - Number(record.updatedAt) < cooldownMs) {
              recent.add(String(record.orderNo));
            }
          }
          resolve(recent);
        };
        request.onerror = () =>
          reject(request.error || new Error("读取本地更新记录失败"));
      });
    } finally {
      db.close();
    }
  };
  const idbRememberOrder = async (orderNo) => {
    const db = await openIdb();
    try {
      return await new Promise((resolve, reject) => {
        const transaction = db.transaction(IDB_STORE, "readwrite");
        transaction.objectStore(IDB_STORE).put({
          orderNo: String(orderNo),
          updatedAt: Date.now(),
        });
        transaction.oncomplete = () => resolve();
        transaction.onerror = () =>
          reject(transaction.error || new Error("写入本地更新记录失败"));
      });
    } finally {
      db.close();
    }
  };

  // —— 请求调试日志：每次网络请求（备件 API / 华兴登录 / 报表导出）统一打印参数与输出 ——
  // 注意：按需求为全量明文输出，请求日志会包含密码、接口令牌、accessToken 等敏感凭证，
  // 仅用于个人电脑上的联调核对，勿在共享/生产控制台长时间留存。
  let requestSeq = 0;
  const clipText = (text, max = 5000) => {
    const value = String(text ?? "");
    return value.length > max
      ? `${value.slice(0, max)}\n…（响应截断，共 ${value.length} 字符）`
      : value;
  };
  const request = ({
    method = "GET",
    url,
    headers = {},
    data,
    responseType,
    timeout = 45000,
  }) =>
    new Promise((resolve, reject) => {
      const no = ++requestSeq;
      console.info(`[华兴同步] → 请求 #${no}`, {
        method,
        url,
        headers,
        body: data,
      });
      GM_xmlhttpRequest({
        method,
        url,
        headers,
        data,
        responseType,
        timeout,
        anonymous: false,
        onload(response) {
          const text = String(response.responseText || response.response || "");
          console.info(`[华兴同步] ← 响应 #${no}`, {
            status: response.status,
            text: clipText(text),
          });
          if (response.status >= 200 && response.status < 300) resolve(response);
          else {
            const detail = text.slice(0, 300);
            reject(new Error(`HTTP ${response.status}：${detail}`));
          }
        },
        ontimeout: () => {
          console.info(`[华兴同步] ✗ 超时 #${no}`, { method, url });
          reject(new Error(`请求超时：${url}`));
        },
        onerror: (error) => {
          const detail = error?.error || error?.message || "网络请求失败";
          const target = error?.finalUrl || url;
          const suffix = error?.status ? `（HTTP ${error.status}）` : "";
          console.info(`[华兴同步] ✗ 失败 #${no}`, {
            method,
            url: target,
            status: error?.status,
            detail,
          });
          reject(new Error(`${detail}：${target}${suffix}`));
        },
      });
    });
  const json = async (options) => {
    const response = await request(options);
    const text = String(response.responseText || response.response || "");
    try {
      return JSON.parse(text);
    } catch {
      throw new Error(`接口返回的不是有效 JSON：${text.slice(0, 200)}`);
    }
  };

  const parseCsv = (text) => {
    const rows = [];
    let row = [];
    let cell = "";
    let quoted = false;
    for (let index = 0; index < text.length; index += 1) {
      const char = text[index];
      if (quoted) {
        if (char === '"' && text[index + 1] === '"') {
          cell += '"';
          index += 1;
        } else if (char === '"') quoted = false;
        else cell += char;
      } else if (char === '"') quoted = true;
      else if (char === ",") {
        row.push(cell);
        cell = "";
      } else if (char === "\n") {
        row.push(cell.replace(/\r$/, ""));
        rows.push(row);
        row = [];
        cell = "";
      } else cell += char;
    }
    if (cell || row.length) {
      row.push(cell.replace(/\r$/, ""));
      rows.push(row);
    }
    return rows;
  };
  const reportSections = (text) => {
    const sections = [];
    for (const row of parseCsv(text.replace(/^\uFEFF/, ""))) {
      if (clean(row[0]) === "序号") {
        sections.push({ headers: row.map(clean), rows: [] });
        continue;
      }
      const section = sections.at(-1);
      if (!section || !row.some((value, index) => index > 0 && clean(value))) continue;
      section.rows.push(
        Object.fromEntries(
          section.headers.map((header, index) => [header, clean(row[index])]),
        ),
      );
    }
    return sections;
  };
  const rowKey = (row) =>
    [row["申购单号"], row["申购物料编码"], row["申购物料名称"]]
      .map(clean).join("\u0000");
  const quantity = (value) => {
    const parsed = Number(String(value ?? "").replace(/,/g, ""));
    return Number.isFinite(parsed) ? parsed : 0;
  };
  const progressStatus = (trackingRows, quantityRows) => {
    let rank = 0;
    const byKey = new Map(quantityRows.map((row) => [rowKey(row), row]));
    for (const tracking of trackingRows) {
      const quantities = byKey.get(rowKey(tracking));
      const requested = quantity(quantities?.["申购数量"]);
      const purchased = quantity(quantities?.["采购数量"]);
      const inbound = quantity(quantities?.["入库数量"]);
      if (inbound > 0 && requested > 0 && inbound >= requested) rank = Math.max(rank, 3);
      else if (inbound > 0) rank = Math.max(rank, 2);
      else if (purchased > 0 || tracking["采购合同号"]) rank = Math.max(rank, 1);
    }
    return ["已申购", "已采购", "部分入库", "已入库"][rank];
  };
  const resultFor = (rows, quantityRows) => ({
    count: rows.length,
    salesperson: joined(rows.map((row) => row["采购人"])),
    contractNo: joined(rows.map((row) => row["采购合同号"])),
    vesselNo: joined(rows.map((row) => row["船名"])),
    status: progressStatus(rows, quantityRows),
  });
  // 按申购单号查询一次，返回该单下每个追溯码的聚合结果（追溯码 -> 结果）。
  const parseOrderReport = (text) => {
    if (!/序号/.test(text)) {
      throw structuralError("导出内容缺少“序号”表头，可能未登录或报表模板已变化");
    }
    const sections = reportSections(text);
    const trackingRows = [];
    const quantityRows = [];
    for (const section of sections) {
      if (section.headers.includes("追溯码")) trackingRows.push(...section.rows);
      if (section.headers.includes("入库数量")) quantityRows.push(...section.rows);
    }
    if (!trackingRows.length && !quantityRows.length) {
      throw structuralError("导出结果既无追溯码数据也无数量数据，报表结构可能已变化");
    }
    const traces = new Map();
    for (const row of trackingRows) {
      const trace = clean(row["追溯码"]);
      if (!trace) continue;
      const group = traces.get(trace) || [];
      group.push(row);
      traces.set(trace, group);
    }
    const results = {};
    for (const [trace, rows] of traces) {
      results[trace] = resultFor(rows, quantityRows);
    }
    return results;
  };
  const reportUrl = (task) => {
    const parameters = encodeURIComponent(
      encodeURIComponent(
        JSON.stringify({
          申购单号: task.orderNo,
          申购日期开始: "2020-01-01",
          申购日期截止: "2035-12-31",
          __pi__: true,
        }),
      ),
    );
    return `${PLATFORM_BASE}/view/report?viewlet=${VIEWLET}&__parameters__=${parameters}&${WORKER_PARAM}=${encodeURIComponent(task.id)}`;
  };
  const sessionId = () => {
    for (const script of document.scripts) {
      if (script.src) continue;
      const match = script.textContent.match(/var\s+sid\s*=\s*"([^"]+)"/);
      if (match) return match[1];
    }
    return "";
  };
  const waitForReport = async () => {
    const deadline = Date.now() + REPORT_LOAD_DEADLINE_MS;
    while (Date.now() < deadline) {
      const text = document.body?.innerText || "";
      if (
        sessionId() &&
        /共\d+行/.test(text) &&
        document.querySelector(".sheet-table-canvas")
      ) {
        await sleep(800);
        return;
      }
      await sleep(300);
    }
    throw new Error("物料申购跟踪报表加载超时");
  };
  const runWorker = async (taskId) => {
    const task = GM_getValue(TASK_KEY, null);
    if (!task || task.id !== taskId) return;
    const responseKey = `${RESPONSE_PREFIX}${taskId}`;
    try {
      if (document.title !== "物料申购跟踪") {
        throw new Error("物资平台未登录或无权访问物料申购跟踪");
      }
      await waitForReport();
      const sid = sessionId();
      const response = await request({
        method: "POST",
        url: `${PLATFORM_BASE}/url/report/v10/export`,
        headers: {
          Authorization: `Bearer ${task.token}`,
          sessionID: sid,
          "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
        },
        data: form({ format: "csv", extype: "page" }),
      });
      const text = String(response.responseText || response.response || "");
      GM_setValue(responseKey, {
        id: taskId,
        ok: true,
        result: parseOrderReport(text),
      });
    } catch (error) {
      GM_setValue(responseKey, {
        id: taskId,
        ok: false,
        error: error?.message || String(error),
      });
    } finally {
      setTimeout(() => window.close(), 150);
    }
  };

  const workerTaskId = new URLSearchParams(location.search).get(WORKER_PARAM);
  if (workerTaskId && location.origin === PLATFORM_ORIGIN) {
    runWorker(workerTaskId);
    return;
  }

  let config = loadConfig();
  let running = false;
  let timer = null;
  let host;
  let ui;
  const logs = [];
  let stats = { scanned: 0, found: 0, updated: 0, skipped: 0, failed: 0 };

  const apiRequest = async (options) => {
    const result = await json({
      ...options,
      headers: {
        "Content-Type": "application/json",
        "X-API-Token": config.apiToken,
        ...(options.headers || {}),
      },
    });
    if (result?.code && result?.message) throw new Error(result.message);
    return result;
  };
  const requireShape = (payload, label) => {
    if (!payload || typeof payload !== "object")
      throw structuralError(`${label}不是 JSON 对象`);
    return payload;
  };
  const orderTargets = async () => {
    const limit = int(config.batchSize, 30, 1, 200);
    const cursor = Number(GM_getValue(key("cursor"), 0)) || 0;
    const minPo = clean(config.minPurchaseOrderNo);
    const base = `${MATERIALS_API}/purchase-record-sync/order-targets?limit=${limit}&cursor=${cursor}&fields=${encodeURIComponent(SYNC_FIELDS)}`;
    const url = minPo ? `${base}&min_purchase_order_no=${encodeURIComponent(minPo)}` : base;
    const result = requireShape(
      await apiRequest({ method: "GET", url }),
      "整单目标接口",
    );
    if (!Array.isArray(result.items))
      throw structuralError("整单目标接口缺少 items 数组");
    for (const item of result.items) {
      if (!item || typeof item.purchase_order_no !== "string" || !item.purchase_order_no.trim())
        throw structuralError("整单目标接口存在缺少申购单号的目标");
      if (!Array.isArray(item.trace_nos))
        throw structuralError("整单目标缺少追溯号列表");
    }
    const rows = result.items;
    if (!rows.length && cursor > 0) {
      GM_setValue(key("cursor"), 0);
      return orderTargets();
    }
    return rows;
  };
  const applyOrder = async (orderNo, items) => {
    const payload = requireShape(
      await apiRequest({
        method: "POST",
        url: `${MATERIALS_API}/purchase-record-sync/orders/${encodeURIComponent(orderNo)}/apply`,
        data: JSON.stringify({ items }),
      }),
      "整单回写接口",
    );
    for (const field of ["applied", "not_found", "affected_headers", "affected_lines"]) {
      if (!Number.isFinite(Number(payload[field])))
        throw structuralError(`整单回写接口缺少 ${field}`);
    }
    return payload;
  };
  const loginPlatform = async () => {
    const result = requireShape(
      await json({
        method: "POST",
        url: `${PLATFORM_BASE}/login`,
        headers: { "Content-Type": "application/json" },
        data: JSON.stringify({
          username: config.platformUsername,
          password: config.platformPassword,
          validity: -1,
          encrypted: false,
        }),
      }),
      "物资平台登录接口",
    );
    const token = result?.data?.accessToken;
    if (!token) throw new Error(result?.errorMsg || "华兴物资平台登录失败");
    console.info("[华兴同步] 平台登录成功，写入 fine_auth_token cookie", {
      username: config.platformUsername,
      token,
    });
    await new Promise((resolve, reject) =>
      GM_cookie.set(
        {
          url: PLATFORM_BASE,
          name: "fine_auth_token",
          value: token,
          path: "/",
          expirationDate: Math.floor(Date.now() / 1000) + 7200,
        },
        (error) => (error ? reject(new Error(String(error))) : resolve()),
      ),
    );
    return token;
  };
  // 平台限频：相邻两次报表查询至少间隔 10 秒。每个申购单号只发起一次平台查询。
  const pacer = (() => {
    let last = 0;
    return async () => {
      const wait = Math.max(0, MIN_PLATFORM_GAP_MS - (Date.now() - last));
      if (wait > 0) {
        status(`限频等待 ${Math.ceil(wait / 1000)} 秒`, "running");
        await sleep(wait);
      }
      last = Date.now();
    };
  })();
  const queryOrder = async (token, orderNo) => {
    await pacer();
    const id = `${Date.now()}_${Math.random().toString(36).slice(2)}`;
    const task = { id, token, orderNo };
    const responseKey = `${RESPONSE_PREFIX}${id}`;
    GM_deleteValue(responseKey);
    GM_setValue(TASK_KEY, task);
    const tab = GM_openInTab(reportUrl(task), {
      active: false,
      insert: true,
      setParent: true,
    });
    const deadline = Date.now() + ORDER_QUERY_DEADLINE_MS;
    try {
      while (Date.now() < deadline) {
        const response = GM_getValue(responseKey, null);
        if (response?.id === id) {
          if (!response.ok) {
            throw Object.assign(
              new Error(response.error || "报表查询失败"),
              { structural: /【结构异常】/.test(response.error || "") },
            );
          }
          return response.result;
        }
        await sleep(400);
      }
      throw new Error("等待物资平台查询结果超时");
    } finally {
      GM_deleteValue(responseKey);
      GM_deleteValue(TASK_KEY);
      try {
        tab?.close();
      } catch {}
    }
  };

  const log = (message, level = "info") => {
    logs.push({
      time: new Date().toLocaleTimeString("zh-CN", { hour12: false }),
      message: String(message),
      level,
    });
    if (logs.length > 200) logs.splice(0, logs.length - 200);
    if (!ui) return;
    ui.logs.replaceChildren(
      ...logs.map((line) => {
        const item = document.createElement("div");
        item.className = line.level;
        item.textContent = `[${line.time}] ${line.message}`;
        return item;
      }),
    );
    ui.logs.scrollTop = ui.logs.scrollHeight;
  };
  const renderStats = () => {
    if (ui) {
      ui.stats.textContent = `申购单 ${stats.scanned} · 追溯号命中 ${stats.found} · 更新 ${stats.updated} · 跳过 ${stats.skipped} · 失败 ${stats.failed}`;
    }
  };
  const status = (text, kind = "idle") => {
    if (!ui) return;
    ui.status.textContent = text;
    ui.status.dataset.kind = kind;
  };
  const credentials = () => {
    const missing = [];
    if (!config.platformUsername) missing.push("物资平台账号");
    if (!config.platformPassword) missing.push("物资平台密码");
    if (!config.apiToken) missing.push("接口令牌");
    if (missing.length) throw new Error(`请先填写并保存：${missing.join("、")}`);
  };
  const summarize = (result) =>
    [
      ["采购人", result.salesperson],
      ["状态", result.status],
      ["合同号", result.contractNo],
      ["船名", result.vesselNo],
    ]
      .filter(([, value]) => value)
      .map(([label, value]) => `${label}=${value}`)
      .join("，");
  const buildItem = (trace, result) => {
    const payload = {};
    for (const [field, value] of [
      ["contract_no", result.contractNo],
      ["vessel_no", result.vesselNo],
      ["salesperson", result.salesperson],
      ["status", result.status],
    ]) {
      if (value) payload[field] = value;
    }
    return Object.keys(payload).length
      ? { trace_no: trace, ...payload }
      : null;
  };
  const run = async (trigger = "manual") => {
    if (running) return log("已有同步任务正在执行", "warn");
    running = true;
    clearTimeout(timer);
    stats = { scanned: 0, found: 0, updated: 0, skipped: 0, failed: 0 };
    renderStats();
    ui.run.disabled = true;
    ui.run.textContent = "同步中…";
    status("连接中", "running");
    try {
      credentials();
      log(`${trigger === "auto" ? "自动" : "手动"}同步开始（按申购单号整单同步）`);
      const orders = await orderTargets();
      stats.scanned = orders.length;
      renderStats();
      if (!orders.length) {
        status("无需同步", "success");
        log("没有需要补齐的申购单");
        return;
      }
      // 3 天冷却去重：最近一次成功同步过的申购单本次跳过，避免频繁请求平台。
      let recentOrderNos = new Set();
      let idbAvailable = true;
      try {
        recentOrderNos = await idbRecentOrderNos(ORDER_COOLDOWN_MS);
      } catch (error) {
        idbAvailable = false;
        log(`本地更新记录不可用（${error.message}），本次不做 3 天去重`, "warn");
      }
      const pendingOrders = idbAvailable
        ? orders.filter((order) => {
            const orderNo = clean(order.purchase_order_no);
            if (recentOrderNos.has(orderNo)) {
              stats.skipped += 1;
              return false;
            }
            return true;
          })
        : orders;
      if (pendingOrders.length !== orders.length) {
        log(
          `跳过 ${orders.length - pendingOrders.length} 个 ${ORDER_COOLDOWN_DAYS} 天内已更新的申购单（避免重复请求）`,
          "warn",
        );
        renderStats();
      }
      if (!pendingOrders.length) {
        // 本页全部在冷却期内：不请求平台，但把游标推进到本页末尾，让后续批次继续处理更早的申购单。
        const pageCursorIds = orders
          .map((order) => Number(order.cursor_id))
          .filter(Number.isFinite);
        if (pageCursorIds.length) {
          GM_setValue(key("cursor"), Math.min(...pageCursorIds));
        }
        status("全部在冷却期内", "success");
        log(
          `本批 ${orders.length} 个申购单均在 ${ORDER_COOLDOWN_DAYS} 天冷却期内，已跳过并推进批次，本次未请求平台`,
          "warn",
        );
        return;
      }
      const token = await loginPlatform();
      log(`物资平台登录成功：${config.platformUsername}`);
      let orderIndex = 0;
      let aborted = false;
      for (const order of pendingOrders) {
        orderIndex += 1;
        const orderNo = clean(order.purchase_order_no);
        const traceNos = (order.trace_nos || []).map(clean).filter(Boolean);
        const orderTargetsCount = traceNos.length;
        status(`${orderIndex}/${pendingOrders.length} ${orderNo}`, "running");
        try {
          const perTrace = await queryOrder(token, orderNo);
          const items = [];
          for (const traceNo of traceNos) {
            const result = perTrace[traceNo];
            if (!result || !result.count) {
              stats.skipped += 1;
              log(`${orderNo} ${traceNo}：平台未查询到记录`, "warn");
              continue;
            }
            stats.found += 1;
            const summary = summarize(result);
            if (config.dryRun) {
              stats.skipped += 1;
              log(`${orderNo} ${traceNo}：演练模式，${summary}`);
              continue;
            }
            const item = buildItem(traceNo, result);
            if (!item) {
              stats.skipped += 1;
              log(`${orderNo} ${traceNo}：可同步字段均为空`, "warn");
              continue;
            }
            items.push(item);
          }
          if (!items.length) {
            if (config.dryRun) {
              log(
                `申购单 ${orderNo}（${orderTargetsCount} 个追溯号）：演练完成，未写库`,
                "success",
              );
            } else {
              log(
                `申购单 ${orderNo}（${orderTargetsCount} 个追溯号）：本单无需回写`,
                "warn",
              );
            }
          } else {
            const applied = await applyOrder(orderNo, items);
            const changed = applied.affected_headers + applied.affected_lines;
            if (changed > 0) {
              stats.updated += items.length;
              log(
                `申购单 ${orderNo}：整单回写 ${items.length}/${orderTargetsCount} 个追溯号` +
                  `（头表 ${applied.affected_headers}、明细 ${applied.affected_lines}）`,
                "success",
              );
            } else {
              stats.skipped += items.length;
              log(`申购单 ${orderNo}：回写 ${items.length} 项均无变化`, "warn");
            }
            if (applied.not_found > 0) {
              log(`申购单 ${orderNo}：${applied.not_found} 个追溯号未命中本地记录`, "warn");
            }
          }
          // 查询与（如需）回写都成功后才记录最近更新时间；演练模式不记，避免挡住后续正式同步。
          if (!config.dryRun) {
            try {
              await idbRememberOrder(orderNo);
            } catch (error) {
              log(`申购单 ${orderNo}：写入本地更新记录失败：${error.message}`, "warn");
            }
          }
        } catch (error) {
          stats.failed += 1;
          if (orderIndex === 1 || error?.structural) {
            aborted = true;
            status("同步中止", "error");
            log(`申购单 ${orderNo}：${error.message}`, "error");
            log(
              orderIndex === 1
                ? "首个平台查询即失败，为尽快暴露问题已终止本次同步，请检查日志后重试"
                : "报表结构异常属系统性问题，已终止本次同步",
              "error",
            );
            break;
          }
          log(`申购单 ${orderNo}：${error.message}`, "error");
        }
        renderStats();
      }
      if (aborted) {
        log(
          `已中止：进度 ${orderIndex}/${pendingOrders.length} 个申购单（失败 ${stats.failed}）`,
          "error",
        );
      } else {
        const cursorIds = orders
          .map((order) => Number(order.cursor_id))
          .filter(Number.isFinite);
        if (cursorIds.length) GM_setValue(key("cursor"), Math.min(...cursorIds));
        status(stats.failed ? "完成（有失败）" : "同步完成", stats.failed ? "warn" : "success");
        log(
          `同步完成：申购单 ${stats.scanned}，追溯号命中 ${stats.found}，更新 ${stats.updated}，失败 ${stats.failed}`,
          stats.failed ? "warn" : "success",
        );
      }
    } catch (error) {
      stats.failed += 1;
      renderStats();
      status("同步失败", "error");
      log(error.message, "error");
    } finally {
      running = false;
      ui.run.disabled = false;
      ui.run.textContent = "同步一次";
      if (config.autoEnabled) schedule();
    }
  };
  const schedule = (delay) => {
    clearTimeout(timer);
    if (!config.autoEnabled) return;
    const milliseconds = int(config.intervalMinutes, 10, 1, 1440) * 60000;
    timer = setTimeout(
      () => run("auto"),
      typeof delay === "number" ? delay : milliseconds,
    );
    status(`自动模式：${config.intervalMinutes} 分钟`);
  };
  const formConfig = () => ({
    platformUsername: ui.platformUsername.value.trim(),
    platformPassword: ui.platformPassword.value,
    apiToken: ui.apiToken.value.trim(),
    intervalMinutes: int(ui.interval.value, 10, 1, 1440),
    batchSize: int(ui.batch.value, 30, 1, 200),
    minPurchaseOrderNo: ui.minPurchaseOrderNo.value.trim(),
    dryRun: ui.dryRun.checked,
    autoEnabled: ui.auto.checked,
  });
  const fillForm = () => {
    ui.platformUsername.value = config.platformUsername;
    ui.platformPassword.value = config.platformPassword;
    ui.apiToken.value = config.apiToken;
    ui.interval.value = config.intervalMinutes;
    ui.batch.value = config.batchSize;
    ui.minPurchaseOrderNo.value = config.minPurchaseOrderNo;
    ui.dryRun.checked = config.dryRun;
    ui.auto.checked = config.autoEnabled;
  };
  const debounce = (fn, milliseconds = 500) => {
    let pending = null;
    return (...args) => {
      clearTimeout(pending);
      pending = setTimeout(() => fn(...args), milliseconds);
    };
  };
  const bindAutosave = () => {
    const textBindings = [
      [ui.platformUsername, "platformUsername", (value) => value.trim()],
      [ui.platformPassword, "platformPassword", (value) => value],
      [ui.apiToken, "apiToken", (value) => value.trim()],
      [ui.minPurchaseOrderNo, "minPurchaseOrderNo", (value) => value.trim()],
      [ui.interval, "intervalMinutes", (value) => int(value, 10, 1, 1440)],
      [ui.batch, "batchSize", (value) => int(value, 30, 1, 200)],
    ];
    for (const [input, name, normalize] of textBindings) {
      input.addEventListener(
        "input",
        debounce(() => saveField(name, normalize(String(input.value)))),
      );
    }
    ui.dryRun.addEventListener("change", () =>
      saveConfig({ dryRun: ui.dryRun.checked }),
    );
    ui.auto.addEventListener("change", () => {
      saveConfig({ autoEnabled: ui.auto.checked });
      if (config.autoEnabled) {
        log("自动模式已开启");
        schedule(1500);
      } else {
        clearTimeout(timer);
        status("自动模式已关闭");
        log("自动模式已关闭");
      }
    });
  };
  const minimize = (value = host.dataset.minimized !== "true") => {
    host.dataset.minimized = String(value);
    ui.minimize.textContent = value ? "□" : "—";
    saveConfig({ minimized: value });
  };
  const drag = (handle) => {
    let active = false;
    let startX;
    let startY;
    let startRight;
    let startBottom;
    handle.addEventListener("pointerdown", (event) => {
      if (event.target.closest("button")) return;
      active = true;
      startX = event.clientX;
      startY = event.clientY;
      startRight = Number.parseFloat(host.style.right) || 20;
      startBottom = Number.parseFloat(host.style.bottom) || 20;
      handle.setPointerCapture(event.pointerId);
    });
    handle.addEventListener("pointermove", (event) => {
      if (!active) return;
      host.style.right = `${Math.max(0, startRight - event.clientX + startX)}px`;
      host.style.bottom = `${Math.max(0, startBottom - event.clientY + startY)}px`;
    });
    handle.addEventListener("pointerup", (event) => {
      if (!active) return;
      active = false;
      handle.releasePointerCapture(event.pointerId);
      saveConfig({
        panelRight: Number.parseFloat(host.style.right),
        panelBottom: Number.parseFloat(host.style.bottom),
      });
    });
  };
  const createPanel = () => {
    host = document.createElement("div");
    host.id = "huaxing-tracking-sync-userscript";
    host.style.cssText = `position:fixed;z-index:2147483647;right:${Number(config.panelRight) || 20}px;bottom:${Number(config.panelBottom) || 20}px`;
    const shadow = host.attachShadow({ mode: "open" });
    shadow.innerHTML = `
<style>
:host{all:initial;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI","Microsoft YaHei",sans-serif;color:#1f2937}*{box-sizing:border-box}.panel{width:380px;overflow:hidden;border:1px solid #cbd5e1;border-radius:8px;background:#fff;box-shadow:0 18px 45px #0f172a38}.head{display:flex;align-items:center;gap:8px;padding:9px 10px 9px 14px;color:#fff;background:#176b5b;cursor:move;user-select:none}.title{flex:1;font-size:14px;font-weight:700}.status{max-width:170px;overflow:hidden;padding:3px 8px;border-radius:4px;background:#ffffff2e;font-size:11px;text-overflow:ellipsis;white-space:nowrap}.status[data-kind=success]{background:#10b98155}.status[data-kind=warn]{background:#f59e0b66}.status[data-kind=error]{background:#ef444466}.mini{width:28px;height:28px;border:0;border-radius:4px;color:#fff;background:#ffffff22;cursor:pointer}.body{padding:12px}:host([data-minimized=true]) .body{display:none}:host([data-minimized=true]) .panel{width:260px}.toolbar{display:flex;align-items:center;gap:9px}.run,.save{height:34px;border-radius:4px;padding:0 14px;font-weight:650;cursor:pointer}.run{border:0;color:#fff;background:#176b5b}.save{border:1px solid #cbd5e1;color:#334155;background:#fff}.switch{display:flex;align-items:center;gap:6px;margin-left:auto;font-size:12px;color:#475569}.switch input,.check input{accent-color:#176b5b}.stats{margin:10px 0;padding:8px 10px;border-radius:4px;color:#475569;background:#f1f5f9;font-size:12px}details{border:1px solid #e2e8f0;border-radius:4px}summary{padding:9px 10px;font-size:12px;font-weight:650;cursor:pointer}.settings{display:grid;grid-template-columns:1fr 1fr;gap:9px;padding:0 10px 10px}label{display:grid;gap:4px;color:#64748b;font-size:11px}input[type=text],input[type=number]{width:100%;height:31px;border:1px solid #cbd5e1;border-radius:4px;padding:0 8px}.full{grid-column:1/-1}.check{display:flex;align-items:center;gap:6px}.logs{height:170px;margin-top:10px;overflow:auto;border-radius:4px;padding:8px;color:#cbd5e1;background:#20252b;font:11px/1.55 Consolas,"Microsoft YaHei",monospace}.logs div{margin-bottom:2px;overflow-wrap:anywhere}.logs .success{color:#6ee7b7}.logs .warn{color:#fcd34d}.logs .error{color:#fca5a5}button:disabled{opacity:.55;cursor:wait}
</style>
<section class="panel"><header class="head"><div class="title">华友新物资系统同步</div><div class="status">待机</div><button class="mini" title="最小化">—</button></header><div class="body"><div class="toolbar"><button class="run">同步一次</button><label class="switch"><input class="auto" type="checkbox">自动模式</label></div><div class="stats">申购单 0 · 追溯号命中 0 · 更新 0 · 跳过 0 · 失败 0</div><details><summary>连接与同步设置</summary><div class="settings"><label>物资平台账号<input class="platform-user" type="text"></label><label>物资平台密码<input class="platform-pass" type="text" autocomplete="off"></label><label>接口令牌<input class="api-token" type="text" autocomplete="off" placeholder="管理端 API Token"></label><label>自动间隔<input class="interval" type="number" min="1" max="1440"></label><label>单次申购单数<input class="batch" type="number" min="1" max="200"></label><label>申购单号起始<input class="min-po-no" type="text" placeholder="如 P05SG0300"></label><label class="check full"><input class="dry-run" type="checkbox">演练模式</label><button class="save full">保存设置</button></div></details><div class="logs"></div></div></section>`;
    document.documentElement.append(host);
    ui = {
      status: shadow.querySelector(".status"),
      minimize: shadow.querySelector(".mini"),
      run: shadow.querySelector(".run"),
      auto: shadow.querySelector(".auto"),
      stats: shadow.querySelector(".stats"),
      logs: shadow.querySelector(".logs"),
      platformUsername: shadow.querySelector(".platform-user"),
      platformPassword: shadow.querySelector(".platform-pass"),
      apiToken: shadow.querySelector(".api-token"),
      interval: shadow.querySelector(".interval"),
      batch: shadow.querySelector(".batch"),
      minPurchaseOrderNo: shadow.querySelector(".min-po-no"),
      dryRun: shadow.querySelector(".dry-run"),
      save: shadow.querySelector(".save"),
    };
    fillForm();
    bindAutosave();
    minimize(Boolean(config.minimized));
    drag(shadow.querySelector(".head"));
    ui.minimize.addEventListener("click", () => minimize());
    ui.run.addEventListener("click", () => run());
    ui.save.addEventListener("click", () => {
      saveConfig(formConfig());
      fillForm();
      log("设置已保存", "success");
      if (config.autoEnabled) schedule(1500);
      else {
        clearTimeout(timer);
        status("待机");
      }
    });
    renderStats();
    if (config.autoEnabled) schedule(3000);
  };

  GM_registerMenuCommand("华兴物料跟踪：同步一次", () => run());
  GM_registerMenuCommand("华兴物料跟踪：切换自动模式", () => {
    saveConfig({ autoEnabled: !config.autoEnabled });
    if (ui) ui.auto.checked = config.autoEnabled;
    if (config.autoEnabled) schedule(1000);
    else clearTimeout(timer);
    log(`自动模式已${config.autoEnabled ? "开启" : "关闭"}`);
  });

  createPanel();
})();
