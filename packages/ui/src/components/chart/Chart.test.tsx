import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { Bar, BarChart } from "recharts";
import { Chart, ChartLegend, ChartLegendContent, chartCategoricalColors } from "./Chart";
import type { ChartConfig } from "./Chart";
import * as PublicExports from "../../index";

const data = [
  { channel: "Direct", revenue: 4200 },
  { channel: "Organic", revenue: 3100 }
];

const config: ChartConfig = {
  Direct: { label: "Direct", theme: chartCategoricalColors[0] },
  Organic: { label: "Organic", theme: chartCategoricalColors[1] }
};

describe("Chart", () => {
  it("is exported from @lumen/ui's public entry point", () => {
    expect(PublicExports.Chart).toBe(Chart);
    expect(PublicExports.ChartTooltip).toBeDefined();
    expect(PublicExports.ChartTooltipContent).toBeDefined();
    expect(PublicExports.ChartLegend).toBeDefined();
    expect(PublicExports.ChartLegendContent).toBeDefined();
    expect(PublicExports.chartCategoricalColors).toBeDefined();
  });

  it("exposes exactly 6 validated categorical steps, each with a light and dark value", () => {
    expect(chartCategoricalColors).toHaveLength(6);
    for (const step of chartCategoricalColors) {
      expect(step.light).toMatch(/^#[0-9A-F]{6}$/i);
      expect(step.dark).toMatch(/^#[0-9A-F]{6}$/i);
    }
  });

  it("renders a data-chart container with a legend for a multi-series config", () => {
    render(
      <Chart config={config} data-testid="chart-root">
        <BarChart data={data}>
          <ChartLegend content={<ChartLegendContent />} />
          <Bar dataKey="revenue" />
        </BarChart>
      </Chart>
    );

    expect(screen.getByTestId("chart-root")).toHaveAttribute("data-chart");
  });
});
