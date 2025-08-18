import { getEmployeeById } from "@/lib/actions/employee.actions";
import EmployeeForm from "@/components/employee-form";
import { Metadata } from "next";

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

const page = async (props: { params: Promise<{ id: string }> }) => {
  const { id } = await props.params;
  const employeeData = await getEmployeeById(id);

  if (!employeeData.success || !employeeData.employee) {
    return <div className="text-center text-red-500">Employee not found</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 space-y-6">
        {/* Title and add button */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between bg-white p-6">
          <div className="mb-4 md:mb-0">
            <h1 className="text-3xl font-bold text-gray-900">تعديل موظف</h1>
            <p className="text-gray-600 mt-1">
              اضافة وعرض بيانات الموظفين في المؤسسة
            </p>
          </div>
        </div>

        {/* Employee form */}
        <EmployeeForm
          type="Update"
          employee={employeeData.employee as EmployeeData}
          employeeId={id}
        />
      </div>
    </div>
  );
};

export default page;
