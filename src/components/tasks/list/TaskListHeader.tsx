
interface TaskListHeaderProps {
  upcomingCount: number;
  completedCount: number;
}

export function TaskListHeader({ upcomingCount, completedCount }: TaskListHeaderProps) {
  return (
    <div className="w-full">
      <h3 className="text-lg font-medium pb-2">Recent Tasks</h3>
    </div>
  );
}
