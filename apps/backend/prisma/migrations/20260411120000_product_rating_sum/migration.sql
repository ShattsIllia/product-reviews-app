-- AlterTable
ALTER TABLE "products" ADD COLUMN "ratingSum" INTEGER NOT NULL DEFAULT 0;

-- Backfill from existing reviews (keeps reviewCount / averageRating consistent with data)
UPDATE "products" p
SET
  "ratingSum" = COALESCE(s.sum_r, 0),
  "reviewCount" = COALESCE(s.cnt, 0)
FROM (
  SELECT "productId", SUM(rating)::int AS sum_r, COUNT(*)::int AS cnt
  FROM "reviews"
  GROUP BY "productId"
) s
WHERE p.id = s."productId";

UPDATE "products" p
SET "ratingSum" = 0, "reviewCount" = 0, "averageRating" = NULL
WHERE NOT EXISTS (SELECT 1 FROM "reviews" r WHERE r."productId" = p.id);

UPDATE "products"
SET "averageRating" = CASE
  WHEN "reviewCount" > 0 THEN "ratingSum"::double precision / "reviewCount"
  ELSE NULL
END;
