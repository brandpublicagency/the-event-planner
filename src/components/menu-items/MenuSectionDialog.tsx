
import React from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { MenuSection, MenuSectionFormData } from '@/api/menuItemsApi';
import { Loader2 } from 'lucide-react';
import { toSlug } from '@/utils/menuStructureUtils';

// Form validation schema
const formSchema = z.object({
  label: z.string().min(2, { message: 'Section name must be at least 2 characters' }),
  value: z.string().min(2, { message: 'Value must be at least 2 characters' }),
  display_order: z.number().int().min(0),
});

interface MenuSectionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: MenuSectionFormData) => void;
  isSubmitting: boolean;
  initialData?: MenuSection;
  title: string;
}

const MenuSectionDialog: React.FC<MenuSectionDialogProps> = ({
  open,
  onOpenChange,
  onSubmit,
  isSubmitting,
  initialData,
  title,
}) => {
  // Initialize form with default values or existing section data
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      label: initialData?.label || '',
      value: initialData?.value || '',
      display_order: initialData?.display_order || 0,
    },
  });

  // Handle form submission
  const handleSubmit = (data: z.infer<typeof formSchema>) => {
    onSubmit(data);
  };

  // Auto-generate value from label if empty
  const autoGenerateValue = (label: string) => {
    if (!form.getValues('value')) {
      form.setValue('value', toSlug(label));
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            {initialData 
              ? 'Update the details for this menu section' 
              : 'Create a new section for your menu structure'}
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="label"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Section Name</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="e.g., Main Courses"
                      onChange={(e) => {
                        field.onChange(e);
                        autoGenerateValue(e.target.value);
                      }}
                    />
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
                  <FormLabel>Section Value</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="e.g., main-courses"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="display_order"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Display Order</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="number"
                      min={0}
                      placeholder="0"
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <DialogFooter className="pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {initialData ? 'Updating...' : 'Creating...'}
                  </>
                ) : (
                  <>{initialData ? 'Update' : 'Create'}</>
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default MenuSectionDialog;
