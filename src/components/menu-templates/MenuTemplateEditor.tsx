
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { getPredefinedCategories } from '@/utils/menuStructureUtils';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Plus, Save } from 'lucide-react';

interface MenuTemplateEditorProps {
  templateId: string | null;
  onSaved: () => void;
}

interface TemplateFormValues {
  name: string;
  description: string;
  type: string;
}

const TEMPLATE_TYPES = [
  { value: 'buffet-menu', label: 'Buffet Menu' },
  { value: 'warm-karoo-feast', label: 'Warm Karoo Feast' },
  { value: 'plated-menu', label: 'Plated Menu' },
  { value: 'dessert-canapes', label: 'Dessert Canapés' },
  { value: 'individual-cakes', label: 'Individual Cakes' },
  { value: 'baked-desserts', label: 'Baked Desserts' },
  { value: 'plated-starter', label: 'Plated Starter' },
  { value: 'harvest-table', label: 'Harvest Table' },
  { value: 'custom', label: 'Custom Template' }
];

const MenuTemplateEditor: React.FC<MenuTemplateEditorProps> = ({ 
  templateId, 
  onSaved 
}) => {
  const [activeTab, setActiveTab] = useState('details');
  const [selectedType, setSelectedType] = useState<string>('buffet-menu');
  const [predefinedCategories, setPredefinedCategories] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<TemplateFormValues>({
    defaultValues: {
      name: '',
      description: '',
      type: 'buffet-menu'
    }
  });

  // If templateId is provided, fetch the template data
  useEffect(() => {
    if (templateId) {
      // This would be a fetch operation in a real implementation
      // For now we'll just set placeholder data
      form.reset({
        name: 'Sample Template',
        description: 'This is a sample template description',
        type: 'buffet-menu'
      });
      setSelectedType('buffet-menu');
    }
  }, [templateId, form]);

  // Update predefined categories when template type changes
  useEffect(() => {
    const categories = getPredefinedCategories(selectedType);
    setPredefinedCategories(categories);
  }, [selectedType]);

  const handleTypeChange = (value: string) => {
    setSelectedType(value);
    form.setValue('type', value);
  };

  const onSubmit = async (data: TemplateFormValues) => {
    setIsSubmitting(true);
    try {
      // This would be an API call in a real implementation
      console.log('Submitting template:', data);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      onSaved();
    } catch (error) {
      console.error('Error saving template:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="details">Template Details</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="items">Menu Items</TabsTrigger>
        </TabsList>
        
        <TabsContent value="details">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Basic Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Template Name</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Standard Buffet Menu" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Describe what this menu template is for..." 
                            rows={3}
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Template Type</FormLabel>
                        <Select 
                          onValueChange={handleTypeChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a template type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {TEMPLATE_TYPES.map(type => (
                              <SelectItem key={type.value} value={type.value}>
                                {type.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
              
              <div className="flex justify-between mt-6">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={onSaved}
                >
                  Cancel
                </Button>
                
                <div className="flex gap-2">
                  <Button 
                    type="submit" 
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Saving...' : 'Save Template'}
                    <Save className="ml-2 h-4 w-4" />
                  </Button>
                  <Button 
                    type="button" 
                    onClick={() => setActiveTab('categories')}
                    variant="secondary"
                  >
                    Next: Categories
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            </form>
          </Form>
        </TabsContent>
        
        <TabsContent value="categories">
          <Card>
            <CardHeader>
              <CardTitle>Menu Categories</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <p className="text-sm text-muted-foreground mb-2">
                  Based on your template type, these categories are suggested. You can add, edit or remove them.
                </p>
                
                <div className="flex flex-wrap gap-2 mt-4">
                  {predefinedCategories.map(category => (
                    <Badge key={category} variant="secondary" className="text-sm py-1 px-3">
                      {category}
                    </Badge>
                  ))}
                  
                  <Button variant="outline" size="sm" className="h-7">
                    <Plus className="h-3 w-3 mr-1" /> Add Category
                  </Button>
                </div>
              </div>
              
              <Separator className="my-6" />
              
              <div className="flex justify-between mt-6">
                <Button 
                  type="button"
                  variant="outline"
                  onClick={() => setActiveTab('details')}
                >
                  Back to Details
                </Button>
                
                <Button 
                  type="button"
                  onClick={() => setActiveTab('items')}
                >
                  Next: Menu Items
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="items">
          <Card>
            <CardHeader>
              <CardTitle>Menu Items</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-6">
                Add items to each category in your menu template.
              </p>
              
              {predefinedCategories.length > 0 ? (
                <div className="space-y-6">
                  {predefinedCategories.map(category => (
                    <div key={category} className="border rounded-md p-4">
                      <h3 className="font-medium mb-2">{category}</h3>
                      <div className="flex items-center justify-center border border-dashed rounded-md p-4">
                        <Button variant="ghost" className="gap-1">
                          <Plus className="h-4 w-4" />
                          Add Item to {category}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p>Please define categories first</p>
                </div>
              )}
              
              <div className="flex justify-between mt-8">
                <Button 
                  type="button"
                  variant="outline"
                  onClick={() => setActiveTab('categories')}
                >
                  Back to Categories
                </Button>
                
                <Button
                  type="button"
                  onClick={form.handleSubmit(onSubmit)}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Saving...' : 'Save Template'}
                  <Save className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MenuTemplateEditor;
