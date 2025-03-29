
import React from 'react';
import { TableRow, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';

export interface EmptyStateProps {
  title: string;
  description: string;
  onAdd: () => void;
}

const EmptyState: React.FC<EmptyStateProps> = ({ title, description, onAdd }) => {
  return (
    <TableRow>
      <TableCell colSpan={3} className="h-24 text-center">
        <div className="flex flex-col items-center justify-center py-6">
          <h3 className="text-sm font-medium text-zinc-900">{title}</h3>
          <p className="mt-1 text-sm text-zinc-500">{description}</p>
          <Button 
            onClick={onAdd} 
            variant="outline" 
            size="sm" 
            className="mt-4 bg-white border-zinc-300 hover:bg-zinc-50"
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            Add First Item
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
};

export default EmptyState;
