import Link from "next/link";
import { getEmployees } from "@/lib/actions/employee.actions";
import { unstable_noStore as noStore } from "next/cache";
import { ADMINISTRATIONS_AND_REGIONS } from "@/src/constants/groups";
import SearchSection from "@/components/SearchForm";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const toArabicDigits = (num: number) => {
  return num.toString().replace(/\d/g, (d) => "٠١٢٣٤٥٦٧٨٩"[Number(d)]);
};

const Page = async () => {
  noStore();
  const employeesData = await getEmployees();
  const employeesList = (employeesData?.employees ?? []) as Array<Record<string, unknown>>;

  const groups = employeesList.reduce(
    (acc: Record<string, Record<string, unknown>[]>, emp) => {
      const key = (emp["administration"] as string) || "غير محدد";
      if (!acc[key]) acc[key] = [];
      acc[key].push(emp);
      return acc;
    },
    {} as Record<string, Record<string, unknown>[]>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-600/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-green-400/20 to-blue-600/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-purple-400/10 to-pink-600/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 w-full max-w-none px-4 lg:px-8 xl:px-12 py-12 space-y-12">
        {/* Header Section */}
        <div className="text-center space-y-6">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl shadow-2xl mb-6 animate-pulse">
            <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z"></path>
            </svg>
          </div>

          <h1 className="text-5xl md:text-6xl font-black bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 bg-clip-text text-transparent leading-tight">
            برنامج الموارد البشرية
          </h1>
          <p className="text-xl text-gray-600 font-semibold">الخاص بجهاز تعمير سيناء</p>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full mx-auto"></div>
        </div>

        {/* Stats Card */}
        <div className="flex justify-center">
          <div className="group relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 rounded-3xl blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
            <div className="relative bg-white rounded-3xl p-12 text-center shadow-2xl transform group-hover:scale-105 transition-all duration-300 max-w-lg w-full">
              <div className="absolute top-6 right-6 w-3 h-3 bg-green-400 rounded-full animate-ping"></div>
              <div className="absolute top-6 right-6 w-3 h-3 bg-green-400 rounded-full"></div>

              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">قوة الجهاز الإجمالية</h2>
                <div className="text-6xl font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2 tracking-wide">
                  {toArabicDigits(employeesList.length)}
                </div>
                <p className="text-lg text-gray-600 font-semibold">موظف نشط</p>
              </div>

              <Link href="/employees" className="group/btn relative inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"></div>
                <span className="relative flex items-center">
                  عرض كل الموظفين
                  <svg className="mr-2 w-5 h-5 transform group-hover/btn:translate-x-1 transition-transform duration-300" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd"></path>
                  </svg>
                </span>
              </Link>
            </div>
          </div>
        </div>

        {/* Departments Table */}
        <div className="w-full max-w-none">
          <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl overflow-hidden border border-white/20">
            <div className="bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 px-12 py-8">
              <h3 className="text-3xl font-bold text-white text-center">توزيع الموظفين حسب الإدارات والمناطق</h3>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-gray-50 to-blue-50">
                  <tr>
                    <th className="px-6 py-4 text-right text-xl font-bold text-gray-800 border-b-2 border-blue-200 w-1/2">الإدارة / المنطقة</th>
                    <th className="px-6 py-4 text-right text-xl font-bold text-gray-800 border-b-2 border-blue-200 w-1/4">عدد الموظفين</th>
                    <th className="px-6 py-4 text-right text-xl font-bold text-gray-800 border-b-2 border-blue-200 w-1/4">إجراء</th>
                  </tr>
                </thead>
                <tbody>
                  {ADMINISTRATIONS_AND_REGIONS.map((admin, index) => {
                    const emps = groups[admin] || [];
                    return (
                      <tr
                        key={admin}
                        className={`group hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all duration-300 ${index % 2 === 0 ? "bg-white" : "bg-gray-50/50"}`}
                      >
                        <td className="px-6 py-4 text-gray-900 font-semibold text-xl group-hover:text-blue-900 transition-colors duration-300">
                          <div className="flex items-center">
                            <div className="w-3 h-10 bg-gradient-to-b from-blue-400 to-purple-400 rounded-full ml-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            {admin}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <span className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-100 to-purple-100 rounded-xl text-blue-700 font-bold text-xl ml-4">
                              {toArabicDigits((emps as []).length)}
                            </span>
                            <span className="text-gray-600 text-lg">موظف</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <Link href={`/groups/administration/${encodeURIComponent(admin)}`} className="group/link inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 hover:from-purple-500 hover:to-blue-500">
                            <span>عرض الموظفين</span>
                            <svg className="mr-2 w-4 h-4 transform group-hover/link:translate-x-1 transition-transform duration-300" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd"></path>
                            </svg>
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Search Section */}
        <div className="w-full max-w-none">
          <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl overflow-hidden border border-white/20">
            <div className="bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 px-12 py-8">
              <h3 className="text-3xl font-bold text-white text-center">بحث عن موظف</h3>
            </div>
            <div className="p-8">
              <SearchSection administrations={ADMINISTRATIONS_AND_REGIONS} />
            </div>
          </div>
        </div>

        {/* Footer Stats */}
        <div className="text-center pt-8">
          <p className="text-gray-600 text-lg">آخر تحديث: {new Date().toLocaleDateString("ar-EG")}</p>
        </div>
      </div>
    </div>
  );
};

export default Page;
