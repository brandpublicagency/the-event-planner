"use client"

import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { DayPicker } from "react-day-picker"
import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"

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
      className={cn("p-3", className)}
      classNames={{
        months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
        month: "space-y-4",
        caption: "flex justify-between pt-1 relative items-center px-6",
        caption_label: "text-sm font-medium text-zinc-900",
        nav: "flex items-center space-x-1",
        nav_button: cn(
          buttonVariants({ variant: "outline" }),
          "h-7 w-7 bg-white p-0 border border-zinc-200 hover:bg-zinc-50"
        ),
        nav_button_previous: "absolute left-1",
        nav_button_next: "absolute right-1",
        table: "w-full border-collapse space-y-1",
        head_row: "flex",
        head_cell:
          "text-zinc-600 rounded-md w-9 font-normal text-[0.8rem] h-9 flex items-center justify-center",
        row: "flex w-full mt-2",
        cell: "relative p-0 text-center text-sm focus-within:relative focus-within:z-20",
        day: cn(
          "h-9 w-9 p-0 font-normal text-zinc-900 rounded-md border border-transparent",
          "hover:bg-zinc-100 hover:text-zinc-900 hover:border-zinc-200",
          "focus:bg-zinc-100 focus:text-zinc-900 focus:border-zinc-200"
        ),
        day_selected: "bg-zinc-50 text-zinc-900 border-zinc-200 hover:bg-zinc-100 hover:text-zinc-900",
        day_today: "bg-zinc-50 text-zinc-900 border border-zinc-200",
        day_outside: "text-zinc-400 opacity-50",
        day_disabled: "text-zinc-400 opacity-50",
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