import { Schema, model } from "mongoose";
import { TStudent } from "./student.interface";

const StudentSchema = new Schema<TStudent>(
  {
    classRoll: { type: Number },
    studentName: { type: String, required: true },
    dateOfBirth: { type: Date, required: true },
    gender: { type: String },
    class: { type: Schema.Types.ObjectId, ref: "Class", required: true },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    religion: { type: String },
    placeOfBirth: { type: String },
    nationality: { type: String },
    firstLanguage: { type: String },
    presentAddress: { type: String },
    permanentAddress: { type: String },
    isDeleted: { type: Boolean, default: false },

    fatherName: { type: String, required: true },
    fatherEmail: { type: String },
    fatherPhonNumber: { type: String },
    fatherIDCardNumber: { type: String },
    fatherProfession: { type: String },
    fatherPesignation: { type: String },

    motherName: { type: String, required: true },
    motherEmail: { type: String },
    motherPhonNumber: { type: String },
    motherIDCardNumber: { type: String },
    motherProfession: { type: String },
    motherPesignation: { type: String },

    status: {
      type: String,
      enum: ["Active", "Block"],
      default: "Active",
    },
  },
  { timestamps: true, versionKey: false }
);

const StudentModel = model<TStudent>("Student", StudentSchema);
export default StudentModel;
