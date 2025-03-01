
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

export function useFileView() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const viewFile = async (filePath: string, contentType: string) => {
    try {
      setIsLoading(true);
      console.log('[View] Getting file URL for:', filePath, 'Content-Type:', contentType);
      
      // First check if user is authenticated
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('Authentication required');
      }
      
      // For publicly viewable files like images, PDFs, etc.
      // Get a public URL directly instead of downloading first
      if (/^image\/|application\/pdf|text\//.test(contentType)) {
        // Create a signed URL with a longer expiry
        const { data: signedURL, error: signedError } = await supabase.storage
          .from("task-files")
          .createSignedUrl(filePath, 60 * 60); // 1 hour expiry
          
        if (signedError) {
          console.error('[View] Signed URL error:', signedError);
          // Fall back to download method
        } else if (signedURL) {
          // Open the signed URL in a new tab
          window.open(signedURL.signedUrl, '_blank', 'noopener,noreferrer');
          console.log('[View] File opened via signed URL');
          return;
        }
      }
      
      // Fall back to download method for other file types or if signed URL fails
      console.log('[View] Using download method for viewing');
      const { data, error } = await supabase.storage
        .from("task-files")
        .download(filePath);
        
      if (error) {
        throw error;
      }
      
      if (!data) {
        throw new Error('Could not retrieve file');
      }
      
      // Create a blob with the correct content type
      const blob = new Blob([data], { type: contentType || 'application/octet-stream' });
      
      // Create a blob URL from the file content with proper content type
      const blobUrl = URL.createObjectURL(blob);
      
      // Create a hidden anchor element for better browser compatibility
      const a = document.createElement('a');
      a.href = blobUrl;
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      
      // Clean up the blob URL after a delay
      setTimeout(() => URL.revokeObjectURL(blobUrl), 10000); // Increased timeout
      
      console.log('[View] File opened successfully');
    } catch (error: any) {
      console.error('[View] Error:', error);
      toast({
        title: "Error viewing file",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    viewFile,
    isLoading
  };
}
