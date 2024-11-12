import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

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

  // Fetch existing menu selections
  useEffect(() => {
    const fetchMenuSelections = async () => {
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

  // Save menu selections
  const saveMenuSelections = async () => {
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

    const { error } = await supabase
      .from('menu_selections')
      .upsert(menuData, { onConflict: 'event_code' });

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

  const starterTypes = [
    { value: 'harvest', label: 'Harvest Table', price: '120.00' },
    { value: 'canapes', label: 'Canapés', price: 'from 110.00' },
    { value: 'plated', label: 'Plated Starter', price: '105.00' },
  ];

  const canapePackages = [
    { value: '3', label: 'Choice of 3 Canapés', price: '110.00' },
    { value: '4', label: 'Choice of 4 Canapés', price: '140.00' },
    { value: '5', label: 'Choice of 5 Canapés', price: '175.00' },
    { value: '6', label: 'Choice of 6 Canapés', price: '205.00' },
  ];

  const canapeOptions = [
    { value: 'slider', label: 'Beef & brie sliders with caramelised onion & tomato chutney' },
    { value: 'melon', label: 'Melon & parma ham skewers (S)' },
    { value: 'ricotta', label: 'Ricotta and Roasted Grape Crostini (V)' },
    { value: 'chicken', label: 'Sticky ginger & soy chicken satay' },
    { value: 'bruschetta', label: 'Bruschetta with roasted peppers, tomato & basil (V)' },
    { value: 'bobotie', label: 'Bobotie Springroll served with Homemade Chutney' },
    { value: 'kofta', label: 'Koftas with cucumber and mint yoghurt' },
    { value: 'caprese', label: 'Tomato, mozzarella & basil skewers (V)' },
    { value: 'prawn', label: 'Crumbed prawn with sweet Asian dipping sauce' },
    { value: 'pork', label: 'Pulled pork mini pitas with sour cream & pickled onion' },
  ];

  const platedStarterOptions = [
    { value: 'soup', label: 'Exotic wild mushroom soup, fresh tomato soup, or butternut soup served with sourdough bread (V)' },
    { value: 'crostini', label: 'Fresh tomato, basil & mozzarella crostinis with olive oil and balsamic vinaigrette (V)' },
    { value: 'seafood', label: 'Classic seafood cocktail served on fresh cos lettuce' },
    { value: 'risotto', label: 'Wild mushroom and black truffle risotto (V)' },
    { value: 'pastry', label: 'Fresh asparagus, hickory ham & brie pastry parcel (S)' },
    { value: 'phyllo', label: 'Phyllo basket with spinach and feta' },
    { value: 'halloumi', label: 'Grilled halloumi fingers with lime yogurt & pomegranate (V)' },
    { value: 'salad', label: 'Spiced butternut & beetroot salad with feta, seeds and citrus dressing (V)' },
  ];

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
        <div className="flex items-center space-x-2">
          <Switch
            checked={isCustomMenu}
            onCheckedChange={(checked) => {
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
          />
          <span>Custom Menu</span>
        </div>

        {isCustomMenu ? (
          <div className="print:break-inside-avoid">
            <Textarea
              className="w-full"
              placeholder="Enter custom menu details..."
              value={customMenuDetails}
              onChange={(e) => {
                setCustomMenuDetails(e.target.value);
                saveMenuSelections();
              }}
              rows={10}
            />
          </div>
        ) : (
          <>
            {/* Starter Type Selection */}
            <div className="print:break-inside-avoid">
              <Select value={selectedStarterType} onValueChange={(value) => {
                setSelectedStarterType(value);
                setSelectedCanapePackage('');
                setSelectedCanapes([]);
                setSelectedPlatedStarter('');
                saveMenuSelections();
              }}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select your starter type" />
                </SelectTrigger>
                <SelectContent>
                  {starterTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      <div className="flex justify-between items-center w-full">
                        <span>{type.label}</span>
                        <span className="text-sm text-zinc-500">R {type.price}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {selectedStarterType === 'canapes' && (
              <>
                <Separator className="my-6 print:hidden" />
            <div className="print:break-inside-avoid">
              <Select value={selectedCanapePackage} onValueChange={(value) => {
                setSelectedCanapePackage(value);
                setSelectedCanapes([]);
              }}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select number of canapés" />
                </SelectTrigger>
                <SelectContent>
                  {canapePackages.map((pkg) => (
                    <SelectItem key={pkg.value} value={pkg.value}>
                      <div className="flex justify-between items-center w-full">
                        <span>{pkg.label}</span>
                        <span className="text-sm text-zinc-500">R {pkg.price}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {selectedCanapePackage && (
              <div className="space-y-4 print:break-inside-avoid">
                {Array.from({ length: parseInt(selectedCanapePackage) }).map((_, index) => (
                  <div key={index} className="print:break-inside-avoid">
                    <Select 
                      value={selectedCanapes[index] || ''} 
                      onValueChange={(value) => handleCanapeSelection(index + 1, value)}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder={`Select canapé ${index + 1}`} />
                      </SelectTrigger>
                      <SelectContent>
                        {canapeOptions.map((canape) => (
                          <SelectItem 
                            key={canape.value} 
                            value={canape.value}
                            disabled={selectedCanapes.includes(canape.value)}
                          >
                            {canape.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                ))}
              </div>
            )}
              </>
            )}

            {selectedStarterType === 'plated' && (
              <>
                <Separator className="my-6 print:hidden" />
            <div className="print:break-inside-avoid">
              <Select value={selectedPlatedStarter} onValueChange={setSelectedPlatedStarter}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select your plated starter" />
                </SelectTrigger>
                <SelectContent>
                  {platedStarterOptions.map((starter) => (
                    <SelectItem key={starter.value} value={starter.value}>
                      {starter.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
              </>
            )}
          </>
        )}

        {/* Notes Section */}
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
