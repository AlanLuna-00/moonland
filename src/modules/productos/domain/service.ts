import { prisma } from "@/shared/infrastructure/prisma";

export class ProductoDomainService {
  static async calcularPrecioCosto(productoId: string): Promise<number> {
    const gastos = await prisma.productoGasto.findMany({
      where: { productoId },
      include: {
        gastoManual: true,
        gastoMaterial: { include: { material: true } },
      },
    });

    const total = gastos.reduce((acc, gasto) => {
      if (gasto.gastoManual) {
        acc += gasto.gastoManual.valor;
      }
      if (gasto.gastoMaterial && gasto.cantidad) {
        acc += gasto.cantidad * gasto.gastoMaterial.material.valor;
      }
      return acc;
    }, 0);

    return total;
  }
}
