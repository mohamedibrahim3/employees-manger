import { getEmployeesBySearch } from "@/lib/actions/employee.actions";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const name = searchParams.get("name") || "";
    const administration = searchParams.get("administration") || "";

    console.log("API Route - Search params:", { name, administration });

    // Call your search function
    const result = await getEmployeesBySearch(name, administration);
    
    console.log("API Route - Search result:", result);

    // Make sure we return a consistent structure
    const response = {
      success: true,
      employees: result?.employees || result || []
    };

    return NextResponse.json(response, {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      }
    });

  } catch (error) {
    console.error("API Route Error:", error);
    
    return NextResponse.json(
      {
        success: false,
        error: "حدث خطأ أثناء البحث",
        employees: []
      },
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        }
      }
    );
  }
}