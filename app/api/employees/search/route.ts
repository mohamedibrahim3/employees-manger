import { NextResponse } from "next/server";
import { getEmployeesBySearch } from "@/lib/actions/employee.actions";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const name = searchParams.get("name") || "";
    const administration = searchParams.get("administration") || "";
    const educationalDegree = searchParams.get("educationalDegree") || "";
    const functionalDegree = searchParams.get("functionalDegree") || "";
    const hasPenalties = searchParams.get("hasPenalties") || "";
    const hasBonuses = searchParams.get("hasBonuses") || "";
    const hasEfficiencyReports = searchParams.get("hasEfficiencyReports") || "";

    console.log("API Route - Search params:", {
      name,
      administration,
      educationalDegree,
      functionalDegree,
      hasPenalties,
      hasBonuses,
      hasEfficiencyReports,
    });

    const result = await getEmployeesBySearch(
      name,
      administration,
      educationalDegree,
      functionalDegree,
      hasPenalties,
      hasBonuses,
      hasEfficiencyReports
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
