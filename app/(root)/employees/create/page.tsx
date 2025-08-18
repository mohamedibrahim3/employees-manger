import { Metadata } from "next";
import EmployeeForm from "@/components/employee-form";
import { EdgeStoreProvider } from "@/lib/edgestore";

export const metadata: Metadata = {
  title: "Create Employee",
};

const page = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 space-y-6">
        {/* Title and add button */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between bg-white p-6">
          <div className="mb-4 md:mb-0">
            <h1 className="text-3xl font-bold text-gray-900">اضافة موظف</h1>
            <p className="text-gray-600 mt-1">
              اضافة وعرض بيانات الموظفين في المؤسسة
            </p>
          </div>
        </div>

        {/* Employee form */}
        <EdgeStoreProvider>
          <EmployeeForm type="Create" />
        </EdgeStoreProvider>
      </div>
    </div>
  );
};

export default page;
