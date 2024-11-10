import { ReactNode } from "react";
import { Card } from "@/components/ui/card";

interface FormSectionProps {
  title: string;
  description?: string;
  children: ReactNode;
}

const FormSection = ({ title, description, children }: FormSectionProps) => {
  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div className="space-y-1 border-b pb-4">
          <h3 className="text-lg font-semibold text-zinc-900">{title}</h3>
          {description && (
            <p className="text-sm text-zinc-500">{description}</p>
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