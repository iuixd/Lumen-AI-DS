import { describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  ShadcnFormField,
  FormItem,
  FormLabel,
  FormMessage
} from "./Form";
import { Input } from "../input/Input";
import * as PublicExports from "../../index";

const schema = z.object({
  username: z.string().min(2, "Username must be at least 2 characters.")
});

function TestForm({ onSubmit }: { onSubmit?: (values: z.infer<typeof schema>) => void }) {
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: { username: "" }
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit((values) => onSubmit?.(values))}>
        <ShadcnFormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="jsmith" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <button type="submit">Submit</button>
      </form>
    </Form>
  );
}

describe("Form", () => {
  it("is exported from @lumen/ui's public entry point", () => {
    expect(PublicExports.Form).toBeDefined();
    expect(PublicExports.ShadcnFormField).toBeDefined();
    expect(PublicExports.FormItem).toBeDefined();
    expect(PublicExports.FormLabel).toBeDefined();
    expect(PublicExports.FormControl).toBeDefined();
    expect(PublicExports.FormDescription).toBeDefined();
    expect(PublicExports.FormMessage).toBeDefined();
    expect(PublicExports.useFormField).toBeDefined();
  });

  it("renders the labeled field using Lumen's own Input", () => {
    render(<TestForm />);
    expect(screen.getByLabelText("Username")).toBeInTheDocument();
  });

  it("shows a zod validation error and blocks submit for an invalid value", async () => {
    const onSubmit = vi.fn();
    render(<TestForm onSubmit={onSubmit} />);
    await userEvent.click(screen.getByText("Submit"));

    await waitFor(() => {
      expect(screen.getByText("Username must be at least 2 characters.")).toBeInTheDocument();
    });
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("submits with valid values", async () => {
    const onSubmit = vi.fn();
    render(<TestForm onSubmit={onSubmit} />);
    await userEvent.type(screen.getByLabelText("Username"), "jsmith");
    await userEvent.click(screen.getByText("Submit"));

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith({ username: "jsmith" });
    });
  });
});
