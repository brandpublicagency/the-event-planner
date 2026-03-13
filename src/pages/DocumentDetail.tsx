
import { useParams } from "react-router-dom";
import { DocumentsContainer } from "@/components/documents/DocumentsContainer";

export default function DocumentDetail() {
  const { id } = useParams<{ id: string }>();
  return <DocumentsContainer initialDocId={id || null} />;
}
