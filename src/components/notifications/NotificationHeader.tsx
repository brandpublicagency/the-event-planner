
import React from "react";

interface NotificationHeaderProps {
  title: string;
}

export const NotificationHeader: React.FC<NotificationHeaderProps> = ({ title }) => {
  return (
    <div className="p-3 border-b flex items-center justify-between">
      <h2 className="text-base font-medium text-zinc-900">{title}</h2>
    </div>
  );
};
