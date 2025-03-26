/*
  Warnings:

  - You are about to drop the `ItemTarea` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "EstadoTarea" AS ENUM ('PENDIENTE', 'EN_PRODUCCION', 'COMPLETADA', 'CANCELADA');

-- DropForeignKey
ALTER TABLE "ItemTarea" DROP CONSTRAINT "ItemTarea_tareaId_fkey";

-- AlterTable
ALTER TABLE "Tarea" ADD COLUMN     "colorId" TEXT,
ADD COLUMN     "estado" "EstadoTarea" NOT NULL DEFAULT 'PENDIENTE';

-- DropTable
DROP TABLE "ItemTarea";

-- CreateTable
CREATE TABLE "Color" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,

    CONSTRAINT "Color_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Color_nombre_key" ON "Color"("nombre");

-- AddForeignKey
ALTER TABLE "Tarea" ADD CONSTRAINT "Tarea_colorId_fkey" FOREIGN KEY ("colorId") REFERENCES "Color"("id") ON DELETE SET NULL ON UPDATE CASCADE;
