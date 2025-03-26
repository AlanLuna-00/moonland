-- DropForeignKey
ALTER TABLE "Material" DROP CONSTRAINT "Material_proveedorId_fkey";

-- AlterTable
ALTER TABLE "Material" ALTER COLUMN "proveedorId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Material" ADD CONSTRAINT "Material_proveedorId_fkey" FOREIGN KEY ("proveedorId") REFERENCES "Proveedor"("id") ON DELETE SET NULL ON UPDATE CASCADE;
