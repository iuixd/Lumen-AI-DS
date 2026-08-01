import { afterEach, describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CodeBlock } from "./CodeBlock";

// Shiki's first codeToHtml() call in a given test-file run has to load its
// grammar/theme bundles from scratch, which can comfortably exceed
// testing-library's default 1000ms waitFor/findBy timeout — bump it well
// past that instead of chasing flakiness.
const SHIKI_TIMEOUT = 10000;

describe("CodeBlock", () => {
  it(
    "renders the code text once Shiki finishes highlighting",
    async () => {
      render(<CodeBlock code="SELECT 1;" language="sql" />);
      expect(await screen.findByText(/SELECT/, {}, { timeout: SHIKI_TIMEOUT })).toBeInTheDocument();
    },
    SHIKI_TIMEOUT + 5000
  );

  it("shows the language in the header when no filename is given", () => {
    render(<CodeBlock code="SELECT 1;" language="sql" />);
    expect(screen.getByText("sql")).toBeInTheDocument();
  });

  it("shows the filename in the header when one is given", () => {
    render(<CodeBlock code="SELECT 1;" language="sql" filename="renewals.sql" />);
    expect(screen.getByText("renewals.sql")).toBeInTheDocument();
  });

  it(
    "defaults to sql when no language is given",
    async () => {
      render(<CodeBlock code="SELECT 1;" />);
      expect(screen.getByText("sql")).toBeInTheDocument();
      expect(await screen.findByText(/SELECT/, {}, { timeout: SHIKI_TIMEOUT })).toBeInTheDocument();
    },
    SHIKI_TIMEOUT + 5000
  );

  it(
    "highlights a different language (TSX) via real tokenization",
    async () => {
      render(<CodeBlock code="const x: number = 1;" language="tsx" />);
      expect(await screen.findByText(/const/, {}, { timeout: SHIKI_TIMEOUT })).toBeInTheDocument();
    },
    SHIKI_TIMEOUT + 5000
  );

  it(
    "prefixes each line with its line number when showLineNumbers is set",
    async () => {
      const { container } = render(
        <CodeBlock code={"SELECT 1;\nSELECT 2;"} language="sql" showLineNumbers />
      );
      await waitFor(() => expect(container.querySelectorAll(".line")).toHaveLength(2), { timeout: SHIKI_TIMEOUT });
      expect(container.querySelector(".lm-code-block-line-numbers")).toBeInTheDocument();
    },
    SHIKI_TIMEOUT + 5000
  );

  it(
    "marks the requested lines as highlighted",
    async () => {
      const { container } = render(
        <CodeBlock code={"SELECT 1;\nSELECT 2;\nSELECT 3;"} language="sql" highlightLines={[2]} />
      );
      await waitFor(() => expect(container.querySelectorAll(".line")).toHaveLength(3), { timeout: SHIKI_TIMEOUT });
      expect(container.querySelectorAll(".line-highlighted")).toHaveLength(1);
    },
    SHIKI_TIMEOUT + 5000
  );

  describe("Copy action", () => {
    afterEach(() => {
      vi.restoreAllMocks();
    });

    it(
      "copies the raw code to the clipboard and shows a temporary 'Copied' confirmation",
      async () => {
        const user = userEvent.setup();
        const writeText = vi.spyOn(navigator.clipboard, "writeText").mockResolvedValue(undefined);
        render(<CodeBlock code="SELECT 1;" language="sql" />);
        await user.click(screen.getByRole("button", { name: "Copy code" }));
        await waitFor(() => expect(writeText).toHaveBeenCalledWith("SELECT 1;"), { timeout: SHIKI_TIMEOUT });
        expect(screen.getByRole("button", { name: "Copied" })).toBeInTheDocument();
      },
      SHIKI_TIMEOUT + 5000
    );
  });
});
