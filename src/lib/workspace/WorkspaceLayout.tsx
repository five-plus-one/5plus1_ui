import { forwardRef, useImperativeHandle, useRef, Fragment, type ReactNode } from 'react';
import { Panel, PanelGroup, PanelResizeHandle, type ImperativePanelGroupHandle, type ImperativePanelHandle } from 'react-resizable-panels';

export interface WorkspacePanel {
  id: string;
  label: string;
  content: ReactNode;
  defaultSize?: number;
  minSize?: number;
  maxSize?: number;
  collapsible?: boolean;
  collapsedSize?: number;
  onCollapse?: () => void;
  onExpand?: () => void;
}
export interface WorkspaceLayoutHandle {
  getLayout: () => number[];
  setLayout: (sizes: number[]) => void;
  collapse: (id: string) => void;
  expand: (id: string) => void;
  resize: (id: string, size: number) => void;
  isCollapsed: (id: string) => boolean;
}
export interface WorkspaceLayoutProps {
  panels: WorkspacePanel[];
  direction?: 'horizontal' | 'vertical';
  /** A product/account-scoped key; omit to keep the layout in memory. */
  persistenceKey?: string;
  onLayout?: (sizes: number[]) => void;
  className?: string;
}
/** Uses the same resize engine as the KeZhan workspace; nested groups provide split views. */
export const WorkspaceLayout = forwardRef<WorkspaceLayoutHandle, WorkspaceLayoutProps>(function WorkspaceLayout({ panels, direction = 'horizontal', persistenceKey, onLayout, className = '' }, ref) {
  const group = useRef<ImperativePanelGroupHandle>(null);
  const handles = useRef(new Map<string, ImperativePanelHandle>());
  useImperativeHandle(ref, () => ({
    getLayout: () => group.current?.getLayout() || [],
    setLayout: sizes => group.current?.setLayout(sizes),
    collapse: id => handles.current.get(id)?.collapse(),
    expand: id => handles.current.get(id)?.expand(),
    resize: (id, size) => handles.current.get(id)?.resize(size),
    isCollapsed: id => handles.current.get(id)?.isCollapsed() || false,
  }), []);
  return <PanelGroup ref={group} direction={direction} autoSaveId={persistenceKey} onLayout={onLayout} className={`fp-workspace-layout ${className}`}>
    {panels.map((panel, index) => <Fragment key={panel.id}>
      {index > 0 && <PanelResizeHandle className="fp-workspace-divider" aria-label={`调整${panels[index - 1].label}与${panel.label}`} />}
      <Panel ref={handle => { if (handle) handles.current.set(panel.id, handle); else handles.current.delete(panel.id); }} id={panel.id} order={index}
        defaultSize={panel.defaultSize} minSize={panel.minSize ?? 10} maxSize={panel.maxSize} collapsible={panel.collapsible} collapsedSize={panel.collapsedSize ?? 0} onCollapse={panel.onCollapse} onExpand={panel.onExpand}>
        <section className="fp-workspace-pane" aria-label={panel.label}>{panel.content}</section>
      </Panel>
    </Fragment>)}
  </PanelGroup>;
});
