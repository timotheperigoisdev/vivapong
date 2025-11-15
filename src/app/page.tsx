import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Trophy, Users, Activity, TrendingUp } from "lucide-react";
import { AddPlayerForm } from "@/components/AddPlayerForm";
import { AddMatchForm } from "@/components/AddMatchForm";
import { MatchTracker } from "@/components/MatchTracker";
import { PlayersList } from "@/components/PlayersList";
import { getPlayers } from "@/app/actions/players";
import { ThemeToggleWrapper } from "@/components/ThemeToggleWrapper";

export default async function Home() {
  const players = await getPlayers();
  const playersCount = players.length;
  const topElo =
    players.length > 0
      ? Math.max(...players.map((p: { elo: number }) => p.elo))
      : 1000;

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="flex justify-end mb-4">
          <ThemeToggleWrapper />
        </div>
        <div className="mb-12 text-center">
          <h1 className="font-prompt text-5xl text-shadow-md font-bold tracking-tight mb-4 from-primary to-accent">
            <span className="text-black">Viva</span>
            <span className="text-[#00aeef]">Pong</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Suivez vos matchs de ping-pong, enregistrez les résultats et
            analysez vos performances avec un système ELO dynamique
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <Card className="border-primary/20 hover:border-primary/40 transition-colors">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Joueurs</CardTitle>
              <Users className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{playersCount}</div>
              <p className="text-xs text-muted-foreground">
                Joueurs enregistrés
              </p>
            </CardContent>
          </Card>

          <Card className="border-primary/20 hover:border-primary/40 transition-colors">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Matchs</CardTitle>
              <Activity className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
              <p className="text-xs text-muted-foreground">Matchs joués</p>
            </CardContent>
          </Card>

          <Card className="border-primary/20 hover:border-primary/40 transition-colors">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Meilleur ELO
              </CardTitle>
              <Trophy className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{topElo}</div>
              <p className="text-xs text-muted-foreground">Score de départ</p>
            </CardContent>
          </Card>

          <Card className="border-primary/20 hover:border-primary/40 transition-colors">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tendance</CardTitle>
              <TrendingUp className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">--</div>
              <p className="text-xs text-muted-foreground">
                Évolution cette semaine
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
          <AddPlayerForm />
          <AddMatchForm />
          <MatchTracker />
        </div>

        <div className="mt-8">
          <PlayersList />
        </div>
      </div>
    </div>
  );
}
