import { NextResponse } from "next/server";
import { getEmployeesBySearch } from "@/lib/actions/employee.actions";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const name = searchParams.get("name") || "";
    const administration = searchParams.get("administration") || "";

    const educationalDegree = searchParams.get("educationalDegree") || "";
    const result = await getEmployeesBySearch(
      name,
      administration,
      educationalDegree
    );

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      { success: false, error: "حدث خطأ أثناء البحث" },
      { status: 500 }
    );
  }
}
