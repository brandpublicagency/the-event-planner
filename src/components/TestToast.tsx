
import React from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

export function TestToast() {
  const { toast } = useToast();
  
  const showTestToast = () => {
    console.log("Triggering test toast");
    toast({
      title: "Test Toast",
      description: "This is a test toast notification",
      variant: "default",
      position: "sidebar"
    });
  };
  
  return (
    <div className="p-4 flex justify-center">
      <Button onClick={showTestToast}>Show Test Toast</Button>
    </div>
  );
}
