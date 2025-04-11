
import React from 'react';
import TemplateCard from './TemplateCard';
import { Dialog } from '@/components/ui/dialog';
import { 
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogAction,
  AlertDialogCancel
} from '@/components/ui/alert-dialog';

interface TemplatesGridProps {
  templates: any[];
  sections: any[];
  onImportTemplate: (templateId: string) => void;
}

const TemplatesGrid: React.FC<TemplatesGridProps> = ({ 
  templates,
  sections,
  onImportTemplate
}) => {
  const [selectedTemplate, setSelectedTemplate] = React.useState<string | null>(null);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
      {templates.map((template) => (
        <Dialog key={template.id}>
          <TemplateCard 
            template={template} 
            onSelect={setSelectedTemplate}
          />
          
          <AlertDialog>
            <AlertDialogTrigger className="hidden" />
            <AlertDialogContent className="max-w-md">
              <AlertDialogHeader>
                <AlertDialogTitle className="text-xl">Import Template</AlertDialogTitle>
                <AlertDialogDescription className="text-gray-600">
                  Are you sure you want to import the {template.title} template?
                  {sections.length > 0 && (
                    <p className="mt-2 text-amber-600 bg-amber-50 p-2 rounded-md border border-amber-200">
                      Your existing menu structure will not be deleted, but this will add new sections.
                    </p>
                  )}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter className="mt-4">
                <AlertDialogCancel className="border-gray-300">
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction 
                  onClick={() => onImportTemplate(template.id)}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Import
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </Dialog>
      ))}
    </div>
  );
};

export default TemplatesGrid;
