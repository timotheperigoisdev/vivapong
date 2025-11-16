"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Info, TrendingUp, Calculator, Target } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export function EloInfoBox() {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <Card className="border-primary/20 bg-primary/5">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Info className="h-5 w-5 text-primary" />
            <CardTitle className="text-lg">
              Qu'est-ce que le système ELO ?
            </CardTitle>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="cursor-pointer min-h-[44px] text-xs sm:text-sm"
            aria-label={isExpanded ? "Réduire" : "Développer"}
          >
            {isExpanded ? "Masquer" : "En savoir plus"}
          </Button>
        </div>
        <CardDescription className="text-sm">
          Comprendre comment votre classement est calculé
        </CardDescription>
      </CardHeader>
      {isExpanded && (
        <CardContent className="space-y-4 pt-0">
          <div className="space-y-3 text-sm">
            <div className="flex gap-3">
              <Target className="h-5 w-5 text-primary shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold mb-1">Le principe</p>
                <p className="text-muted-foreground">
                  Le système ELO mesure votre niveau de jeu. Plus votre score
                  est élevé, plus vous êtes fort. Chaque joueur commence avec{" "}
                  <strong className="text-foreground">1000 points</strong>.
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <TrendingUp className="h-5 w-5 text-primary shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold mb-1">Évolution après un match</p>
                <p className="text-muted-foreground">
                  Votre ELO change après chaque match selon le résultat :
                </p>
                <ul className="list-disc list-inside mt-2 space-y-1 text-muted-foreground ml-2">
                  <li>
                    Gagner contre un joueur plus fort ={" "}
                    <strong className="text-foreground">
                      + beaucoup de points
                    </strong>
                  </li>
                  <li>
                    Gagner contre un joueur plus faible ={" "}
                    <strong className="text-foreground">+ peu de points</strong>
                  </li>
                  <li>
                    Perdre contre un joueur plus fort ={" "}
                    <strong className="text-foreground">- peu de points</strong>
                  </li>
                  <li>
                    Perdre contre un joueur plus faible ={" "}
                    <strong className="text-foreground">
                      - beaucoup de points
                    </strong>
                  </li>
                </ul>
              </div>
            </div>

            <div className="flex gap-3">
              <Calculator className="h-5 w-5 text-primary shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold mb-1">Le calcul</p>
                <p className="text-muted-foreground mb-2">
                  Le système calcule d'abord votre probabilité de gagner, puis
                  ajuste votre ELO :
                </p>
                <div className="bg-muted/50 rounded-md p-3 text-xs space-y-1 font-mono">
                  <p className="text-muted-foreground">
                    Nouveau ELO = ELO actuel + 25 × (Résultat réel - Probabilité
                    attendue)
                  </p>
                  <p className="text-muted-foreground text-[10px] mt-2">
                    Exemple : Si vous avez 50% de chance de gagner et que vous
                    gagnez, vous gagnez environ 12-13 points.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  );
}
