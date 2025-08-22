import z from "zod";

/* ✅ Schema تسجيل الدخول */
export const signInSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

/* ✅ Schema بتاع الفورم (قبل التحويل) */
export const createEmployeeFormSchema = z.object({
  name: z.string().min(2, "الاسم مطلوب"),
  nickName: z.string().min(1, "اسم الشهرة مطلوب"),
  profession: z.string().min(1, "المهنة مطلوبة"),
  birthDate: z.string().min(1, "تاريخ الميلاد مطلوب"),
  nationalId: z.string().min(1, "رقم الهوية الوطنية مطلوبة"),
  maritalStatus: z.string().min(1, "الحالة الاجتماعية مطلوبة"),
  residenceLocation: z.string().min(1, "العنوان التفصيلي مطلوب"),
  hiringDate: z.string().min(1, "تاريخ التعيين مطلوب"),
  hiringType: z.string().min(1, "نوع التوظيف مطلوب"),
  email: z.string().email("البريد الإلكتروني غير صحيح").optional().or(z.literal("")),
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

/* ✅ Schema بتاع الـAPI (بعد التحويل) */
export const createEmployeeApiSchema = z.object({
  name: z.string().min(2, "الاسم مطلوب"),
  nickName: z.string().min(1, "اسم الشهرة مطلوب"),
  profession: z.string().min(1, "المهنة مطلوبة"),
  birthDate: z.date(),
  nationalId: z.string().min(1, "رقم الهوية الوطنية مطلوبة"),
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
  relationships: z.array(
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
  ).optional().default([]),
});

/* ✅ Transform function (من الفورم → للـAPI) */
export function transformEmployeeFormToApi(
  data: z.infer<typeof createEmployeeFormSchema>
): z.infer<typeof createEmployeeApiSchema> {
  return {
    ...data,
    birthDate: new Date(data.birthDate),
    hiringDate: new Date(data.hiringDate),
    email: data.email && data.email !== "" ? data.email : undefined,
    personalImageUrl: data.personalPhoto ? URL.createObjectURL(data.personalPhoto) : undefined,
    idFrontImageUrl: data.frontIdCard ? URL.createObjectURL(data.frontIdCard) : undefined,
    idBackImageUrl: data.backIdCard ? URL.createObjectURL(data.backIdCard) : undefined,
    relationships: data.relationships?.map((r) => ({
      ...r,
      birthDate: r.birthDate ? new Date(r.birthDate) : null,
    })) ?? [],
  };
}