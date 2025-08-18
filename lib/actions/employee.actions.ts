"use server";

import { prisma } from "@/db/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createEmployeeApiSchema } from "../validators";
// import { saveImageUrl, getUserImages, deleteImageUrl } from "@/lib/db";

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
      notes: validatedData.notes || "",
      personalImageUrl: validatedData.personalImageUrl || null,
      idFrontImageUrl: validatedData.idFrontImageUrl || null,
      idBackImageUrl: validatedData.idBackImageUrl || null,
    };

    let relationships: Relationship[] = [];
    if (validatedData.relationships && validatedData.relationships.length > 0) {
      relationships = validatedData.relationships.map((rel) => ({
        relationshipType: rel.relationshipType,
        name: rel.name,
        nationalId: rel.nationalId || null, // Changed from "" to null
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
      await prisma.relationship.createMany({
        data: relationships.map((rel: Relationship) => ({
          employeeId: employee.id,
          ...rel,
        })),
      });
    }

    revalidatePath("/");
    revalidatePath("/", "page");

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
      ...(validatedData.notes && { notes: validatedData.notes }),
      personalImageUrl: validatedData.personalImageUrl || null,
      idFrontImageUrl: validatedData.idFrontImageUrl || null,
      idBackImageUrl: validatedData.idBackImageUrl || null,
    };

    let relationships: Relationship[] = [];
    if (validatedData.relationships && validatedData.relationships.length > 0) {
      relationships = validatedData.relationships.map((rel) => ({
        relationshipType: rel.relationshipType,
        name: rel.name,
        nationalId: rel.nationalId || null, // Changed from "" to null
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

    revalidatePath("/");
    revalidatePath("/", "page");
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
export const deleteEmployee = async (id: string) => {
  try {
    await prisma.employee.delete({
      where: { id },
    });

    // Revalidate multiple paths to ensure cache is cleared
    revalidatePath("/");
    revalidatePath("/", "page");
    revalidatePath("/", "layout");
    return { success: true };
  } catch (error) {
    console.error("Error deleting employee:", error);
    return { success: false, error: "حدث خطأ أثناء حذف الموظف" };
  }
};

export const getEmployeeById = async (id: string) => {
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
