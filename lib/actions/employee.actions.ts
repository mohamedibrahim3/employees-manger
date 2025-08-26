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

export async function createEmployee(
  data: z.infer<typeof createEmployeeApiSchema>
) {
  try {
    const validatedData = createEmployeeApiSchema.parse(data);

    const empData = {
      name: validatedData.name,
      nickName: validatedData.nickName,
      profession: validatedData.profession,
      // validatedData.birthDate should already be a Date (from the schema),
      // but we wrap with new Date(...) as a safe normalization if a string slipped through.
      birthDate: new Date(validatedData.birthDate),
      nationalId: validatedData.nationalId,
      maritalStatus: validatedData.maritalStatus,
      residenceLocation: validatedData.residenceLocation,
      hiringDate: new Date(validatedData.hiringDate),
      hiringType: validatedData.hiringType,
      administration: validatedData.administration,
      actualWork: validatedData.actualWork,
      phoneNumber: validatedData.phoneNumber,
      email: validatedData.email || null,
      notes: validatedData.notes || "", // خليها فارغة
      personalImageUrl: validatedData.personalImageUrl || null,
      idFrontImageUrl: validatedData.idFrontImageUrl || null,
      idBackImageUrl: validatedData.idBackImageUrl || null,
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

    const employee = await prisma.employee.create({
      data: empData,
    });

    if (relationships.length > 0) {
      // createMany is fine if fields match DB nullable types
      await prisma.relationship.createMany({
        data: relationships.map((rel: Relationship) => ({
          employeeId: employee.id,
          ...rel,
        })),
      });
    }

    // Revalidate the relevant pages (call takes only the path)
    revalidatePath("/employees");
    revalidatePath("/");
    // optional: revalidate specific employee page if you want it to appear immediately
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
      nickName: validatedData.nickName,
      profession: validatedData.profession,
      birthDate: new Date(validatedData.birthDate),
      nationalId: validatedData.nationalId,
      maritalStatus: validatedData.maritalStatus,
      residenceLocation: validatedData.residenceLocation,
      hiringDate: new Date(validatedData.hiringDate),
      hiringType: validatedData.hiringType,
      email: validatedData.email || null,
      administration: validatedData.administration,
      actualWork: validatedData.actualWork,
      phoneNumber: validatedData.phoneNumber,
      notes: validatedData.notes || "", // خليها فارغة
      personalImageUrl: validatedData.personalImageUrl || null,
      idFrontImageUrl: validatedData.idFrontImageUrl || null,
      idBackImageUrl: validatedData.idBackImageUrl || null,
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

    // Revalidate affected paths
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
    const employees = await prisma.employee.findMany({
      where: {
        name: {
          contains: name,
          mode: "insensitive",
        },
        administration: administration,
      },
      orderBy: {
        createdAt: "desc",
      },
      include: {
        relationships: true,
      },
    });

    return { success: true, employees };
  } catch (error) {
    console.error("Error searching employees:", error);
    return { success: false, error: "حدث خطأ أثناء البحث" };
  }
};

export const deleteEmployee = async (id: string) => {
  try {
    await prisma.employee.delete({
      where: { id },
    });

    // Revalidate relevant paths (single param each)
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