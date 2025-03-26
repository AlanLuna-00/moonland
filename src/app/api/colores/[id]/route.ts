import { NextRequest, NextResponse } from "next/server";
import { ColorApplicationService } from "@/modules/colores/application/service";

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const color = await ColorApplicationService.getColorById(params.id);

    if (!color) {
      return NextResponse.json(
        { error: "Color no encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json(color);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Error al obtener color" },
      { status: 500 }
    );
  }
}
