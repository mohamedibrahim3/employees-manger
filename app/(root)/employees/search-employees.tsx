import { getEmployeesBySearch } from "@/lib/actions/employee.actions";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const name = url.searchParams.get("name") || "";
  const administration = url.searchParams.get("administration") || "";

  const result = await getEmployeesBySearch(name, administration);
  return new Response(JSON.stringify(result), { status: 200 });
}