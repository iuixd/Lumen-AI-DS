import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Input } from "./Input";
import * as PublicExports from "../../index";

describe("Input", () => {
  it("is exported from @lumen/ui's public entry point", () => {
    expect(PublicExports.Input).toBe(Input);
  });

  it("accepts typed input", async () => {
    render(<Input placeholder="Email" />);
    const input = screen.getByPlaceholderText("Email");
    await userEvent.type(input, "hello@example.com");
    expect(input).toHaveValue("hello@example.com");
  });

  it("can be disabled", () => {
    render(<Input placeholder="Email" disabled />);
    expect(screen.getByPlaceholderText("Email")).toBeDisabled();
  });

  it("defaults to size md and variant primary", () => {
    render(<Input placeholder="Email" />);
    const input = screen.getByPlaceholderText("Email");
    expect(input.className).toContain("h-[var(--spacing-44)]");
    expect(input.className).toContain("bg-[var(--color-input-primary-bg)]");
  });

  it("applies the requested size's height", () => {
    render(<Input placeholder="Small" size="sm" />);
    expect(screen.getByPlaceholderText("Small").className).toContain("h-[var(--spacing-36)]");
  });

  it("applies the search variant's background", () => {
    render(<Input placeholder="Search" variant="search" />);
    expect(screen.getByPlaceholderText("Search").className).toContain(
      "bg-[var(--color-input-search-bg)]"
    );
  });

  it("forwards a ref to the underlying input element", () => {
    const ref = { current: null as HTMLInputElement | null };
    render(<Input placeholder="Email" ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLInputElement);
  });
});
