
import { Plus, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Header } from '@/components/layout/Header';
import { useNavigate } from 'react-router-dom';

export default function DocumentsHeader() {
  const navigate = useNavigate();
  
  const handleCreateDocument = () => {
    navigate('/documents?newDocument=true');
  };

  return (
    <Header 
      pageTitle="Documents"
      actionButton={{
        label: "New Document",
        icon: <Plus className="h-4 w-4 mr-1" />,
        onClick: handleCreateDocument,
        variant: "default"
      }}
    />
  );
}
