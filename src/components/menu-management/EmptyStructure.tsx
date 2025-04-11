
import React from 'react';
import { motion } from 'framer-motion';
import { ListTree, Package, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EmptyStructureProps {
  onUseTemplate: () => void;
  onCreateManually: () => void;
}

const EmptyStructure: React.FC<EmptyStructureProps> = ({
  onUseTemplate,
  onCreateManually
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col items-center justify-center p-12 border border-dashed border-gray-300 rounded-lg bg-white"
    >
      <div className="max-w-md text-center space-y-4">
        <div className="bg-blue-50 rounded-full p-4 w-20 h-20 flex items-center justify-center mx-auto">
          <ListTree className="h-8 w-8 text-blue-500" />
        </div>
        <h3 className="text-xl font-medium">No Menu Structure Yet</h3>
        <p className="text-gray-500">
          Get started by importing a template or creating your menu structure from scratch.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 mt-4 justify-center">
          <Button 
            onClick={onUseTemplate}
            className="w-full sm:w-auto flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Package className="h-4 w-4" />
            Use Template
          </Button>
          <Button 
            variant="outline" 
            className="w-full sm:w-auto flex items-center gap-2"
            onClick={onCreateManually}
          >
            <Plus className="h-4 w-4" />
            Create Manually
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default EmptyStructure;
