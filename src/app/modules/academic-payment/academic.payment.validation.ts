import { z } from "zod";

const createAcademicPaymentValidationSchema = z.object({
  body: z.object({
    class: z.string(),
    year: z.number(),
    admissionFees: z.number().optional(),
    reAdmissionFees: z.number().optional(),
    monthlyFees: z.number().optional(),
    books: z.number().optional(),
    stationeries: z.number().optional(),
    idCard: z.number().optional(),
    tie: z.number().optional(),
    studyTour: z.number().optional(),
    examFees: z.number().optional(),
    picnicFees: z.number().optional(),
  }),
});

export const PaymentValidation = {
  createAcademicPaymentValidationSchema,
};
