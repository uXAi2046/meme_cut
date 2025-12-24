# 迁移项目包管理器至 pnpm

## 目标
将当前项目的依赖管理工具从 `npm` 迁移到 `pnpm`，以节省磁盘空间并提升安装速度。

## 实施步骤
1.  **清理旧依赖**
    - 删除 `node_modules` 目录（释放空间）。
    - 删除 `package-lock.json` 文件（移除 npm 锁定文件）。

2.  **安装/初始化 pnpm**
    - 确认环境支持 `pnpm`（如果未安装，将使用 npm 安装它）。
    - 运行 `pnpm install` 生成新的 `pnpm-lock.yaml` 并安装依赖。

3.  **验证环境**
    - 启动开发服务器 `pnpm dev` 确保项目运行正常。
    - 确认 `node_modules` 结构已改变（pnpm 的符号链接结构）。

## 后续建议
- 以后新项目建议直接使用 `pnpm create vite` 等命令初始化。
- 对于旧项目，可以使用 `npx npkill` 批量清理。