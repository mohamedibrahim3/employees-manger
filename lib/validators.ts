import z from "zod";

export const signInSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

// Form schema for React Hook Form (before transformation)
export const createEmployeeFormSchema = z.object({
  name: z.string().min(2, "الاسم مطلوب"),
  nickName: z.string().min(1, "اسم الشهرة مطلوب"),
  profession: z.string().min(1, "المهنة مطلوبة"),
  birthDate: z.string().min(1, "تاريخ الميلاد مطلوب"),
  nationalId: z.string().min(1, "رقم الهوية الوطنية مطلوب"),
  maritalStatus: z.string().min(1, "الحالة الاجتماعية مطلوبة"),
  residenceLocation: z.string().min(1, "العنوان التفصيلي مطلوب"),
  hiringDate: z.string().min(1, "تاريخ التعيين مطلوب"),
  hiringType: z.string().min(1, "نوع التوظيف مطلوب"),
  email: z
    .string()
    .email("البريد الإلكتروني غير صحيح")
    .optional()
    .or(z.literal("")),
  administration: z.string().min(1, "الإدارة مطلوبة"),
  actualWork: z.string().min(1, "العمل الفعلي مطلوب"),
  phoneNumber: z.string().min(1, "رقم الهاتف مطلوب"),
  notes: z.string().min(1, "الملاحظات الامنية مطلوبة"),
  personalPhoto: z.any().optional(),
  frontIdCard: z.any().optional(),
  backIdCard: z.any().optional(),
  relationships: z.array(
    z.object({
      relationshipType: z.string().min(1, "نوع العلاقة مطلوب"),
      name: z.string().min(1, "الاسم مطلوب"),
      nationalId: z.string().optional(),
      birthDate: z.string().optional(),
      birthPlace: z.string().optional(),
      profession: z.string().optional(),
      spouseName: z.string().optional(),
      residenceLocation: z.string().optional(),
      notes: z.string().optional(),
    })
  ),
});

// API schema for backend (after transformation)
export const createEmployeeApiSchema = z.object({
  name: z.string().min(2, "الاسم مطلوب"),
  nickName: z.string().min(1, "اسم الشهرة مطلوب"),
  profession: z.string().min(1, "المهنة مطلوبة"),
  birthDate: z.date(),
  nationalId: z.string().min(1, "رقم الهوية الوطنية مطلوب"),
  maritalStatus: z.string().min(1, "الحالة الاجتماعية مطلوبة"),
  residenceLocation: z.string().min(1, "العنوان التفصيلي مطلوب"),
  hiringDate: z.date(),
  hiringType: z.string().min(1, "نوع التوظيف مطلوب"),
  email: z.string().email("البريد الإلكتروني غير صحيح").optional(),
  administration: z.string().min(1, "الإدارة مطلوبة"),
  actualWork: z.string().min(1, "العمل الفعلي مطلوب"),
  phoneNumber: z.string().min(1, "رقم الهاتف مطلوب"),
  notes: z.string().min(1, "الملاحظات الامنية مطلوبة"),
  personalImageUrl: z.string().optional(),
  idFrontImageUrl: z.string().optional(),
  idBackImageUrl: z.string().optional(),
  relationships: z
    .array(
      z.object({
        relationshipType: z.string().min(1, "نوع العلاقة مطلوب"),
        name: z.string().min(1, "الاسم مطلوب"),
        nationalId: z.string().optional(),
        birthDate: z.date().optional().nullable(),
        birthPlace: z.string().optional(),
        profession: z.string().optional(),
        spouseName: z.string().optional(),
        residenceLocation: z.string().optional(),
        notes: z.string().optional(),
      })
    )
    .optional()
    .default([]),
});

// Legacy form schema (kept for backward compatibility)
export const formSchema = z.object({
  name: z.string().min(2, "الاسم مطلوب"),
  nickName: z.string().min(1, "اسم الشهرة مطلوب"),
  profession: z.string().min(1, "المهنة مطلوبة"),
  birthDate: z.string().min(1, "تاريخ الميلاد مطلوب"),
  nationalId: z.string().min(1, "رقم الهوية الوطنية مطلوب"),
  maritalStatus: z.enum(["single", "married", "divorced", "widowed"]),
  residenceLocation: z.string().min(1, "العنوان التفصيلي مطلوب"),
  hiringDate: z.string().min(1, "تاريخ التعيين مطلوب"),
  hiringType: z.enum(["full-time", "part-time", "contract", "temporary"]),
  email: z
    .string()
    .email("البريد الإلكتروني غير صحيح")
    .optional()
    .or(z.literal("")),
  administration: z.string().min(1, "الإدارة مطلوبة"),
  actualWork: z.string().min(1, "العمل الفعلي مطلوب"),
  phoneNumber: z.string().min(1, "رقم الهاتف مطلوب"),
  notes: z.string().optional(),
  relationships: z.array(
    z.object({
      relationshipType: z.string().min(1, "نوع العلاقة مطلوب"),
      name: z.string().min(1, "الاسم مطلوب"),
      nationalId: z.string().min(1, "رقم الهوية الوطنية مطلوب"),
      birthDate: z.string().min(1, "تاريخ الميلاد مطلوب"),
      birthPlace: z.string().optional(),
      profession: z.string().optional(),
      spouseName: z.string().optional(),
      residenceLocation: z.string().min(1, "محل الاقامة مطلوب"),
      notes: z.string().optional(),
    })
  ),
});
