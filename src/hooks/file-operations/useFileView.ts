
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

      // Create a direct signed URL for the file
      const { data: signedURL, error: signedError } = await supabase.storage
        .from("task-files")
        .createSignedUrl(filePath, 60 * 60); // 1 hour expiry
        
      if (!signedError && signedURL) {
        // For image files, create an image viewer in the same tab
        if (contentType.startsWith('image/')) {
          // Open in a modal or in-app viewer for images
          const img = new Image();
          img.src = signedURL.signedUrl;
          img.style.maxWidth = '90%';
          img.style.maxHeight = '90%';
          img.style.objectFit = 'contain';
          
          // Create a simple modal to display the image
          const modal = document.createElement('div');
          modal.style.position = 'fixed';
          modal.style.top = '0';
          modal.style.left = '0';
          modal.style.width = '100%';
          modal.style.height = '100%';
          modal.style.backgroundColor = 'rgba(0,0,0,0.8)';
          modal.style.display = 'flex';
          modal.style.justifyContent = 'center';
          modal.style.alignItems = 'center';
          modal.style.zIndex = '9999';
          
          // Add close button
          const closeBtn = document.createElement('button');
          closeBtn.textContent = 'Close';
          closeBtn.style.position = 'absolute';
          closeBtn.style.top = '20px';
          closeBtn.style.right = '20px';
          closeBtn.style.padding = '8px 16px';
          closeBtn.style.backgroundColor = '#fff';
          closeBtn.style.border = 'none';
          closeBtn.style.borderRadius = '4px';
          closeBtn.style.cursor = 'pointer';
          closeBtn.onclick = () => document.body.removeChild(modal);
          
          // Add the image to the modal
          const imgContainer = document.createElement('div');
          imgContainer.style.maxWidth = '90%';
          imgContainer.style.maxHeight = '90%';
          imgContainer.style.overflow = 'auto';
          
          // Add the modal to the DOM before adding the image
          document.body.appendChild(modal);
          modal.appendChild(imgContainer);
          modal.appendChild(closeBtn);
          
          // Set up image loading and error handling
          img.onload = () => {
            imgContainer.appendChild(img);
          };
          
          img.onerror = () => {
            console.error('Failed to load image from signed URL:', signedURL.signedUrl);
            document.body.removeChild(modal);
            
            // Attempt fallback method
            attemptFallbackImageLoad(filePath, contentType);
          };
          
          return;
        } else {
          // For other file types, open in a new tab
          window.open(signedURL.signedUrl, '_blank', 'noopener,noreferrer');
          console.log('[View] File opened via signed URL');
          return;
        }
      } else if (signedError) {
        console.error('[View] Signed URL error:', signedError);
      }
      
      // If we get here, either it's not an image or signed URL failed
      // Fall back to download method
      attemptFallbackImageLoad(filePath, contentType);
      
    } catch (error: any) {
      console.error('[View] Error:', error);
      toast({
        title: "Error viewing file",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Helper function for fallback image loading
  const attemptFallbackImageLoad = async (filePath: string, contentType: string) => {
    try {
      console.log('[View] Using fallback download method');
      const { data, error } = await supabase.storage
        .from("task-files")
        .download(filePath);
        
      if (error) {
        throw error;
      }
      
      if (!data) {
        throw new Error('Could not retrieve file');
      }
      
      // For images, manually handle display in a viewer
      if (contentType.startsWith('image/')) {
        const reader = new FileReader();
        
        reader.onload = (e) => {
          const dataUrl = e.target?.result as string;
          
          // Create a modal with the image
          const modal = document.createElement('div');
          modal.style.position = 'fixed';
          modal.style.top = '0';
          modal.style.left = '0';
          modal.style.width = '100%';
          modal.style.height = '100%';
          modal.style.backgroundColor = 'rgba(0,0,0,0.8)';
          modal.style.display = 'flex';
          modal.style.justifyContent = 'center';
          modal.style.alignItems = 'center';
          modal.style.zIndex = '9999';
          
          // Add close button
          const closeBtn = document.createElement('button');
          closeBtn.textContent = 'Close';
          closeBtn.style.position = 'absolute';
          closeBtn.style.top = '20px';
          closeBtn.style.right = '20px';
          closeBtn.style.padding = '8px 16px';
          closeBtn.style.backgroundColor = '#fff';
          closeBtn.style.border = 'none';
          closeBtn.style.borderRadius = '4px';
          closeBtn.style.cursor = 'pointer';
          closeBtn.onclick = () => document.body.removeChild(modal);
          
          // Create image element
          const img = document.createElement('img');
          img.src = dataUrl;
          img.style.maxWidth = '90%';
          img.style.maxHeight = '90%';
          img.style.objectFit = 'contain';
          
          // Add to DOM
          document.body.appendChild(modal);
          modal.appendChild(img);
          modal.appendChild(closeBtn);
        };
        
        reader.onerror = () => {
          console.error('FileReader error when loading image data');
          toast({
            title: "Error",
            description: "Failed to load image. Try again later.",
            variant: "destructive",
          });
        };
        
        reader.readAsDataURL(data);
        return;
      }
      
      // For other file types, create a blob with the correct content type
      const blob = new Blob([data], { type: contentType || 'application/octet-stream' });
      const blobUrl = URL.createObjectURL(blob);
      
      // For PDFs and other common viewable types, open in new tab
      window.open(blobUrl, '_blank', 'noopener,noreferrer');
      
      // Clean up the blob URL after a delay
      setTimeout(() => URL.revokeObjectURL(blobUrl), 30000); // 30-second timeout
      
      console.log('[View] File opened successfully via fallback method');
    } catch (error: any) {
      console.error('[View] Fallback method error:', error);
      toast({
        title: "Error",
        description: "Failed to load image. Try again later.",
        variant: "destructive",
      });
    }
  };

  return {
    viewFile,
    isLoading
  };
}
