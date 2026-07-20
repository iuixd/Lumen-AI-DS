import { afterEach, describe, expect, it } from "vitest";
import { Component, provideZonelessChangeDetection } from "@angular/core";
import { TestBed } from "@angular/core/testing";
import { LumenKPICardComponent } from "./lumen-kpi-card";

@Component({
  standalone: true,
  imports: [LumenKPICardComponent],
  template: `<lumen-kpi-card [label]="label" [value]="value" [delta]="delta" [deltaTone]="deltaTone"></lumen-kpi-card>`
})
class TestHostComponent {
  label = "Open renewals";
  value = "47";
  delta?: string;
  deltaTone: "success" | "warning" | "error" = "success";
}

describe("LumenKPICardComponent", () => {
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

  it("renders the label and value", () => {
    const fixture = createHost();
    expect(fixture.nativeElement.querySelector(".label").textContent).toBe("Open renewals");
    expect(fixture.nativeElement.querySelector(".value").textContent).toBe("47");
  });

  it("renders the delta line when provided", () => {
    const fixture = createHost({ delta: "▲ 12% this quarter" });
    expect(fixture.nativeElement.querySelector(".delta").textContent).toBe("▲ 12% this quarter");
  });

  it("omits the delta line when not provided", () => {
    const fixture = createHost();
    expect(fixture.nativeElement.querySelector(".delta")).toBeNull();
  });

  it("applies the deltaTone class to the delta line", () => {
    const fixture = createHost({ delta: "▲ 3 flagged", deltaTone: "warning" });
    expect(fixture.nativeElement.querySelector(".delta").classList.contains("warning")).toBe(true);
  });
});
