
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { MenuChoiceFormData } from '@/api/menuItemsApi';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

interface MenuChoiceInlineFormProps {
  onSubmit: (data: MenuChoiceFormData) => void;
  onCancel: () => void;
  isSubmitting: boolean;
  sectionId: string;
}

const formSchema = z.object({
  label: z.string().min(1, "Label is required"),
  value: z.string().min(1, "Value is required"),
  display_order: z.number().default(0),
  section_id: z.string().min(1),
});

type FormValues = z.infer<typeof formSchema>;

const MenuChoiceInlineForm: React.FC<MenuChoiceInlineFormProps> = ({
  onSubmit,
  onCancel,
  isSubmitting,
  sectionId,
}) => {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      label: '',
      value: '',
      display_order: 0,
      section_id: sectionId,
    },
  });

  // Watch the label field to automatically generate the value
  const labelValue = form.watch('label');
  
  // Update the value field when label changes - generate with cho- prefix
  useEffect(() => {
    if (labelValue) {
      // Create a value with the required prefix
      let generatedValue = labelValue.split(/\s+/)[0]; // Get first word
      generatedValue = generatedValue.substring(0, 8); // Limit to 8 chars
      generatedValue = generatedValue
        .toLowerCase()
        .replace(/[^a-z0-9]/g, ''); // Remove special characters
      
      // Add the cho- prefix
      generatedValue = `cho-${generatedValue}`;
      
      form.setValue('value', generatedValue);
    }
  }, [labelValue, form]);

  const handleSubmit = (values: FormValues) => {
    const formData: MenuChoiceFormData = {
      label: values.label,
      value: values.value,
      display_order: values.display_order,
      section_id: sectionId,
    };
    
    onSubmit(formData);
    form.reset();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-3 mb-6 p-3 border border-gray-100 bg-gray-50 rounded-md">
        <div className="flex justify-between items-center mb-2">
          <h5 className="text-sm font-medium">Add New Choice</h5>
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
                  <Input placeholder="Display label" {...field} />
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
                  <Input placeholder="Auto-generated with cho-" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <FormField
          control={form.control}
          name="display_order"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input 
                  type="number" 
                  placeholder="Display order" 
                  {...field} 
                  onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="flex justify-end">
          <Button type="submit" size="sm" disabled={isSubmitting}>
            {isSubmitting ? 'Adding...' : 'Add Choice'}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default MenuChoiceInlineForm;
