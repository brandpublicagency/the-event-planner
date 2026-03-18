import React, { useState } from "react";
import { format } from "date-fns";
import { ChevronDown, ChevronRight, Activity } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import type { ActivityLogEntry } from "@/types/event";

interface EventActivityLogProps {
  activityLog: ActivityLogEntry[] | null;
}

const formatTimestamp = (iso: string): string => {
  try {
    return format(new Date(iso), "dd MMM yyyy 'at' HH:mm");
  } catch {
    return iso;
  }
};

export const EventActivityLog: React.FC<EventActivityLogProps> = ({ activityLog }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showAll, setShowAll] = useState(false);

  const entries = activityLog ?? [];
  const displayEntries = showAll ? entries : entries.slice(0, 10);
  const hasMore = entries.length > 10;

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className="mt-6">
      <CollapsibleTrigger className="flex items-center gap-2 w-full text-left py-2">
        {isOpen ? (
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        ) : (
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
        )}
        <Activity className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm font-medium text-foreground">Activity Log</span>
        {entries.length > 0 && (
          <span className="text-xs text-muted-foreground">({entries.length})</span>
        )}
      </CollapsibleTrigger>

      <CollapsibleContent className="pt-3">
        {entries.length === 0 ? (
          <p className="text-sm text-muted-foreground pl-6">No activity recorded yet.</p>
        ) : (
          <div className="ml-2 border-l-2 border-muted pl-4 space-y-4">
            {displayEntries.map((entry, index) => {
              const isSystem = entry.actor === "System";
              return (
                <div key={index} className="relative">
                  <div className="absolute -left-[21px] top-1.5 h-2 w-2 rounded-full bg-muted-foreground" />
                  <div className="flex flex-col gap-0.5">
                    <p className="text-sm">
                      <span className={`font-medium ${isSystem ? "text-muted-foreground" : "text-foreground"}`}>
                        {entry.actor}
                      </span>
                      {" "}
                      <span className={isSystem ? "text-muted-foreground" : "text-foreground"}>
                        {entry.action}
                      </span>
                    </p>
                    <span className="text-xs text-muted-foreground">
                      {formatTimestamp(entry.timestamp)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {hasMore && !showAll && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowAll(true)}
            className="mt-3 ml-6 text-xs"
          >
            Show all ({entries.length} entries)
          </Button>
        )}
        {hasMore && showAll && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowAll(false)}
            className="mt-3 ml-6 text-xs"
          >
            Show less
          </Button>
        )}
      </CollapsibleContent>
    </Collapsible>
  );
};
