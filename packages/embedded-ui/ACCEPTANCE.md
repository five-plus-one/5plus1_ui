# 嵌入式界面 0.1.0

2026-11-14 发布 `@fiveplusone/embedded-ui`，包含样式边界、自适应操作栏、即时提示三项公共能力。

设计目录：https://ui.five-plus-one.com/embedded-ui/ 。版本清单与三项交互示例已上线，接入代码可复制，组件包可下载。五个公网文件均通过可信 HTTPS 与本地 SHA-256 比对。组件包 SHA-256：`a07d77157b43ecd1e120ea9934a2b8b790174eae173887621a3a582ed734f0d2`。

执行 `npm run check`、`npm run build`。AI 批改助手的浏览器验收加载丽升原站的全局控件样式，覆盖 1280/420 像素、深浅色、鼠标与触屏八个场景；操作栏逐步缩放、原顺序恢复、委托事件、方向键、Home/End/Esc、即时提示关闭、编辑确认和弹窗操作均通过。

丽升英语真实页面核对了参考答案长文编辑、确认/取消与关闭按钮、设置面板、通用弹窗和浮层层级。触屏操作提供文字与至少 44px 的点击区域。该验收仅编辑本地草稿，评分和平台提交由原有业务代码负责。

网关静态分区为 `releases/embedded-ui-0.1.0`；设计主站当前发布目录中的 `embedded-ui` 相对链接指向该分区。后续主站发布应保留该链接。版本清单 `manifest.json` 的 `componentCount` 为 3。运维执行、逐文件摘要与恢复依据保存在 ServerMaintenance 的 `records/2026/2026-11-14-embedded-ui/`。
