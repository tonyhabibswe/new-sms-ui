"use client";
import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { DayPicker } from "react-day-picker"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"

// Styled for react-day-picker 9+: day state classes (selected, today, ...) go on
// the cell, so they style its button through [&>button].
function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}) {
  return (
    (<DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-3", className)}
      classNames={{
        months: "relative flex flex-col sm:flex-row gap-4",
        month: "space-y-4",
        month_caption: "flex h-10 justify-center items-center",
        caption_label: "font-display text-[17px] font-bold",
        nav: "absolute inset-x-0 top-0 flex items-center justify-between",
        button_previous: cn(
          buttonVariants({ variant: "outline" }),
          "h-10 w-10 p-0"
        ),
        button_next: cn(
          buttonVariants({ variant: "outline" }),
          "h-10 w-10 p-0"
        ),
        month_grid: "w-full border-collapse space-y-1",
        weekdays: "flex",
        weekday:
          "w-10 text-xs font-semibold text-faint",
        week: "flex w-full mt-2",
        day: "text-center text-sm p-0 relative aria-selected:bg-accent first:aria-selected:rounded-l-md last:aria-selected:rounded-r-md focus-within:relative focus-within:z-20",
        day_button: cn(
          buttonVariants({ variant: "ghost" }),
          "h-10 w-10 p-0 font-medium"
        ),
        selected:
          "[&>button]:bg-primary [&>button]:text-primary-foreground [&>button:hover]:bg-primary [&>button:hover]:text-primary-foreground [&>button:focus]:bg-primary [&>button:focus]:text-primary-foreground",
        today: "[&>button]:bg-accent [&>button]:text-accent-foreground",
        outside: "text-faint opacity-60",
        disabled: "text-faint opacity-40",
        range_middle:
          "[&>button]:bg-accent [&>button]:text-accent-foreground",
        hidden: "invisible",
        ...classNames,
      }}
      components={{
        Chevron: ({ orientation }) =>
          orientation === "left" ? (
            <ChevronLeft className="h-4 w-4" />
          ) : (
            <ChevronRight className="h-4 w-4" />
          ),
      }}
      {...props} />)
  );
}
Calendar.displayName = "Calendar"

export { Calendar }
