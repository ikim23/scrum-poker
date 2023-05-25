-- CreateTable
CREATE TABLE "Room" (
    "roomId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "ownerId" TEXT NOT NULL,
    "users" TEXT[],
    "votes" JSONB NOT NULL,
    "result" INTEGER,

    CONSTRAINT "Room_pkey" PRIMARY KEY ("roomId")
);

-- CreateIndex
CREATE INDEX "Room_ownerId_idx" ON "Room"("ownerId");
