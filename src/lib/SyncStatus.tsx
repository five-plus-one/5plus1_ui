/** SyncStatus - 从课栈 account/CloudSyncStatus 提取
 *
 * 云同步状态条：显示待同步条目与冲突，允许保留本机或采用云端版本。
 * 无待同步条目时不渲染任何内容。
 */

import { useCallback, useEffect, useState } from "react";
import { CloudOff, Cloud, AlertTriangle, X } from "lucide-react";

export interface PendingSync {
  key: string;
  /** 该条目在云端也存在更新 */
  conflict?: boolean;
}

export interface SyncStatusProps {
  /** 读取待同步条目 */
  list: () => Promise<PendingSync[]>;
  /** 触发同步 */
  sync: () => Promise<void>;
  /** 冲突解决：keepLocal = true 保留本机 */
  resolve: (key: string, keepLocal: boolean) => Promise<void>;
  /** 轮询间隔（毫秒），设为 0 关闭 */
  intervalMs?: number;
  /** 外部事件名，收到该事件时刷新 */
  eventName?: string;
}

export function SyncStatus({
  list,
  sync,
  resolve,
  intervalMs = 30000,
  eventName = "fp-sync-change",
}: SyncStatusProps) {
  const [pending, setPending] = useState<PendingSync[]>([]);
  const [error, setError] = useState("");
  const [dismissed, setDismissed] = useState(false);

  const refresh = useCallback(() => {
    list()
      .then((items) => {
        setPending(items);
        setError("");
      })
      .catch(() => setError("暂时无法同步，内容仍保存在此设备"));
  }, [list]);

  const retry = useCallback(() => {
    sync()
      .then(refresh)
      .catch(() => setError("暂时无法同步，稍后将重试"));
  }, [sync, refresh]);

  useEffect(() => {
    refresh();
    retry();
    const onEvent = () => refresh();
    const onOnline = () => retry();
    window.addEventListener(eventName, onEvent);
    window.addEventListener("online", onOnline);
    const timer = intervalMs > 0 ? setInterval(retry, intervalMs) : undefined;
    return () => {
      if (timer) clearInterval(timer);
      window.removeEventListener(eventName, onEvent);
      window.removeEventListener("online", onOnline);
    };
  }, [refresh, retry, intervalMs, eventName]);

  useEffect(() => {
    setDismissed(false);
  }, [pending.length]);

  if (!pending.length || dismissed) return null;
  const hasConflict = pending.some((p) => p.conflict);

  return (
    <aside
      className="fp-sync-status"
      data-conflict={hasConflict || undefined}
      role="status"
      aria-live="polite"
    >
      <span className="fp-sync-icon" aria-hidden="true">
        {hasConflict ? <AlertTriangle size={16} /> : <Cloud size={16} />}
      </span>
      <div className="fp-sync-body">
        <strong>
          {hasConflict ? "部分内容在其他设备上有更新" : "正在同步学习记录"}
        </strong>
        <span>
          {hasConflict
            ? "选择要保留的版本，冲突解决后会继续同步。"
            : "未完成的内容已保存在本机。"}
        </span>
        {pending
          .filter((p) => p.conflict)
          .map((p, i) => (
            <div className="fp-sync-actions" key={p.key}>
              <span className="fp-sync-key">记录 {i + 1}</span>
              <button
                type="button"
                onClick={() =>
                  resolve(p.key, true).catch(() =>
                    setError("同步失败，请稍后重试"),
                  )
                }
              >
                保留此设备版本
              </button>
              <button
                type="button"
                onClick={() =>
                  resolve(p.key, false).catch(() =>
                    setError("同步失败，请稍后重试"),
                  )
                }
              >
                采用云端版本
              </button>
            </div>
          ))}
        {error && (
          <p className="fp-sync-error" role="alert">
            <CloudOff size={13} /> {error}
          </p>
        )}
      </div>
      <button
        type="button"
        className="fp-sync-close"
        aria-label="收起同步提示"
        onClick={() => setDismissed(true)}
      >
        <X size={14} />
      </button>
    </aside>
  );
}
