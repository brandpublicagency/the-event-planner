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
  return <button onClick={() => navigate(`/events/${eventCode}`)} className="text-left w-full">
      {eventIsToday ? <AnimatedBorder borderWidth={3} borderRadius={12} className="mb-1.5">
          <div className="rounded-xl bg-white border border-zinc-100 overflow-hidden">
            {children}
          </div>
        </AnimatedBorder> : <div className="rounded-xl mb-1.5 bg-white border border-slate-200 overflow-hidden">
          {children}
        </div>}
    </button>;
};