# Lost Mokokos

Lost Ark raid rewards, weekly gold planning, daily content loot, market prices and F4 shop value — built from the community
[Raids, Dungeons and Guardians Rewards](https://docs.google.com/spreadsheets/d/1YQpWt8iOK6yO5_7r3rvZZKkoRy8Z0aEAPHy11gYZZQ8) sheet (by Tylobic).

## Requirements

- Node.js **24 LTS** (`nvm use` picks it up from `.nvmrc`)
- npm

## Develop

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # production build
npm run lint
npm run typecheck
```

## Updating the data

All site data comes from seven tabs of the sheet: Raid Info, Raid extra loot, Daily Chaos, Guardian Raids, Market prices,
Mari's Shop and F4 Shop.

```bash
npm run sync-sheet   # downloads the tabs to data/sheet/*.csv and regenerates src/data/generated/sheet.json
npm run data         # only regenerates the JSON from the CSVs already in data/sheet/
```

Commit both the CSVs and the generated JSON — the CSV diff makes every data change easy to review.
`scripts/build-data.mjs` checks the sheet's column headers and fails loudly if the layout changes.

## Structure

| Path | What |
| --- | --- |
| `src/pages/` | Home, Raids (`/raids`, `/raids/[slug]`), Gold, Roster (`/characters`), Daily, Market, F4 Shop |
| `src/components/` | Layout and shared UI |
| `src/data/sheet.ts` | Typed access to the generated sheet data + helpers (best raids for an item level, …) |
| `src/data/rewards.ts` | Labels and icons for every reward type |
| `public/icons/` | Item icons |
| `scripts/` | Sheet sync + CSV → JSON build |

Old URLs (`/compare`, `/gold-calculator`, `/raids/aegir-hard`, `/raids/voldis`, …) redirect to their new homes (see `next.config.mjs`).
