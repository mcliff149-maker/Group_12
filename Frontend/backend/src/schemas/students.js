import { z } from 'zod';

export const logSchema = z.object({
  weekNumber:      z.coerce.number().int().min(1).max(52),
  logDate:         z.string().min(1, 'Log date is required.'),
  company:         z.string().min(1, 'Company is required.'),
  activities:      z.string().min(1, 'Activities are required.'),
  challenges:      z.string().min(1, 'Challenges are required.'),
  learningOutcomes:z.string().min(1, 'Learning outcomes are required.'),
  hoursWorked:     z.coerce.number().positive('Must be a positive number.'),
  status:          z.enum(['Draft', 'Submitted']).default('Draft'),
  attachment:      z.string().optional(),
});

export const timesheetSchema = z.object({
  date:            z.string().min(1, 'Date is required.'),
  startTime:       z.string().min(1, 'Start time is required.'),
  endTime:         z.string().min(1, 'End time is required.'),
  taskDescription: z.string().min(1, 'Task description is required.'),
  hours:           z.coerce.number().optional(),
  status:          z.string().default('Pending'),
});
