# 酒店管理后台 (PC端) 开发设计方案

基于您的需求与 PRD 文档，针对 **酒店管理系统 (PC 站点)** 的详细设计方案如下。本项目将采用 **React + Ant Design 5** 构建。

当前实现以 **纯前端演示** 为目标：不依赖后端服务，酒店/审核/上下架等数据通过 `localStorage` 模拟。

## 1. 核心功能模块 (Features)

### 1.1 用户认证 (Auth)
- **注册页 (`/register`)**:
  - 用户填写账号密码。
  - **角色选择**: 提供 "商户 (Merchant)" 与 "管理员 (Admin)" 选项 (Radio Group)。
- **登录页 (`/login`)**:
  - 仅需账号密码。
  - **智能跳转**: 登录成功后，根据后端返回的 `role` 字段，自动跳转到对应角色的首页 (商户 -> `/merchant/hotels`, 管理员 -> `/admin/audit`)。

### 1.2 酒店录入与管理 (Merchant Portal)
- **我的酒店列表 (`/merchant/hotels`)**:
  - 展示商户名下的所有酒店。
  - 状态标签: 🟢 已发布 (Active), 🟠 审核中 (Pending), 🔴 已驳回 (Rejected), ⚫ 已下线 (Offline)。
  - 操作: [编辑], [查看原因] (若被驳回), [下线/上线]。
- **发布/编辑酒店 (`/merchant/hotels/edit/:id?`)**:
  - 采用 **分步表单 (StepForm)** 提升体验:
    1.  **基本信息**: 名称、城市、地址、星级、联系电话。
    2.  **详细信息**: 简介、设施服务 (WiFi, 停车等)、标签。
    3.  **图片管理**: 酒店封面图、轮播图上传 (Upload Dragger)。
    4.  **房型设置**: 动态添加房型 (标准间/大床房)，设置 **基准价格** 与 **库存**。
  - **数据同步**: 保存后写入本地 Mock 数据源（`localStorage`），移动端刷新即可见。

### 1.3 审核与监管 (Admin Portal)
- **审核列表 (`/admin/audit`)**:
  - 筛选: 仅展示状态为 `pending` 的待审核条目。
  - **审核操作**:
    - ✅ **通过**: 状态更为 `active`，C端即可检索。
    - ❌ **驳回**: 弹出 Modal，**必填驳回原因**，状态更为 `rejected`。
- **酒店综合管理 (`/admin/hotels`)**:
  - 全局酒店列表，可进行 **强制下线 (Offline)** 操作。
  - **恢复机制**: 下线并非删除数据，可随时点击 [恢复上线] 重新变为 `active`。

---

## 2. 路由设计 (Route Architecture)

```javascript
/ (Root)
├── /login              // 登录页 (Public)
├── /register           // 注册页 (Public)
├── /                   // 主布局 (MainLayout) - 需鉴权 (AuthGuard)
│   ├── /merchant       // 商户路由组 (Role: merchant)
│   │   ├── /hotels     // 酒店列表 (首页)
│   │   ├── /create     // 发布新酒店
│   │   └── /edit/:id   // 编辑酒店
│   └── /admin          // 管理员路由组 (Role: admin)
│       ├── /audit      // 审核列表 (首页)
│       └── /hotels     // 综合管理 (上下架)
└── * (404)
```

## 3. 技术实现细节

### 3.1 状态与权限控制
- 使用 Context API 或全局 Store 存储 `userInfo` (含 `role`)。
- **路由守卫 (`<AuthGuard />`)**:
  - 未登录 -> 重定向至 `/login`。
  - 已登录但权限不足 (如商户访问管理员页面) -> 重定向至 `/403` 或对应首页。

### 3.2 UI 组件选型 (Ant Design 5)
- **布局**: `Layout`, `Menu` (侧边栏动态渲染)。
- **表单**: `ProForm` (高级表单) 或 `Steps` + `Form`。
- **列表**: `ProTable` (高级表格) - 内置搜索、分页、工具栏，非常适合后台管理。
- **反馈**: `message` (全局提示), `Modal` (审核驳回弹窗)。

### 3.3 数据交互
- 纯前端模式下，数据服务以本地函数/Mock 模块实现（读写 `localStorage`）。

## 4. 开发任务拆解 (Task List)

1.  **环境搭建**: 初始化 React + Vite + AntD + React Router。
2.  **认证模块**: 完成登录/注册页面与 API 对接。
3.  **布局开发**: 实现包含侧边栏的响应式布局与路由守卫。
4.  **商户功能**:
    - 实现酒店录入表单 (核心难点: 图片上传与动态房型)。
    - 实现酒店列表与状态展示。
5.  **管理员功能**:
    - 实现审核列表与驳回交互。
    - 实现上下架状态流转。
6.  **联调与优化**: 确保前后端状态同步，处理 Loading 与 Error 状态。

## 5. 已完成的代码结构

```
src/
├── layouts/MainLayout.tsx     // 主布局 (AntD Layout + Menu)
├── components/AuthGuard.tsx   // 路由守卫
├── stores/auth.ts             // Zustand 全局状态 (user/token)
├── utils/request.ts           // Axios 封装 (自动 token & 401)
├── router.tsx                 // React Router v6 配置
└── main.tsx                   // 入口 (Suspense + RouterProvider)
```

下一步：编写 **登录/注册页** (`Login.tsx` & `Register.tsx`) 与对应的 API 调用。
