import { ProveedorRepository } from "../infrastructure/proveedor.repository";
import { CreateProveedorDTO, UpdateProveedorDTO } from "../domain/dto";

export class ProveedorApplicationService {
  static async createProveedor(dto: CreateProveedorDTO) {
    return ProveedorRepository.create(dto);
  }

  static async getAllProveedores(page?: number, limit?: number) {
    return ProveedorRepository.findAllPaginated(page, limit);
  }

  static async getProveedorById(id: string) {
    return ProveedorRepository.findById(id);
  }

  static async updateProveedor(id: string, dto: UpdateProveedorDTO) {
    return ProveedorRepository.update(id, dto);
  }

  static async deleteProveedor(id: string) {
    return ProveedorRepository.delete(id);
  }
}
