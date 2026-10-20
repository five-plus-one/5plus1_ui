import { useState, type ReactNode } from "react";
import {
  Home,
  RefreshCw,
  ExternalLink,
  Settings,
  Monitor,
  Smartphone,
} from "lucide-react";
import { BrowserSurface } from "./WorkspaceUtilities";
import {
  BrowserPreferences,
  normalizeBrowserUrl,
  type BrowserBookmark,
} from "./BrowserPreferences";
import { AnimatedSize } from "./AnimatedSize";
export interface BrowserWorkspaceProps {
  url: string;
  onNavigate: (url: string) => void;
  children: ReactNode;
  homeUrl?: string;
  canBack?: boolean;
  canForward?: boolean;
  onBack?: () => void;
  onForward?: () => void;
  onRefresh?: () => void;
  onOpenExternal?: (url: string) => void;
  loading?: boolean;
  error?: string;
  viewport?: "desktop" | "mobile";
  onViewportChange?: (viewport: "desktop" | "mobile") => void;
  bookmarks?: BrowserBookmark[];
  onAddBookmark?: (
    bookmark: Omit<BrowserBookmark, "id">,
  ) => Promise<void> | void;
  onRemoveBookmark?: (id: string) => Promise<void> | void;
  onHomeChange?: (url: string) => Promise<void> | void;
}
export function BrowserWorkspace({
  url,
  onNavigate,
  children,
  homeUrl,
  canBack,
  canForward,
  onBack,
  onForward,
  onRefresh,
  onOpenExternal,
  loading,
  error,
  viewport = "desktop",
  onViewportChange,
  bookmarks = [],
  onAddBookmark,
  onRemoveBookmark,
  onHomeChange,
}: BrowserWorkspaceProps) {
  const [settings, setSettings] = useState(false);
  return (
    <section className="fp-workspace-form fp-browser-workspace">
      <div className="fp-workspace-actions" aria-label="浏览器操作">
        {homeUrl && (
          <button
            type="button"
            className="fp-button fp-ghost"
            aria-label="打开主页"
            onClick={() => {
              const url = normalizeBrowserUrl(homeUrl);
              if (url) onNavigate(url);
            }}
          >
            <Home size={17} />
          </button>
        )}
        {onRefresh && (
          <button
            type="button"
            className="fp-button fp-ghost"
            aria-label="刷新网页"
            onClick={onRefresh}
          >
            <RefreshCw size={17} />
          </button>
        )}
        {onViewportChange && (
          <button
            type="button"
            className="fp-button fp-secondary"
            onClick={() =>
              onViewportChange(viewport === "desktop" ? "mobile" : "desktop")
            }
          >
            {viewport === "desktop" ? (
              <Monitor size={17} />
            ) : (
              <Smartphone size={17} />
            )}
            <span>{viewport === "desktop" ? "桌面视图" : "手机视图"}</span>
          </button>
        )}
        {onOpenExternal && (
          <button
            type="button"
            className="fp-button fp-ghost"
            aria-label="在浏览器中打开"
            onClick={() => onOpenExternal(url)}
          >
            <ExternalLink size={17} />
          </button>
        )}
        {onAddBookmark && onRemoveBookmark && onHomeChange && (
          <button
            type="button"
            className="fp-button fp-ghost"
            aria-label="浏览与收藏设置"
            aria-expanded={settings}
            onClick={() => setSettings(!settings)}
          >
            <Settings size={17} />
          </button>
        )}
      </div>
      <AnimatedSize>
        {settings && onAddBookmark && onRemoveBookmark && onHomeChange && (
          <BrowserPreferences
            bookmarks={bookmarks}
            homeUrl={homeUrl || ""}
            onAdd={onAddBookmark}
            onRemove={onRemoveBookmark}
            onHomeChange={onHomeChange}
            onOpen={(id) => {
              const bookmark = bookmarks.find((item) => item.id === id);
              if (bookmark) {
                onNavigate(bookmark.url);
                setSettings(false);
              }
            }}
          />
        )}
      </AnimatedSize>
      <BrowserSurface
        url={url}
        onNavigate={onNavigate}
        canBack={canBack}
        canForward={canForward}
        onBack={onBack}
        onForward={onForward}
        loading={loading}
        error={error}
      >
        <div className="fp-browser-viewport" data-viewport={viewport}>
          {children}
        </div>
      </BrowserSurface>
    </section>
  );
}
