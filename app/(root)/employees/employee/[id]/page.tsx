import { getEmployeeById } from "@/lib/actions/employee.actions";
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

const EmployeeDetailsPage = async (props: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await props.params;

  const result = await getEmployeeById(id);

  if (!result.success || !result.employee) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-2xl font-bold text-red-600">الموظف غير موجود</h1>
          <p className="text-gray-600 mt-2">
            لا يمكن العثور على الموظف المطلوب.
          </p>
        </div>
      </div>
    );
  }

  const { employee } = result;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between bg-white p-6 rounded-lg shadow-sm">
          <div className="mb-4 md:mb-0">
            <h1 className="text-3xl font-bold text-gray-900">تفاصيل الموظف</h1>
            <p className="text-gray-600 mt-1">عرض بيانات الموظف في المؤسسة</p>
          </div>
          <Link
            href="/"
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            العودة إلى قائمة الموظفين
          </Link>
        </div>

        {/* Employee Images Section */}
        {(employee.personalImageUrl ||
          employee.idFrontImageUrl ||
          employee.idBackImageUrl) && (
          <Card>
            <CardHeader>
              <CardTitle className="text-xl text-gray-900">
                صور ووثائق الموظف
              </CardTitle>
              <CardDescription>الصورة الشخصية ووثائق الهوية</CardDescription>
            </CardHeader>
            <CardContent>
              <EmployeeImages
                personalImageUrl={employee.personalImageUrl}
                idFrontImageUrl={employee.idFrontImageUrl}
                idBackImageUrl={employee.idBackImageUrl}
                employeeName={employee.name}
              />
            </CardContent>
          </Card>
        )}

        {/* Employee Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl text-gray-900">
              المعلومات الأساسية
            </CardTitle>
            <CardDescription>البيانات الشخصية والوظيفية للموظف</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  الاسم الكامل
                </label>
                <p className="text-gray-900 bg-gray-50 p-3 rounded-md">
                  {employee.name}
                </p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  اسم الشهرة
                </label>
                <p className="text-gray-900 bg-gray-50 p-3 rounded-md">
                  {employee.nickName}
                </p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  رقم البطاقة
                </label>
                <p className="text-gray-900 bg-gray-50 p-3 rounded-md">
                  {employee.nationalId}
                </p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  المهنة
                </label>
                <p className="text-gray-900 bg-gray-50 p-3 rounded-md">
                  {employee.profession}
                </p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  تاريخ الميلاد
                </label>
                <p className="text-gray-900 bg-gray-50 p-3 rounded-md">
                  {new Date(employee.birthDate).toLocaleDateString("ar-SA")}
                </p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  الحالة الاجتماعية
                </label>
                <p className="text-gray-900 bg-gray-50 p-3 rounded-md">
                  {formateMaritalStatus(employee.maritalStatus)}
                </p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  رقم الهاتف
                </label>
                <p className="text-gray-900 bg-gray-50 p-3 rounded-md">
                  {employee.phoneNumber}
                </p>
              </div>

              {employee.email && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    البريد الإلكتروني
                  </label>
                  <p className="text-gray-900 bg-gray-50 p-3 rounded-md">
                    {employee.email}
                  </p>
                </div>
              )}
            </div>

            <Separator className="my-6" />

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  العنوان التفصيلي
                </label>
                <p className="text-gray-900 bg-gray-50 p-3 rounded-md">
                  {employee.residenceLocation}
                </p>
              </div>

              {employee.notes && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    ملاحظات
                  </label>
                  <p className="text-gray-900 bg-gray-50 p-3 rounded-md">
                    {employee.notes}
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Work Information */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl text-gray-900">
              المعلومات الوظيفية
            </CardTitle>
            <CardDescription>بيانات العمل والتوظيف</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  الإدارة
                </label>
                <p className="text-gray-900 bg-gray-50 p-3 rounded-md">
                  {employee.administration}
                </p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  العمل الفعلي
                </label>
                <p className="text-gray-900 bg-gray-50 p-3 rounded-md">
                  {employee.actualWork}
                </p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  تاريخ التعيين
                </label>
                <p className="text-gray-900 bg-gray-50 p-3 rounded-md">
                  {new Date(employee.hiringDate).toLocaleDateString("ar-SA")}
                </p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  نوع التعيين
                </label>
                <p className="text-gray-900 bg-gray-50 p-3 rounded-md">
                  {formateHiringType(employee.hiringType)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Relationships Section */}
        {employee.relationships && employee.relationships.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-xl text-gray-900">
                العلاقات العائلية
              </CardTitle>
              <CardDescription>معلومات الأقارب والعائلة</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {employee.relationships.map(
                  (relationship: any, index: number) => (
                    <div
                      key={relationship.id}
                      className="border rounded-lg p-4 bg-white"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {relationship.relationshipType}
                        </h3>
                        <span className="text-sm text-gray-500">
                          #{index + 1}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-700">
                            الاسم
                          </label>
                          <p className="text-gray-900 bg-gray-50 p-2 rounded-md text-sm">
                            {relationship.name}
                          </p>
                        </div>

                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-700">
                            رقم البطاقة
                          </label>
                          <p className="text-gray-900 bg-gray-50 p-2 rounded-md text-sm">
                            {relationship.nationalId}
                          </p>
                        </div>

                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-700">
                            تاريخ الميلاد
                          </label>
                          <p className="text-gray-900 bg-gray-50 p-2 rounded-md text-sm">
                            {new Date(
                              relationship.birthDate
                            ).toLocaleDateString("ar-SA")}
                          </p>
                        </div>

                        {relationship.birthPlace && (
                          <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">
                              مكان الميلاد
                            </label>
                            <p className="text-gray-900 bg-gray-50 p-2 rounded-md text-sm">
                              {relationship.birthPlace}
                            </p>
                          </div>
                        )}

                        {relationship.profession && (
                          <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">
                              المهنة
                            </label>
                            <p className="text-gray-900 bg-gray-50 p-2 rounded-md text-sm">
                              {relationship.profession}
                            </p>
                          </div>
                        )}

                        {relationship.spouseName && (
                          <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">
                              اسم الزوج/الزوجة
                            </label>
                            <p className="text-gray-900 bg-gray-50 p-2 rounded-md text-sm">
                              {relationship.spouseName}
                            </p>
                          </div>
                        )}

                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-700">
                            محل الإقامة
                          </label>
                          <p className="text-gray-900 bg-gray-50 p-2 rounded-md text-sm">
                            {relationship.residenceLocation}
                          </p>
                        </div>

                        {relationship.notes && (
                          <div className="space-y-2 md:col-span-2 lg:col-span-3">
                            <label className="text-sm font-medium text-gray-700">
                              ملاحظات
                            </label>
                            <p className="text-gray-900 bg-gray-50 p-2 rounded-md text-sm">
                              {relationship.notes}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  )
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* No Relationships Message */}
        {(!employee.relationships || employee.relationships.length === 0) && (
          <Card>
            <CardHeader>
              <CardTitle className="text-xl text-gray-900">
                العلاقات العائلية
              </CardTitle>
              <CardDescription>معلومات الأقارب والعائلة</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <div className="text-gray-400 mb-2">
                  <svg
                    className="mx-auto h-12 w-12"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1}
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-1">
                  لا توجد علاقات عائلية مسجلة
                </h3>
                <p className="text-gray-500">
                  لم يتم إضافة أي معلومات عن الأقارب لهذا الموظف
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Metadata */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl text-gray-900">
              معلومات النظام
            </CardTitle>
            <CardDescription>تواريخ الإنشاء والتحديث</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  تاريخ الإنشاء
                </label>
                <p className="text-gray-900 bg-gray-50 p-3 rounded-md">
                  {new Date(employee.createdAt).toLocaleString("ar-SA")}
                </p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  تاريخ آخر تحديث
                </label>
                <p className="text-gray-900 bg-gray-50 p-3 rounded-md">
                  {new Date(employee.updatedAt).toLocaleString("ar-SA")}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EmployeeDetailsPage;
