import { prisma } from "@/shared/infrastructure/prisma";
import { CreateTareaDTO } from "../domain/dto";

export class TareaRepository {
  static async create(dto: CreateTareaDTO) {
    return prisma.tarea.create({
      data: {
        productoId: dto.productoId,
        cantidadPares: dto.cantidadPares,
        observaciones: dto.observaciones,
        colorId: dto.colorId,
      },
    });
  }

  static async findAllPaginated(page = 1, limit = 10) {
    const skip = (page - 1) * limit;

    const [total, data] = await Promise.all([
      prisma.tarea.count(),
      prisma.tarea.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: { actividades: true, color: true, producto: true },
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
    return prisma.tarea.findUnique({
      where: { id },
      include: {
        actividades: true,
        color: true,
        producto: true,
      },
    });
  }
}
