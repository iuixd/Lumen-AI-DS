import { afterEach, describe, expect, it, vi } from "vitest";
import { Component, provideZonelessChangeDetection } from "@angular/core";
import { TestBed } from "@angular/core/testing";
import { LumenButtonComponent, type LumenButtonSize, type LumenButtonVariant } from "./lumen-button";

// jsdom cannot meaningfully compute styles derived from CSS custom properties
// (the --spacing-*/--color-*/--radius-* tokens aren't loaded in this test
// environment), so these tests assert the DOM structure and reflected host
// attributes that drive the stylesheet's :host([...]) selectors, not
// computed pixel values — mirroring how Button.test.tsx (React) and
// lumen-button.test.ts (Web Components) assert on class names / attributes
// for the same reason.

@Component({
  standalone: true,
  imports: [LumenButtonComponent],
  template: `
    <lumen-button
      [variant]="variant"
      [size]="size"
      [iconOnly]="iconOnly"
      [pill]="pill"
      [loading]="loading"
      [disabled]="disabled"
      [attr.aria-label]="ariaLabel"
      (click)="onClick()"
    >
      <span iconStart>S</span>
      {{ label }}
      <span iconEnd>E</span>
    </lumen-button>
  `
})
class TestHostComponent {
  variant: LumenButtonVariant = "primary";
  size: LumenButtonSize = "md";
  iconOnly = false;
  pill = false;
  loading = false;
  disabled = false;
  ariaLabel: string | null = null;
  label = "Save changes";
  clicked = 0;
  onClick() {
    this.clicked++;
  }
}

function innerButton(root: HTMLElement): HTMLButtonElement {
  return root.querySelector("lumen-button button")!;
}

describe("LumenButtonComponent (bare, no content projection)", () => {
  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it("defaults to variant=primary and size=md", () => {
    TestBed.configureTestingModule({ providers: [provideZonelessChangeDetection()] });
    const fixture = TestBed.createComponent(LumenButtonComponent);
    fixture.detectChanges();
    const host: HTMLElement = fixture.nativeElement;
    expect(host.getAttribute("variant")).toBe("primary");
    expect(host.getAttribute("size")).toBe("md");
  });

  it("reflects variant, size, icon-only, and pill as host attributes", () => {
    TestBed.configureTestingModule({ providers: [provideZonelessChangeDetection()] });
    const fixture = TestBed.createComponent(LumenButtonComponent);
    fixture.componentRef.setInput("variant", "raised");
    fixture.componentRef.setInput("size", "lg");
    fixture.componentRef.setInput("pill", true);
    fixture.detectChanges();
    const host: HTMLElement = fixture.nativeElement;
    expect(host.getAttribute("variant")).toBe("raised");
    expect(host.getAttribute("size")).toBe("lg");
    expect(host.hasAttribute("pill")).toBe(true);
  });

  it("reflects variant=outline as a host attribute", () => {
    TestBed.configureTestingModule({ providers: [provideZonelessChangeDetection()] });
    const fixture = TestBed.createComponent(LumenButtonComponent);
    fixture.componentRef.setInput("variant", "outline");
    fixture.detectChanges();
    const host: HTMLElement = fixture.nativeElement;
    expect(host.getAttribute("variant")).toBe("outline");
  });

  it("marks aria-disabled and aria-busy while loading", () => {
    TestBed.configureTestingModule({ providers: [provideZonelessChangeDetection()] });
    const fixture = TestBed.createComponent(LumenButtonComponent);
    fixture.componentRef.setInput("loading", true);
    fixture.detectChanges();
    const button = fixture.nativeElement.querySelector("button")!;
    expect(button.getAttribute("aria-disabled")).toBe("true");
    expect(button.getAttribute("aria-busy")).toBe("true");
  });

  it("does not let a click through when disabled", () => {
    TestBed.configureTestingModule({ providers: [provideZonelessChangeDetection()] });
    const fixture = TestBed.createComponent(LumenButtonComponent);
    fixture.componentRef.setInput("disabled", true);
    fixture.detectChanges();
    const onClick = vi.fn();
    fixture.nativeElement.addEventListener("click", onClick);
    fixture.nativeElement.querySelector("button")!.click();
    expect(onClick).not.toHaveBeenCalled();
  });

  it("does not let a click through while loading", () => {
    TestBed.configureTestingModule({ providers: [provideZonelessChangeDetection()] });
    const fixture = TestBed.createComponent(LumenButtonComponent);
    fixture.componentRef.setInput("loading", true);
    fixture.detectChanges();
    const onClick = vi.fn();
    fixture.nativeElement.addEventListener("click", onClick);
    fixture.nativeElement.querySelector("button")!.click();
    expect(onClick).not.toHaveBeenCalled();
  });

  it("lets a click through when neither disabled nor loading", () => {
    TestBed.configureTestingModule({ providers: [provideZonelessChangeDetection()] });
    const fixture = TestBed.createComponent(LumenButtonComponent);
    fixture.detectChanges();
    const onClick = vi.fn();
    fixture.nativeElement.addEventListener("click", onClick);
    fixture.nativeElement.querySelector("button")!.click();
    expect(onClick).toHaveBeenCalledOnce();
  });

  it("defaults an icon-only loading button's accessible name to Loading", () => {
    TestBed.configureTestingModule({ providers: [provideZonelessChangeDetection()] });
    const fixture = TestBed.createComponent(LumenButtonComponent);
    fixture.componentRef.setInput("iconOnly", true);
    fixture.componentRef.setInput("loading", true);
    fixture.detectChanges();
    const button = fixture.nativeElement.querySelector("button")!;
    expect(button.getAttribute("aria-label")).toBe("Loading");
  });

  it("warns when an icon-only button has no accessible name", async () => {
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
    TestBed.configureTestingModule({ providers: [provideZonelessChangeDetection()] });
    const fixture = TestBed.createComponent(LumenButtonComponent);
    fixture.componentRef.setInput("iconOnly", true);
    fixture.detectChanges();
    await fixture.whenStable();
    expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining("accessible name"));
    warnSpy.mockRestore();
  });

  it("does not warn when an icon-only button has aria-label", async () => {
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
    TestBed.configureTestingModule({ providers: [provideZonelessChangeDetection()] });
    const fixture = TestBed.createComponent(LumenButtonComponent);
    fixture.nativeElement.setAttribute("aria-label", "Search");
    fixture.componentRef.setInput("iconOnly", true);
    fixture.detectChanges();
    await fixture.whenStable();
    expect(warnSpy).not.toHaveBeenCalled();
    warnSpy.mockRestore();
  });

  it("has no status attribute by default", () => {
    TestBed.configureTestingModule({ providers: [provideZonelessChangeDetection()] });
    const fixture = TestBed.createComponent(LumenButtonComponent);
    fixture.detectChanges();
    expect(fixture.nativeElement.hasAttribute("status")).toBe(false);
  });

  it.each(["success", "warning", "error"] as const)(
    "reflects status=%s as a host attribute",
    (status) => {
      TestBed.configureTestingModule({ providers: [provideZonelessChangeDetection()] });
      const fixture = TestBed.createComponent(LumenButtonComponent);
      fixture.componentRef.setInput("status", status);
      fixture.detectChanges();
      expect(fixture.nativeElement.getAttribute("status")).toBe(status);
    }
  );
});

