
import { DocumentsContainer } from "@/components/documents/DocumentsContainer";
import { useSearchParams } from "react-router-dom";

export default function Documents() {
  const [searchParams] = useSearchParams();
  const newDocument = searchParams.get("newDocument");
  
  return <DocumentsContainer autoCreateDocument={newDocument === "true"} />;
}
