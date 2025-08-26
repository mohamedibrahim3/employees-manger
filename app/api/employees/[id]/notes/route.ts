import { NextResponse } from "next/server";
import { getEmployeeNotes } from "@/lib/actions/employee.actions";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const result = await getEmployeeNotes(id);
  if (result.success) {
    return NextResponse.json({ notes: result.notes });
  }
  return NextResponse.json({ error: result.error }, { status: 500 });
}