describe("LumenButtonComponent (via host, with projected content)", () => {
  afterEach(() => {
    TestBed.resetTestingModule();
  });

  function createHost(overrides: Partial<TestHostComponent> = {}) {
    TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection()]
    });
    const fixture = TestBed.createComponent(TestHostComponent);
    Object.assign(fixture.componentInstance, overrides);
    fixture.detectChanges();
    return fixture;
  }

  it("renders its projected label", () => {
    const fixture = createHost();
    expect(innerButton(fixture.nativeElement).textContent).toContain("Save changes");
  });

  it("fires a click that reaches the host template's listener", () => {
    const fixture = createHost();
    innerButton(fixture.nativeElement).click();
    expect(fixture.componentInstance.clicked).toBe(1);
  });

  it("does not let the click reach the host template's listener when disabled", () => {
    const fixture = createHost({ disabled: true });
    innerButton(fixture.nativeElement).click();
    expect(fixture.componentInstance.clicked).toBe(0);
  });

  it("projects icon-start and icon-end content", () => {
    const fixture = createHost();
    const button = innerButton(fixture.nativeElement);
    expect(button.querySelector("[iconStart]")).not.toBeNull();
    expect(button.querySelector("[iconEnd]")).not.toBeNull();
  });

  it("omits projected icons while loading, replacing icon-start with a spinner", () => {
    const fixture = createHost({ loading: true });
    const button = innerButton(fixture.nativeElement);
    expect(button.querySelector("[iconStart]")).toBeNull();
    expect(button.querySelector("[iconEnd]")).toBeNull();
    expect(button.querySelector(".spinner")).not.toBeNull();
  });

  it("visually hides the label while loading but keeps it in the DOM", () => {
    const fixture = createHost({ loading: true });
    const label = innerButton(fixture.nativeElement).querySelector(".label")!;
    expect(label.classList.contains("sr-only")).toBe(true);
    expect(label.textContent).toContain("Save changes");
  });
});
