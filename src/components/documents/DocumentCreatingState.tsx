
import { Spinner } from "@/components/ui/spinner";

export function DocumentCreatingState() {
  return (
    <div className="h-full flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <Spinner className="h-8 w-8 text-primary" />
        <p>Creating new document...</p>
      </div>
    </div>
  );
}
