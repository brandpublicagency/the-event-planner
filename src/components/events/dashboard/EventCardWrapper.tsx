
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
        <AnimatedBorder 
          borderWidth={3} 
          borderRadius={12} 
          className="mb-3"
        >
          <div className="rounded-xl hover:border-zinc-200 transition-colors overflow-hidden">
            {children}
          </div>
        </AnimatedBorder>
      ) : (
        <div className="rounded-xl mb-3 hover:border-zinc-200 transition-colors overflow-hidden">
          {children}
        </div>
      )}
    </button>
  );
};
