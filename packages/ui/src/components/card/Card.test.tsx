import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./Card";
import * as PublicExports from "../../index";

describe("Card", () => {
  it("is exported from @lumen/ui's public entry point", () => {
    expect(PublicExports.Card).toBe(Card);
    expect(PublicExports.CardHeader).toBeDefined();
    expect(PublicExports.CardTitle).toBeDefined();
    expect(PublicExports.CardDescription).toBeDefined();
    expect(PublicExports.CardContent).toBeDefined();
    expect(PublicExports.CardFooter).toBeDefined();
  });

  it("renders its title, description, and content", () => {
    render(
      <Card>
        <CardHeader>
          <CardTitle>Create project</CardTitle>
          <CardDescription>Deploy in one click.</CardDescription>
        </CardHeader>
        <CardContent>Body content</CardContent>
      </Card>
    );
    expect(screen.getByText("Create project")).toBeInTheDocument();
    expect(screen.getByText("Deploy in one click.")).toBeInTheDocument();
    expect(screen.getByText("Body content")).toBeInTheDocument();
  });
});
