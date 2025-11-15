export interface Player {
  id: number;
  name: string;
  color: string;
  isGuest: boolean;
  elo: number;
  createdAt: Date | string;
}

