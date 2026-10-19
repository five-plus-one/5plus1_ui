/** AttachmentGrid - 从课栈 chat/AttachmentThumbnails 提取
 *
 * 图片附件缩略图网格：输入区可删除，历史消息只读。
 * 缺失图片显示占位块，点击可放大（由外部传 onOpen 决定）。
 */

import { X } from "lucide-react";

export interface AttachmentItem {
  id: string;
  /** 图片地址；缺失时显示占位 */
  src?: string;
  name?: string;
}

export interface AttachmentGridProps {
  items: AttachmentItem[];
  /** 提供时显示删除按钮 */
  onRemove?: (id: string) => void;
  /** 点击缩略图 */
  onOpen?: (item: AttachmentItem) => void;
  /** 缩略图边长（px） */
  size?: number;
}

export function AttachmentGrid({
  items,
  onRemove,
  onOpen,
  size = 64,
}: AttachmentGridProps) {
  if (!items.length) return null;
  return (
    <ul className="fp-attachment-grid" aria-label="图片附件">
      {items.map((item) => (
        <li key={item.id} className="fp-attachment" style={{ width: size }}>
          <button
            type="button"
            className="fp-attachment-thumb"
            style={{ width: size, height: size }}
            onClick={() => onOpen?.(item)}
            disabled={!onOpen}
            aria-label={item.name ? `查看 ${item.name}` : "查看附件"}
          >
            {item.src ? (
              <img src={item.src} alt={item.name || ""} />
            ) : (
              <span className="fp-attachment-placeholder" aria-hidden="true" />
            )}
          </button>
          {onRemove && (
            <button
              type="button"
              className="fp-attachment-remove"
              aria-label={`移除${item.name || "附件"}`}
              onClick={() => onRemove(item.id)}
            >
              <X size={12} />
            </button>
          )}
        </li>
      ))}
    </ul>
  );
}
