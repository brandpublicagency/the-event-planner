import { ReactNode } from "react";

interface FormSectionProps {
  title: string;
  children: ReactNode;
}

const FormSection = ({ title, children }: FormSectionProps) => {
  return (
    <div className="bg-white rounded-lg p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-zinc-900 mb-6">{title}</h3>
      <div className="space-y-4">
        {children}
      </div>
    </div>
  );
};

export default FormSection;