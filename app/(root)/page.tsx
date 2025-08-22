import Link from "next/link";
import { getEmployees } from "@/lib/actions/employee.actions";
import { unstable_noStore as noStore } from "next/cache";
import { ADMINISTRATIONS_AND_REGIONS } from "@/src/constants/groups";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const toArabicDigits = (num: number) => {
  return num.toString().replace(/\d/g, (d) => "٠١٢٣٤٥٦٧٨٩"[parseInt(d)]);
};

const Page = async () => {
  noStore();
  const employeesData = await getEmployees();
  const employees = employeesData?.employees || [];

  const groups = employees.reduce((acc: any, emp: any) => {
    const key = emp.administration || "غير محدد";
    if (!acc[key]) acc[key] = [];
    acc[key].push(emp);
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto space-y-8">
        <h1 className="text-4xl font-bold text-gray-900 text-center">
          برنامج الموارد البشرية
        </h1>

        <div className="flex justify-center">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-xl rounded-2xl p-8 text-center w-full max-w-md transform hover:scale-105 transition duration-300">
            <h2 className="text-2xl font-bold mb-4">قوة الجهاز</h2>
            <p className="text-5xl font-extrabold mb-2">
              {toArabicDigits(employees.length)}{" "}
              <span className="text-2xl font-medium">موظف</span>
            </p>
            <Link
              href="/employees"
              className="inline-block mt-3 px-6 py-2 bg-white text-blue-600 rounded-lg font-semibold shadow hover:bg-gray-100 transition"
            >
              عرض كل الموظفين
            </Link>
          </div>
        </div>

        {/* جدول الإدارات والمناطق */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <table className="min-w-full table-auto">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="px-6 py-3 text-right text-sm font-medium">
                  الإدارة / المنطقة
                </th>
                <th className="px-6 py-3 text-right text-sm font-medium">
                  عدد الموظفين
                </th>
                <th className="px-6 py-3 text-right text-sm font-medium">
                  إجراء
                </th>
              </tr>
            </thead>
            <tbody>
              {ADMINISTRATIONS_AND_REGIONS.map((admin) => {
                const emps = groups[admin] || [];
                return (
                  <tr key={admin} className="border-b hover:bg-gray-50">
                    <td className="px-6 py-4 text-gray-900">{admin}</td>
                    <td className="px-6 py-4 text-gray-700">
                      {toArabicDigits(emps.length)}
                    </td>
                    <td className="px-6 py-4">
                      <Link
                        href={`/groups/administration/${encodeURIComponent(admin)}`}
                        className="text-blue-600 hover:underline"
                      >
                        عرض الموظفين
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
  );
};

export default Page;
