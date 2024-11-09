import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileUp, Search, FileText, Download } from "lucide-react";
import { Input } from "@/components/ui/input";

const Documents = () => {
  const documents = [
    { id: 1, name: "Project Proposal.pdf", type: "PDF", size: "2.4 MB", lastModified: "2024-01-15" },
    { id: 2, name: "Meeting Notes.docx", type: "DOCX", size: "1.1 MB", lastModified: "2024-01-20" },
    { id: 3, name: "Budget Report.xlsx", type: "XLSX", size: "3.2 MB", lastModified: "2024-01-25" },
  ];

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Documents</h2>
        <Button>
          <FileUp className="mr-2 h-4 w-4" />
          Upload
        </Button>
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
            <Card key={doc.id} className="cursor-pointer hover:bg-accent">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-base font-medium">
                  <div className="flex items-center">
                    <FileText className="mr-2 h-4 w-4" />
                    {doc.name}
                  </div>
                </CardTitle>
                <Button variant="ghost" size="icon">
                  <Download className="h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-muted-foreground">
                  <div className="flex items-center justify-between">
                    <span>Type: {doc.type}</span>
                    <span>Size: {doc.size}</span>
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