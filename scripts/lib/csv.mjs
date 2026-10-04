// Minimal RFC-4180 CSV parser (handles quoted fields, escaped quotes and newlines in cells).
export function parseCsv(text) {
  const rows = [];
  let row = [];
  let field = '';
  let inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inQuotes) {
      if (c === '"') {
        if (text[i + 1] === '"') {
          field += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        field += c;
      }
    } else if (c === '"') {
      inQuotes = true;
    } else if (c === ',') {
      row.push(field);
      field = '';
    } else if (c === '\n' || c === '\r') {
      if (c === '\r' && text[i + 1] === '\n') i++;
      row.push(field);
      rows.push(row);
      row = [];
      field = '';
    } else {
      field += c;
    }
  }
  if (field !== '' || row.length) {
    row.push(field);
    rows.push(row);
  }
  return rows.map((r) => r.map((cell) => cell.trim()));
}

/** "2,447" -> 2447, "457%" -> 457, "" / "-" -> null. Non-numeric text returns null. */
export function num(value) {
  if (value === undefined || value === null) return null;
  const cleaned = String(value).replace(/[,$%\s]/g, '');
  if (cleaned === '' || cleaned === '-') return null;
  const n = Number(cleaned);
  return Number.isFinite(n) ? n : null;
}

/** Keeps non-empty text (ranges like "11-12", "1m"), otherwise null. */
export function text(value) {
  if (value === undefined || value === null) return null;
  const t = String(value).replace(/\s+/g, ' ').trim();
  return t === '' ? null : t;
}
