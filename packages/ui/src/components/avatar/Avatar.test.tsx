import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { Avatar, AvatarFallback, AvatarImage } from "./Avatar";
import * as PublicExports from "../../index";

describe("Avatar", () => {
  it("is exported from @lumen/ui's public entry point", () => {
    expect(PublicExports.Avatar).toBe(Avatar);
    expect(PublicExports.AvatarImage).toBeDefined();
    expect(PublicExports.AvatarFallback).toBeDefined();
  });

  // jsdom never fires a real image load event, so Radix Avatar renders its
  // fallback — the same behavior a real broken-image URL would produce.
  it("renders the fallback when the image hasn't loaded", () => {
    render(
      <Avatar>
        <AvatarImage src="https://example.com/avatar.png" alt="User" />
        <AvatarFallback>LU</AvatarFallback>
      </Avatar>
    );
    expect(screen.getByText("LU")).toBeInTheDocument();
  });
});
