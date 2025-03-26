import React from "react";
interface EventDateColumnProps {
  day: string;
  startTime: string;
}
export const EventDateColumn: React.FC<EventDateColumnProps> = ({
  day,
  startTime
}) => {
  return <div className="flex flex-col items-center justify-center w-[80px] py-3 px-4 text-center border-r border-zinc-50 bg-gray-100">
      <div className="text-[30px] font-medium text-gray-600 leading-none">{day}</div>
      <div className="text-xs text-gray-700 mt-1">{startTime}</div>
    </div>;
};