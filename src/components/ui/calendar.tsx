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
      className={cn("p-3 bg-primary text-primary-foreground h-full", className)}
      classNames={{
        months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
        month: "space-y-4",
        caption: "flex justify-center pt-1 relative items-center px-10",
        caption_label: "text-sm font-medium text-primary-foreground",
        nav: "space-x-1 flex items-center absolute w-full justify-between left-0 px-3",
        nav_button: cn(
          buttonVariants({ variant: "ghost" }),
          "h-8 w-8 bg-transparent p-0 text-primary-foreground opacity-50 hover:opacity-100 rounded-full"
        ),
        nav_button_previous: "",
        nav_button_next: "",
        table: "w-full border-collapse space-y-1",
        head_row: "flex",
        head_cell:
          "text-primary-foreground rounded-md w-10 font-normal text-[0.8rem] h-10",
        row: "flex w-full mt-2",
        cell: "h-10 w-10 text-center text-sm p-0 relative",
        day: cn(
          buttonVariants({ variant: "ghost" }),
          "h-10 w-10 p-0 font-normal text-primary-foreground hover:text-primary-foreground hover:bg-zinc-800 hover:ring-1 hover:ring-zinc-700 hover:ring-inset rounded-full"
        ),
        day_selected:
          "bg-zinc-800 text-primary-foreground hover:text-primary-foreground hover:bg-zinc-800 font-medium ring-1 ring-zinc-700 ring-inset hover:ring-zinc-700",
        day_today: "text-primary-foreground font-medium underline underline-offset-4",
        day_outside:
          "text-zinc-400 opacity-50 hover:text-zinc-300",
        day_disabled: "text-zinc-400 opacity-50",
        day_hidden: "invisible",
        ...classNames,
      }}
      components={{
        IconLeft: ({ ...props }) => <ChevronLeft className="h-4 w-4 text-primary-foreground" />,
        IconRight: ({ ...props }) => <ChevronRight className="h-4 w-4 text-primary-foreground" />,
      }}
      formatters={{
        formatCaption: (date, options) => {
          return format(date, "MMMM yyyy", { locale: options?.locale });
        }
      }}
      {...props}
    />
  );
}
Calendar.displayName = "Calendar";

export { Calendar };