import { afterEach, describe, expect, it } from "vitest";
import { Component, provideZonelessChangeDetection } from "@angular/core";
import { TestBed } from "@angular/core/testing";
import { LumenFilterChipComponent } from "./lumen-filter-chip";

@Component({
  standalone: true,
  imports: [LumenFilterChipComponent],
  template: `
    <lumen-filter-chip [selected]="selected" [disabled]="disabled" (click)="onClick()">Status</lumen-filter-chip>
  `
})
class TestHostComponent {
  selected = false;
  disabled = false;
  clicked = 0;
  onClick() {
    this.clicked++;
  }
}

function innerButton(root: HTMLElement): HTMLButtonElement {
  return root.querySelector("lumen-filter-chip button")!;
}

describe("LumenFilterChipComponent", () => {
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

  it("renders its projected label", () => {
    const fixture = createHost();
    expect(innerButton(fixture.nativeElement).textContent).toContain("Status");
  });

  it("defaults aria-pressed to false when unselected", () => {
    const fixture = createHost();
    expect(innerButton(fixture.nativeElement).getAttribute("aria-pressed")).toBe("false");
  });

  it("exposes selection state via aria-pressed", () => {
    const fixture = createHost({ selected: true });
    expect(innerButton(fixture.nativeElement).getAttribute("aria-pressed")).toBe("true");
  });

  it("renders a default plus icon when unselected", () => {
    const fixture = createHost();
    expect(innerButton(fixture.nativeElement).querySelectorAll("svg")).toHaveLength(1);
  });

  it("renders both the plus icon and a remove icon when selected", () => {
    const fixture = createHost({ selected: true });
    expect(innerButton(fixture.nativeElement).querySelectorAll("svg")).toHaveLength(2);
  });

  it("fires a click that reaches the host template's listener", () => {
    const fixture = createHost();
    innerButton(fixture.nativeElement).click();
    expect(fixture.componentInstance.clicked).toBe(1);
  });

  it("marks aria-disabled and does not let the click reach the host listener when disabled", () => {
    const fixture = createHost({ disabled: true });
    const button = innerButton(fixture.nativeElement);
    expect(button.getAttribute("aria-disabled")).toBe("true");
    button.click();
    expect(fixture.componentInstance.clicked).toBe(0);
  });
});
