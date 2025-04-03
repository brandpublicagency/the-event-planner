
import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { MenuItemFormData } from '@/api/menuItemsApi';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { PlusIcon, X } from 'lucide-react';
import { Switch } from '@/components/ui/switch';

interface MenuItemInlineFormProps {
  onSubmit: (data: MenuItemFormData) => void;
  onCancel: () => void;
  isSubmitting: boolean;
  choiceId: string;
}

const formSchema = z.object({
  label: z.string().min(1, "Name is required"),
  value: z.string().min(1, "Value is required"),
  available: z.boolean().default(true),
  choice_id: z.string().min(1, "Choice is required"),
});

type FormValues = z.infer<typeof formSchema>;

const MenuItemInlineForm: React.FC<MenuItemInlineFormProps> = ({
  onSubmit,
  onCancel,
  isSubmitting,
  choiceId,
}) => {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      label: '',
      value: '',
      available: true,
      choice_id: choiceId,
    },
  });

  const handleSubmit = (values: FormValues) => {
    // Create the menu item data
    const menuItemData: MenuItemFormData = {
      label: values.label,
      value: values.value,
      available: values.available,
      choice_id: choiceId,
      description: null,
      image_url: null,
    };
    
    onSubmit(menuItemData);
    form.reset();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-3 mt-3 p-3 border border-gray-100 bg-gray-50 rounded-md">
        <div className="flex justify-between items-center mb-2">
          <h5 className="text-sm font-medium">Add New Item</h5>
          <Button 
            type="button" 
            variant="ghost" 
            size="icon" 
            onClick={onCancel}
            className="h-6 w-6"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="grid grid-cols-2 gap-3">
          <FormField
            control={form.control}
            name="label"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input placeholder="Display name" {...field} />
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
                <FormControl>
                  <Input placeholder="Value identifier" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <div className="flex items-center justify-between">
          <FormField
            control={form.control}
            name="available"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center space-x-2">
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <span className="text-xs">Available</span>
              </FormItem>
            )}
          />
          
          <Button type="submit" size="sm" disabled={isSubmitting}>
            {isSubmitting ? 'Adding...' : 'Add Item'}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default MenuItemInlineForm;
