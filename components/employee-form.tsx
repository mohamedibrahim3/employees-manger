"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import type { Resolver } from "react-hook-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import {
  Plus,
  Trash2,
  User,
  Users,
  X,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Briefcase,
  Building2,
} from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useForm, useFieldArray, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import dayjs from "dayjs";
import "dayjs/locale/ar";
import { createEmployee, deleteEmployee } from "@/lib/actions/employee.actions";
import {
  createEmployeeApiSchema,
  createEmployeeFormSchema,
} from "@/lib/validators";
import { updateEmployee } from "@/lib/actions/employee.actions";
import { useEdgeStore } from "@/lib/edgestore";
import { SingleImageDropzone } from "./upload/single-image";
import { UploaderProvider } from "./upload/uploader-provider";

dayjs.locale("ar");

const formatDateToInput = (date: Date | undefined): string => {
  if (!date) return "";
  return dayjs(date).format("DD/MM/YYYY");
};

const handleDateChange = (value: string): string => {
  let formatted = value.replace(/\D/g, ""); // إزالة أي شيء غير رقم
  if (formatted.length >= 5) {
    formatted = formatted.replace(/(\d{2})(\d{2})(\d{0,4})/, "$1/$2/$3");
  } else if (formatted.length >= 3) {
    formatted = formatted.replace(/(\d{2})(\d{0,2})/, "$1/$2");
  }
  return formatted;
};

interface EmployeeData {
  name: string;
  nickName: string;
  profession: string;
  birthDate: Date;
  nationalId: string;
  maritalStatus: string;
  residenceLocation: string;
  hiringDate: Date;
  hiringType: string;
  email?: string;
  administration: string;
  actualWork: string;
  phoneNumber: string;
  notes: string;
  personalImageUrl?: string;
  idFrontImageUrl?: string;
  idBackImageUrl?: string;
  relationships: {
    relationshipType: string;
    name: string;
    nationalId: string | null;
    birthDate: Date | null;
    birthPlace?: string | null;
    profession?: string | null;
    spouseName?: string | null;
    residenceLocation: string | null;
    notes?: string | null;
  }[];
  jobPosition?: string;
  educationalDegree?: string;
  functionalDegree?: string;
}

type FormData = z.infer<typeof createEmployeeFormSchema>;

