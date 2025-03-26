import { ProductoApplicationService } from "@/modules/productos/application/producto.service";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const body = await req.json();
  const updated = await ProductoApplicationService.agregarGastoMaterial(
    params.id,
    body
  );
  return NextResponse.json(updated);
}
