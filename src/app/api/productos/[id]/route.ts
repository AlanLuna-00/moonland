import { NextRequest, NextResponse } from "next/server";
import { ProductoApplicationService } from "@/modules/productos/application/producto.service";

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json();

    const updated = await ProductoApplicationService.updateProducto(
      params.id,
      body
    );

    return NextResponse.json(updated);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "No se pudo actualizar el producto" },
      { status: 500 }
    );
  }
}
