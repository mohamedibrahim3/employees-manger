import { getEmployeesBySearch } from "@/lib/actions/employee.actions";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const name = url.searchParams.get("name") || "";
  const administration = url.searchParams.get("administration") || "";
  const educationalDegree = url.searchParams.get("educationalDegree") || "";
  const functionalDegree = url.searchParams.get("functionalDegree") || "";

  const result = await getEmployeesBySearch(
    name,
    administration,
    educationalDegree,
    functionalDegree
  );
  return new Response(JSON.stringify(result), { status: 200 });
}
