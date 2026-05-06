-- ╔══════════════════════════════════════════════════════════════╗
-- ║  Seed Data – Generated from awards.config.ts                ║
-- ║  Run this in the Supabase SQL Editor after migration.sql    ║
-- ╚══════════════════════════════════════════════════════════════╝

-- Categories
INSERT INTO categories (id, name, type, emoji, display_order) VALUES
  ('best-dressed', 'Best Dressed', 'single', '👔', 1),
  ('most-popular', 'Most Popular', 'single', '⭐', 2),
  ('most-likely-to-succeed', 'Most Likely to Succeed', 'single', '🚀', 3),
  ('life-of-the-party', 'Life of the Party', 'single', '🎉', 4),
  ('best-couple', 'Best Couple', 'duo', '💕', 5)
ON CONFLICT (id) DO NOTHING;

-- Best Dressed Nominees
INSERT INTO nominees (id, category_id, name) VALUES
  ('bd-1', 'best-dressed', 'Adewale Johnson'),
  ('bd-2', 'best-dressed', 'Chiamaka Obi'),
  ('bd-3', 'best-dressed', 'Femi Adeleke'),
  ('bd-4', 'best-dressed', 'Zainab Mohammed'),
  ('bd-5', 'best-dressed', 'Emeka Nwosu')
ON CONFLICT (id) DO NOTHING;

-- Most Popular Nominees
INSERT INTO nominees (id, category_id, name) VALUES
  ('mp-1', 'most-popular', 'Tunde Bakare'),
  ('mp-2', 'most-popular', 'Aisha Bello'),
  ('mp-3', 'most-popular', 'Chinedu Okoro'),
  ('mp-4', 'most-popular', 'Fatima Yusuf'),
  ('mp-5', 'most-popular', 'Oluwaseun Adeola')
ON CONFLICT (id) DO NOTHING;

-- Most Likely to Succeed Nominees
INSERT INTO nominees (id, category_id, name) VALUES
  ('mls-1', 'most-likely-to-succeed', 'Nneka Eze'),
  ('mls-2', 'most-likely-to-succeed', 'Ibrahim Suleiman'),
  ('mls-3', 'most-likely-to-succeed', 'Grace Okonkwo'),
  ('mls-4', 'most-likely-to-succeed', 'Yusuf Abdullahi'),
  ('mls-5', 'most-likely-to-succeed', 'Blessing Adekunle')
ON CONFLICT (id) DO NOTHING;

-- Life of the Party Nominees
INSERT INTO nominees (id, category_id, name) VALUES
  ('lp-1', 'life-of-the-party', 'Kemi Ogundimu'),
  ('lp-2', 'life-of-the-party', 'David Okafor'),
  ('lp-3', 'life-of-the-party', 'Halima Garba'),
  ('lp-4', 'life-of-the-party', 'Samuel Adeyemi'),
  ('lp-5', 'life-of-the-party', 'Ngozi Chukwu')
ON CONFLICT (id) DO NOTHING;

-- Best Couple Nominees
INSERT INTO nominees (id, category_id, name) VALUES
  ('bc-1', 'best-couple', 'Tunde & Aisha'),
  ('bc-2', 'best-couple', 'Chinedu & Nneka'),
  ('bc-3', 'best-couple', 'Femi & Zainab'),
  ('bc-4', 'best-couple', 'David & Kemi')
ON CONFLICT (id) DO NOTHING;
