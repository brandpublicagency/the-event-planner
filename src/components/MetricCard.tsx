import { ReactNode } from "react";
import { Card, CardContent } from "@/components/ui/card";

interface MetricCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  trend?: {
    value: number;
    isUpward: boolean;
  };
  onClick?: () => void;
}

const MetricCard = ({ title, value, icon, trend, onClick }: MetricCardProps) => {
  return (
    <Card 
      className="cursor-pointer transition-all duration-300 bg-gradient-to-r hover:from-white hover:to-zinc-50" 
      onClick={onClick}
    >
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="text-sm text-zinc-600">{title}</div>
          <div className="rounded-md bg-zinc-100 p-1.5 text-zinc-900">{icon}</div>
        </div>
        <div className="mt-3 flex items-baseline">
          <div className="text-2xl font-semibold text-zinc-900">{value}</div>
          {trend && (
            <span className={`ml-2 text-sm ${trend.isUpward ? "text-green-600" : "text-red-600"}`}>
              {trend.isUpward ? "+" : "-"}{trend.value}%
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default MetricCard;