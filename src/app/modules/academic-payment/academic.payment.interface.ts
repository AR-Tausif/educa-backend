import { Types } from "mongoose";

export type TAcademicPayment = {
  class: Types.ObjectId;
  year: number;
  createdBy: Types.ObjectId;
  // fees
  yearlyMonthFees: number;
  admissionFees: number;
  reAdmissionFees: number;
  books: number;
  stationeries: number;
  idCard: number;
  tie: number;
  studyTour: number;
  examFees: number;
  picnicFees: number;
};

export const paymentValidNames = [
  "monthly",
  "admission",
  "readmission",
  "picnic",
  "exam",
  "studyTour",
  "books",
  "idCard",
  "stationeries",
  "tie",
] as const;

export type TAccademicUpdatePayload = {
  _id: string;
  data: TAcademicPayment;
};
