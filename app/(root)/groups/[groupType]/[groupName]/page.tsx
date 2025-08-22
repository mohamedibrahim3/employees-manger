import { getEmployees } from "@/lib/actions/employee.actions";
import { EmployeesTable } from "@/components/employees-table";
import { unstable_noStore as noStore } from "next/cache";
import Link from "next/link";

export const dynamic = "force-dynamic";
export const revalidate = 0;

import type { Employee } from "@/types";

const GroupPage = async ({ params }: { params: { groupType: string; groupName: string } }) => {
  noStore();
  const { groupType, groupName } = params;

  const decodedGroupName = decodeURIComponent(groupName);

  const employeesData = await getEmployees();
  const employees: Employee[] = (employeesData?.employees || []).map((emp: any) => ({
    ...emp,
    birthDate: emp.birthDate instanceof Date ? emp.birthDate.toISOString().split("T")[0] : emp.birthDate,
    hiringDate: emp.hiringDate instanceof Date ? emp.hiringDate.toISOString().split("T")[0] : emp.hiringDate,
    relationships: emp.relationships?.map((rel: any) => ({
      ...rel,
      birthDate: rel.birthDate instanceof Date ? rel.birthDate.toISOString().split("T")[0] : rel.birthDate,
    })) ?? [],
  }));

  if (!["administration", "region"].includes(groupType)) {
    return <div className="p-8">❌ نوع المجموعة غير مدعوم</div>;
  }

  const filtered = employees.filter((emp) => {
    if (groupType === "administration") return emp.administration === decodedGroupName;
    if (groupType === "region") return emp.residenceLocation === decodedGroupName;
    return false;
  });

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto space-y-6">
        <div className="flex justify-between items-center bg-white p-4 rounded-lg shadow">
          <h2 className="text-2xl font-bold text-gray-900">
            الموظفين في {groupType === "administration" ? "الإدارة" : "المنطقة"}: {decodedGroupName}
          </h2>
          <Link
            href="/"
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
          >
            رجوع
          </Link>
        </div>

        {filtered.length > 0 ? (
          <EmployeesTable employees={filtered} />
        ) : (
          <div className="p-8 text-gray-500">لا يوجد موظفين في {decodedGroupName}</div>
        )}
      </div>
    </div>
  );
};

export default GroupPage;
