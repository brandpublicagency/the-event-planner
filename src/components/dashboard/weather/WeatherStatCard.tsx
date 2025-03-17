
import React, { ReactNode } from 'react';

interface WeatherStatCardProps {
  label: ReactNode;
  value: string;
  className?: string;
}

export const WeatherStatCard: React.FC<WeatherStatCardProps> = ({ label, value, className = '' }) => {
  return (
    <div className="flex flex-col items-center justify-center p-2 bg-white/10 backdrop-blur-sm rounded-md">
      <span className="text-xs text-white/80 mb-1">{label}</span>
      <span className={`text-sm font-semibold ${className}`}>{value}</span>
    </div>
  );
};
