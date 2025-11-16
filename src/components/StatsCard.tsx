import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Users, Activity, Trophy, TrendingUp, Zap } from "lucide-react";
import { getTotalMatches } from "@/app/actions/stats";
import { getPlayerOfTheWeek } from "@/app/actions/stats";
import { getPlayerOfTheMonth } from "@/app/actions/stats";
import { getCloseEloRaces } from "@/app/actions/stats";

export async function StatsCard({ playersCount }: { playersCount: number }) {
  const totalMatches = await getTotalMatches();
  const playerOfWeek = await getPlayerOfTheWeek();
  const playerOfMonth = await getPlayerOfTheMonth();
  const closeRaces = await getCloseEloRaces();

  return (
    <Card className="border-primary/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5" />
          Statistiques
        </CardTitle>
        <CardDescription>Vue d'ensemble de l'activité</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between gap-4 sm:gap-6">
          <div className="flex items-center gap-2 sm:gap-3 flex-1">
            <div className="p-2 bg-primary/10 rounded-lg shrink-0">
              <Users className="h-4 w-4 text-primary" />
            </div>
            <div>
              <div className="text-lg sm:text-xl font-bold">{playersCount}</div>
              <div className="text-xs text-muted-foreground">Joueurs</div>
            </div>
          </div>
          <div className="flex items-center gap-2 sm:gap-3 flex-1">
            <div className="p-2 bg-primary/10 rounded-lg shrink-0">
              <Activity className="h-4 w-4 text-primary" />
            </div>
            <div>
              <div className="text-lg sm:text-xl font-bold">{totalMatches}</div>
              <div className="text-xs text-muted-foreground">Matchs</div>
            </div>
          </div>
        </div>

        <div className="space-y-3 pt-3 border-t">
          {playerOfWeek && (
            <div className="flex items-center gap-2 p-2 bg-blue-50 dark:bg-blue-900/20 rounded-md">
              <Trophy className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              <div className="flex-1">
                <div className="text-xs font-semibold text-blue-900 dark:text-blue-100">
                  🏆 Semaine: {playerOfWeek.player.name}
                </div>
                <div className="text-xs text-blue-700 dark:text-blue-300">
                  {playerOfWeek.wins}{" "}
                  {playerOfWeek.wins === 1 ? "victoire" : "victoires"}
                </div>
              </div>
            </div>
          )}

          {playerOfMonth && (
            <div className="flex items-center gap-2 p-2 bg-purple-50 dark:bg-purple-900/20 rounded-md">
              <TrendingUp className="h-4 w-4 text-purple-600 dark:text-purple-400" />
              <div className="flex-1">
                <div className="text-xs font-semibold text-purple-900 dark:text-purple-100">
                  📅 Mois: {playerOfMonth.player.name}
                </div>
                <div className="text-xs text-purple-700 dark:text-purple-300">
                  {playerOfMonth.wins}{" "}
                  {playerOfMonth.wins === 1 ? "victoire" : "victoires"}
                </div>
              </div>
            </div>
          )}

          {closeRaces.length > 0 && (
            <div className="space-y-1.5">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
                <Zap className="h-3 w-3" />
                Courses serrées
              </div>
              {closeRaces
                .filter(
                  (race) =>
                    (race.ahead && race.gap <= 50) ||
                    (race.behind && race.gapBehind <= 50)
                )
                .slice(0, 2)
                .map((race) => (
                  <div
                    key={race.player.id}
                    className="p-2 bg-orange-50 dark:bg-orange-900/20 rounded-md border border-orange-200 dark:border-orange-800"
                  >
                    {race.ahead && race.gap <= 50 && (
                      <div className="text-xs">
                        <span className="font-medium">{race.player.name}</span>{" "}
                        à{" "}
                        <span className="font-bold text-orange-600 dark:text-orange-400">
                          {race.gap} pts
                        </span>{" "}
                        de{" "}
                        <span className="font-medium">{race.ahead.name}</span>
                      </div>
                    )}
                    {race.behind && race.gapBehind <= 50 && race.gap > 50 && (
                      <div className="text-xs">
                        <span className="font-medium">{race.player.name}</span>{" "}
                        devance{" "}
                        <span className="font-medium">{race.behind.name}</span>{" "}
                        de{" "}
                        <span className="font-bold text-orange-600 dark:text-orange-400">
                          {race.gapBehind} pts
                        </span>
                      </div>
                    )}
                  </div>
                ))}
            </div>
          )}

          {!playerOfWeek && !playerOfMonth && closeRaces.length === 0 && (
            <div className="text-center py-4 text-muted-foreground text-sm">
              Pas encore assez de données pour afficher les statistiques
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
