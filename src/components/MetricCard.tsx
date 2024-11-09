import { ReactNode } from "react";

interface MetricCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  trend?: {
    value: number;
    isUpward: boolean;
  };
}

const MetricCard = ({ title, value, icon, trend }: MetricCardProps) => {
  return (
    <div className="metric-card">
      <div className="flex items-center justify-between">
        <div className="text-sm text-zinc-600">{title}</div>
        <div className="rounded-md bg-zinc-100 p-1.5 text-zinc-900">{icon}</div>
      </div>
      <div className="mt-3 flex items-baseline">
        <div className="text-lg font-medium text-zinc-900">{value}</div>
        {trend && (
          <span className={`ml-2 text-xs ${trend.isUpward ? "text-success" : "text-error"}`}>
            {trend.isUpward ? "+" : "-"}{trend.value}%
          </span>
        )}
      </div>
    </div>
  );
};

export default MetricCard;