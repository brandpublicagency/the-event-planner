import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import CustomMenuSection from './menu/CustomMenuSection';
import StarterTypeSelect from './menu/StarterTypeSelect';
import CanapeSection from './menu/CanapeSection';
import PlatedStarterSection from './menu/PlatedStarterSection';
import MenuHeader from './menu/MenuHeader';
import NotesSection from './menu/NotesSection';

interface WeddingMenuPlannerProps {
  eventCode: string;
}

const WeddingMenuPlanner = ({ eventCode }: WeddingMenuPlannerProps) => {
  const [selectedStarterType, setSelectedStarterType] = useState<string>('');
  const [selectedCanapePackage, setSelectedCanapePackage] = useState<string>('');
  const [selectedCanapes, setSelectedCanapes] = useState<string[]>([]);
  const [selectedPlatedStarter, setSelectedPlatedStarter] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [isCustomMenu, setIsCustomMenu] = useState<boolean>(false);
  const [customMenuDetails, setCustomMenuDetails] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchMenuSelections = async () => {
      if (!eventCode) return;
      
      try {
        const { data, error } = await supabase
          .from('menu_selections')
          .select('*')
          .eq('event_code', eventCode)
          .single();

        if (error) {
          console.error('Error fetching menu selections:', error);
          toast({
            title: "Error loading menu selections",
            description: "Please try refreshing the page",
            variant: "destructive",
          });
          setError(error.message);
          return;
        }

        if (data) {
          setIsCustomMenu(data.is_custom || false);
          setCustomMenuDetails(data.custom_menu_details || '');
          if (!data.is_custom) {
            setSelectedStarterType(data.starter_type || '');
            setSelectedCanapePackage(data.canape_package || '');
            setSelectedCanapes(data.canape_selections || []);
            setSelectedPlatedStarter(data.plated_starter || '');
          }
          setNotes(data.notes || '');
          setError(null);
        }
      } catch (err) {
        console.error('Unexpected error:', err);
        toast({
          title: "Error loading menu selections",
          description: "An unexpected error occurred",
          variant: "destructive",
        });
        setError('An unexpected error occurred while loading menu selections');
      }
    };

    fetchMenuSelections();
  }, [eventCode, toast]);

  const saveMenuSelections = async () => {
    if (!eventCode) return;

    const menuData = {
      event_code: eventCode,
      is_custom: isCustomMenu,
      custom_menu_details: isCustomMenu ? customMenuDetails : null,
      starter_type: !isCustomMenu ? selectedStarterType : null,
      canape_package: !isCustomMenu ? selectedCanapePackage : null,
      canape_selections: !isCustomMenu ? selectedCanapes : null,
      plated_starter: !isCustomMenu ? selectedPlatedStarter : null,
      notes,
    };

    try {
      const { error } = await supabase
        .from('menu_selections')
        .upsert(menuData);

      if (error) {
        console.error('Error saving menu selections:', error);
        toast({
          title: "Error saving menu selections",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Success",
        description: "Menu selections saved successfully",
      });
    } catch (err) {
      console.error('Unexpected error saving menu selections:', err);
      toast({
        title: "Error saving menu selections",
        description: "An unexpected error occurred while saving",
        variant: "destructive",
      });
    }
  };

  const handleCanapeSelection = (position: number, value: string) => {
    const newCanapes = [...selectedCanapes];
    newCanapes[position - 1] = value;
    setSelectedCanapes(newCanapes);
    saveMenuSelections();
  };

  if (error) {
    return (
      <Card className="mt-8 print:mt-12 shadow-lg transition-all duration-300">
        <MenuHeader />
        <CardContent className="p-6">
          <div className="text-red-600 text-center animate-in fade-in slide-in-from-top-4">
            {error}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mt-8 print:mt-12 shadow-lg transition-all duration-300">
      <MenuHeader />
      <CardContent className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <CustomMenuSection
            isCustomMenu={isCustomMenu}
            customMenuDetails={customMenuDetails}
            onCustomMenuToggle={(checked) => {
              setIsCustomMenu(checked);
              if (checked) {
                setSelectedStarterType('');
                setSelectedCanapePackage('');
                setSelectedCanapes([]);
                setSelectedPlatedStarter('');
              } else {
                setCustomMenuDetails('');
              }
              saveMenuSelections();
            }}
            onCustomMenuDetailsChange={(value) => {
              setCustomMenuDetails(value);
              saveMenuSelections();
            }}
          />
        </div>

        {!isCustomMenu && (
          <div className="space-y-6 animate-in fade-in slide-in-from-top-4">
            <StarterTypeSelect
              selectedStarterType={selectedStarterType}
              onStarterTypeChange={(value) => {
                setSelectedStarterType(value);
                setSelectedCanapePackage('');
                setSelectedCanapes([]);
                setSelectedPlatedStarter('');
                saveMenuSelections();
              }}
            />

            {selectedStarterType === 'canapes' && (
              <>
                <Separator className="my-6 print:hidden" />
                <div className="animate-in fade-in slide-in-from-top-4">
                  <CanapeSection
                    selectedCanapePackage={selectedCanapePackage}
                    selectedCanapes={selectedCanapes}
                    onCanapePackageChange={(value) => {
                      setSelectedCanapePackage(value);
                      setSelectedCanapes([]);
                      saveMenuSelections();
                    }}
                    onCanapeSelection={handleCanapeSelection}
                  />
                </div>
              </>
            )}

            {selectedStarterType === 'plated' && (
              <>
                <Separator className="my-6 print:hidden" />
                <div className="animate-in fade-in slide-in-from-top-4">
                  <PlatedStarterSection
                    selectedPlatedStarter={selectedPlatedStarter}
                    onPlatedStarterChange={(value) => {
                      setSelectedPlatedStarter(value);
                      saveMenuSelections();
                    }}
                  />
                </div>
              </>
            )}
          </div>
        )}

        <Separator className="my-6" />
        
        <NotesSection 
          notes={notes}
          onChange={(value) => {
            setNotes(value);
            saveMenuSelections();
          }}
        />
      </CardContent>
    </Card>
  );
};

export default WeddingMenuPlanner;