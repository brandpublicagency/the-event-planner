import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker } from "react-day-picker";
import { format } from "date-fns";

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
      className={cn("p-4 glassmorphism", className)}
      classNames={{
        months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
        month: "space-y-4",
        caption: "flex justify-center pt-1 relative items-center px-10",
        caption_label: "text-base font-medium text-white",
        nav: "space-x-1 flex items-center absolute w-full justify-between left-0 px-3",
        nav_button: cn(
          buttonVariants({ variant: "ghost" }),
          "h-8 w-8 bg-transparent p-0 text-white opacity-70 hover:opacity-100 rounded-full"
        ),
        nav_button_previous: "",
        nav_button_next: "",
        table: "w-full border-collapse space-y-1",
        head_row: "flex",
        head_cell:
          "text-white/60 rounded-md w-10 font-normal text-[0.8rem] h-10",
        row: "flex w-full mt-2",
        cell: "h-10 w-10 text-center text-sm p-0 relative",
        day: cn(
          buttonVariants({ variant: "ghost" }),
          "h-10 w-10 p-0 font-normal text-white hover:bg-white/10 rounded-full transition-colors"
        ),
        day_selected:
          "bg-gradient-to-br from-purple-500 to-purple-700 text-white hover:bg-gradient-to-br hover:from-purple-600 hover:to-purple-800 hover:text-white focus:bg-gradient-to-br focus:from-purple-600 focus:to-purple-800",
        day_today: "text-white font-bold bg-white/10",
        day_outside: "text-white/40 opacity-50",
        day_disabled: "text-zinc-500 opacity-50",
        day_hidden: "invisible",
        ...classNames,
      }}
      components={{
        IconLeft: ({ ...props }) => <ChevronLeft className="h-4 w-4 text-white" />,
        IconRight: ({ ...props }) => <ChevronRight className="h-4 w-4 text-white" />,
      }}
      {...props}
    />
  );
}
Calendar.displayName = "Calendar";

export { Calendar };