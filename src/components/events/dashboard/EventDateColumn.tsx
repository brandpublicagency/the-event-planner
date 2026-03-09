
import React from "react";

interface EventDateColumnProps {
  day: string;
  startTime: string;
}

export const EventDateColumn: React.FC<EventDateColumnProps> = ({
  day,
  startTime
}) => {
  return (
    <div className="flex flex-col items-center justify-center w-[80px] py-3 px-4 text-center border-r border-border bg-muted">
      <div className="text-[28px] font-medium text-foreground leading-none">{day}</div>
      <div className="text-xs text-muted-foreground mt-1">{startTime}</div>
    </div>
  );
};
