import React, { useState } from 'react';
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";

const WeddingMenuPlanner = () => {
  const [selectedStarterOption, setSelectedStarterOption] = useState('');
  const [selectedCanapes, setSelectedCanapes] = useState<string[]>([]);
  const [selectedPlatedStarter, setSelectedPlatedStarter] = useState('');

  const starterPackages = [
    { name: 'HARVEST TABLE', price: '120.00', description: 'HARVEST TABLE (PER PERSON)' },
    { name: '3 CANAPÉS', price: '110.00', description: 'CHOICE OF 3 CANAPÉS' },
    { name: '4 CANAPÉS', price: '140.00', description: 'CHOICE OF 4 CANAPÉS' },
    { name: '5 CANAPÉS', price: '175.00', description: 'CHOICE OF 5 CANAPÉS' },
    { name: '6 CANAPÉS', price: '205.00', description: 'CHOICE OF 6 CANAPÉS' },
    { name: 'PLATED STARTER', price: '105.00', description: 'PLATED STARTER' },
  ];

  const canapeOptions = [
    { id: 'slider', label: 'Beef & brie sliders with caramelised onion & tomato chutney' },
    { id: 'melon', label: 'Melon & parma ham skewers (S)' },
    { id: 'ricotta', label: 'Ricotta and Roasted Grape Crostini (V)' },
    { id: 'chicken', label: 'Sticky ginger & soy chicken satay' },
    { id: 'bruschetta', label: 'Bruschetta with roasted peppers, tomato & basil (V)' },
    { id: 'bobotie', label: 'Bobotie Springroll served with Homemade Chutney' },
    { id: 'kofta', label: 'Koftas with cucumber and mint yoghurt' },
    { id: 'caprese', label: 'Tomato, mozzarella & basil skewers (V)' },
    { id: 'prawn', label: 'Crumbed prawn with sweet Asian dipping sauce' },
    { id: 'pork', label: 'Pulled pork mini pitas with sour cream & pickled onion' },
  ];

  const platedStarterOptions = [
    { id: 'soup', label: 'Exotic wild mushroom soup, fresh tomato soup, or butternut soup served with sourdough bread (V)' },
    { id: 'crostini', label: 'Fresh tomato, basil & mozzarella crostinis with olive oil and balsamic vinaigrette (V)' },
    { id: 'seafood', label: 'Classic seafood cocktail served on fresh cos lettuce' },
    { id: 'risotto', label: 'Wild mushroom and black truffle risotto (V)' },
    { id: 'pastry', label: 'Fresh asparagus, hickory ham & brie pastry parcel (S)' },
    { id: 'phyllo', label: 'Phyllo basket with spinach and feta' },
    { id: 'halloumi', label: 'Grilled halloumi fingers with lime yogurt & pomegranate (V)' },
    { id: 'salad', label: 'Spiced butternut & beetroot salad with feta, seeds and citrus dressing (V)' },
  ];

  return (
    <Card className="mt-8 print:mt-12">
      <CardHeader className="bg-zinc-50 border-b">
        <CardTitle className="text-2xl font-bold text-center">Starter & Canapé Selection</CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        {/* Package Selection */}
        <div className="mb-8">
          <Label className="text-lg font-semibold mb-4 block">Select Your Starter Package</Label>
          <RadioGroup 
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
            value={selectedStarterOption}
            onValueChange={setSelectedStarterOption}
          >
            {starterPackages.map((pkg) => (
              <div key={pkg.name} className="flex items-center space-x-2 border p-4 rounded-lg hover:bg-zinc-50 print:break-inside-avoid">
                <RadioGroupItem value={pkg.name} id={pkg.name} />
                <Label htmlFor={pkg.name} className="flex-1">
                  <div className="font-medium">{pkg.description}</div>
                  <div className="text-sm text-zinc-500">R {pkg.price} per person</div>
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>

        <Separator className="my-8 print:hidden" />

        {/* Canapé Selection */}
        {selectedStarterOption.includes('CANAPÉS') && (
          <div className="mb-8">
            <Label className="text-lg font-semibold mb-4 block">
              Select Your Canapés (Choose {selectedStarterOption[0]} items)
            </Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {canapeOptions.map((canape) => (
                <div key={canape.id} className="flex items-start space-x-2 border p-4 rounded-lg print:break-inside-avoid">
                  <Checkbox 
                    id={canape.id}
                    checked={selectedCanapes.includes(canape.id)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setSelectedCanapes([...selectedCanapes, canape.id]);
                      } else {
                        setSelectedCanapes(selectedCanapes.filter(id => id !== canape.id));
                      }
                    }}
                  />
                  <Label htmlFor={canape.id} className="text-sm leading-tight">{canape.label}</Label>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Plated Starter Selection */}
        {selectedStarterOption === 'PLATED STARTER' && (
          <div className="mb-8">
            <Label className="text-lg font-semibold mb-4 block">Select Your Plated Starter</Label>
            <RadioGroup 
              className="grid grid-cols-1 gap-4"
              value={selectedPlatedStarter}
              onValueChange={setSelectedPlatedStarter}
            >
              {platedStarterOptions.map((starter) => (
                <div key={starter.id} className="flex items-start space-x-2 border p-4 rounded-lg print:break-inside-avoid">
                  <RadioGroupItem value={starter.id} id={starter.id} />
                  <Label htmlFor={starter.id} className="text-sm leading-tight">{starter.label}</Label>
                </div>
              ))}
            </RadioGroup>
          </div>
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