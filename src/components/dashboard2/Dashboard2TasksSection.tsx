import { useTaskContext } from "@/contexts/TaskContext";
import { motion, AnimatePresence } from "framer-motion";
import { ListTodo, Plus, CheckCircle2, Circle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const priorityConfig: Record<string, { label: string; color: string; dotColor: string }> = {
  high: { label: 'High', color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300', dotColor: 'bg-red-500' },
  medium: { label: 'Medium', color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300', dotColor: 'bg-amber-500' },
  normal: { label: 'Normal', color: 'bg-muted text-muted-foreground', dotColor: 'bg-muted-foreground' },
};

const Dashboard2TasksSection = () => {
  const { tasks, addTask, toggleTask } = useTaskContext();
  const navigate = useNavigate();
  const [newTaskTitle, setNewTaskTitle] = useState('');

  const pendingTasks = tasks.filter(t => !t.completed);
  const highCount = pendingTasks.filter(t => t.priority === 'high').length;

  const groupedTasks: Record<string, typeof pendingTasks> = {
    high: pendingTasks.filter(t => t.priority === 'high'),
    medium: pendingTasks.filter(t => t.priority === 'medium'),
    normal: pendingTasks.filter(t => !t.priority || t.priority === 'normal' || (t.priority !== 'high' && t.priority !== 'medium')),
  };

  const handleAddTask = async () => {
    if (!newTaskTitle.trim()) return;
    await addTask(newTaskTitle.trim());
    setNewTaskTitle('');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.15 }}
      className="rounded-xl border border-border bg-muted/40"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center gap-2">
          <ListTodo className="h-4 w-4 text-muted-foreground" />
          <h3 className="text-sm font-medium text-foreground">Tasks</h3>
        </div>
        <span className="text-xs text-muted-foreground">
          {pendingTasks.length} task{pendingTasks.length !== 1 ? 's' : ''}
          {highCount > 0 && (
            <span className="text-destructive"> · {highCount} high</span>
          )}
        </span>
      </div>

      {/* Task groups */}
      <div className="p-3 max-h-[360px] overflow-y-auto space-y-3">
        {Object.entries(groupedTasks).map(([priority, pTasks]) => {
          if (pTasks.length === 0) return null;
          const config = priorityConfig[priority] || priorityConfig.normal;
          return (
            <div key={priority}>
              <div className="flex items-center gap-1.5 mb-1.5">
                <div className={cn('h-1.5 w-1.5 rounded-full', config.dotColor)} />
                <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                  {config.label}
                </span>
              </div>
              <AnimatePresence mode="popLayout">
                {pTasks.map(task => (
                  <motion.div
                    key={task.id}
                    layout
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 8, transition: { duration: 0.2 } }}
                    className="flex items-center gap-2 rounded-md px-2 py-1.5 hover:bg-muted transition-colors group"
                  >
                    <button
                      onClick={() => toggleTask(task.id, true)}
                      className="shrink-0"
                    >
                      <Circle className="h-3.5 w-3.5 text-muted-foreground group-hover:text-primary transition-colors" />
                    </button>
                    <button
                      onClick={() => navigate(`/tasks?selected=${task.id}`)}
                      className="flex-1 text-left text-xs text-foreground truncate"
                    >
                      {task.title}
                    </button>
                    {task.priority && task.priority !== 'normal' && (
                      <Badge className={cn('text-[9px] h-4 px-1 border-0', config.color)}>
                        {config.label}
                      </Badge>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          );
        })}

        {pendingTasks.length === 0 && (
          <div className="flex flex-col items-center py-6 text-muted-foreground">
            <CheckCircle2 className="h-6 w-6 mb-1.5 opacity-40" />
            <p className="text-xs">All tasks complete</p>
          </div>
        )}
      </div>

      {/* Add task input */}
      <div className="p-3 border-t border-border">
        <div className="flex gap-1.5">
          <Input
            placeholder="Add a task..."
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleAddTask();
              }
            }}
            className="text-xs h-8"
          />
          <Button
            onClick={handleAddTask}
            disabled={!newTaskTitle.trim()}
            size="icon"
            variant="outline"
            className="h-8 w-8 shrink-0"
          >
            <Plus className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default Dashboard2TasksSection;
