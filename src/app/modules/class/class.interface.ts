import { Types } from "mongoose";

export type TEDUCAClass = {
  name: string;
  createdBy: Types.ObjectId;
  isDeleted: boolean;
};

export type TClassPayload = {
  name: string;
  createdBy: string;
  isDeleted: boolean;
};

export type TCreateClassPayload = {
  className: string;
  createdBy: string;
  fees: {
    year: number;
    yearlyMonthFees: number;
    // yearlyAccFees: number;
    admissionFees: number;
    reAdmissionFees: number;
    books: number;
    stationeries: number;
    idCard: number;
    tie: number;
    examFees: number;
    studyTour: number;
    picnicFees: number;
  };
};
