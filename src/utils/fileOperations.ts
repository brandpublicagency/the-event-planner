import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

export async function checkFileExists(filePath: string) {
  console.log('[Storage] Checking if file exists:', filePath);
  
  try {
    const { data: files, error: listError } = await supabase.storage
      .from("task-files")
      .list(filePath.split('/')[0], {
        search: filePath.split('/')[1]
      });

    if (listError) {
      console.error('[Storage] Error checking file existence:', listError);
      return { exists: false, error: listError };
    }

    const exists = files && files.length > 0;
    
    console.log('[Storage] Check result:', {
      exists,
      filesFound: files?.length,
      error: null
    });

    return { exists, error: null };
  } catch (error) {
    console.error('[Storage] Error checking file:', error);
    return { exists: false, error };
  }
}

export async function deleteFile(filePath: string, fileId: string, taskId: string) {
  console.log('[Delete] Starting file deletion process:', {
    path: filePath,
    id: fileId,
    taskId
  });

  try {
    // First, check if the file exists in storage
    const { exists, error: checkError } = await checkFileExists(filePath);
    
    if (checkError) {
      console.error('[Delete] Error checking file existence:', checkError);
      throw new Error(`Failed to check file existence: ${checkError.message}`);
    }

    // If the file exists in storage, delete it
    if (exists) {
      console.log('[Delete] File exists in storage, proceeding with deletion');
      const { error: storageError } = await supabase.storage
        .from("task-files")
        .remove([filePath]);

      if (storageError) {
        console.error('[Delete] Storage deletion error:', storageError);
        throw new Error(`Failed to delete file from storage: ${storageError.message}`);
      }

      console.log('[Delete] Storage deletion successful');
    } else {
      console.log('[Delete] File not found in storage, proceeding with database cleanup');
    }

    // Always delete the database record
    const { error: dbError } = await supabase
      .from("task_files")
      .delete()
      .eq("id", fileId);

    if (dbError) {
      throw new Error(`Failed to delete file record: ${dbError.message}`);
    }

    console.log('[Delete] File deletion completed successfully');
    return true;
  } catch (error: any) {
    console.error('[Delete] Error during deletion:', error);
    throw error;
  }
}

export async function getSignedUrl(filePath: string) {
  console.log('[Storage] Getting signed URL for:', filePath);
  
  try {
    const { exists, error: checkError } = await checkFileExists(filePath);
    
    if (checkError) {
      throw new Error(`Failed to check file existence: ${checkError.message}`);
    }

    if (!exists) {
      throw new Error('File not found in storage');
    }

    const { data, error } = await supabase.storage
      .from("task-files")
      .createSignedUrl(filePath, 60);

    console.log('[Storage] Signed URL generation result:', {
      success: !!data,
      error: error
    });

    if (error) throw error;

    return data.signedUrl;
  } catch (error: any) {
    console.error('[Storage] Error getting signed URL:', error);
    throw error;
  }
}