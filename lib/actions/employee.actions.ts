"use server";

import { prisma } from "@/db/prisma";
import { revalidatePath, unstable_noStore as noStore } from "next/cache";
import { z } from "zod";
import { createEmployeeApiSchema } from "../validators";

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
        date: pen.date,
        type: pen.type,
        description: pen.description,
        attachments: pen.attachments || null,
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
        date: pen.date,
        type: pen.type,
        description: pen.description,
        attachments: pen.attachments || null,
      }));
    }

    const employee = await prisma.employee.update({
      where: { id },
      data: empData,
    });

    if (relationships.length > 0) {
      await prisma.relationship.deleteMany({
        where: { employeeId: id },
      });

      await prisma.relationship.createMany({
        data: relationships.map((rel) => ({
          employeeId: employee.id,
          ...rel,
        })),
      });
    }

    if (penalties.length > 0) {
      await prisma.penalty.deleteMany({
        where: { employeeId: id },
      });

      await prisma.penalty.createMany({
        data: penalties.map((pen) => ({
          employeeId: employee.id,
          ...pen,
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
      orderBy: {
        createdAt: "desc",
      },
      include: {
        relationships: true,
        penalties: true,
      },
    });

    return { success: true, employees };
  } catch (error) {
    console.error("Error fetching employees:", error);
    return { success: false, error: "حدث خطأ أثناء جلب البيانات" };
  }
};

export const getEmployeesBySearch = async (name: string, administration: string) => {
  noStore();
  try {
    const cleanName = name?.replace(/\s+/g, ' ').trim() || "";
    const cleanAdmin = administration?.replace(/\s+/g, ' ').trim() || "";

    console.log("🔍 Search Input:", {
      rawName: name,
      rawAdmin: administration,
      cleanName,
      cleanAdmin,
      nameLength: cleanName.length,
      adminLength: cleanAdmin.length
    });

    const whereClause: any = {};

    if (cleanName) {
      whereClause.name = {
        contains: cleanName,
        mode: "insensitive",
      };
    }

    if (cleanAdmin) {
      whereClause.administration = cleanAdmin;
    }

    console.log("🔍 Where Clause:", JSON.stringify(whereClause, null, 2));

    let employees = await prisma.employee.findMany({
      where: whereClause,
      orderBy: {
        createdAt: "desc",
      },
      include: {
        relationships: true,
        penalties: true,
      },
    });

    console.log(`✅ Found ${employees.length} employees with exact match`);

    if (employees.length === 0 && cleanAdmin) {
      console.log("🔄 Trying with contains instead...");
      
      const containsWhere: any = {};
      if (cleanName) {
        containsWhere.name = {
          contains: cleanName,
          mode: "insensitive",
        };
      }
      containsWhere.administration = {
        contains: cleanAdmin,
        mode: "insensitive",
      };

      employees = await prisma.employee.findMany({
        where: containsWhere,
        orderBy: {
          createdAt: "desc",
        },
        include: {
          relationships: true,
          penalties: true,
        },
      });

      console.log(`✅ Found ${employees.length} employees with contains`);
    }

    if (employees.length > 0) {
      console.log("📋 Sample Results:");
      employees.slice(0, 3).forEach((emp, i) => {
        console.log(`  ${i + 1}. "${emp.name}" - "${emp.administration}" (length: ${emp.administration.length})`);
      });
    } else {
      console.log("❌ No results found");
      
      const allAdmins = await prisma.employee.findMany({
        select: { administration: true },
        distinct: ['administration']
      });
      console.log("📋 Available administrations:",
        allAdmins.map(a => `"${a.administration}" (${a.administration.length})`)
      );
    }

    return { success: true, employees };
  } catch (error) {
    console.error("❌ Error searching employees:", error);
    return { success: false, error: "حدث خطأ أثناء البحث", employees: [] };
  }
};

export const deleteEmployee = async (id: string) => {
  try {
    await prisma.employee.delete({
      where: { id },
    });

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

// New: Penalty-specific actions
export async function createPenalty(employeeId: string, data: { date: string; type: string; description: string; attachments?: string }) {
  try {
    const validatedData = z.object({
      date: z.string().min(1, "التاريخ مطلوب"),
      type: z.string().min(1, "نوع الجزاء مطلوب"),
      description: z.string().min(1, "الوصف مطلوب"),
      attachments: z.string().optional(),
    }).parse(data);

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

export async function updatePenalty(penaltyId: string, employeeId: string, data: { date: string; type: string; description: string; attachments?: string }) {
  try {
    const validatedData = z.object({
      date: z.string().min(1, "التاريخ مطلوب"),
      type: z.string().min(1, "نوع الجزاء مطلوب"),
      description: z.string().min(1, "الوصف مطلوب"),
      attachments: z.string().optional(),
    }).parse(data);

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
    await prisma.penalty.delete({
      where: { id: penaltyId },
    });

    revalidatePath(`/employees/${employeeId}`);
    return { success: true };
  } catch (error) {
    console.error("Error deleting penalty:", error);
    return { success: false, error: "حدث خطأ أثناء حذف الجزاء" };
  }
}