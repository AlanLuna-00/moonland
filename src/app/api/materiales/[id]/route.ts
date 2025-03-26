import { NextRequest, NextResponse } from "next/server";
import { MaterialApplicationService } from "@/modules/materiales/application/service";

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const material = await MaterialApplicationService.getMaterialById(
      params.id
    );

    if (!material) {
      return NextResponse.json(
        { error: "Material no encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json(material);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Error al obtener material" },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json();
    const updated = await MaterialApplicationService.updateMaterial(
      params.id,
      body
    );

    return NextResponse.json(updated);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Error al actualizar material" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await MaterialApplicationService.deleteMaterial(params.id);
    return NextResponse.json(
      { message: "Material eliminado correctamente" },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Error al eliminar material" },
      { status: 500 }
    );
  }
}
