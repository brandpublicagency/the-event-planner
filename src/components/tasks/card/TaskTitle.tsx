import { cn } from "@/lib/utils";

interface TaskTitleProps {
  title: string;
  taskCode: string;
  completed: boolean;
}

export function TaskTitle({ title, taskCode, completed }: TaskTitleProps) {
  return (
    <div className="flex items-center gap-2">
      <h3 className={cn(
        "font-medium text-sm leading-none",
        completed && "line-through text-muted-foreground"
      )}>
        {title}
      </h3>
      <span className="text-[0.65rem] text-muted-foreground">
        {taskCode}
      </span>
    </div>
  );
}