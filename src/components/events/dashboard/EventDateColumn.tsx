import React from "react";
interface EventDateColumnProps {
  day: string;
  startTime: string;
}
export const EventDateColumn: React.FC<EventDateColumnProps> = ({
  day,
  startTime
}) => {
  return <div className="flex flex-col items-center justify-center w-[80px] py-3 px-4 text-center border-r border-zinc-50 bg-zinc-50">
      <div className="text-[32px] font-semibold text-zinc-800 leading-none">{day}</div>
      <div className="text-xs text-zinc-500 mt-1">{startTime}</div>
    </div>;
};