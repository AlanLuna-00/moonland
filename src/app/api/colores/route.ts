import { NextRequest, NextResponse } from "next/server";
import { ColorApplicationService } from "@/modules/colores/application/service";

export async function GET(req: NextRequest) {
  const page = parseInt(req.nextUrl.searchParams.get("page") || "1", 10);
  const limit = parseInt(req.nextUrl.searchParams.get("limit") || "10", 10);

  const colores = await ColorApplicationService.getAllColors(page, limit);
  return NextResponse.json(colores);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const nuevo = await ColorApplicationService.createColor(body);
    return NextResponse.json(nuevo, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "No se pudo crear el color" },
      { status: 500 }
    );
  }
}
