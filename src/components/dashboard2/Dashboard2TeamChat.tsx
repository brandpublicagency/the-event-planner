import { useState, useEffect, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MessageCircle, Send } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface ChatMessage {
  id: string;
  user_id: string;
  message: string;
  created_at: string;
  profile?: {
    full_name: string | null;
    surname: string | null;
    avatar_url: string | null;
  };
}

const Dashboard2TeamChat = () => {
  const [input, setInput] = useState("");
  const queryClient = useQueryClient();
  const bottomRef = useRef<HTMLDivElement>(null);

  const { data: currentUser } = useQuery({
    queryKey: ["current-user"],
    queryFn: async () => {
      const { data } = await supabase.auth.getUser();
      return data.user;
    },
    staleTime: Infinity,
  });

  const { data: messages = [], isLoading } = useQuery({
    queryKey: ["team-chat"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("team_chat_messages")
        .select("id, user_id, message, created_at")
        .order("created_at", { ascending: true })
        .limit(50);
      if (error) throw error;

      // Fetch profiles for all unique user_ids
      const userIds = [...new Set(data.map((m) => m.user_id))];
      const { data: profiles } = await supabase
        .from("profiles")
        .select("id, full_name, surname, avatar_url")
        .in("id", userIds);

      const profileMap = new Map(profiles?.map((p) => [p.id, p]) || []);

      return data.map((m) => ({
        ...m,
        profile: profileMap.get(m.user_id) || null,
      })) as ChatMessage[];
    },
  });

  // Realtime subscription
  useEffect(() => {
    const channel = supabase
      .channel("team-chat-realtime")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "team_chat_messages" },
        () => {
          queryClient.invalidateQueries({ queryKey: ["team-chat"] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  // Auto-scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = useMutation({
    mutationFn: async (text: string) => {
      if (!currentUser) throw new Error("Not authenticated");
      const { error } = await supabase.from("team_chat_messages").insert({
        user_id: currentUser.id,
        message: text,
      });
      if (error) throw error;
    },
    onSuccess: () => setInput(""),
  });

  const handleSend = () => {
    const trimmed = input.trim();
    if (!trimmed) return;
    sendMessage.mutate(trimmed);
  };

  const getInitials = (profile?: ChatMessage["profile"]) => {
    if (!profile) return "?";
    const f = profile.full_name?.[0] || "";
    const s = profile.surname?.[0] || "";
    return (f + s).toUpperCase() || "?";
  };

  const getDisplayName = (profile?: ChatMessage["profile"]) => {
    if (!profile) return "Unknown";
    return [profile.full_name, profile.surname].filter(Boolean).join(" ") || "Unknown";
  };

  return (
    <div className="rounded-lg border border-border bg-card transition-all hover:border-foreground/30">
      <div className="flex items-center gap-2 p-3 border-b border-border">
        <MessageCircle className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm font-medium text-foreground">Team Chat</span>
      </div>

      <ScrollArea className="h-[280px] px-3 py-2">
        {isLoading ? (
          <p className="text-xs text-muted-foreground text-center py-4">Loading...</p>
        ) : messages.length === 0 ? (
          <p className="text-xs text-muted-foreground text-center py-4">No messages yet. Say hello!</p>
        ) : (
          <div className="flex flex-col gap-2">
            {messages.map((msg) => {
              const isMe = msg.user_id === currentUser?.id;
              return (
                <div key={msg.id} className={`flex gap-2 ${isMe ? "flex-row-reverse" : ""}`}>
                  <Avatar className="h-6 w-6 shrink-0 mt-0.5">
                    {msg.profile?.avatar_url && <AvatarImage src={msg.profile.avatar_url} />}
                    <AvatarFallback className="text-[10px]">{getInitials(msg.profile)}</AvatarFallback>
                  </Avatar>
                  <div className={`max-w-[75%] ${isMe ? "text-right" : ""}`}>
                    <div className="flex items-baseline gap-1.5" style={{ flexDirection: isMe ? "row-reverse" : "row" }}>
                      <span className="text-[11px] font-medium text-foreground">{getDisplayName(msg.profile)}</span>
                      <span className="text-[10px] text-muted-foreground">
                        {formatDistanceToNow(new Date(msg.created_at), { addSuffix: true })}
                      </span>
                    </div>
                    <p className={`text-xs mt-0.5 rounded-md px-2 py-1 inline-block ${isMe ? "bg-primary/10 text-foreground" : "bg-muted text-foreground"}`}>
                      {msg.message}
                    </p>
                  </div>
                </div>
              );
            })}
            <div ref={bottomRef} />
          </div>
        )}
      </ScrollArea>

      <div className="flex gap-1.5 p-2 border-t border-border">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
          placeholder="Type a message..."
          className="h-7 text-xs"
        />
        <Button
          size="icon"
          variant="ghost"
          className="h-7 w-7 shrink-0"
          onClick={handleSend}
          disabled={!input.trim() || sendMessage.isPending}
        >
          <Send className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  );
};

export default Dashboard2TeamChat;
