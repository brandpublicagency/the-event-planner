import { useState } from "react";
import { Input } from "@/components/ui/input";
import { useTaskContext } from "@/contexts/TaskContext";
import { TaskItem } from "./TaskItem";
import { Loader2, Search } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";

export function TaskList() {
  const { tasks, isLoading } = useTaskContext();
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
      
      <ScrollArea className="h-[500px] pr-4">
        <div className="space-y-2">
          {filteredTasks.map((task) => (
            <TaskItem
              key={task.id}
              id={task.id}
              title={task.title}
              completed={task.completed}
            />
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