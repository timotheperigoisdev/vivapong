import { Player } from "./player.types";

export interface Match {
  id: number;
  playerAId: number;
  playerBId: number;
  scoreA: number;
  scoreB: number;
  winnerId: number;
  playedAt: Date | string;
  playerA: Player;
  playerB: Player;
  winner?: Player | null;
}

