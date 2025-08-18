import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


 export const formateHiringType = (hiringType: string) => {
    switch (hiringType) {
      case "full-time":
        return "دوام كامل"
      case "secondment":
        return "معار"
      case "mandate":
        return "ندب"
      case "temporary":
        return "مؤقت"
      default:
        return "غير محدد"
    }
  }

  export const formateMaritalStatus = (maritalStatus: string) => {
    switch (maritalStatus) {
      case "single":
        return "أعزب"
      case "married":
        return "متزوج"
      case "divorced":
        return "مطلق"
      case "widowed":
        return "أرمل"
      default:
        return "غير محدد"
    }
  }
