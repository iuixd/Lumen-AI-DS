import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AuthForm } from "./AuthForm";

describe("AuthForm", () => {
  it("renders the sign-in fields by default", () => {
    render(<AuthForm />);
    expect(screen.getByRole("heading", { name: "Sign in" })).toBeInTheDocument();
    expect(screen.getByLabelText("Work email", { exact: false })).toBeInTheDocument();
    expect(screen.getByLabelText("Password", { exact: false })).toBeInTheDocument();
  });

  it("renders sign-up copy in sign-up mode", () => {
    render(<AuthForm mode="sign-up" />);
    expect(screen.getByRole("heading", { name: "Create your account" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Create account" })).toBeInTheDocument();
  });

  it("calls onSubmit when the form is submitted", async () => {
    const onSubmit = vi.fn((e: React.FormEvent) => e.preventDefault());
    render(<AuthForm onSubmit={onSubmit} />);
    await userEvent.type(screen.getByLabelText("Work email", { exact: false }), "jane@lumen.dev");
    await userEvent.type(screen.getByLabelText("Password", { exact: false }), "hunter22222");
    await userEvent.click(screen.getByRole("button", { name: "Sign in" }));
    expect(onSubmit).toHaveBeenCalledOnce();
  });
});
