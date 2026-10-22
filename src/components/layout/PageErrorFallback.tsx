import { AlertCircle, RefreshCw } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

interface PageErrorFallbackProps {
  error: Error;
  resetErrorBoundary: () => void;
}

export const PageErrorFallback = ({ error, resetErrorBoundary }: PageErrorFallbackProps) => (
  <div className="flex flex-1 items-center justify-center p-6">
    <Alert variant="destructive" className="max-w-md">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Something went wrong on this page</AlertTitle>
      <AlertDescription className="flex flex-col gap-3">
        <p>{error.message || "An unexpected error occurred."}</p>
        <Button size="sm" onClick={resetErrorBoundary} className="self-start">
          <RefreshCw className="mr-1 h-4 w-4" />
          Try again
        </Button>
      </AlertDescription>
    </Alert>
  </div>
);
