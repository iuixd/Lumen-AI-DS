import { afterEach, describe, expect, it } from "vitest";
import { Component, provideZonelessChangeDetection } from "@angular/core";
import { TestBed } from "@angular/core/testing";
import { LumenThemeToggleComponent } from "./lumen-theme-toggle";

@Component({
  standalone: true,
  imports: [LumenThemeToggleComponent],
  template: `<lumen-theme-toggle [checked]="checked" (checkedChange)="onCheckedChange($event)"></lumen-theme-toggle>`
})
class TestHostComponent {
  checked = false;
  lastEmitted: boolean | null = null;
  onCheckedChange(value: boolean) {
    this.lastEmitted = value;
  }
}

function innerInput(root: HTMLElement): HTMLInputElement {
  return root.querySelector("lumen-theme-toggle input")!;
}

describe("LumenThemeToggleComponent", () => {
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

  it("renders as a switch with a default accessible name", () => {
    const fixture = createHost();
    const input = innerInput(fixture.nativeElement);
    expect(input.getAttribute("role")).toBe("switch");
    expect(input.getAttribute("aria-label")).toBe("Toggle dark theme");
  });

  it("reflects the checked input to the native input's checked property", () => {
    const fixture = createHost({ checked: true });
    expect(innerInput(fixture.nativeElement).checked).toBe(true);
  });

  it("emits checkedChange with the new state on toggle", () => {
    const fixture = createHost();
    const input = innerInput(fixture.nativeElement);
    input.checked = true;
    input.dispatchEvent(new Event("change"));
    expect(fixture.componentInstance.lastEmitted).toBe(true);
  });
});
