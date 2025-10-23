"use server";
import { prisma } from "@/db/prisma";
import { revalidatePath, unstable_noStore as noStore } from "next/cache";
import { z } from "zod";
import {
  createEmployeeApiSchema,
  efficiencyGradeEnum,
  EfficiencyGrade,
} from "../validators";

interface Relationship {
  relationshipType: string;
  name: string;
  nationalId: string | null;
  birthDate: Date | null;
  birthPlace?: string;
  profession?: string;
  spouseName?: string;
  residenceLocation: string;
  notes?: string;
}

interface Penalty {
  date: Date;
  type: string;
  description: string;
  attachments?: string | null;
}

interface Bonus {
  date: Date;
  reason: string;
  amount?: string | null;
  attachments?: string | null;
}

interface EfficiencyReport {
  year: number;
  grade: EfficiencyGrade;
  description: string;
  attachments?: string | null;
}

export async function createEmployee(
  data: z.infer<typeof createEmployeeApiSchema>
) {
  try {
    const validatedData = createEmployeeApiSchema.parse(data);

    const empData = {
      name: validatedData.name,
      nickName: validatedData.nickName || "",
      profession: validatedData.profession || "",
      birthDate: new Date(validatedData.birthDate),
      nationalId: validatedData.nationalId,
      maritalStatus: validatedData.maritalStatus,
      residenceLocation: validatedData.residenceLocation || "",
      hiringDate: new Date(validatedData.hiringDate),
      hiringType: validatedData.hiringType,
      administration: validatedData.administration,
      actualWork: validatedData.actualWork || "",
      phoneNumber: validatedData.phoneNumber || "",
      email: validatedData.email || null,
      notes: validatedData.notes || "",
      personalImageUrl: validatedData.personalImageUrl || null,
      idFrontImageUrl: validatedData.idFrontImageUrl || null,
      idBackImageUrl: validatedData.idBackImageUrl || null,
      jobPosition: validatedData.jobPosition || null,
      educationalDegree: validatedData.educationalDegree || null,
      functionalDegree: validatedData.functionalDegree || null,
    };

    let relationships: Relationship[] = [];
    if (validatedData.relationships && validatedData.relationships.length > 0) {
      relationships = validatedData.relationships.map((rel) => ({
        relationshipType: rel.relationshipType,
        name: rel.name,
        nationalId: rel.nationalId || null,
        birthDate: rel.birthDate ? new Date(rel.birthDate) : null,
        birthPlace: rel.birthPlace || undefined,
        profession: rel.profession || undefined,
        spouseName: rel.spouseName || undefined,
        residenceLocation: rel.residenceLocation || "",
        notes: rel.notes || undefined,
      }));
    }

    let penalties: Penalty[] = [];
    if (validatedData.penalties && validatedData.penalties.length > 0) {
      penalties = validatedData.penalties.map((pen) => ({
        date: new Date(pen.date),
        type: pen.type,
        description: pen.description,
        attachments: pen.attachments || null,
      }));
    }

    let bonuses: Bonus[] = [];
    if (validatedData.bonuses && validatedData.bonuses.length > 0) {
      bonuses = validatedData.bonuses.map((bon) => ({
        date: new Date(bon.date),
        reason: bon.reason,
        amount: bon.amount || null,
        attachments: bon.attachments || null,
      }));
    }

    let efficiencyReports: EfficiencyReport[] = [];
    if (
      validatedData.efficiencyReports &&
      validatedData.efficiencyReports.length > 0
    ) {
      efficiencyReports = validatedData.efficiencyReports.map((rep) => ({
        year: rep.year,
        grade: rep.grade as EfficiencyGrade,
        description: rep.description,
        attachments: rep.attachments || null,
      }));
    }

    const employee = await prisma.employee.create({
      data: empData,
    });

    if (relationships.length > 0) {
      await prisma.relationship.createMany({
        data: relationships.map((rel: Relationship) => ({
          employeeId: employee.id,
          ...rel,
        })),
      });
    }

    if (penalties.length > 0) {
      await prisma.penalty.createMany({
        data: penalties.map((pen: Penalty) => ({
          employeeId: employee.id,
          ...pen,
        })),
      });
    }

    if (bonuses.length > 0) {
      await prisma.bonus.createMany({
        data: bonuses.map((bon: Bonus) => ({
          employeeId: employee.id,
          ...bon,
        })),
      });
    }

    if (efficiencyReports.length > 0) {
      await prisma.efficiencyReport.createMany({
        data: efficiencyReports.map((rep: EfficiencyReport) => ({
          employeeId: employee.id,
          ...rep,
        })),
      });
    }

    revalidatePath("/employees");
    revalidatePath("/");
    revalidatePath(`/employees/${employee.id}`);

    return { success: true, employee };
  } catch (error) {
    console.error("Error creating employee:", error);
    if (error instanceof z.ZodError) {
      return { success: false, error: "بيانات غير صحيحة" };
    }
    return { success: false, error: "حدث خطأ أثناء إنشاء الموظف" };
  }
}

