
import React from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { DialogTrigger } from '@/components/ui/dialog';

interface TemplateCardProps {
  template: {
    id: string;
    title: string;
    description: string;
    categories: string[];
    color: string;
    icon: React.ReactNode;
  };
  onSelect: (templateId: string) => void;
}

const TemplateCard: React.FC<TemplateCardProps> = ({ template, onSelect }) => {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className={cn(
        "border rounded-lg overflow-hidden cursor-pointer hover:shadow-md transition-all",
        template.color
      )}
      onClick={() => {
        onSelect(template.id);
      }}
    >
      <div className="h-32 bg-white flex items-center justify-center">
        {template.icon}
      </div>
      
      <div className="p-4 bg-white border-t">
        <h3 className="font-medium text-lg mb-1">{template.title}</h3>
        <p className="text-sm text-gray-600 mb-3">{template.description}</p>
        
        {template.categories.length > 0 ? (
          <div className="space-y-1">
            <p className="text-xs text-gray-500">Includes:</p>
            <div className="space-y-1">
              {template.categories.slice(0, 3).map((category, i) => (
                <div key={i} className="flex items-center text-xs">
                  <span className="w-1.5 h-1.5 rounded-full bg-gray-400 mr-2"></span>
                  <span className="text-gray-700 truncate">{category}</span>
                </div>
              ))}
              
              {template.categories.length > 3 && (
                <div className="text-xs text-gray-500">
                  +{template.categories.length - 3} more
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="py-2 flex items-center justify-center">
            <p className="text-xs text-gray-500 italic">Build custom structure</p>
          </div>
        )}
      </div>
      
      <div className="flex items-center justify-between p-3 bg-white border-t border-gray-100">
        <DialogTrigger asChild>
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-sm w-full flex justify-center hover:bg-gray-50"
          >
            <span>Use Template</span>
            <ArrowRight className="ml-2 h-3.5 w-3.5" />
          </Button>
        </DialogTrigger>
      </div>
    </motion.div>
  );
};

export default TemplateCard;
