
import React from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Edit, Trash2 } from 'lucide-react';

interface MenuTemplatesListProps {
  isLoading: boolean;
  sections: any[];
  onEditTemplate: (templateId: string) => void;
}

const MenuTemplatesList: React.FC<MenuTemplatesListProps> = ({ 
  isLoading, 
  sections,
  onEditTemplate
}) => {
  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <div className="flex flex-col items-center gap-4">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p className="text-sm text-muted-foreground">Loading templates...</p>
        </div>
      </div>
    );
  }

  if (!sections || sections.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="mx-auto h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center mb-4">
          <div className="h-6 w-6 text-gray-400">🍽️</div>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-1">No templates yet</h3>
        <p className="text-gray-500 max-w-md mx-auto mb-6">
          Create your first menu template to start building reusable menus for your events.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Template Name</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Items</TableHead>
            <TableHead>Last Updated</TableHead>
            <TableHead className="w-[100px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sections.map((section) => (
            <TableRow key={section.id}>
              <TableCell className="font-medium">{section.label}</TableCell>
              <TableCell>{section.type || 'Custom'}</TableCell>
              <TableCell>{section.item_count || 0} items</TableCell>
              <TableCell>{new Date(section.updated_at || section.created_at).toLocaleDateString()}</TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => onEditTemplate(section.id)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    className="text-red-500 hover:text-red-600 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default MenuTemplatesList;
