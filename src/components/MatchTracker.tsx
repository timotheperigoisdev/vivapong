"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { updateMatchScore } from "@/app/actions/matches";
import { Trophy, Plus, Minus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCurrentMatch } from "@/hooks/useCurrentMatch";

export function MatchTracker() {
  const { match, isLoading, refreshMatch, setMatch } = useCurrentMatch();
  const [isUpdating, setIsUpdating] = useState(false);
  const router = useRouter();

  async function handleScoreChange(player: "A" | "B", delta: number) {
    if (!match || isUpdating) return;

    const newScoreA =
      player === "A" ? Math.max(0, match.scoreA + delta) : match.scoreA;
    const newScoreB =
      player === "B" ? Math.max(0, match.scoreB + delta) : match.scoreB;

    if (newScoreA > 11 || newScoreB > 11) return;

    setIsUpdating(true);
    const result = await updateMatchScore(match.id, newScoreA, newScoreB);

    if (result.error) {
      console.error(result.error);
    } else if (result.match) {
      setMatch(result.match);
      if (newScoreA >= 11 || newScoreB >= 11) {
        setTimeout(() => {
          router.refresh();
          refreshMatch();
        }, 1000);
      }
    }

    setIsUpdating(false);
  }

  if (isLoading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-center text-muted-foreground">Chargement...</p>
        </CardContent>
      </Card>
    );
  }

  if (!match) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-center text-muted-foreground">
            Aucun match en cours
          </p>
        </CardContent>
      </Card>
    );
  }

  const isFinished = match.scoreA >= 11 || match.scoreB >= 11;
  const winner = match.scoreA >= 11 ? match.playerA : match.playerB;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-5 w-5" />
          Match en cours
        </CardTitle>
        <CardDescription>
          {isFinished
            ? `Match terminé - ${winner.name} a gagné!`
            : "Suivez le score en temps réel"}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 sm:space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          <div
            className={`rounded-lg border-2 p-3 sm:p-4 ${
              match.scoreA >= 11
                ? "border-green-500 bg-green-50 dark:bg-green-900/20"
                : "border-gray-200 dark:border-gray-700"
            }`}
          >
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <div
                className="w-4 h-4 rounded-full shrink-0"
                style={{ backgroundColor: match.playerA.color }}
              />
              <h3 className="font-semibold text-sm sm:text-base truncate flex-1">
                {match.playerA.name}
              </h3>
              {match.playerA.isGuest && (
                <span className="text-xs text-muted-foreground">(Invité)</span>
              )}
            </div>
            <div className="text-3xl sm:text-4xl font-bold text-center mb-3 sm:mb-4">
              {match.scoreA}
            </div>
            {!isFinished && (
              <div className="flex gap-2 justify-center">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => handleScoreChange("A", -1)}
                  disabled={isUpdating || match.scoreA === 0}
                  className="min-w-[44px] min-h-[44px]"
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => handleScoreChange("A", 1)}
                  disabled={isUpdating || match.scoreA >= 11}
                  className="min-w-[44px] min-h-[44px]"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>

          <div
            className={`rounded-lg border-2 p-3 sm:p-4 ${
              match.scoreB >= 11
                ? "border-green-500 bg-green-50 dark:bg-green-900/20"
                : "border-gray-200 dark:border-gray-700"
            }`}
          >
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <div
                className="w-4 h-4 rounded-full shrink-0"
                style={{ backgroundColor: match.playerB.color }}
              />
              <h3 className="font-semibold text-sm sm:text-base truncate flex-1">
                {match.playerB.name}
              </h3>
              {match.playerB.isGuest && (
                <span className="text-xs text-muted-foreground">(Invité)</span>
              )}
            </div>
            <div className="text-3xl sm:text-4xl font-bold text-center mb-3 sm:mb-4">
              {match.scoreB}
            </div>
            {!isFinished && (
              <div className="flex gap-2 justify-center">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => handleScoreChange("B", -1)}
                  disabled={isUpdating || match.scoreB === 0}
                  className="min-w-[44px] min-h-[44px]"
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => handleScoreChange("B", 1)}
                  disabled={isUpdating || match.scoreB >= 11}
                  className="min-w-[44px] min-h-[44px]"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        </div>

        {isFinished && (
          <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <p className="font-semibold text-green-800 dark:text-green-400">
              🎉 {winner.name} a gagné le match!
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              Les points ELO ont été mis à jour automatiquement
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
