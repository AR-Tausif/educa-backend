import { z } from "zod";

const createClassValidation = z.object({
  body: z.object({
    className: z.string(),
    fees: z.object({
      year: z.number().min(4),
      yearlyMonthFees: z.number(),
      // yearlyAccFees: z.number().optional(),
      admissionFees: z.number().optional(),
      reAdmissionFees: z.number().optional(),
      books: z.number().optional(),
      stationeries: z.number().optional(),
      idCard: z.number().optional(),
      tie: z.number().optional(),
      examFees: z.number().optional(),
      studyTour: z.number().optional(),
      picnicFees: z.number().optional(),
    }),
  }),
});
const updateClassValidationSchema = z.object({
  body: z.object({
    className: z.string().optional(),
    fees: z.object({
      year: z.number().min(4).optional(),
      yearlyMonthFees: z.number().optional(),
      // yearlyAccFees: z.number().optional(),
      admissionFees: z.number().optional(),
      reAdmissionFees: z.number().optional(),
      books: z.number().optional(),
      stationeries: z.number().optional(),
      idCard: z.number().optional(),
      tie: z.number().optional(),
      examFees: z.number().optional(),
      studyTour: z.number().optional(),
      picnicFees: z.number().optional(),
    }),
  }),
});

export const ClassValidation = {
  createClassValidation,
  updateClassValidationSchema,
};
