# Billetterie — Soirée de Gala TTCT 2026

Plateforme de présentation, vente et contrôle des billets du Gala TTCT (19 décembre 2026).

Documents de référence : [`docs/CAHIER_DES_CHARGES.md`](docs/CAHIER_DES_CHARGES.md), [`docs/DESIGN.md`](docs/DESIGN.md), [`docs/PROMPT_ULTIME.md`](docs/PROMPT_ULTIME.md).

## Stack

Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS 4 · Prisma 7 · PostgreSQL 16

## Démarrage local

Prérequis : Node.js 20+, Docker Desktop.

```bash
cp .env.example .env     # puis adapter si besoin
npm install              # génère aussi le client Prisma
npm run db:up            # démarre PostgreSQL (port 5433)
npm run dev              # http://localhost:3000
```

Vérification : <http://localhost:3000/api/health> doit répondre `{"status":"ok","database":"connected"}`.

## Scripts

| Script | Rôle |
| --- | --- |
| `npm run dev` | serveur de développement |
| `npm run build` | build de production (génère Prisma puis Next) |
| `npm run typecheck` | vérification TypeScript |
| `npm run lint` | ESLint |
| `npm run db:up` / `db:down` | démarrer / arrêter PostgreSQL local |
| `npm run db:migrate` | créer / appliquer une migration |
| `npm run db:studio` | explorer la base |

## Structure

```text
docs/                    cahier des charges, design, références visuelles
prisma/                  schéma et migrations
src/app/                 routes (public, checkout, admin, scanner, API)
src/components/          ui/ (design system) · layout/
src/features/            ticketing · checkout · scanner · dashboard
src/server/services/     payments · tickets · pdf · email
src/lib/                 env (validation), db (Prisma)
src/config/              configuration de l'événement
public/images/brand/     logo officiel TTCT
```

## Hébergement

`DATABASE_URL` est une URL PostgreSQL standard : en production, il suffit de la remplacer par celle d'un hébergeur (Neon, Supabase, Railway…) puis d'exécuter `npx prisma migrate deploy`.
