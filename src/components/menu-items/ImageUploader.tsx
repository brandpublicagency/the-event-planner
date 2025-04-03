
import React, { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { ImageIcon, X, Upload } from 'lucide-react';
import { toast } from 'sonner';

interface ImageUploaderProps {
  imageUrl: string | null;
  onImageChange: (newUrl: string | null) => void;
  onFileChange: (file: File | null) => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ 
  imageUrl, 
  onImageChange,
  onFileChange
}) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(imageUrl);
  const [isHovering, setIsHovering] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    
    if (!file) {
      return;
    }

    // Check file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    // Check file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast.error('Image must be less than 2MB');
      return;
    }

    // Create a preview URL
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
    
    // Notify parent about the file
    onFileChange(file);
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemoveImage = () => {
    setPreviewUrl(null);
    onImageChange(null);
    onFileChange(null);
  };

  return (
    <div className="space-y-2">
      <div 
        className="relative border border-dashed border-gray-300 rounded-md flex flex-col items-center justify-center h-48 overflow-hidden"
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        {previewUrl ? (
          <>
            <img 
              src={previewUrl} 
              alt="Menu item" 
              className="object-cover h-full w-full"
            />
            {isHovering && (
              <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                <Button 
                  variant="destructive" 
                  size="sm" 
                  onClick={handleRemoveImage} 
                  className="absolute top-2 right-2"
                >
                  <X className="h-4 w-4" />
                </Button>
                <Button
                  onClick={() => fileInputRef.current?.click()}
                  variant="outline"
                  className="bg-white text-black hover:bg-gray-100"
                >
                  <Upload className="h-4 w-4 mr-2" /> 
                  Change Image
                </Button>
              </div>
            )}
          </>
        ) : (
          <div 
            className="flex flex-col items-center justify-center h-full w-full p-4 cursor-pointer"
            onClick={() => fileInputRef.current?.click()}
          >
            <ImageIcon className="h-10 w-10 text-gray-400 mb-2" />
            <p className="text-sm text-gray-500">Click to upload an image</p>
            <p className="text-xs text-gray-400 mt-1">PNG, JPG, WEBP up to 2MB</p>
          </div>
        )}
      </div>
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        accept="image/*"
        onChange={handleFileChange}
      />
    </div>
  );
};

export default ImageUploader;