export const updateEmployee = async (
  id: string,
  data: z.infer<typeof createEmployeeApiSchema>
) => {
  try {
    const validatedData = createEmployeeApiSchema.parse(data);

    const empData = {
      name: validatedData.name,
      nickName: validatedData.nickName || "",
      profession: validatedData.profession || "",
      birthDate: new Date(validatedData.birthDate),
      nationalId: validatedData.nationalId,
      maritalStatus: validatedData.maritalStatus,
      residenceLocation: validatedData.residenceLocation || "",
      hiringDate: new Date(validatedData.hiringDate),
      hiringType: validatedData.hiringType,
      email: validatedData.email || null,
      administration: validatedData.administration,
      actualWork: validatedData.actualWork || "",
      phoneNumber: validatedData.phoneNumber || "",
      personalImageUrl: validatedData.personalImageUrl || null,
      idFrontImageUrl: validatedData.idFrontImageUrl || null,
      idBackImageUrl: validatedData.idBackImageUrl || null,
      jobPosition: validatedData.jobPosition || null,
      educationalDegree: validatedData.educationalDegree || null,
      functionalDegree: validatedData.functionalDegree || null,
    };

    let relationships: Relationship[] = [];
    if (validatedData.relationships && validatedData.relationships.length > 0) {
      relationships = validatedData.relationships.map((rel) => ({
        relationshipType: rel.relationshipType,
        name: rel.name,
        nationalId: rel.nationalId || null,
        birthDate: rel.birthDate ? new Date(rel.birthDate) : null,
        birthPlace: rel.birthPlace || undefined,
        profession: rel.profession || undefined,
        spouseName: rel.spouseName || undefined,
        residenceLocation: rel.residenceLocation || "",
        notes: rel.notes || undefined,
      }));
    }

    let penalties: Penalty[] = [];
    if (validatedData.penalties && validatedData.penalties.length > 0) {
      penalties = validatedData.penalties.map((pen) => ({
        date: new Date(pen.date),
        type: pen.type,
        description: pen.description,
        attachments: pen.attachments || null,
      }));
    }

    let bonuses: Bonus[] = [];
    if (validatedData.bonuses && validatedData.bonuses.length > 0) {
      bonuses = validatedData.bonuses.map((bon) => ({
        date: new Date(bon.date),
        reason: bon.reason,
        amount: bon.amount || null,
        attachments: bon.attachments || null,
      }));
    }

    let efficiencyReports: EfficiencyReport[] = [];
    if (
      validatedData.efficiencyReports &&
      validatedData.efficiencyReports.length > 0
    ) {
      efficiencyReports = validatedData.efficiencyReports.map((rep) => ({
        year: rep.year,
        grade: rep.grade as EfficiencyGrade,
        description: rep.description,
        attachments: rep.attachments || null,
      }));
    }

    const employee = await prisma.employee.update({
      where: { id },
      data: empData,
    });

    if (relationships.length > 0) {
      await prisma.relationship.deleteMany({ where: { employeeId: id } });
      await prisma.relationship.createMany({
        data: relationships.map((rel) => ({
          employeeId: employee.id,
          ...rel,
        })),
      });
    }

    if (penalties.length > 0) {
      await prisma.penalty.deleteMany({ where: { employeeId: id } });
      await prisma.penalty.createMany({
        data: penalties.map((pen) => ({
          employeeId: employee.id,
          ...pen,
        })),
      });
    }

    if (bonuses.length > 0) {
      await prisma.bonus.deleteMany({ where: { employeeId: id } });
      await prisma.bonus.createMany({
        data: bonuses.map((bon) => ({
          employeeId: employee.id,
          ...bon,
        })),
      });
    }

    if (efficiencyReports.length > 0) {
      await prisma.efficiencyReport.deleteMany({ where: { employeeId: id } });
      await prisma.efficiencyReport.createMany({
        data: efficiencyReports.map((rep) => ({
          employeeId: employee.id,
          ...rep,
        })),
      });
    }

    revalidatePath("/employees");
    revalidatePath("/");
    revalidatePath(`/employees/${id}`);

    return { success: true, employee };
  } catch (error) {
    console.error("Error updating employee:", error);
    if (error instanceof z.ZodError) {
      return { success: false, error: "بيانات غير صحيحة" };
    }
    return { success: false, error: "حدث خطأ أثناء تحديث الموظف" };
  }
};

