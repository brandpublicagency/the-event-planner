import { useState } from "react";
import { Input } from "@/components/ui/input";
import { useTaskContext } from "@/contexts/TaskContext";
import { Loader2, Search } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, User, Calendar, Flag } from "lucide-react";

interface TaskListProps {
  onTaskSelect: (taskId: string) => void;
  selectedTaskId: string | null;
}

export function TaskList({ onTaskSelect, selectedTaskId }: TaskListProps) {
  const { tasks, isLoading, toggleTask } = useTaskContext();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredTasks = tasks.filter((task) =>
    task.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="flex justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const priorityColors = {
    high: "bg-red-100 text-red-800",
    medium: "bg-yellow-100 text-yellow-800",
    low: "bg-green-100 text-green-800",
  };

  return (
    <Card className="p-4">
      <div className="relative mb-4">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search tasks..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9"
        />
      </div>
      
      <ScrollArea className="h-[calc(100vh-16rem)]">
        <div className="space-y-2">
          {filteredTasks.map((task) => (
            <div
              key={task.id}
              className={`p-4 border rounded-lg hover:border-primary/50 cursor-pointer transition-all ${
                selectedTaskId === task.id.toLowerCase() ? 'border-primary' : 'border-border'
              }`}
              onClick={() => onTaskSelect(task.id.toLowerCase())}
            >
              <div className="flex items-start gap-3">
                <Checkbox
                  checked={task.completed}
                  onCheckedChange={(checked) => {
                    toggleTask(task.id.toLowerCase(), checked as boolean);
                  }}
                  onClick={(e) => e.stopPropagation()}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-medium text-sm">{task.title}</h3>
                      <p className="text-xs text-muted-foreground">{task.task_code?.toLowerCase()}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                    {task.due_date && (
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {format(new Date(task.due_date), "dd MMM yyyy")}
                      </div>
                    )}
                    {task.priority && (
                      <div className="flex items-center gap-1">
                        <Flag className="h-3 w-3" />
                        <Badge variant="secondary" className={priorityColors[task.priority as keyof typeof priorityColors]}>
                          {task.priority}
                        </Badge>
                      </div>
                    )}
                    {task.assigned_to && (
                      <div className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        <span>LeRoux</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
          {filteredTasks.length === 0 && (
            <p className="text-center text-muted-foreground py-8">
              {searchQuery ? "No tasks found matching your search" : "No tasks yet"}
            </p>
          )}
        </div>
      </ScrollArea>
    </Card>
  );
}