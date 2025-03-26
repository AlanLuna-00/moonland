export interface CreateProveedorDTO {
  nombre: string;
  contacto: string;
}

export interface ProveedorDTO extends CreateProveedorDTO {
  id: string;
}

export type UpdateProveedorDTO = Partial<CreateProveedorDTO>;
