import React from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Check, ChevronDown } from "lucide-react";

interface MenuDropdownProps {
  value: string;
  onValueChange: (value: string) => void;
  options: { value: string; label: string; price?: number; priceType?: string }[];
  placeholder: string;
}

const MenuDropdown = ({
  value,
  onValueChange,
  options,
  placeholder,
}: MenuDropdownProps) => {
  const selectedOption = options.find(opt => opt.value === value);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          className="w-full justify-between font-normal rounded-[7px] bg-white hover:bg-white"
        >
          {selectedOption ? (
            <span className="flex-1 text-left">
              {selectedOption.label}
              {selectedOption.price && (
                <span className="text-muted-foreground">
                  {` - R ${selectedOption.price.toFixed(2)} ${selectedOption.priceType === 'per_person' ? 'per person' : 'per item'}`}
                </span>
              )}
            </span>
          ) : (
            <span className="text-muted-foreground">{placeholder}</span>
          )}
          <ChevronDown className="h-4 w-4 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="start"
        side="bottom"
        className="dropdown-content w-[--radix-dropdown-trigger-width]"
      >
        {options.map((option) => (
          <DropdownMenuItem
            key={option.value}
            onSelect={() => onValueChange(option.value)}
            className="flex items-center justify-between hover:bg-transparent focus:bg-transparent"
          >
            <span>
              {option.label}
              {option.price && (
                <span className="text-muted-foreground ml-1">
                  {`- R ${option.price.toFixed(2)} ${option.priceType === 'per_person' ? 'per person' : 'per item'}`}
                </span>
              )}
            </span>
            {value === option.value && (
              <Check className="h-4 w-4 ml-2" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default MenuDropdown;