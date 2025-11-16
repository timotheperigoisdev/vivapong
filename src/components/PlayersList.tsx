import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Users, Plus } from "lucide-react";
import { getPlayers } from "@/app/actions/players";
import { PlayersListClient } from "./PlayersListClient";

export async function PlayersList() {
  const players = await getPlayers();

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Liste des joueurs
            </CardTitle>
            <CardDescription>
              {players.length}{" "}
              {players.length === 1
                ? "joueur enregistré"
                : "joueurs enregistrés"}
            </CardDescription>
          </div>
          <PlayersListClient />
        </div>
      </CardHeader>
      <CardContent>
        {players.length === 0 ? (
          <div className="text-center py-6 sm:py-8 text-muted-foreground">
            <Users className="h-10 w-10 sm:h-12 sm:w-12 mx-auto mb-3 sm:mb-4 opacity-50" />
            <p className="text-xs sm:text-sm">Aucun joueur enregistré</p>
          </div>
        ) : (
          <div className="overflow-x-auto -mx-3 sm:mx-0">
            <div className="min-w-full inline-block align-middle">
              <table className="w-full min-w-[600px]">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-3 sm:px-4 font-medium text-xs sm:text-sm">
                      Nom
                    </th>
                    <th className="text-left py-3 px-3 sm:px-4 font-medium text-xs sm:text-sm">
                      ELO
                    </th>
                    <th className="text-left py-3 px-3 sm:px-4 font-medium text-xs sm:text-sm">
                      Victoires
                    </th>
                    <th className="text-left py-3 px-3 sm:px-4 font-medium text-xs sm:text-sm">
                      Type
                    </th>
                    <th className="text-left py-3 px-3 sm:px-4 font-medium text-xs sm:text-sm">
                      Couleur
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {players.map((player) => (
                    <tr
                      key={player.id}
                      className="border-b hover:bg-muted/50 transition-colors"
                    >
                      <td className="py-3 px-3 sm:px-4 font-medium text-sm">
                        {player.name}
                      </td>
                      <td className="py-3 px-3 sm:px-4 text-sm">
                        {player.elo}
                      </td>
                      <td className="py-3 px-3 sm:px-4 text-sm">
                        {(player as any).winsCount || 0}
                      </td>
                      <td className="py-3 px-3 sm:px-4">
                        {player.isGuest ? (
                          <span className="text-xs px-2 py-1 rounded-full bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400">
                            Invité
                          </span>
                        ) : (
                          <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400">
                            Membre
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-3 sm:px-4">
                        <div className="flex items-center gap-2">
                          <div
                            className="w-5 h-5 sm:w-6 sm:h-6 rounded-full border border-gray-300 dark:border-gray-600 shrink-0"
                            style={{ backgroundColor: player.color }}
                          />
                          <span className="text-xs text-muted-foreground hidden sm:inline">
                            {player.color}
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
