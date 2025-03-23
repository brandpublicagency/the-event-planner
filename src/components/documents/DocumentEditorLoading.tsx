
import { Spinner } from "@/components/ui/spinner";

interface DocumentEditorLoadingProps {
  message?: string;
}

export function DocumentEditorLoading({ message = "Loading document..." }: DocumentEditorLoadingProps) {
  return (
    <div className="h-full flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <Spinner className="h-8 w-8 text-primary" />
        <p className="text-muted-foreground">{message}</p>
      </div>
    </div>
  );
}
