// import httpStatus from 'http-status';
// import { JwtPayload } from 'jsonwebtoken';
import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import { AuthServices } from "./auth.service";
import { JwtPayload } from "jsonwebtoken";
import sendResponse from "../../utils/sendResponse";

// ================================================
// create User Into DB
// ================================================

const createUser = catchAsync(async (req, res) => {
  // Remove non-digit characters from the phone number
  const phoneNumberDigits = req.body.phoneNumber.toString().replace(/\D/g, "");

  // Take the first name and convert to lowercase
  const firstName = req.body.fullName.split(" ")[0].toLowerCase();

  // Concatenate name and phone number
  req.body.username = `${firstName}${phoneNumberDigits}`;

  const user = req.body;
  const result = await AuthServices.createUserIntoDB(user);
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "User registered successfully",
    data: result,
  });
});

// ================================================
// User Login
// ================================================

const LoginUser = catchAsync(async (req, res) => {
  const result = await AuthServices.loginUser(req.body);
  const { refreshToken, accessToken } = result;

  res.cookie("refreshToken", refreshToken, {
    secure: false,
    httpOnly: true,
    sameSite: "none",
    maxAge: 1000 * 60 * 60 * 24 * 365,
  });

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User is logged in succesfully!",
    data: {
      accessToken,
    },
  });
});

// ================================================
// Password Change
// ================================================

const UserChangePassword = catchAsync(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  const result = await AuthServices.changePassword(req.username as JwtPayload, {
    currentPassword,
    newPassword,
  });
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Password is updated successfully!",
    data: result,
  });
});

const refreshToken = catchAsync(async (req, res) => {
  const { refreshToken } = req.cookies;
  const result = await AuthServices.refreshToken(refreshToken);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Access token is retrieved succesfully!",
    data: result,
  });
});

export const AuthController = {
  createUser,
  LoginUser,
  UserChangePassword,
  refreshToken,
};
