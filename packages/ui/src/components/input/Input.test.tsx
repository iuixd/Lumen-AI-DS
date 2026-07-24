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
});
