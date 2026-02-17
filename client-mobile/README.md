# 易宿移动端（Mobile / Taro）

本目录为 **C 端移动端（微信小程序 / H5）**，当前以 **纯前端演示** 为目标：不依赖后端服务，数据通过 `localStorage` / 本地 Mock 读取。

## 启动（微信小程序）

```bash
cd client-mobile
npm run dev:weapp
```

然后使用微信开发者工具导入项目（`client-mobile/dist`）。

## 启动（H5）

```bash
cd client-mobile
npm run dev:h5
```

H5 默认地址：`http://127.0.0.1:10086/`（端口在 `client-mobile/config/index.js` 里可改）。

## APP 端（React Native）

本项目支持通过 Taro 编译到 RN（iOS/Android），用于“APP 端”演示。

- Metro 服务端口：默认 `8081`
- 运行命令（仅生成 RN bundle，需本机具备 RN 原生环境/Xcode/Android Studio）：

```bash
cd client-mobile
npm run dev:rn:ios
# 或
npm run dev:rn:android
```

说明：RN 端的原生工程（`ios/`、`android/`）不在本仓库内自动生成；如需真机/模拟器运行，需要按 Taro RN 文档创建/集成原生工程。

## 数据联动说明

- 管理端（`client-admin`）录入/审核/上下架的酒店数据会写入浏览器 `localStorage`。
- 移动端在 **H5 构建** 场景下可读取同一份浏览器存储用于联动演示；在小程序端使用 Taro Storage（存储环境不同）。

## 验收点（移动端）

- 首页 → 列表 → 详情 → 下单 → 支付模拟 → 订单状态变化。
- 列表页支持 100+ 数据的流畅滚动（虚拟列表）。
