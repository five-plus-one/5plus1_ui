# 嵌入式界面

`@fiveplusone/embedded-ui` 提供样式边界、响应式操作栏和即时提示，适用于嵌入第三方页面的 DOM 界面。操作、请求和保存由业务端处理。

```js
FivePlusOneEmbeddedUI.installBoundary(document, ['#my-panel', '#my-dialog']);
const disposeTips = FivePlusOneEmbeddedUI.installTooltips(document, ['#my-panel', '#my-dialog']);
const toolbar = FivePlusOneEmbeddedUI.enhanceToolbar(document.querySelector('#my-toolbar'), {
  onAction: handleToolbarClick, // 工具栏使用委托事件时，同一处理器也接收菜单中的操作。
});
// 窗口关闭时释放操作栏；应用退出时释放提示。
toolbar.destroy();
disposeTips();
```

边界复位宿主的元素默认样式，组件自身的类样式和内联尺寸保留。操作栏测量容器、按钮及间距，将放不下的操作按原顺序移入“更多”，宽度恢复时展开。按钮保留原节点和事件；分隔项使用 `role="separator"`。

即时提示支持 `data-fp-tooltip` 和 `aria-label`，并将既有 `title` 迁移为即时提示。鼠标进入及键盘聚焦时显示，点击、离开、Esc、滚动和缩放时关闭；触屏使用明确标签和至少 44px 的操作目标。菜单支持方向键、Home、End 与 Esc。浮层沿用 `--fp-*` 语义颜色并避让视口边缘。

运行示例：使用 HTTP 服务打开 `demo/index.html`。目录和可复制接入代码见示例页。浏览器验收由消费项目的真实宿主样式与完整页面共同覆盖。
