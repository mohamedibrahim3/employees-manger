// Force dynamic rendering
export const dynamic = "force-dynamic";

import Link from "next/link";
import { getEmployees } from "@/lib/actions/employee.actions";

const Page = async () => {
  const employeesData = await getEmployees();
  const employeesCount = employeesData?.employees?.length || 0;

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto text-center space-y-8">
        {/* العنوان الرئيسي */}
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            برنامج الموارد البشرية
          </h1>
          <Link
            href="/employees"
            className="text-2xl font-semibold text-blue-600 hover:underline"
          >
            قوة الجهاز: {employeesCount}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Page;
