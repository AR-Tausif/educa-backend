import { Schema, model } from "mongoose";
import { TAcademicPayment } from "./academic.payment.interface";
const academicPaymentFeesType = { type: Number, default: 0 };
const AcademicPaymentSchema = new Schema<TAcademicPayment>(
  {
    class: { type: Schema.Types.ObjectId, ref: "Class", required: true },
    year: { type: Number, required: true },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    // Fees
    admissionFees: academicPaymentFeesType,
    reAdmissionFees: academicPaymentFeesType,
    books: academicPaymentFeesType,
    examFees: academicPaymentFeesType,
    idCard: academicPaymentFeesType,
    yearlyMonthFees: academicPaymentFeesType,
    picnicFees: academicPaymentFeesType,
    stationeries: academicPaymentFeesType,
    studyTour: academicPaymentFeesType,
    tie: academicPaymentFeesType,
  },
  { timestamps: true, versionKey: false }
);

const AcademicPaymentModel = model<TAcademicPayment>(
  "AcademicPayment",
  AcademicPaymentSchema
);

export default AcademicPaymentModel;
