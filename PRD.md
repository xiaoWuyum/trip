# 易宿酒店预订平台 - 产品需求文档 (PRD) 
## 1. 项目概述 (Overview)

**易宿酒店预订平台 (EasyStay)** 旨在打造一个高性能、全流程的酒店服务生态。项目采用**Monorepo**架构，前端覆盖移动端（C端用户）与PC管理端（B端商户/管理员），后端基于Node.js构建RESTful API。

**当前交付范围说明（重要）**：
*   本仓库以 **纯前端开发/演示** 为主，不部署后端与数据库。
*   所有数据通过 **本地 Mock（内存 / localStorage / JSON）** 模拟，保证业务流程可演示、可验收。
*   “接口/鉴权”以**前端数据服务**的方式实现：模拟 Token、角色与状态流转。

**核心价值**：
*   **工程化实践**：展示前后端分离、组件复用、权限控制等完整工程能力。
*   **性能极致**：针对长列表渲染、图片懒加载、数据实时性进行深度优化。
*   **用户体验**：提供流畅的移动端交互与高效的B端管理工作流。

---

## 2. 用户角色 (User Roles)

| 角色 | 标识 (Role Key) | 权限描述 | 适用端 |
| :--- | :--- | :--- | :--- |
| **普通用户** | `user` | 浏览酒店、搜索筛选、下单预订、查看订单、个人中心。 | 移动端 (C-Side) |
| **酒店商户** | `merchant` | 注册/登录、录入酒店信息、管理房型/价格、查看订单报表。 | PC管理端 (B-Side) |
| **平台管理员** | `admin` | 全局监管、审核商户入驻/酒店上架、处理违规、系统配置。 | PC管理端 (B-Side) |

---

## 3. 功能需求详细说明 (Functional Requirements)

### 3.1 移动端 - C端用户 (React + Taro)

#### 3.1.1 首页 (Home)
*   **顶部 Banner**: 轮播图展示热门活动/酒店（支持点击跳转）。
*   **核心搜索区 (Search Box)**:
    *   **地理位置**: 自动获取当前定位 (City)，支持手动切换城市。
    *   **日期选择**: 集成日历控件，选择入住/离店日期，自动显示“共X晚”。
    *   **关键字**: 输入框支持酒店名、商圈、地标模糊搜索。
    *   **快捷筛选**: “我的附近”、“高档型”、“免费取消”等Tag标签。
*   **推荐列表**: 基于算法或简单的“猜你喜欢”展示推荐酒店。

#### 3.1.2 酒店列表页 (Hotel List) - **性能核心点**
*   **顶部筛选栏**: 吸顶展示，支持多维度筛选（价格区间、星级、设施）。
*   **列表渲染**:
    *   展示酒店卡片（缩略图、名称、评分、最低价、位置距离）。
    *   **核心技术**: 必须实现**虚拟滚动 (Virtual Scroll)**，仅渲染可视区域节点，解决长列表卡顿问题。
    *   **分页加载**: 触底触发 `onReachBottom` 加载下一页数据。
*   **状态反馈**: 加载中 Skeleton 骨架屏、无数据空状态、网络异常提示。

#### 3.1.3 酒店详情页 (Hotel Detail)
*   **相册展示**: 顶部 Swiper 图片轮播，支持点击预览大图。
*   **基础信息**: 酒店名称、星级、地址（支持调起地图导航）、设施图标（WiFi、停车、泳池）。
*   **房型列表**:
    *   展示该酒店下所有房型（标准间、大床房等）。
    *   每个房型展示：封面图、床型信息、早餐情况、**当前日期价格**。
    *   预订按钮：点击进入下单页。

#### 3.1.4 订单流程 (Booking & Order)
*   **下单页**:
    *   展示入住信息（日期、房型、总价）。
    *   填写入住人姓名、手机号。
    *   **提交订单**: 调用后端API生成订单。
*   **支付模拟**: 简单的支付确认弹窗，点击“确认支付”后更新订单状态为 `paid`。
*   **我的订单**:
    *   Tab切换：全部、待支付、待入住、已完成、已取消。
    *   订单详情：查看订单号、支付金额、入住凭证（二维码/核销码）。

---

### 3.2 PC端 - B端管理后台 (React + Ant Design)

#### 3.2.1 认证与权限 (Auth)
*   **登录/注册**:
    *   注册时选择角色（商户/管理员）。
    *   登录后根据 JWT Token 中的 `role` 字段，**动态生成路由菜单**。
    *   **商户视图**: 仅可见“我的酒店”、“订单管理”。
    *   **管理员视图**: 仅可见“酒店审核”、“用户管理”。

#### 3.2.2 酒店管理 (Merchant)
*   **酒店录入/编辑**:
    *   多步骤表单 (StepForm): 基础信息 -> 详细介绍 -> 图片上传 -> 提交审核。
    *   **图片上传**: 对接阿里云OSS或本地文件服务，支持拖拽上传。
    *   **房型管理**: 为酒店添加房型，设置基准价格。
*   **订单查看**: 列表展示该商户下的所有订单，支持按日期/状态筛选。

#### 3.2.3 平台审核 (Admin)
*   **审核列表**: 展示状态为 `pending` (待审核) 的酒店申请。
*   **审核操作**:
    *   **通过**: 状态更为 `active`，C端即可搜索到。
    *   **驳回**: 填写驳回原因，状态更为 `rejected`，商户可见原因并重新编辑。
