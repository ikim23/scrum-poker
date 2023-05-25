-- CreateTable
CREATE TABLE "Room" (
    "roomId" VARCHAR(21) NOT NULL,
    "ownerId" VARCHAR(64) NOT NULL,
    "name" VARCHAR(64) NOT NULL,
    "connectedUsers" TEXT[],
    "votes" JSONB NOT NULL,
    "result" DOUBLE PRECISION,

    CONSTRAINT "Room_pkey" PRIMARY KEY ("roomId")
);

-- CreateIndex
CREATE INDEX "Room_ownerId_idx" ON "Room"("ownerId");
