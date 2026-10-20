import { Component, type ErrorInfo, type ReactNode } from "react";
import { RotateCcw } from "lucide-react";

export interface SurfaceBoundaryProps {
  children: ReactNode;
  title?: string;
  description?: string;
  resetKey?: string | number;
  onError?: (error: Error, info: ErrorInfo) => void;
}

/** Isolate a failed workspace surface and allow the reader to reopen it. */
export class SurfaceBoundary extends Component<SurfaceBoundaryProps, { failed: boolean; attempt: number }> {
  state = { failed: false, attempt: 0 };
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch(error: Error, info: ErrorInfo) { this.props.onError?.(error, info); }
  componentDidUpdate(previous: SurfaceBoundaryProps) {
    if (previous.resetKey !== this.props.resetKey && this.state.failed) this.retry();
  }
  retry = () => this.setState(({ attempt }) => ({ failed: false, attempt: attempt + 1 }));
  render() {
    if (this.state.failed) return (
      <section className="fp-surface-recovery" role="alert">
        <RotateCcw size={24} aria-hidden="true" />
        <strong>{this.props.title || "内容暂时无法显示"}</strong>
        <p>{this.props.description || "请重新打开，继续查看内容。"}</p>
        <button type="button" className="fp-button fp-secondary" onClick={this.retry}>
          <RotateCcw size={15} aria-hidden="true" />重新打开
        </button>
      </section>
    );
    return <div className="fp-surface-boundary" key={this.state.attempt}>{this.props.children}</div>;
  }
}
