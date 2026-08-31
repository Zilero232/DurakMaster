-- CreateTable
CREATE TABLE "ad_view" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ad_view_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ad_view_userId_createdAt_idx" ON "ad_view"("userId", "createdAt");

-- AddForeignKey
ALTER TABLE "ad_view" ADD CONSTRAINT "ad_view_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
