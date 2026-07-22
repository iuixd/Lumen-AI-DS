import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AIPanel, type AIPanelMessage } from "./AIPanel";

const messages: AIPanelMessage[] = [
  { role: "user", content: "Which renewals should I focus on this week?" },
  {
    role: "assistant",
    content: "Start with Meridian Health.",
    actions: <button>Review draft</button>
  }
];

describe("AIPanel", () => {
  it("renders the title", () => {
    render(<AIPanel title="Assistant" messages={[]} />);
    expect(screen.getByText("Assistant")).toBeInTheDocument();
  });

  it("renders user and assistant message content", () => {
    render(<AIPanel messages={messages} />);
    expect(screen.getByText("Which renewals should I focus on this week?")).toBeInTheDocument();
    expect(screen.getByText("Start with Meridian Health.")).toBeInTheDocument();
  });

  it("renders assistant message actions when provided", () => {
    render(<AIPanel messages={messages} />);
    expect(screen.getByRole("button", { name: "Review draft" })).toBeInTheDocument();
  });

  it("shows the +Thread control only when onNewThread is provided", () => {
    const { rerender } = render(<AIPanel messages={[]} />);
    expect(screen.queryByRole("button", { name: "+ Thread" })).not.toBeInTheDocument();

    rerender(<AIPanel messages={[]} onNewThread={() => {}} />);
    expect(screen.getByRole("button", { name: "+ Thread" })).toBeInTheDocument();
  });

  it("calls onSend with the trimmed input value and clears the input on submit", async () => {
    const onSend = vi.fn();
    render(<AIPanel messages={[]} onSend={onSend} />);
    const input = screen.getByLabelText("Message");
    await userEvent.type(input, "  Hello  ");
    await userEvent.click(screen.getByRole("button", { name: "Send message" }));
    expect(onSend).toHaveBeenCalledWith("Hello");
    expect(input).toHaveValue("");
  });

  it("composes the standard Input and icon-only accent Button in the message row", () => {
    render(<AIPanel messages={[]} />);

    expect(screen.getByLabelText("Message")).toHaveClass(
      "bg-[var(--color-input-primary-bg)]",
      "h-[var(--spacing-36)]"
    );
    expect(screen.getByRole("button", { name: "Send message" })).toHaveClass(
      "bg-[var(--color-button-accent-bg)]",
      "size-[var(--spacing-32)]"
    );
  });

  it("does not call onSend for an empty or whitespace-only submission", async () => {
    const onSend = vi.fn();
    render(<AIPanel messages={[]} onSend={onSend} />);
    await userEvent.type(screen.getByLabelText("Message"), "   ");
    await userEvent.click(screen.getByRole("button", { name: "Send message" }));
    expect(onSend).not.toHaveBeenCalled();
  });

  it("exposes the message list as a labeled live region", () => {
    render(<AIPanel messages={[]} />);
    expect(screen.getByRole("log", { name: "Conversation" })).toBeInTheDocument();
  });
});
