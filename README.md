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

## 在线更新(重要)

应用内置了自动更新功能,更新包从 GitHub Releases 下载。

### 发布新版本(打 tag)

```bash
git add .
git commit -m "xxx"
git push
git tag v1.1.0        # 版本号必须高于当前版本
git push origin v1.1.0
```

> ⚠️ **首次发布前必须配置签名密钥**(见下),否则 Actions 会构建失败。

### 配置签名密钥(GitHub Actions Secrets)

更新包需要签名验证,私钥存在 GitHub Secrets 里:

1. 打开仓库 → **Settings → Secrets and variables → Actions → New repository secret**
2. 添加两个 Secret:

| Secret 名称 | 值 |
|---|---|
| `TAURI_SIGNING_PRIVATE_KEY` | 私钥内容(见本地 `.tauri/updater.key` 文件) |
| `TAURI_SIGNING_PRIVATE_KEY_PASSWORD` | 私钥密码(本仓库生成时未设密码,留空即可,可不加此 Secret) |

3. 本地私钥文件路径:`.tauri/updater.key`(已被 .gitignore 忽略,不会上传)

> 🔒 **私钥等于应用的"身份证"**:一旦丢失或泄露,旧版本将无法收到更新。请妥善备份 `.tauri/updater.key` 文件。

### 应用内更新行为

- 设置面板 → 版本与更新 → **检查更新** 按钮(手动触发)
- 应用启动 3 秒后自动检查一次
- 发现新版本时提示下载并安装,完成后重启生效

## 开源协议

[MIT License](LICENSE)

## 致谢

原始项目: [ZihangDong/toolknit-desktop](https://github.com/ZihangDong/toolknit-desktop)(MIT License)
