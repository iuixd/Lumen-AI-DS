import type { ComponentProps } from "react";

import {
  ChartContainer as InternalChartContainer,
  ChartLegend as InternalChartLegend,
  ChartLegendContent as InternalChartLegendContent,
  ChartStyle as InternalChartStyle,
  ChartTooltip as InternalChartTooltip,
  ChartTooltipContent as InternalChartTooltipContent
} from "../internal/chart";
import type { ChartConfig } from "../internal/chart";

/**
 * Chart, sourced from shadcn/ui (built on `recharts@2.15.4`) and adapted to
 * Lumen's token system — see packages/ui/src/components/internal/chart.tsx
 * for the adaptation notes. No collision with an existing Lumen export
 * (Lumen has no chart component of its own — `docs/component-
 * architecture.md` §2.4 lists an unbuilt "Data Visualization Container"),
 * so this keeps its own plain name: `Chart`, not `ChartContainer`.
 *
 * Lumen has no chart color tokens of its own yet, so `chartCategoricalColors`
 * below supplies a palette validated against this skill's own six checks
 * (lightness band, chroma floor, adjacent-pair CVD separation, normal-vision
 * floor, contrast vs. both the light and dark chart surface) — see
 * docs/shadcn-integration.md §7.7 for the validation run and rationale.
 * Consume it via `ChartConfig`'s `theme` field (light/dark keyed), which
 * this internal source's `THEMES`/`[data-theme="dark"]` selector already
 * resolves per-mode automatically:
 *
 * ```tsx
 * const config: ChartConfig = {
 *   desktop: { label: "Desktop", theme: chartCategoricalColors[0] },
 *   mobile: { label: "Mobile", theme: chartCategoricalColors[1] }
 * };
 * ```
 *
 * Never assign categorical hues by cycling past index 5 — fold a 7th+
 * series into "Other," small multiples, or composite encoding instead (see
 * the dataviz skill's non-negotiables).
 */
export const chartCategoricalColors: ReadonlyArray<{ light: string; dark: string }> = [
  { light: "#BE003C", dark: "#CB3363" },
  { light: "#0057D8", dark: "#3379E0" },
  { light: "#998200", dark: "#998200" },
  { light: "#AA00FF", dark: "#BB33FF" },
  { light: "#006D99", dark: "#0091CC" },
  { light: "#990C58", dark: "#CC1076" }
];

export type { ChartConfig };

export type ChartProps = ComponentProps<typeof InternalChartContainer>;
export function Chart(props: ChartProps) {
  return <InternalChartContainer {...props} />;
}

export const ChartTooltip = InternalChartTooltip;
export const ChartTooltipContent = InternalChartTooltipContent;
export const ChartLegend = InternalChartLegend;
export const ChartLegendContent = InternalChartLegendContent;
export const ChartStyle = InternalChartStyle;
