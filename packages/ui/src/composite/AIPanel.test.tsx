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

  it("composes the standard Input and icon-only Button in the message row", () => {
    render(<AIPanel messages={[]} />);

    expect(screen.getByLabelText("Message")).toHaveClass("h-9", "min-w-0", "flex-1");
    expect(screen.getByRole("button", { name: "Send message" })).toHaveClass(
      "bg-[var(--color-button-secondary-bg)]",
      "size-[var(--spacing-34)]"
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

  it("renders a timestamp divider when provided", () => {
    render(
      <AIPanel
        messages={[{ role: "user", content: "Hi", timestamp: "Today - 2:40 PM" }]}
      />
    );
    expect(screen.getByText("Today - 2:40 PM")).toBeInTheDocument();
  });

  it("renders response actions and calls their callbacks", async () => {
    const onThumbsUp = vi.fn();
    const onThumbsDown = vi.fn();
    const onCopy = vi.fn();
    render(
      <AIPanel
        messages={[
          {
            role: "assistant",
            content: "Three accounts show elevated risk.",
            responseActions: { onThumbsUp, onThumbsDown, onCopy, branch: "2/2", edited: true }
          }
        ]}
      />
    );
    expect(screen.getByText("2/2")).toBeInTheDocument();
    expect(screen.getByText("edited")).toBeInTheDocument();

    await userEvent.click(screen.getByRole("button", { name: "Good response" }));
    expect(onThumbsUp).toHaveBeenCalled();
    await userEvent.click(screen.getByRole("button", { name: "Bad response" }));
    expect(onThumbsDown).toHaveBeenCalled();
    await userEvent.click(screen.getByRole("button", { name: "Copy response" }));
    expect(onCopy).toHaveBeenCalled();
  });

  it("renders follow-up buttons inside the bubble and calls onSelect with the label", async () => {
    const onSelect = vi.fn();
    render(
      <AIPanel
        messages={[
          {
            role: "assistant",
            content: "Three accounts show elevated risk.",
            followUps: [{ label: "Show usage trend", onSelect }]
          }
        ]}
      />
    );
    await userEvent.click(screen.getByRole("button", { name: "Show usage trend" }));
    expect(onSelect).toHaveBeenCalledWith("Show usage trend");
  });

  it("defaults follow-ups to the outline treatment and supports the link treatment", () => {
    render(
      <AIPanel
        messages={[
          {
            role: "assistant",
            content: "Three accounts show elevated risk.",
            followUps: [
              { label: "Review draft" },
              { label: "Show sources", variant: "link" }
            ]
          }
        ]}
      />
    );
    expect(screen.getByRole("button", { name: "Review draft" })).toHaveClass(
      "border-[var(--color-button-outline-border)]",
      "border-[1.5px]",
      "text-button-md"
    );
    expect(screen.getByRole("button", { name: "Show sources" })).toHaveClass(
      "text-[var(--color-button-link-on-action)]",
      "text-button-sm"
    );
  });

  it("renders a bot avatar icon next to an assistant message", () => {
    const { container } = render(<AIPanel messages={[{ role: "assistant", content: "Hi" }]} />);
    expect(container.querySelector("svg")).toBeInTheDocument();
  });

  it("gives the user and assistant bubbles their asymmetric square corner", () => {
    render(
      <AIPanel
        messages={[
          { role: "user", content: "Hi" },
          { role: "assistant", content: "Hello" }
        ]}
      />
    );
    expect(screen.getByText("Hi")).toHaveClass("rounded-br-none");
    expect(screen.getByText("Hello").parentElement).toHaveClass("rounded-tl-none");
  });

  it("does not render the response actions row or any follow-up buttons when absent", () => {
    render(<AIPanel messages={[{ role: "assistant", content: "Hi" }]} />);
    expect(screen.queryByRole("button", { name: "Good response" })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Review draft" })).not.toBeInTheDocument();
  });

  it("renders a labeled Suggested follow-ups section with secondary-variant buttons, calling onSelect with the label", async () => {
    const onSelect = vi.fn();
    render(
      <AIPanel
        messages={[
          {
            role: "assistant",
            content: "Three accounts show elevated risk.",
            suggestedFollowUps: [
              { label: "Draft outreach emails for all three" },
              { label: "Show usage trend", onSelect }
            ]
          }
        ]}
      />
    );
    expect(screen.getByText("Suggested follow-ups")).toBeInTheDocument();
    const button = screen.getByRole("button", { name: "Show usage trend" });
    expect(button).toHaveClass("bg-[var(--color-button-secondary-bg)]");
    await userEvent.click(button);
    expect(onSelect).toHaveBeenCalledWith("Show usage trend");
  });

  it("does not render the Suggested follow-ups section when absent", () => {
    render(<AIPanel messages={[{ role: "assistant", content: "Hi" }]} />);
    expect(screen.queryByText("Suggested follow-ups")).not.toBeInTheDocument();
  });
});
