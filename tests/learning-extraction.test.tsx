import { Suspense } from "react";
import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { afterEach, expect, it, vi } from "vitest";
import {
  learningExperiments,
  LearningExperiment,
  ExperimentLibrary,
  learningAlpha,
} from "../src/lib";
afterEach(cleanup);
for (const experiment of learningExperiments.filter(
  (item) => item.chapterId !== "sources",
)) {
  it(`opens ${experiment.id} with its full interactive view`, async () => {
    const view = render(<LearningExperiment id={experiment.id} />);
    await waitFor(
      () => expect(screen.queryByText("正在打开实验…")).not.toBeInTheDocument(),
      { timeout: 10000 },
    );
    expect(
      view.container.querySelector(".fp-lab-content")?.textContent?.length,
    ).toBeGreaterThan(20);
    expect(view.container.querySelector("select")).toBeNull();
    expect(view.container.querySelector("button:not([type])")).toBeNull();
    const slider =
      view.container.querySelector<HTMLInputElement>("input[type=range]");
    if (slider) {
      const min = Number(slider.min || 0),
        max = Number(slider.max || 100),
        old = Number(slider.value),
        step = Number(slider.step) || 1,
        next = old + step <= max ? old + step : Math.max(min, old - step);
      fireEvent.change(slider, { target: { value: String(next) } });
      expect(screen.queryByText("暂时无法打开内容")).not.toBeInTheDocument();
    }
    expect(screen.queryByText("暂时无法打开内容")).not.toBeInTheDocument();
  });
}
it("looks up every registered source and provides its reading view", async () => {
  for (const source of learningExperiments.filter(
    (item) => item.chapterId === "sources",
  )) {
    const view = render(
      <LearningExperiment
        id={source.id}
        renderSource={(id, kind) => (
          <section aria-label="课堂原件">
            {id} · {kind}
          </section>
        )}
      />,
    );
    expect(
      await screen.findByRole("region", { name: "课堂原件" }),
    ).toBeInTheDocument();
    view.unmount();
  }
});
it("filters experiments by query and selects an actual interactive view", async () => {
  const select = vi.fn();
  render(<ExperimentLibrary onSelect={select} />);
  fireEvent.change(screen.getByLabelText("搜索实验"), {
    target: { value: "圆盘条件" },
  });
  const button = screen.getByRole("button", { name: /圆盘条件密度切片/ });
  fireEvent.click(button);
  expect(select).toHaveBeenCalledWith("probability-disk-conditional-lab");
  await waitFor(() =>
    expect(screen.queryByText("正在打开实验…")).not.toBeInTheDocument(),
  );
  expect(document.querySelector(".fp-lab-content svg")).toBeTruthy();
});
it("keeps CSS variable colors usable with alpha chart fills", () => {
  expect(learningAlpha("var(--fp-primary)", "80")).toBe(
    "color-mix(in srgb, var(--fp-primary) 50.2%, transparent)",
  );
});
