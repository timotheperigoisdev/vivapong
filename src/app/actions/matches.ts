"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

const K_FACTOR = 25

function calculateExpectedScore(eloA: number, eloB: number): number {
  return 1 / (1 + Math.pow(10, (eloB - eloA) / 400))
}

function calculateNewElo(currentElo: number, expectedScore: number, actualScore: number): number {
  return Math.round(currentElo + K_FACTOR * (actualScore - expectedScore))
}

export async function getPlayers() {
  try {
    const players = await prisma.player.findMany({
      orderBy: {
        name: "asc",
      },
    })
    return players
  } catch (error) {
    console.error("Error fetching players:", error)
    return []
  }
}

export async function getCurrentMatch() {
  try {
    const match = await prisma.match.findFirst({
      where: {
        AND: [
          { scoreA: { lt: 11 } },
          { scoreB: { lt: 11 } },
        ],
      },
      include: {
        playerA: true,
        playerB: true,
        winner: true,
      },
      orderBy: {
        playedAt: "desc",
      },
    })
    return match
  } catch (error) {
    console.error("Error fetching current match:", error)
    return null
  }
}

export async function createMatch(formData: FormData) {
  try {
    const playerAId = parseInt(formData.get("playerAId") as string)
    const playerBId = parseInt(formData.get("playerBId") as string)

    if (!playerAId || !playerBId) {
      return { error: "Les deux joueurs sont requis" }
    }

    if (playerAId === playerBId) {
      return { error: "Un joueur ne peut pas jouer contre lui-même" }
    }

    const existingMatch = await getCurrentMatch()
    if (existingMatch) {
      return { error: "Un match est déjà en cours" }
    }

    const playerA = await prisma.player.findUnique({ where: { id: playerAId } })
    const playerB = await prisma.player.findUnique({ where: { id: playerBId } })

    if (!playerA || !playerB) {
      return { error: "Joueur introuvable" }
    }

    const match = await prisma.match.create({
      data: {
        playerAId,
        playerBId,
        scoreA: 0,
        scoreB: 0,
        winnerId: playerAId,
      },
      include: {
        playerA: true,
        playerB: true,
      },
    })

    revalidatePath("/")
    return { success: true, match }
  } catch (error) {
    console.error("Error creating match:", error)
    return { error: "Erreur lors de la création du match" }
  }
}

export async function createMatchWithScore(formData: FormData) {
  try {
    const playerAId = parseInt(formData.get("playerAId") as string)
    const playerBId = parseInt(formData.get("playerBId") as string)
    const scoreA = parseInt(formData.get("scoreA") as string)
    const scoreB = parseInt(formData.get("scoreB") as string)

    if (!playerAId || !playerBId) {
      return { error: "Les deux joueurs sont requis" }
    }

    if (playerAId === playerBId) {
      return { error: "Un joueur ne peut pas jouer contre lui-même" }
    }

    if (isNaN(scoreA) || isNaN(scoreB)) {
      return { error: "Les scores sont requis" }
    }

    if (scoreA < 0 || scoreB < 0) {
      return { error: "Les scores ne peuvent pas être négatifs" }
    }

    if (scoreA > 11 || scoreB > 11) {
      return { error: "Le score maximum est 11" }
    }

    if (scoreA < 11 && scoreB < 11) {
      return { error: "Au moins un joueur doit avoir 11 points pour terminer le match" }
    }

    if (scoreA === 11 && scoreB === 11) {
      return { error: "Les deux joueurs ne peuvent pas avoir 11 points" }
    }

    const playerA = await prisma.player.findUnique({ where: { id: playerAId } })
    const playerB = await prisma.player.findUnique({ where: { id: playerBId } })

    if (!playerA || !playerB) {
      return { error: "Joueur introuvable" }
    }

    const winnerId = scoreA >= 11 ? playerAId : playerBId

    const match = await prisma.match.create({
      data: {
        playerAId,
        playerBId,
        scoreA,
        scoreB,
        winnerId,
      },
      include: {
        playerA: true,
        playerB: true,
      },
    })

    await finishMatch(match.id, winnerId)

    revalidatePath("/")
    return { success: true, match }
  } catch (error) {
    console.error("Error creating match with score:", error)
    return { error: "Erreur lors de l'enregistrement du match" }
  }
}

export async function updateMatchScore(matchId: number, scoreA: number, scoreB: number) {
  try {
    if (scoreA < 0 || scoreB < 0) {
      return { error: "Les scores ne peuvent pas être négatifs" }
    }

    if (scoreA > 11 || scoreB > 11) {
      return { error: "Le score maximum est 11" }
    }

    const match = await prisma.match.findUnique({
      where: { id: matchId },
      include: {
        playerA: true,
        playerB: true,
      },
    })

    if (!match) {
      return { error: "Match introuvable" }
    }

    if (match.scoreA >= 11 || match.scoreB >= 11) {
      return { error: "Ce match est déjà terminé" }
    }

    const updatedMatch = await prisma.match.update({
      where: { id: matchId },
      data: {
        scoreA,
        scoreB,
        winnerId: scoreA >= 11 ? match.playerAId : match.playerBId,
      },
      include: {
        playerA: true,
        playerB: true,
      },
    })

    if (scoreA >= 11 || scoreB >= 11) {
      await finishMatch(matchId, updatedMatch.winnerId)
    }

    revalidatePath("/")
    return { success: true, match: updatedMatch }
  } catch (error) {
    console.error("Error updating match score:", error)
    return { error: "Erreur lors de la mise à jour du score" }
  }
}

export async function finishMatch(matchId: number, winnerId: number) {
  try {
    const match = await prisma.match.findUnique({
      where: { id: matchId },
      include: {
        playerA: true,
        playerB: true,
      },
    })

    if (!match) {
      return { error: "Match introuvable" }
    }

    if (match.scoreA < 11 && match.scoreB < 11) {
      return { error: "Le match n'est pas encore terminé" }
    }

    const playerA = match.playerA
    const playerB = match.playerB

    const isPlayerAWinner = winnerId === playerA.id
    const expectedScoreA = calculateExpectedScore(playerA.elo, playerB.elo)
    const expectedScoreB = 1 - expectedScoreA

    const actualScoreA = isPlayerAWinner ? 1 : 0
    const actualScoreB = isPlayerAWinner ? 0 : 1

    const newEloA = calculateNewElo(playerA.elo, expectedScoreA, actualScoreA)
    const newEloB = calculateNewElo(playerB.elo, expectedScoreB, actualScoreB)

    await prisma.$transaction([
      prisma.match.update({
        where: { id: matchId },
        data: { winnerId },
      }),
      prisma.player.update({
        where: { id: playerA.id },
        data: { elo: newEloA },
      }),
      prisma.player.update({
        where: { id: playerB.id },
        data: { elo: newEloB },
      }),
    ])

    revalidatePath("/")
    return { success: true }
  } catch (error) {
    console.error("Error finishing match:", error)
    return { error: "Erreur lors de la finalisation du match" }
  }
}

