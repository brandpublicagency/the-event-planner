
"use client"

import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { DayPicker } from "react-day-picker"
import { cn } from "@/lib/utils"

export type CalendarProps = React.ComponentProps<typeof DayPicker>

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-0 pointer-events-auto", className)}
      classNames={{
        months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
        month: "space-y-6",
        caption: "relative flex justify-center items-center h-10",
        caption_label: "text-sm font-medium text-foreground",
        nav: "flex items-center space-x-1 absolute inset-0",
        nav_button: cn(
          "h-7 w-7 p-0 flex items-center justify-center rounded-md border border-border bg-background text-foreground hover:bg-muted"
        ),
        nav_button_previous: "absolute left-1",
        nav_button_next: "absolute right-1",
        table: "w-full border-collapse space-y-2",
        head_row: "flex",
        head_cell:
          "text-muted-foreground rounded-md w-10 font-normal text-[0.8rem] h-10 flex items-center justify-center",
        row: "flex w-full mt-2",
        cell: "relative p-0.5 text-center text-sm focus-within:relative focus-within:z-20",
        day: cn(
          "h-9 w-9 p-0 font-normal text-foreground rounded-md border-transparent",
          "hover:bg-muted hover:text-foreground",
          "focus:bg-muted focus:text-foreground"
        ),
        day_selected: "bg-muted text-foreground hover:bg-muted hover:text-foreground",
        day_today: "border border-border",
        day_outside: "text-muted-foreground opacity-50",
        day_disabled: "text-muted-foreground opacity-50",
        day_range_middle: "rounded-none",
        day_hidden: "invisible",
        ...classNames,
      }}
      components={{
        IconLeft: ({ ...props }) => <ChevronLeft className="h-4 w-4" />,
        IconRight: ({ ...props }) => <ChevronRight className="h-4 w-4" />,
      }}
      weekStartsOn={1}
      {...props}
    />
  )
}
Calendar.displayName = "Calendar"

export { Calendar }
