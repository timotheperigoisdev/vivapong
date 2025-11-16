"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { addPlayer } from "@/app/actions/players";
import { useRouter } from "next/navigation";

import { DEFAULT_COLOR_PLAYER, PRESET_COLORS_PLAYERS } from "@/app/constants";

interface AddPlayerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddPlayerDialog({ open, onOpenChange }: AddPlayerDialogProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedColor, setSelectedColor] = useState(DEFAULT_COLOR_PLAYER);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  useEffect(() => {
    if (open) {
      setSelectedColor(DEFAULT_COLOR_PLAYER);
      setShowColorPicker(false);
      setMessage(null);
    }
  }, [open]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage(null);

    const formData = new FormData(e.currentTarget);
    const result = await addPlayer(formData);
    if (result.error) {
      setMessage({ type: "error", text: result.error });
    } else {
      setMessage({ type: "success", text: "Joueur ajouté avec succès" });
      formRef.current?.reset();
      setSelectedColor(DEFAULT_COLOR_PLAYER);
      router.refresh();
      onOpenChange(false);
      setMessage(null);
    }

    setIsSubmitting(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Ajouter un joueur</DialogTitle>
          <DialogDescription>
            Créez un nouveau joueur dans le système
          </DialogDescription>
        </DialogHeader>
        <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm">
              Nom
            </Label>
            <Input
              id="name"
              name="name"
              type="text"
              placeholder="Nom du joueur"
              required
              disabled={isSubmitting}
              autoFocus
              className="h-11 sm:h-10"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="color" className="text-sm">
              Couleur
            </Label>
            <input
              id="color"
              name="color"
              type="hidden"
              value={selectedColor}
            />
            <div className="space-y-3">
              <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
                {PRESET_COLORS_PLAYERS.map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setSelectedColor(color)}
                    className={`cursor-pointer w-8 h-8 rounded-md border-2 transition-all hover:scale-110 ${
                      selectedColor === color
                        ? "border-gray-900 dark:border-gray-100 ring-2 ring-offset-2 ring-gray-900 dark:ring-gray-100"
                        : "border-gray-300 dark:border-gray-600"
                    }`}
                    style={{ backgroundColor: color }}
                    disabled={isSubmitting}
                    aria-label={`Sélectionner la couleur ${color}`}
                  />
                ))}
              </div>

              <Button
                type="button"
                variant="outline"
                onClick={() => setShowColorPicker(!showColorPicker)}
                disabled={isSubmitting}
                className="cursor-pointer w-full sm:w-auto min-h-[44px]"
              >
                {showColorPicker
                  ? "Masquer la pipette"
                  : "Choisir une autre couleur"}
              </Button>
              {showColorPicker && (
                <div className="flex items-center gap-2">
                  <Input
                    type="color"
                    value={selectedColor}
                    onChange={(e) => setSelectedColor(e.target.value)}
                    className="cursor-pointer h-11 sm:h-10 w-16 min-h-[44px]"
                    disabled={isSubmitting}
                  />
                  <Label className="text-xs text-muted-foreground whitespace-nowrap">
                    Pipette
                  </Label>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-2 min-h-[44px]">
            <input
              id="isGuest"
              name="isGuest"
              type="checkbox"
              value="true"
              className="h-5 w-5 rounded border-gray-300 dark:border-gray-600 cursor-pointer"
              disabled={isSubmitting}
            />
            <Label htmlFor="isGuest" className="cursor-pointer text-sm">
              Joueur invité
            </Label>
          </div>

          {message && (
            <div
              className={`rounded-md p-3 text-sm ${
                message.type === "success"
                  ? "bg-green-50 text-green-800 dark:bg-green-900/20 dark:text-green-400"
                  : "bg-red-50 text-red-800 dark:bg-red-900/20 dark:text-red-400"
              }`}
            >
              {message.text}
            </div>
          )}

          <DialogFooter className="flex-col sm:flex-row gap-2 sm:gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
              className="cursor-pointer w-full sm:w-auto min-h-[44px]"
            >
              Annuler
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="cursor-pointer w-full sm:w-auto min-h-[44px]"
            >
              {isSubmitting ? "Ajout en cours..." : "Ajouter le joueur"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
