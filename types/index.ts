import { createEmployeeFormSchema } from '@/lib/validators';
import { z } from 'zod';



export type Employee = z.infer<typeof createEmployeeFormSchema> & {
  id: string
  createdAt: Date
  updatedAt: Date
};


// export interface User {
//   id: string
//   // Personal Information
//   fullName: string
//   monthName: string
//   birthDate: string
//   workAddress: string
//   appointmentDate: string
//   currentWork: string
//   email: string
//   mobile: string

//   // Family Information
//   spouseInfo: FamilyMember[]
//   children: FamilyMember[]
//   siblings: Sibling[]

//   // Parents Information
//   fatherName: string
//   fatherIdNumber: string
//   fatherBirthInfo: string
//   fatherProfession: string
//   fatherResidence: string
//   motherName: string
//   motherIdNumber: string
//   motherBirthInfo: string
//   motherProfession: string
//   motherResidence: string

//   // Declaration
//   signature: string
//   declarationDate: string
//   createdAt: string
//   updatedAt: string
// }

// export interface FamilyMember {
//   id: string
//   name: string
//   profession: string
//   birthDate: string
//   birthPlace: string
//   idNumber: string
//   notes: string
// }

// export interface Sibling {
//   id: string
//   name: string
//   profession: string
//   birthDate: string
//   residence: string
// }
