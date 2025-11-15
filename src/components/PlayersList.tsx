import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Users } from "lucide-react";
import { getPlayers } from "@/app/actions/players";

export async function PlayersList() {
  const players = await getPlayers();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Liste des joueurs
        </CardTitle>
        <CardDescription>
          {players.length}{" "}
          {players.length === 1 ? "joueur enregistré" : "joueurs enregistrés"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {players.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p className="text-sm">Aucun joueur enregistré</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium text-sm">
                    Nom
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-sm">
                    ELO
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-sm">
                    Type
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-sm">
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
                    <td className="py-3 px-4 font-medium">{player.name}</td>
                    <td className="py-3 px-4">{player.elo}</td>
                    <td className="py-3 px-4">
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
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-6 h-6 rounded-full border border-gray-300"
                          style={{ backgroundColor: player.color }}
                        />
                        <span className="text-xs text-muted-foreground">
                          {player.color}
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
