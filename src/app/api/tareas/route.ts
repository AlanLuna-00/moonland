import { NextRequest, NextResponse } from "next/server";
import { TareaApplicationService } from "@/modules/tareas/application/service";

export async function GET(req: NextRequest) {
  const page = parseInt(req.nextUrl.searchParams.get("page") || "1", 10);
  const limit = parseInt(req.nextUrl.searchParams.get("limit") || "10", 10);

  const tareas = await TareaApplicationService.getAllTareas(page, limit);
  return NextResponse.json(tareas);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const nueva = await TareaApplicationService.createTarea(body);
    return NextResponse.json(nueva, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "No se pudo crear la tarea" },
      { status: 500 }
    );
  }
}