*   **上下架管理**: 管理员有权强制下架违规酒店。

---

## 4. 非功能性需求 (Non-Functional Requirements)

### 4.1 性能要求
*   **首屏加载**: 移动端首屏时间 (FCP) < 1.5秒。
*   **滚动流畅度**: 列表页滑动帧率稳定在 50FPS 以上（依赖虚拟列表）。
*   **图片优化**: 所有列表图片开启懒加载 (Lazy Load)，非可视区域不加载。

### 4.2 安全性
*   **身份认证（纯前端模拟）**: 使用本地 Token + `role` 字段模拟鉴权与登录态。
*   **数据安全（演示级）**: 演示账号可使用固定密码；不在仓库中提交任何真实凭证。
*   **权限控制（前端视图隔离）**: 路由与菜单必须根据 `role` 控制可见范围，阻止越权进入页面。

### 4.3 数据一致性
*   **价格同步**: 商户修改价格后，C端需在短时间内（或刷新后）看到最新价格。
*   **库存扣减**: (进阶) 下单时需校验库存，防止超卖。

---

## 5. 数据模型设计 (Database Schema)

> 说明：纯前端模式下，以下数据模型以 `localStorage` 或内存对象保存，用于演示业务闭环。

### 5.1 User (用户)
```javascript
{
  _id: ObjectId,
  username: String,
  password: String (Hashed),
  role: StringEnum ['user', 'merchant', 'admin'],
  avatar: String,
  createdAt: Date
}
```

### 5.2 Hotel (酒店)
```javascript
{
  _id: ObjectId,
  merchantId: ObjectId (Ref User),
  name: String,
  city: String, // 用于搜索
  address: String,
  location: { type: 'Point', coordinates: [lng, lat] }, // GeoJSON
  star: Number (1-5),
  basePrice: Number, // 起示价
  tags: [String],
  images: [String], // 图片URL数组
  status: StringEnum ['pending', 'active', 'rejected', 'offline'],
  auditRemark: String, // 审核/驳回备注
  createdAt: Date
}
```

### 5.3 RoomType (房型)
```javascript
{
  _id: ObjectId,
  hotelId: ObjectId (Ref Hotel),
  name: String, // 如 "豪华大床房"
  area: Number, // 面积
  bedType: String,
  price: Number, // 当前基准价
  stock: Number, // 每日库存
  facilities: [String] // ["含早", "有窗"]
}
```

### 5.4 Order (订单)
```javascript
{
  _id: ObjectId,
  userId: ObjectId (Ref User),
  hotelId: ObjectId (Ref Hotel),
  roomTypeId: ObjectId (Ref RoomType),
  checkInDate: Date,
  checkOutDate: Date,
  totalPrice: Number,
  guestName: String,
  guestPhone: String,
  status: StringEnum ['pending', 'paid', 'cancelled', 'completed'],
  createdAt: Date
}
```

---

## 6. 接口设计 (API Endpoints)

纯前端模式下不对外提供真实 HTTP API，统一以“前端数据服务”实现，可按以下契约模拟（函数名或 mock 路径均可）：

| 模块 | 名称 | 描述 | 权限 |
| :--- | :--- | :--- | :--- |
| Auth | `login(username, password)` | 登录（返回 `token` + `user`） | Public |
| Auth | `register(username, password, role)` | 注册（演示可直接登录） | Public |
| Hotel | `getHotels(query)` | 酒店列表查询（分页/筛选/搜索） | Public |
| Hotel | `getHotelById(id)` | 酒店详情（含房型） | Public |
| Hotel | `getMyHotels(merchantId)` | 商户“我的酒店”列表 | Merchant |
| Hotel | `createHotel(payload)` | 创建酒店（初始 `pending`） | Merchant |
| Hotel | `updateHotel(id, payload)` | 编辑酒店信息 | Merchant |
| Hotel | `auditHotel(id, status, auditRemark)` | 审核通过/驳回 | Admin |
| Hotel | `toggleHotelOnline(id)` | 上下线（可恢复，不删除） | Admin/Merchant |
| Order | `createOrder(payload)` | 创建订单（演示支付模拟） | User |
| Order | `getMyOrders(userId)` | 用户订单列表 | User |

---

## 7. 评分与交付自查表 (Checklist)

在提交前，请务必确认以下功能点已完成：

### 7.1 核心功能 (60%)
- [ ] **闭环流程**: 注册登录 -> (商户)录入酒店 -> (管理员)审核通过 -> (用户)搜索并预订 -> 订单生成。
- [ ] **权限隔离**: 确保商户无法审核，普通用户无法进入管理后台。
- [ ] **状态流转**: 酒店状态 (`pending`->`active`) 和 订单状态 (`pending`->`paid`) 逻辑正确。

### 7.2 技术亮点 (20%)
- [ ] **虚拟滚动**: 移动端列表页在 100+ 条数据时滑动不卡顿。
- [ ] **响应式/适配**: 移动端布局适配不同机型，PC端后台布局合理。
- [ ] **Hooks封装**: 使用 `useRequest` 或自定义 Hooks 处理数据请求逻辑。

### 7.3 代码质量 (20%)
- [ ] **目录规范**: 清晰的 Monorepo 结构。
- [ ] **代码风格**: 无 ESLint 报错，变量命名规范。
- [ ] **文档完整**: README 包含启动步骤、技术栈说明。
