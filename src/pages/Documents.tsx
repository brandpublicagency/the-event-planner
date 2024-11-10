import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileUp, Search, FileText, Download, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/components/ui/use-toast";

const Documents = () => {
  const { toast } = useToast();
  const documents = [
    { id: 1, name: "Project Proposal.pdf", type: "PDF", size: "2.4 MB", lastModified: "2024-01-15" },
    { id: 2, name: "Meeting Notes.docx", type: "DOCX", size: "1.1 MB", lastModified: "2024-01-20" },
    { id: 3, name: "Budget Report.xlsx", type: "XLSX", size: "3.2 MB", lastModified: "2024-01-25" },
  ];

  const handleDownload = (docName: string) => {
    toast({
      title: "Download Started",
      description: `Downloading ${docName}...`,
    });
  };

  const handleUpload = () => {
    toast({
      title: "Upload Feature",
      description: "Upload functionality will be implemented soon.",
    });
  };

  return (
    <div className="flex-1 space-y-6 p-4 md:p-8 pt-6">
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Documents</h2>
          <p className="text-muted-foreground">Manage your files and documents</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button onClick={handleUpload}>
            <FileUp className="mr-2 h-4 w-4" />
            Upload
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Sort by Name</DropdownMenuItem>
              <DropdownMenuItem>Sort by Date</DropdownMenuItem>
              <DropdownMenuItem>Sort by Size</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      
      <div className="flex items-center space-x-2">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search documents..." className="pl-8" />
        </div>
      </div>

      <ScrollArea className="h-[calc(100vh-12rem)]">
        <div className="grid gap-4">
          {documents.map((doc) => (
            <Card key={doc.id} className="group transition-all hover:shadow-md">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-base font-medium">
                  <div className="flex items-center">
                    <FileText className="mr-2 h-4 w-4 text-muted-foreground" />
                    {doc.name}
                  </div>
                </CardTitle>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDownload(doc.name)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Download className="h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-muted-foreground">
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center rounded-md bg-muted px-2 py-1 text-xs font-medium">
                      {doc.type}
                    </span>
                    <span>{doc.size}</span>
                    <span>Modified: {new Date(doc.lastModified).toLocaleDateString()}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default Documents;