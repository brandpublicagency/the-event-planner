import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { Search, Loader2 } from "lucide-react";
import { DocumentCard } from "@/components/documents/DocumentCard";
import { DocumentHeader } from "@/components/documents/DocumentHeader";

const Documents = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");

  const { data: documents, isLoading } = useQuery({
    queryKey: ['pdf-files'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('pdf_files')
        .select(`
          *,
          pdf_processed_content (
            content
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    }
  });

  const handleDownload = async (filePath: string, fileName: string) => {
    try {
      const { data, error } = await supabase.storage
        .from('pdfs')
        .download(filePath);

      if (error) throw error;

      const url = URL.createObjectURL(data);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast({
        title: "Download Started",
        description: `Downloading ${fileName}...`,
      });
    } catch (error) {
      toast({
        title: "Download Failed",
        description: "There was an error downloading the file.",
        variant: "destructive",
      });
    }
  };

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const fileExt = file.name.split('.').pop();
      const filePath = `${crypto.randomUUID()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('pdfs')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { error: dbError } = await supabase
        .from('pdf_files')
        .insert({
          filename: file.name,
          file_path: filePath,
        });

      if (dbError) throw dbError;

      toast({
        title: "Upload Successful",
        description: "Your file has been uploaded and will be processed shortly.",
      });
    } catch (error) {
      toast({
        title: "Upload Failed",
        description: "There was an error uploading your file.",
        variant: "destructive",
      });
    }
  };

  const filteredDocuments = documents?.filter(doc => 
    doc.filename.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex-1 space-y-6 p-4 md:p-8 pt-6">
      <DocumentHeader onUpload={handleUpload} />
      
      <div className="flex items-center space-x-2">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search documents..." 
            className="pl-8" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <ScrollArea className="h-[calc(100vh-12rem)]">
        {isLoading ? (
          <div className="flex items-center justify-center h-32">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        ) : filteredDocuments?.length === 0 ? (
          <div className="text-center text-muted-foreground py-8">
            No documents found
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredDocuments?.map((doc) => (
              <DocumentCard
                key={doc.id}
                filename={doc.filename}
                created_at={doc.created_at}
                content={doc.pdf_processed_content?.[0]?.content}
                onDownload={() => handleDownload(doc.file_path, doc.filename)}
              />
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  );
};

export default Documents;