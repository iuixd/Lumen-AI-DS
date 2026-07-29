import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { LumenLogo } from "./LumenLogo";

describe("LumenLogo", () => {
  it("renders an image with the default 'Lumen' accessible name", () => {
    render(<LumenLogo />);
    expect(screen.getByRole("img", { name: "Lumen" })).toBeInTheDocument();
  });

  it("renders as decorative (no accessible name) when title is empty", () => {
    render(<LumenLogo title="" />);
    expect(screen.queryByRole("img")).not.toBeInTheDocument();
  });

  it("merges a custom className with its default sizing classes", () => {
    render(<LumenLogo className="h-[21.8788px] w-[21.2423px]" />);
    const img = screen.getByRole("img", { name: "Lumen" });
    expect(img).toHaveClass("h-[21.8788px]", "w-[21.2423px]");
  });

  it("points its src at the committed SVG asset", () => {
    render(<LumenLogo />);
    expect(screen.getByRole("img", { name: "Lumen" })).toHaveAttribute(
      "src",
      expect.stringContaining("lumen-logo.svg")
    );
  });
});
