export const APP_NAME_SHORT = "جهاز تعمير سيناء ومدن القناة";
export const APP_NAME_FULL = "وزارة الإسكان و المرافق والمجتمعات العمرانية";
export const APP_DEPARTMENT = "الجهاز المركزي للتعمير";
export const APP_DESCRIPTION = "نظام إدارة الموظفين لجهاز تعمير سيناء ومدن القناة";
export const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:3000";

export const metadata = {
  title: {
    template: `%s | ${APP_NAME_SHORT}`,
    default: APP_NAME_SHORT,
  },
  description: APP_DESCRIPTION,
  metadataBase: new URL(SERVER_URL),
};

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