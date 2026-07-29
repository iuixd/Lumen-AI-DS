import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { CodeBlock } from "./CodeBlock";

describe("CodeBlock", () => {
  it("renders the code text inside a <pre>", () => {
    const { container } = render(<CodeBlock code="SELECT 1;" language="sql" />);
    expect(container.querySelector("pre")).toBeInTheDocument();
    expect(screen.getByText(/SELECT/)).toBeInTheDocument();
  });

  it("applies the Figma-exact keyword color to SQL keywords", () => {
    render(<CodeBlock code="SELECT account FROM renewals;" language="sql" />);
    const keyword = screen.getByText("SELECT");
    expect(keyword).toHaveStyle({ color: "var(--color-code-syntax-keyword)" });
  });

  it("applies the Figma-exact string color to string literals", () => {
    render(<CodeBlock code={`SELECT 1 WHERE quarter = 'Q3';`} language="sql" />);
    const stringToken = screen.getByText("'Q3'");
    expect(stringToken).toHaveStyle({ color: "var(--color-code-syntax-string)" });
  });

  it("leaves plain tokens (e.g. identifiers) at the default text color", () => {
    render(<CodeBlock code="SELECT account FROM renewals;" language="sql" />);
    const identifier = screen.getByText("account");
    expect(identifier).not.toHaveStyle({ color: "var(--color-code-syntax-keyword)" });
    expect(identifier).not.toHaveStyle({ color: "var(--color-code-syntax-string)" });
  });

  it("highlights a different language (TypeScript) via real tokenization", () => {
    render(<CodeBlock code="const x: number = 1;" language="tsx" />);
    expect(screen.getByText("const")).toHaveStyle({ color: "var(--color-code-syntax-keyword)" });
  });

  it("defaults to sql when no language is given", () => {
    render(<CodeBlock code="SELECT 1;" />);
    expect(screen.getByText("SELECT")).toHaveStyle({ color: "var(--color-code-syntax-keyword)" });
  });
});
