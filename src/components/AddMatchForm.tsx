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
import { Trophy } from "lucide-react";
import { Player } from "@/types/player.types";
import { useRouter } from "next/navigation";

export function AddMatchForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [players, setPlayers] = useState<Player[]>([]);
  const [isLoadingPlayers, setIsLoadingPlayers] = useState(true);
  const [matchMode, setMatchMode] = useState<"realtime" | "manual">("realtime");
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  useEffect(() => {
    async function loadPlayers() {
      const playersData = await getPlayers();
      setPlayers(playersData);
      setIsLoadingPlayers(false);
    }
    loadPlayers();
  }, []);

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
    }

    setIsSubmitting(false);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-5 w-5" />
          Créer un nouveau match
        </CardTitle>
        <CardDescription>
          Sélectionnez deux joueurs pour commencer un match
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="matchMode">Mode</Label>
            <select
              id="matchMode"
              value={matchMode}
              onChange={(e) =>
                setMatchMode(e.target.value as "realtime" | "manual")
              }
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              disabled={isSubmitting}
            >
              <option value="realtime">Suivre en temps réel</option>
              <option value="manual">Renseigner le score après</option>
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="playerAId">Joueur A</Label>
            <select
              id="playerAId"
              name="playerAId"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              required
              disabled={isSubmitting || isLoadingPlayers}
            >
              <option value="">Sélectionner un joueur</option>
              {players.map((player) => (
                <option key={player.id} value={player.id}>
                  {player.name} {player.isGuest && "(Invité)"} - ELO:{" "}
                  {player.elo}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="playerBId">Joueur B</Label>
            <select
              id="playerBId"
              name="playerBId"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              required
              disabled={isSubmitting || isLoadingPlayers}
            >
              <option value="">Sélectionner un joueur</option>
              {players.map((player) => (
                <option key={player.id} value={player.id}>
                  {player.name} {player.isGuest && "(Invité)"} - ELO:{" "}
                  {player.elo}
                </option>
              ))}
            </select>
          </div>

          {matchMode === "manual" && (
            <>
              <div className="space-y-2">
                <Label htmlFor="scoreA">Score Joueur A</Label>
                <Input
                  id="scoreA"
                  name="scoreA"
                  type="number"
                  min="0"
                  max="11"
                  required
                  disabled={isSubmitting || isLoadingPlayers}
                  placeholder="0-11"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="scoreB">Score Joueur B</Label>
                <Input
                  id="scoreB"
                  name="scoreB"
                  type="number"
                  min="0"
                  max="11"
                  required
                  disabled={isSubmitting || isLoadingPlayers}
                  placeholder="0-11"
                />
              </div>
            </>
          )}

          {message && (
            <div
              className={`rounded-md p-3 text-sm ${
                message.type === "success"
                  ? "bg-green-50 text-green-800 dark:bg-green-900/20 dark:text-green-400"
                  : "bg-red-50 text-red-800 dark:bg-red-900/20 dark:text-red-400"
              }`}
            >
              {message.text}
            </div>
          )}

          <Button
            type="submit"
            className="w-full"
            disabled={isSubmitting || isLoadingPlayers}
          >
            {isSubmitting
              ? "Enregistrement en cours..."
              : matchMode === "realtime"
              ? "Créer le match"
              : "Enregistrer le match"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
