// src/constants/degrees.ts

export const EDUCATIONAL_DEGREES = [
  "دكتوراة",
  "ماجستير",
  "بكالوريوس",
  "ثانوية عامة",
  "ثانوية أزهرية",
  "مؤهل فوق متوسط",
  "مؤهل متوسط",
  "اعدادية",
  "ابتدائية",
  "محو أمية",
  "بدون",
];
export const EDUCATIONAL_DEGREE_MAPPING: Record<string, string> = {
  دكتوراة: "DOCTORATE",
  ماجستير: "MASTERS",
  بكالوريوس: "BACHELORS",
  "ثانوية عامة": "GENERAL_SECONDARY",
  "ثانوية أزهرية": "AZHARI_SECONDARY",
  "مؤهل فوق متوسط": "ABOVE_AVERAGE",
  "مؤهل متوسط": "AVERAGE",
  اعدادية: "PREPARATORY",
  ابتدائية: "PRIMARY",
  "محو أمية": "LITERACY",
  بدون: "NONE",
};

export const EDUCATIONAL_DEGREE_REVERSE_MAPPING: Record<string, string> = {
  DOCTORATE: "دكتوراة",
  MASTERS: "ماجستير",
  BACHELORS: "بكالوريوس",
  GENERAL_SECONDARY: "ثانوية عامة",
  AZHARI_SECONDARY: "ثانوية أزهرية",
  ABOVE_AVERAGE: "مؤهل فوق متوسط",
  AVERAGE: "مؤهل متوسط",
  PREPARATORY: "اعدادية",
  PRIMARY: "ابتدائية",
  LITERACY: "محو أمية",
  NONE: "بدون",
};
