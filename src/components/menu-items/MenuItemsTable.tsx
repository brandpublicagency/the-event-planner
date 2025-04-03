
import React, { useState, useEffect } from 'react';
import { MenuItem, MenuChoice } from '@/api/menuItemsApi';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { EditIcon, Trash2Icon } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useMenuChoices } from '@/hooks/useMenuChoices';

type MenuItemsTableProps = {
  items: MenuItem[];
  onEdit: (item: MenuItem) => void;
  onDelete: (id: string) => void;
  isDeleting: boolean;
};

const MenuItemsTable: React.FC<MenuItemsTableProps> = ({
  items,
  onEdit,
  onDelete,
  isDeleting,
}) => {
  const [itemToDelete, setItemToDelete] = useState<MenuItem | null>(null);
  const [selectedChoice, setSelectedChoice] = useState<string | null>(null);
  const { choices } = useMenuChoices();
  const [allChoices, setAllChoices] = useState<MenuChoice[]>([]);

  // Fetch all choices
  useEffect(() => {
    setAllChoices(choices);
  }, [choices]);

  const handleDelete = () => {
    if (itemToDelete) {
      onDelete(itemToDelete.id);
      setItemToDelete(null);
    }
  };

  // Get unique choices
  const uniqueChoices = [...new Set(items.map(item => item.choice))];
  
  // Filter items by choice if selected
  const filteredItems = selectedChoice 
    ? items.filter(item => item.choice === selectedChoice)
    : items;

  const getChoiceLabel = (choiceValue: string): string => {
    const choice = allChoices.find(c => c.value === choiceValue);
    return choice ? choice.label : choiceValue;
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2 mb-4">
        <Button
          variant={selectedChoice === null ? "default" : "outline"}
          size="sm"
          onClick={() => setSelectedChoice(null)}
          className="mb-1"
        >
          All
        </Button>
        {uniqueChoices.map(c => (
          <Button
            key={c}
            variant={selectedChoice === c ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedChoice(c)}
            className="mb-1"
          >
            {getChoiceLabel(c)}
          </Button>
        ))}
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Choice</TableHead>
              <TableHead>Name</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredItems.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} className="text-center py-4 text-gray-500">
                  No menu items found
                </TableCell>
              </TableRow>
            ) : (
              filteredItems.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <Badge variant="outline">{getChoiceLabel(item.choice)}</Badge>
                  </TableCell>
                  <TableCell>
                    <div>{item.label}</div>
                    {item.description && (
                      <div className="text-xs text-gray-500 truncate max-w-[250px]">
                        {item.description}
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onEdit(item)}
                      >
                        <EditIcon className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setItemToDelete(item)}
                      >
                        <Trash2Icon className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <AlertDialog open={!!itemToDelete} onOpenChange={(open) => !open && setItemToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the menu item "{itemToDelete?.label}".
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} disabled={isDeleting}>
              {isDeleting ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default MenuItemsTable;
