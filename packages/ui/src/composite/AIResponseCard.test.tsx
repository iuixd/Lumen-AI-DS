import { afterEach, describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AIResponseCard, type AIResponseCardSection } from "./AIResponseCard";

const baseSections: AIResponseCardSection[] = [
  {
    title: "Executive Summary",
    bullets: ["Renewal risk is concentrated in three enterprise accounts"],
    table: {
      columns: [
        { key: "account", header: "Account" },
        { key: "arr", header: "ARR" }
      ],
      rows: [{ account: "Northwind Corp", arr: "$420K" }]
    },
    code: { code: "SELECT 1;", language: "sql" }
  }
];

describe("AIResponseCard", () => {
  it("renders the title, model badge, and first section inline", () => {
    render(<AIResponseCard model="claude-fable-5" sections={baseSections} />);
    expect(screen.getByText("AI Response Card")).toBeInTheDocument();
    expect(screen.getByText("claude-fable-5")).toBeInTheDocument();
    expect(screen.getByText("Executive Summary")).toBeInTheDocument();
    expect(screen.getByText("Renewal risk is concentrated in three enterprise accounts")).toBeInTheDocument();
  });

  it("omits the model badge when no model is given", () => {
    render(<AIResponseCard sections={baseSections} />);
    expect(screen.queryByText("claude-fable-5")).not.toBeInTheDocument();
  });

  it("renders the first section's table with headers and rows", () => {
    render(<AIResponseCard sections={baseSections} />);
    expect(screen.getByRole("columnheader", { name: "Account" })).toBeInTheDocument();
    expect(screen.getByText("Northwind Corp")).toBeInTheDocument();
    expect(screen.getByText("$420K")).toBeInTheDocument();
  });

  it(
    "renders the first section's code block",
    async () => {
      render(<AIResponseCard sections={baseSections} />);
      // CodeBlock highlights via Shiki, which resolves asynchronously (unlike
      // the previous prism-react-renderer implementation's synchronous render)
      // and can take longer than testing-library's default 1000ms find timeout
      // on Shiki's first, cold-start highlight call in a test-file run.
      expect(await screen.findByText("SELECT", {}, { timeout: 10000 })).toBeInTheDocument();
    },
    15000
  );

  it("hides the expand control when there is only one section", () => {
    render(<AIResponseCard sections={baseSections} />);
    expect(screen.queryByText(/more section/)).not.toBeInTheDocument();
  });

  it("shows the expand control and correct section count when there are more sections", () => {
    render(
      <AIResponseCard
        sections={[...baseSections, { title: "Supporting Detail" }, { title: "Methodology" }]}
      />
    );
    expect(screen.getByText("2 more sections")).toBeInTheDocument();
    expect(screen.queryByText("Supporting Detail")).not.toBeInTheDocument();
  });

  it("uses singular 'section' when exactly one section remains", () => {
    render(<AIResponseCard sections={[...baseSections, { title: "Supporting Detail" }]} />);
    expect(screen.getByText("1 more section")).toBeInTheDocument();
  });

  it("reveals additional sections when the expand control is activated", async () => {
    const user = userEvent.setup();
    render(<AIResponseCard sections={[...baseSections, { title: "Supporting Detail" }]} />);
    expect(screen.queryByText("Supporting Detail")).not.toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: /Multi-part response/ }));
    expect(screen.getByText("Supporting Detail")).toBeInTheDocument();
  });

  it("renders the suggested-action pill and sources count, and fires onClick", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(
      <AIResponseCard
        sections={baseSections}
        sourcesCount={2}
        suggestedAction={{ label: "Draft outreach emails", onClick }}
      />
    );
    expect(screen.getByText("2 sources")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Draft outreach emails" }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  describe("Copy action", () => {
    // @testing-library/user-event's setup() installs its own navigator.clipboard
    // stub (a getter, attached unconditionally — see attachClipboardStubToView in
    // its source) as soon as userEvent.setup() runs. Spying on
    // navigator.clipboard.writeText has to happen after that call, or the spy is
    // silently shadowed by user-event's own stub and never observes the call.
    afterEach(() => {
      vi.restoreAllMocks();
    });

    it("writes a plain-text rendering of every section to the clipboard", async () => {
      const user = userEvent.setup();
      const writeText = vi.spyOn(navigator.clipboard, "writeText").mockResolvedValue(undefined);
      render(
        <AIResponseCard
          title="AI Response Card"
          sections={[...baseSections, { title: "Supporting Detail", bullets: ["More context"] }]}
        />
      );
      await user.click(screen.getByRole("button", { name: "Copy response" }));
      await waitFor(() => expect(writeText).toHaveBeenCalledTimes(1));
      const copiedText = writeText.mock.calls[0][0] as string;
      expect(copiedText).toContain("AI Response Card");
      expect(copiedText).toContain("Executive Summary");
      expect(copiedText).toContain("- Renewal risk is concentrated in three enterprise accounts");
      expect(copiedText).toContain("Northwind Corp");
      expect(copiedText).toContain("SELECT 1;");
      expect(copiedText).toContain("Supporting Detail");
      expect(copiedText).toContain("- More context");
    });

    it("calls onCopy with the copied text and shows a temporary 'Copied' confirmation", async () => {
      const user = userEvent.setup();
      vi.spyOn(navigator.clipboard, "writeText").mockResolvedValue(undefined);
      const onCopy = vi.fn();
      render(<AIResponseCard sections={baseSections} onCopy={onCopy} />);
      await user.click(screen.getByRole("button", { name: "Copy response" }));
      await waitFor(() => expect(onCopy).toHaveBeenCalledTimes(1));
      expect(onCopy.mock.calls[0][0]).toContain("Executive Summary");
      expect(screen.getByRole("button", { name: "Copied" })).toBeInTheDocument();
    });

    it("still calls onCopy even when the Clipboard API rejects", async () => {
      const user = userEvent.setup();
      vi.spyOn(navigator.clipboard, "writeText").mockRejectedValueOnce(new Error("denied"));
      const onCopy = vi.fn();
      render(<AIResponseCard sections={baseSections} onCopy={onCopy} />);
      await user.click(screen.getByRole("button", { name: "Copy response" }));
      await waitFor(() => expect(onCopy).toHaveBeenCalledTimes(1));
    });
  });

  describe("Regenerate action", () => {
    it("calls a synchronous onRegenerate", async () => {
      const user = userEvent.setup();
      const onRegenerate = vi.fn();
      render(<AIResponseCard sections={baseSections} onRegenerate={onRegenerate} />);
      await user.click(screen.getByRole("button", { name: "Regenerate response" }));
      expect(onRegenerate).toHaveBeenCalledTimes(1);
    });

    it("shows a spinner and disables itself while an async onRegenerate is pending", async () => {
      const user = userEvent.setup();
      let resolvePending: () => void = () => {};
      const onRegenerate = vi.fn(
        () => new Promise<void>((resolve) => (resolvePending = resolve))
      );
      render(<AIResponseCard sections={baseSections} onRegenerate={onRegenerate} />);

      const button = screen.getByRole("button", { name: "Regenerate response" });
      await user.click(button);
      expect(button).toBeDisabled();
      expect(button).toHaveAttribute("aria-busy", "true");

      resolvePending();
      await waitFor(() => expect(button).not.toBeDisabled());
      expect(button).not.toHaveAttribute("aria-busy");
    });

    it("ignores extra clicks while a regeneration is already pending", async () => {
      const user = userEvent.setup();
      let resolvePending: () => void = () => {};
      const onRegenerate = vi.fn(
        () => new Promise<void>((resolve) => (resolvePending = resolve))
      );
      render(<AIResponseCard sections={baseSections} onRegenerate={onRegenerate} />);

      const button = screen.getByRole("button", { name: "Regenerate response" });
      await user.click(button);
      await user.click(button);
      expect(onRegenerate).toHaveBeenCalledTimes(1);
      resolvePending();
      await waitFor(() => expect(button).not.toBeDisabled());
    });

    it("replaces the section body with a loading skeleton while pending, restoring it after", async () => {
      const user = userEvent.setup();
      let resolvePending: () => void = () => {};
      const onRegenerate = vi.fn(
        () => new Promise<void>((resolve) => (resolvePending = resolve))
      );
      render(<AIResponseCard sections={baseSections} onRegenerate={onRegenerate} />);

      expect(screen.getByText("Executive Summary")).toBeInTheDocument();
      await user.click(screen.getByRole("button", { name: "Regenerate response" }));

      // role="status" has no name-from-content per the ARIA spec, so its
      // accessible name isn't queryable via getByRole's `name` option here
      // — assert the role and the visually-hidden label separately.
      expect(screen.getByRole("status")).toBeInTheDocument();
      expect(screen.getByText("Regenerating response")).toBeInTheDocument();
      expect(screen.queryByText("Executive Summary")).not.toBeInTheDocument();

      resolvePending();
      await waitFor(() => expect(screen.getByText("Executive Summary")).toBeInTheDocument());
      expect(screen.queryByRole("status")).not.toBeInTheDocument();
    });
  });

  describe("Tooltips", () => {
    it("shows a tooltip on the Copy button", async () => {
      const user = userEvent.setup();
      render(<AIResponseCard sections={baseSections} />);
      expect(screen.queryByText("Copy response")).not.toBeInTheDocument();
      await user.hover(screen.getByRole("button", { name: "Copy response" }));
      await waitFor(() => expect(screen.getByText("Copy response")).toBeInTheDocument(), {
        timeout: 2000
      });
    });

    it("shows a tooltip on the Regenerate button", async () => {
      const user = userEvent.setup();
      render(<AIResponseCard sections={baseSections} />);
      expect(screen.queryByText("Regenerate response")).not.toBeInTheDocument();
      await user.hover(screen.getByRole("button", { name: "Regenerate response" }));
      await waitFor(() => expect(screen.getByText("Regenerate response")).toBeInTheDocument(), {
        timeout: 2000
      });
    });
  });
});
