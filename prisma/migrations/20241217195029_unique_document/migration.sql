/*
  Warnings:

  - A unique constraint covering the columns `[document]` on the table `farmers` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "farmers_document_key" ON "farmers"("document");
