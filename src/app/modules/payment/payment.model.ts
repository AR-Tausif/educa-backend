import { Schema, model } from "mongoose";
import { TFieldType, TStudentPayment } from "./payment.interface";

const academicPaymentFeesType = new Schema<TFieldType>({
  amount: { type: Number, default: 0 },
  date: Date,
  due: { type: Number, default: 0 },
});
// const StudentPaymentHistory = new Schema<TPaymentHistory>({
//   date: Date,
//   admissionFees: { type: Number, default: 0 },
//   reAdmissionFees: { type: Number, default: 0 },
//   yearlyMonthFees: { type: Number, default: 0 },
//   books: { type: Number, default: 0 },
//   picnicFees: { type: Number, default: 0 },
//   idCard: { type: Number, default: 0 },
//   examFees: { type: Number, default: 0 },
//   stationeries: { type: Number, default: 0 },
//   studyTour: { type: Number, default: 0 },
//   tie: { type: Number, default: 0 },
//   discountOnFees: { type: Number, default: 0 },
//   cashCollection: { type: Number, default: 0 },
// });

const StudentPaymentSchema = new Schema<TStudentPayment>(
  {
    student: { type: Schema.Types.ObjectId, ref: "Student", required: true },
    class: { type: Schema.Types.ObjectId, ref: "Class", required: true },
    receivedBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    paymentedBy: { type: String },
    year: { type: Number },
    lastPaymentedDate: { type: Date, require: true },

    // Available Fees
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

    // paymentHistory: [StudentPaymentHistory],
  },
  { timestamps: true, versionKey: false }
);

const StudentPaymentModel = model<TStudentPayment>(
  "StudentPayment",
  StudentPaymentSchema
);

export default StudentPaymentModel;
