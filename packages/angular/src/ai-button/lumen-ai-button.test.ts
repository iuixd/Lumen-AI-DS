import { afterEach, describe, expect, it, vi } from "vitest";
import { Component, provideZonelessChangeDetection } from "@angular/core";
import { TestBed } from "@angular/core/testing";
import { LumenAIButtonComponent, type LumenAIButtonVariant } from "./lumen-ai-button";

@Component({
  standalone: true,
  imports: [LumenAIButtonComponent],
  template: `
    <lumen-ai-button
      [variant]="variant"
      [loading]="loading"
      [disabled]="disabled"
      [destructive]="destructive"
      (click)="onClick()"
    >
      Summarize
    </lumen-ai-button>
  `
})
class TestHostComponent {
  variant: LumenAIButtonVariant = "primary";
  loading = false;
  disabled = false;
  destructive = false;
  clicked = 0;
  onClick() {
    this.clicked++;
  }
}

function innerButton(root: HTMLElement): HTMLButtonElement {
  return root.querySelector("lumen-ai-button button")!;
}

describe("LumenAIButtonComponent", () => {
  afterEach(() => {
    TestBed.resetTestingModule();
  });

  function createHost(overrides: Partial<TestHostComponent> = {}) {
    TestBed.configureTestingModule({ providers: [provideZonelessChangeDetection()] });
    const fixture = TestBed.createComponent(TestHostComponent);
    Object.assign(fixture.componentInstance, overrides);
    fixture.detectChanges();
    return fixture;
  }

  it("renders its projected label with a default lm-aisymbol icon", () => {
    const fixture = createHost();
    const button = innerButton(fixture.nativeElement);
    expect(button.textContent).toContain("Summarize");
    expect(button.querySelector("svg")).not.toBeNull();
  });

  it("fires a click that reaches the host template's listener", () => {
    const fixture = createHost();
    innerButton(fixture.nativeElement).click();
    expect(fixture.componentInstance.clicked).toBe(1);
  });

  it("does not let the click reach the host listener when disabled", () => {
    const fixture = createHost({ disabled: true });
    innerButton(fixture.nativeElement).click();
    expect(fixture.componentInstance.clicked).toBe(0);
  });

  it("marks aria-disabled and aria-busy while loading, replacing the icon with a spinner", () => {
    const fixture = createHost({ loading: true });
    const button = innerButton(fixture.nativeElement);
    expect(button.getAttribute("aria-disabled")).toBe("true");
    expect(button.getAttribute("aria-busy")).toBe("true");
    expect(button.querySelector(".spinner")).not.toBeNull();
  });

  it("does not let the click reach the host listener while loading", () => {
    const fixture = createHost({ loading: true });
    innerButton(fixture.nativeElement).click();
    expect(fixture.componentInstance.clicked).toBe(0);
  });

  it("warns when an icon-only button has no accessible name", async () => {
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
    TestBed.configureTestingModule({ providers: [provideZonelessChangeDetection()] });
    const fixture = TestBed.createComponent(LumenAIButtonComponent);
    fixture.componentRef.setInput("iconOnly", true);
    fixture.detectChanges();
    await fixture.whenStable();
    expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining("accessible name"));
    warnSpy.mockRestore();
  });

  it.each(["primary", "secondary", "tertiary", "outline"] as const)(
    "reflects variant=%s as a host attribute",
    (variant) => {
      const fixture = createHost({ variant });
      expect(fixture.nativeElement.querySelector("lumen-ai-button")!.getAttribute("variant")).toBe(variant);
    }
  );

  it("marks destructive intent via a data attribute without changing behavior otherwise", () => {
    const fixture = createHost({ variant: "secondary", destructive: true });
    expect(innerButton(fixture.nativeElement).getAttribute("data-destructive")).toBe("true");
  });
});
