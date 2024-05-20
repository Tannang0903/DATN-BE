/*
  Warnings:

  - You are about to drop the `RefreshToken` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "RefreshToken" DROP CONSTRAINT "fk_verification_token_user";

-- DropTable
DROP TABLE "RefreshToken";

-- CreateTable
CREATE TABLE "VerificationToken" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "token" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expires_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "pk_verification_token" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "VerificationToken" ADD CONSTRAINT "fk_verification_token_user" FOREIGN KEY ("user_id") REFERENCES "IdentityUser"("id") ON DELETE CASCADE ON UPDATE CASCADE;
