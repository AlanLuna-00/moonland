import { PedidoRepository } from "../infrastructure/pedidos.repository";
import {
  CreatePedidoDTO,
  UpdateItemPedidoDTO,
  UpdatePedidoDTO,
} from "../domain/dto";

export class PedidoApplicationService {
  static async createPedido(dto: CreatePedidoDTO) {
    return PedidoRepository.create(dto);
  }

  static async getAllPedidos(page?: number, limit?: number) {
    return PedidoRepository.findAllPaginated(page, limit);
  }

  static async getPedidoById(id: string) {
    return PedidoRepository.findById(id);
  }

  static async update(id: string, dto: UpdatePedidoDTO) {
    return PedidoRepository.update(id, dto);
  }

  static async updateItem(
    id: string,
    itemId: string,
    dto: UpdateItemPedidoDTO
  ) {
    return PedidoRepository.updateItem(id, itemId, dto);
  }

  static async delete(id: string) {
    return PedidoRepository.delete(id);
  }
}
