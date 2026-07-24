import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { ButtonGroup, ButtonGroupSeparator, ButtonGroupText } from "./ButtonGroup";
import { Button } from "../button/Button";
import * as PublicExports from "../../index";

describe("ButtonGroup", () => {
  it("is exported from @lumen/ui's public entry point", () => {
    expect(PublicExports.ButtonGroup).toBe(ButtonGroup);
    expect(PublicExports.ButtonGroupText).toBeDefined();
    expect(PublicExports.ButtonGroupSeparator).toBeDefined();
  });

  it("renders as a group role with its buttons", () => {
    render(
      <ButtonGroup>
        <Button>Left</Button>
        <Button>Right</Button>
      </ButtonGroup>
    );
    expect(screen.getByRole("group")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Left" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Right" })).toBeInTheDocument();
  });

  it("reflects orientation via a data attribute", () => {
    render(
      <ButtonGroup orientation="vertical" data-testid="group">
        <Button>Top</Button>
      </ButtonGroup>
    );
    expect(screen.getByTestId("group")).toHaveAttribute("data-orientation", "vertical");
  });

  it("renders static text alongside buttons", () => {
    render(
      <ButtonGroup>
        <Button>Copy</Button>
        <ButtonGroupSeparator />
        <ButtonGroupText>Read-only</ButtonGroupText>
      </ButtonGroup>
    );
    expect(screen.getByText("Read-only")).toBeInTheDocument();
  });
});
