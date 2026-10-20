export interface ContentSkeletonProps { label?: string; variant?: "document" | "list"; }
export function ContentSkeleton({ label = "正在打开内容", variant = "document" }: ContentSkeletonProps) {
  return <div className={`fp-content-skeleton fp-content-skeleton-${variant}`} role="status" aria-label={label} aria-busy="true">
    <span className="fp-content-skeleton-title" />
    <span /><span /><span className="fp-content-skeleton-short" />
    <div className="fp-content-skeleton-block" />
    <span /><span className="fp-content-skeleton-short" />
  </div>;
}
