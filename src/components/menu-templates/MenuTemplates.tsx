
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { useMenuSections } from '@/hooks/useMenuSections';
import { Plus } from 'lucide-react';
import MenuTemplatesList from './MenuTemplatesList';
import MenuTemplateEditor from './MenuTemplateEditor';

const MenuTemplates = () => {
  const [activeTab, setActiveTab] = useState<string>('templates');
  const [editingTemplateId, setEditingTemplateId] = useState<string | null>(null);
  const { sections, isLoading } = useMenuSections();

  const handleEditTemplate = (templateId: string) => {
    setEditingTemplateId(templateId);
    setActiveTab('editor');
  };

  const handleCreateTemplate = () => {
    setEditingTemplateId(null);
    setActiveTab('editor');
  };

  const handleBackToList = () => {
    setEditingTemplateId(null);
    setActiveTab('templates');
  };

  return (
    <div className="flex flex-col h-full">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="flex justify-between items-center mb-6">
          <TabsList>
            <TabsTrigger value="templates">Menu Templates</TabsTrigger>
            <TabsTrigger value="editor" disabled={activeTab !== 'editor'}>
              {editingTemplateId ? 'Edit Template' : 'Create Template'}
            </TabsTrigger>
          </TabsList>
          
          {activeTab === 'templates' && (
            <Button onClick={handleCreateTemplate} className="gap-1">
              <Plus className="h-4 w-4" />
              Create Template
            </Button>
          )}
        </div>
        
        <TabsContent value="templates" className="mt-0">
          <div className="bg-gray-50 border border-gray-100 rounded-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="tracking-tight text-xl font-medium">Menu Templates</h2>
                <p className="text-muted-foreground text-sm">
                  Manage your reusable menu templates for different event types
                </p>
              </div>
            </div>
            
            <MenuTemplatesList 
              isLoading={isLoading} 
              sections={sections} 
              onEditTemplate={handleEditTemplate}
            />
          </div>
        </TabsContent>
        
        <TabsContent value="editor" className="mt-0">
          <div className="bg-gray-50 border border-gray-100 rounded-lg p-6">
            <div className="flex items-center mb-6">
              <Button variant="ghost" onClick={handleBackToList} className="mr-4">
                ← Back to Templates
              </Button>
              
              <div>
                <h2 className="tracking-tight text-xl font-medium">
                  {editingTemplateId ? 'Edit Menu Template' : 'Create Menu Template'}
                </h2>
                <p className="text-muted-foreground text-sm">
                  {editingTemplateId 
                    ? 'Modify your existing menu template' 
                    : 'Design a new reusable menu template'
                  }
                </p>
              </div>
            </div>
            
            <MenuTemplateEditor 
              templateId={editingTemplateId} 
              onSaved={handleBackToList} 
            />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MenuTemplates;
