import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./Tabs";
import * as PublicExports from "../../index";

describe("Tabs", () => {
  it("is exported from @lumen/ui's public entry point", () => {
    expect(PublicExports.Tabs).toBe(Tabs);
    expect(PublicExports.TabsList).toBeDefined();
    expect(PublicExports.TabsTrigger).toBeDefined();
    expect(PublicExports.TabsContent).toBeDefined();
  });

  it("shows the default tab's content and switches on trigger click", async () => {
    render(
      <Tabs defaultValue="account">
        <TabsList>
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="password">Password</TabsTrigger>
        </TabsList>
        <TabsContent value="account">Account content</TabsContent>
        <TabsContent value="password">Password content</TabsContent>
      </Tabs>
    );
    expect(screen.getByText("Account content")).toBeInTheDocument();
    expect(screen.queryByText("Password content")).not.toBeInTheDocument();

    await userEvent.click(screen.getByText("Password"));
    expect(screen.getByText("Password content")).toBeInTheDocument();
    expect(screen.queryByText("Account content")).not.toBeInTheDocument();
  });

  it("does not switch to a disabled tab", async () => {
    render(
      <Tabs defaultValue="account">
        <TabsList>
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="password" disabled>
            Password
          </TabsTrigger>
        </TabsList>
        <TabsContent value="account">Account content</TabsContent>
        <TabsContent value="password">Password content</TabsContent>
      </Tabs>
    );
    await userEvent.click(screen.getByText("Password"));
    expect(screen.getByText("Account content")).toBeInTheDocument();
  });
});
