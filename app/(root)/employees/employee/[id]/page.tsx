import { getEmployeeById } from "@/lib/actions/employee.actions";
import { unstable_noStore as noStore } from "next/cache";

export const dynamic = "force-dynamic";
export const revalidate = 0;

import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { formateHiringType, formateMaritalStatus } from "@/lib/utils";
import EmployeeImages from "@/components/EmployeeImages";

const RELATIONSHIP_LABELS: Record<string, string> = {
  father: "بيانات الأب",
  mother: "بيانات الأم",
  spouse: "بيانات الزوج/الزوجة",
  son: "بيانات الابن",
  daughter: "بيانات الابنة",
  brother: "بيانات الأخ",
  sister: "بيانات الأخت",
};

const JOB_POSITION_LABELS: Record<string, string> = {
  ENGINEER: "مهندس",
  ACCOUNTANT: "محاسب",
  ADMINISTRATIVE: "إداري",
  EXECUTIVE_SUPERVISOR: "مشرف تنفيذ",
  WRITER: "كاتب",
  WORKER: "عامل",
};

const EDUCATIONAL_DEGREE_LABELS: Record<string, string> = {
  DOCTORATE: "دكتوراة",
  MASTERS: "ماجستير",
  BACHELORS: "بكالوريوس",
  GENERAL_SECONDARY: "ثانوية عامة",
  AZHARI_SECONDARY: "ثانوية أزهرية",
  ABOVE_AVERAGE: "مؤهل فوق متوسط",
  AVERAGE: "مؤهل متوسط",
  PREPARATORY: "اعدادية",
  PRIMARY: "ابتدائية",
  LITERACY: "محو أمية",
  NONE: "بدون",
};

const FUNCTIONAL_DEGREE_LABELS: Record<string, string> = {
  FIRST_DEPUTY_MINISTER: "وكيل أول وزارة",
  DEPUTY_MINISTER: "وكيل وزارة",
  GENERAL_MANAGER: "مدير عام",
  DEPARTMENT_MANAGER: "مدير إدارة",
  DEPARTMENT_HEAD: "رئيس قسم",
  FIRST_A: "أولى أ",
  FIRST_B: "أولى ب",
  SECOND_A: "ثانية أ",
  SECOND_B: "ثانية ب",
  THIRD_A: "ثالثة أ",
  THIRD_B: "ثالثة ب",
  THIRD_C: "ثالثة ج",
  FOURTH_A: "رابعة أ",
  FOURTH_B: "رابعة ب",
  FOURTH_C: "رابعة ج",
  FIFTH_A: "خامسة أ",
  FIFTH_B: "خامسة ب",
  FIFTH_C: "خامسة ج",
  SIXTH_A: "سادسة أ",
  SIXTH_B: "سادسة ب",
  SIXTH_C: "سادسة ج",
};

const getJobPositionLabel = (jobPosition: string | null | undefined) => {
  if (!jobPosition) return "-";
  return JOB_POSITION_LABELS[jobPosition] ?? jobPosition;
};

const getEducationalDegreeLabel = (educationalDegree: string | null | undefined) => {
  if (!educationalDegree) return "-";
  return EDUCATIONAL_DEGREE_LABELS[educationalDegree] ?? educationalDegree;
};

const getFunctionalDegreeLabel = (functionalDegree: string | null | undefined) => {
  if (!functionalDegree) return "-";
  return FUNCTIONAL_DEGREE_LABELS[functionalDegree] ?? functionalDegree;
};

