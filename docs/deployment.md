# 设计站部署

设计站地址：https://ui.five-plus-one.com ，版本 0.3.1。

## 网关静态站点

- 1Panel 网站 ID：49，类型：static。
- 网关：114.66.58.250；站点别名：ui.five-plus-one.com。
- 网站目录：`/opt/1panel/www/sites/ui.five-plus-one.com/index`。
- 当前发布目录：`/opt/1panel/www/sites/ui.five-plus-one.com/releases/20261020-06`。
- HTTP 自动跳转 HTTPS，使用网关已有的域名证书。
- 网站使用静态资源与 hash 路由；无需 Node 常驻进程。

## 发布

在仓库根目录运行 `npm test` 与 `npm run build`，把 dist 中的文件打包，传至网关后运行 `scripts/deploy-gateway.py`。参数依次为压缩包绝对路径和唯一发布编号。

脚本通过网关本地 1Panel API 注册和配置网站，凭据留在网关。资源解压到独立发布目录，检查入口文件后原子切换 index 符号链接，再检查并重载 OpenResty。发布保留历史目录。

发布后检查 HTTP 跳转、HTTPS 证书、入口文件摘要、静态资源，并在浏览器中验证菜单、编辑器、分享搜索与主题切换。正式构建采用自动分包，Mermaid 与数学输入按需加载。

## 恢复版本

确认目标为该站点 releases 下已验证的发布目录，然后创建临时符号链接并原子替换 index。检查配置并重载 OpenResty。恢复后重新核对入口文件与浏览器页面。保留历史目录以便追溯。

## 验收记录

2026-10-20：42 项自动检查通过；组件包与类型声明构建成功。线上入口文件与本地构建一致，全部构建资源通过 HTTPS 返回成功。浏览器验证编辑器、Mermaid、主题选择和成员搜索。
