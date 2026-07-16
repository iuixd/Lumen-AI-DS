import { afterEach, describe, expect, it } from "vitest";
import { Component, provideZonelessChangeDetection } from "@angular/core";
import { TestBed } from "@angular/core/testing";
import { LumenChoiceChipComponent } from "./lumen-choice-chip";

@Component({
  standalone: true,
  imports: [LumenChoiceChipComponent],
  template: `
    <lumen-choice-chip [selected]="selected" [disabled]="disabled" (click)="onClick()">Small</lumen-choice-chip>
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

@Component({
  standalone: true,
  imports: [LumenChoiceChipComponent],
  template: `
    <ng-template #iconTpl><svg data-testid="icon"></svg></ng-template>
    <lumen-choice-chip tone="subtle" [selected]="selected" [icon]="iconTpl">Summarize</lumen-choice-chip>
  `
})
class SubtleToneHostComponent {
  selected = false;
}

function innerButton(root: HTMLElement): HTMLButtonElement {
  return root.querySelector("lumen-choice-chip button")!;
}

describe("LumenChoiceChipComponent", () => {
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

  it("renders its label with no icon by default", () => {
    const fixture = createHost();
    expect(innerButton(fixture.nativeElement).querySelector("svg")).toBeNull();
  });

  it("renders a leading check icon only when selected", () => {
    const fixture = createHost({ selected: true });
    expect(innerButton(fixture.nativeElement).querySelector("svg")).not.toBeNull();
  });

  it("exposes selection state via aria-pressed", () => {
    const fixture = createHost({ selected: true });
    expect(innerButton(fixture.nativeElement).getAttribute("aria-pressed")).toBe("true");
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

  it("defaults to tone=\"solid\"", () => {
    const fixture = createHost();
    expect(fixture.nativeElement.querySelector("lumen-choice-chip").getAttribute("tone")).toBe("solid");
  });

  function createSubtleHost(overrides: Partial<SubtleToneHostComponent> = {}) {
    TestBed.configureTestingModule({ providers: [provideZonelessChangeDetection()] });
    const fixture = TestBed.createComponent(SubtleToneHostComponent);
    Object.assign(fixture.componentInstance, overrides);
    fixture.detectChanges();
    return fixture;
  }

  it("tone=\"subtle\" renders the icon template and no check icon when unselected", () => {
    const fixture = createSubtleHost();
    const button = innerButton(fixture.nativeElement);
    expect(button.querySelector('[data-testid="icon"]')).not.toBeNull();
    expect(button.querySelector("svg:not([data-testid])")).toBeNull();
  });

  it("tone=\"subtle\" renders the icon template plus a trailing check icon when selected", () => {
    const fixture = createSubtleHost({ selected: true });
    const button = innerButton(fixture.nativeElement);
    expect(button.querySelector('[data-testid="icon"]')).not.toBeNull();
    expect(button.querySelector("svg:not([data-testid])")).not.toBeNull();
  });
});
