import { ProductoApplicationService } from "@/modules/productos/application/producto.service";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "10");

  try {
    const productos = await ProductoApplicationService.getAllProductos({
      page,
      limit,
    });
    return NextResponse.json(productos);
  } catch (error) {
    return NextResponse.json(
      { error: "Error al obtener productos", details: error },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const nuevo = await ProductoApplicationService.createProducto(body);
  return NextResponse.json(nuevo, { status: 201 });
}
