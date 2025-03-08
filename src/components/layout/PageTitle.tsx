
import React from "react";

interface PageTitleProps {
  title?: string;
  subtitle?: string;
}

export const PageTitle = ({ title, subtitle }: PageTitleProps) => {
  if (!title) return null;
  
  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight text-zinc-900">{title}</h1>
      {subtitle && <p className="text-sm mt-1 text-zinc-500">{subtitle}</p>}
    </div>
  );
};
