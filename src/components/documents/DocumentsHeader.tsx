
// This is a temporary modification to test toast notifications
// It appends the TestToastButton to the DocumentsHeader component

import { TestToastButton } from '@/components/ui/test-toast-button';

// The original DocumentsHeader component is imported from the read-only files
// We'll add our test button at the end of the return statement

// This is just a wrapper component that adds the test button
export default function DocumentsHeaderWithTestToast(props: any) {
  // Import the original component
  const OriginalDocumentsHeader = require('@/components/documents/DocumentsHeader').default;
  
  // Render both the original component and our test button
  return (
    <div>
      <OriginalDocumentsHeader {...props} />
      <TestToastButton />
    </div>
  );
}
