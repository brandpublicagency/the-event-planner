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
      className={cn("p-3", className)}
      classNames={{
        months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
        month: "space-y-4",
        caption: "flex justify-center pt-1 relative items-center px-10",
        caption_label: "text-lg font-medium",
        nav: "space-x-1 flex items-center absolute w-full justify-between left-0 px-3",
        nav_button: cn(
          buttonVariants({ variant: "outline" }),
          "h-8 w-8 bg-transparent p-0 hover:bg-zinc-100 transition-colors"
        ),
        nav_button_previous: "absolute left-1",
        nav_button_next: "absolute right-1",
        table: "w-full border-collapse space-y-1",
        head_row: "flex",
        head_cell: "text-zinc-500 rounded-md w-10 font-normal text-[0.875rem]",
        row: "flex w-full mt-2",
        cell: cn(
          "relative p-0 text-center text-sm focus-within:relative focus-within:z-20 [&:has([aria-selected])]:bg-zinc-100 first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md",
          props.mode === "range"
            ? "[&:has(>.day-range-end)]:rounded-r-md [&:has(>.day-range-start)]:rounded-l-md"
            : "[&:has([aria-selected])]:rounded-md"
        ),
        day: cn(
          buttonVariants({ variant: "ghost" }),
          "h-10 w-10 p-0 font-normal aria-selected:opacity-100",
          "hover:bg-zinc-100 hover:text-zinc-900 focus:bg-zinc-100 focus:text-zinc-900",
          "transition-colors duration-200",
          "disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:text-zinc-500"
        ),
        day_range_start: "day-range-start",
        day_range_end: "day-range-end",
        day_selected: 
          "bg-zinc-900 text-zinc-50 hover:bg-zinc-800 hover:text-zinc-50 focus:bg-zinc-900 focus:text-zinc-50",
        day_today: "bg-zinc-100 text-zinc-900",
        day_outside: "text-zinc-500 opacity-50 aria-selected:bg-zinc-100/50 hover:bg-zinc-100/50 hover:text-zinc-900",
        day_disabled: "text-zinc-500 opacity-50 hover:bg-transparent cursor-not-allowed",
        day_range_middle:
          "aria-selected:bg-zinc-100 aria-selected:text-zinc-900",
        day_hidden: "invisible",
        ...classNames,
      }}
      components={{
        IconLeft: () => <ChevronLeft className="h-4 w-4" />,
        IconRight: () => <ChevronRight className="h-4 w-4" />,
      }}
      {...props}
    />
  );
}
Calendar.displayName = "Calendar";

export { Calendar };