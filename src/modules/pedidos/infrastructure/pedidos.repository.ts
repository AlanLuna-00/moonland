import { prisma } from "@/shared/infrastructure/prisma";
import {
  CreatePedidoDTO,
  EstadoPedido,
  UpdateItemPedidoDTO,
  UpdatePedidoDTO,
} from "../domain/dto";

export class PedidoRepository {
  static async create(dto: CreatePedidoDTO) {
    const productos = await prisma.producto.findMany({
      where: {
        id: { in: dto.items.map((item) => item.productoId) },
      },
    });

    let total = 0;
    const itemsData = dto.items.map((item) => {
      const producto = productos.find((p) => p.id === item.productoId);
      if (!producto)
        throw new Error(`Producto no encontrado: ${item.productoId}`);

      const subtotal = producto.precioVenta * item.cantidad;
      total += subtotal;

      // TODO: Descontar del inventario cuando el módulo esté listo
      if (item.descontarStock) {
        // TODO: descontarStock(producto.id, item.cantidad)
      }

      return {
        productoId: item.productoId,
        cantidad: item.cantidad,
        descontarStock: item.descontarStock,
      };
    });

    return prisma.pedido.create({
      data: {
        clienteId: dto.clienteId,
        valorTotal: total,
        estado: EstadoPedido.PENDIENTE,
        items: { create: itemsData },
      },
      include: {
        items: true,
      },
    });
  }

  static async findAllPaginated(page = 1, limit = 10) {
    const skip = (page - 1) * limit;

    const [total, data] = await Promise.all([
      prisma.pedido.count(),
      prisma.pedido.findMany({
        skip,
        take: limit,
        include: { items: true },
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
    return prisma.pedido.findUnique({
      where: { id },
      include: {
        items: true,
      },
    });
  }

  static async update(id: string, dto: UpdatePedidoDTO) {
    // Si el pedido se está cancelando, debemos devolver el stock
    if (dto.estado === EstadoPedido.CANCELADO) {
      const pedido = await prisma.pedido.findUnique({
        where: { id },
        include: {
          items: true,
        },
      });

      if (pedido) {
        // TODO: Devolver stock de cada item cuando el módulo de inventario esté listo
        // pedido.items.forEach(item => {
        //   if (item.descontarStock) {
        //     devolverStock(item.productoId, item.cantidad)
        //   }
        // });
      }
    }

    return prisma.pedido.update({
      where: { id },
      data: {
        clienteId: dto.clienteId,
        valorTotal: dto.valorTotal,
        estado: dto.estado,
      },
    });
  }

  static async updateItem(
    id: string,
    itemId: string,
    dto: UpdateItemPedidoDTO
  ) {
    // Primero actualizamos el item
    await prisma.itemPedido.update({
      where: { id: itemId },
      data: dto,
    });

    // Luego recalculamos y actualizamos el valor total
    const nuevoTotal = await PedidoRepository.recalcularValorTotal(id);

    return prisma.pedido.update({
      where: { id },
      data: {
        valorTotal: nuevoTotal,
      },
      include: {
        items: true,
      },
    });
  }

  private static async recalcularValorTotal(pedidoId: string): Promise<number> {
    const pedido = await prisma.pedido.findUnique({
      where: { id: pedidoId },
      include: {
        items: {
          include: {
            producto: true,
          },
        },
      },
    });

    if (!pedido) throw new Error("Pedido no encontrado");

    const valorTotal = pedido.items.reduce((total, item) => {
      return total + item.producto.precioVenta * item.cantidad;
    }, 0);

    return valorTotal;
  }

  static async delete(id: string) {
    // Antes de eliminar el pedido, debemos devolver el stock si corresponde
    const pedido = await prisma.pedido.findUnique({
      where: { id },
      include: {
        items: true,
      },
    });

    if (pedido) {
      // TODO: Devolver stock de cada item cuando el módulo de inventario esté listo
      // pedido.items.forEach(item => {
      //   if (item.descontarStock) {
      //     devolverStock(item.productoId, item.cantidad)
      //   }
      // });
    }

    return prisma.pedido.delete({ where: { id } });
  }
}
