import { CreateTareaDTO } from "../domain/dto";
import { TareaRepository } from "../infrastructure/tarea.repository";

export class TareaApplicationService {
  static async createTarea(dto: CreateTareaDTO) {
    return TareaRepository.create(dto);
  }

  static async getAllTareas(page?: number, limit?: number) {
    return TareaRepository.findAllPaginated(page, limit);
  }

  static async getTareaById(id: string) {
    return TareaRepository.findById(id);
  }
}
