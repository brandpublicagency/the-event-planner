
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

const formSchema = z.object({
  value: z.string().min(1, 'Value is required'),
  label: z.string().min(1, 'Label is required'),
  category: z.string().min(1, 'Category is required'),
  section: z.string().min(1, 'Section is required'),
  description: z.string().nullable(),
  image_url: z.string().nullable(),
});

type MenuItemFormProps = {
  initialData?: Partial<MenuItemFormData>;
  onSubmit: (data: MenuItemFormData) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
};

const CATEGORIES = [
  { value: 'canapes', label: 'Canapés', section: 'starters' },
  { value: 'plated', label: 'Plated', section: 'starters' },
  { value: 'buffet_meat', label: 'Buffet Meat', section: 'main_courses' },
  { value: 'buffet_vegetable', label: 'Buffet Vegetable', section: 'main_courses' },
  { value: 'buffet_starch', label: 'Buffet Starch', section: 'main_courses' },
  { value: 'karoo_meat', label: 'Karoo Meat', section: 'main_courses' },
  { value: 'karoo_vegetable', label: 'Karoo Vegetable', section: 'main_courses' },
  { value: 'karoo_starch', label: 'Karoo Starch', section: 'main_courses' },
  { value: 'plated_main', label: 'Plated Main', section: 'main_courses' },
  { value: 'dessert_canapes', label: 'Dessert Canapés', section: 'desserts' },
  { value: 'individual_cakes', label: 'Individual Cakes', section: 'desserts' },
  { value: 'traditional', label: 'Traditional', section: 'desserts' },
];

const MenuItemForm: React.FC<MenuItemFormProps> = ({ 
  initialData = {}, 
  onSubmit, 
  onCancel,
  isSubmitting = false
}) => {
  const { sections, isLoading: sectionsLoading } = useMenuSections();
  const [filteredCategories, setFilteredCategories] = useState<typeof CATEGORIES>([]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      value: initialData.value || '',
      label: initialData.label || '',
      category: initialData.category || '',
      section: initialData.section || '',
      description: initialData.description || '',
      image_url: initialData.image_url || null,
    },
  });

  const selectedSection = form.watch('section');

  // Filter categories when section changes
  useEffect(() => {
    if (selectedSection) {
      setFilteredCategories(
        CATEGORIES.filter(category => category.section === selectedSection)
      );
    } else {
      setFilteredCategories([]);
    }
  }, [selectedSection]);

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    onSubmit(values as MenuItemFormData);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="section"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Section</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  disabled={sectionsLoading}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select section" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {sections.map((section) => (
                      <SelectItem key={section.value} value={section.value}>
                        {section.label}
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
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  disabled={!selectedSection}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {filteredCategories.map((category) => (
                      <SelectItem key={category.value} value={category.value}>
                        {category.label}
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
            {isSubmitting ? 'Saving...' : initialData.id ? 'Update' : 'Create'}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default MenuItemForm;
