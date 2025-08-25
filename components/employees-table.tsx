// components/employees-table.tsx
"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Employee } from "@/types";
import { useRouter } from "next/navigation";
import { formateHiringType } from "@/lib/utils";

interface EmployeesTableProps {
  employees: Employee[];
  onEmployeeDeleted?: () => void;
}

export function EmployeesTable({
  employees,
  onEmployeeDeleted,
}: EmployeesTableProps) {
  const router = useRouter();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Normalize date input (Date | string | undefined)
  const formatDate = (dateLike?: Date | string | null) => {
    if (!dateLike) return "-";
    const date = dateLike instanceof Date ? dateLike : new Date(dateLike);
    if (isNaN(date.getTime())) return "-";
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`هل أنت متأكد من حذف الموظف "${name}"؟`)) {
      return;
    }

    setDeletingId(id);
    try {
      // استدعاء API route مسؤول عن حذف الموظف (لازم تنشئه لو مش موجود)
      const res = await fetch(`/api/employees/${encodeURIComponent(id)}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const result = await res.json().catch(() => ({ success: false, error: "خطأ في استجابة السيرفر" }));

      if (res.ok && result.success) {
        // حدث الحذف بنجاح
        // لو عايز نجيب الداتا الجديدة من السيرفر
        router.refresh();
        onEmployeeDeleted?.();
      } else {
        alert(result.error || "حدث خطأ أثناء حذف الموظف");
      }
    } catch (error) {
      console.error("delete error:", error);
      alert("حدث خطأ أثناء حذف الموظف");
    } finally {
      setDeletingId(null);
    }
  };

  if (!employees || employees.length === 0) {
    return (
      <Card>
        <CardContent className="py-8">
          <div className="text-center text-gray-500">
            <p className="text-lg">لا توجد موظفين مسجلين</p>
            <p className="text-sm">قم بإضافة موظف جديد باستخدام النموذج أعلاه</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="overflow-x-auto hidden md:block">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b">
              <th className="text-right p-3 font-semibold bg-gray-50">الاسم</th>
              <th className="text-right p-3 font-semibold bg-gray-50">اسم الشهرة</th>
              <th className="text-right p-3 font-semibold bg-gray-50">المهنة</th>
              <th className="text-right p-3 font-semibold bg-gray-50">رقم البطاقة</th>
              <th className="text-right p-3 font-semibold bg-gray-50">الإدارة</th>
              <th className="text-right p-3 font-semibold bg-gray-50">نوع التعيين</th>
              <th className="text-right p-3 font-semibold bg-gray-50">تاريخ التعيين</th>
              <th className="text-right p-3 font-semibold bg-gray-50">رقم الهاتف</th>
              <th className="text-center p-3 font-semibold bg-gray-50">الإجراءات</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((employee) => (
              <tr key={employee.id} className="border-b hover:bg-gray-50">
                <td className="p-3" dir="rtl">{employee.name}</td>
                <td className="p-3" dir="rtl">{employee.nickName}</td>
                <td className="p-3" dir="rtl">{employee.profession}</td>
                <td className="p-3">{employee.nationalId}</td>
                <td className="p-3" dir="rtl">{employee.administration}</td>
                <td className="p-3" dir="rtl">{formateHiringType(employee.hiringType)}</td>
                <td className="p-3">{formatDate(employee.hiringDate)}</td>
                <td className="p-3">{employee.phoneNumber}</td>
                <td className="p-3 text-center">
                  <div className="flex justify-center gap-2">
                    <Button
                      className="cursor-pointer"
                      variant="outline"
                      size="sm"
                      onClick={() => router.push(`/employees/employee/${employee.id}`)}
                    >
                      عرض
                    </Button>
                    <Button
                      className="cursor-pointer"
                      variant="default"
                      size="sm"
                      onClick={() => router.push(`/employees/${employee.id}`)}
                    >
                      تعديل
                    </Button>
                    <Button
                      className="cursor-pointer"
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(employee.id, employee.name)}
                      disabled={deletingId === employee.id}
                    >
                      {deletingId === employee.id ? "حذف..." : "حذف"}
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile-friendly cards view */}
      <div className="md:hidden space-y-4 mt-4">
        {employees.map((employee) => (
          <Card key={employee.id} className="p-4">
            <div className="space-y-2">
              <div className="flex justify-between items-start">
                <h3 className="font-semibold text-lg" dir="rtl">{employee.name}</h3>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => router.push(`/employees/employee/${employee.id}`)}
                  >
                    عرض
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    disabled={deletingId === employee.id}
                    onClick={() => handleDelete(employee.id, employee.name)}
                  >
                    {deletingId === employee.id ? "حذف..." : "حذف"}
                  </Button>
                </div>
              </div>
              <div className="grid grid-cols-1 gap-1 text-sm">
                <p><span className="font-medium">اسم الشهرة:</span> <span dir="rtl">{employee.nickName}</span></p>
                <p><span className="font-medium">المهنة:</span> <span dir="rtl">{employee.profession}</span></p>
                <p><span className="font-medium">رقم البطاقة:</span> {employee.nationalId}</p>
                <p><span className="font-medium">الإدارة:</span> <span dir="rtl">{employee.administration}</span></p>
                <p><span className="font-medium">نوع التعيين:</span> <span dir="rtl">{formateHiringType(employee.hiringType)}</span></p>
                <p><span className="font-medium">تاريخ التعيين:</span> {formatDate(employee.hiringDate)}</p>
                <p><span className="font-medium">رقم الهاتف:</span> {employee.phoneNumber}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
