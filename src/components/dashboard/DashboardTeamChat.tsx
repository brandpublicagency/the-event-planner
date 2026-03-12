import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MessageCircle, Send, Trash2, SmilePlus } from "lucide-react";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

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

interface Reaction {
  id: string;
  message_id: string;
  user_id: string;
  emoji: string;
}

interface TypingUser {
  userId: string;
  name: string;
}

const TYPING_TIMEOUT = 3000;
const EMOJI_OPTIONS = ["👍", "❤️", "😂", "😮", "😢", "🔥", "👏", "🎉"];

const DashboardTeamChat = ({ className }: { className?: string }) => {
  const [input, setInput] = useState("");
  const [typingUsers, setTypingUsers] = useState<Map<string, TypingUser>>(new Map());
  const queryClient = useQueryClient();
  const bottomRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastTypingBroadcast = useRef<number>(0);
  const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null);

  const { data: currentUser } = useQuery({
    queryKey: ["current-user"],
    queryFn: async () => {
      const { data } = await supabase.auth.getUser();
      return data.user;
    },
    staleTime: Infinity,
  });

  const { data: profile } = useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      if (!currentUser) return null;
      const { data } = await supabase
        .from("profiles")
        .select("full_name, surname")
        .eq("id", currentUser.id)
        .single();
      return data;
    },
    enabled: !!currentUser,
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

  const messageIds = useMemo(() => messages.map((m) => m.id), [messages]);
  const stableMessageKey = useMemo(() => messageIds.join(","), [messageIds]);
  const { data: reactions = [] } = useQuery({
    queryKey: ["chat-reactions", stableMessageKey],
    queryFn: async () => {
      if (messageIds.length === 0) return [];
      const { data, error } = await supabase
        .from("chat_message_reactions")
        .select("id, message_id, user_id, emoji")
        .in("message_id", messageIds);
      if (error) throw error;
      return data as Reaction[];
    },
    enabled: messageIds.length > 0,
  });

  const reactionsByMessage = reactions.reduce<Record<string, Reaction[]>>((acc, r) => {
    if (!acc[r.message_id]) acc[r.message_id] = [];
    acc[r.message_id].push(r);
    return acc;
  }, {});

  useEffect(() => {
    const channel = supabase
      .channel("team-chat-realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "team_chat_messages" },
        () => {
          queryClient.invalidateQueries({ queryKey: ["team-chat"] });
        }
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "chat_message_reactions" },
        () => {
          queryClient.invalidateQueries({ queryKey: ["chat-reactions"] });
        }
      )
      .on("broadcast", { event: "typing" }, ({ payload }) => {
        if (!payload || payload.userId === currentUser?.id) return;

        setTypingUsers((prev) => {
          const next = new Map(prev);
          next.set(payload.userId, { userId: payload.userId, name: payload.name });
          return next;
        });

        setTimeout(() => {
          setTypingUsers((prev) => {
            const next = new Map(prev);
            next.delete(payload.userId);
            return next;
          });
        }, TYPING_TIMEOUT);
      })
      .on("broadcast", { event: "stop_typing" }, ({ payload }) => {
        if (!payload) return;
        setTypingUsers((prev) => {
          const next = new Map(prev);
          next.delete(payload.userId);
          return next;
        });
      })
      .subscribe();

    channelRef.current = channel;

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient, currentUser?.id]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const broadcastTyping = useCallback(() => {
    if (!currentUser || !channelRef.current) return;
    const now = Date.now();
    if (now - lastTypingBroadcast.current < 2000) return;
    lastTypingBroadcast.current = now;

    const name = [profile?.full_name, profile?.surname].filter(Boolean).join(" ") || "Someone";

    channelRef.current.send({
      type: "broadcast",
      event: "typing",
      payload: { userId: currentUser.id, name },
    });
  }, [currentUser, profile]);

  const broadcastStopTyping = useCallback(() => {
    if (!currentUser || !channelRef.current) return;
    channelRef.current.send({
      type: "broadcast",
      event: "stop_typing",
      payload: { userId: currentUser.id },
    });
  }, [currentUser]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);

    if (e.target.value.trim()) {
      broadcastTyping();
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = setTimeout(broadcastStopTyping, TYPING_TIMEOUT);
    } else {
      broadcastStopTyping();
    }
  };

  const sendMessage = useMutation({
    mutationFn: async (text: string) => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("No active session. Please log in again.");
      const { error } = await supabase.from("team_chat_messages").insert({
        user_id: session.user.id,
        message: text,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      setInput("");
      broadcastStopTyping();
    },
    onError: (error) => {
      toast.error(`Failed to send message: ${error.message}`);
    },
  });

  const deleteMessage = useMutation({
    mutationFn: async (messageId: string) => {
      const { error } = await supabase
        .from("team_chat_messages")
        .delete()
        .eq("id", messageId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["team-chat"] });
    },
  });

  const toggleReaction = useMutation({
    mutationFn: async ({ messageId, emoji }: { messageId: string; emoji: string }) => {
      if (!currentUser) throw new Error("Not authenticated");

      const existing = reactions.find(
        (r) => r.message_id === messageId && r.user_id === currentUser.id && r.emoji === emoji
      );

      if (existing) {
        const { error } = await supabase
          .from("chat_message_reactions")
          .delete()
          .eq("id", existing.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("chat_message_reactions")
          .insert({ message_id: messageId, user_id: currentUser.id, emoji });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["chat-reactions"] });
    },
  });

  const handleSend = () => {
    const trimmed = input.trim();
    if (!trimmed) return;
    sendMessage.mutate(trimmed);
  };

  const getInitials = (p?: ChatMessage["profile"]) => {
    if (!p) return "?";
    const f = p.full_name?.[0] || "";
    const s = p.surname?.[0] || "";
    return (f + s).toUpperCase() || "?";
  };

  const getDisplayName = (p?: ChatMessage["profile"]) => {
    if (!p) return "Unknown";
    return [p.full_name, p.surname].filter(Boolean).join(" ") || "Unknown";
  };

  const getGroupedReactions = (messageId: string) => {
    const msgReactions = reactionsByMessage[messageId] || [];
    const grouped: Record<string, { count: number; hasReacted: boolean }> = {};
    for (const r of msgReactions) {
      if (!grouped[r.emoji]) grouped[r.emoji] = { count: 0, hasReacted: false };
      grouped[r.emoji].count++;
      if (r.user_id === currentUser?.id) grouped[r.emoji].hasReacted = true;
    }
    return grouped;
  };

  const typingNames = Array.from(typingUsers.values()).map((t) => t.name);
  const typingText =
    typingNames.length === 1
      ? `${typingNames[0]} is typing...`
      : typingNames.length === 2
        ? `${typingNames[0]} and ${typingNames[1]} are typing...`
        : typingNames.length > 2
          ? `${typingNames[0]} and ${typingNames.length - 1} others are typing...`
          : null;

  return (
    <div className={`rounded-xl border border-border bg-card/50 transition-all hover:border-foreground/30 flex flex-col ${className || ""}`}>
      <div className="flex items-center gap-2 p-3 border-b border-border shrink-0 rounded-t-xl">
        <MessageCircle className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm font-medium text-foreground">Team Chat</span>
      </div>

      <ScrollArea className="flex-1 min-h-0 px-4 py-3">
        {isLoading ? (
          <p className="text-xs text-muted-foreground text-center py-4">Loading...</p>
        ) : messages.length === 0 ? (
          <p className="text-xs text-muted-foreground text-center py-4">No messages yet. Say hello!</p>
        ) : (
          <div className="flex flex-col gap-2">
            {messages.map((msg) => {
              const isMe = msg.user_id === currentUser?.id;
              const grouped = getGroupedReactions(msg.id);
              const hasReactions = Object.keys(grouped).length > 0;

              return (
                <div key={msg.id} className={`group/msg flex gap-2 ${isMe ? "flex-row-reverse" : ""}`}>
                  <div className={`max-w-[80%] ${isMe ? "text-right" : ""}`}>
                    <div className="flex items-baseline gap-1.5" style={{ flexDirection: isMe ? "row-reverse" : "row" }}>
                      <span className="text-[11px] font-medium text-foreground">{getDisplayName(msg.profile)}</span>
                      <span className="text-[10px] text-muted-foreground">
                        {formatDistanceToNow(new Date(msg.created_at), { addSuffix: true })}
                      </span>
                    </div>
                    <div className="flex items-center gap-1" style={{ flexDirection: isMe ? "row-reverse" : "row" }}>
                      <p className={`text-xs mt-0.5 rounded-md px-2 py-1 inline-block ${isMe ? "bg-primary/10 text-foreground" : "bg-muted text-foreground"}`}>
                        {msg.message}
                      </p>
                      <div className="opacity-0 group-hover/msg:opacity-100 transition-opacity flex items-center gap-0.5 mt-0.5">
                        <Popover>
                          <PopoverTrigger asChild>
                            <button
                              className="p-0.5 rounded hover:bg-muted"
                              title="React"
                            >
                              <SmilePlus className="h-3 w-3 text-muted-foreground" />
                            </button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-1.5" side="top" align="start">
                            <div className="flex gap-1">
                              {EMOJI_OPTIONS.map((emoji) => (
                                <button
                                  key={emoji}
                                  onClick={() => toggleReaction.mutate({ messageId: msg.id, emoji })}
                                  className="text-sm hover:bg-muted rounded p-1 transition-colors"
                                >
                                  {emoji}
                                </button>
                              ))}
                            </div>
                          </PopoverContent>
                        </Popover>
                        {isMe && (
                          <button
                            onClick={() => deleteMessage.mutate(msg.id)}
                            className="p-0.5 rounded hover:bg-destructive/10"
                            title="Delete message"
                          >
                            <Trash2 className="h-3 w-3 text-muted-foreground hover:text-destructive" />
                          </button>
                        )}
                      </div>
                    </div>
                    {hasReactions && (
                      <div className="flex flex-wrap gap-1 mt-1" style={{ justifyContent: isMe ? "flex-end" : "flex-start" }}>
                        {Object.entries(grouped).map(([emoji, { count, hasReacted }]) => (
                          <button
                            key={emoji}
                            onClick={() => toggleReaction.mutate({ messageId: msg.id, emoji })}
                            className={`inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-[10px] border transition-colors ${
                              hasReacted
                                ? "border-primary/40 bg-primary/10 text-foreground"
                                : "border-border bg-muted/50 text-muted-foreground hover:border-foreground/30"
                            }`}
                          >
                            <span>{emoji}</span>
                            <span>{count}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
            <div ref={bottomRef} />
          </div>
        )}
      </ScrollArea>

      <div className="h-5 px-3 flex items-center">
        {typingText && (
          <span className="text-[10px] text-muted-foreground animate-pulse">
            {typingText}
          </span>
        )}
      </div>

      <div className="flex gap-1.5 p-2 border-t border-border">
        <Input
          value={input}
          onChange={handleInputChange}
          onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
          placeholder="Type a message..."
          className="h-7 text-xs"
        />
        <Button
          size="icon"
          variant="outline"
          className="h-7 w-7 shrink-0 bg-card"
          onClick={handleSend}
          disabled={!input.trim() || sendMessage.isPending}
        >
          <Send className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  );
};

export default DashboardTeamChat;