const EmployeeDetailsPage = async (props: {
  params: Promise<{ id: string }>;
}) => {
  noStore();
  const { id } = await props.params;

  const result = await getEmployeeById(id);

  if (!result.success || !result.employee) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-white py-4">
        <div className="container mx-auto px-4">
          <h1 className="text-2xl font-medium text-gray-800">الموظف غير موجود</h1>
          <p className="text-gray-600 mt-2">
            لا يمكن العثور على الموظف المطلوب.
          </p>
        </div>
      </div>
    );
  }

  const { employee } = result;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-white py-8">
      <div className="mx-auto px-6 space-y-6 max-w-6xl print:max-w-full">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between bg-white/95 p-6 rounded-2xl shadow-md border border-gray-200 print:hidden">
          <div className="mb-4 md:mb-0">
            <h1 className="text-3xl font-extrabold text-gray-900">تفاصيل الموظف</h1>
            <p className="text-gray-600 mt-1">عرض بيانات الموظف في المؤسسة</p>
          </div>
          <div className="print:hidden flex flex-wrap gap-4">
            <Link
              href={`/employees/${id}/security-notes`}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-gray-700 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white px-4 py-2 rounded-xl transition-all font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-1 duration-300"
            >
              الملاحظات الأمنية
            </Link>
            <Link
              href="/employees"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-gray-700 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white px-4 py-2 rounded-xl transition-all font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-1 duration-300"
            >
              العودة إلى قائمة الموظفين
            </Link>
          </div>
        </div>

        {/* Photos Section */}
        {(employee.personalImageUrl ||
          employee.idFrontImageUrl ||
          employee.idBackImageUrl) && (
          <Card className="bg-white/95 border-gray-200 shadow-xl">
            <CardHeader>
              <CardTitle className="text-xl text-gray-900">
                صور ووثائق الموظف
              </CardTitle>
              <CardDescription>
                الصورة الشخصية وصورة البطاقة الشخصية
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-8 justify-center">
                {employee.personalImageUrl && (
                  <div className="text-center">
                    <h4 className="text-sm font-medium mb-3 text-gray-700">
                      الصورة الشخصية
                    </h4>
                    <img
                      src={employee.personalImageUrl}
                      alt={`صورة ${employee.name}`}
                      width={176}
                      height={224}
                      className="w-44 h-56 object-cover rounded-xl border-2 border-gray-200 shadow-md"
                    />
                  </div>
                )}
                {employee.idFrontImageUrl && (
                  <div className="text-center">
                    <h4 className="text-sm font-medium mb-3 text-gray-700">
                      وجه البطاقة
                    </h4>
                    <img
                      src={employee.idFrontImageUrl}
                      alt="وجه البطاقة"
                      width={288}
                      height={208}
                      className="w-72 h-52 object-cover rounded-xl border-2 border-gray-200 shadow-md"
                    />
                  </div>
                )}
                {employee.idBackImageUrl && (
                  <div className="text-center">
                    <h4 className="text-sm font-medium mb-3 text-gray-700">
                      ظهر البطاقة
                    </h4>
                    <img
                      src={employee.idBackImageUrl}
                      alt="ظهر البطاقة"
                      width={288}
                      height={208}
                      className="w-72 h-52 object-cover rounded-xl border-2 border-gray-200 shadow-md"
                    />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 print:gap-4">
          {/* Personal Information Table */}
          <div>
            <h2 className="text-xl font-medium mb-3 text-gray-800 bg-gray-100 p-3 rounded-t-xl">
              المعلومات الشخصية
            </h2>
            <table className="w-full border-collapse border border-gray-200 text-base">
              <tbody>
                <tr className="border-b border-gray-200">
                  <td className="bg-gray-50 font-medium p-3 w-1/3 border-r border-gray-200">
                    الاسم الكامل
                  </td>
                  <td className="p-3">{employee.name}</td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="bg-gray-50 font-medium p-3 border-r border-gray-200">
                    اسم الشهرة
                  </td>
                  <td className="p-3">{employee.nickName}</td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="bg-gray-50 font-medium p-3 border-r border-gray-200">
                    رقم البطاقة
                  </td>
                  <td className="p-3">{employee.nationalId}</td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="bg-gray-50 font-medium p-3 border-r border-gray-200">
                    المهنة
                  </td>
                  <td className="p-3">{employee.profession}</td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="bg-gray-50 font-medium p-3 border-r border-gray-200">
                    الوظيفة
                  </td>
                  <td className="p-3">{getJobPositionLabel(employee.jobPosition)}</td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="bg-gray-50 font-medium p-3 border-r border-gray-200">
                    الدرجة العلمية
                  </td>
                  <td className="p-3">{getEducationalDegreeLabel(employee.educationalDegree)}</td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="bg-gray-50 font-medium p-3 border-r border-gray-200">
                    الدرجة الوظيفية
                  </td>
                  <td className="p-3">{getFunctionalDegreeLabel(employee.functionalDegree)}</td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="bg-gray-50 font-medium p-3 border-r border-gray-200">
                    تاريخ الميلاد
                  </td>
                  <td className="p-3">
                    {new Date(employee.birthDate).toLocaleDateString("ar-EG-u-nu-arab", {
                      year: "numeric",
                      month: "2-digit",
                      day: "2-digit",
                    })}
                  </td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="bg-gray-50 font-medium p-3 border-r border-gray-200">
                    الحالة الاجتماعية
                  </td>
                  <td className="p-3">
                    {formateMaritalStatus(employee.maritalStatus)}
                  </td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="bg-gray-50 font-medium p-3 border-r border-gray-200">
                    رقم الهاتف
                  </td>
                  <td className="p-3">{employee.phoneNumber}</td>
                </tr>
                {employee.email && (
                  <tr className="border-b border-gray-200">
                    <td className="bg-gray-50 font-medium p-3 border-r border-gray-200">
                      البريد الإلكتروني
                    </td>
                    <td className="p-3">{employee.email}</td>
                  </tr>
                )}
                <tr>
                  <td className="bg-gray-50 font-medium p-3 border-r border-gray-200">
                    العنوان التفصيلي
                  </td>
                  <td className="p-3">{employee.residenceLocation}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Work Information Table */}
          <div>
            <h2 className="text-xl font-medium mb-3 text-gray-800 bg-gray-100 p-3 rounded-t-xl">
              المعلومات الوظيفية
            </h2>
            <table className="w-full border-collapse border border-gray-200 text-base mb-6">
              <tbody>
                <tr className="border-b border-gray-200">
                  <td className="bg-gray-50 font-medium p-3 w-1/3 border-r border-gray-200">
                    الإدارة
                  </td>
                  <td className="p-3">{employee.administration}</td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="bg-gray-50 font-medium p-3 border-r border-gray-200">
                    العمل الفعلي
                  </td>
                  <td className="p-3">{employee.actualWork}</td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="bg-gray-50 font-medium p-3 border-r border-gray-200">
                    تاريخ التعيين
                  </td>
                  <td className="p-3">
                    {new Date(employee.hiringDate).toLocaleDateString("ar-EG-u-nu-arab", {
                      year: "numeric",
                      month: "2-digit",
                      day: "2-digit",
                    })}
                  </td>
                </tr>
                <tr>
                  <td className="bg-gray-50 font-medium p-3 border-r border-gray-200">
                    نوع التعيين
                  </td>
                  <td className="p-3">
                    {formateHiringType(employee.hiringType)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Family Relationships Table */}
        {employee.relationships && employee.relationships.length > 0 && (
          <div className="mt-8">
            <h2 className="text-xl font-medium mb-3 text-gray-800 bg-gray-100 p-3 rounded-t-xl">
              العلاقات العائلية
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-200 text-base">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border border-gray-200 p-3 text-center font-medium">
                      نوع القرابة
                    </th>
                    <th className="border border-gray-200 p-3 text-center font-medium">
                      الاسم
                    </th>
                    <th className="border border-gray-200 p-3 text-center font-medium">
                      رقم البطاقة
                    </th>
                    <th className="border border-gray-200 p-3 text-center font-medium">
                      تاريخ الميلاد
                    </th>
                    <th className="border border-gray-200 p-3 text-center font-medium">
                      مكان الميلاد
                    </th>
                    <th className="border border-gray-200 p-3 text-center font-medium">
                      المهنة
                    </th>
                    <th className="border border-gray-200 p-3 text-center font-medium">
                      محل الإقامة
                    </th>
                    <th className="border border-gray-200 p-3 text-center font-medium">
                      ملاحظات
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {employee.relationships.map((relationship, index: number) => (
                    <tr
                      key={relationship.id}
                      className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                    >
                      <td className="border border-gray-200 p-3 text-center font-medium">
                        {RELATIONSHIP_LABELS[relationship.relationshipType] ||
                          relationship.relationshipType}
                      </td>
                      <td className="border border-gray-200 p-3">
                        {relationship.name}
                      </td>
                      <td className="border border-gray-200 p-3 text-center">
                        {relationship.nationalId}
                      </td>
                      <td className="border border-gray-200 p-3 text-center">
                        {relationship.birthDate
                          ? new Date(relationship.birthDate).toLocaleDateString(
                              "ar-EG-u-nu-arab",
                              {
                                year: "numeric",
                                month: "2-digit",
                                day: "2-digit",
                              }
                            )
                          : "-"}
                      </td>
                      <td className="border border-gray-200 p-3">
                        {relationship.birthPlace || "-"}
                      </td>
                      <td className="border border-gray-200 p-3">
                        {relationship.profession || "-"}
                      </td>
                      <td className="border border-gray-200 p-3">
                        {relationship.residenceLocation}
                      </td>
                      <td className="border border-gray-200 p-3">
                        {relationship.notes || "-"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* No Relationships Message */}
        {(!employee.relationships || employee.relationships.length === 0) && (
          <div className="mt-8">
            <h2 className="text-xl font-medium mb-3 text-gray-800 bg-gray-100 p-3 rounded-t-xl">
              العلاقات العائلية
            </h2>
            <div className="border border-gray-200 p-8 text-center bg-gray-50">
              <p className="text-gray-600 text-base">
                لا توجد علاقات عائلية مسجلة
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployeeDetailsPage;