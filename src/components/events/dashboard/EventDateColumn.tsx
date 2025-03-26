
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
    <div className="flex flex-col items-center justify-center w-[80px] py-3 px-4 text-center border-r border-gray-100 bg-gray-50">
      <div className="text-[28px] font-medium text-gray-700 leading-none">{day}</div>
      <div className="text-xs text-gray-600 mt-1">{startTime}</div>
    </div>
  );
};
