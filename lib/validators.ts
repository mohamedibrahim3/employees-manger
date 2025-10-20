import { z } from "zod";

export const signInSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

export const createEmployeeFormSchema = z.object({
  // ✅ إجباري فقط
  name: z.string().min(2, "الاسم مطلوب"),
  birthDate: z.string().min(1, "تاريخ الميلاد مطلوب"),
  nationalId: z.string().min(1, "رقم البطاقة مطلوب"),
  maritalStatus: z.string().min(1, "الحالة الاجتماعية مطلوبة"),
  hiringDate: z.string().min(1, "تاريخ التعيين مطلوب"),
  hiringType: z.string().min(1, "نوع التوظيف مطلوب"),
  administration: z.string().min(1, "الإدارة مطلوبة"),
  
  // ✅ اختياري كامل
  nickName: z.string().optional().or(z.literal("")),
  profession: z.string().optional().or(z.literal("")),
  residenceLocation: z.string().optional().or(z.literal("")),
  actualWork: z.string().optional().or(z.literal("")),
  phoneNumber: z.string().optional().or(z.literal("")),
  email: z.string().email("البريد الإلكتروني غير صحيح").optional().or(z.literal("")),
  
  notes: z.string().optional(),
  status: z.enum(["active", "inactive", "suspended", "retired"]).default("active"),
  personalPhoto: z.any().optional(),
  frontIdCard: z.any().optional(),
  backIdCard: z.any().optional(),
  
  // ✅ العلاقات - إجباري نوع + اسم فقط
  relationships: z.array(
    z.object({
      relationshipType: z.string().min(1, "نوع العلاقة مطلوب"),
      name: z.string().min(1, "الاسم مطلوب"),
      // ✅ باقي الحقول اختيارية
      nationalId: z.string().optional().or(z.literal("")),
      birthDate: z.string().optional().or(z.literal("")),
      birthPlace: z.string().optional().or(z.literal("")),
      profession: z.string().optional().or(z.literal("")),
      spouseName: z.string().optional().or(z.literal("")),
      residenceLocation: z.string().optional().or(z.literal("")),
      notes: z.string().optional().or(z.literal("")),
    })
  ).optional().default([]),
});

export const createEmployeeApiSchema = z.object({
  // ✅ إجباري فقط
  name: z.string().min(2, "الاسم مطلوب"),
  birthDate: z.date(),
  nationalId: z.string().min(1, "رقم البطاقة مطلوب"),
  maritalStatus: z.string().min(1, "الحالة الاجتماعية مطلوبة"),
  hiringDate: z.date(),
  hiringType: z.string().min(1, "نوع التوظيف مطلوب"),
  administration: z.string().min(1, "الإدارة مطلوبة"),
  
  // ✅ اختياري كامل
  nickName: z.string().optional(),
  profession: z.string().optional(),
  residenceLocation: z.string().optional(),
  actualWork: z.string().optional(),
  phoneNumber: z.string().optional(),
  email: z.string().email("البريد الإلكتروني غير صحيح").optional(),
  
  notes: z.string().optional(),
  status: z.enum(["active", "inactive", "suspended", "retired"]).default("active"),
  personalImageUrl: z.string().optional(),
  idFrontImageUrl: z.string().optional(),
  idBackImageUrl: z.string().optional(),
  
  // ✅ العلاقات - إجباري نوع + اسم فقط
  relationships: z.array(
    z.object({
      relationshipType: z.string().min(1, "نوع العلاقة مطلوب"),
      name: z.string().min(1, "الاسم مطلوب"),
      // ✅ باقي الحقول اختيارية
      nationalId: z.string().optional(),
      birthDate: z.date().optional().nullable(),
      birthPlace: z.string().optional(),
      profession: z.string().optional(),
      spouseName: z.string().optional(),
      residenceLocation: z.string().optional(),
      notes: z.string().optional(),
    })
  ).optional().default([]),
});

export const employeeSchema = z.object({
  id: z.string(),
  name: z.string(),
  nickName: z.string().optional(),
  profession: z.string().optional(),
  birthDate: z.string(), // ISO string format
  nationalId: z.string(),
  maritalStatus: z.string(),
  residenceLocation: z.string().optional(),
  hiringDate: z.string(), // ISO string format
  hiringType: z.string(),
  email: z.string().optional(),
  administration: z.string(),
  actualWork: z.string().optional(),
  phoneNumber: z.string().optional(),
  notes: z.string().optional(),
  status: z.enum(["active", "inactive", "suspended", "retired"]).default("active"),
  personalImageUrl: z.string().optional(),
  idFrontImageUrl: z.string().optional(),
  idBackImageUrl: z.string().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
  relationships: z.array(
    z.object({
      id: z.string().optional(),
      relationshipType: z.string(),
      name: z.string(),
      nationalId: z.string().optional(),
      birthDate: z.string().optional().nullable(),
      birthPlace: z.string().optional(),
      profession: z.string().optional(),
      spouseName: z.string().optional(),
      residenceLocation: z.string().optional(),
      notes: z.string().optional(),
    })
  ).optional().default([]),
});

export type Employee = z.infer<typeof employeeSchema>;
export type CreateEmployeeForm = z.infer<typeof createEmployeeFormSchema>;
export type CreateEmployeeApi = z.infer<typeof createEmployeeApiSchema>;

export function transformEmployeeFormToApi(
  data: CreateEmployeeForm
): CreateEmployeeApi {
  return {
    ...data,
    birthDate: new Date(data.birthDate),
    hiringDate: new Date(data.hiringDate),
    email: data.email && data.email !== "" ? data.email : undefined,
    // ✅ الصور من EdgeStore مش من Form
    personalImageUrl: undefined, // سيتم تعيينها من EdgeStore state
    idFrontImageUrl: undefined, // سيتم تعيينها من EdgeStore state
    idBackImageUrl: undefined, // سيتم تعيينها من EdgeStore state
    relationships: data.relationships?.map((r) => ({
      ...r,
      birthDate: r.birthDate ? new Date(r.birthDate) : null,
    })) ?? [],
  };
}

export const getStatusLabel = (status: Employee["status"]) => {
  const statusLabels = {
    active: "نشط",
    inactive: "غير نشط", 
    suspended: "موقوف",
    retired: "متقاعد"
  };
  return statusLabels[status];
};

export const getStatusColor = (status: Employee["status"]) => {
  const statusColors = {
    active: "bg-green-100 text-green-800",
    inactive: "bg-gray-100 text-gray-800",
    suspended: "bg-yellow-100 text-yellow-800", 
    retired: "bg-blue-100 text-blue-800"
  };
  return statusColors[status];
};