import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import MenuHeader from './menu/MenuHeader';
import MenuContent from './menu/MenuContent';
import NotesSection from './menu/NotesSection';
import { useMenuState } from '../hooks/useMenuState';

interface WeddingMenuPlannerProps {
  eventCode: string;
  eventName?: string;
}

const WeddingMenuPlanner = ({ eventCode, eventName }: WeddingMenuPlannerProps) => {
  const { toast } = useToast();
  const { 
    menuState, 
    error,
    isLoading,
    handleCustomMenuToggle,
    handleCanapeSelection,
    handleMenuStateChange,
    saveMenuSelections
  } = useMenuState(eventCode, toast);

  if (isLoading) {
    return (
      <Card className="mt-8 print:mt-0">
        <CardContent className="p-6">
          <div className="text-center animate-pulse">Loading menu...</div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="mt-8 print:mt-0">
        <MenuHeader 
          isCustomMenu={menuState.isCustomMenu} 
          onCustomMenuToggle={handleCustomMenuToggle}
          eventName={eventName}
        />
        <CardContent className="p-6">
          <div className="text-red-600 text-center animate-in fade-in slide-in-from-top-4">
            {error}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mt-8 print:mt-0 print:shadow-none print:border-none">
      <div className="print:hidden">
        <MenuHeader 
          isCustomMenu={menuState.isCustomMenu} 
          onCustomMenuToggle={handleCustomMenuToggle}
          eventName={eventName}
        />
      </div>
      <CardContent className="p-6 space-y-4">
        <div className="print:mb-8">
          <h1 className="hidden print:block text-2xl font-semibold text-center mb-2">Menu Selection</h1>
          {eventName && <h2 className="hidden print:block text-xl text-center text-muted-foreground mb-6">{eventName}</h2>}
        </div>
        <MenuContent 
          menuState={menuState}
          onMenuStateChange={handleMenuStateChange}
          onCanapeSelection={handleCanapeSelection}
          saveMenuSelections={saveMenuSelections}
        />
        <Separator className="my-4" />
        <NotesSection 
          notes={menuState.notes}
          onChange={(value) => {
            handleMenuStateChange('notes', value);
            saveMenuSelections();
          }}
        />
      </CardContent>
    </Card>
  );
};

export default WeddingMenuPlanner;