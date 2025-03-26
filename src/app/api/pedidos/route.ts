import { NextRequest, NextResponse } from "next/server";
import { PedidoApplicationService } from "@/modules/pedidos/application/service";

export async function GET(req: NextRequest) {
  const page = parseInt(req.nextUrl.searchParams.get("page") || "1", 10);
  const limit = parseInt(req.nextUrl.searchParams.get("limit") || "10", 10);

  const pedidos = await PedidoApplicationService.getAllPedidos(page, limit);
  return NextResponse.json(pedidos);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const nuevo = await PedidoApplicationService.createPedido(body);
    return NextResponse.json(nuevo, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "No se pudo crear el pedido" },
      { status: 500 }
    );
  }
}
