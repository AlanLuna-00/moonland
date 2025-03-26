import { CreateColorDTO } from "../domain/dto";
import { ColorRepository } from "../infrastructure/color.repository";

export class ColorApplicationService {
  static async createColor(dto: CreateColorDTO) {
    return ColorRepository.create(dto);
  }

  static async getAllColors(page?: number, limit?: number) {
    return ColorRepository.findAllPaginated(page, limit);
  }

  static async getColorById(id: string) {
    return ColorRepository.findById(id);
  }
}
