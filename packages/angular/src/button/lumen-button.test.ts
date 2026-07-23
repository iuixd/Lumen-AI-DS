import { afterEach, describe, expect, it, vi } from "vitest";
import { Component, provideZonelessChangeDetection } from "@angular/core";
import { TestBed } from "@angular/core/testing";
import {
  LumenButtonComponent,
  type LumenButtonSize,
  type LumenButtonVariant
} from "./lumen-button";

@Component({
  standalone: true,
  imports: [LumenButtonComponent],
  template: `<lumen-button
    [variant]="variant"
    [size]="size"
    [disabled]="disabled"
    (click)="onClick()"
    ><span iconStart>S</span>Save<span iconEnd>E</span></lumen-button
  >`
})
class TestHostComponent {
  variant: LumenButtonVariant = "primary";
  size: LumenButtonSize = "md";
  disabled = false;
  clicked = 0;
  onClick() {
    this.clicked += 1;
  }
}

describe("LumenButtonComponent", () => {
  afterEach(() => TestBed.resetTestingModule());

  function createHost(overrides: Partial<TestHostComponent> = {}) {
    TestBed.configureTestingModule({ providers: [provideZonelessChangeDetection()] });
    const fixture = TestBed.createComponent(TestHostComponent);
    Object.assign(fixture.componentInstance, overrides);
    fixture.detectChanges();
    return fixture;
  }

  it("defaults to primary md and renders projected content", () => {
    const fixture = createHost();
    const host = fixture.nativeElement.querySelector("lumen-button")!;
    expect(host.getAttribute("variant")).toBe("primary");
    expect(host.getAttribute("size")).toBe("md");
    expect(host.querySelector("button").textContent).toContain("Save");
    expect(host.querySelector("[iconStart]")).not.toBeNull();
    expect(host.querySelector("[iconEnd]")).not.toBeNull();
  });

  it.each(["primary", "accent", "secondary", "outline", "ghost", "destructive"] as const)(
    "reflects variant=%s for styling",
    (variant) => {
      const fixture = createHost({ variant });
      expect(fixture.nativeElement.querySelector("lumen-button").getAttribute("variant")).toBe(
        variant
      );
    }
  );

  it.each(["sm", "md", "lg", "xl"] as const)("reflects size=%s for styling", (size) => {
    const fixture = createHost({ size });
    expect(fixture.nativeElement.querySelector("lumen-button").getAttribute("size")).toBe(size);
  });

  it("binds the Figma Ghost hover surface role", () => {
    const styles = (LumenButtonComponent as unknown as { ɵcmp: { styles: string[] } }).ɵcmp.styles;
    expect(styles.join("\n")).toContain("var(--color-button-ghost-hover-bg)");
  });

  it("allows activation when enabled", () => {
    const fixture = createHost();
    fixture.nativeElement.querySelector("button").click();
    expect(fixture.componentInstance.clicked).toBe(1);
  });

  it("blocks activation and exposes aria-disabled when disabled", () => {
    const fixture = createHost({ disabled: true });
    const button = fixture.nativeElement.querySelector("button")!;
    const listener = vi.fn();
    fixture.nativeElement.querySelector("lumen-button").addEventListener("click", listener);
    button.click();
    expect(button.getAttribute("aria-disabled")).toBe("true");
    expect(fixture.componentInstance.clicked).toBe(0);
    expect(listener).not.toHaveBeenCalled();
  });
});
