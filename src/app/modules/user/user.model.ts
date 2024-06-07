import { Schema, model } from "mongoose";
import { TUser } from "./user.interface";
import { USER_ROLE } from "../auth/auth.constant";
import bcrypt from "bcrypt";
import config from "../../config";

const UserSchema = new Schema<TUser>(
  {
    username: { type: String, unique: true, required: true },
    fullName: { type: String, required: true },
    password: { type: String, required: true, select: 0 },
    phoneNumber: { type: Number, required: true, unique: true },
    email: { type: String, unique: true },
    role: {
      type: String,
      enum: [USER_ROLE.user, USER_ROLE.admin, USER_ROLE.superAdmin],
      default: USER_ROLE.user,
    },
    token: { type: String },
    passwordChangeHistory: { type: Object, select: 0 },
    isDeleted: { type: Boolean, default: false },
    status: { type: String, default: "active" },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

UserSchema.pre("save", async function (next) {
  // eslint-disable-next-line @typescript-eslint/no-this-alias
  const user = this; // doc
  // hashing password and save into DB
  user.password = await bcrypt.hash(
    user.password,
    Number(config.bcrypt_salt_rounds)
  );
  next();
});

const UserModel = model<TUser>("User", UserSchema);
export default UserModel;
