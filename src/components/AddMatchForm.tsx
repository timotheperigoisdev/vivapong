"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  createMatch,
  createMatchWithScore,
  getPlayers,
} from "@/app/actions/matches";
import { Trophy, Zap, Edit } from "lucide-react";
import { Player } from "@/types/player.types";
import { useRouter } from "next/navigation";
import { useCurrentMatch } from "@/hooks/useCurrentMatch";

export function AddMatchForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const playerARef = useRef<HTMLSelectElement>(null);
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [players, setPlayers] = useState<Player[]>([]);
  const [isLoadingPlayers, setIsLoadingPlayers] = useState(true);
  const [matchMode, setMatchMode] = useState<"realtime" | "manual">("manual");
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const { refreshMatch } = useCurrentMatch();

  useEffect(() => {
    async function loadPlayers() {
      const playersData = await getPlayers();
      setPlayers(playersData);
      setIsLoadingPlayers(false);
    }
    loadPlayers();
  }, []);

  useEffect(() => {
    if (!isLoadingPlayers && playerARef.current) {
      playerARef.current.focus();
    }
  }, [isLoadingPlayers]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage(null);

    const formData = new FormData(e.currentTarget);
    const result =
      matchMode === "realtime"
        ? await createMatch(formData)
        : await createMatchWithScore(formData);

    if (result.error) {
      setMessage({ type: "error", text: result.error });
      setIsSubmitting(false);
    } else {
      setMessage({
        type: "success",
        text:
          matchMode === "realtime"
            ? "Match créé avec succès"
            : "Match enregistré avec succès",
      });
      formRef.current?.reset();
      setMatchMode("realtime");
      router.refresh();
      setTimeout(() => {
        setIsSubmitting(false);
        setMessage(null);
        refreshMatch();
      }, 1500);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-5 w-5" />
          Créer un match
        </CardTitle>
        <CardDescription>
          Sélectionnez deux joueurs pour commencer
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
          <div className="flex gap-2 p-1 bg-muted rounded-lg">
            <button
              type="button"
              onClick={() => setMatchMode("manual")}
              className={`cursor-pointer flex-1 flex items-center justify-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-2.5 sm:py-2 rounded-md text-xs sm:text-sm font-medium transition-colors min-h-[44px] ${
                matchMode === "manual"
                  ? "bg-background shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              disabled={isSubmitting}
              aria-label="Mode manuel"
            >
              <Edit className="h-4 w-4 shrink-0" />
              <span className="hidden sm:inline">Score manuel</span>
              <span className="sm:hidden">Manuel</span>
            </button>
            <button
              type="button"
              onClick={() => setMatchMode("realtime")}
              className={`cursor-pointer flex-1 flex items-center justify-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-2.5 sm:py-2 rounded-md text-xs sm:text-sm font-medium transition-colors min-h-[44px] ${
                matchMode === "realtime"
                  ? "bg-background shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              disabled={isSubmitting}
              aria-label="Mode temps réel"
            >
              <Zap className="h-4 w-4 shrink-0" />
              <span>Temps réel</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-3">
            <div className="space-y-2">
              <Label htmlFor="playerAId" className="text-sm">
                Joueur A
              </Label>
              <select
                ref={playerARef}
                id="playerAId"
                name="playerAId"
                className="flex h-11 sm:h-10 w-full rounded-md border border-input bg-background px-3 py-2.5 sm:py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                required
                disabled={isSubmitting || isLoadingPlayers}
                aria-label="Sélectionner le joueur A"
              >
                <option value="">Joueur A</option>
                {players.map((player) => (
                  <option key={player.id} value={player.id}>
                    {player.name} {player.isGuest && "(Invité)"}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="playerBId" className="text-sm">
                Joueur B
              </Label>
              <select
                id="playerBId"
                name="playerBId"
                className="flex h-11 sm:h-10 w-full rounded-md border border-input bg-background px-3 py-2.5 sm:py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                required
                disabled={isSubmitting || isLoadingPlayers}
                aria-label="Sélectionner le joueur B"
              >
                <option value="">Joueur B</option>
                {players.map((player) => (
                  <option key={player.id} value={player.id}>
                    {player.name} {player.isGuest && "(Invité)"}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {matchMode === "manual" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-3">
              <div className="space-y-2">
                <Label htmlFor="scoreA" className="text-sm">
                  Score A
                </Label>
                <Input
                  id="scoreA"
                  name="scoreA"
                  type="number"
                  min="0"
                  max="11"
                  required
                  disabled={isSubmitting || isLoadingPlayers}
                  placeholder="0-11"
                  aria-label="Score du joueur A"
                  className="h-11 sm:h-10"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="scoreB" className="text-sm">
                  Score B
                </Label>
                <Input
                  id="scoreB"
                  name="scoreB"
                  type="number"
                  min="0"
                  max="11"
                  required
                  disabled={isSubmitting || isLoadingPlayers}
                  placeholder="0-11"
                  aria-label="Score du joueur B"
                  className="h-11 sm:h-10"
                />
              </div>
            </div>
          )}

          {message && (
            <div
              className={`rounded-md p-3 text-sm ${
                message.type === "success"
                  ? "bg-green-50 text-green-800 dark:bg-green-900/20 dark:text-green-400"
                  : "bg-red-50 text-red-800 dark:bg-red-900/20 dark:text-red-400"
              }`}
              role="alert"
            >
              {message.text}
            </div>
          )}

          <Button
            type="submit"
            className="cursor-pointer w-full min-h-[44px] text-sm sm:text-base"
            disabled={isSubmitting || isLoadingPlayers}
            aria-label={
              matchMode === "realtime"
                ? "Créer le match en temps réel"
                : "Enregistrer le match avec score"
            }
          >
            {isSubmitting
              ? "Enregistrement..."
              : matchMode === "realtime"
              ? "Créer le match"
              : "Enregistrer"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
