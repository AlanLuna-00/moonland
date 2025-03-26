export interface CreateProductoDTO {
  nombre: string;
  articulo: string;
}

export interface GetByArticuloParams {
  articulo: string;
}

export interface CreateGastoManualDTO {
  tipo: string;
  valor: number;
}

export interface AsignarGastoMaterialDTO {
  materialId: string;
  cantidad: number;
}

export interface BaseGasto {
  id: string;
  gastoId: string;
}

export interface GastoManual extends BaseGasto {
  tipo: "manual";
  tipo_gasto: string;
  valor: number;
}

export interface GastoMaterial extends BaseGasto {
  tipo: "material";
  cantidad: number;
  material: {
    id: string;
    nombre: string;
    valor: number;
  };
}

export type Gasto = GastoManual | GastoMaterial;

export interface ProductoDTO {
  id: string;
  nombre: string;
  articulo: string;
  precioVenta: number;
  precioCosto: number;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

export interface ProductoDetailDTO extends ProductoDTO {
  gastos: Gasto[];
}
