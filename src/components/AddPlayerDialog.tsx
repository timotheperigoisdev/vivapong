"use client";

import { useState, useRef } from "react";
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

interface AddPlayerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddPlayerDialog({ open, onOpenChange }: AddPlayerDialogProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

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
      router.refresh();
      setTimeout(() => {
        onOpenChange(false);
        setMessage(null);
      }, 1000);
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
            <Input
              id="color"
              name="color"
              type="color"
              defaultValue="#3b82f6"
              className="h-11 sm:h-10 w-full cursor-pointer min-h-[44px]"
              disabled={isSubmitting}
            />
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

          <DialogFooter className="flex-col sm:flex-row gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
              className="w-full sm:w-auto min-h-[44px]"
            >
              Annuler
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-auto min-h-[44px]"
            >
              {isSubmitting ? "Ajout en cours..." : "Ajouter le joueur"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