export const getEmployees = async () => {
  noStore();
  try {
    const employees = await prisma.employee.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        relationships: true,
        penalties: true,
        bonuses: true,
        efficiencyReports: true,
      },
    });
    return { success: true, employees };
  } catch (error) {
    console.error("Error fetching employees:", error);
    return { success: false, error: "حدث خطأ أثناء جلب البيانات" };
  }
};

export const getEmployeesBySearch = async (
  name: string,
  administration: string,
  educationalDegree: string
) => {
  noStore();
  try {
    const cleanName = name?.replace(/\s+/g, " ").trim() || "";
    const cleanAdmin = administration?.replace(/\s+/g, " ").trim() || "";
    const cleanDegree = educationalDegree?.replace(/\s+/g, " ").trim() || "";

    console.log("🔍 Search Input:", {
      cleanName,
      cleanAdmin,
      cleanDegree,
    });

    const whereClause: any = {};

    if (cleanName) {
      whereClause.name = { contains: cleanName, mode: "insensitive" };
    }

    if (cleanAdmin) {
      whereClause.administration = {
        contains: cleanAdmin,
        mode: "insensitive",
      };
    }

    if (cleanDegree) {
      const { EDUCATIONAL_DEGREE_MAPPING } = await import(
        "@/src/constants/degrees"
      );
      const englishDegree = EDUCATIONAL_DEGREE_MAPPING[cleanDegree];

      if (englishDegree) {
        whereClause.educationalDegree = englishDegree;
        console.log("🔍 Searching for English degree:", englishDegree);
      } else {
        console.log("Unknown degree:", cleanDegree);
        return { success: true, employees: [] };
      }
    }

    console.log(
      "🔍 Where Clause (Optimized):",
      JSON.stringify(whereClause, null, 2)
    );

    let employees = await prisma.employee.findMany({
      where: whereClause,
      orderBy: { createdAt: "desc" },
      include: {
        relationships: true,
        penalties: true,
        bonuses: true,
        efficiencyReports: true,
      },
    });

    console.log(`✅ Found ${employees.length} employees`);

    if (employees.length > 0) {
      console.log(
        "📋 Sample Results:",
        employees.slice(0, 3).map((emp: any) => ({
          name: emp.name,
          admin: emp.administration,
          degree: emp.educationalDegree,
        }))
      );
    } else {
      console.log("❌ No results found");
    }

    return { success: true, employees };
  } catch (error) {
    console.error("❌ Error searching employees:", error);
    return { success: false, error: "حدث خطأ أثناء البحث", employees: [] };
  }
};

export const deleteEmployee = async (id: string) => {
  try {
    await prisma.employee.delete({ where: { id } });
    revalidatePath("/employees");
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Error deleting employee:", error);
    return { success: false, error: "حدث خطأ أثناء حذف الموظف" };
  }
};

export const getEmployeeById = async (id: string) => {
  noStore();
  try {
    const employee = await prisma.employee.findUnique({
      where: { id },
      include: {
        relationships: true,
        penalties: true,
        bonuses: true,
        efficiencyReports: true,
      },
    });

    if (!employee) {
      return { success: false, error: "الموظف غير موجود" };
    }

    return { success: true, employee };
  } catch (error) {
    console.error("Error fetching employee:", error);
    return { success: false, error: "حدث خطأ أثناء جلب البيانات" };
  }
};

