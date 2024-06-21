import { Types } from "mongoose";

export type TStudentPaymentReqBody = {
  paymentedBy: string;
  student: Types.ObjectId;
  class: number;
  receivedBy: Types.ObjectId;
  year?: number;
  date: Date;
  lastPaymentedDate: Date;
  fees: {
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
    others: number;
  };
  discountOnFees: number;
  cashCollection: number;
};

export type TFieldType = {
  amount: number;
  date: Date;
  due: number;
};

export type TPaymentHistory = {
  date: Date;
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

export interface TStudentPayment extends Document {
  student: Types.ObjectId;
  class: Types.ObjectId;
  receivedBy: Types.ObjectId;
  paymentedBy: string;
  year: number;
  lastPaymentedDate: Date;

  // Fees
  yearlyMonthFees: TFieldType;
  admissionFees: TFieldType;
  reAdmissionFees: TFieldType;
  books: TFieldType;
  stationeries: TFieldType;
  idCard: TFieldType;
  tie: TFieldType;
  studyTour: TFieldType;
  examFees: TFieldType;
  picnicFees: TFieldType;
  others: TFieldType;
  // paymentHistory: TPaymentHistory[];
}

// export type TActualPayments = {
//   id: "sdf";
//   class: "Six";
//   monthlyFees: number;
//   admissionFees: number;
//   reAdmissionFees: number;
//   books: number;
//   stationeries: number;
//   idCard: number;
//   tie: number;
//   studyTour: number;
//   examFees: number;
//   picnicFees: number;
// };
