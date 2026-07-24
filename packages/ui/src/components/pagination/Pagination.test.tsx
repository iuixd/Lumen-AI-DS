import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink
} from "./Pagination";
import * as PublicExports from "../../index";

describe("Pagination", () => {
  it("is exported from @lumen/ui's public entry point", () => {
    expect(PublicExports.Pagination).toBe(Pagination);
    expect(PublicExports.PaginationContent).toBeDefined();
    expect(PublicExports.PaginationItem).toBeDefined();
    expect(PublicExports.PaginationLink).toBeDefined();
    expect(PublicExports.PaginationPrevious).toBeDefined();
    expect(PublicExports.PaginationNext).toBeDefined();
    expect(PublicExports.PaginationEllipsis).toBeDefined();
  });

  it("renders as a labeled navigation landmark with page links", () => {
    render(
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationLink href="#">1</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#" isActive>
              2
            </PaginationLink>
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    );
    expect(screen.getByRole("navigation", { name: "pagination" })).toBeInTheDocument();
    expect(screen.getByText("2")).toHaveAttribute("aria-current", "page");
  });
});
