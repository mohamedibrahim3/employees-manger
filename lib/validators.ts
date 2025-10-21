import { z } from "zod";

export const signInSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

export const createEmployeeFormSchema = z.object({
  name: z.string().min(2, "الاسم مطلوب"),
  birthDate: z.string().min(1, "تاريخ الميلاد مطلوب"),
  nationalId: z.string().min(1, "رقم البطاقة مطلوب"),
  maritalStatus: z.string().min(1, "الحالة الاجتماعية مطلوبة"),
  hiringDate: z.string().min(1, "تاريخ التعيين مطلوب"),
  hiringType: z.string().min(1, "نوع التوظيف مطلوب"),
  administration: z.string().min(1, "الإدارة مطلوبة"),
  nickName: z.string().default(""),
  profession: z.string().default(""),
  residenceLocation: z.string().default(""),
  actualWork: z.string().default(""),
  phoneNumber: z.string().default(""),
  email: z.string().email("البريد الإلكتروني غير صحيح").or(z.literal("")).default(""),
  
  notes: z.string().default(""),
  status: z.enum(["active", "inactive", "suspended", "retired"]).default("active"),
  personalPhoto: z.any().optional(),
  frontIdCard: z.any().optional(),
  backIdCard: z.any().optional(),
  jobPosition: z.union([z.enum(["ENGINEER", "ACCOUNTANT", "ADMINISTRATIVE", "EXECUTIVE_SUPERVISOR", "WRITER", "WORKER"]), z.literal("")]).default(""),
  educationalDegree: z.union([z.enum(["DOCTORATE", "MASTERS", "BACHELORS", "GENERAL_SECONDARY", "AZHARI_SECONDARY", "ABOVE_AVERAGE", "AVERAGE", "PREPARATORY", "PRIMARY", "LITERACY", "NONE"]), z.literal("")]).default(""),
  functionalDegree: z.union([z.enum(["FIRST_DEPUTY_MINISTER", "DEPUTY_MINISTER", "GENERAL_MANAGER", "DEPARTMENT_MANAGER", "DEPARTMENT_HEAD", "FIRST_A", "FIRST_B", "SECOND_A", "SECOND_B", "THIRD_A", "THIRD_B", "THIRD_C", "FOURTH_A", "FOURTH_B", "FOURTH_C", "FIFTH_A", "FIFTH_B", "FIFTH_C", "SIXTH_A", "SIXTH_B", "SIXTH_C"]), z.literal("")]).default(""),

  relationships: z.array(
    z.object({
      relationshipType: z.string().min(1, "نوع العلاقة مطلوب"),
      name: z.string().min(1, "الاسم مطلوب"),
      nationalId: z.string().default(""),
      birthDate: z.string().default(""),
      birthPlace: z.string().default(""),
      profession: z.string().default(""),
      spouseName: z.string().default(""),
      residenceLocation: z.string().default(""),
      notes: z.string().default(""),
    })
  ).default([]),
});

