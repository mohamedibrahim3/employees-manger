import { getEmployeesBySearch } from "@/lib/actions/employee.actions";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const name = searchParams.get("name") || "";
    const administration = searchParams.get("administration") || "";
    const educationalDegree = searchParams.get("educationalDegree") || "";
    const functionalDegree = searchParams.get("functionalDegree") || "";

    console.log("API Route - Search params:", {
      name,
      administration,
      educationalDegree,
      functionalDegree,
    });

    const result = await getEmployeesBySearch(
      name,
      administration,
      educationalDegree,
      functionalDegree
    );

    console.log("API Route - Search result:", result);

    const response = {
      success: true,
      employees: result?.employees || result || [],
    };

    return NextResponse.json(response, {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("API Route Error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "حدث خطأ أثناء البحث",
        employees: [],
      },
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
}