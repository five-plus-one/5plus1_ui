import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { startTransition } from "react";
import { afterEach, expect, it, vi } from "vitest";
import PdfPreview from "../src/lib/workspace/PdfPreview";

function showPreview() {
  vi.stubGlobal(
    "IntersectionObserver",
    class {
      constructor(
        private callback: (entries: { isIntersecting: boolean }[]) => void,
      ) {}
      observe() {
        this.callback([{ isIntersecting: true }]);
      }
      disconnect() {}
    },
  );
  vi.stubGlobal(
    "ResizeObserver",
    class {
      observe() {}
      disconnect() {}
    },
  );
  document.documentElement.dataset.apiOrigin = "https://api.example.test";
}

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
  vi.clearAllMocks();
  vi.restoreAllMocks();
  delete document.documentElement.dataset.apiOrigin;
});
it('keeps the reading layout while switching documents and returns to page one',async()=>{
 showPreview();vi.stubGlobal('fetch',vi.fn().mockImplementation(async()=>Response.json({status:'ready',manifest:{pageCount:2,pages:[{n:1,url:'/1.jpg'},{n:2,url:'/2.jpg'}]}})));
 const view=render(<PdfPreview url="/one" name="讲义.pdf"/>);await screen.findByAltText('第 2 页');
 fireEvent.click(screen.getByRole('button',{name:'完整展开'}));
 view.rerender(<PdfPreview url="/two" name="笔记.docx"/>);await screen.findByAltText('第 2 页');
 expect(screen.getByRole('button',{name:'固定窗口'})).toHaveAttribute('aria-pressed','true');
 expect(screen.getByRole('spinbutton',{name:'跳转到页码'})).toHaveValue(1);
});

it("keeps the preview mounted when zoom triggers deferred horizontal scroll updates", async () => {
  showPreview();
  vi.stubGlobal(
    "fetch",
    vi
      .fn()
      .mockResolvedValue(
        new Response(
          JSON.stringify({
            status: "ready",
            manifest: {
              pageCount: 1,
              pages: [{ n: 1, url: "https://cdn.example.test/1.jpg" }],
            },
          }),
          { status: 200 },
        ),
      ),
  );
  const view = render(
    <PdfPreview
      url="https://api.example.test/api/resources/file"
      name="讲义.pdf"
    />,
  );
  await screen.findByAltText("第 1 页");
  const pages =
    view.container.querySelector<HTMLElement>(".pdf-preview-pages")!;
  Object.defineProperties(pages, {
    scrollWidth: { configurable: true, value: 900 },
    clientWidth: { configurable: true, value: 300 },
  });
  fireEvent.click(screen.getByRole("button", { name: "放大" }));
  await act(async () => {
    startTransition(() => {
      pages.scrollLeft = 120;
      fireEvent.scroll(pages);
      pages.scrollLeft = 240;
      fireEvent.scroll(pages);
    });
  });
  expect(screen.getByRole("button", { name: "125%" })).toBeInTheDocument();
  await waitFor(() =>
    expect(
      screen.getByRole("scrollbar", { name: "横向滚动预览" }),
    ).toHaveAttribute("aria-valuenow", "240"),
  );
});

it("shows server-rendered pages without loading the PDF bytes", async () => {
  showPreview();
  const fetch = vi.fn().mockResolvedValue(
    new Response(
      JSON.stringify({
        status: "ready",
        manifest: {
          pageCount: 2,
          pages: [
            { n: 1, url: "https://cdn.example.test/1.jpg" },
            { n: 2, url: "https://cdn.example.test/2.jpg" },
          ],
        },
      }),
      { status: 200 },
    ),
  );
  vi.stubGlobal("fetch", fetch);
  render(
    <PdfPreview
      url="https://api.example.test/api/resources/file"
      name="讲义.pdf"
    />,
  );
  await waitFor(() =>
    expect(screen.getByAltText("第 2 页")).toBeInTheDocument(),
  );
  expect(fetch).toHaveBeenCalledWith(
    "https://api.example.test/api/resources/file?view=pages",
    expect.objectContaining({ credentials: "include", cache: "no-store" }),
  );
  expect(fetch).toHaveBeenCalledTimes(1);
});

it("keeps the preview on page images while rendering is in progress", async () => {
  showPreview();
  const fetch = vi
    .fn()
    .mockResolvedValue(
      new Response(JSON.stringify({ status: "rendering" }), { status: 200 }),
    );
  vi.stubGlobal("fetch", fetch);
  const view = render(
    <PdfPreview
      url="https://api.example.test/api/resources/file"
      name="讲义.pdf"
    />,
  );
  await waitFor(() =>
    expect(screen.getByRole("status")).toHaveTextContent("正在准备预览"),
  );
  await waitFor(() => expect(fetch).toHaveBeenCalledTimes(1));
  expect(
    fetch.mock.calls.every(([url]) => String(url).includes("view=pages")),
  ).toBe(true);
  expect(view.container.querySelector("iframe,object,embed")).toBeNull();
  view.unmount();
});

