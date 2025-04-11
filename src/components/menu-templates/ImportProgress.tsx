
import React from 'react';
import { motion } from 'framer-motion';
import { Progress } from '@/components/ui/progress';

interface ImportProgressProps {
  selectedTemplate: string | null;
  importProgress: number;
  templates: any[];
}

const ImportProgress: React.FC<ImportProgressProps> = ({
  selectedTemplate,
  importProgress,
  templates
}) => {
  const template = templates.find(t => t.id === selectedTemplate);
  
  if (!template) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-md mx-auto bg-white p-8 rounded-lg border shadow-sm"
    >
      <div className="text-center mb-6">
        <div className="mx-auto w-16 h-16 mb-4 relative">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-700"></div>
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            {template.icon}
          </div>
        </div>
        <h3 className="text-lg font-medium mb-2">Importing Template</h3>
        <p className="text-gray-500 mb-6">
          {template.title}
        </p>
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between text-sm mb-1">
          <span>Import progress</span>
          <span>{importProgress}%</span>
        </div>
        <Progress value={importProgress} className="h-2" />
      </div>
      
      <p className="text-center text-sm text-gray-400 italic mt-6">
        This will only take a moment...
      </p>
    </motion.div>
  );
};

export default ImportProgress;
