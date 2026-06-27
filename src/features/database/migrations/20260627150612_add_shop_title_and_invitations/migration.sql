-- AlterTable
ALTER TABLE "shops" ADD COLUMN     "title" TEXT;

-- CreateTable
CREATE TABLE "shop_invitations" (
    "id" TEXT NOT NULL,
    "shopId" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "invitedById" TEXT NOT NULL,
    "displayName" TEXT,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "shop_invitations_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "shop_invitations" ADD CONSTRAINT "shop_invitations_shopId_fkey" FOREIGN KEY ("shopId") REFERENCES "shops"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shop_invitations" ADD CONSTRAINT "shop_invitations_invitedById_fkey" FOREIGN KEY ("invitedById") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
