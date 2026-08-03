# ToolKnit Home

基于 [ToolKnit Desktop](https://github.com/ZihangDong/toolknit-desktop) 精简的桌面应用 —— 只保留首页界面,移除了全部工具功能。

## 技术栈

- 桌面框架: [Tauri 2.x](https://tauri.app/)(Rust)
- 前端: 原生 JavaScript + [Vite](https://vitejs.dev/)
- 无任何工具功能,仅保留首页面板

## 环境要求(本地构建)

- [Node.js](https://nodejs.org/) 18+
- [Rust](https://www.rust-lang.org/) (stable)
- Windows 10+ / macOS / Linux

## 本地开发

```bash
npm install
npm run tauri dev
```

## 本地打包

```bash
npm install
npm run tauri build
```

构建完成后,安装包位于 `src-tauri/target/release/bundle/` 目录。

## GitHub Actions 自动打包

本仓库已配置 `.github/workflows/release.yml`,推送 `v*` 格式的 tag 后,GitHub 会自动在 Windows / macOS / Linux 三个平台编译打包,并把安装包发布到 Releases 页面。

## 开源协议

[MIT License](LICENSE)

## 致谢

原始项目: [ZihangDong/toolknit-desktop](https://github.com/ZihangDong/toolknit-desktop)(MIT License)
