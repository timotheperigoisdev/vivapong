"use client";

import { useCurrentMatch } from "@/hooks/useCurrentMatch";
import { MatchTracker } from "./MatchTracker";
import { AddMatchForm } from "./AddMatchForm";
import { Card, CardContent } from "@/components/ui/card";

export function MatchFormOrTracker() {
  const { match, isLoading } = useCurrentMatch();

  if (isLoading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-center text-muted-foreground">Chargement...</p>
        </CardContent>
      </Card>
    );
  }

  if (match) {
    return <MatchTracker />;
  }

  return <AddMatchForm />;
}
