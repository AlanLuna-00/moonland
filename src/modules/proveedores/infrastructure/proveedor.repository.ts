import { prisma } from "@/shared/infrastructure/prisma";
import { CreateProveedorDTO, UpdateProveedorDTO } from "../domain/dto";

export class ProveedorRepository {
  static async create(dto: CreateProveedorDTO) {
    return prisma.proveedor.create({ data: dto });
  }

  static async findAllPaginated(page = 1, limit = 10) {
    const skip = (page - 1) * limit;

    const [total, data] = await Promise.all([
      prisma.proveedor.count(),
      prisma.proveedor.findMany({
        skip,
        take: limit,
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
    return prisma.proveedor.findUnique({ where: { id } });
  }

  static async update(id: string, dto: UpdateProveedorDTO) {
    return prisma.proveedor.update({ where: { id }, data: dto });
  }

  static async delete(id: string) {
    return prisma.proveedor.delete({ where: { id } });
  }
}
