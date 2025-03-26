import { NextRequest } from "next/server";

import { MaterialApplicationService } from "@/modules/materiales/application/service";
import { NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const page = parseInt(req.nextUrl.searchParams.get("page") || "1", 10);
  const limit = parseInt(req.nextUrl.searchParams.get("limit") || "10", 10);

  const result = await MaterialApplicationService.getAllMaterialesPaginated(
    page,
    limit
  );
  return NextResponse.json(result);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const nuevo = await MaterialApplicationService.createMaterial(body);
    return NextResponse.json(nuevo, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "No se pudo crear el material" },
      { status: 500 }
    );
  }
}
