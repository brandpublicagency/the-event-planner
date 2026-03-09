import { ReactNode } from "react";
import { Card } from "@/components/ui/card";

interface FormSectionProps {
  title: string;
  description?: string;
  children: ReactNode;
  icon?: ReactNode;
}

const FormSection = ({ title, description, children, icon }: FormSectionProps) => {
  return (
    <Card className="p-6 bg-card">
      <div className="space-y-6">
        <div className="space-y-1 border-b pb-4">
          <div className="flex items-center gap-2">
            {icon}
            <h3 className="text-lg font-semibold text-foreground">{title}</h3>
          </div>
          {description && (
            <p className="text-sm text-muted-foreground">{description}</p>
          )}
        </div>
        <div className="space-y-4">
          {children}
        </div>
      </div>
    </Card>
  );
};

export default FormSection;