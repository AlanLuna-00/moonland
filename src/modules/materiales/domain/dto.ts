export interface CreateMaterialDTO {
  nombre: string;
  valor: number;
  proveedorId: string;
}

export type UpdateMaterialDTO = Partial<CreateMaterialDTO>;

export interface MaterialDTO extends CreateMaterialDTO {
  id: string;
}
