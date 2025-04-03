
import React, { useEffect, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { MenuItemFormData } from '@/api/menuItemsApi';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useMenuSections } from '@/hooks/useMenuSections';
import { useMenuChoices } from '@/hooks/useMenuChoices';
import { Switch } from '@/components/ui/switch';

const formSchema = z.object({
  value: z.string().min(1, 'Value is required'),
  label: z.string().min(1, 'Label is required'),
  choice_id: z.string().min(1, 'Choice is required'),
  description: z.string().nullable(),
  available: z.boolean().default(true),
  image_url: z.string().nullable(),
});

type MenuItemFormProps = {
  initialData?: Partial<MenuItemFormData>;
  onSubmit: (data: MenuItemFormData) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
};

const MenuItemForm: React.FC<MenuItemFormProps> = ({ 
  initialData = {}, 
  onSubmit, 
  onCancel,
  isSubmitting = false
}) => {
  const { sections, isLoading: sectionsLoading } = useMenuSections();
  const [selectedSection, setSelectedSection] = useState<string | null>(null);
  const { choices, isLoading: choicesLoading } = useMenuChoices(selectedSection || undefined);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      value: initialData.value || '',
      label: initialData.label || '',
      choice_id: initialData.choice_id || '',
      description: initialData.description || null,
      available: initialData.available !== false,
      image_url: initialData.image_url || null,
    },
  });

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    onSubmit(values as MenuItemFormData);
  };

  // Find the section for the selected choice
  useEffect(() => {
    if (initialData.choice_id) {
      // Find the choice for the initial choice_id
      const choice = choices.find(c => c.id === initialData.choice_id);
      if (choice) {
        setSelectedSection(choice.section_id);
      }
    }
  }, [initialData.choice_id, choices]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="choice_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Menu Choice</FormLabel>
                <Select
                  onValueChange={(value) => {
                    field.onChange(value);
                  }}
                  value={field.value}
                  disabled={choicesLoading}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select choice" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {choices.map((choice) => (
                      <SelectItem key={choice.id} value={choice.id}>
                        {choice.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="available"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                <div className="space-y-0.5">
                  <FormLabel>Available</FormLabel>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="label"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Label</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Menu item name" />
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
                <FormLabel>Value (Unique ID)</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="unique_identifier" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea 
                  {...field} 
                  value={field.value || ''}
                  onChange={e => field.onChange(e.target.value || null)}
                  placeholder="Enter description" 
                  className="min-h-[100px]"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-2">
          <Button variant="outline" type="button" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : initialData.value ? 'Update' : 'Create'}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default MenuItemForm;
