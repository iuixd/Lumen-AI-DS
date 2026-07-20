import { afterEach, describe, expect, it } from "vitest";
import { Component, provideZonelessChangeDetection } from "@angular/core";
import { TestBed } from "@angular/core/testing";
import { LumenFooterComponent } from "./lumen-footer";

@Component({
  standalone: true,
  imports: [LumenFooterComponent],
  template: `
    <lumen-footer [version]="version" [statusLabel]="statusLabel">
      <a href="/privacy">Privacy</a>
    </lumen-footer>
  `
})
class TestHostComponent {
  version?: string;
  statusLabel?: string;
}

describe("LumenFooterComponent", () => {
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

  it("exposes a contentinfo landmark role", () => {
    const fixture = createHost();
    const footer = fixture.nativeElement.querySelector("lumen-footer");
    expect(footer.getAttribute("role")).toBe("contentinfo");
  });

  it("renders version and status text when provided", () => {
    const fixture = createHost({ version: "Lumen Platform v4.0", statusLabel: "All systems normal" });
    expect(fixture.nativeElement.textContent).toContain("Lumen Platform v4.0");
    expect(fixture.nativeElement.textContent).toContain("All systems normal");
  });

  it("omits version and status when not provided", () => {
    const fixture = createHost();
    expect(fixture.nativeElement.querySelector("lumen-footer p")).toBeNull();
  });

  it("projects link elements", () => {
    const fixture = createHost();
    expect(fixture.nativeElement.querySelector("a[href='/privacy']")).not.toBeNull();
  });
});
