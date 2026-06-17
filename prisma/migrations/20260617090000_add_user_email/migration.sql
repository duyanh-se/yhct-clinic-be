-- Add required email column to User and backfill existing rows.
ALTER TABLE "User" ADD COLUMN "email" TEXT;

UPDATE "User"
SET "email" = COALESCE(
  "phone_number",
  'user-' || "id" || '@yhct.local'
)
WHERE "email" IS NULL;

ALTER TABLE "User" ALTER COLUMN "email" SET NOT NULL;

CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
