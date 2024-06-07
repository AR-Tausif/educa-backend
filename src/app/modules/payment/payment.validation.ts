import { z } from "zod";

const createClassValidationSchema = z.object({
  body: z.object({
    paymentedBy: z.string(),
    student: z.string(),
    class: z.string(),
    date: z.string(),
    fees: z.object({
      admissionFees: z.number().optional(),
      monthlyFees: z.number().optional(),
      books: z.number().optional(),
    }),
  }),
});

export const PaymentValidation = {
  createClassValidationSchema,
};
