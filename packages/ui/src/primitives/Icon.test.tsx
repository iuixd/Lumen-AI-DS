import { describe, expect, it, vi, afterEach } from "vitest";
import { render } from "@testing-library/react";
import { Icon } from "./Icon";

describe("Icon", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("renders the icon registered under the given name", () => {
    const { container } = render(<Icon name="home" />);
    const svg = container.querySelector("svg");
    expect(svg).toBeInTheDocument();
    expect(svg).toHaveAttribute("viewBox", "0 0 24 24");
  });

  it("forwards props like className to the rendered svg", () => {
    const { container } = render(<Icon name="search" className="size-4" />);
    expect(container.querySelector("svg")).toHaveClass("size-4");
  });

  it("warns and renders nothing for an unknown icon name", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    const { container } = render(<Icon name={"not-a-real-icon" as never} />);
    expect(container.querySelector("svg")).not.toBeInTheDocument();
    expect(warn).toHaveBeenCalled();
  });
});
