
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { PlusIcon } from 'lucide-react';
import { useMenuSections } from '@/hooks/useMenuSections';
import MenuSectionDialog from './MenuSectionDialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

const MenuSectionsTable = () => {
  const { sections, isLoading } = useMenuSections();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  return (
    <div className="space-y-4">
      <Button 
        size="sm" 
        onClick={() => setIsAddDialogOpen(true)}
        className="mb-4"
      >
        <PlusIcon className="h-4 w-4 mr-2" />
        Add Section
      </Button>

      {isLoading ? (
        <div className="text-center py-4">Loading sections...</div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Display Name</TableHead>
                <TableHead>Value</TableHead>
                <TableHead>Display Order</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sections.map((section) => (
                <TableRow key={section.id}>
                  <TableCell>{section.label}</TableCell>
                  <TableCell>{section.value}</TableCell>
                  <TableCell>{section.display_order}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <MenuSectionDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        title="Add Section"
      />
    </div>
  );
};

export default MenuSectionsTable;
