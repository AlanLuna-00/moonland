import { prisma } from "@/shared/infrastructure/prisma";
import { CreateMaterialDTO, UpdateMaterialDTO } from "../domain/dto";
import { ProductoDomainService } from "@/modules/productos/domain/service";

export class MaterialRepository {
  static async create(dto: CreateMaterialDTO) {
    return prisma.material.create({ data: dto });
  }

  static async findAllPaginated(page = 1, limit = 10) {
    const skip = (page - 1) * limit;

    const [total, data] = await Promise.all([
      prisma.material.count(),
      prisma.material.findMany({
        skip,
        take: limit,
        include: { proveedor: true },
        orderBy: { nombre: "asc" },
      }),
    ]);

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  static async findById(id: string) {
    return prisma.material.findUnique({
      where: { id },
      include: { proveedor: true },
    });
  }

  static async update(id: string, dto: UpdateMaterialDTO) {
    // Primero actualizamos el material
    const materialActualizado = await prisma.material.update({
      where: { id },
      data: dto,
    });

    // Si se actualizó el valor del material, necesitamos recalcular los costos
    if (dto.valor !== undefined) {
      // Encontramos todos los productos que usan este material
      const productosConEsteMaterial = await prisma.productoGasto.findMany({
        where: {
          gastoMaterial: {
            materialId: id,
          },
        },
        select: {
          productoId: true,
        },
        distinct: ["productoId"],
      });

      // Importamos el servicio de dominio de Producto

      // Recalculamos el costo para cada producto
      for (const { productoId } of productosConEsteMaterial) {
        const nuevoPrecioCosto =
          await ProductoDomainService.calcularPrecioCosto(productoId);
        await prisma.producto.update({
          where: { id: productoId },
          data: { precioCosto: nuevoPrecioCosto },
        });
      }
    }

    return materialActualizado;
  }

  static async delete(id: string) {
    return prisma.material.delete({ where: { id } });
  }
}
