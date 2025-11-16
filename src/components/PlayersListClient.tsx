"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { AddPlayerDialog } from "./AddPlayerDialog";

export function PlayersListClient() {
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <>
      <Button
        onClick={() => setDialogOpen(true)}
        size="sm"
        className="min-h-[44px] text-xs sm:text-sm"
      >
        <Plus className="h-4 w-4" />
        <span className="hidden sm:inline">Ajouter un joueur</span>
        <span className="sm:hidden">Ajouter</span>
      </Button>
      <AddPlayerDialog open={dialogOpen} onOpenChange={setDialogOpen} />
    </>
  );
}
