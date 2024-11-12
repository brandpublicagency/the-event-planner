import React, { useState } from 'react';
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";

const WeddingMenuPlanner = () => {
  const [selectedStarterType, setSelectedStarterType] = useState<string>('');
  const [selectedCanapePackage, setSelectedCanapePackage] = useState<string>('');
  const [selectedCanapes, setSelectedCanapes] = useState<string[]>([]);
  const [selectedPlatedStarter, setSelectedPlatedStarter] = useState<string>('');

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
  };

  return (
    <Card className="mt-8 print:mt-12">
      <CardHeader className="bg-zinc-50 border-b">
        <CardTitle className="text-2xl font-bold text-center">Starter & Canapé Selection</CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        {/* Starter Type Selection */}
        <div className="mb-8 print:break-inside-avoid">
          <Label className="text-lg font-semibold mb-4 block">Select Your Starter Type</Label>
          <Select value={selectedStarterType} onValueChange={(value) => {
            setSelectedStarterType(value);
            setSelectedCanapePackage('');
            setSelectedCanapes([]);
            setSelectedPlatedStarter('');
          }}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a starter type" />
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
            <Separator className="my-8 print:hidden" />
            {/* Canapé Package Selection */}
            <div className="mb-8 print:break-inside-avoid">
              <Label className="text-lg font-semibold mb-4 block">Select Your Canapé Package</Label>
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
                    <Label className="font-medium mb-2 block">Canapé {index + 1}</Label>
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
            <Separator className="my-8 print:hidden" />
            <div className="mb-8 print:break-inside-avoid">
              <Label className="text-lg font-semibold mb-4 block">Select Your Plated Starter</Label>
              <Select value={selectedPlatedStarter} onValueChange={setSelectedPlatedStarter}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a plated starter" />
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

        {/* Notes Section */}
        <div className="mt-8 print:break-inside-avoid">
          <Label className="font-semibold">Additional Notes & Special Requirements</Label>
          <Textarea 
            className="w-full mt-2" 
            placeholder="Enter any dietary requirements, allergies, or special instructions..."
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default WeddingMenuPlanner;