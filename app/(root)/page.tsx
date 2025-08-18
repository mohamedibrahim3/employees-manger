import { Button } from "@/components/ui/button";
import { EmployeesTable } from "@/components/employees-table";

import { getEmployees } from "@/lib/actions/employee.actions";
import Link from "next/link";

// Employee interface matching the database schema
import { Employee } from "@/types";

export const metadata = {
  title: "الموظفين",
  description: "إدارة وعرض بيانات الموظفين في المؤسسة",
};

// Force dynamic rendering
export const dynamic = "force-dynamic";

const page = async () => {
  const employeesData = await getEmployees();

  // Convert fetched employees to match the Employee type (convert Dates to strings)
  const employees: Employee[] = (employeesData?.employees ?? []).map(
    (emp: any) => ({
      ...emp,
      birthDate:
        emp.birthDate instanceof Date
          ? emp.birthDate.toISOString()
          : emp.birthDate,
      hiringDate:
        emp.hiringDate instanceof Date
          ? emp.hiringDate.toISOString()
          : emp.hiringDate,
      createdAt:
        emp.createdAt instanceof Date
          ? emp.createdAt.toISOString()
          : emp.createdAt,
      updatedAt:
        emp.updatedAt instanceof Date
          ? emp.updatedAt.toISOString()
          : emp.updatedAt,
    })
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 space-y-6">
        {/* Title and add button */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between bg-white">
          <div className="mb-4 md:mb-0">
            <h1 className="text-3xl font-bold text-gray-900">الموظفين</h1>
            <p className="text-gray-600 mt-1">
              إدارة وعرض بيانات الموظفين في جهاز تعمير سيناء
            </p>
          </div>
          <Button
            variant="default"
            size="lg"
            className="bg-blue-600 hover:bg-blue-700 cursor-pointer"
          >
            <Link href="/employees/create">اضافة موظف</Link>
          </Button>
        </div>

        {/* Employees table */}
        <EmployeesTable employees={employees} />
      </div>
    </div>
  );
};

export default page;
