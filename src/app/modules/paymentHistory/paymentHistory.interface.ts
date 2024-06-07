import { Types } from "mongoose";

export type TPaymentHistory = {
  student: Types.ObjectId;
  class: Types.ObjectId;
  studentPayment: Types.ObjectId;
  receivedBy: Types.ObjectId;
  year: number;
  date: Date;
  // Fees
  admissionFees: number;
  reAdmissionFees: number;
  yearlyMonthFees: number;
  books: number;
  picnicFees: number;
  idCard: number;
  examFees: number;
  stationeries: number;
  studyTour: number;
  tie: number;
  discountOnFees: number;
  cashCollection: number;
};
