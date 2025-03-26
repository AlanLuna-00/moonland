import { MaterialRepository } from "../infrastructure/material.repository";
import { CreateMaterialDTO, UpdateMaterialDTO } from "../domain/dto";

export class MaterialApplicationService {
  static async createMaterial(dto: CreateMaterialDTO) {
    return MaterialRepository.create(dto);
  }

  static async getAllMaterialesPaginated(page?: number, limit?: number) {
    return MaterialRepository.findAllPaginated(page, limit);
  }

  static async getMaterialById(id: string) {
    return MaterialRepository.findById(id);
  }

  static async updateMaterial(id: string, dto: UpdateMaterialDTO) {
    return MaterialRepository.update(id, dto);
  }

  static async deleteMaterial(id: string) {
    return MaterialRepository.delete(id);
  }
}
