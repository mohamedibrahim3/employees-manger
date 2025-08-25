// app/api/employees/[id]/route.ts
import { NextResponse } from "next/server";
import { deleteEmployee } from "@/lib/actions/employee.actions";

export async function DELETE(request: Request, context: any) {
  try {
    const id = context?.params?.id;
    if (!id || typeof id !== "string") {
      return NextResponse.json({ success: false, error: "Missing or invalid id" }, { status: 400 });
    }

    const result = await deleteEmployee(id);

    if (result && result.success) {
      return NextResponse.json({ success: true }, { status: 200 });
    }

    return NextResponse.json(
      { success: false, error: result?.error || "Failed to delete" },
      { status: 400 }
    );
  } catch (error) {
    console.error("API DELETE /api/employees/[id] error:", error);
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}
