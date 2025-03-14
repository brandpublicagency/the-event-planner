
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
      
      // Get the public URL
      const { data } = supabase.storage
        .from("taskmanager-files")
        .getPublicUrl(filePath);

      if (!data?.publicUrl) {
        throw new Error('Could not generate public URL');
      }

      // For image files, create an image viewer in a modal
      if (contentType.startsWith('image/')) {
        // Create modal container
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
        closeBtn.textContent = '✕';
        closeBtn.style.position = 'absolute';
        closeBtn.style.top = '20px';
        closeBtn.style.right = '20px';
        closeBtn.style.padding = '8px 16px';
        closeBtn.style.backgroundColor = 'transparent';
        closeBtn.style.color = 'white';
        closeBtn.style.border = 'none';
        closeBtn.style.borderRadius = '4px';
        closeBtn.style.fontSize = '20px';
        closeBtn.style.cursor = 'pointer';
        closeBtn.onclick = () => document.body.removeChild(modal);
        
        // Add image container with loading indicator
        const imgContainer = document.createElement('div');
        imgContainer.style.position = 'relative';
        imgContainer.style.maxWidth = '90%';
        imgContainer.style.maxHeight = '90%';
        
        // Add loading indicator
        const loadingIndicator = document.createElement('div');
        loadingIndicator.textContent = 'Loading image...';
        loadingIndicator.style.color = 'white';
        loadingIndicator.style.textAlign = 'center';
        loadingIndicator.style.padding = '20px';
        
        imgContainer.appendChild(loadingIndicator);
        
        // Add to DOM first
        document.body.appendChild(modal);
        modal.appendChild(imgContainer);
        modal.appendChild(closeBtn);
        
        // Create and load image
        const img = new Image();
        img.src = data.publicUrl;
        img.style.maxWidth = '100%';
        img.style.maxHeight = '100%';
        img.style.objectFit = 'contain';
        img.style.display = 'none'; // Hide until loaded
        
        img.onload = () => {
          // Remove loading indicator and show image
          imgContainer.removeChild(loadingIndicator);
          img.style.display = 'block';
          imgContainer.appendChild(img);
        };
        
        img.onerror = () => {
          document.body.removeChild(modal);
          toast({
            title: "Error",
            description: "Failed to load image. Try again later.",
            variant: "destructive",
          });
        };
      } else {
        // For other file types, open in a new tab
        window.open(data.publicUrl, '_blank', 'noopener,noreferrer');
      }
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

  return {
    viewFile,
    isLoading
  };
}
