import type { ComponentProps } from "react";

import { Calendar as InternalCalendar } from "../internal/calendar";

/**
 * Calendar, sourced from shadcn/ui (`react-day-picker` + `date-fns`) and
 * adapted to Lumen's token system — see
 * packages/ui/src/components/internal/calendar.tsx for the adaptation
 * notes. No collision with an existing Lumen export, so this keeps its own
 * plain name. This public module is the only supported import path; the
 * internal implementation may change without notice.
 */
export type CalendarProps = ComponentProps<typeof InternalCalendar>;
export function Calendar(props: CalendarProps) {
  return <InternalCalendar {...props} />;
}
