export interface CreateTareaDTO {
  productoId: string;
  cantidadPares: number;
  observaciones?: string;
  colorId?: string;
}

export interface TareaDTO extends CreateTareaDTO {
  id: string;
  estado: string;
  createdAt: Date;
  updatedAt: Date;
}
