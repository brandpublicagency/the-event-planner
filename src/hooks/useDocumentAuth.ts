
import { useState, useEffect } from "react";

export function useDocumentAuth() {
  const [isLoading, setIsLoading] = useState(false);
  
  // Since RLS is disabled and no security is needed, we always return authenticated as true
  return { 
    isAuthenticated: true, 
    isLoading: false 
  };
}
