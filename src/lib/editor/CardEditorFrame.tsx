import type { ReactNode } from "react";
export interface CardEditorFrameProps { header: ReactNode; children: ReactNode; actions: ReactNode; }
export function CardEditorFrame({ header, children, actions }: CardEditorFrameProps) {
  return <section className="fp-card-editor-frame"><header>{header}</header><div className="fp-card-editor-content">{children}</div><footer>{actions}</footer></section>;
}
