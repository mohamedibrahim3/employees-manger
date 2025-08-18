"use client";

import { Button } from "@/components/ui/button";
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
import { Plus, Trash2, User, Users, X } from "lucide-react";
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
import { createEmployee, deleteEmployee } from "@/lib/actions/employee.actions";
import {
  createEmployeeApiSchema,
  createEmployeeFormSchema,
} from "@/lib/validators";
import { updateEmployee } from "@/lib/actions/employee.actions";
import { EdgeStoreProvider, useEdgeStore } from "@/lib/edgestore";
import { SingleImageDropzone } from "./upload/single-image";
import { UploaderProvider } from "./upload/uploader-provider";
import { useState } from "react";

// Define the API data type that matches your Prisma schema
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

  // State for uploaded images
  const [personalPhotoUrl, setPersonalPhotoUrl] = useState<string | undefined>(
    employee?.personalImageUrl
  );
  const [idFrontUrl, setIdFrontUrl] = useState<string | undefined>(
    employee?.idFrontImageUrl
  );
  const [idBackUrl, setIdBackUrl] = useState<string | undefined>(
    employee?.idBackImageUrl
  );

  // Upload function for the UploaderProvider
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
      const res = await edgestore.myPublicImages.upload({
        file,
        signal,
        onProgressChange,
      });

      setImageUrl(res.url);
      return { url: res.url };
    };

  // Remove image function
  const removeImage = async (
    imageUrl: string | undefined,
    setImageUrl: (url: string | undefined) => void
  ) => {
    if (imageUrl) {
      // Ask for confirmation
      const confirmed = window.confirm("هل أنت متأكد من حذف هذه الصورة؟");
      if (!confirmed) return;

      // Remove from UI state immediately for better UX
      setImageUrl(undefined);
      toast("تم إزالة الصورة من النموذج");

      // Try to delete from EdgeStore in the background (optional)
      // If this fails, it's not critical - the image just becomes orphaned
      edgestore.myPublicImages
        .delete({
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

  // Form state management
  const form = useForm<FormData>({
    resolver: zodResolver(createEmployeeFormSchema),
    defaultValues: {
      name: employee?.name || "",
      nickName: employee?.nickName || "",
      profession: employee?.profession || "",
      birthDate: employee?.birthDate
        ? new Date(employee.birthDate).toISOString().split("T")[0]
        : "",
      nationalId: employee?.nationalId || "",
      maritalStatus: employee?.maritalStatus || "",
      residenceLocation: employee?.residenceLocation || "",
      hiringDate: employee?.hiringDate
        ? new Date(employee.hiringDate).toISOString().split("T")[0]
        : "",
      hiringType: employee?.hiringType || "",
      email: employee?.email || "",
      administration: employee?.administration || "",
      actualWork: employee?.actualWork || "",
      phoneNumber: employee?.phoneNumber || "",
      notes: employee?.notes || "",
      personalPhoto: employee?.personalImageUrl || "",
      frontIdCard: employee?.idFrontImageUrl || "",
      backIdCard: employee?.idBackImageUrl || "",
      relationships:
        employee?.relationships?.map((rel) => ({
          relationshipType: rel.relationshipType,
          name: rel.name,
          nationalId: rel.nationalId || "",
          birthDate: rel.birthDate
            ? new Date(rel.birthDate).toISOString().split("T")[0]
            : "",
          birthPlace: rel.birthPlace || "",
          profession: rel.profession || "",
          spouseName: rel.spouseName || "",
          residenceLocation: rel.residenceLocation || "",
          notes: rel.notes || "",
        })) || [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "relationships",
  });

  // Handle form submission
  const onSubmit: SubmitHandler<FormData> = async (values) => {
    try {
      // Transform form data to match the API schema
      const transformedData: EmployeeData = {
        name: values.name,
        nickName: values.nickName,
        profession: values.profession,
        birthDate: new Date(values.birthDate),
        nationalId: values.nationalId,
        maritalStatus: values.maritalStatus as string,
        residenceLocation: values.residenceLocation,
        hiringDate: new Date(values.hiringDate),
        hiringType: values.hiringType,
        email: values.email || undefined,
        administration: values.administration,
        actualWork: values.actualWork,
        phoneNumber: values.phoneNumber,
        notes: values.notes || "",
        personalImageUrl: personalPhotoUrl,
        idFrontImageUrl: idFrontUrl,
        idBackImageUrl: idBackUrl,
        relationships: values.relationships.map((rel) => ({
          relationshipType: rel.relationshipType,
          name: rel.name,
          nationalId: rel.nationalId || "",
          birthDate: new Date(rel.birthDate as string),
          birthPlace: rel.birthPlace || undefined,
          profession: rel.profession || undefined,
          spouseName: rel.spouseName || undefined,
          residenceLocation: rel.residenceLocation || "",
          notes: rel.notes || undefined,
        })),
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

      if (result.success) {
        toast(
          type === "Update" ? "تم تحديث الموظف بنجاح" : "تم إنشاء الموظف بنجاح"
        );
        router.push("/");
      } else {
        toast(
          result.error ||
            (type === "Update"
              ? "حدث خطأ أثناء تحديث الموظف"
              : "حدث خطأ أثناء إنشاء الموظف")
        );
      }
    } catch (error) {
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
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {/* Basic Employee Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              المعلومات الأساسية
            </CardTitle>
            <CardDescription>تفاصيل الموظف الشخصية والمهنية</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>الاسم رباعي *</FormLabel>
                    <FormControl>
                      <Input placeholder="ادخل الاسم الكامل" {...field} />
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
                    <FormLabel>اسم الشهرة *</FormLabel>
                    <FormControl>
                      <Input placeholder="ادخل اسم الشهرة" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="profession"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>المهنة *</FormLabel>
                    <FormControl>
                      <Input placeholder="ادخل المهنة" {...field} />
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
                    <FormLabel>تاريخ الميلاد *</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="nationalId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel> رقم البطاقة *</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="ادخل رقم البطاقة"
                        {...field}
                        onChange={(e) => {
                          // Only allow numeric input
                          const value = e.target.value.replace(/[^0-9]/g, "");
                          field.onChange(value);
                        }}
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
                    <FormLabel>الحالة الاجتماعية *</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
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

            <FormField
              control={form.control}
              name="residenceLocation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>العنوان التفصيلي *</FormLabel>
                  <FormControl>
                    <Textarea placeholder="ادخل العنوان التفصيلي" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Separator />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="hiringDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>تاريخ التعيين *</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
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
                    <FormLabel>نوع التعيين *</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="اختر نوع التعيين" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="full-time">دائم </SelectItem>
                        <SelectItem value="temporary">مؤقت</SelectItem>
                        <SelectItem value="secondment">معار</SelectItem>
                        <SelectItem value="mandate">ندب</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="administration"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>الاداره والمنطقة التابع لها*</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="اختر الإدارة و المنطقة" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="اﻹداره المركزيه للمشروعات">
                          اﻹداره المركزيه للمشروعات
                        </SelectItem>
                        <SelectItem value="اﻹداره العامة للشئون المالية">
                          اﻹداره العامة للشئون المالية
                        </SelectItem>
                        <SelectItem value="اﻹداره العامة للشئون اﻹداريه">
                          اﻹداره العامة للشئون اﻹداريه
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
                        <SelectItem value="اﻷمن">اﻷمن</SelectItem>
                        <SelectItem value="التعاقدات">التعاقدات</SelectItem>
                        <SelectItem value="الشئون القانونية">
                          الشئون القانونية
                        </SelectItem>
                        <SelectItem value="التنميه المتكاملة">
                          التنميه المتكاملة
                        </SelectItem>
                        <SelectItem value="مكتب رئيس الجهاز">
                          مكتب رئيس الجهاز
                        </SelectItem>
                        <SelectItem value="مكتب نائب رئيس الجهاز">
                          مكتب نائب رئيس الجهاز
                        </SelectItem>
                        <SelectItem value="التخطيط والمتابعه">
                          التخطيط والمتابعه
                        </SelectItem>
                        <SelectItem value="منطقه تعمير شمال سيناء">
                          منطقه تعمير شمال سيناء
                        </SelectItem>
                        <SelectItem value="منطقة تعمير جنوب سيناء">
                          منطقة تعمير جنوب سيناء
                        </SelectItem>
                        <SelectItem value="منطقة تعمير بورسعيد">
                          منطقة تعمير بورسعيد
                        </SelectItem>
                        <SelectItem value="منطقة تعمير الاسماعيليه">
                          منطقة تعمير الاسماعيليه
                        </SelectItem>
                        <SelectItem value="منطقة تعميرالقنطره">
                          منطقة تعميرالقنطره
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
                    <FormLabel>العمل الفعلي *</FormLabel>
                    <FormControl>
                      <Input placeholder="أدخل العمل الفعلي" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>البريد الإلكتروني</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="أدخل عنوان البريد الإلكتروني"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phoneNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>رقم الهاتف *</FormLabel>
                    <FormControl>
                      <Input placeholder="أدخل رقم الهاتف" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Three upload fields for personal photo and two for ID */}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Personal Photo */}
              <div className="space-y-2">
                <label className="text-sm font-medium">الصورة الشخصية</label>
                {personalPhotoUrl ? (
                  <div className="relative">
                    <img
                      src={personalPhotoUrl}
                      alt="Personal Photo"
                      className="w-[200px] h-[200px] object-cover rounded-md border"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="absolute top-2 right-2"
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
                    />
                  </UploaderProvider>
                )}
              </div>

              {/* ID Front */}
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  صورة البطاقة (أمامي)
                </label>
                {idFrontUrl ? (
                  <div className="relative">
                    <img
                      src={idFrontUrl}
                      alt="ID Front"
                      className="w-[200px] h-[200px] object-cover rounded-md border"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="absolute top-2 right-2"
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
                        maxSize: 1024 * 1024 * 1, // 1 MB
                      }}
                    />
                  </UploaderProvider>
                )}
              </div>

              {/* ID Back */}
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  صورة البطاقة (خلفي)
                </label>
                {idBackUrl ? (
                  <div className="relative">
                    <img
                      src={idBackUrl}
                      alt="ID Back"
                      className="w-[200px] h-[200px] object-cover rounded-md border"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="absolute top-2 right-2"
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
                        maxSize: 1024 * 1024 * 1, // 1 MB
                      }}
                    />
                  </UploaderProvider>
                )}
              </div>
            </div>

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>الملاحظات الامنية</FormLabel>
                  <FormControl>
                    <Textarea placeholder="أدخل أي ملاحظات إضافية" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Relationships Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              العلاقات العائلية
            </CardTitle>
            <CardDescription>إضافة أفراد الأسرة ومعلوماتهم</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {fields.map((field, index) => (
              <div key={field.id} className="border rounded-lg p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold">Relationship #{index + 1}</h4>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => remove(index)}
                    className="text-red-600 hover:text-red-700"
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
                        <FormLabel> نوع العلاقة *</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
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
                        <FormLabel>الاسم *</FormLabel>
                        <FormControl>
                          <Input placeholder="أدخل الاسم" {...field} />
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
                        <FormLabel>رقم الهوية الوطنية *</FormLabel>
                        <FormControl>
                          <Input placeholder="أدخل رقم الهوية" {...field} />
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
                        <FormLabel>تاريخ الميلاد *</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
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
                        <FormLabel>مكان الميلاد </FormLabel>
                        <FormControl>
                          <Input placeholder="أدخل مكان الميلاد" {...field} />
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
                        <FormLabel>المهنة</FormLabel>
                        <FormControl>
                          <Input placeholder="أدخل المهنة" {...field} />
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
                        <FormLabel>اسم الزوج/الزوجة </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="أدخل اسم الزوج/الزوجة"
                            {...field}
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
                        <FormLabel>محل الإقامة *</FormLabel>
                        <FormControl>
                          <Input placeholder="أدخل محل الإقامة" {...field} />
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
                    <FormItem>
                      <FormLabel>ملاحظات</FormLabel>
                      <FormControl>
                        <Textarea placeholder="أدخل أي ملاحظات" {...field} />
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
              className="w-full bg-transparent"
            >
              <Plus className="h-4 w-4 mr-2" />
              إضافة علاقة
            </Button>
          </CardContent>
        </Card>

        {/* Submit Button */}
        <div className="flex justify-start space-x-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/")}
          >
            رجوع
          </Button>
          <Button type="submit">
            {type === "Update" ? "تحديث الموظف" : "تسجيل موظف جديد"}
          </Button>
          {type === "Update" && employeeId && (
            <Button
              type="button"
              variant="destructive"
              size="sm"
              onClick={async () => {
                const { success } = await deleteEmployee(employeeId || "");
                if (success) {
                  router.push("/");
                }
              }}
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
