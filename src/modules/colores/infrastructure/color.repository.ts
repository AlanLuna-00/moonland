import { prisma } from "@/shared/infrastructure/prisma";
import { CreateColorDTO } from "../domain/dto";

export class ColorRepository {
  static async create(dto: CreateColorDTO) {
    return prisma.color.create({ data: dto });
  }

  static async findAllPaginated(page = 1, limit = 10) {
    const skip = (page - 1) * limit;

    const [total, data] = await Promise.all([
      prisma.color.count(),
      prisma.color.findMany({
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
    return prisma.color.findUnique({ where: { id } });
  }
}
