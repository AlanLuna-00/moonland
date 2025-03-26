import { NextRequest, NextResponse } from "next/server";
import { TareaApplicationService } from "@/modules/tareas/application/service";

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const tarea = await TareaApplicationService.getTareaById(params.id);

    if (!tarea) {
      return NextResponse.json(
        { error: "Tarea no encontrada" },
        { status: 404 }
      );
    }

    return NextResponse.json(tarea);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Error al obtener tarea" },
      { status: 500 }
    );
  }
}
