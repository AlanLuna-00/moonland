import { NextRequest, NextResponse } from "next/server";
import { ProveedorApplicationService } from "@/modules/proveedores/application/service";

export async function GET(req: NextRequest) {
  const page = parseInt(req.nextUrl.searchParams.get("page") || "1", 10);
  const limit = parseInt(req.nextUrl.searchParams.get("limit") || "10", 10);

  const proveedores = await ProveedorApplicationService.getAllProveedores(
    page,
    limit
  );
  return NextResponse.json(proveedores);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const nuevo = await ProveedorApplicationService.createProveedor(body);
    return NextResponse.json(nuevo, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "No se pudo crear el proveedor" },
      { status: 500 }
    );
  }
}
