/** EmbedFallback - 从课栈 browser/EmbedFallback 提取
 *
 * 当站点拒绝被内嵌时的回退界面：说明原因、提供打开原页面入口，
 * 并允许用户强制尝试内嵌。
 */

import { ExternalLink, ShieldAlert } from "lucide-react";

export interface EmbedFallbackProps {
  url: string;
  reason?: string;
  /** 强制内嵌回调 */
  onForce?: () => void;
  title?: string;
  actionLabel?: string;
}

export function EmbedFallback({
  url,
  reason,
  onForce,
  title = "无法内嵌该页面",
  actionLabel = "打开原页面",
}: EmbedFallbackProps) {
  let host = url;
  try {
    host = new URL(url).host;
  } catch {
    /* 保留原始字符串 */
  }
  return (
    <div className="fp-embed-fallback">
      <span className="fp-embed-icon" aria-hidden="true">
        <ShieldAlert size={26} />
      </span>
      <strong>{title}</strong>
      <p>
        <span className="fp-embed-host">{host}</span>{" "}
        拒绝在当前窗口中显示（安全策略或访问受限）。请到原网站查看，以保留完整功能。
      </p>
      {reason && <p className="fp-embed-reason">{reason}</p>}
      <a
        className="fp-button fp-primary"
        href={url}
        target="_blank"
        rel="noopener noreferrer"
      >
        <ExternalLink size={15} aria-hidden="true" />
        {actionLabel}
      </a>
      {onForce && (
        <button type="button" className="fp-embed-force" onClick={onForce}>
          仍要尝试内嵌（可能显示空白）
        </button>
      )}
    </div>
  );
}
