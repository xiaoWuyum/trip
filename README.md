# 🏨 易宿酒店预订平台 (EasyStay)

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Taro](https://img.shields.io/badge/Taro-3.x-blue)](https://taro.jd.com/)
[![React](https://img.shields.io/badge/React-18-blue)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-LTS-green)](https://nodejs.org/)

> 一个集“C端用户预订”与“B端商户/管理后台”为一体的综合性酒店服务平台。
> 本项目采用 Monorepo 架构，注重用户体验、数据实时性及高并发场景下的列表渲染性能。

---

## 📚 项目导航

- [产品需求文档 (PRD)](./PRD.md)
- [移动端 (C-Side) 说明](./client-mobile/README.md)
- [管理端 (B-Side) 说明](./client-admin/README.md)
- [后端服务 (Server) 说明](./server/README.md)

---

## ✨ 核心特性

### 📱 移动端 (用户端)
- **多端适配**: 基于 Taro 实现微信小程序与 H5 一套代码多端运行。
- **极致性能**: 针对长列表实现**虚拟滚动 (Virtual Scroll)**，确保滑动流畅不卡顿。
- **智能搜索**: 支持地理定位、关键字模糊搜索及多维度筛选。
- **实时预订**: 完整的下单流程，模拟支付与订单状态流转。

### 🖥️ 管理端 (商户/管理员)
- **角色权限控制 (RBAC)**:
    - **商户**: 酒店录入、房型管理、订单查看。
    - **管理员**: 资质审核、违规下架、全局用户管理。
- **高效工作流**: 集成 Ant Design 5.0，提供强大的表单与表格交互体验。
- **数据可视化**: 直观展示订单状态与审核进度。

### 🔙 后端服务
- **RESTful API**: 基于 Express/Koa 构建的标准接口。
- **MongoDB**: 利用 GeoJSON 实现地理位置查询 (`$near`)。
- **安全鉴权**: 全站采用 JWT 无状态认证。

---

## 🛠️ 技术栈 (Tech Stack)

| 模块 | 技术选型 | 核心理由 |
| :--- | :--- | :--- |
| **Monorepo** | NPM Workspaces | 统一管理依赖，代码分层清晰 |
| **Mobile (C-Side)** | React + Taro + Taro UI | 跨端能力强，生态成熟 |
| **Admin (B-Side)** | React (Vite) + Ant Design 5 | B端标准组件库，开发效率高 |
| **Server** | Node.js + Express + MongoDB | 灵活的文档型数据库适合复杂酒店数据 |
| **Auth** | JWT (JSON Web Token) | 适合前后端分离的无状态认证 |
| **Tools** | ESLint + Prettier + Husky | 规范代码质量 |

---

## 🚀 快速开始 (Quick Start)

### 1. 环境准备
确保您的环境已安装：
- Node.js >= 16.0.0
- MongoDB (本地或远程服务)

### 2. 安装依赖
在项目根目录下运行：

```bash
# 安装所有 workspace 的依赖 (建议使用 legacy-peer-deps 避免版本冲突)
npm install --legacy-peer-deps
```

### 3. 配置环境变量
在 `server` 目录下创建 `.env` 文件：

```properties
PORT=5000
MONGO_URI=mongodb://localhost:27017/easy-stay
JWT_SECRET=your_jwt_secret_key
```

### ☁️ 云数据库（MongoDB Atlas）
- **为什么用 Atlas**：MongoDB 官方云服务，开箱即用，提供**连接字符串 (Connection String)**。团队三人统一连接同一个云库，数据实时共享与同步。
- **开通步骤**：
  - 注册 https://www.mongodb.com/atlas 并创建免费集群（Free Tier）。
  - 创建数据库用户（用户名/密码），在“Database”→“Connect”中生成连接字符串。
  - 在“Network Access”中添加允许访问的 IP（开发期可临时设置 `0.0.0.0/0`）。
- **配置示例**：将连接字符串写入 `server/.env` 的 `MONGO_URI`：

```properties
# SRV 连接示例（请替换用户名、密码、集群名、库名）
MONGO_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/easy-stay?retryWrites=true&w=majority&appName=<AppName>
```

- **团队协作说明**：
  - 统一使用同一个 Atlas 连接字符串，A 同学在管理端或后端录入数据，B/C 在各自电脑运行项目即可**实时看到同一份数据**。
  - 切记不要把 `.env` 提交到仓库（已在 `.gitignore` 中忽略）。
- **安全建议**：
  - 开发阶段可使用开放 IP，上线前务必收紧 IP 白名单。
  - 数据库用户仅授予必要权限；定期轮换密码。

### 4. 启动项目

我们提供了便捷的 NPM Scripts 来启动各个服务：

```bash
# 启动后端服务 (Port: 5000)
npm run start:server

# 启动 B端管理后台 (Port: 5173)
npm run start:admin

# 启动 C端移动端 (微信小程序模式)
npm run start:mobile
```

---

## 📂 目录结构

```plaintext
easy-stay-monorepo/
├── client-mobile/      # C端 Taro 项目
│   ├── src/
│   │   ├── components/ # 公共组件 (虚拟列表, 业务卡片)
│   │   ├── pages/      # 页面 (首页, 列表, 详情)
│   │   └── services/   # API 请求封装
├── client-admin/       # B端 React 管理后台
│   ├── src/
│   │   ├── pages/      # (登录, 酒店录入, 审核列表)
│   │   └── utils/      # 工具函数 (鉴权, 格式化)
├── server/             # Node.js 后端
│   ├── src/
│   │   ├── controllers/# 业务逻辑层
│   │   ├── models/     # 数据库模型 (Schema)
│   │   ├── routes/     # 路由定义
│   │   └── middlewares/# 中间件 (Auth, ErrorHandler)
├── PRD.md              # 详细产品需求文档
└── README.md           # 项目入口文档
```

---

## 📅 开发计划 (Timeline)

- [x] **Phase 0**: 项目初始化，Monorepo 搭建。
- [ ] **Phase 1**: 后端核心 API 开发 (Auth, Hotel CRUD)。
- [ ] **Phase 2**: B端管理后台开发 (商户录入 + 管理员审核)。
- [ ] **Phase 3**: C端移动端开发 (列表渲染优化 + 预订流程)。
- [ ] **Phase 4**: 联调与 Bug Fix，文档完善。

