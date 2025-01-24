-- CreateTable
CREATE TABLE "Federation" (
    "id" SERIAL NOT NULL,
    "provider" TEXT NOT NULL,
    "providerRef" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Federation_pkey" PRIMARY KEY ("id")
);