export const createEmployeeApiSchema = z.object({
  name: z.string().min(2, "الاسم مطلوب"),
  birthDate: z.date(),
  nationalId: z.string().min(1, "رقم البطاقة مطلوب"),
  maritalStatus: z.string().min(1, "الحالة الاجتماعية مطلوبة"),
  hiringDate: z.date(),
  hiringType: z.string().min(1, "نوع التوظيف مطلوب"),
  administration: z.string().min(1, "الإدارة مطلوبة"),
  nickName: z.string().nullable().default(null).transform(val => val || ""),
  profession: z.string().nullable().default(null).transform(val => val || ""),
  residenceLocation: z.string().nullable().default(null).transform(val => val || ""),
  actualWork: z.string().nullable().default(null).transform(val => val || ""),
  phoneNumber: z.string().nullable().default(null).transform(val => val || ""),
  email: z.string().email("البريد الإلكتروني غير صحيح").nullable().default(null).or(z.literal("")),

  notes: z.string().default(""),
  status: z.enum(["active", "inactive", "suspended", "retired"]).default("active"),
  personalImageUrl: z.string().nullable().default(null),
  idFrontImageUrl: z.string().nullable().default(null),
  idBackImageUrl: z.string().nullable().default(null),
  relationships: z.array(
    z.object({
      relationshipType: z.string().min(1, "نوع العلاقة مطلوب"),
      name: z.string().min(1, "الاسم مطلوب"),
      nationalId: z.string().nullable().default(null).transform(val => val || ""),
      birthDate: z.date().nullable().default(null),
      birthPlace: z.string().nullable().default(null).transform(val => val || ""),
      profession: z.string().nullable().default(null).transform(val => val || ""),
      spouseName: z.string().nullable().default(null).transform(val => val || ""),
      residenceLocation: z.string().nullable().default(null).transform(val => val || ""),
      notes: z.string().nullable().default(null).transform(val => val || ""),
    })
  ).default([]),
  jobPosition: z.enum(["ENGINEER", "ACCOUNTANT", "ADMINISTRATIVE", "EXECUTIVE_SUPERVISOR", "WRITER", "WORKER"]).nullable().default(null),
  educationalDegree: z.enum(["DOCTORATE", "MASTERS", "BACHELORS", "GENERAL_SECONDARY", "AZHARI_SECONDARY", "ABOVE_AVERAGE", "AVERAGE", "PREPARATORY", "PRIMARY", "LITERACY", "NONE"]).nullable().default(null),
  functionalDegree: z.enum(["FIRST_DEPUTY_MINISTER", "DEPUTY_MINISTER", "GENERAL_MANAGER", "DEPARTMENT_MANAGER", "DEPARTMENT_HEAD", "FIRST_A", "FIRST_B", "SECOND_A", "SECOND_B", "THIRD_A", "THIRD_B", "THIRD_C", "FOURTH_A", "FOURTH_B", "FOURTH_C", "FIFTH_A", "FIFTH_B", "FIFTH_C", "SIXTH_A", "SIXTH_B", "SIXTH_C"]).nullable().default(null),
});

export const employeeSchema = z.object({
  id: z.string(),
  name: z.string(),
  nickName: z.string().optional(),
  profession: z.string().optional(),
  birthDate: z.string(),
  nationalId: z.string(),
  maritalStatus: z.string(),
  residenceLocation: z.string().optional(),
  hiringDate: z.string(),
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
  jobPosition: z.enum(["ENGINEER", "ACCOUNTANT", "ADMINISTRATIVE", "EXECUTIVE_SUPERVISOR", "WRITER", "WORKER"]).optional(),
  educationalDegree: z.enum(["DOCTORATE", "MASTERS", "BACHELORS", "GENERAL_SECONDARY", "AZHARI_SECONDARY", "ABOVE_AVERAGE", "AVERAGE", "PREPARATORY", "PRIMARY", "LITERACY", "NONE"]).optional(),
  functionalDegree: z.enum(["FIRST_DEPUTY_MINISTER", "DEPUTY_MINISTER", "GENERAL_MANAGER", "DEPARTMENT_MANAGER", "DEPARTMENT_HEAD", "FIRST_A", "FIRST_B", "SECOND_A", "SECOND_B", "THIRD_A", "THIRD_B", "THIRD_C", "FOURTH_A", "FOURTH_B", "FOURTH_C", "FIFTH_A", "FIFTH_B", "FIFTH_C", "SIXTH_A", "SIXTH_B", "SIXTH_C"]).optional(),
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
    nickName: data.nickName || "",
    profession: data.profession || "",
    residenceLocation: data.residenceLocation || "",
    actualWork: data.actualWork || "",
    phoneNumber: data.phoneNumber || "",
    email: data.email && data.email !== "" ? data.email : null,
    personalImageUrl: null,
    idFrontImageUrl: null,
    idBackImageUrl: null,
    relationships: data.relationships?.map((r) => ({
      ...r,
      nationalId: r.nationalId || "",
      birthDate: r.birthDate ? new Date(r.birthDate) : null,
      birthPlace: r.birthPlace || "",
      profession: r.profession || "",
      spouseName: r.spouseName || "",
      residenceLocation: r.residenceLocation || "",
      notes: r.notes || "",
    })) ?? [],
    jobPosition: data.jobPosition || null,
    educationalDegree: data.educationalDegree || null,
    functionalDegree: data.functionalDegree || null,
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