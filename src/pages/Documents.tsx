
import { DocumentsContainer } from "@/components/documents/DocumentsContainer";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useEffect } from "react";

export default function Documents() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const newDocument = searchParams.get("newDocument");
  
  // Clear the newDocument parameter after it's been processed
  useEffect(() => {
    if (newDocument === "true") {
      // Remove the newDocument parameter after a delay
      // This allows DocumentsContainer to process it first
      const timeoutId = setTimeout(() => {
        navigate('/documents', { replace: true });
      }, 2000); // Increased timeout to ensure DocumentsContainer has time to process
      
      return () => clearTimeout(timeoutId);
    }
  }, [newDocument, navigate]);
  
  return (
    <DocumentsContainer autoCreateDocument={newDocument === "true"} />
  );
}
