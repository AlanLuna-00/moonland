import { ProductoRepository } from "../infrastructure/producto.repository";
import {
  AsignarGastoMaterialDTO,
  CreateGastoManualDTO,
  CreateProductoDTO,
  GetByArticuloParams,
} from "../domain/dto";
import { PaginationParams } from "@/shared/infrastructure/dto";
export class ProductoApplicationService {
  static async createProducto(dto: CreateProductoDTO) {
    return ProductoRepository.create(dto);
  }

  static async getAllProductos(
    params: PaginationParams = { page: 1, limit: 10 }
  ) {
    return ProductoRepository.findAll(params);
  }

  static async getProductoByArticulo(params: GetByArticuloParams) {
    return ProductoRepository.findByArticulo(params);
  }

  static async updateProducto(
    productoId: string,
    data: Partial<{ nombre: string; articulo: string; precioVenta: number }>
  ) {
    return ProductoRepository.update(productoId, data);
  }

  static async agregarGastoManual(
    productoId: string,
    dto: CreateGastoManualDTO
  ) {
    return ProductoRepository.asignarGastoManual(productoId, dto);
  }

  static async agregarGastoMaterial(
    productoId: string,
    dto: AsignarGastoMaterialDTO
  ) {
    return ProductoRepository.asignarGastoMaterial(productoId, dto);
  }

  static async updateGastoManual(
    productoId: string,
    gastoManualId: string,
    data: Partial<{ tipo: string; valor: number }>
  ) {
    return ProductoRepository.updateGastoManual(
      productoId,
      gastoManualId,
      data
    );
  }

  static async updateGastoMaterial(
    productoId: string,
    gastoMaterialId: string,
    data: { cantidad?: number; materialId?: string }
  ) {
    return ProductoRepository.updateGastoMaterial(
      productoId,
      gastoMaterialId,
      data
    );
  }

  static async deleteGastoManual(productoId: string, gastoManualId: string) {
    return ProductoRepository.deleteGastoManual(productoId, gastoManualId);
  }

  static async deleteGastoMaterial(
    productoId: string,
    gastoMaterialId: string
  ) {
    return ProductoRepository.deleteGastoMaterial(productoId, gastoMaterialId);
  }
}
