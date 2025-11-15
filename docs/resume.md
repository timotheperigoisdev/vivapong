# Pong Tracker - Résumé pour Cursor

## Objectif du projet

Créer une application simple pour suivre les matchs de ping-pong de l'équipe, enregistrer les résultats, suivre les performances et générer des statistiques.

## Fonctionnalités principales

* Ajouter/consulter les joueurs et leurs couleurs.
* Ajouter des joueurs invités.
* Ajouter un match avec deux joueurs et le score (11 points).
* Calculer automatiquement le gagnant.
* Suivre les performances avec un score ELO dynamique.
* Voir les meilleurs joueurs : global et par semaine.
* Historique des matchs pour un joueur (mois/année).
* Visualisation simple de l'évolution d'un joueur (ELO ou winrate).
* Bonus : génération d’un match aléatoire, suivi des séries de victoires.

## Modèle de données

* **Player** : id, name, color, isGuest, elo, createdAt
* **Match** : id, playerAId, playerBId, scoreA, scoreB, winnerId, playedAt

## Calcul ELO

* Basé sur la formule standard : `newElo = currentElo + K * (scoreRéel - scoreAttendu)`
* K = 25 recommandé pour ping-pong.
* Score attendu calculé selon la différence des ELO des joueurs.

## Relations

* Un joueur peut apparaître dans plusieurs matchs en tant que playerA, playerB ou winner.
* Les matchs pointent vers Player pour identifier les participants et le gagnant.
