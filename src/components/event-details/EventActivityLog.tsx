import React, { useEffect, useState } from "react";
import { format } from "date-fns";
import { useInfiniteQuery } from "@tanstack/react-query";
import { ChevronDown, ChevronRight, Activity, Search, Loader2 } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";

const PAGE_SIZE = 20;

interface EventActivityLogProps {
  eventCode: string;
}

interface ActivityRow {
  id: string;
  actor: string;
  action: string;
  created_at: string;
}

const formatTimestamp = (iso: string): string => {
  try {
    return format(new Date(iso), "dd MMM yyyy 'at' HH:mm");
  } catch {
    return iso;
  }
};

const escapeLike = (value: string) => value.replace(/[%_,()]/g, " ").trim();

export const EventActivityLog: React.FC<EventActivityLogProps> = ({ eventCode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => setSearch(escapeLike(searchInput)), 300);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const { data, isLoading, isError, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: ["event-activity-log", eventCode, search],
      enabled: isOpen,
      initialPageParam: 0,
      queryFn: async ({ pageParam }) => {
        let query = supabase
          .from("event_activity_log")
          .select("id, actor, action, created_at", { count: "exact" })
          .eq("event_code", eventCode)
          .order("created_at", { ascending: false })
          .range(pageParam, pageParam + PAGE_SIZE - 1);
        if (search) {
          query = query.or(`actor.ilike.%${search}%,action.ilike.%${search}%`);
        }
        const { data, error, count } = await query;
        if (error) throw error;
        return { rows: (data ?? []) as ActivityRow[], count: count ?? 0, next: pageParam + PAGE_SIZE };
      },
      getNextPageParam: (lastPage) => (lastPage.next < lastPage.count ? lastPage.next : undefined),
    });

  const entries = data?.pages.flatMap((page) => page.rows) ?? [];
  const total = data?.pages[0]?.count ?? 0;

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
        {total > 0 && <span className="text-xs text-muted-foreground">({total})</span>}
      </CollapsibleTrigger>

      <CollapsibleContent className="pt-3 space-y-4">
        <div className="relative max-w-xs">
          <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
          <Input
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search activity..."
            aria-label="Search activity log"
            className="pl-8 h-9 text-xs"
          />
        </div>

        {isLoading ? (
          <div className="flex items-center gap-2 pl-6 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" /> Loading activity...
          </div>
        ) : isError ? (
          <p className="text-sm text-destructive pl-6">Couldn't load the activity log.</p>
        ) : entries.length === 0 ? (
          <p className="text-sm text-muted-foreground pl-6">
            {search ? "No activity matches your search." : "No activity recorded yet."}
          </p>
        ) : (
          <div className="ml-2 border-l-2 border-muted pl-4 space-y-4">
            {entries.map((entry) => {
              const isSystem = entry.actor === "System";
              const tone = isSystem ? "text-muted-foreground" : "text-foreground";
              return (
                <div key={entry.id} className="relative">
                  <div className="absolute -left-[21px] top-1.5 h-2 w-2 rounded-full bg-muted-foreground" />
                  <div className="flex flex-col gap-0.5">
                    <p className="text-sm">
                      <span className={`font-medium ${tone}`}>{entry.actor}</span>{" "}
                      <span className={tone}>{entry.action}</span>
                    </p>
                    <span className="text-xs text-muted-foreground">
                      {formatTimestamp(entry.created_at)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {hasNextPage && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => fetchNextPage()}
            disabled={isFetchingNextPage}
            className="ml-6 text-xs"
          >
            {isFetchingNextPage ? "Loading..." : `Show more (${total - entries.length} remaining)`}
          </Button>
        )}
      </CollapsibleContent>
    </Collapsible>
  );
};
