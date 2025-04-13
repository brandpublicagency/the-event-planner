
import React, { useEffect, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
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

const formSchema = z.object({
  value: z.string().min(1, 'Value is required'),
  label: z.string().min(1, 'Label is required'),
  choice_id: z.string().min(1, 'Choice is required'),
  category: z.string().nullable(),
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
      category: initialData.category || null,
      image_url: initialData.image_url || null,
    },
  });

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    // Get the selected choice to determine if category should be applied
    const selectedChoice = choices.find(choice => choice.id === values.choice_id);
    
    // Only apply category for sec-mains
    const isMainCourse = selectedChoice?.value === 'sec-mains';

    const formData: MenuItemFormData = {
      value: values.value,
      label: values.label,
      choice_id: values.choice_id,
      category: isMainCourse ? values.category : null,
      image_url: values.image_url,
    };
    onSubmit(formData);
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

  // Determine if we should show the category field
  const selectedChoiceValue = choices.find(c => c.id === form.watch('choice_id'))?.value;
  const showCategoryField = selectedChoiceValue === 'sec-mains';

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
        
        {showCategoryField && (
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category (Optional)</FormLabel>
                <FormControl>
                  <Input 
                    {...field} 
                    placeholder="e.g., MEAT SELECTION, VEGETABLES, etc."
                    value={field.value || ''}
                    onChange={e => field.onChange(e.target.value || null)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

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
