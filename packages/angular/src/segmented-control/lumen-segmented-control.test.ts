import { afterEach, describe, expect, it } from "vitest";
import { Component, provideZonelessChangeDetection } from "@angular/core";
import { TestBed } from "@angular/core/testing";
import { LumenSegmentedControlComponent } from "./lumen-segmented-control";
import { LumenSegmentedControlOptionComponent } from "./lumen-segmented-control-option";

@Component({
  standalone: true,
  imports: [LumenSegmentedControlComponent, LumenSegmentedControlOptionComponent],
  template: `
    <lumen-segmented-control
      aria-label="Tone"
      [value]="value"
      [disabled]="disabled"
      [size]="size"
      (valueChange)="onValueChange($event)"
    >
      <lumen-segmented-control-option value="formal">Formal</lumen-segmented-control-option>
      <lumen-segmented-control-option value="neutral">Neutral</lumen-segmented-control-option>
      <lumen-segmented-control-option value="friendly">Friendly</lumen-segmented-control-option>
      <lumen-segmented-control-option value="concise">Concise</lumen-segmented-control-option>
    </lumen-segmented-control>
  `
})
class TestHostComponent {
  value = "neutral";
  size: "sm" | "md" | "lg" = "md";
  disabled = false;
  changes: string[] = [];
  onValueChange(value: string) {
    this.changes.push(value);
  }
}

function option(root: HTMLElement, value: string): HTMLElement {
  return root.querySelector(`lumen-segmented-control-option[value="${value}"]`)!;
}

function radio(root: HTMLElement, value: string): HTMLButtonElement {
  return option(root, value).querySelector("button")!;
}

describe("LumenSegmentedControlComponent", () => {
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

  it("renders a radiogroup with one radio per option", () => {
    const fixture = createHost();
    const group = fixture.nativeElement.querySelector('[role="radiogroup"]');
    expect(group.getAttribute("aria-label")).toBe("Tone");
    expect(fixture.nativeElement.querySelectorAll('[role="radio"]')).toHaveLength(4);
  });

  it("marks the initial value option as checked", () => {
    const fixture = createHost();
    expect(radio(fixture.nativeElement, "neutral").getAttribute("aria-checked")).toBe("true");
    expect(radio(fixture.nativeElement, "formal").getAttribute("aria-checked")).toBe("false");
  });

  it("selects an option on click and emits valueChange", () => {
    const fixture = createHost();
    radio(fixture.nativeElement, "formal").click();
    fixture.detectChanges();
    expect(fixture.componentInstance.changes).toEqual(["formal"]);
    expect(radio(fixture.nativeElement, "formal").getAttribute("aria-checked")).toBe("true");
    expect(radio(fixture.nativeElement, "neutral").getAttribute("aria-checked")).toBe("false");
  });

  it("moves selection with ArrowRight/ArrowLeft", () => {
    const fixture = createHost();
    radio(fixture.nativeElement, "neutral").dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowRight", bubbles: true }));
    fixture.detectChanges();
    expect(fixture.componentInstance.changes).toEqual(["friendly"]);
    expect(radio(fixture.nativeElement, "friendly").getAttribute("aria-checked")).toBe("true");
  });

  it("propagates size to every option", () => {
    const lgFixture = createHost({ size: "lg" });
    expect(option(lgFixture.nativeElement, "formal").getAttribute("size")).toBe("lg");
    expect(option(lgFixture.nativeElement, "neutral").getAttribute("size")).toBe("lg");

    TestBed.resetTestingModule();
    const smFixture = createHost({ size: "sm" });
    expect(option(smFixture.nativeElement, "formal").getAttribute("size")).toBe("sm");
    expect(option(smFixture.nativeElement, "neutral").getAttribute("size")).toBe("sm");
  });

  it("disables all options when the group is disabled", () => {
    const fixture = createHost({ disabled: true });
    const button = radio(fixture.nativeElement, "formal");
    expect(button.getAttribute("aria-disabled")).toBe("true");
    button.click();
    fixture.detectChanges();
    expect(fixture.componentInstance.changes).toEqual([]);
  });
});
