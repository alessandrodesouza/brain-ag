-- CreateTable
CREATE TABLE "farmers" (
    "id" TEXT NOT NULL,
    "document" VARCHAR(14) NOT NULL,
    "name" VARCHAR(250) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "farmers_pkey" PRIMARY KEY ("id")
);
