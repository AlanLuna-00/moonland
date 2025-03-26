import { NextRequest, NextResponse } from "next/server";
import { PedidoApplicationService } from "@/modules/pedidos/application/service";

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string; itemId: string } }
) {
  try {
    const body = await req.json();
    const updated = await PedidoApplicationService.updateItem(
      params.id,
      params.itemId,
      body
    );

    return NextResponse.json(updated);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Error al actualizar item del pedido" },
      { status: 500 }
    );
  }
}
