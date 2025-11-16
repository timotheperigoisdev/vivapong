"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { getEloHistory, PlayerEloHistory } from "@/app/actions/elo-history";
import { getPlayers } from "@/app/actions/players";
import { Player } from "@/types/player.types";
import { LineChart, Line, XAxis, YAxis, CartesianGrid } from "recharts";
import { TrendingUp } from "lucide-react";

export function EloChart() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [selectedPlayerIds, setSelectedPlayerIds] = useState<number[]>([]);
  const [eloHistory, setEloHistory] = useState<PlayerEloHistory[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      const playersData = await getPlayers();
      setPlayers(playersData);
      setSelectedPlayerIds(playersData.slice(0, 3).map((p) => p.id));
      setIsLoading(false);
    }
    loadData();
  }, []);

  useEffect(() => {
    async function loadHistory() {
      if (selectedPlayerIds.length === 0) {
        setEloHistory([]);
        return;
      }
      const history = await getEloHistory(selectedPlayerIds);
      setEloHistory(history);
    }
    loadHistory();
  }, [selectedPlayerIds]);

  const togglePlayer = (playerId: number) => {
    setSelectedPlayerIds((prev) =>
      prev.includes(playerId)
        ? prev.filter((id) => id !== playerId)
        : [...prev, playerId]
    );
  };

  const chartData = prepareChartData(eloHistory);

  const chartConfig: Record<string, { label: string; color: string }> = {};
  eloHistory.forEach((history) => {
    chartConfig[`player${history.playerId}`] = {
      label: history.playerName,
      color: history.playerColor,
    };
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Évolution de l'équipe
        </CardTitle>
        <CardDescription>
          Suivi de l'évolution des performances de l'équipe dans le temps
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2 sm:gap-3 pb-3 sm:pb-4 border-b">
            {players.map((player) => (
              <div
                key={player.id}
                className="flex items-center space-x-1.5 sm:space-x-2 min-h-[44px]"
              >
                <Checkbox
                  id={`player-${player.id}`}
                  checked={selectedPlayerIds.includes(player.id)}
                  onCheckedChange={() => togglePlayer(player.id)}
                  className="min-w-[20px] min-h-[20px]"
                />
                <Label
                  htmlFor={`player-${player.id}`}
                  className="flex items-center gap-1.5 sm:gap-2 cursor-pointer text-xs sm:text-sm font-normal min-h-[44px] py-1"
                >
                  <div
                    className="w-3 h-3 rounded-full shrink-0"
                    style={{ backgroundColor: player.color }}
                  />
                  <span className="truncate max-w-[120px] sm:max-w-none">
                    {player.name}
                  </span>
                </Label>
              </div>
            ))}
          </div>

          {chartData.length > 0 ? (
            <ChartContainer
              config={chartConfig}
              className="h-[250px] sm:h-[300px] md:h-[400px] w-full"
            >
              <LineChart data={chartData} width={undefined} height={undefined}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 12 }}
                  tickFormatter={(value) => {
                    const date = new Date(value);
                    return date.toLocaleDateString("fr-FR", {
                      day: "2-digit",
                      month: "2-digit",
                    });
                  }}
                />
                <YAxis tick={{ fontSize: 12 }} />
                <ChartTooltip
                  content={
                    <ChartTooltipContent
                      labelFormatter={(value) => {
                        const date = new Date(value);
                        return date.toLocaleDateString("fr-FR", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        });
                      }}
                    />
                  }
                />
                {eloHistory.map((history) => (
                  <Line
                    key={history.playerId}
                    type="monotone"
                    dataKey={`player${history.playerId}`}
                    stroke={history.playerColor}
                    strokeWidth={2}
                    dot={false}
                    name={history.playerName}
                  />
                ))}
              </LineChart>
            </ChartContainer>
          ) : (
            <div className="h-[250px] sm:h-[300px] md:h-[400px] flex items-center justify-center text-muted-foreground text-sm px-4 text-center">
              {selectedPlayerIds.length === 0
                ? "Sélectionnez au moins un joueur pour afficher le graphique"
                : "Chargement..."}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function prepareChartData(histories: PlayerEloHistory[]) {
  if (histories.length === 0) return [];

  const allDates = new Set<string>();
  histories.forEach((history) => {
    history.history.forEach((point) => {
      allDates.add(point.date);
    });
  });

  const sortedDates = Array.from(allDates).sort();

  return sortedDates.map((date) => {
    const dataPoint: Record<string, any> = { date };
    histories.forEach((history) => {
      const dateTime = new Date(date).getTime();
      let elo = history.history[0]?.elo || 1000;

      for (let i = history.history.length - 1; i >= 0; i--) {
        const point = history.history[i];
        const pointTime = new Date(point.date).getTime();
        if (pointTime <= dateTime) {
          elo = point.elo;
          break;
        }
      }

      dataPoint[`player${history.playerId}`] = elo;
    });
    return dataPoint;
  });
}