it("loads only nearby page images when a long preview opens", async () => {
  let observers = 0;
  vi.stubGlobal(
    "IntersectionObserver",
    class {
      private initial = ++observers === 1;
      constructor(
        private callback: (entries: { isIntersecting: boolean }[]) => void,
      ) {}
      observe() {
        if (this.initial) this.callback([{ isIntersecting: true }]);
      }
      disconnect() {}
    },
  );
  const pages = Array.from({ length: 50 }, (_, index) => ({
    n: index + 1,
    url: `https://api.example.test/page/${index + 1}`,
  }));
  vi.stubGlobal(
    "fetch",
    vi
      .fn()
      .mockResolvedValue(
        new Response(
          JSON.stringify({
            status: "ready",
            manifest: { pageCount: pages.length, pages },
          }),
          { status: 200 },
        ),
      ),
  );
  const view = render(
    <PdfPreview
      url="https://api.example.test/api/resources/file"
      name="讲义.pdf"
    />,
  );
  await waitFor(() =>
    expect(screen.getByAltText("第 2 页")).toBeInTheDocument(),
  );
  expect(view.container.querySelectorAll("img")).toHaveLength(2);
  expect(view.container.querySelectorAll("[data-pdf-sheet]")).toHaveLength(50);
});

it("continues waiting for a queued conversion beyond one minute", async () => {
  vi.useFakeTimers();
  try {
    showPreview();
    const fetch = vi
      .fn()
      .mockImplementation(
        async () =>
          new Response(JSON.stringify({ status: "rendering" }), {
            status: 200,
          }),
      );
    vi.stubGlobal("fetch", fetch);
    render(
      <PdfPreview
        url="https://api.example.test/api/resources/file"
        name="lecture.pptx"
      />,
    );
    await act(async () => {
      await Promise.resolve();
    });
    for (let i = 0; i < 35; i++)
      await act(async () => {
        await vi.advanceTimersByTimeAsync(5000);
      });
    expect(fetch.mock.calls.length).toBeGreaterThan(30);
    expect(screen.getByRole("status")).toBeInTheDocument();
    expect(screen.queryByRole("alert")).toBeNull();
  } finally {
    cleanup();
    vi.useRealTimers();
  }
});

it("switches each attachment between an internal window and expanded pages independently", async () => {
  showPreview();
  vi.stubGlobal(
    "fetch",
    vi
      .fn()
      .mockImplementation(async () =>
        Response.json({
          status: "ready",
          manifest: {
            pageCount: 1,
            pages: [{ n: 1, url: "https://cdn.example.test/1.jpg" }],
          },
        }),
      ),
  );
  const view = render(
    <>
      <PdfPreview url="/api/resources/one" name="第一份.pdf" />
      <PdfPreview url="/api/resources/two" name="第二份.pdf" />
    </>,
  );
  await waitFor(() =>
    expect(view.container.querySelectorAll(".pdf-preview-pages")).toHaveLength(
      2,
    ),
  );
  const previews = view.container.querySelectorAll(".pdf-preview");
  expect(previews[0]).toHaveClass("pdf-preview-windowed");
  fireEvent.click(screen.getAllByRole("button", { name: "完整展开" })[0]);
  expect(previews[0]).toHaveClass("pdf-preview-expanded");
  expect(previews[1]).toHaveClass("pdf-preview-windowed");
  fireEvent.click(screen.getByRole("button", { name: "固定窗口" }));
  expect(previews[0]).toHaveClass("pdf-preview-windowed");
});

it("jumps inside the fixed window without scrolling the note", async () => {
  showPreview();
  vi.stubGlobal(
    "fetch",
    vi.fn().mockImplementation(async () =>
      Response.json({
        status: "ready",
        manifest: {
          pageCount: 2,
          pages: [
            { n: 1, url: "/1.jpg" },
            { n: 2, url: "/2.jpg" },
          ],
        },
      }),
    ),
  );
  const view = render(<PdfPreview url="/api/resources/one" name="讲义.pdf" />);
  await screen.findByAltText("第 2 页");
  const pages =
    view.container.querySelector<HTMLElement>(".pdf-preview-pages")!;
  const scrollTo = vi.fn();
  pages.scrollTo = scrollTo;
  fireEvent.change(screen.getByRole("spinbutton", { name: "跳转到页码" }), {
    target: { value: "2" },
  });
  fireEvent.click(screen.getByRole("button", { name: "跳转" }));
  expect(scrollTo).toHaveBeenCalledWith(
    expect.objectContaining({ behavior: "smooth" }),
  );
});
