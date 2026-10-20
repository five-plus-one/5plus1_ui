import fs from "node:fs";
import path from "node:path";
import ts from "typescript";

const root = process.cwd();
const read = (name) =>
  JSON.parse(fs.readFileSync(path.join(root, "docs", name), "utf8"));
const rows = read("kezhan-component-map.json");
const learning = new Map(
  read("learning-view-extraction.json").map((row) => [row.source, row]),
);
const canvas = new Map(
  read("canvas-view-extraction.json").map((row) => [row.source, row]),
);
const special = {
  "account/CommerceManager": ["CommerceWorkspace"],
  "account/DirectoryManager": ["DirectoryWorkspace"],
  "account/NotebookManager": ["NotebookManagerWorkspace", "NotebookPublishing"],
  "account/UserDetails": [
    "UserDetailsWorkspace",
    "CapacityEditor",
    "AdministratorAccess",
  ],
  "admin/AdministratorManager": ["AdministratorDirectory"],
  "admin/CapacityManager": ["CapacityDirectory"],
  "admin/PlatformSettingsManager": ["PlatformWorkspace"],
  "admin/SystemManager": ["PlatformReset"],
  "browser/BrowserSettingsButton": ["BrowserPreferences"],
  "browser/BrowserTab": ["BrowserWorkspace", "BrowserPreferences"],
  "chat/ChatSettings": ["AISettingsWorkspace"],
  "chat/SkillsManager": ["SkillsWorkspace"],
  "chat/FollowUpQuestions": ["FollowUpQuestions"],
  "chat/ChatMessageVisualizations": ["MessageContentView", "CanvasWorkspace"],
  "chat/VizFold": ["SourceFold", "CanvasWorkspace"],
  "interactives/CustomInteractive": ["CanvasWorkspace"],
  "interactives/InteractivePlatform": ["ExperimentLibrary", "CanvasWorkspace"],
  "interactives/InteractiveStudio": ["ExperimentLibrary", "CanvasWorkspace"],
  "interactives/InteractiveTab": ["ExperimentLibrary", "LearningExperiment"],
  "interactives/LabWorkbench": ["ExperimentLibrary", "LearningExperiment"],
  "interactives/SaveInteractiveButton": ["AsyncAction", "DirectoryPicker"],
  "interactives/numerical-methods/RecordingPlayer": [
    "LectureWorkspace",
    "RecordingPlayback",
  ],
  "interactives/numerical-methods/SourceViewer": ["LearningSourceView"],
  "layout/AppearanceSettingsControls": [
    "AppearanceWorkspace",
    "appearanceStyles",
    "resolveContentTypography",
  ],
  "layout/GlobalSettings": [
    "LearningRecords",
    "AppearanceWorkspace",
    "ShortcutSettings",
  ],
  "notes/ContentPageClient": [
    "CourseContentWorkspace",
    "MarkdownContent",
    "LazyVisible",
  ],
  "notes/VisualNoteEditor": ["NoteEditorWorkspace", "MarkdownEditor"],
  "notes/NoteRenderer": [
    "MarkdownContent",
    "LearningExperiment",
    "CanvasWorkspace",
  ],
  "notes/NoteRendererServer": [
    "MarkdownContent",
    "LearningExperiment",
    "CanvasWorkspace",
  ],
  "shared/FloatingPanel": ["AnchoredPanel"],
  "video/InlinePlayer": ["VideoPlayer", "AudioPlayer", "LectureWorkspace"],
  "video/LecturePlayer": ["VideoPlayer", "AudioPlayer", "LectureWorkspace"],
  "video/PipPlayer": ["VideoPlayer", "FloatingWindow", "LectureDock"],
  "video/VideoTab": ["LectureWorkspace", "VideoPlayer"],
};
const groupContracts = {
  account: "宿主提供账户、计费与存储数据；组件接收受控值和异步保存回调。",
  admin:
    "宿主执行权限校验、平台配置持久化和重置；组件处理输入、确认、忙碌状态和错误反馈。",
  agent: "宿主提供任务会话、消息与动作；组件处理布局、任务进度与消息展示。",
  browser:
    "宿主提供浏览历史、授权与实际网页容器；组件处理网址、收藏、设置及回退界面。",
  canvas:
    "通用渲染、参数、修改指令、版本预览、采用、诊断与全屏已提取；宿主提供生成服务和分子渲染器。",
  chat: "宿主维护会话、流式数据、模型调用及业务动作；组件承担输入、消息、设置、引用与媒体展示。",
  examples: "课程示例数据与导航由宿主注入，共享书架和阅读视图。",
  icons: "使用共享图标与产品色；模型或学科品牌资源通过图标插槽注入。",
  interactives:
    "实验参数与计算视图已提取；课程原件、录音、存储和生成请求通过宿主回调接入。",
  keyboard:
    "快捷键注册、范围控制、帮助和可配置组合键为共享层；业务命令由宿主注册。",
  layout:
    "布局、导航、文件树及外观视图共享；账户权限、课程目录和路由状态由宿主连接。",
  notes:
    "Markdown 编辑、阅读、引用、版本与保存会话共享；宿主提供文档、授权资源和版本持久化。",
  quiz: "问题、作答、评分与复盘视图共享；题库、评分规则及学习记录持久化由宿主注入。",
  resources:
    "文件树、资源管理和预览视图共享；鉴权、Office 转换、存储和回收站操作由宿主回调执行。",
  review:
    "复习记录、翻卡、预览与统计视图共享；复习算法、计划与持久化由宿主连接。",
  search:
    "搜索输入、命令菜单和结果视图共享；实际索引、查询与导航回调由宿主提供。",
  setup: "设置步骤、表单和反馈共享；站点初始化及账户创建由宿主服务执行。",
  shared: "共享展示与交互组件；资源鉴权和业务动作通过显式回调传入。",
  ui: "共享过渡、可见性和提示组件；支持减少动态效果的系统偏好。",
  video:
    "播放控制、常用快捷键、字幕、原生画中画和讲稿笔记联动共享；播放授权和学习进度由宿主维护。",
  visualizations: "图形和可视化展示共享，数据、课堂控制及业务动作由宿主连接。",
  window:
    "窗口标题、右上角关闭、边界限制、全屏和任务栏为共享层；宿主维护窗口会话。",
};
const config = ts.readConfigFile("tsconfig.lib.json", ts.sys.readFile);
const parsed = ts.parseJsonConfigFileContent(config.config, ts.sys, root);
const program = ts.createProgram(parsed.fileNames, parsed.options);
const checker = program.getTypeChecker();
const entry = program.getSourceFile(path.join(root, "src/lib/index.tsx"));
const module = checker.getSymbolAtLocation(entry);
const exports = new Map(
  checker.getExportsOfModule(module).map((symbol) => {
    const actual =
      symbol.flags & ts.SymbolFlags.Alias
        ? checker.getAliasedSymbol(symbol)
        : symbol;
    return [
      symbol.name,
      [
        ...new Set(
          (actual.declarations || []).map((d) =>
            path
              .relative(root, d.getSourceFile().fileName)
              .replaceAll("\\", "/"),
          ),
        ),
      ],
    ];
  }),
);
for (const row of rows) {
  const key = row.source.replace(/^components\//, "").replace(/\.tsx$/, "");
  const group = key.split("/")[0];
  if (special[key]) row.components = special[key];
  row.integration = groupContracts[group];
  row.review = row.components.length ? "composed" : "host";
  row.status = row.components.length
    ? "共享视图与调用契约已对应"
    : "宿主上下文与业务服务";
  row.targets = [
    ...new Set(
      row.components.flatMap((component) => {
        if (!exports.has(component))
          throw new Error(`Missing public export ${component}: ${row.source}`);
        return exports.get(component);
      }),
    ),
  ];
  if (learning.has(row.source) || canvas.has(row.source)) {
    const extraction = learning.get(row.source) || canvas.get(row.source);
    row.components = learning.has(row.source)
      ? ["LearningExperiment"]
      : ["CanvasWorkspace"];
    row.targets = [extraction.target];
    row.sourceSha256 = extraction.sha256;
    row.review = "extracted";
    row.status = "专用视图已提取并适配主题";
  } else if (group === "canvas") {
    row.targets = ["src/lib/canvas/" + key.slice("canvas/".length) + ".tsx"];
    row.components = ["CanvasWorkspace"];
    row.review = "adapted";
    row.status = "专用控制与渲染适配已提供";
  }
  for (const target of row.targets)
    if (!fs.existsSync(target)) throw new Error(`Missing target ${target}`);
  row.evidence =
    group === "interactives"
      ? ["tests/learning-extraction.test.tsx"]
      : group === "canvas"
        ? [
            "tests/canvas-plot-engine.test.tsx",
            "tests/canvas-svg-health.test.tsx",
            "tests/session-transactions.test.tsx",
          ]
        : special[key]
          ? [
              "tests/workspace-expansion.test.tsx",
              "tests/session-transactions.test.tsx",
              "tests/catalog.test.tsx",
            ]
          : ["tests/catalog.test.tsx"];
}
fs.writeFileSync(
  "docs/kezhan-component-map.json",
  JSON.stringify(rows, null, 2) + "\n",
);
const other = [
  {
    source: "frontend/SharedPage.tsx",
    components: ["SharedReadingPage"],
    targets: ["src/lib/SharedReadingPage.tsx"],
    integration:
      "分享目录、阅读权限状态、引用复制、标题目录和手机抽屉。授权与实际笔记加载由宿主提供。",
  },
  {
    source: "frontend/ReleaseNotice.tsx",
    components: ["ReleaseNotice", "useReleaseUpdate"],
    targets: ["src/lib/SharedReadingPage.tsx"],
    integration:
      "版本检查、通知、暂缓、更新前保存守卫；版本标识与刷新回调由宿主提供。",
  },
  ...[
    "frontend/App.tsx",
    "frontend/dynamic.tsx",
    "frontend/Link.tsx",
    "frontend/main.tsx",
    "frontend/navigation.tsx",
    "frontend/WorkspaceCache.tsx",
  ].map((source) => ({
    source,
    components: [],
    targets: [],
    integration: "宿主应用入口、路由、按需加载或缓存；不属于可复用展示组件。",
  })),
  {
    source: "lib/content/componentRegistry.tsx",
    components: [
      "LearningExperiment",
      "getLearningExperiment",
      "learningExperiments",
    ],
    targets: ["src/lib/learning/registry.tsx"],
    integration:
      "登记全部学科实验；课程专属原件通过 LearningSourceView 或 renderSource 接入。",
  },
  {
    source: "lib/markdown/noteComponents.tsx",
    components: ["MarkdownContent"],
    targets: ["src/lib/MarkdownContent.tsx"],
    integration: "Markdown 指令、公式、图片与标题映射；宿主提供内部资源解析。",
  },
  {
    source: "lib/utils/xmlParser.tsx",
    components: ["MarkdownContent", "LearningExperiment", "CanvasWorkspace"],
    targets: ["src/lib/MarkdownContent.tsx"],
    integration:
      "XML/工具响应转 Markdown 的业务解析保留宿主；解析后的笔记、实验和画布使用共享视图。",
  },
];
fs.writeFileSync(
  "docs/kezhan-application-map.json",
  JSON.stringify(other, null, 2) + "\n",
);
let markdown =
  "# 课栈组件与共享视图对应表\n\n版本：0.5.0。源清单共 277 个组件文件，另有 11 个应用及内容注册文件。\n\n本表记录组件库提供的展示层、专用交互和宿主调用契约。自动测试与浏览器抽查覆盖范围见 [交付验证](kezhan-ui-0.5.0-acceptance.md)。课栈应用的生产接入另行验收；路径对应不等于全部业务状态的端到端验收。\n\n";
for (const group of [...new Set(rows.map((row) => row.source.split("/")[1]))]) {
  markdown += `## ${group}\n\n| 课栈源文件 | 共享组件 / 专用视图 | 调用契约 |\n| --- | --- | --- |\n`;
  for (const row of rows.filter((row) => row.source.split("/")[1] === group))
    markdown += `| \`${row.source}\` | ${row.components.map((name) => "`" + name + "`").join("、") || "宿主上下文"}${row.review === "extracted" ? "；" + row.targets.map((target) => "`" + target + "`").join("、") : ""} | ${row.integration} |\n`;
  markdown += "\n";
}
markdown +=
  "## 应用入口与内容注册\n\n| 源文件 | 共享组件 | 边界 |\n| --- | --- | --- |\n";
for (const row of other)
  markdown += `| \`${row.source}\` | ${row.components.join("、") || "宿主应用"} | ${row.integration} |\n`;
fs.writeFileSync("docs/kezhan-component-map-2026-10-20.md", markdown);
console.log(
  JSON.stringify({
    components: rows.length,
    application: other.length,
    statuses: Object.fromEntries(
      [...new Set(rows.map((row) => row.review))].map((key) => [
        key,
        rows.filter((row) => row.review === key).length,
      ]),
    ),
    publicExports: exports.size,
  }),
);
