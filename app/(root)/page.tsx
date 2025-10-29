import Link from "next/link";
import { getEmployees } from "@/lib/actions/employee.actions";
import { unstable_noStore as noStore } from "next/cache";
import { ADMINISTRATIONS_AND_REGIONS } from "@/src/constants/groups";
import SearchSection from "@/components/SearchForm";
import Image from "next/image";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const toArabicDigits = (num: number) => {
  return num.toString().replace(/\d/g, (d) => "٠١٢٣٤٥٦٧٨٩"[Number(d)]);
};

const Page = async () => {
  noStore();
  const employeesData = await getEmployees();
  const employeesList = (employeesData?.employees ?? []) as Array<
    Record<string, unknown>
  >;

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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-slate-200/30 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-slate-200/30 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-slate-100/20 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 w-full max-w-none px-4 lg:px-8 xl:px-12 py-12 space-y-12">
        {/* Header Section */}
        <div className="text-center space-y-6">
          <div className="inline-flex items-center justify-center w-36 h-36 bg-white rounded-2xl shadow-md mb-6">
            <Image
              src="/logo.png"
              height={144}
              width={144}
              alt="شعار الجهاز"
              className="rounded-lg shadow-sm"
            />
          </div>

          <h1 className="text-5xl md:text-6xl font-normal bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent leading-normal tracking-tight pb-4">
            برنامج الموارد البشرية
          </h1>
          <p className="text-xl text-slate-600">بجهاز تعمير سيناء</p>
          <div className="w-24 h-1 bg-blue-600 rounded-full mx-auto"></div>
        </div>

        {/* Stats Card */}
        <div className="flex justify-center">
          <div className="group relative">
            <div className="relative bg-white rounded-xl p-12 text-center shadow-md transform group-hover:scale-105 transition-all duration-300 max-w-lg w-full border border-slate-200">
              <div className="mb-6">
                <h2 className="text-2xl text-slate-800 mb-2">
                  قوة الجهاز الإجمالية
                </h2>
                <div className="text-6xl bg-gradient-to-r from-blue-600 to-blue-500 bg-clip-text text-transparent mb-2 tracking-wide">
                  {toArabicDigits(employeesList.length)}
                </div>
                <p className="text-lg text-slate-600">موظف نشط</p>
              </div>

              <Link
                href="/employees"
                className="group/btn relative inline-flex items-center justify-center px-8 py-4 text-lg text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300 overflow-hidden"
              >
                <div className="absolute inset-0 bg-blue-700 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"></div>
                <span className="relative flex items-center">
                  عرض كل الموظفين
                  <svg
                    className="mr-2 w-5 h-5 transform group-hover/btn:translate-x-1 transition-transform duration-300"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                </span>
              </Link>
            </div>
          </div>
        </div>

        {/* Departments Table */}
        <div className="w-full max-w-none">
          <div className="bg-white rounded-xl shadow-md overflow-hidden border border-slate-200">
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-12 py-8">
              <h3 className="text-3xl text-white text-center">
                توزيع الموظفين حسب الإدارات والمناطق
              </h3>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-slate-50 to-slate-100">
                  <tr>
                    <th className="px-6 py-4 text-right text-lg text-slate-700 border-b-2 border-slate-300 w-1/2">
                      الإدارة / المنطقة
                    </th>
                    <th className="px-6 py-4 text-right text-lg text-slate-700 border-b-2 border-slate-300 w-1/4">
                      عدد الموظفين
                    </th>
                    <th className="px-6 py-4 text-right text-lg text-slate-700 border-b-2 border-slate-300 w-1/4">
                      إجراء
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {ADMINISTRATIONS_AND_REGIONS.map((admin, index) => {
                    const emps = groups[admin] || [];
                    return (
                      <tr
                        key={admin}
                        className={`group hover:bg-slate-50 transition-all duration-300 ${
                          index % 2 === 0 ? "bg-white" : "bg-slate-50/50"
                        }`}
                      >
                        <td className="px-6 py-4 text-slate-800 text-lg group-hover:text-slate-700 transition-colors duration-300">
                          <div className="flex items-center">
                            <div className="w-3 h-10 bg-blue-500 rounded-full ml-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            {admin}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <span className="inline-flex items-center justify-center w-16 h-16 bg-slate-100 rounded-xl text-slate-700 text-lg ml-4">
                              {toArabicDigits((emps as []).length)}
                            </span>
                            <span className="text-slate-600 text-base">
                              موظف
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <Link
                            href={`/groups/administration/${encodeURIComponent(
                              admin
                            )}`}
                            className="group/link inline-flex items-center px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-base shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300"
                          >
                            <span>عرض الموظفين</span>
                            <svg
                              className="mr-2 w-4 h-4 transform group-hover/link:translate-x-1 transition-transform duration-300"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                                clipRule="evenodd"
                              ></path>
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
          <div className="bg-white rounded-xl shadow-md overflow-hidden border border-slate-200">
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-12 py-8">
              <h3 className="text-3xl text-white text-center">بحث عن موظف</h3>
            </div>
            <div className="p-8">
              <SearchSection administrations={ADMINISTRATIONS_AND_REGIONS} />
            </div>
          </div>
        </div>

        {/* Footer Stats */}
        <div className="text-center pt-8">
          <p className="text-slate-600 text-base">
            آخر تحديث: {new Date().toLocaleDateString("ar-EG")}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Page;
