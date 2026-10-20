import { cloneElement, isValidElement, type ReactNode, type ReactElement } from 'react';
export default function Tip({ tip, children }: { tip: string; children: ReactNode }) {
  return isValidElement(children) ? cloneElement(children as ReactElement<{ title?: string }>, { title: tip }) : <span title={tip}>{children}</span>;
}
