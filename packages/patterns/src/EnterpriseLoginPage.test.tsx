import { describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { EnterpriseLoginPage } from "./EnterpriseLoginPage";

describe("EnterpriseLoginPage", () => {
  it("renders the sign-in screen by default with the greeting and both fields", () => {
    render(<EnterpriseLoginPage userName="JohnDoe" />);
    expect(screen.getByRole("heading", { name: "Welcome back, John Doe!" })).toBeInTheDocument();
    expect(screen.getByLabelText("Work email")).toBeInTheDocument();
    expect(screen.getByLabelText("Password")).toBeInTheDocument();
  });

  it("shows an org-detection hint once a recognized work-email domain is typed", async () => {
    const user = userEvent.setup();
    render(<EnterpriseLoginPage />);
    await user.type(screen.getByLabelText("Work email"), "jane@northwind.com");
    expect(screen.getByText(/Northwind Group detected/)).toBeInTheDocument();
  });

  it("toggles password visibility", async () => {
    const user = userEvent.setup();
    render(<EnterpriseLoginPage />);
    const password = screen.getByLabelText("Password");
    expect(password).toHaveAttribute("type", "password");
    await user.click(screen.getByRole("button", { name: "Show password" }));
    expect(password).toHaveAttribute("type", "text");
    await user.click(screen.getByRole("button", { name: "Hide password" }));
    expect(password).toHaveAttribute("type", "password");
  });

  it("advances to the MFA screen after a successful credential submit", async () => {
    const user = userEvent.setup();
    const onSubmitCredentials = vi.fn().mockResolvedValue({ success: true });
    render(<EnterpriseLoginPage onSubmitCredentials={onSubmitCredentials} />);
    await user.type(screen.getByLabelText("Work email"), "jane@lumen.dev");
    await user.type(screen.getByLabelText("Password"), "hunter22222");
    await user.click(screen.getByRole("button", { name: "Continue with email" }));
    expect(onSubmitCredentials).toHaveBeenCalledWith("jane@lumen.dev", "hunter22222");
    await waitFor(() => expect(screen.getByRole("heading", { name: "Verify it's you" })).toBeInTheDocument());
  });

  it("shows the inline error and stays on sign-in when credentials are rejected", async () => {
    const user = userEvent.setup();
    const onSubmitCredentials = vi.fn().mockResolvedValue({ success: false, error: "Wrong password." });
    render(<EnterpriseLoginPage onSubmitCredentials={onSubmitCredentials} />);
    await user.type(screen.getByLabelText("Work email"), "jane@lumen.dev");
    await user.type(screen.getByLabelText("Password"), "wrongpass");
    await user.click(screen.getByRole("button", { name: "Continue with email" }));
    await waitFor(() => expect(screen.getByRole("alert")).toHaveTextContent("Wrong password."));
    expect(screen.getByRole("heading", { name: /Welcome back/ })).toBeInTheDocument();
  });

  it("starts the passkey ceremony and completes it on success", async () => {
    const user = userEvent.setup();
    let resolvePasskey: (value: boolean) => void = () => {};
    const onStartPasskey = vi.fn(() => new Promise<boolean>((resolve) => (resolvePasskey = resolve)));
    render(<EnterpriseLoginPage onStartPasskey={onStartPasskey} orgName="Acme Legal" />);
    await user.click(screen.getByRole("button", { name: "Continue with passkey" }));
    expect(screen.getByRole("heading", { name: "Waiting for your passkey" })).toBeInTheDocument();
    resolvePasskey(true);
    await waitFor(() => expect(screen.getByRole("heading", { name: "Signed in" })).toBeInTheDocument());
    expect(screen.getByText(/Acme Legal/)).toBeInTheDocument();
  });

  it("falls back to the sign-in screen when the passkey ceremony fails", async () => {
    const user = userEvent.setup();
    const onStartPasskey = vi.fn().mockResolvedValue(false);
    render(<EnterpriseLoginPage onStartPasskey={onStartPasskey} />);
    await user.click(screen.getByRole("button", { name: "Continue with passkey" }));
    await waitFor(() => expect(screen.getByRole("heading", { name: /Welcome back/ })).toBeInTheDocument());
  });

  it("auto-advances focus across the MFA code cells and enables Verify only once all 6 are filled", async () => {
    const user = userEvent.setup();
    render(<EnterpriseLoginPage initialScreen="mfa" />);
    const verify = screen.getByRole("button", { name: "Verify and continue" });
    const digits = screen.getAllByLabelText(/^Digit \d$/);
    expect(verify).toBeDisabled();
    await user.click(digits[0]);
    await user.keyboard("12345");
    expect(verify).toBeDisabled();
    expect(document.activeElement).toBe(digits[5]);
    await user.keyboard("6");
    expect(verify).not.toBeDisabled();
  });

  it("calls onVerifyMfaCode with the joined code and advances to Signed in", async () => {
    const user = userEvent.setup();
    const onVerifyMfaCode = vi.fn().mockResolvedValue(true);
    render(<EnterpriseLoginPage initialScreen="mfa" onVerifyMfaCode={onVerifyMfaCode} />);
    const digits = screen.getAllByLabelText(/^Digit \d$/);
    await user.click(digits[0]);
    for (const digit of "123456") {
      await user.keyboard(digit);
    }
    await user.click(screen.getByRole("button", { name: "Verify and continue" }));
    expect(onVerifyMfaCode).toHaveBeenCalledWith("123456");
    await waitFor(() => expect(screen.getByRole("heading", { name: "Signed in" })).toBeInTheDocument());
  });

  it("returns from MFA to the sign-in screen via Back", async () => {
    const user = userEvent.setup();
    render(<EnterpriseLoginPage initialScreen="mfa" />);
    await user.click(screen.getByRole("button", { name: "Back" }));
    expect(screen.getByRole("heading", { name: /Welcome back/ })).toBeInTheDocument();
  });

  it("renders each initialScreen directly, for preview/testing", () => {
    const { unmount: unmount1 } = render(<EnterpriseLoginPage initialScreen="passkey" />);
    expect(screen.getByRole("heading", { name: "Waiting for your passkey" })).toBeInTheDocument();
    unmount1();

    const { unmount: unmount2 } = render(<EnterpriseLoginPage initialScreen="done" />);
    expect(screen.getByRole("heading", { name: "Signed in" })).toBeInTheDocument();
    unmount2();
  });

  it("renders recent workspace chips when provided, and omits the section when empty", () => {
    const { rerender } = render(
      <EnterpriseLoginPage recentWorkspaces={[{ id: "n", name: "Northwind Group", initial: "N" }]} />
    );
    expect(screen.getByRole("button", { name: /Northwind Group/ })).toBeInTheDocument();
    rerender(<EnterpriseLoginPage recentWorkspaces={[]} />);
    expect(screen.queryByText("Recent workspaces")).not.toBeInTheDocument();
  });

  it("calls onSsoSignIn with the provider id", async () => {
    const user = userEvent.setup();
    const onSsoSignIn = vi.fn();
    render(<EnterpriseLoginPage onSsoSignIn={onSsoSignIn} />);
    await user.click(screen.getByRole("button", { name: "Continue with Microsoft" }));
    expect(onSsoSignIn).toHaveBeenCalledWith("microsoft");
  });

  it("toggles the remember-device checkbox", async () => {
    const user = userEvent.setup();
    render(<EnterpriseLoginPage />);
    const checkbox = screen.getByRole("checkbox", { name: /Remember this device/ });
    expect(checkbox).toBeChecked();
    await user.click(checkbox);
    expect(checkbox).not.toBeChecked();
  });

  it("calls onComplete once the passkey ceremony reaches Signed in", async () => {
    const user = userEvent.setup();
    const onComplete = vi.fn();
    const onStartPasskey = vi.fn().mockResolvedValue(true);
    render(<EnterpriseLoginPage onStartPasskey={onStartPasskey} onComplete={onComplete} />);
    await user.click(screen.getByRole("button", { name: "Continue with passkey" }));
    await waitFor(() => expect(screen.getByRole("heading", { name: "Signed in" })).toBeInTheDocument());
    expect(onComplete).toHaveBeenCalledOnce();
  });
});
