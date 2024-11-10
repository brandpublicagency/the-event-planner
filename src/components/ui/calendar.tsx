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
      className={cn("p-4", className)}
      classNames={{
        months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
        month: "space-y-4 w-full",
        caption: "flex justify-between pt-1 relative items-center px-2 mb-4",
        caption_label: "text-base font-medium",
        nav: "flex items-center space-x-1",
        nav_button: cn(
          buttonVariants({ variant: "outline" }),
          "h-8 w-8 bg-transparent p-0 hover:bg-zinc-100 border-zinc-200"
        ),
        table: "w-full border-collapse space-y-1",
        head_row: "flex",
        head_cell: "text-zinc-500 rounded-md w-10 font-normal text-[0.8rem] h-10 flex items-center justify-center",
        row: "flex w-full mt-2",
        cell: "relative p-0 text-center text-sm rounded-md h-10 w-10 flex items-center justify-center focus-within:relative focus-within:z-20",
        day: cn(
          "h-10 w-10 p-0 font-normal rounded-md transition-colors hover:bg-zinc-100 flex items-center justify-center",
          "aria-selected:opacity-100"
        ),
        day_range_end: "day-range-end",
        day_selected:
          "bg-zinc-900 text-zinc-50 hover:bg-zinc-800 hover:text-zinc-50 focus:bg-zinc-900 focus:text-zinc-50",
        day_today: "border border-zinc-200 bg-zinc-50",
        day_outside: "text-zinc-500 opacity-50",
        day_disabled: "text-zinc-500 opacity-50",
        day_range_middle:
          "aria-selected:bg-zinc-100 aria-selected:text-zinc-900",
        day_hidden: "invisible",
        ...classNames,
      }}
      components={{
        IconLeft: ({ ...props }) => <ChevronLeft className="h-4 w-4" {...props} />,
        IconRight: ({ ...props }) => <ChevronRight className="h-4 w-4" {...props} />,
      }}
      {...props}
    />
  );
}
Calendar.displayName = "Calendar";

export { Calendar };