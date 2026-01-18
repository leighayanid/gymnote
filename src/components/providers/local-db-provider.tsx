"use client";

import { useEffect, useState, type ReactNode } from "react";
import { initializeBuiltInExercises } from "@/db/local-database";

interface LocalDbProviderProps {
  children: ReactNode;
}

export function LocalDbProvider({ children }: LocalDbProviderProps) {
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const init = async () => {
      try {
        await initializeBuiltInExercises();
      } catch (error) {
        console.error("Failed to initialize local database:", error);
      } finally {
        setIsInitialized(true);
      }
    };

    init();
  }, []);

  // Show nothing while initializing (prevents hydration issues)
  if (!isInitialized) {
    return null;
  }

  return <>{children}</>;
}
