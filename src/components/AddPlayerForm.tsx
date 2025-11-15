"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { addPlayer } from "@/app/actions/players";
import { Users } from "lucide-react";

export function AddPlayerForm() {
  const formRef = useRef<HTMLFormElement>(null);
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
    }

    setIsSubmitting(false);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Ajouter un joueur
        </CardTitle>
        <CardDescription>
          Créez un nouveau joueur dans le système
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nom</Label>
            <Input
              id="name"
              name="name"
              type="text"
              placeholder="Nom du joueur"
              required
              disabled={isSubmitting}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="color">Couleur</Label>
            <Input
              id="color"
              name="color"
              type="color"
              defaultValue="#3b82f6"
              className="h-10 w-full cursor-pointer"
              disabled={isSubmitting}
            />
          </div>

          <div className="flex items-center space-x-2">
            <input
              id="isGuest"
              name="isGuest"
              type="checkbox"
              value="true"
              className="h-4 w-4 rounded border-gray-300"
              disabled={isSubmitting}
            />
            <Label htmlFor="isGuest" className="cursor-pointer">
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

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Ajout en cours..." : "Ajouter le joueur"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
