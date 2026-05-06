import { awardsConfig } from '../src/lib/awards.config';
import fs from 'fs';
import path from 'path';

const seedFile = path.resolve(__dirname, '../supabase/seed.sql');

let sql = `-- ╔══════════════════════════════════════════════════════════════╗\n`;
sql += `-- ║  Seed Data – Generated from awards.config.ts                ║\n`;
sql += `-- ║  Run this in the Supabase SQL Editor after migration.sql    ║\n`;
sql += `-- ╚══════════════════════════════════════════════════════════════╝\n\n`;

sql += `-- Categories\n`;
sql += `INSERT INTO categories (id, name, type, emoji, display_order) VALUES\n`;
const categoryLines = awardsConfig.map((cat) => {
  return `  ('${cat.id}', '${cat.name.replace(/'/g, "''")}', '${cat.type}', '${cat.emoji}', ${cat.displayOrder})`;
});
sql += categoryLines.join(',\n');
sql += `\nON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, type = EXCLUDED.type, emoji = EXCLUDED.emoji, display_order = EXCLUDED.display_order;\n\n`;

sql += `-- Nominees\n`;
sql += `INSERT INTO nominees (id, category_id, name) VALUES\n`;

const nomineeLines: string[] = [];
awardsConfig.forEach((cat) => {
  cat.nominees.forEach((nom) => {
    nomineeLines.push(`  ('${nom.id}', '${cat.id}', '${nom.name.replace(/'/g, "''")}')`);
  });
});
sql += nomineeLines.join(',\n');
sql += `\nON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, category_id = EXCLUDED.category_id;\n`;

fs.writeFileSync(seedFile, sql);
console.log('Successfully generated seed.sql');
