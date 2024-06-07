import { Schema } from "mongoose";
import { TEDUCAClass } from "./class.interface";
import { model } from "mongoose";

const ClassSchema = new Schema<TEDUCAClass>(
  {
    name: { type: String, required: true, unique: true },
    createdBy: { type: Schema.Types.ObjectId, required: true },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true, versionKey: false }
);

const ClassModel = model<TEDUCAClass>("Class", ClassSchema);
export default ClassModel;
