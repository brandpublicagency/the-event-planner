
import { Button } from "@/components/ui/button";
import { TestToastButton } from '@/components/ui/test-toast-button';

export default function DocumentsHeader() {
  return (
    <div className="flex items-center justify-between border-b px-6 py-3 bg-white dark:bg-gray-950">
      <div className="font-semibold text-lg">Documents</div>
      <div>
        <TestToastButton />
      </div>
    </div>
  );
}
