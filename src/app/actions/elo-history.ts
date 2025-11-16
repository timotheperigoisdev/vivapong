"use server";

import { prisma } from "@/lib/prisma";

export interface EloHistoryPoint {
  date: string;
  elo: number;
}

export interface PlayerEloHistory {
  playerId: number;
  playerName: string;
  playerColor: string;
  history: EloHistoryPoint[];
}

const K_FACTOR = 25;
const INITIAL_ELO = 1000;

function calculateExpectedScore(eloA: number, eloB: number): number {
  return 1 / (1 + Math.pow(10, (eloB - eloA) / 400));
}

function calculateNewElo(
  currentElo: number,
  expectedScore: number,
  actualScore: number
): number {
  return Math.round(currentElo + K_FACTOR * (actualScore - expectedScore));
}

export async function getEloHistory(
  playerIds?: number[]
): Promise<PlayerEloHistory[]> {
  try {
    const allPlayers = await prisma.player.findMany({
      where: playerIds ? { id: { in: playerIds } } : undefined,
    });

    const matches = await prisma.match.findMany({
      where: {
        OR: [{ scoreA: { gte: 11 } }, { scoreB: { gte: 11 } }],
      },
      include: {
        playerA: true,
        playerB: true,
      },
      orderBy: {
        playedAt: "asc",
      },
    });

    const playerHistories = new Map<
      number,
      { name: string; color: string; history: EloHistoryPoint[] }
    >();

    allPlayers.forEach((player) => {
      playerHistories.set(player.id, {
        name: player.name,
        color: player.color,
        history: [
          {
            date: new Date(player.createdAt).toISOString(),
            elo: INITIAL_ELO,
          },
        ],
      });
    });

    const playerElos = new Map<number, number>();
    allPlayers.forEach((player) => {
      playerElos.set(player.id, INITIAL_ELO);
    });

    matches.forEach((match) => {
      const playerA = match.playerA;
      const playerB = match.playerB;

      if (
        !playerHistories.has(playerA.id) ||
        !playerHistories.has(playerB.id)
      ) {
        return;
      }

      const eloA = playerElos.get(playerA.id) || INITIAL_ELO;
      const eloB = playerElos.get(playerB.id) || INITIAL_ELO;

      const isPlayerAWinner = match.winnerId === playerA.id;
      const expectedScoreA = calculateExpectedScore(eloA, eloB);
      const expectedScoreB = 1 - expectedScoreA;

      const actualScoreA = isPlayerAWinner ? 1 : 0;
      const actualScoreB = isPlayerAWinner ? 0 : 1;

      const newEloA = calculateNewElo(eloA, expectedScoreA, actualScoreA);
      const newEloB = calculateNewElo(eloB, expectedScoreB, actualScoreB);

      playerElos.set(playerA.id, newEloA);
      playerElos.set(playerB.id, newEloB);

      const historyA = playerHistories.get(playerA.id)!;
      const historyB = playerHistories.get(playerB.id)!;

      const matchDate = new Date(match.playedAt).toISOString();

      historyA.history.push({
        date: matchDate,
        elo: newEloA,
      });

      historyB.history.push({
        date: matchDate,
        elo: newEloB,
      });
    });

    return Array.from(playerHistories.entries()).map(([playerId, data]) => ({
      playerId,
      playerName: data.name,
      playerColor: data.color,
      history: data.history,
    }));
  } catch (error) {
    console.error("Error fetching ELO history:", error);
    return [];
  }
}

