
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { UseFormReturn } from 'react-hook-form';
import { MenuItemFormValues } from './menu-item-form-schema';
import { Loader2 } from 'lucide-react';

interface MenuItemFormFieldsProps {
  form: UseFormReturn<MenuItemFormValues>;
  categories: string[];
  isLoadingCategories: boolean;
  initialData?: any;
  choiceId: string;
}

export const MenuItemFormFields: React.FC<MenuItemFormFieldsProps> = ({
  form,
  categories,
  isLoadingCategories,
  initialData,
  choiceId,
}) => {
  return (
    <>
      <FormField
        control={form.control}
        name="label"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Display Name</FormLabel>
            <FormControl>
              <Input placeholder="Item name" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="value"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Value</FormLabel>
            <FormControl>
              <Input 
                placeholder="Auto-generated with itm- prefix" 
                {...field} 
                className={!initialData ? "bg-gray-100" : ""}
                readOnly={!initialData}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="category"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Category</FormLabel>
            <Select
              onValueChange={field.onChange}
              defaultValue={field.value || "no-category"}
              value={field.value || "no-category"}
            >
              <FormControl>
                <SelectTrigger className="bg-white">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
              </FormControl>
              <SelectContent className="bg-white max-h-60 z-50">
                <SelectItem value="no-category">No category</SelectItem>
                {isLoadingCategories ? (
                  <div className="flex items-center justify-center py-2">
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    <span>Loading categories...</span>
                  </div>
                ) : categories.length === 0 ? (
                  <div className="p-2 text-sm text-muted-foreground">No categories found</div>
                ) : (
                  categories.map(category => (
                    <SelectItem key={category} value={category}>{category}</SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="choice_id"
        render={({ field }) => (
          <FormItem className="hidden">
            <FormControl>
              <Input 
                {...field} 
                value={choiceId || field.value} 
                type="hidden" 
              />
            </FormControl>
          </FormItem>
        )}
      />
    </>
  );
};
