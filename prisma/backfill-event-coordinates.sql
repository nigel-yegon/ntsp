-- ──────────────────────────────────────────────────────────────────────
-- Backfill Event.latitude / Event.longitude
--
-- Run with:
--   psql "$DATABASE_URL" -f prisma/backfill-event-coordinates.sql
-- or paste the whole block into Prisma Studio's raw query / psql.
--
-- Safe to re-run: each row is matched by slug and only touches lat/lng.
-- ──────────────────────────────────────────────────────────────────────

BEGIN;

-- 1) Nairobi & central
UPDATE "Event" SET latitude = -1.2921, longitude = 36.8219 WHERE slug = 'mkte-2026';
UPDATE "Event" SET latitude = -1.3010, longitude = 36.7680 WHERE slug = 'nairobi-trade-fair-2026';
UPDATE "Event" SET latitude = -1.2921, longitude = 36.8219 WHERE slug = 'kenya-music-festival-2026';
UPDATE "Event" SET latitude = -1.2921, longitude = 36.8219 WHERE slug = 'koroga-festival-2026';
UPDATE "Event" SET latitude = -1.2921, longitude = 36.8219 WHERE slug = 'nairobi-restaurant-week-2026';
UPDATE "Event" SET latitude = -1.2921, longitude = 36.8219 WHERE slug = 'blankets-and-wine-2026';
UPDATE "Event" SET latitude = -1.3350, longitude = 36.7100 WHERE slug = 'kenya-open-golf-2026';

-- 2) Rift Valley
UPDATE "Event" SET latitude = -0.7167, longitude = 36.4359 WHERE slug = 'safari-rally-2026';
UPDATE "Event" SET latitude = -0.7667, longitude = 36.3667 WHERE slug = 'kijani-festival-2026';

-- 3) Maasai Mara
UPDATE "Event" SET latitude = -1.4850, longitude = 35.3720 WHERE slug = 'migration-season-2026';

-- 4) Laikipia
UPDATE "Event" SET latitude = 0.0500, longitude = 36.8000 WHERE slug = 'rhino-charge-2026';
UPDATE "Event" SET latitude = 0.1833, longitude = 37.4500 WHERE slug = 'lewa-marathon-2026';

-- 5) Samburu & north
UPDATE "Event" SET latitude = 1.0967, longitude = 36.6972 WHERE slug = 'maralal-camel-derby-2026';
UPDATE "Event" SET latitude = 2.7500, longitude = 36.7167 WHERE slug = 'turkana-festival-2026';
UPDATE "Event" SET latitude = 2.7500, longitude = 37.5000 WHERE slug = 'marathon-des-sables-2026';

-- 6) Coast
UPDATE "Event" SET latitude = -2.2717, longitude = 40.9020 WHERE slug = 'lamu-cultural-festival-2026';
UPDATE "Event" SET latitude = -4.0435, longitude = 39.6682 WHERE slug = 'mombasa-carnival-2026';
UPDATE "Event" SET latitude = -3.2192, longitude = 40.1169 WHERE slug = 'malindi-festival-2026';

-- 7) Western
UPDATE "Event" SET latitude = -0.0917, longitude = 34.7680 WHERE slug = 'kisumu-fish-festival-2026';

-- 8) Amboseli
UPDATE "Event" SET latitude = -2.6527, longitude = 37.2606 WHERE slug = 'kili-marathon-2026';

COMMIT;

-- ──────────────────────────────────────────────────────────────────────
-- Verification — run after COMMIT to confirm
-- ──────────────────────────────────────────────────────────────────────
SELECT
  slug,
  latitude,
  longitude,
  name
FROM "Event"
ORDER BY "order" ASC;