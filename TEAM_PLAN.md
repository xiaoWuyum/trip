# 三人协作分工与任务清单（纯前端版）

> 目标：交付一个可演示的“易宿酒店预订平台”，覆盖 **C 端预订闭环** 与 **B 端录入/审核闭环**。
> 当前范围：**仅前端开发**，不部署后端/数据库；数据统一使用 **本地 Mock（内存 / localStorage）**。
> 参考文档：见 [PRD.md](./PRD.md) 与 [README.md](./README.md)

## 团队角色与责任范围（1 Web + 2 Mobile）

### 开发者A（Web：PC 管理端 - 商户/管理员）
- 负责 `client-admin`：登录/注册、布局与路由守卫、商户录入/编辑/上下架、管理员审核/上下架。
- 负责管理端本地 Mock 数据服务与演示账号（商户/管理员）。

### 开发者B（Mobile-1：列表与性能）
- 负责 `client-mobile`：首页搜索区、酒店列表页（虚拟滚动/分页/筛选/懒加载/骨架屏）。
- 负责与 Web 端对齐“酒店数据结构”，确保移动端能实时读取同一份本地数据源。

### 开发者C（Mobile-2：详情与下单闭环）
- 负责 `client-mobile`：酒店详情页（相册/设施/房型/价格）、下单页（入住人/手机号/总价）、订单页（多状态）。
- 负责支付模拟与订单状态流转（`pending -> paid -> completed/cancelled`）。

---

## 分支与协作规范

- 分支命名：`feature/<module>-<brief>`
  - Web：`feature/admin-auth`、`feature/admin-hotel-form`
  - Mobile：`feature/mobile-list-virtual`、`feature/mobile-booking-flow`
- 提交信息：Conventional Commits
  - `feat(admin): add hotel audit modal`
  - `fix(mobile): fix virtual list item height`
- PR 流程：每个 PR 至少 1 人 Review；合并策略建议 Squash。

---

## 数据约定（纯前端 Mock 统一口径）

> 目标：Web 端录入/审核的酒店数据，移动端能立即看到并完成预订闭环。

- 数据存储：
  - Web（浏览器）：`localStorage`
  - Mobile（小程序）：Taro Storage
  - Mobile（H5）：浏览器 `localStorage`（可用于与 Web 端联动演示）
  - Mobile（APP/RN）：Metro `8081`（与存储无关，存储由 RN 环境决定）
  - 建议 key：`easystay_users`、`easystay_hotels`、`easystay_orders`
- 用户角色：`merchant`、`admin`、`user`（移动端默认 `user`）。
- 酒店状态：`pending`、`active`、`rejected`、`offline`（下线可恢复，不删除）。
- 审核驳回原因：写入 `auditRemark`。

---

## 每人任务要求与验收标准

### 开发者A（Web：PC 管理端）

**任务要求**
- 登录/注册：注册可选择角色；登录后按角色自动跳转；登录态持久化。
- 权限视图隔离：基于角色动态菜单；路由守卫（未登录跳登录，越权回首页或 403）。
- 商户端：
  - 我的酒店列表：状态展示、上下线、编辑入口、驳回原因可见。
  - 酒店录入/编辑：表单校验完整；提交后状态为 `pending`。
- 管理员端：
  - 审核列表：只展示 `pending`；通过/驳回（驳回原因必填）。
  - 酒店管理：强制下线与恢复上线。
- 本地 Mock 数据：管理端所有操作写入 `localStorage`，供移动端读取。

**验收标准**
- 页面无阻塞报错：无构建错误、无控制台红字。
- 状态流转正确：`pending -> active/rejected`、`active <-> offline`，驳回必须有 `auditRemark`。
- 数据可联动（演示建议）：移动端使用 H5 构建时，可与 Web 端共享浏览器存储，刷新即可看到变更。

**交付物**
- `client-admin/README.md`：启动方式、演示账号、演示路径与验收点。

---

### 开发者B（Mobile-1：列表与性能）

**任务要求**
- 首页搜索区：城市/关键字/日期/快捷筛选入口，能跳转列表并携带筛选条件。
- 酒店列表页（性能重点）：
  - 虚拟滚动（100+ 数据流畅）。
  - 分页加载（触底加载下一页）。
  - 图片懒加载。
  - Skeleton/空态/异常态。
- 数据来源：读取 `localStorage` 的酒店数据（只展示 `active` 且未下线）。

**验收标准**
- 100+ 数据不卡顿（可录屏证明）。
- 筛选/搜索有效：关键字/城市/价格区间至少命中一项。
- 视觉与交互完整：加载/空态/失败提示齐全。

**交付物**
- `client-mobile/README.md`：启动方式、页面入口、列表性能验收方法。

---

### 开发者C（Mobile-2：详情与下单闭环）

**任务要求**
- 酒店详情页：相册、基础信息、设施、房型列表（展示价格）。
- 下单页：填写入住人/手机号、计算总价、提交订单。
- 支付模拟：确认弹窗后状态置为 `paid`。
- 我的订单：Tab 多状态（全部/待支付/已支付/已取消/已完成），支持查看订单详情。

**验收标准**
- 闭环可演示：列表 -> 详情 -> 下单 -> 支付模拟 -> 订单状态变化。
- 数据一致：订单写入 `localStorage`，刷新不丢。
- 异常态处理：库存不足/缺少字段/空列表有提示（演示级即可）。

**交付物**
- `client-mobile/README.md` 补充：下单/订单演示流程与验收点。

---

## 小组统一验收（所有人共同负责）

- 仓库可一键启动：根目录脚本能分别启动 Web 与 Mobile，并在 README 写清楚。
- 数据口径一致：酒店/房型/订单字段定义一致，避免端间读取失败。
- 端到端演示脚本：3 分钟内演示“商户提交酒店 → 管理员审核通过 → 移动端可见并下单”。
- 代码质量：无阻塞 ESLint/构建错误；不提交敏感信息。
