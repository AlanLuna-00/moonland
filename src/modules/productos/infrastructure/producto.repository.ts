import { prisma } from "@/shared/infrastructure/prisma";
import type {
  AsignarGastoMaterialDTO,
  CreateGastoManualDTO,
  CreateProductoDTO,
  GetByArticuloParams,
  ProductoDTO,
  ProductoDetailDTO,
  GastoManual,
  GastoMaterial,
} from "../domain/dto";
import { ProductoDomainService } from "../domain/service";
import { PaginatedResponse } from "@/shared/infrastructure/dto";
import { PaginationParams } from "@/shared/infrastructure/dto";

export class ProductoRepository {
  static async create(dto: CreateProductoDTO): Promise<ProductoDTO> {
    const producto = await prisma.producto.create({
      data: {
        ...dto,
        precioCosto: 0,
        precioVenta: 0,
      },
    });

    return producto;
  }

  static async findAll(
    params: PaginationParams
  ): Promise<PaginatedResponse<ProductoDTO>> {
    const { page, limit } = params;
    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
      prisma.producto.findMany({
        skip,
        take: limit,
        orderBy: {
          createdAt: "desc",
        },
        where: { deletedAt: null },
      }),
      prisma.producto.count({
        where: { deletedAt: null },
      }),
    ]);

    return {
      items,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  static async findByArticulo(
    params: GetByArticuloParams
  ): Promise<ProductoDetailDTO | null> {
    const { articulo } = params;

    const rawProducto = await prisma.producto.findFirst({
      where: {
        articulo: {
          contains: articulo,
        },
        deletedAt: null,
      },
      select: {
        id: true,
        nombre: true,
        articulo: true,
        precioVenta: true,
        precioCosto: true,
        createdAt: true,
        updatedAt: true,
        deletedAt: true,
        gastos: {
          select: {
            id: true,
            cantidad: true,
            gastoManual: {
              select: {
                id: true,
                tipo: true,
                valor: true,
              },
            },
            gastoMaterial: {
              select: {
                id: true,
                material: {
                  select: {
                    id: true,
                    nombre: true,
                    valor: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!rawProducto) return null;

    // Transformar los gastos para eliminar campos null innecesarios
    const gastosTransformados = rawProducto.gastos.map((gasto) => {
      if (gasto.gastoManual) {
        const gastoManual: GastoManual = {
          id: gasto.id,
          gastoId: gasto.gastoManual.id,
          tipo: "manual",
          tipo_gasto: gasto.gastoManual.tipo,
          valor: gasto.gastoManual.valor,
        };
        return gastoManual;
      }
      if (gasto.gastoMaterial && gasto.gastoMaterial.material) {
        const gastoMaterial: GastoMaterial = {
          id: gasto.id,
          gastoId: gasto.gastoMaterial.id,
          tipo: "material",
          cantidad: gasto.cantidad || 0,
          material: gasto.gastoMaterial.material,
        };
        return gastoMaterial;
      }
      throw new Error("Gasto inválido: no es ni manual ni material");
    });

    const producto: ProductoDetailDTO = {
      ...rawProducto,
      gastos: gastosTransformados,
    };

    return producto;
  }

  static async update(
    productoId: string,
    data: Partial<{ nombre: string; articulo: string; precioVenta: number }>
  ) {
    return prisma.producto.update({
      where: { id: productoId },
      data,
    });
  }

  static async asignarGastoManual(
    productoId: string,
    dto: CreateGastoManualDTO
  ) {
    const exists = await prisma.producto.findUnique({
      where: { id: productoId },
    });
    if (!exists) {
      throw new Error("Producto no encontrado");
    }

    const gastoManual = await prisma.gastoManual.create({ data: dto });

    await prisma.productoGasto.create({
      data: {
        productoId,
        gastoManualId: gastoManual.id,
      },
    });

    const precioCosto = await ProductoDomainService.calcularPrecioCosto(
      productoId
    );
    return prisma.producto.update({
      where: { id: productoId },
      data: { precioCosto },
    });
  }

  static async asignarGastoMaterial(
    productoId: string,
    dto: AsignarGastoMaterialDTO
  ) {
    const producto = await prisma.producto.findUnique({
      where: { id: productoId },
    });
    if (!producto) throw new Error("Producto no encontrado");

    const material = await prisma.material.findUnique({
      where: { id: dto.materialId },
    });
    if (!material) throw new Error("Material no encontrado");

    const gastoMaterial = await prisma.gastoMaterial.create({
      data: {
        materialId: dto.materialId,
      },
    });

    await prisma.productoGasto.create({
      data: {
        productoId,
        gastoMaterialId: gastoMaterial.id,
        cantidad: dto.cantidad,
      },
    });

    const precioCosto = await ProductoDomainService.calcularPrecioCosto(
      productoId
    );
    return prisma.producto.update({
      where: { id: productoId },
      data: { precioCosto },
    });
  }

  static async softDelete(productoId: string) {
    return prisma.producto.update({
      where: { id: productoId },
      data: { deletedAt: new Date() },
    });
  }

  static async updateGastoManual(
    productoId: string,
    gastoManualId: string,
    data: Partial<{ tipo: string; valor: number }>
  ) {
    const gastoManualExiste = await prisma.gastoManual.findUnique({
      where: { id: gastoManualId },
    });

    if (!gastoManualExiste) {
      throw new Error("Gasto manual no encontrado");
    }

    const productoGasto = await prisma.productoGasto.findFirst({
      where: {
        AND: [{ productoId }, { gastoManualId }],
      },
      include: {
        producto: true,
        gastoManual: true,
      },
    });

    if (!productoGasto) {
      throw new Error("Gasto manual no encontrado para este producto");
    }

    console.log("ProductoGasto encontrado:", productoGasto);

    const gastoManual = await prisma.gastoManual.update({
      where: { id: gastoManualId },
      data,
    });

    const precioCosto = await ProductoDomainService.calcularPrecioCosto(
      productoId
    );
    await prisma.producto.update({
      where: { id: productoId },
      data: { precioCosto },
    });

    return gastoManual;
  }

  static async updateGastoMaterial(
    productoId: string,
    gastoMaterialId: string,
    data: { cantidad?: number; materialId?: string }
  ) {
    const productoGasto = await prisma.productoGasto.findFirst({
      where: {
        productoId,
        gastoMaterialId,
      },
    });

    if (!productoGasto) {
      throw new Error("Gasto material no encontrado para este producto");
    }

    if (data.materialId) {
      const material = await prisma.material.findUnique({
        where: { id: data.materialId },
      });
      if (!material) throw new Error("Material no encontrado");

      await prisma.gastoMaterial.update({
        where: { id: gastoMaterialId },
        data: { materialId: data.materialId },
      });
    }

    if (data.cantidad) {
      await prisma.productoGasto.update({
        where: { id: productoGasto.id },
        data: { cantidad: data.cantidad },
      });
    }

    const precioCosto = await ProductoDomainService.calcularPrecioCosto(
      productoId
    );
    await prisma.producto.update({
      where: { id: productoId },
      data: { precioCosto },
    });

    return prisma.gastoMaterial.findUnique({
      where: { id: gastoMaterialId },
      include: { material: true },
    });
  }

  static async deleteGastoManual(productoId: string, gastoManualId: string) {
    const productoGasto = await prisma.productoGasto.findFirst({
      where: {
        productoId,
        gastoManualId,
      },
    });

    if (!productoGasto) {
      throw new Error("Gasto manual no encontrado para este producto");
    }

    await prisma.productoGasto.delete({
      where: { id: productoGasto.id },
    });

    await prisma.gastoManual.delete({
      where: { id: gastoManualId },
    });

    const precioCosto = await ProductoDomainService.calcularPrecioCosto(
      productoId
    );
    return prisma.producto.update({
      where: { id: productoId },
      data: { precioCosto },
    });
  }

  static async deleteGastoMaterial(
    productoId: string,
    gastoMaterialId: string
  ) {
    const productoGasto = await prisma.productoGasto.findFirst({
      where: {
        productoId,
        gastoMaterialId,
      },
    });

    if (!productoGasto) {
      throw new Error("Gasto material no encontrado para este producto");
    }

    await prisma.productoGasto.delete({
      where: { id: productoGasto.id },
    });

    await prisma.gastoMaterial.delete({
      where: { id: gastoMaterialId },
    });

    const precioCosto = await ProductoDomainService.calcularPrecioCosto(
      productoId
    );
    return prisma.producto.update({
      where: { id: productoId },
      data: { precioCosto },
    });
  }
}
