# 三人协作分工与任务清单

> 目标：交付一个可演示的“易宿酒店预订平台”，覆盖 C端预订闭环与 B端录入/审核。
> 参考文档：PRD 与技术方案见 [PRD.md](./PRD.md) 与 [README.md](./README.md)

## 团队角色与责任范围
- 开发者A（后端与权限/数据）
  - 负责 `server` 的架构、鉴权、数据模型与所有 REST API。
  - 把控 RBAC 与数据一致性，提供联调 Mock/Seed 数据。
- 开发者B（PC 管理端 - 商户/管理员）
  - 负责 `client-admin` 的页面、路由、表单与审核工作流实现。
  - 对接后端 API，保证录入→审核→上下架全链路。
- 开发者C（移动端 - C端用户）
  - 负责 `client-mobile` 的首页/列表/详情/下单闭环与性能优化。
  - 实现虚拟滚动、图片懒加载与 useSWR 轮询刷新。

## 分支与协作规范
- 分支命名：`feature/<module>-<brief>` 如 `feature/server-auth`、`feature/admin-hotel-form`、`feature/mobile-list-virtual`
- 提交信息：Conventional Commits
  - `feat(server): add JWT login endpoint`
  - `fix(mobile): correct virtual list item height`
- PR 流程：
  - 每个 PR 至少 1 人 Review，后端相关由 A 过目，前端各自互审。
  - 合并策略：Squash 合并，保持主干整洁。

## 每日计划与里程碑
- Day 1
  - A：搭建 Express 项目、环境变量、Mongo 连接；实现 `POST /auth/register`、`POST /auth/login`；中间件 `auth`。
  - B：创建 Vite + AntD 项目框架；登录/注册页与路由守卫雏形；布局框架。
  - C：Taro 项目骨架；首页搜索区 UI（定位/关键字/日期/标签）；路由与页面占位。
- Day 2
  - A：建模 `User/Hotel/RoomType/Order`；实现 `GET /hotels` 分页与筛选；填充 Seed 数据。
  - B：酒店录入 StepForm（基础/详情/图片/提交），调用 `POST /hotels`。
  - C：列表页卡片与筛选栏，接入 `GET /hotels`；实现懒加载图片。
- Day 3
  - A：`GET /hotels/:id` 详情含房型；`POST /orders` 创建订单。
  - B：管理员审核列表（`pending`）；`PATCH /hotels/:id/status`（通过/驳回）。
  - C：详情页相册与房型；下单页（信息填写+总价计算）；预订按钮联调。
- Day 4
  - A：RBAC 完善、商户订单视图 `GET /orders/merchant`；错误处理与日志。
  - B：上下架管理（软删除状态）；商户订单列表与筛选。
  - C：列表页虚拟滚动（仅渲染可视区域）；useSWR 轮询价格刷新。
- Day 5
  - A：接口稳定性与数据校验；库存（可选）与并发保护。
  - B：表单校验与交互细节；审核原因必填与提示；空态与异常态。
  - C：订单页状态页（待支付/已完成/已取消）；二维码占位。
- Day 6
  - 全员：联调、修复 bug、补齐文档与演示脚本；自查评分表全通过。

## 模块任务清单（带验收标准）
- Server（负责人：A）
  - 鉴权：`/auth/register`、`/auth/login`（返回 JWT + userInfo）；`authMiddleware` 生效。
  - 数据模型：`User/Hotel/RoomType/Order` 与索引（城市、地理位置、状态）。
  - 酒店：列表分页与筛选（城市/价格/星级）、详情含房型；审核与上下架。
  - 订单：创建订单、用户订单 `GET /orders/my`、商户订单 `GET /orders/merchant`。
  - 验收：接口均返回 2xx；错误码与消息规范；含最少 30 条酒店的 Seed。
- Admin（负责人：B）
  - 登录/注册与路由守卫（基于 Token.role 动态菜单）。
  - 酒店录入 StepForm、图片上传（先用本地或占位）、提交即 `pending`。
  - 审核列表与操作（通过→`active`；驳回需填写原因→`rejected`）。
  - 上下架管理与商户订单列表。
  - 验收：表单校验完整；操作后 UI 与后端状态一致；无 Console 红字。
- Mobile（负责人：C）
  - 首页搜索区（定位/关键字/日历/标签）与跳转列表。
  - 列表页虚拟滚动（100+ 数据流畅）、触底分页、图片懒加载。
  - 详情页相册、房型展示、价格展示；下单页与订单流转（支付模拟）。
  - 验收：帧率稳定；搜索→列表→详情→下单闭环；异常态提示。

## 接口契约对齐
- 统一 `application/json`；列表返回 `{data: [], total, page, pageSize}`。
- 错误返回 `{errorCode, message}`；鉴权失败 `401`；越权 `403`。
- 详见 [PRD.md](./PRD.md) 第 6 节接口表。

## 风险与依赖管理
- 移动端依赖冲突：安装使用 `npm install --legacy-peer-deps`。
- 地理位置与图片：初期使用占位与 mock，避免阻塞主流程。
- 接口稳定：以 Swagger/接口约定文档为准，联调前冻结路径与字段。

