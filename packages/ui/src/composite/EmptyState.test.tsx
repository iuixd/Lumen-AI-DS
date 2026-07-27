import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { EmptyState } from "./EmptyState";

describe("EmptyState", () => {
  it("renders the default dashed-border pattern when no variant is given", () => {
    const { container } = render(<EmptyState title="No records yet" description="Nothing here." />);
    expect(screen.getByText("No records yet")).toBeInTheDocument();
    expect(screen.getByText("Nothing here.")).toBeInTheDocument();
    expect(container.firstElementChild).toHaveClass("border-dashed");
  });

  it("renders the ai variant's branded card, icon badge, and action row instead of the dashed pattern", () => {
    const { container } = render(
      <EmptyState
        variant="ai"
        title="Ask AI to get started"
        description="Connect a data source or upload a file, then ask anything about your accounts."
        icon={<span data-testid="empty-state-icon" />}
        action={<button type="button">Connect data source</button>}
      />
    );
    expect(screen.getByText("Ask AI to get started")).toBeInTheDocument();
    expect(
      screen.getByText("Connect a data source or upload a file, then ask anything about your accounts.")
    ).toBeInTheDocument();
    expect(screen.getByTestId("empty-state-icon")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Connect data source" })).toBeInTheDocument();
    expect(container.firstElementChild).not.toHaveClass("border-dashed");
    expect(container.firstElementChild).toHaveClass("border-[var(--color-border-table)]");
  });

  it("omits the icon badge and action row when neither is provided in the ai variant", () => {
    render(<EmptyState variant="ai" title="Ask AI to get started" />);
    expect(screen.getByText("Ask AI to get started")).toBeInTheDocument();
  });
});
