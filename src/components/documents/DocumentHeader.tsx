import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Filter } from "lucide-react";
import { DocumentUpload } from "./DocumentUpload";

interface DocumentHeaderProps {
  onUpload: (event: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
}

export const DocumentHeader = ({ onUpload }: DocumentHeaderProps) => {
  return (
    <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Documents</h2>
        <p className="text-muted-foreground">Manage your files and documents</p>
      </div>
      <div className="flex items-center space-x-2">
        <DocumentUpload onUpload={onUpload} />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>Sort by Name</DropdownMenuItem>
            <DropdownMenuItem>Sort by Date</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};