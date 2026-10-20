import {
  act,
  cleanup,
  fireEvent,
  render,
  renderHook,
  screen,
} from "@testing-library/react";
import { afterEach, expect, it, vi } from "vitest";
import { useReleaseUpdate } from "../src/lib/SharedReadingPage";
import {
  appearanceStyles,
  type AppearancePreferences,
} from "../src/lib/AppearanceWorkspace";
import { MarkdownContent } from "../src/lib/MarkdownContent";

afterEach(() => {
  cleanup();
  vi.useRealTimers();
});

it("dismisses one release, announces the next, and aborts checks on unmount", async () => {
  vi.useFakeTimers();
  const check = vi.fn().mockResolvedValue("r2");
  const { result, unmount } = renderHook(() =>
    useReleaseUpdate({
      currentVersion: "r1",
      checkVersion: check,
      interval: 1000,
    }),
  );
  await act(async () => {});
  expect(result.current.available).toBe(true);
  act(() => result.current.dismiss());
  expect(result.current.available).toBe(false);
  check.mockResolvedValueOnce("r3");
  await act(async () => {
    vi.advanceTimersByTime(1000);
  });
  expect(result.current.version).toBe("r3");
  expect(result.current.available).toBe(true);
  let signal: AbortSignal | undefined;
  check.mockImplementationOnce((value: AbortSignal) => {
    signal = value;
    return new Promise(() => {});
  });
  await act(async () => {
    vi.advanceTimersByTime(1000);
  });
  unmount();
  expect(signal?.aborted).toBe(true);
});

it("keeps an in-flight release check single even when the page regains focus", async () => {
  const check = vi.fn().mockImplementation(() => new Promise(() => {}));
  const { unmount } = renderHook(() =>
    useReleaseUpdate({ currentVersion: "r1", checkVersion: check }),
  );
  fireEvent.focus(window);
  fireEvent.focus(window);
  expect(check).toHaveBeenCalledTimes(1);
  unmount();
});

it("retains formula and following text inside the same reading paragraph", () => {
  const { container } = render(
    <MarkdownContent
      markdown={
        '向量长度 $\\sqrt{x^2+y^2}$ 描述了距离。\n\n:::callout{kind="tip" title="学习提示" collapsed="true"}\n用一个例子检验。\n:::'
      }
    />,
  );
  const paragraph = screen.getByText(/向量长度/);
  expect(paragraph.tagName).toBe("P");
  expect(paragraph).toHaveTextContent("描述了距离。");
  expect(paragraph.querySelector(".katex")).not.toBeNull();
  const toggle = screen.getByRole("button", { name: "学习提示" });
  expect(toggle).toHaveAttribute("aria-expanded", "false");
  fireEvent.click(toggle);
  expect(toggle).toHaveAttribute("aria-expanded", "true");
  expect(container.querySelector(".fp-reader-callout")).toHaveAttribute(
    "data-kind",
    "tip",
  );
});

it("creates readable action colors for orange, white and black custom themes", () => {
  const luminance = (hex: string) => {
    const rgb = [1, 3, 5]
      .map((i) => parseInt(hex.slice(i, i + 2), 16) / 255)
      .map((v) => (v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
    return rgb[0] * 0.2126 + rgb[1] * 0.7152 + rgb[2] * 0.0722;
  };
  for (const theme of ["light", "dark"] as const)
    for (const accent of ["#FD8B07", "#ffffff", "#000000"]) {
      const value: AppearancePreferences = {
        theme,
        mode: "custom",
        lightAccent: accent,
        darkAccent: accent,
        selection: "#ffe2ba",
        font: "system",
        regions: {},
      };
      const style = appearanceStyles(value) as Record<string, string>;
      const a = luminance(style["--fp-action"]),
        b = luminance(style["--fp-on-action"]);
      expect(
        (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05),
      ).toBeGreaterThanOrEqual(4.5);
      expect(style.colorScheme).toBe(theme);
    }
});
