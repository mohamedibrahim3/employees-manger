"use client";

import { useEffect, useState } from "react";
import { getEmployeeById } from "@/lib/actions/employee.actions";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const RELATIONSHIP_LABELS: Record<string, string> = {
  father: "بيانات الأب",
  mother: "بيانات الأم",
  spouse: "بيانات الزوج/الزوجة",
  son: "بيانات الابن",
  daughter: "بيانات الابنة",
  brother: "بيانات الأخ",
  sister: "بيانات الأخت",
};

export default function EmployeeDetailsPage() {
  const searchParams = useSearchParams();
  const employeeId = searchParams.get("id");
  const [employee, setEmployee] = useState<any>(null);

  useEffect(() => {
    if (employeeId) {
      getEmployeeById(employeeId).then((data) => {
        setEmployee(data);
      });
    }
  }, [employeeId]);

  if (!employee) {
    return <p>جاري تحميل بيانات الموظف...</p>;
  }

  return (
    <div className="p-6 space-y-6">
      {/* Personal Info */}
      <Card>
        <CardHeader>
          <CardTitle>البيانات الشخصية</CardTitle>
          <CardDescription>تفاصيل أساسية عن الموظف</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-4">
          <p>الاسم: {employee.name}</p>
          <p>الرقم القومي: {employee.nationalId}</p>
          <p>تاريخ الميلاد: {employee.birthDate}</p>
          <p>محل الميلاد: {employee.birthPlace}</p>
          <p>الديانة: {employee.religion}</p>
          <p>الحالة الاجتماعية: {employee.maritalStatus}</p>
          <p>الوظيفة: {employee.jobTitle}</p>
          <p>الإدارة: {employee.administration}</p>
          <p>المنطقة: {employee.region}</p>
        </CardContent>
      </Card>

      {/* Contact Info */}
      <Card>
        <CardHeader>
          <CardTitle>بيانات الاتصال</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-4">
          <p>رقم الهاتف: {employee.phone}</p>
          <p>البريد الإلكتروني: {employee.email}</p>
          <p>العنوان: {employee.address}</p>
        </CardContent>
      </Card>

      {/* Relationships Section */}
      {employee.relationships && employee.relationships.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>البيانات العائلية</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {employee.relationships.map((rel: any, index: number) => (
              <div key={index} className="border p-3 rounded-lg">
                <p>{RELATIONSHIP_LABELS[rel.relationshipType] || "بيانات أخرى"}</p>
                <Separator className="my-2" />
                <p>الاسم: {rel.name}</p>
                <p>الرقم القومي: {rel.nationalId || "غير متوفر"}</p>
                <p>تاريخ الميلاد: {rel.birthDate || "غير متوفر"}</p>
                <p>محل الميلاد: {rel.birthPlace || "غير متوفر"}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Images */}
      <Card>
        <CardHeader>
          <CardTitle>الصور</CardTitle>
          <CardDescription>الصورة الشخصية ووثائق الهوية</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-4">
          {employee.profileImage && (
            <div>
              <p>الصورة الشخصية:</p>
              <Image
                src={employee.profileImage}
                alt="صورة الموظف"
                width={150}
                height={150}
                className="rounded-lg"
              />
            </div>
          )}
          {employee.nationalIdFront && (
            <div>
              <p>الرقم القومي (الوجه الأمامي):</p>
              <Image
                src={employee.nationalIdFront}
                alt="الوجه الأمامي للرقم القومي"
                width={200}
                height={120}
                className="rounded-lg"
              />
            </div>
          )}
          {employee.nationalIdBack && (
            <div>
              <p>الرقم القومي (الوجه الخلفي):</p>
              <Image
                src={employee.nationalIdBack}
                alt="الوجه الخلفي للرقم القومي"
                width={200}
                height={120}
                className="rounded-lg"
              />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
