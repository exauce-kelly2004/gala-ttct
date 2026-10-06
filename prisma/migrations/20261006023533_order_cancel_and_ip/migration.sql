-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "cancelledBy" TEXT,
ADD COLUMN     "clientIpHash" TEXT;

-- CreateIndex
CREATE INDEX "Order_clientIpHash_createdAt_idx" ON "Order"("clientIpHash", "createdAt");
