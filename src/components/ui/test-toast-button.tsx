
import React from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

export function TestToastButton() {
  const { toast } = useToast();
  
  const variants = [
    { title: 'Default Toast', description: 'This is a default toast notification', variant: 'default' },
    { title: 'Success Toast', description: 'This is a success toast notification', variant: 'success' },
    { title: 'Destructive Toast', description: 'This is a destructive toast notification', variant: 'destructive' },
    { title: 'Info Toast', description: 'This is an info toast notification', variant: 'info' },
  ];
  
  const showToast = (index: number) => {
    const variant = variants[index];
    toast({
      title: variant.title,
      description: variant.description,
      variant: variant.variant as any,
      showProgress: true,
      duration: 5000,
      position: "sidebar" // Set position to sidebar
    });
  };
  
  return (
    <div className="flex flex-col gap-2 p-4 border border-gray-200 rounded-md">
      <h3 className="text-lg font-semibold mb-2">Test Toast Notifications</h3>
      <div className="flex flex-wrap gap-2">
        {variants.map((variant, index) => (
          <Button 
            key={index}
            onClick={() => showToast(index)}
            variant={variant.variant === 'default' ? 'default' : 
                    variant.variant === 'destructive' ? 'destructive' : 'outline'}
            size="sm"
          >
            Show {variant.variant} Toast
          </Button>
        ))}
        <Button 
          onClick={() => {
            for (let i = 0; i < variants.length; i++) {
              setTimeout(() => showToast(i), i * 300);
            }
          }}
          variant="default"
          size="sm"
        >
          Show All Toasts
        </Button>
      </div>
    </div>
  );
}
