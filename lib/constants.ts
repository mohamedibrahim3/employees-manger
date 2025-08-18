export const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || "Employee Management System";
export const APP_DESCRIPTION = process.env.NEXT_PUBLIC_APP_DESCRIPTION || "Manage your employees efficiently.";
export const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:3000";

export const signInDefaultValues = {
  username: "",
  password: "",
};


export const employeeFormDefaultValues = {
  name: "",
  nickName: "",
  profession: "",
  birthDate: "",
  nationalId: "",
  maritalStatus: "single" as const,
  residenceLocation: "",
  hiringDate: "",
  hiringType: "full-time" as const,
  email: "",
  administration: "",
  actualWork: "",
  phoneNumber: "",
  notes: "",
  relationships: []
}