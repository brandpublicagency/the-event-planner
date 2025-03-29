
import React from 'react';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';

interface EmptyStateProps {
  title: string;
  description: string;
  onAdd: () => void;
}

const EmptyState: React.FC<EmptyStateProps> = ({ title, description, onAdd }) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center border border-dashed border-zinc-300 rounded-lg">
      <h3 className="mb-2 text-lg font-medium text-zinc-900">{title}</h3>
      <p className="mb-6 text-sm text-zinc-500">{description}</p>
      <Button 
        onClick={onAdd} 
        className="bg-zinc-800 hover:bg-zinc-700 text-white"
      >
        <PlusCircle className="h-4 w-4 mr-2" />
        Add First Item
      </Button>
    </div>
  );
};

export default EmptyState;
