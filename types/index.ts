import { createEmployeeFormSchema } from '@/lib/validators';
import { z } from 'zod';



export type Employee = z.infer<typeof createEmployeeFormSchema> & {
  id: string
  createdAt: Date
  updatedAt: Date
};
