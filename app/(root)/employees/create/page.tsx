import { Metadata } from "next";
import EmployeeForm from "@/components/employee-form";

export const metadata: Metadata = {
  title: "Create Employee",
};

const page = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 py-8">
      <div className="container mx-auto px-4 space-y-6">
        {/* Title and add button */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="mb-4 md:mb-0">
            <h1 className="text-3xl font-semibold text-slate-800">
              اضافة موظف
            </h1>
            <p className="text-slate-600 mt-1">
              اضافة وعرض بيانات الموظفين في المؤسسة
            </p>
          </div>
        </div>
        <EmployeeForm type="Create" />
      </div>
    </div>
  );
};

export default page;