export const updateEmployeeNotes = async (id: string, notes: string) => {
  try {
    const employee = await prisma.employee.update({
      where: { id },
      data: { notes },
    });

    revalidatePath(`/employees/${id}`);
    revalidatePath(`/employees/${id}/security-notes`);
    revalidatePath("/employees");

    return { success: true, employee };
  } catch (error) {
    console.error("Error updating notes:", error);
    return { success: false, error: "حدث خطأ أثناء تحديث الملاحظات" };
  }
};

export const getEmployeeNotes = async (id: string) => {
  noStore();
  try {
    const employee = await prisma.employee.findUnique({
      where: { id },
      select: { notes: true },
    });
    return { success: true, notes: employee?.notes || "" };
  } catch (error) {
    return { success: false, error: "خطأ في جلب الملاحظات" };
  }
};

export async function createPenalty(
  employeeId: string,
  data: {
    date: string;
    type: string;
    description: string;
    attachments?: string;
  }
) {
  try {
    const validatedData = z
      .object({
        date: z.string().min(1, "التاريخ مطلوب"),
        type: z.string().min(1, "نوع الجزاء مطلوب"),
        description: z.string().min(1, "الوصف مطلوب"),
        attachments: z.string().optional(),
      })
      .parse(data);

    const penalty = await prisma.penalty.create({
      data: {
        employeeId,
        date: new Date(validatedData.date),
        type: validatedData.type,
        description: validatedData.description,
        attachments: validatedData.attachments || null,
      },
    });

    revalidatePath(`/employees/${employeeId}`);
    return { success: true, penalty };
  } catch (error) {
    console.error("Error creating penalty:", error);
    if (error instanceof z.ZodError) {
      return { success: false, error: "بيانات غير صحيحة" };
    }
    return { success: false, error: "حدث خطأ أثناء إنشاء الجزاء" };
  }
}

export async function updatePenalty(
  penaltyId: string,
  employeeId: string,
  data: {
    date: string;
    type: string;
    description: string;
    attachments?: string;
  }
) {
  try {
    const validatedData = z
      .object({
        date: z.string().min(1, "التاريخ مطلوب"),
        type: z.string().min(1, "نوع الجزاء مطلوب"),
        description: z.string().min(1, "الوصف مطلوب"),
        attachments: z.string().optional(),
      })
      .parse(data);

    const penalty = await prisma.penalty.update({
      where: { id: penaltyId },
      data: {
        date: new Date(validatedData.date),
        type: validatedData.type,
        description: validatedData.description,
        attachments: validatedData.attachments || null,
      },
    });

    revalidatePath(`/employees/${employeeId}`);
    return { success: true, penalty };
  } catch (error) {
    console.error("Error updating penalty:", error);
    if (error instanceof z.ZodError) {
      return { success: false, error: "بيانات غير صحيحة" };
    }
    return { success: false, error: "حدث خطأ أثناء تحديث الجزاء" };
  }
}

export async function deletePenalty(penaltyId: string, employeeId: string) {
  try {
    await prisma.penalty.delete({ where: { id: penaltyId } });
    revalidatePath(`/employees/${employeeId}`);
    return { success: true };
  } catch (error) {
    console.error("Error deleting penalty:", error);
    return { success: false, error: "حدث خطأ أثناء حذف الجزاء" };
  }
}
export async function createBonus(
  employeeId: string,
  data: { date: string; reason: string; amount?: string; attachments?: string }
) {
  try {
    const validatedData = z
      .object({
        date: z.string().min(1, "التاريخ مطلوب"),
        reason: z.string().min(1, "الموقف مطلوب"),
        amount: z.string().optional(),
        attachments: z.string().optional(),
      })
      .parse(data);

    const bonus = await prisma.bonus.create({
      data: {
        employeeId,
        date: new Date(validatedData.date),
        reason: validatedData.reason,
        amount: validatedData.amount || null,
        attachments: validatedData.attachments || null,
      },
    });

    revalidatePath(`/employees/${employeeId}`);
    return { success: true, bonus };
  } catch (error) {
    console.error("Error creating bonus:", error);
    if (error instanceof z.ZodError) {
      return { success: false, error: "بيانات غير صحيحة" };
    }
    return { success: false, error: "حدث خطأ أثناء إنشاء العلاوة" };
  }
}

