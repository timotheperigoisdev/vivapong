import { useState, useEffect, useCallback } from "react";
import { getCurrentMatch } from "@/app/actions/matches";
import { Match } from "@/types/match.types";

export function useCurrentMatch() {
  const [match, setMatch] = useState<Match | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadMatch = useCallback(async () => {
    setIsLoading(true);
    const currentMatch = await getCurrentMatch();
    setMatch(currentMatch);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    loadMatch();
  }, [loadMatch]);

  const refreshMatch = useCallback(async () => {
    await loadMatch();
  }, [loadMatch]);

  return {
    match,
    isLoading,
    refreshMatch,
    setMatch,
  };
}

