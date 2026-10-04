#!/usr/bin/env node
/**
 * Pulls the latest data from the community rewards sheet and regenerates
 * src/data/generated/sheet.json.
 *
 *   npm run sync-sheet
 *
 * The sheet must stay viewable by "anyone with the link". Only the tabs the
 * site uses are downloaded; the raw CSVs are committed under data/sheet/ so
 * every data change shows up as a reviewable diff.
 */
import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';

const SHEET_ID = '1YQpWt8iOK6yO5_7r3rvZZKkoRy8Z0aEAPHy11gYZZQ8';
const TABS = {
  raid_info: 582062442, // Raid Info
  raid_extra_loot: 406235636, // Raid extra loot
  daily_chaos: 1683919985, // Daily Chaos
  guardian_raids: 1128103026, // Guardian Raids
  f4_shop: 1149031466, // F4 Shop
  maris_shop: 1101972055, // Mari's Shop
  market_prices: 632033385, // Market prices
};

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const outDir = join(root, 'data', 'sheet');
mkdirSync(outDir, { recursive: true });

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function download(name, gid) {
  // The /export endpoint returns raw cell values (gviz drops mixed-type cells).
  const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/export?format=csv&gid=${gid}`;
  for (let attempt = 1; attempt <= 5; attempt++) {
    const res = await fetch(url, { redirect: 'follow' });
    if (res.ok) {
      const body = (await res.text()).replace(/\r\n/g, '\n');
      if (body.trimStart().startsWith('<')) throw new Error(`${name}: got HTML instead of CSV — is the sheet still shared publicly?`);
      writeFileSync(join(outDir, `${name}.csv`), body);
      console.log(`  ✓ ${name} (${body.length.toLocaleString()} bytes)`);
      return;
    }
    if (res.status === 429 || res.status >= 500) {
      const wait = attempt * 3000;
      console.log(`  … ${name}: HTTP ${res.status}, retrying in ${wait / 1000}s`);
      await sleep(wait);
      continue;
    }
    throw new Error(`${name}: HTTP ${res.status}`);
  }
  throw new Error(`${name}: gave up after 5 attempts`);
}

console.log('Downloading sheet tabs…');
for (const [name, gid] of Object.entries(TABS)) {
  await download(name, gid);
  await sleep(1500); // stay under Google's export rate limit
}

console.log('Building site data…');
execFileSync(process.execPath, [join(root, 'scripts', 'build-data.mjs')], { stdio: 'inherit' });
