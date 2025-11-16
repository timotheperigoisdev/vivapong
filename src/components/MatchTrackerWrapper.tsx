import { getCurrentMatch } from "@/app/actions/matches";
import { MatchTracker } from "./MatchTracker";

export async function MatchTrackerWrapper() {
  const match = await getCurrentMatch();

  if (!match) {
    return null;
  }

  return <MatchTracker />;
}
