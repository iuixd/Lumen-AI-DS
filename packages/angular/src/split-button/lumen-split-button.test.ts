import { afterEach, describe, expect, it, vi } from "vitest";
import { Component, provideZonelessChangeDetection } from "@angular/core";
import { TestBed } from "@angular/core/testing";
import {
  LumenSplitButtonComponent,
  type LumenSplitButtonSize,
  type LumenSplitButtonVariant
} from "./lumen-split-button";

@Component({
  standalone: true,
  imports: [LumenSplitButtonComponent],
  template: `
    <lumen-split-button
      [variant]="variant"
      [size]="size"
      [pill]="pill"
      [loading]="loading"
      [disabled]="disabled"
      [dropdownLabel]="dropdownLabel"
      (mainClick)="onMainClick()"
      (dropdownClick)="onDropdownClick()"
    >
      Save changes
    </lumen-split-button>
  `
})
class TestHostComponent {
  variant: LumenSplitButtonVariant = "primary";
  size: LumenSplitButtonSize = "lg";
  pill = false;
  loading = false;
  disabled = false;
  dropdownLabel = "More save options";
  mainClicked = 0;
  dropdownClicked = 0;
  onMainClick() {
    this.mainClicked++;
  }
  onDropdownClick() {
    this.dropdownClicked++;
  }
}

function mainButton(root: HTMLElement): HTMLButtonElement {
  return root.querySelector("lumen-split-button .main")!;
}

function dropdownButton(root: HTMLElement): HTMLButtonElement {
  return root.querySelector("lumen-split-button .dropdown")!;
}

describe("LumenSplitButtonComponent", () => {
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

  it("renders two buttons", () => {
    const fixture = createHost();
    expect(mainButton(fixture.nativeElement)).not.toBeNull();
    expect(dropdownButton(fixture.nativeElement)).not.toBeNull();
    expect(dropdownButton(fixture.nativeElement).getAttribute("aria-label")).toBe("More save options");
  });

  it("emits mainClick only from the main button", () => {
    const fixture = createHost();
    mainButton(fixture.nativeElement).click();
    expect(fixture.componentInstance.mainClicked).toBe(1);
    expect(fixture.componentInstance.dropdownClicked).toBe(0);
  });

  it("emits dropdownClick only from the dropdown button", () => {
    const fixture = createHost();
    dropdownButton(fixture.nativeElement).click();
    expect(fixture.componentInstance.dropdownClicked).toBe(1);
    expect(fixture.componentInstance.mainClicked).toBe(0);
  });

  it("disables both buttons when disabled", () => {
    const fixture = createHost({ disabled: true });
    expect(mainButton(fixture.nativeElement).disabled).toBe(true);
    expect(dropdownButton(fixture.nativeElement).disabled).toBe(true);
  });

  it("while loading, disables only the main button", () => {
    const fixture = createHost({ loading: true });
    expect(mainButton(fixture.nativeElement).disabled).toBe(true);
    expect(mainButton(fixture.nativeElement).getAttribute("aria-busy")).toBe("true");
    expect(dropdownButton(fixture.nativeElement).disabled).toBe(false);
  });

  it("warns in dev when dropdownLabel is left at the generic default", async () => {
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
    TestBed.configureTestingModule({ providers: [provideZonelessChangeDetection()] });
    const fixture = TestBed.createComponent(LumenSplitButtonComponent);
    // ngOnChanges only fires for inputs that receive an actual bound change —
    // a never-set default doesn't trigger it, so the default must be set
    // explicitly to exercise the warning path (same reasoning as the
    // iconOnly warning test in lumen-button.test.ts).
    fixture.componentRef.setInput("dropdownLabel", "More options");
    fixture.detectChanges();
    await fixture.whenStable();
    expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining("dropdownLabel"));
    warnSpy.mockRestore();
  });

  it("defaults to variant=primary and size=lg", () => {
    TestBed.configureTestingModule({ providers: [provideZonelessChangeDetection()] });
    const fixture = TestBed.createComponent(LumenSplitButtonComponent);
    fixture.detectChanges();
    expect(fixture.nativeElement.getAttribute("variant")).toBe("primary");
    expect(fixture.nativeElement.getAttribute("size")).toBe("lg");
  });

  it.each(["sm", "md", "lg"] as const)("reflects size=%s as a host attribute", (size) => {
    const fixture = createHost({ size });
    expect(fixture.nativeElement.querySelector("lumen-split-button")!.getAttribute("size")).toBe(size);
  });

  it("reflects the outline variant as a host attribute", () => {
    const fixture = createHost({ variant: "outline" });
    expect(fixture.nativeElement.querySelector("lumen-split-button")!.getAttribute("variant")).toBe("outline");
  });
});
