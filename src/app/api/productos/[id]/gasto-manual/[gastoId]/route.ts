import { ProductoApplicationService } from "@/modules/productos/application/producto.service";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string; gastoId: string } }
) {
  try {
    console.log(params);
    const body = await req.json();
    const updated = await ProductoApplicationService.updateGastoManual(
      params.id,
      params.gastoId,
      body
    );
    return NextResponse.json(updated);
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error
        ? error.message
        : "Error al actualizar gasto manual";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string; gastoId: string } }
) {
  try {
    const deleted = await ProductoApplicationService.deleteGastoManual(
      params.id,
      params.gastoId
    );
    return NextResponse.json(deleted);
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Error al eliminar gasto manual";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
