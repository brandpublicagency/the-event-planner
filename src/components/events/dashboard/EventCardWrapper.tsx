
import React from "react";
import { useNavigate } from "react-router-dom";
import { AnimatedBorder } from "@/components/ui/animated-border";

interface EventCardWrapperProps {
  children: React.ReactNode;
  eventCode: string;
  eventIsToday: boolean;
}

export const EventCardWrapper: React.FC<EventCardWrapperProps> = ({ 
  children, 
  eventCode, 
  eventIsToday 
}) => {
  const navigate = useNavigate();

  return (
    <button onClick={() => navigate(`/events/${eventCode}`)} className="text-left w-full">
      {eventIsToday ? (
        <div className="mb-3">
          <div className="border border-zinc-100 bg-white hover:border-zinc-200 transition-colors overflow-hidden">
            {children}
          </div>
        </div>
      ) : (
        <div className="border border-zinc-100 bg-white mb-3 hover:border-zinc-200 transition-colors overflow-hidden">
          {children}
        </div>
      )}
    </button>
  );
};
