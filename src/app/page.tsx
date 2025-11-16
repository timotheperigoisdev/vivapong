import { PlayersList } from "@/components/PlayersList";
import { getPlayers } from "@/app/actions/players";
import { ThemeToggleWrapper } from "@/components/ThemeToggleWrapper";
import { StatsCard } from "@/components/StatsCard";
import { EloChart } from "@/components/EloChart";
import { EloInfoBox } from "@/components/EloInfoBox";
import { MatchFormOrTracker } from "@/components/MatchFormOrTracker";

export default async function Home() {
  const players = await getPlayers();
  const playersCount = players.length;

  return (
    <div className="min-h-screen bg-background">
      <div className="container relative mx-auto px-3 sm:px-4 py-4 sm:py-6 md:py-8 lg:py-12 max-w-7xl">
        <div className="absolute top-10 right-0 flex justify-end mb-3 sm:mb-4">
          <ThemeToggleWrapper />
        </div>
        <div className="mb-6 sm:mb-8 md:mb-12 text-center">
          <h1 className="font-prompt text-3xl sm:text-4xl md:text-5xl text-shadow-md font-bold tracking-tight mb-2 sm:mb-3 md:mb-4 from-primary to-accent">
            <span className="text-black dark:text-foreground">Viva</span>
            <span className="text-[#00aeef]">Pong</span>
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-muted-foreground max-w-2xl mx-auto px-2">
            Application de suivi des matchs de ping-pong et suivis des
            performances de l'équipe VivaWeb
          </p>
        </div>

        <div className="grid gap-4 sm:gap-5 md:gap-6 grid-cols-1 md:grid-cols-3 mb-6 sm:mb-8">
          <div className="md:col-span-2">
            <StatsCard playersCount={playersCount} />
          </div>
          <MatchFormOrTracker />
        </div>
        <div className="mb-6 sm:mb-8">
          <EloInfoBox />
        </div>
        <div className="mb-6 sm:mb-8">
          <EloChart />
        </div>

        <div className="mt-6 sm:mt-8">
          <PlayersList />
        </div>
      </div>
    </div>
  );
}