const EmployeeForm = ({
  type,
  employee,
  employeeId,
}: {
  type: "Create" | "Update";
  employee?: EmployeeData;
  employeeId?: string;
}) => {
  const router = useRouter();
  const { edgestore } = useEdgeStore();
  const [goToNotes, setGoToNotes] = useState(false);

  const [personalPhotoUrl, setPersonalPhotoUrl] = useState<string | undefined>(
    employee?.personalImageUrl
  );
  const [idFrontUrl, setIdFrontUrl] = useState<string | undefined>(
    employee?.idFrontImageUrl
  );
  const [idBackUrl, setIdBackUrl] = useState<string | undefined>(
    employee?.idBackImageUrl
  );

  const createUploadFn =
    (setImageUrl: (url: string | undefined) => void) =>
    async ({
      file,
      signal,
      onProgressChange,
    }: {
      file: File;
      signal: AbortSignal;
      onProgressChange: (progress: number) => void;
    }) => {
      try {
        const res = await edgestore.MyEmployeesManager.upload({
          file,
          signal,
          onProgressChange,
        });

        setImageUrl(res.url);
        return { url: res.url };
      } catch (error) {
        onProgressChange(0);
        toast.error("فشل في رفع الصورة");
        throw error;
      }
    };

  const removeImage = async (
    imageUrl: string | undefined,
    setImageUrl: (url: string | undefined) => void
  ) => {
    if (imageUrl) {
      const confirmed = window.confirm("هل أنت متأكد من حذف هذه الصورة؟");
      if (!confirmed) return;

      setImageUrl(undefined);
      toast("تم إزالة الصورة من النموذج");

      edgestore.MyEmployeesManager.delete({
        url: imageUrl,
      })
        .then(() => {
          console.log("Image deleted from EdgeStore successfully");
        })
        .catch((error) => {
          console.warn(
            "Could not delete from EdgeStore (non-critical):",
            error
          );
        });
    }
  };

  const form = useForm<FormData>({
    resolver: zodResolver(
      createEmployeeFormSchema
    ) as unknown as Resolver<FormData>,
    defaultValues: {
      name: employee?.name || "",
      nickName: employee?.nickName || "",
      profession: employee?.profession || "",
      birthDate: formatDateToInput(employee?.birthDate),
      nationalId: employee?.nationalId || "",
      maritalStatus: employee?.maritalStatus || "single",
      residenceLocation: employee?.residenceLocation || "",
      hiringDate: formatDateToInput(employee?.hiringDate),
      hiringType: employee?.hiringType || "",
      email: employee?.email || "",
      administration: employee?.administration || "",
      actualWork: employee?.actualWork || "",
      phoneNumber: employee?.phoneNumber || "",
      personalPhoto: employee?.personalImageUrl || "",
      frontIdCard: employee?.idFrontImageUrl || "",
      backIdCard: employee?.idBackImageUrl || "",
      relationships:
        employee?.relationships?.map((rel) => ({
          relationshipType: rel.relationshipType || "",
          name: rel.name || "",
          nationalId: rel.nationalId || "",
          birthDate: formatDateToInput(rel.birthDate ?? undefined),
          birthPlace: rel.birthPlace || "",
          profession: rel.profession || "",
          spouseName: rel.spouseName || "",
          residenceLocation: rel.residenceLocation || "",
          notes: rel.notes || "",
        })) || [],
      status: (employee as any)?.status || "active",
      jobPosition: (() => {
        const val = employee?.jobPosition;
        const allowed = [
          "ENGINEER",
          "ACCOUNTANT",
          "ADMINISTRATIVE",
          "EXECUTIVE_SUPERVISOR",
          "WRITER",
          "WORKER",
        ] as const;
        return val && (allowed as readonly string[]).includes(val)
          ? (val as FormData["jobPosition"])
          : "";
      })(),
      educationalDegree: (() => {
        const val = employee?.educationalDegree;
        const allowed = [
          "DOCTORATE",
          "MASTERS",
          "BACHELORS",
          "GENERAL_SECONDARY",
          "AZHARI_SECONDARY",
          "ABOVE_AVERAGE",
          "AVERAGE",
          "PREPARATORY",
          "PRIMARY",
          "LITERACY",
          "NONE",
        ] as const;
        return val && (allowed as readonly string[]).includes(val)
          ? (val as FormData["educationalDegree"])
          : "";
      })(),
      functionalDegree: (() => {
        const val = employee?.functionalDegree;
        const allowed = [
          "FIRST_DEPUTY_MINISTER",
          "DEPUTY_MINISTER",
          "GENERAL_MANAGER",
          "DEPARTMENT_MANAGER",
          "DEPARTMENT_HEAD",
          "FIRST_A",
          "FIRST_B",
          "SECOND_A",
          "SECOND_B",
          "THIRD_A",
          "THIRD_B",
          "THIRD_C",
          "FOURTH_A",
          "FOURTH_B",
          "FOURTH_C",
          "FIFTH_A",
          "FIFTH_B",
          "FIFTH_C",
          "SIXTH_A",
          "SIXTH_B",
          "SIXTH_C",
        ] as const;
        return val && (allowed as readonly string[]).includes(val)
          ? (val as FormData["functionalDegree"])
          : "";
      })(),
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "relationships",
  });

  const onSubmit: SubmitHandler<FormData> = async (values) => {
    try {
      const transformedData: EmployeeData = {
        name: values.name,
        nickName: values.nickName || "",
        profession: values.profession || "",
        birthDate: dayjs(values.birthDate, "DD/MM/YYYY").toDate(),
        nationalId: values.nationalId,
        maritalStatus: values.maritalStatus as string,
        residenceLocation: values.residenceLocation || "",
        hiringDate: dayjs(values.hiringDate, "DD/MM/YYYY").toDate(),
        hiringType: values.hiringType,
        email: values.email || undefined,
        administration: values.administration,
        actualWork: values.actualWork || "",
        phoneNumber: values.phoneNumber || "",
        notes: "",
        personalImageUrl: personalPhotoUrl,
        idFrontImageUrl: idFrontUrl,
        idBackImageUrl: idBackUrl,
        relationships: values.relationships.map((rel) => ({
          relationshipType: rel.relationshipType,
          name: rel.name,
          nationalId: rel.nationalId || "",
          birthDate: rel.birthDate
            ? dayjs(rel.birthDate, "DD/MM/YYYY").toDate()
            : null,
          birthPlace: rel.birthPlace || undefined,
          profession: rel.profession || undefined,
          spouseName: rel.spouseName || undefined,
          residenceLocation: rel.residenceLocation || "",
          notes: rel.notes || undefined,
        })),
        jobPosition: values.jobPosition || undefined,
        educationalDegree: values.educationalDegree || undefined,
        functionalDegree: values.functionalDegree || undefined,
      };

      let result;
      if (type === "Update" && employeeId) {
        result = await updateEmployee(
          employeeId,
          transformedData as z.infer<typeof createEmployeeApiSchema>
        );
      } else {
        result = await createEmployee(
          transformedData as z.infer<typeof createEmployeeApiSchema>
        );
      }

      if (result.success && result.employee) {
        toast(
          type === "Update" ? "تم تحديث الموظف بنجاح" : "تم إنشاء الموظف بنجاح"
        );
        setTimeout(() => {
          if (goToNotes) {
            window.location.href = `/employees/${result.employee.id}/security-notes`;
          } else {
            window.location.href = "/employees";
          }
        }, 1000);
      } else {
        toast(
          result.error ||
            (type === "Update"
              ? "حدث خطأ أثناء تحديث الموظف"
              : "حدث خطأ أثناء إنشاء الموظف")
        );
      }
    } catch (error) {
      console.error("Submit error:", error);
      toast(
        type === "Update"
          ? "حدث خطأ أثناء تحديث الموظف"
          : "حدث خطأ أثناء إنشاء الموظف"
      );
    }
  };

  const addRelationship = () => {
    append({
      relationshipType: "",
      name: "",
      nationalId: "",
      birthDate: "",
      birthPlace: "",
      profession: "",
      spouseName: "",
      residenceLocation: "",
      notes: "",
    });
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8"
        lang="ar"
        dir="rtl"
      >
        {/* Basic Employee Information */}
        <Card className="overflow-hidden shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl font-bold">
              <User className="h-6 w-6 text-blue-600" />
              المعلومات الأساسية
            </CardTitle>
            <CardDescription className="text-gray-600">
              تفاصيل الموظف الشخصية والمهنية
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6 space-y-8">
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-4">
                <User className="h-5 w-5 text-gray-500" />
                <h3 className="text-lg font-semibold text-gray-800">
                  المعلومات الشخصية
                </h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2 font-medium">
                        الاسم رباعي *
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="ادخل الاسم الكامل"
                          {...field}
                          className="border-gray-300 focus:border-blue-500"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="nickName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2 font-medium">
                        اسم الشهرة
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="ادخل اسم الشهرة"
                          {...field}
                          className="border-gray-300 focus:border-blue-500"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="birthDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2 font-medium">
                        تاريخ الميلاد *
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="DD/MM/YYYY"
                          maxLength={10}
                          {...field}
                          onChange={(e) =>
                            field.onChange(handleDateChange(e.target.value))
                          }
                          className="border-gray-300 focus:border-blue-500"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="nationalId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2 font-medium">
                        رقم البطاقة *
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="ادخل رقم البطاقة"
                          {...field}
                          onChange={(e) => {
                            const value = e.target.value.replace(/[^0-9]/g, "");
                            field.onChange(value);
                          }}
                          className="border-gray-300 focus:border-blue-500"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="maritalStatus"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2 font-medium">
                        الحالة الاجتماعية *
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="border-gray-300 focus:border-blue-500">
                            <SelectValue placeholder="اختر الحالة الاجتماعية" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="single">أعزب</SelectItem>
                          <SelectItem value="married">متزوج</SelectItem>
                          <SelectItem value="divorced">مطلق</SelectItem>
                          <SelectItem value="widowed">أرمل</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <Separator className="my-6" />

            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-4">
                <MapPin className="h-5 w-5 text-gray-500" />
                <h3 className="text-lg font-semibold text-gray-800">
                  معلومات الاتصال
                </h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="phoneNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2 font-medium">
                        رقم الهاتف
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="أدخل رقم الهاتف"
                          {...field}
                          className="border-gray-300 focus:border-blue-500"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2 font-medium">
                        البريد الإلكتروني
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="أدخل عنوان البريد الإلكتروني"
                          {...field}
                          className="border-gray-300 focus:border-blue-500"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="residenceLocation"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel className="flex items-center gap-2 font-medium">
                        العنوان التفصيلي
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="ادخل العنوان التفصيلي"
                          {...field}
                          className="border-gray-300 focus:border-blue-500 min-h-[80px]"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <Separator className="my-6" />
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-4">
                <Briefcase className="h-5 w-5 text-gray-500" />
                <h3 className="text-lg font-semibold text-gray-800">
                  المعلومات المهنية
                </h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="profession"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2 font-medium">
                        المهنة
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="ادخل المهنة"
                          {...field}
                          className="border-gray-300 focus:border-blue-500"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="jobPosition"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2 font-medium">
                        الوظيفة
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="border-gray-300 focus:border-blue-500">
                            <SelectValue placeholder="اختر الوظيفة" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="ENGINEER">مهندس</SelectItem>
                          <SelectItem value="ACCOUNTANT">محاسب</SelectItem>
                          <SelectItem value="ADMINISTRATIVE">إداري</SelectItem>
                          <SelectItem value="EXECUTIVE_SUPERVISOR">
                            مشرف تنفيذ
                          </SelectItem>
                          <SelectItem value="WRITER">كاتب</SelectItem>
                          <SelectItem value="WORKER">عامل</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="educationalDegree"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2 font-medium">
                        الدرجة العلمية
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="border-gray-300 focus:border-blue-500">
                            <SelectValue placeholder="اختر الدرجة العلمية" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="DOCTORATE">دكتوراة</SelectItem>
                          <SelectItem value="MASTERS">ماجستير</SelectItem>
                          <SelectItem value="BACHELORS">بكالوريوس</SelectItem>
                          <SelectItem value="GENERAL_SECONDARY">
                            ثانوية عامة
                          </SelectItem>
                          <SelectItem value="AZHARI_SECONDARY">
                            ثانوية أزهرية
                          </SelectItem>
                          <SelectItem value="ABOVE_AVERAGE">
                            مؤهل فوق متوسط
                          </SelectItem>
                          <SelectItem value="AVERAGE">مؤهل متوسط</SelectItem>
                          <SelectItem value="PREPARATORY">اعدادية</SelectItem>
                          <SelectItem value="PRIMARY">ابتدائية</SelectItem>
                          <SelectItem value="LITERACY">محو أمية</SelectItem>
                          <SelectItem value="NONE">بدون</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="functionalDegree"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2 font-medium">
                        الدرجة الوظيفية
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="border-gray-300 focus:border-blue-500">
                            <SelectValue placeholder="اختر الدرجة الوظيفية" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="FIRST_DEPUTY_MINISTER">
                            وكيل أول وزارة
                          </SelectItem>
                          <SelectItem value="DEPUTY_MINISTER">
                            وكيل وزارة
                          </SelectItem>
                          <SelectItem value="GENERAL_MANAGER">
                            مدير عام
                          </SelectItem>
                          <SelectItem value="DEPARTMENT_MANAGER">
                            مدير إدارة
                          </SelectItem>
                          <SelectItem value="DEPARTMENT_HEAD">
                            رئيس قسم
                          </SelectItem>
                          <SelectItem value="FIRST_A">أولى أ</SelectItem>
                          <SelectItem value="FIRST_B">أولى ب</SelectItem>
                          <SelectItem value="SECOND_A">ثانية أ</SelectItem>
                          <SelectItem value="SECOND_B">ثانية ب</SelectItem>
                          <SelectItem value="THIRD_A">ثالثة أ</SelectItem>
                          <SelectItem value="THIRD_B">ثالثة ب</SelectItem>
                          <SelectItem value="THIRD_C">ثالثة ج</SelectItem>
                          <SelectItem value="FOURTH_A">رابعة أ</SelectItem>
                          <SelectItem value="FOURTH_B">رابعة ب</SelectItem>
                          <SelectItem value="FOURTH_C">رابعة ج</SelectItem>
                          <SelectItem value="FIFTH_A">خامسة أ</SelectItem>
                          <SelectItem value="FIFTH_B">خامسة ب</SelectItem>
                          <SelectItem value="FIFTH_C">خامسة ج</SelectItem>
                          <SelectItem value="SIXTH_A">سادسة أ</SelectItem>
                          <SelectItem value="SIXTH_B">سادسة ب</SelectItem>
                          <SelectItem value="SIXTH_C">سادسة ج</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="hiringDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2 font-medium">
                        تاريخ التعيين *
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="DD/MM/YYYY"
                          maxLength={10}
                          {...field}
                          onChange={(e) =>
                            field.onChange(handleDateChange(e.target.value))
                          }
                          className="border-gray-300 focus:border-blue-500"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="hiringType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2 font-medium">
                        نوع التعيين *
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="border-gray-300 focus:border-blue-500">
                            <SelectValue placeholder="اختر نوع التعيين" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="full-time">دائم</SelectItem>
                          <SelectItem value="temporary">مؤقت</SelectItem>
                          <SelectItem value="secondment">معار</SelectItem>
                          <SelectItem value="mandate">ندب</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="administration"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2 font-medium">
                        الإدارة والمنطقة التابع لها *
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="border-gray-300 focus:border-blue-500">
                            <SelectValue placeholder="اختر الإدارة و المنطقة" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="الإدارة المركزية للمشروعات">
                            الإدارة المركزية للمشروعات
                          </SelectItem>
                          <SelectItem value="الإدارة العامة للشئون المالية">
                            الإدارة العامة للشئون المالية
                          </SelectItem>
                          <SelectItem value="الإدارة العامة للشئون الإدارية">
                            الإدارة العامة للشئون الإدارية
                          </SelectItem>
                          <SelectItem value="نظم المعلومات والتحول الرقمي">
                            نظم المعلومات والتحول الرقمي
                          </SelectItem>
                          <SelectItem value="المكتب الفني">
                            المكتب الفني
                          </SelectItem>
                          <SelectItem value="العلاقات العامة">
                            العلاقات العامة
                          </SelectItem>
                          <SelectItem value="الأمن">الأمن</SelectItem>
                          <SelectItem value="التعاقدات">التعاقدات</SelectItem>
                          <SelectItem value="الشئون القانونية">
                            الشئون القانونية
                          </SelectItem>
                          <SelectItem value="التنمية المتكاملة">
                            التنمية المتكاملة
                          </SelectItem>
                          <SelectItem value="مكتب رئيس الجهاز">
                            مكتب رئيس الجهاز
                          </SelectItem>
                          <SelectItem value="مكتب نائب رئيس الجهاز">
                            مكتب نائب رئيس الجهاز
                          </SelectItem>
                          <SelectItem value="التخطيط والمتابعة">
                            التخطيط والمتابعة
                          </SelectItem>
                          <SelectItem value="منطقة تعمير شمال سيناء">
                            منطقة تعمير شمال سيناء
                          </SelectItem>
                          <SelectItem value="منطقة تعمير جنوب سيناء">
                            منطقة تعمير جنوب سيناء
                          </SelectItem>
                          <SelectItem value="منطقة تعمير بورسعيد">
                            منطقة تعمير بورسعيد
                          </SelectItem>
                          <SelectItem value="منطقة تعمير الإسماعيلية">
                            منطقة تعمير الإسماعيلية
                          </SelectItem>
                          <SelectItem value="منطقة تعمير القنطرة شرق">
                            منطقة تعمير القنطرة شرق
                          </SelectItem>
                          <SelectItem value="منطقة تعمير السويس">
                            منطقة تعمير السويس
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="actualWork"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2 font-medium">
                        العمل الفعلي
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="أدخل العمل الفعلي"
                          {...field}
                          className="border-gray-300 focus:border-blue-500"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <Separator className="my-6" />

            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-4">
                <Building2 className="h-5 w-5 text-gray-500" />
                <h3 className="text-lg font-semibold text-gray-800">
                  الصور والوثائق
                </h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <User className="h-4 w-4 text-gray-500" />
                    الصورة الشخصية
                  </label>
                  {personalPhotoUrl ? (
                    <div className="relative">
                      <img
                        src={personalPhotoUrl}
                        alt="Personal Photo"
                        className="w-full h-[200px] object-cover rounded-lg border-2 border-gray-200 shadow-md"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        className="absolute top-2 right-2 bg-red-500 hover:bg-red-600"
                        onClick={() =>
                          removeImage(personalPhotoUrl, setPersonalPhotoUrl)
                        }
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <UploaderProvider
                      uploadFn={createUploadFn(setPersonalPhotoUrl)}
                      autoUpload={true}
                    >
                      <SingleImageDropzone
                        height={200}
                        width={200}
                        dropzoneOptions={{
                          maxSize: 1024 * 1024 * 1, // 1 MB
                        }}
                        className="rounded-lg border-2 border-dashed border-gray-300 hover:border-blue-500"
                      />
                    </UploaderProvider>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    صورة البطاقة (أمامي)
                  </label>
                  {idFrontUrl ? (
                    <div className="relative">
                      <img
                        src={idFrontUrl}
                        alt="ID Front"
                        className="w-full h-[200px] object-cover rounded-lg border-2 border-gray-200 shadow-md"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        className="absolute top-2 right-2 bg-red-500 hover:bg-red-600"
                        onClick={() => removeImage(idFrontUrl, setIdFrontUrl)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <UploaderProvider
                      uploadFn={createUploadFn(setIdFrontUrl)}
                      autoUpload={true}
                    >
                      <SingleImageDropzone
                        height={200}
                        width={200}
                        dropzoneOptions={{
                          maxSize: 1024 * 1024 * 1,
                        }}
                        className="rounded-lg border-2 border-dashed border-gray-300 hover:border-blue-500"
                      />
                    </UploaderProvider>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    صورة البطاقة (خلفي)
                  </label>
                  {idBackUrl ? (
                    <div className="relative">
                      <img
                        src={idBackUrl}
                        alt="ID Back"
                        className="w-full h-[200px] object-cover rounded-lg border-2 border-gray-200 shadow-md"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        className="absolute top-2 right-2 bg-red-500 hover:bg-red-600"
                        onClick={() => removeImage(idBackUrl, setIdBackUrl)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <UploaderProvider
                      uploadFn={createUploadFn(setIdBackUrl)}
                      autoUpload={true}
                    >
                      <SingleImageDropzone
                        height={200}
                        width={200}
                        dropzoneOptions={{
                          maxSize: 1024 * 1024 * 1,
                        }}
                        className="rounded-lg border-2 border-dashed border-gray-300 hover:border-blue-500"
                      />
                    </UploaderProvider>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="overflow-hidden shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl font-bold">
              <Users className="h-6 w-6 text-green-600" />
              العلاقات العائلية
            </CardTitle>
            <CardDescription className="text-gray-600">
              إضافة أفراد الأسرة ومعلوماتهم
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            {fields.map((field, index) => (
              <div
                key={field.id}
                className="border border-gray-200 rounded-xl p-6 space-y-4 bg-gray-50"
              >
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-gray-800 flex items-center gap-2">
                    <Users className="h-5 w-5 text-gray-500" />
                    البيانات العائلية رقم {index + 1}
                  </h4>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => remove(index)}
                    className="text-red-600 hover:text-red-700 border-red-200 hover:border-red-300"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name={`relationships.${index}.relationshipType`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-medium">
                          نوع العلاقة *
                        </FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="border-gray-300 focus:border-green-500">
                              <SelectValue placeholder="اختر نوع العلاقة" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {(() => {
                              const currentRelationships =
                                form.watch("relationships") || [];
                              const currentValue = form.watch(
                                `relationships.${index}.relationshipType`
                              );
                              const hasFather = currentRelationships.some(
                                (rel, idx) =>
                                  idx !== index &&
                                  rel.relationshipType === "father"
                              );
                              const hasMother = currentRelationships.some(
                                (rel, idx) =>
                                  idx !== index &&
                                  rel.relationshipType === "mother"
                              );

                              return (
                                <>
                                  {(!hasFather ||
                                    currentValue === "father") && (
                                    <SelectItem value="father">أب</SelectItem>
                                  )}
                                  {(!hasMother ||
                                    currentValue === "mother") && (
                                    <SelectItem value="mother">أم</SelectItem>
                                  )}
                                  <SelectItem value="spouse">
                                    زوج/زوجة
                                  </SelectItem>
                                  <SelectItem value="son">ابن</SelectItem>
                                  <SelectItem value="daughter">ابنة</SelectItem>
                                  <SelectItem value="brother">أخ</SelectItem>
                                  <SelectItem value="sister">أخت</SelectItem>
                                </>
                              );
                            })()}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`relationships.${index}.name`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-medium">الاسم *</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="أدخل الاسم"
                            {...field}
                            className="border-gray-300 focus:border-green-500"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name={`relationships.${index}.nationalId`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-medium">
                          رقم البطاقة
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="أدخل رقم البطاقة"
                            {...field}
                            className="border-gray-300 focus:border-green-500"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`relationships.${index}.birthDate`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-medium">
                          تاريخ الميلاد
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="text"
                            placeholder="DD/MM/YYYY"
                            maxLength={10}
                            {...field}
                            onChange={(e) =>
                              field.onChange(handleDateChange(e.target.value))
                            }
                            className="border-gray-300 focus:border-green-500"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name={`relationships.${index}.birthPlace`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-medium">
                          مكان الميلاد
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="أدخل مكان الميلاد"
                            {...field}
                            className="border-gray-300 focus:border-green-500"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`relationships.${index}.profession`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-medium">المهنة</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="أدخل المهنة"
                            {...field}
                            className="border-gray-300 focus:border-green-500"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name={`relationships.${index}.spouseName`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-medium">
                          اسم الزوج/الزوجة
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="أدخل اسم الزوج/الزوجة"
                            {...field}
                            className="border-gray-300 focus:border-green-500"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`relationships.${index}.residenceLocation`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-medium">
                          محل الإقامة
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="أدخل محل الإقامة"
                            {...field}
                            className="border-gray-300 focus:border-green-500"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name={`relationships.${index}.notes`}
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel className="font-medium">ملاحظات</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="أدخل أي ملاحظات"
                          {...field}
                          className="border-gray-300 focus:border-green-500 min-h-[60px]"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              onClick={addRelationship}
              className="w-full border-2 border-dashed border-gray-300 hover:border-green-500 text-green-600 hover:bg-green-50"
            >
              <Plus className="h-4 w-4 mr-2" />
              إضافة علاقة
            </Button>
          </CardContent>
        </Card>

        <div className="flex flex-col sm:flex-row justify-start sm:justify-end gap-4 pt-6 border-t border-gray-200">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/employees")}
            className="w-full sm:w-auto border-gray-300 hover:border-gray-400"
          >
            رجوع
          </Button>
          <Button
            type="submit"
            onClick={() => setGoToNotes(false)}
            className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700"
          >
            {type === "Update" ? "تحديث الموظف" : "تسجيل موظف جديد"}
          </Button>
          <Button
            type="submit"
            variant="secondary"
            onClick={() => setGoToNotes(true)}
            className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white"
          >
            {type === "Update"
              ? "تحديث وإضافة ملاحظات أمنية"
              : "تسجيل وإضافة ملاحظات أمنية"}
          </Button>
          {type === "Update" && employeeId && (
            <Button
              type="button"
              variant="destructive"
              size="sm"
              onClick={async () => {
                const { success } = await deleteEmployee(employeeId);
                if (success) {
                  router.push("/employees");
                }
              }}
              className="w-full sm:w-auto bg-red-600 hover:bg-red-700"
            >
              حذف الموظف
            </Button>
          )}
        </div>
      </form>
    </Form>
  );
};

export default EmployeeForm;
