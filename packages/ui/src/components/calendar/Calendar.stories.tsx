import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import type { DateRange } from "react-day-picker";
import { Calendar } from "./Calendar";

const meta = {
  title: "Composite/Calendar",
  component: Calendar,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "shadcn/ui's Calendar (built on `react-day-picker` + `date-fns`), sourced and adapted to Lumen's token system — see docs/shadcn-integration.md §7.7. Filed under Composite: it combines an internal Button into a day-grid interaction unit, the same fallback reasoning used for other components not explicitly named in docs/component-architecture.md §2.2/§2.3 (closest named analog is §2.3's `Date Picker`). Dark mode follows the global `data-theme` toolbar toggle, not a separate story."
      }
    }
  }
} satisfies Meta<typeof Calendar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => {
    function DefaultCalendar() {
      const [date, setDate] = useState<Date | undefined>(new Date());
      return <Calendar mode="single" selected={date} onSelect={setDate} />;
    }
    return <DefaultCalendar />;
  }
};

export const RangeSelected: Story = {
  render: () => {
    function RangeCalendar() {
      const today = new Date();
      const [range, setRange] = useState<DateRange | undefined>({
        from: today,
        to: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 5)
      });
      return <Calendar mode="range" selected={range} onSelect={setRange} />;
    }
    return <RangeCalendar />;
  }
};

export const DisabledDates: Story = {
  render: () => {
    function DisabledCalendar() {
      const [date, setDate] = useState<Date | undefined>();
      const today = new Date();
      return (
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          disabled={{ before: today }}
        />
      );
    }
    return <DisabledCalendar />;
  }
};
