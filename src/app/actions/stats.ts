"use server";

import { prisma } from "@/lib/prisma";

export async function getTotalMatches() {
  try {
    const count = await prisma.match.count();
    return count;
  } catch (error) {
    console.error("Error fetching total matches:", error);
    return 0;
  }
}

export async function getPlayerOfTheWeek() {
  try {
    const now = new Date();
    const dayOfWeek = now.getDay();
    
    if (dayOfWeek === 1) {
      return null;
    }

    const weekStart = new Date(now);
    const daysSinceMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
    weekStart.setDate(now.getDate() - daysSinceMonday);
    weekStart.setHours(0, 0, 0, 0);
    
    const matches = await prisma.match.findMany({
      where: {
        playedAt: {
          gte: weekStart,
        },
      },
      include: {
        winner: true,
      },
    });

    const winsByPlayer = new Map<number, { player: any; wins: number }>();
    
    matches.forEach((match) => {
      if (match.winner) {
        const current = winsByPlayer.get(match.winner.id) || {
          player: match.winner,
          wins: 0,
        };
        current.wins++;
        winsByPlayer.set(match.winner.id, current);
      }
    });

    if (winsByPlayer.size === 0) {
      return null;
    }

    const topPlayer = Array.from(winsByPlayer.values()).sort(
      (a, b) => b.wins - a.wins
    )[0];

    return topPlayer;
  } catch (error) {
    console.error("Error fetching player of the week:", error);
    return null;
  }
}

export async function getPlayerOfTheMonth() {
  try {
    const now = new Date();
    
    if (now.getDate() === 1) {
      return null;
    }

    const monthStart = new Date(now);
    monthStart.setDate(1);
    monthStart.setHours(0, 0, 0, 0);
    
    const matches = await prisma.match.findMany({
      where: {
        playedAt: {
          gte: monthStart,
        },
      },
      include: {
        winner: true,
      },
    });

    const winsByPlayer = new Map<number, { player: any; wins: number }>();
    
    matches.forEach((match) => {
      if (match.winner) {
        const current = winsByPlayer.get(match.winner.id) || {
          player: match.winner,
          wins: 0,
        };
        current.wins++;
        winsByPlayer.set(match.winner.id, current);
      }
    });

    if (winsByPlayer.size === 0) {
      return null;
    }

    const topPlayer = Array.from(winsByPlayer.values()).sort(
      (a, b) => b.wins - a.wins
    )[0];

    return topPlayer;
  } catch (error) {
    console.error("Error fetching player of the month:", error);
    return null;
  }
}

export async function getCloseEloRaces() {
  try {
    const players = await prisma.player.findMany({
      orderBy: {
        elo: "desc",
      },
    });

    if (players.length < 2) {
      return [];
    }

    const races: Array<{
      player: typeof players[0];
      ahead: typeof players[0] | null;
      gap: number;
      behind: typeof players[0] | null;
      gapBehind: number;
    }> = [];

    for (let i = 0; i < players.length; i++) {
      const player = players[i];
      const ahead = i > 0 ? players[i - 1] : null;
      const behind = i < players.length - 1 ? players[i + 1] : null;
      if (!ahead || !behind) {
        continue;
      }
      races.push({
        player,
        ahead,
        gap: ahead ? ahead.elo - player.elo : 0,
        behind,
        gapBehind: behind ? player.elo - behind.elo : 0,
      });
    }

    return races.filter(
      (race) => race.gap <= 50 || race.gapBehind <= 50
    );
  } catch (error) {
    console.error("Error fetching close ELO races:", error);
    return [];
  }
}

