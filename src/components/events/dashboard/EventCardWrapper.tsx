
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
        <AnimatedBorder borderWidth={3} borderRadius={12}>
          <div className="rounded-xl bg-card border border-border overflow-hidden">
            {children}
          </div>
        </AnimatedBorder>
      ) : (
        <div className="rounded-xl bg-card border border-border overflow-hidden">
          {children}
        </div>
      )}
    </button>
  );
};
