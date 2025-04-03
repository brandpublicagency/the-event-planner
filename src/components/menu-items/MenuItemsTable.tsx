
import React, { useState } from 'react';
import { MenuItem } from '@/api/menuItemsApi';
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
import { EditIcon, Trash2Icon, ImageIcon } from 'lucide-react';
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
import { useMenuSections } from '@/hooks/useMenuSections';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

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
  const [section, setSection] = useState<string | null>(null);
  const { sections } = useMenuSections();

  const handleDelete = () => {
    if (itemToDelete) {
      onDelete(itemToDelete.id);
      setItemToDelete(null);
    }
  };

  // Get unique sections
  const uniqueSections = [...new Set(items.map(item => item.section))];
  
  // Filter items by section if selected
  const filteredItems = section 
    ? items.filter(item => item.section === section)
    : items;

  const getCategoryLabel = (categoryValue: string): string => {
    const categoryMap: Record<string, string> = {
      'canapes': 'Canapés',
      'plated': 'Plated',
      'buffet_meat': 'Buffet Meat',
      'buffet_vegetable': 'Buffet Vegetable',
      'buffet_starch': 'Buffet Starch',
      'karoo_meat': 'Karoo Meat',
      'karoo_vegetable': 'Karoo Vegetable',
      'karoo_starch': 'Karoo Starch',
      'plated_main': 'Plated Main',
      'dessert_canapes': 'Dessert Canapés',
      'individual_cakes': 'Individual Cakes',
      'traditional': 'Traditional',
    };
    
    return categoryMap[categoryValue] || categoryValue;
  };

  const getSectionLabel = (sectionValue: string): string => {
    const sectionObj = sections.find(s => s.value === sectionValue);
    return sectionObj ? sectionObj.label : sectionValue;
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2 mb-4">
        <Button
          variant={section === null ? "default" : "outline"}
          size="sm"
          onClick={() => setSection(null)}
          className="mb-1"
        >
          All
        </Button>
        {uniqueSections.map(s => (
          <Button
            key={s}
            variant={section === s ? "default" : "outline"}
            size="sm"
            onClick={() => setSection(s)}
            className="mb-1"
          >
            {getSectionLabel(s)}
          </Button>
        ))}
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[60px]">Image</TableHead>
              <TableHead>Section</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Name</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredItems.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-4 text-gray-500">
                  No menu items found
                </TableCell>
              </TableRow>
            ) : (
              filteredItems.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <Avatar>
                      <AvatarImage src={item.image_url || undefined} alt={item.label} />
                      <AvatarFallback>
                        <ImageIcon className="h-4 w-4 text-gray-400" />
                      </AvatarFallback>
                    </Avatar>
                  </TableCell>
                  <TableCell>{getSectionLabel(item.section)}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{getCategoryLabel(item.category)}</Badge>
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
