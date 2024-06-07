/* eslint-disable no-useless-catch */
/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */

import bcrypt from "bcrypt";
import httpStatus from "http-status";
import jwt, { JwtPayload } from "jsonwebtoken";
import config from "../../config";
import AppError from "../../errors/AppErrors";
import { createToken, verifyToken } from "./auth.utils";
import { TUser } from "../user/user.interface";
import UserModel from "../user/user.model";
import toTitleCase from "../../helper/toTitleCase";

// ========>:   Create User Into Database Function   :<========

const createUserIntoDB = async (user: TUser) => {
  const isExistUser = await UserModel.findOne({ email: user.email });

  if (!user) {
    throw new AppError(httpStatus.BAD_REQUEST, "User already exist!");
  }

  const result = await UserModel.create(user);
  return {
    _id: result._id,
    username: result.username,
    full_name: toTitleCase(result.fullName),
    email: result.email,
    phone_number: result.phoneNumber,
    role: result.role,
    createdAt: result?.createdAt,
    updatedAt: result?.updatedAt,
  };
};

// ========>:   Login user with email and password Function   :<========

const loginUser = async (payload: TUser) => {
  const { username, email, password } = payload;

  const user = await UserModel.findOne({
    $or: [{ username }, { email }],
  }).select("+password");

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found!");
  }

  const isDeleted = user.isDeleted;
  if (isDeleted) {
    throw new AppError(httpStatus.FORBIDDEN, "This user is deleted!");
  }

  const hastPassedPassword = await bcrypt.compare(password, user.password);

  if (!hastPassedPassword) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "Email and password doesn't match!"
    );
  }

  const jwtPayload = {
    userId: user.id,
    role: user.role || "user",
  };

  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.jwt_Access_Expires_in as string
  );
  const refreshToken = createToken(
    jwtPayload,
    config.jwt_refresh_secret as string,
    config.jwt_Refresh_Expires_in as string
  );

  return {
    accessToken,
    refreshToken,
  };
};

// ========>:   Change password Function   :<========

const changePassword = async (
  userData: JwtPayload,
  payload: { currentPassword: string; newPassword: string }
) => {
  const user = await UserModel.findOne({ _id: userData._id }).select(
    "+password"
  );
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "This user is not found!");
  }
  const isPasswordMatch = await bcrypt.compare(
    payload.currentPassword,
    user.password
  );

  if (!isPasswordMatch) {
    throw new AppError(httpStatus.FORBIDDEN, "Current password does not match");
  }

  const newHashedPassword = await bcrypt.hash(
    payload.newPassword,
    Number(config.bcrypt_salt_rounds)
  );
  const result = await UserModel.findByIdAndUpdate(userData._id, {
    password: newHashedPassword,
    needsPasswordChange: false,
    passwordChangedAt: new Date(),
  }).select({
    __v: 0,
    currentPassword: 0,
    newPassword: 0,
    passwordChangeHistory: 0,
  });

  return result;
};

// ========>:   Create Refresh Token Function   :<========

const refreshToken = async (token: string) => {
  // checking if the given token is valid
  const decoded = verifyToken(token, config.jwt_refresh_secret as string);

  const { _id, iat } = decoded;

  const user = await await UserModel.findOne(_id);

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "This user is not found !");
  }
  // checking if the user is already deleted
  const isDeleted = user?.isDeleted;

  if (isDeleted) {
    throw new AppError(httpStatus.FORBIDDEN, "This user is deleted !");
  }

  // checking if the user is blocked
  const userStatus = user?.status;

  if (userStatus === "block") {
    throw new AppError(httpStatus.FORBIDDEN, "This user is blocked ! !");
  }

  if (
    user.passwordChangedAt &&
    user.isJWTIssuedBeforePasswordChanged?.(
      user.passwordChangedAt,
      iat as number
    )
  ) {
    throw new AppError(httpStatus.UNAUTHORIZED, "You are not authorized !");
  }

  const jwtPayload = {
    userId: user.id,
    role: user.role || "user",
  };

  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.jwt_Access_Expires_in as string
  );

  return {
    accessToken,
  };
};

export const AuthServices = {
  createUserIntoDB,
  loginUser,
  changePassword,
  refreshToken,
};
