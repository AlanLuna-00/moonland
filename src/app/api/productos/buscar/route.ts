import { NextRequest, NextResponse } from "next/server";
import { ProductoApplicationService } from "@/modules/productos/application/producto.service";
export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const articulo = searchParams.get("articulo");

  if (!articulo) {
    return NextResponse.json(
      { error: "El parámetro 'articulo' es requerido" },
      { status: 400 }
    );
  }

  try {
    const producto = await ProductoApplicationService.getProductoByArticulo({
      articulo,
    });

    if (!producto) {
      return NextResponse.json(
        { error: "Producto no encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json(producto);
  } catch (error) {
    return NextResponse.json(
      { error: "Error al buscar productos", details: error },
      { status: 500 }
    );
  }
}
