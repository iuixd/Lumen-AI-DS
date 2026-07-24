import { describe, expect, it } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./Tooltip";
import * as PublicExports from "../../index";

describe("Tooltip", () => {
  it("is exported from @lumen/ui's public entry point", () => {
    expect(PublicExports.Tooltip).toBe(Tooltip);
    expect(PublicExports.TooltipTrigger).toBeDefined();
    expect(PublicExports.TooltipContent).toBeDefined();
    expect(PublicExports.TooltipProvider).toBeDefined();
  });

  it("is closed by default", () => {
    render(
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>Hover me</TooltipTrigger>
          <TooltipContent>Tooltip body</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
    expect(screen.queryByText("Tooltip body")).not.toBeInTheDocument();
  });

  it("opens on trigger hover", async () => {
    const user = userEvent.setup();
    render(
      <TooltipProvider delayDuration={0}>
        <Tooltip>
          <TooltipTrigger>Hover me</TooltipTrigger>
          <TooltipContent>Tooltip body</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
    await user.hover(screen.getByText("Hover me"));
    await waitFor(() => expect(screen.getByText("Tooltip body")).toBeInTheDocument());
  });
});
