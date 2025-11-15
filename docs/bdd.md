# Pong Tracker - Modèle Logique de Données (MLD)

## Entité : Player

| Champ     | Type         | Description                     |
| --------- | ------------ | ------------------------------- |
| id        | INT (PK)     | Identifiant unique du joueur    |
| name      | STRING       | Nom du joueur                   |
| color     | STRING (HEX) | Couleur associée au joueur      |
| isGuest   | BOOLEAN      | Indique si le joueur est invité |
| elo       | INT          | Score ELO du joueur             |
| createdAt | DATETIME     | Date d'inscription              |

## Entité : Match

| Champ     | Type                 | Description                 |
| --------- | -------------------- | --------------------------- |
| id        | INT (PK)             | Identifiant unique du match |
| playerAId | INT (FK → Player.id) | Joueur A                    |
| playerBId | INT (FK → Player.id) | Joueur B                    |
| scoreA    | INT                  | Score du joueur A           |
| scoreB    | INT                  | Score du joueur B           |
| winnerId  | INT (FK → Player.id) | Gagnant du match            |
| playedAt  | DATETIME             | Date du match               |

## Relations

* Un joueur peut apparaître dans plusieurs matchs en tant que playerA, playerB ou winner.
* Les clés étrangères playerAId, playerBId et winnerId pointent vers Player.id.

## Vue calculée suggérée

* WeeklyRanking : générée en filtrant les matchs par semaine, compter les victoires par joueur et trier décroissant.
