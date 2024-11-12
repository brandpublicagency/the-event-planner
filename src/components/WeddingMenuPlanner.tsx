import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import CustomMenuSection from './menu/CustomMenuSection';
import StarterTypeSelect from './menu/StarterTypeSelect';
import CanapeSection from './menu/CanapeSection';
import PlatedStarterSection from './menu/PlatedStarterSection';
import type { MenuSelections } from '@/integrations/supabase/types/menuSelections';

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
  const { toast } = useToast();

  useEffect(() => {
    const fetchMenuSelections = async () => {
      if (!eventCode) return;
      
      const { data, error } = await supabase
        .from('menu_selections')
        .select('*')
        .eq('event_code', eventCode)
        .single();

      if (error) {
        console.error('Error fetching menu selections:', error);
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
      }
    };

    fetchMenuSelections();
  }, [eventCode]);

  const saveMenuSelections = async () => {
    if (!eventCode) return;

    const menuData: Partial<MenuSelections> = {
      event_code: eventCode,
      is_custom: isCustomMenu,
      custom_menu_details: isCustomMenu ? customMenuDetails : null,
      starter_type: !isCustomMenu ? selectedStarterType : null,
      canape_package: !isCustomMenu ? selectedCanapePackage : null,
      canape_selections: !isCustomMenu ? selectedCanapes : null,
      plated_starter: !isCustomMenu ? selectedPlatedStarter : null,
      notes,
    };

    const { error } = await supabase
      .from('menu_selections')
      .upsert(menuData);

    if (error) {
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
  };

  const handleCanapeSelection = (position: number, value: string) => {
    const newCanapes = [...selectedCanapes];
    newCanapes[position - 1] = value;
    setSelectedCanapes(newCanapes);
    saveMenuSelections();
  };

  return (
    <Card className="mt-8 print:mt-12">
      <CardHeader className="bg-zinc-50 border-b">
        <CardTitle className="text-2xl font-bold text-center">Menu Selection</CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
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

        {!isCustomMenu && (
          <>
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
              </>
            )}

            {selectedStarterType === 'plated' && (
              <>
                <Separator className="my-6 print:hidden" />
                <PlatedStarterSection
                  selectedPlatedStarter={selectedPlatedStarter}
                  onPlatedStarterChange={(value) => {
                    setSelectedPlatedStarter(value);
                    saveMenuSelections();
                  }}
                />
              </>
            )}
          </>
        )}

        <div className="print:break-inside-avoid">
          <Textarea 
            className="w-full mt-2" 
            placeholder="Additional notes, dietary requirements, allergies, or special instructions..."
            value={notes}
            onChange={(e) => {
              setNotes(e.target.value);
              saveMenuSelections();
            }}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default WeddingMenuPlanner;
