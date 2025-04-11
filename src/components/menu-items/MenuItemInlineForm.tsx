
import React, { useState, useEffect } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const formSchema = z.object({
  label: z.string().min(1, "Label is required"),
  value: z.string().min(1, "Value is required"),
  category: z.string().nullable()
});

type FormValues = z.infer<typeof formSchema>;

export interface MenuItemInlineFormProps {
  onSubmit: (data: any) => void;
  onCancel: () => void;
  isSubmitting: boolean;
  choiceId: string;
  availableCategories: string[];
  preSelectedCategory?: string | null;
}

const MenuItemInlineForm: React.FC<MenuItemInlineFormProps> = ({
  onSubmit,
  onCancel,
  isSubmitting,
  choiceId,
  availableCategories = [],
  preSelectedCategory = null
}) => {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      label: '',
      value: '',
      category: preSelectedCategory
    }
  });

  // Update form value when preSelectedCategory changes
  useEffect(() => {
    if (preSelectedCategory !== undefined) {
      form.setValue('category', preSelectedCategory);
    }
  }, [preSelectedCategory, form]);

  // Watch the label field to automatically generate the value
  const labelValue = form.watch('label');
  
  // Update the value field when label changes - generate a shorter value
  useEffect(() => {
    if (labelValue) {
      // Create a value with the required prefix
      let generatedValue = labelValue.split(/\s+/)[0]; // Get first word
      generatedValue = generatedValue.substring(0, 8); // Limit to 8 chars to keep the total length reasonable
      generatedValue = generatedValue
        .toLowerCase()
        .replace(/[^a-z0-9]/g, ''); // Remove special characters
      
      // Add the itm- prefix
      generatedValue = `itm-${generatedValue}`;
      
      form.setValue('value', generatedValue);
    }
  }, [labelValue, form]);

  const handleSubmit = (values: FormValues) => {
    onSubmit({
      ...values,
      choice_id: choiceId
    });
    form.reset();
  };

  return (
    <div className="border rounded-md p-4 mb-4 bg-white my-[16px]">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-3">
          <div className="flex space-x-3">
            <FormField 
              control={form.control} 
              name="label" 
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel className="text-xs">Display Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Menu Item Name" {...field} className="h-8 text-xs" />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )} 
            />
            
            <FormField 
              control={form.control} 
              name="value" 
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel className="text-xs">Value</FormLabel>
                  <FormControl>
                    <Input placeholder="Auto-generated" {...field} className="h-8 text-xs" />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )} 
            />
          </div>
          
          {availableCategories.length > 0 && (
            <FormField 
              control={form.control} 
              name="category" 
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs">Category</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value || undefined} 
                    value={field.value || undefined}
                  >
                    <FormControl>
                      <SelectTrigger className="h-8 text-xs">
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="">None</SelectItem>
                      {availableCategories.map(category => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage className="text-xs" />
                </FormItem>
              )} 
            />
          )}
          
          <div className="flex justify-end space-x-2 pt-2">
            <Button type="button" onClick={onCancel} variant="outline" size="sm" className="h-7 text-xs">
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting} size="sm" className="h-7 text-xs">
              {isSubmitting ? 'Adding...' : 'Add Item'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default MenuItemInlineForm;
