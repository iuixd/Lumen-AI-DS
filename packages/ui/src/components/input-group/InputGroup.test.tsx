import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput, InputGroupText, InputGroupTextarea } from "./InputGroup";
import * as PublicExports from "../../index";

describe("InputGroup", () => {
  it("is exported from @lumen/ui's public entry point", () => {
    expect(PublicExports.InputGroup).toBe(InputGroup);
    expect(PublicExports.InputGroupAddon).toBeDefined();
    expect(PublicExports.InputGroupButton).toBeDefined();
    expect(PublicExports.InputGroupInput).toBeDefined();
    expect(PublicExports.InputGroupText).toBeDefined();
    expect(PublicExports.InputGroupTextarea).toBeDefined();
  });

  it("accepts typed input through InputGroupInput", async () => {
    render(
      <InputGroup>
        <InputGroupInput placeholder="Search" />
      </InputGroup>
    );
    const input = screen.getByPlaceholderText("Search");
    await userEvent.type(input, "hello");
    expect(input).toHaveValue("hello");
  });

  it("renders addon text content alongside the input without altering its own focus", async () => {
    render(
      <InputGroup>
        <InputGroupInput placeholder="Search" />
        <InputGroupAddon align="inline-end" data-testid="addon">
          <InputGroupText>units</InputGroupText>
        </InputGroupAddon>
      </InputGroup>
    );
    expect(screen.getByText("units")).toBeInTheDocument();
    const input = screen.getByPlaceholderText("Search");
    expect(input).not.toHaveFocus();
    await userEvent.click(screen.getByTestId("addon"));
    // InputGroupAddon intentionally has no click-to-focus-sibling behavior
    // (see internal/input-group.tsx's adaptation notes) — clicking it must
    // not incidentally move focus anywhere.
    expect(input).not.toHaveFocus();
  });

  it("still lets a button inside an addon receive its own clicks", async () => {
    const onClick = vi.fn();
    render(
      <InputGroup>
        <InputGroupInput placeholder="Search" />
        <InputGroupAddon align="inline-end">
          <InputGroupButton onClick={onClick}>Go</InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
    );
    await userEvent.click(screen.getByText("Go"));
    expect(onClick).toHaveBeenCalled();
  });

  it("marks the control invalid via aria-invalid", () => {
    render(
      <InputGroup>
        <InputGroupInput placeholder="Email" aria-invalid="true" />
      </InputGroup>
    );
    expect(screen.getByPlaceholderText("Email")).toHaveAttribute("aria-invalid", "true");
  });

  it("renders InputGroupTextarea as a real textarea accepting multiline input", async () => {
    render(
      <InputGroup>
        <InputGroupTextarea placeholder="Message" />
      </InputGroup>
    );
    const textarea = screen.getByPlaceholderText("Message");
    expect(textarea.tagName).toBe("TEXTAREA");
    await userEvent.type(textarea, "line one{enter}line two");
    expect(textarea).toHaveValue("line one\nline two");
  });

  it("disables InputGroupInput when the disabled prop is passed", () => {
    render(
      <InputGroup>
        <InputGroupInput placeholder="Search" disabled />
      </InputGroup>
    );
    expect(screen.getByPlaceholderText("Search")).toBeDisabled();
  });
});
