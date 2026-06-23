/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `api` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[apiKey]` on the table `api` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "api_name_key" ON "api"("name");

-- CreateIndex
CREATE UNIQUE INDEX "api_apiKey_key" ON "api"("apiKey");
