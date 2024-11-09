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
        <div className="text-gray-500">{title}</div>
        <div className="rounded-full bg-primary-50 p-2 text-primary">{icon}</div>
      </div>
      <div className="mt-4 flex items-baseline">
        <div className="text-2xl font-semibold text-gray-900">{value}</div>
        {trend && (
          <span className={`ml-2 text-sm ${trend.isUpward ? "text-success" : "text-error"}`}>
            {trend.isUpward ? "+" : "-"}{trend.value}%
          </span>
        )}
      </div>
    </div>
  );
};

export default MetricCard;