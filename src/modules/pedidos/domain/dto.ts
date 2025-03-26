export interface CreateItemPedidoDTO {
  productoId: string;
  cantidad: number;
  descontarStock: boolean;
}

export type UpdateItemPedidoDTO = Partial<CreateItemPedidoDTO>;

export interface CreatePedidoDTO {
  clienteId?: string;
  items: CreateItemPedidoDTO[];
}

export interface UpdatePedidoDTO {
  clienteId?: string;
  valorTotal?: number;
  estado?: EstadoPedido;
}

export interface PedidoItemDTO extends CreateItemPedidoDTO {
  id: string;
  valor: number;
}

export interface PedidoDTO {
  id: string;
  clienteId?: string;
  valorTotal: number;
  estado: EstadoPedido;
  items: PedidoItemDTO[];
  descontarStock: boolean;
}

export enum EstadoPedido {
  PENDIENTE = "PENDIENTE",
  CONFIRMADO = "CONFIRMADO",
  PAGADO = "PAGADO",
  FINALIZADO = "FINALIZADO",
  CANCELADO = "CANCELADO",
}
