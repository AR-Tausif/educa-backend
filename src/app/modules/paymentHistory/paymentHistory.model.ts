import { Schema, model } from "mongoose";
import { TPaymentHistory } from "./paymentHistory.interface";

const studentPaymentHistorySchema = new Schema<TPaymentHistory>(
  {
    student: { type: Schema.Types.ObjectId, ref: "Student" },
    class: { type: Schema.Types.ObjectId, ref: "Class" },
    studentPayment: { type: Schema.Types.ObjectId, ref: "StudentPayment" },
    receivedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    year: Number,
    date: String,
    admissionFees: { type: Number, default: 0 },
    reAdmissionFees: { type: Number, default: 0 },
    yearlyMonthFees: { type: Number, default: 0 },
    books: { type: Number, default: 0 },
    picnicFees: { type: Number, default: 0 },
    idCard: { type: Number, default: 0 },
    examFees: { type: Number, default: 0 },
    stationeries: { type: Number, default: 0 },
    studyTour: { type: Number, default: 0 },
    tie: { type: Number, default: 0 },
    discountOnFees: { type: Number, default: 0 },
    cashCollection: { type: Number, default: 0 },
    others: { type: Number, default: 0 },
  },
  { timestamps: true, versionKey: false }
);

const PaymentHistoryModel = model<TPaymentHistory>(
  "PaymentHistory",
  studentPaymentHistorySchema
);

export default PaymentHistoryModel;
