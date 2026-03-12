import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Users, MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import type { Event } from "@/types/event";

const eventTypeColors: Record<string, string> = {
  wedding: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300',
  'private event': 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
  celebration: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
  corporate: 'bg-slate-100 text-slate-800 dark:bg-slate-900/30 dark:text-slate-300',
};

interface DashboardEventCardProps {
  event: Event;
}

const DashboardEventCard = ({ event }: DashboardEventCardProps) => {
  const navigate = useNavigate();
  const typeKey = event.event_type?.toLowerCase() || '';
  const colorClass = eventTypeColors[typeKey] || eventTypeColors.corporate;

  const venue = event.venues?.[0] || null;

  return (
    <button
      onClick={() => navigate(`/events/${event.event_code}`)}
      className="w-full text-left rounded-lg border border-border bg-card p-3.5 transition-all hover:border-foreground/30 group"
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <h4 className="text-sm font-medium text-foreground group-hover:text-primary transition-colors line-clamp-1">
          {event.name}
        </h4>
        <Badge className={cn('text-[10px] font-medium px-1.5 py-0 h-5 border-0 shrink-0 hover:bg-inherit', colorClass)}>
          {event.event_type}
        </Badge>
      </div>

      <div className="flex items-center gap-3 text-xs text-muted-foreground">
        {event.event_date && (
          <span>{format(new Date(event.event_date), 'dd MMM yyyy')}</span>
        )}
        {event.pax && (
          <span className="flex items-center gap-1">
            <Users className="h-3 w-3" />
            {event.pax}
          </span>
        )}
        {venue && (
          <span className="flex items-center gap-1 line-clamp-1">
            <MapPin className="h-3 w-3" />
            {venue}
          </span>
        )}
      </div>
    </button>
  );
};

export default DashboardEventCard;
