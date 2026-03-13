
import { useSearchParams, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { DocumentLibrary } from "@/components/documents/DocumentLibrary";
import { useDocumentsData } from "@/hooks/useDocumentsData";

export default function Documents() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const newDocument = searchParams.get("newDocument");
  const { createDocument } = useDocumentsData();

  useEffect(() => {
    if (newDocument === "true") {
      createDocument.mutate(undefined, {
        onSuccess: (newDoc) => {
          navigate(`/documents/${newDoc.id}`, { replace: true });
        }
      });
    }
  }, []);

  return <DocumentLibrary />;
}
