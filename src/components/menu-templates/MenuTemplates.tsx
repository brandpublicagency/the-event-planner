
import React, { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { useMenuSections } from '@/hooks/useMenuSections';
import MenuTemplatesList from './MenuTemplatesList';
import MenuTemplateImporter from './MenuTemplateImporter';
import MenuTemplateEditor from './MenuTemplateEditor';
import { Plus } from 'lucide-react';

const MenuTemplates: React.FC = () => {
  const { sections, isLoading } = useMenuSections();
  const [activeTab, setActiveTab] = useState('list');
  const [editingTemplateId, setEditingTemplateId] = useState<string | null>(null);

  const handleEditTemplate = (templateId: string) => {
    setEditingTemplateId(templateId);
    setActiveTab('editor');
  };

  const handleBackToList = () => {
    setEditingTemplateId(null);
    setActiveTab('list');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold tracking-tight">Menu Templates</h2>
        {activeTab === 'list' && (
          <Button onClick={() => setActiveTab('import')} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Import Template
          </Button>
        )}
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="list">All Templates</TabsTrigger>
          <TabsTrigger value="import">Import Template</TabsTrigger>
          {editingTemplateId && (
            <TabsTrigger value="editor">Edit Template</TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="list">
          <MenuTemplatesList 
            isLoading={isLoading} 
            sections={sections} 
            onEditTemplate={handleEditTemplate}
          />
        </TabsContent>

        <TabsContent value="import">
          <MenuTemplateImporter />
        </TabsContent>

        <TabsContent value="editor">
          {editingTemplateId && (
            <MenuTemplateEditor 
              templateId={editingTemplateId} 
              onBack={handleBackToList}
            />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MenuTemplates;
