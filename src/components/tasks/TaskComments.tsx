import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { format } from "date-fns";
import { useToast } from "@/components/ui/use-toast";

interface Comment {
  id: string;
  content: string;
  created_at: string;
  task_id: string;
  user_id: string;
  profiles: {
    full_name: string | null;
    avatar_url: string | null;
  } | null;
}

interface TaskCommentsProps {
  taskId: string;
}

export function TaskComments({ taskId }: TaskCommentsProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [newComment, setNewComment] = useState("");

  const { data: comments = [], isLoading } = useQuery({
    queryKey: ["comments", taskId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("task_comments")
        .select(`
          *,
          profiles!task_comments_user_id_fkey(
            full_name,
            avatar_url
          )
        `)
        .eq("task_id", taskId)
        .order("created_at", { ascending: true });

      if (error) throw error;
      return data as Comment[];
    },
  });

  const addCommentMutation = useMutation({
    mutationFn: async (comment: string) => {
      const { error } = await supabase
        .from("task_comments")
        .insert([{ content: comment, task_id: taskId }]);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", taskId] });
      setNewComment("");
      toast({
        title: "Comment added",
        description: "Your comment has been posted.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error adding comment",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleAddComment = () => {
    if (!newComment.trim()) return;
    addCommentMutation.mutate(newComment);
  };

  return (
    <div className="space-y-4">
      <div className="space-y-4">
        {comments.map((comment) => (
          <div key={comment.id} className="flex gap-3">
            <Avatar className="h-8 w-8">
              <AvatarImage src={comment.profiles?.avatar_url || undefined} />
              <AvatarFallback>
                {comment.profiles?.full_name?.charAt(0) || "U"}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">
                  {comment.profiles?.full_name || "Unknown User"}
                </span>
                <span className="text-xs text-muted-foreground">
                  {format(new Date(comment.created_at), "PP")}
                </span>
              </div>
              <p className="text-sm mt-1">{comment.content}</p>
            </div>
          </div>
        ))}
      </div>
      
      <div className="flex gap-2">
        <Textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Write a comment..."
          className="min-h-[80px]"
        />
        <Button onClick={handleAddComment} className="self-end">
          Post
        </Button>
      </div>
    </div>
  );
}