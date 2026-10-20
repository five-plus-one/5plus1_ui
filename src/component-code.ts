import { entries } from "./catalog";
export function componentCode(name: string) {
  const examples: Record<string, string> = {
    SelectField: '<SelectField label="排序方式" value={text || "recent"} onChange={setText} options={[{value:"recent",label:"最近更新"},{value:"name",label:"名称"}]} />',
    MemberSearch: '<MemberSearch onSearch={async (query, kind, signal) => { const response = await fetch("/members?q=" + encodeURIComponent(query) + "&type=" + kind, {signal}); if (!response.ok) throw new Error("查找失败"); return response.json(); }} onPick={member => console.log(member)} />',
    ShareLink: '<ShareLink enabled={open} onEnabledChange={setOpen} access={text || "read"} onAccessChange={setText} url="https://example.com/share" />',
    AttachmentPicker: '<AttachmentPicker items={[{id:"1",name:"课堂讲义.pdf"}]} selectedIds={[]} onChange={ids => console.log(ids)} onConfirm={async ids => console.log(ids)} />',
    UploadQueue: '<UploadQueue tasks={[{id:"1",name:"课堂讲义.pdf",status:"uploading",progress:60}]} onCancel={id => console.log(id)} />',
    MemberAccess: '<MemberAccess members={[{id: "me", name: "五加一", role: "edit"}]} roles={[{value: "read", label: "可以阅读"}, {value: "edit", label: "可以编辑"}]} />',
    ChatComposer: '<ChatComposer value={text} onChange={setText} onSend={async message => { console.log(message); setText(""); }} />',
    MarkdownEditor: '<MarkdownEditor markdown="## 学习笔记\\n\\n写下你的理解。" onChange={(markdown, document) => console.log(markdown, document)} />',
    WorkspaceLayout: '<div style={{height: 480}}><WorkspaceLayout panels={[\n  {id: "files", label: "目录", content: <p>课程资料</p>, defaultSize: 20, collapsible: true},\n  {id: "note", label: "笔记", content: <p>学习笔记</p>, defaultSize: 50},\n  {id: "chat", label: "讨论", content: <p>讨论</p>, defaultSize: 30},\n]} persistenceKey="my-product:workspace" /></div>',
    ModelSelector: '<ModelSelector value={text || "fast"} onChange={setText} groups={[{name: "通用模型", models: [{id: "fast", label: "快速版", contextWindow: 128000}, {id: "deep", label: "深度版", contextWindow: 200000}]}]} />',
    Button: '<Button onClick={() => setMessage("已保存")}>保存笔记</Button>',
    IconButton:
      '<IconButton label="更多操作" onClick={() => setOpen(true)}>＋</IconButton>',
    Link: '<Link href="https://fiveplus.one/">五加一主页</Link>',
    Badge: '<Badge tone="success">已完成</Badge>',
    Chip: "<Chip selected={enabled} onClick={() => setEnabled(!enabled)}>笔记</Chip>",
    Avatar: '<Avatar name="五加一" size={40} />',
    AvatarGroup: '<AvatarGroup names={["五", "林", "陈"]} />',
    Divider: "<Divider />",
    Kbd: "<Kbd>⌘ K</Kbd>",
    VisuallyHidden: "<VisuallyHidden>保存当前修改</VisuallyHidden>",
    Input:
      '<Input aria-label="笔记名称" value={text} onChange={e => setText(e.target.value)} />',
    Textarea:
      '<Textarea aria-label="想法" value={text} onChange={e => setText(e.target.value)} />',
    Field:
      '<Field label="笔记名称" hint="方便日后查找">\n  <Input value={text} onChange={e => setText(e.target.value)} />\n</Field>',
    Checkbox:
      '<Checkbox label="完成后通知我" checked={enabled} onChange={e => setEnabled(e.target.checked)} />',
    Radio:
      '<Radio name="reading-mode" label="舒适阅读" value="comfortable" defaultChecked />',
    Switch:
      '<Switch label="完成后通知我" checked={enabled} onChange={setEnabled} />',
    Select:
      '<Select aria-label="课程" options={[{value:"math", label:"高等数学"}]} value={text} onChange={e => setText(e.target.value)} />',
    Combobox:
      '<Combobox label="课程" options={["高等数学", "线性代数"]} value={text} onChange={setText} />',
    MultiSelect:
      '<MultiSelect label="资料类型" options={["笔记", "课件"]} value={selected} onChange={setSelected} />',
    PasswordInput:
      '<PasswordInput label="登录密码" autoComplete="current-password" required />',
    NumberInput:
      '<NumberInput label="章节数量" value={count} onChange={setCount} min={1} max={10} />',
    Slider:
      '<Slider label="文字大小" min={14} max={22} value={count} onChange={e => setCount(Number(e.target.value))} />',
    DatePicker:
      '<DatePicker aria-label="复习日期" value={date} onChange={e => setDate(e.target.value)} />',
    TimePicker: '<TimePicker aria-label="提醒时间" defaultValue="09:00" />',
    Calendar: "<Calendar value={date} onChange={setDate} />",
    ColorPicker:
      '<ColorPicker label="强调色" value={color} onChange={setColor} />',
    Rating: "<Rating value={count} onChange={setCount} />",
    SearchInput:
      '<SearchInput value={text} onChange={setText} placeholder="搜索资料" />',
    FileUpload:
      '<FileUpload accept=".pdf,.docx,.pptx" onFiles={files => setMessage(`已选择 ${files.length} 份资料`)} />',
    Tabs: "<Tabs items={tabs} value={tab} onChange={setTab} />",
    SegmentedControl:
      "<SegmentedControl items={tabs} value={tab} onChange={setTab} />",
    Breadcrumbs:
      '<Breadcrumbs items={[{label:"首页",href:"/"}, {label:"我的笔记"}]} />',
    Pagination: "<Pagination page={count} total={8} onChange={setCount} />",
    Steps: '<Steps items={["选择资料", "整理笔记", "完成"]} current={1} />',
    Navigation: "<Navigation items={tabs} value={tab} onChange={setTab} />",
    Tree: '<Tree items={[{label:"课程", children:["学习笔记", "参考资料"]}]} />',
    Dropdown:
      '<Dropdown label="更多操作" items={[{label:"复制", onClick:() => setMessage("已选择复制")}]} />',
    CommandMenu:
      '<>\n  <Button onClick={() => setOpen(true)}>快速前往</Button>\n  <CommandMenu open={open} onClose={() => setOpen(false)}\n    items={[{label:"我的笔记", onSelect:() => setMessage("已选择笔记")}]} />\n</>',
    Alert: '<Alert title="已保存" tone="success">可以继续编辑。</Alert>',
    Banner: "<Banner onClose={() => setEnabled(false)}>资料已准备好。</Banner>",
    Toast:
      'message ? <Toast message={message} onClose={() => setMessage("")} /> : <Button onClick={() => setMessage("已保存")}>保存</Button>',
    Dialog:
      '<>\n  <Button onClick={() => setOpen(true)}>新建笔记</Button>\n  <Dialog open={open} onClose={() => setOpen(false)} title="新建笔记">\n    <Input aria-label="笔记名称" />\n  </Dialog>\n</>',
    ConfirmDialog:
      '<>\n  <Button onClick={() => setOpen(true)}>移除资料</Button>\n  <ConfirmDialog open={open} onClose={() => setOpen(false)} title="移除资料？"\n    description="从当前笔记中移除，可重新添加。"\n    onConfirm={() => { setOpen(false); setMessage("已移除"); }} />\n</>',
    Drawer:
      '<>\n  <Button onClick={() => setOpen(true)}>阅读设置</Button>\n  <Drawer open={open} onClose={() => setOpen(false)} title="阅读设置">\n    <Switch label="专注阅读" checked={enabled} onChange={setEnabled} />\n  </Drawer>\n</>',
    Popover: '<Popover label="分享笔记"><p>邀请同学一起阅读。</p></Popover>',
    Tooltip:
      '<Tooltip text="保存修改"><Button onClick={() => setMessage("已保存")}>保存</Button></Tooltip>',
    Progress: '<Progress value={68} label="正在整理章节" />',
    Spinner: "<Spinner size={22} />",
    Skeleton: '<Skeleton width="70%" height={18} />',
    EmptyState:
      '<EmptyState title="还没有笔记" description="从第一个想法开始。" action={<Button onClick={() => setMessage("开始创建")}>新建笔记</Button>} />',
    ErrorState:
      '<ErrorState description="连接暂时中断，内容已保留。" onRetry={() => setMessage("正在重新加载")} />',
    Card: "<Card><h3>学习计划</h3><p>每天一点，慢慢积累。</p></Card>",
    Table:
      '<Table columns={["名称", "状态"]} rows={[["学习计划", "已保存"], ["课程资料", "待阅读"]]} />',
    DescriptionList:
      '<DescriptionList items={[{label:"课程",value:"线性代数"},{label:"资料",value:"3 份"}]} />',
    Timeline:
      '<Timeline items={[{title:"阅读资料", description:"已完成"}, {title:"整理章节", description:"正在进行"}]} />',
    Stat: '<Stat label="本周阅读" value="12.5 h" detail="一点一滴，形成理解" />',
    Meter: '<Meter value={36} label="资料空间" />',
    BarChart:
      '<BarChart label="阅读记录" items={[{label:"周一",value:24}, {label:"周二",value:38}]} />',
    Accordion:
      '<Accordion items={[{title:"如何开始？", content:"先创建一篇笔记。"}]} />',
    CodeBlock:
      '<CodeBlock language="css" code={":root { --fp-primary: #356348; }"} />',
    ImagePreview: '<ImagePreview src="/your-image.png" alt="课程配图" />',
    NotificationList:
      '<NotificationList items={[{id:"1", title:"笔记已整理", detail:"线性代数 · 第二章",read:enabled}]} onRead={() => setEnabled(true)} />',
    Container: "<Container><p>页面内容</p></Container>",
    Stack: "<Stack gap={16}><p>阅读</p><p>理解</p><p>创造</p></Stack>",
    Grid: "<Grid minWidth={220}><Card>第一组</Card><Card>第二组</Card></Grid>",
    ScrollArea:
      "<ScrollArea height={240}><p>较长内容放在这里。</p></ScrollArea>",
    AspectRatio:
      '<AspectRatio ratio={16/9}><img src="/your-image.png" alt="课程配图" style={{width:"100%"}} /></AspectRatio>',
    ResizablePanel:
      "<ResizablePanel first={<p>目录</p>} second={<p>阅读内容</p>} />",
    PageHeader:
      '<PageHeader eyebrow="MY LIBRARY" title="我的笔记" description="积累每一次发现。" action={<Button>新建笔记</Button>} />',
    Toolbar:
      '<Toolbar><Button variant="ghost">粗体</Button><Button variant="ghost">斜体</Button></Toolbar>',
    Footer: "<Footer>五加一 · 让想法自然生长</Footer>",
    Callout:
      '<Callout title="理解的起点">试着用自己的话解释这个概念。</Callout>',
    Citation:
      '<Citation title="课程讲义" detail="第二章 · 第 24 页" onClick={() => setMessage("已选择来源")} />',
    AIMessage: '<AIMessage role="assistant">我已整理好章节结构。</AIMessage>',
    AIComposer: "<AIComposer onSend={question => setMessage(question)} />",
    TaskStatus:
      '<TaskStatus title="整理课程笔记" steps={["阅读资料", "整理章节"]} running={enabled} onToggle={() => setEnabled(!enabled)} />',
    ResultCard:
      '<ResultCard title="章节整理完成" description="结构与重点已准备好。" onApply={() => setMessage("已应用")} />',
    FileCard:
      '<FileCard name="课程讲义.pdf" detail="参考资料 · 24 页" onOpen={() => setMessage("已选择资料")} />',
  };
  const snippet = examples[name] || "";
  const state = [
    ["enabled", "  const [enabled, setEnabled] = useState(true);"],
    ["setText", '  const [text, setText] = useState("");'],
    [
      "setSelected",
      "  const [selected, setSelected] = useState<string[]>([]);",
    ],
    ["setCount", "  const [count, setCount] = useState(3);"],
    ["setDate", '  const [date, setDate] = useState("2026-10-19");'],
    ["setColor", '  const [color, setColor] = useState("#356348");'],
    ["setTab", '  const [tab, setTab] = useState("notes");'],
    ["setMessage", '  const [message, setMessage] = useState("");'],
    ["setOpen", "  const [open, setOpen] = useState(false);"],
  ]
    .filter(([key]) => snippet.includes(key))
    .map(([, line]) => line);
  const imports = [
    name,
    ...["Button", "Input", "Switch", "Card"].filter(
      (n) => n !== name && snippet.includes("<" + n),
    ),
  ];
  return `import { useState } from 'react';\nimport { ${imports.join(", ")} } from '@fiveplusone/ui';\nimport '@fiveplusone/ui/styles.css';\n\nexport function Example() {\n${state.join("\n")}${snippet.includes("items={tabs}") ? '\n  const tabs = [{value:"notes",label:"笔记"}, {value:"files",label:"资料"}];' : ""}\n  return (\n${snippet
    .split("\n")
    .map((l) => "    " + l)
    .join("\n")}\n  );\n}`;
}
