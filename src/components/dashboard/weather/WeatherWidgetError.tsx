
import React from 'react';
import { RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface WeatherWidgetErrorProps {
  error: Error | null;
  onRetry?: () => void;
}

const WeatherWidgetError: React.FC<WeatherWidgetErrorProps> = ({ error, onRetry }) => {
  console.error("Weather widget error:", error);
  
  const errorMessage = error?.message || "Unable to load weather information.";
  
  return (
    <div className="w-full py-[5px]">
      <div className="w-full rounded-xl bg-red-50 border border-red-200 p-4 text-red-800">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
          <span>
            Unable to load weather information. Please try again later.
          </span>
          {onRetry && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onRetry}
              className="mt-2 sm:mt-0 bg-white hover:bg-red-100"
            >
              <RefreshCw className="mr-2 h-3 w-3" />
              Retry
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default WeatherWidgetError;
