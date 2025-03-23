
import { Card } from "@/components/ui/card";

interface DocumentsErrorStateProps {
  error: Error;
}

export function DocumentsErrorState({ error }: DocumentsErrorStateProps) {
  return (
    <div className="flex items-center justify-center h-full">
      <Card className="w-full max-w-md p-6">
        <div className="text-center">
          <h2 className="text-lg font-semibold mb-2">Error loading documents</h2>
          <p className="text-muted-foreground">{error.message}</p>
        </div>
      </Card>
    </div>
  );
}