export async function updateBonus(
  bonusId: string,
  employeeId: string,
  data: { date: string; reason: string; amount?: string; attachments?: string }
) {
  try {
    const validatedData = z
      .object({
        date: z.string().min(1, "التاريخ مطلوب"),
        reason: z.string().min(1, "الموقف مطلوب"),
        amount: z.string().optional(),
        attachments: z.string().optional(),
      })
      .parse(data);

    const bonus = await prisma.bonus.update({
      where: { id: bonusId },
      data: {
        date: new Date(validatedData.date),
        reason: validatedData.reason,
        amount: validatedData.amount || null,
        attachments: validatedData.attachments || null,
      },
    });

    revalidatePath(`/employees/${employeeId}`);
    return { success: true, bonus };
  } catch (error) {
    console.error("Error updating bonus:", error);
    if (error instanceof z.ZodError) {
      return { success: false, error: "بيانات غير صحيحة" };
    }
    return { success: false, error: "حدث خطأ أثناء تحديث العلاوة" };
  }
}

export async function deleteBonus(bonusId: string, employeeId: string) {
  try {
    await prisma.bonus.delete({ where: { id: bonusId } });
    revalidatePath(`/employees/${employeeId}`);
    return { success: true };
  } catch (error) {
    console.error("Error deleting bonus:", error);
    return { success: false, error: "حدث خطأ أثناء حذف العلاوة" };
  }
}

export async function createEfficiencyReport(
  employeeId: string,
  data: {
    year: string;
    grade: string;
    description: string;
    attachments?: string;
  }
) {
  try {
    const validatedData = z
      .object({
        year: z
          .string()
          .min(1, "سنة التقرير مطلوبة")
          .regex(/^\d{4}$/, "السنة يجب أن تكون أربعة أرقام"),
        grade: efficiencyGradeEnum,
        description: z.string().min(1, "الوصف مطلوب"),
        attachments: z.string().optional(),
      })
      .parse(data);

    const report = await prisma.efficiencyReport.create({
      data: {
        employeeId,
        year: parseInt(validatedData.year),
        grade: validatedData.grade,
        description: validatedData.description,
        attachments: validatedData.attachments || null,
      },
    });

    revalidatePath(`/employees/${employeeId}`);
    return { success: true, report };
  } catch (error) {
    console.error("Error creating efficiency report:", error);
    if (error instanceof z.ZodError) {
      return { success: false, error: "بيانات غير صحيحة" };
    }
    return { success: false, error: "حدث خطأ أثناء إنشاء التقرير" };
  }
}

export async function updateEfficiencyReport(
  reportId: string,
  employeeId: string,
  data: {
    year: string;
    grade: string;
    description: string;
    attachments?: string;
  }
) {
  try {
    const validatedData = z
      .object({
        year: z
          .string()
          .min(1, "سنة التقرير مطلوبة")
          .regex(/^\d{4}$/, "السنة يجب أن تكون أربعة أرقام"),
        grade: efficiencyGradeEnum,
        description: z.string().min(1, "الوصف مطلوب"),
        attachments: z.string().optional(),
      })
      .parse(data);

    const report = await prisma.efficiencyReport.update({
      where: { id: reportId },
      data: {
        year: parseInt(validatedData.year),
        grade: validatedData.grade,
        description: validatedData.description,
        attachments: validatedData.attachments || null,
      },
    });

    revalidatePath(`/employees/${employeeId}`);
    return { success: true, report };
  } catch (error) {
    console.error("Error updating efficiency report:", error);
    if (error instanceof z.ZodError) {
      return { success: false, error: "بيانات غير صحيحة" };
    }
    return { success: false, error: "حدث خطأ أثناء تحديث التقرير" };
  }
}

export async function deleteEfficiencyReport(
  reportId: string,
  employeeId: string
) {
  try {
    await prisma.efficiencyReport.delete({ where: { id: reportId } });
    revalidatePath(`/employees/${employeeId}`);
    return { success: true };
  } catch (error) {
    console.error("Error deleting efficiency report:", error);
    return { success: false, error: "حدث خطأ أثناء حذف التقرير" };
  }
}
