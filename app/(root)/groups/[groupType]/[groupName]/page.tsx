import { getEmployees } from "@/lib/actions/employee.actions";
import { EmployeesTable } from "@/components/employees-table";
import { unstable_noStore as noStore } from "next/cache";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";
export const revalidate = 0;

import type { Employee } from "@/types";

const toArabicDigits = (num: number) => {
  return num.toString().replace(/\d/g, (d) => "٠١٢٣٤٥٦٧٨٩"[Number(d)]);
};

const GroupPage = async ({ params }: any) => {
  // خليها any عشان نتجنّب تعارض PageProps في نسخ Next الحديثة
  noStore();
  const { groupType, groupName } = params || {};

  const decodedGroupName = typeof groupName === "string" ? decodeURIComponent(groupName) : "";

  const employeesData = await getEmployees();
  const rawEmployees = employeesData?.employees || [];

  // Normalize to Employee[] as best-effort
  const employees: Employee[] = (rawEmployees as any[]).map((emp: any) => {
    const normalizeDate = (d: any) => {
      if (!d) return undefined;
      if (d instanceof Date) return d.toISOString().split("T")[0];
      if (typeof d === "string") return d;
      return undefined;
    };

    return {
      ...emp,
      birthDate: normalizeDate(emp.birthDate) as any,
      hiringDate: normalizeDate(emp.hiringDate) as any,
      relationships:
        (emp.relationships || []).map((rel: any) => ({
          ...rel,
          birthDate: normalizeDate(rel.birthDate) as any,
        })) || [],
    } as Employee;
  });

  if (!["administration", "region"].includes(groupType)) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-100 flex items-center justify-center">
        <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl p-12 text-center border border-white/20">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-red-500 to-orange-500 rounded-2xl mb-6">
            <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"></path>
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-red-600 mb-4">خطأ في نوع المجموعة</h2>
          <p className="text-xl text-gray-600 mb-8">نوع المجموعة المطلوب غير مدعوم في النظام</p>
          <Link href="/">
            <Button className="px-8 py-4 text-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl">
              العودة للرئيسية
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const filtered = employees.filter((emp) => {
    if (groupType === "administration") return emp.administration === decodedGroupName;
    if (groupType === "region") return emp.residenceLocation === decodedGroupName;
    return false;
  });

  const groupTitle = groupType === "administration" ? "الإدارة" : "المنطقة";
  const groupIcon =
    groupType === "administration" ? (
      <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 110 2h-3a1 1 0 01-1-1v-2a1 1 0 00-1-1H9a1 1 0 00-1 1v2a1 1 0 01-1 1H4a1 1 0 110-2V4zm3 1h2v2H7V5zm2 4H7v2h2V9zm2-4h2v2h-2V5zm2 4h-2v2h2V9z" clipRule="evenodd"></path>
      </svg>
    ) : (
      <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"></path>
      </svg>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-600/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-green-400/20 to-blue-600/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/3 left-1/4 w-64 h-64 bg-gradient-to-br from-purple-400/15 to-pink-600/15 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/3 right-1/4 w-72 h-72 bg-gradient-to-br from-yellow-400/10 to-orange-600/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 w-full max-w-none px-6 lg:px-12 xl:px-16 py-12 space-y-8">
        {/* Header Section */}
        <div className="text-center space-y-6 mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl shadow-2xl mb-6">
            {groupIcon}
          </div>

          <h1 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 bg-clip-text text-transparent leading-tight">
            موظفون {groupTitle}
          </h1>
          <p className="text-2xl text-blue-600 font-bold">{decodedGroupName}</p>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full mx-auto"></div>
        </div>

        {/* Stats and Navigation Bar */}
        <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl overflow-hidden border border-white/20 p-8">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            {/* Statistics Section */}
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-green-100 to-emerald-100 rounded-2xl mb-4">
                <svg className="w-10 h-10 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z"></path>
                </svg>
              </div>
              <div className="text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-2">
                {toArabicDigits(filtered.length)}
              </div>
              <p className="text-xl text-gray-600 font-semibold">موظف في {groupTitle}</p>
            </div>

            {/* Navigation Buttons */}
            <div className="flex flex-col sm:flex-row gap-6">
              <Link href="/employees">
                <Button
                  variant="outline"
                  className="group px-10 py-5 text-xl font-semibold text-gray-700 bg-white border-2 border-gray-300 rounded-2xl hover:border-green-400 hover:text-green-600 hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300"
                >
                  <span className="flex items-center">
                    <svg className="w-6 h-6 ml-3 group-hover:text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z"></path>
                    </svg>
                    كل الموظفين
                  </span>
                </Button>
              </Link>

              <Link href="/">
                <Button className="group relative px-10 py-5 text-xl font-bold text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <span className="relative flex items-center">
                    <svg className="w-6 h-6 ml-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd"></path>
                    </svg>
                    العودة للرئيسية
                  </span>
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Table or Empty State */}
        {filtered.length > 0 ? (
          <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl overflow-hidden border border-white/20">
            <div className="bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 px-12 py-8">
              <div className="flex items-center justify-center">
                <div className="flex items-center space-x-4 space-x-reverse">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-ping"></div>
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <h2 className="text-3xl font-bold text-white mr-4">قائمة موظفي {decodedGroupName}</h2>
                </div>
              </div>
            </div>

            <div className="p-8">
              <EmployeesTable employees={filtered} />
            </div>
          </div>
        ) : (
          <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl overflow-hidden border border-white/20 p-16 text-center">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-3xl mb-8">
              <svg className="w-12 h-12 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"></path>
              </svg>
            </div>
            <h3 className="text-3xl font-bold text-gray-600 mb-4">لا يوجد موظفين</h3>
            <p className="text-xl text-gray-500 mb-8">
              لم يتم العثور على أي موظفين في {groupTitle} «{decodedGroupName}»
            </p>
            <Link href="/employees/create">
              <Button className="px-8 py-4 text-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300">
                إضافة موظف جديد
              </Button>
            </Link>
          </div>
        )}

        {/* Footer Info */}
        <div className="text-center space-y-4 pt-8">
          <div className="inline-flex items-center justify-center space-x-2 space-x-reverse text-gray-600">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
            <span className="text-lg">عرض بيانات {groupTitle}: {decodedGroupName}</span>
          </div>
          <p className="text-gray-500">آخر تحديث: {new Date().toLocaleDateString("ar-EG")} - {new Date().toLocaleTimeString("ar-EG")}</p>
        </div>
      </div>
    </div>
  );
};

export default GroupPage;
