import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker } from "react-day-picker";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("pl-6 pr-4 mx-auto", className)}
      classNames={{
        months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
        month: "space-y-6",
        caption: "flex justify-between pt-2 relative items-center px-1",
        caption_label: "text-lg font-semibold text-primary-900 ml-1",
        nav: "space-x-2 flex items-center",
        nav_button: cn(
          buttonVariants({ variant: "outline" }),
          "h-8 w-8 bg-transparent p-0 text-primary-900 hover:bg-primary-100 hover:text-primary-900"
        ),
        table: "w-full border-collapse space-y-2",
        head_row: "flex",
        head_cell: "text-primary-500 w-10 font-medium text-[0.875rem]",
        row: "flex w-full mt-3",
        cell: cn(
          "relative p-0 text-center text-sm focus-within:relative focus-within:z-20",
          "first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md",
          "[&:has([aria-selected])]:bg-primary-100",
          props.mode === "range"
            ? "[&:has(>.day-range-end)]:rounded-r-md [&:has(>.day-range-start)]:rounded-l-md"
            : "[&:has([aria-selected])]:rounded-md"
        ),
        day: cn(
          buttonVariants({ variant: "ghost" }),
          "h-10 w-10 p-0 font-normal aria-selected:opacity-100",
          "hover:bg-primary-100 hover:text-primary-900 focus:bg-primary-100 focus:text-primary-900",
          "text-zinc-900", // Added to ensure text is visible
          "disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:text-primary-500"
        ),
        day_range_start: "day-range-start",
        day_range_end: "day-range-end",
        day_selected: 
          "bg-primary-900 text-white hover:bg-primary-800 hover:text-white focus:bg-primary-900 focus:text-white",
        day_today: "bg-primary-100 text-primary-900 font-semibold",
        day_outside: "text-zinc-400 opacity-50 aria-selected:bg-primary-100/50 hover:bg-primary-100/50",
        day_disabled: "text-zinc-400 opacity-50 hover:bg-transparent",
        day_range_middle:
          "aria-selected:bg-primary-100 aria-selected:text-primary-900",
        day_hidden: "invisible",
        ...classNames,
      }}
      components={{
        IconLeft: () => <ChevronLeft className="h-5 w-5" />,
        IconRight: () => <ChevronRight className="h-5 w-5" />,
      }}
      {...props}
    />
  );
}
Calendar.displayName = "Calendar";

export { Calendar };