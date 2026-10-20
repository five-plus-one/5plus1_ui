import type { HTMLAttributes, RefAttributes } from "react";

/** A shared conversation surface for hosts that own virtual scrolling and stream recovery. */
export function ConversationViewport({ className = "", ...props }: HTMLAttributes<HTMLDivElement> & RefAttributes<HTMLDivElement>) {
  return <div {...props} className={`fp-conversation-viewport ${className}`} />;
}
