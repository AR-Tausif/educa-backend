import { z } from "zod";
const StudentValidationSchema = z.object({
  body: z.object({
    IconImage: z.string().optional(),
    TitleBangla: z.string(),
    TitleEnglish: z.string(),
    status: z.enum(["teacher-jobs", "railway-jobs"]).optional(),
  }),
});

const CreateStudentValidation = z.object({
  body: z.object({
    classRoll: z.number().optional(),
    studentName: z.string(),
    dateOfBirth: z.string(),
    gender: z.string().optional(),
    class: z.string(),
    religion: z.string().optional(),
    placeOfBirth: z.string().optional(),
    nationality: z.string().optional(),
    fastLangues: z.string().optional(),
    presentAddress: z.string().optional(),
    permanentAddress: z.string().optional(),

    fatherName: z.string(),
    fatherEmail: z.string().optional(),
    fatherPhonNumber: z.string().optional(),
    fatherIDCardNumber: z.string().optional(),
    fatherProfession: z.string().optional(),
    fatherPesignation: z.string().optional(),

    motherName: z.string(),
    motherEmail: z.string().optional(),
    motherPhonNumber: z.string().optional(),
    motherIDCardNumber: z.string().optional(),
    motherProfession: z.string().optional(),
    motherPesignation: z.string().optional(),
  }),
});
const updateStudentValidationSchema = z.object({
  body: z.object({
    studentName: z.string().optional(),
    dateOfBirth: z.string().optional(),
    gender: z.string().optional(),
    class: z.string().optional(),
    religion: z.string().optional(),
    placeOfBirth: z.string().optional(),
    nationality: z.string().optional(),
    firstLanguage: z.string().optional(),
    presentAddress: z.string().optional(),
    permanentAddress: z.string().optional(),

    fatherName: z.string().optional(),
    fatherEmail: z.string().optional(),
    fatherPhonNumber: z.string().optional(),

    fatherProfession: z.string().optional(),
    fatherPesignation: z.string().optional(),

    motherName: z.string().optional(),
    motherEmail: z.string().optional(),
    motherPhonNumber: z.string().optional(),

    motherProfession: z.string().optional(),
    motherPesignation: z.string().optional(),
  }),
});

export const StudentValidation = {
  StudentValidationSchema,
  CreateStudentValidation,
  updateStudentValidationSchema,
};
