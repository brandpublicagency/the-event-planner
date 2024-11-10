import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileUp, Search, Download, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
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
    { 
      id: 1, 
      name: "Project Proposal", 
      type: "PDF", 
      size: "2.4 MB", 
      lastModified: "2024-01-15",
      tags: ["Proposal", "Client"],
      preview: "/placeholder.png"
    },
    { 
      id: 2, 
      name: "Meeting Notes", 
      type: "DOCX", 
      size: "1.1 MB", 
      lastModified: "2024-01-20",
      tags: ["Notes", "Internal"],
      preview: "/placeholder.png"
    },
    { 
      id: 3, 
      name: "Budget Report", 
      type: "XLSX", 
      size: "3.2 MB", 
      lastModified: "2024-01-25",
      tags: ["Finance", "Report"],
      preview: "/placeholder.png"
    },
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {documents.map((doc) => (
            <Card key={doc.id} className="group overflow-hidden">
              <div className="aspect-video relative bg-muted">
                <img 
                  src={doc.preview} 
                  alt={doc.name}
                  className="object-cover w-full h-full"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDownload(doc.name)}
                  className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 hover:bg-white"
                >
                  <Download className="h-4 w-4" />
                </Button>
              </div>
              <CardContent className="p-4">
                <div className="space-y-3">
                  <div>
                    <h3 className="font-semibold text-lg">{doc.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      Modified: {new Date(doc.lastModified).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    {doc.tags.map((tag) => (
                      <Badge key={tag} variant="secondary">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span className="inline-flex items-center rounded-md bg-muted px-2 py-1 text-xs font-medium">
                      {doc.type}
                    </span>
                    <span>{doc.size}</span>
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