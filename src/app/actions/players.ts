"use server"

import { prisma } from "@/lib/prisma"   
import { revalidatePath } from "next/cache"

export async function getPlayers() {
    try {
        const players = await prisma.player.findMany({
            orderBy: {
                elo: "desc",
            },
            include: {
                _count: {
                    select: {
                        matchesWon: true,
                    },
                },
            },
        })
        
        return players.map(player => ({
            ...player,
            winsCount: player._count.matchesWon,
        }))
    } catch (error) {
        console.error("Error fetching players:", error)
        return []
    }
}

export async function addPlayer(formData: FormData) {
    try {
        const name = formData.get("name") as string
        const color = formData.get("color") as string || "#3b82f6"
        const isGuest = formData.get("isGuest") === "true"
        if (!name || name.trim() === "") {
            return { error: "Le nom est requis" }
        }

        await prisma.player.create({
            data: {
                name: name.trim(),
                color,
                isGuest,
                elo: 1000,
            },
        })

        revalidatePath("/")
        return { success: true }
    } catch (error) {
        console.error("Error adding player:", error)
        return { error: "Erreur lors de l'ajout du joueur" }
    }
}

