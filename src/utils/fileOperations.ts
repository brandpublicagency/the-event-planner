import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

export async function checkFileExists(filePath: string) {
  console.log('[Storage] Checking if file exists:', filePath);
  
  const { data: files, error: listError } = await supabase.storage
    .from("task-files")
    .list(filePath.split('/')[0], {
      search: filePath.split('/')[1]
    });

  console.log('[Storage] Check result:', {
    exists: files && files.length > 0,
    filesFound: files?.length,
    error: listError
  });

  return {
    exists: files && files.length > 0,
    error: listError
  };
}

export async function deleteFile(filePath: string, fileId: string, taskId: string) {
  console.log('[Delete] Starting file deletion process:', {
    path: filePath,
    id: fileId,
    taskId
  });

  const { exists, error: checkError } = await checkFileExists(filePath);
  
  if (checkError) {
    console.error('[Delete] Error checking file existence:', checkError);
    toast({
      title: "File Check Error",
      description: `Failed to check file existence: ${checkError.message}`,
      variant: "destructive"
    });
    throw new Error(`Failed to check file existence: ${checkError.message}`);
  }

  if (exists) {
    console.log('[Delete] File exists in storage, proceeding with deletion');
    const { error: storageError } = await supabase.storage
      .from("task-files")
      .remove([filePath]);

    console.log('[Delete] Storage deletion result:', {
      success: !storageError,
      error: storageError
    });

    if (storageError) {
      console.error('[Delete] Storage deletion error:', storageError);
      toast({
        title: "Storage Deletion Error",
        description: `Failed to delete file from storage: ${storageError.message}`,
        variant: "destructive"
      });
      throw new Error(`Failed to delete file from storage: ${storageError.message}`);
    }
  } else {
    console.log('[Delete] File not found in storage, proceeding with database cleanup');
  }

  const { error: dbError } = await supabase
    .from("task_files")
    .delete()
    .eq("id", fileId);

  console.log('[Delete] Database deletion result:', {
    success: !dbError,
    error: dbError
  });

  if (dbError) {
    console.error('[Delete] Database deletion error:', dbError);
    toast({
      title: "Database Deletion Error",
      description: `Failed to delete file record: ${dbError.message}`,
      variant: "destructive"
    });
    throw new Error(`Failed to delete file record: ${dbError.message}`);
  }

  toast({
    title: "File Deleted",
    description: "The file was successfully deleted.",
  });

  console.log('[Delete] File deletion completed successfully');
}

export async function getSignedUrl(filePath: string) {
  console.log('[Storage] Getting signed URL for:', filePath);
  
  const { exists, error: checkError } = await checkFileExists(filePath);
  
  if (checkError) {
    console.error('[Storage] Error checking file existence:', checkError);
    toast({
      title: "File Check Error",
      description: `Failed to check file existence: ${checkError.message}`,
      variant: "destructive"
    });
    throw new Error(`Failed to check file existence: ${checkError.message}`);
  }

  if (!exists) {
    console.error('[Storage] File not found:', filePath);
    toast({
      title: "File Not Found",
      description: "The requested file does not exist in storage.",
      variant: "destructive"
    });
    throw new Error('File not found in storage');
  }

  const { data, error } = await supabase.storage
    .from("task-files")
    .createSignedUrl(filePath, 60);

  console.log('[Storage] Signed URL generation result:', {
    success: !!data,
    error: error
  });

  if (error) {
    console.error('[Storage] Signed URL error:', error);
    toast({
      title: "URL Generation Error",
      description: `Failed to generate signed URL: ${error.message}`,
      variant: "destructive"
    });
    throw error;
  }

  return data.signedUrl;
}