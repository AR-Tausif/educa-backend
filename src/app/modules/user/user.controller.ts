import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { UserServices } from "./user.service";

// ================================================
//Get All User  Function
// ================================================
const getAllUser = catchAsync(async (req, res) => {
  const result = await UserServices.getAllUserFromDB();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Users Received Successfully",
    data: result,
  });
});
// ================================================
//Get All User  Function
// ================================================
const makeAdminById = catchAsync(async (req, res) => {
  const userId = req.params.userId;
  const result = await UserServices.makeAdminById(userId);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Make admin successfully",
    data: result,
  });
});
// ================================================
// Make user Function
// ================================================
const makeUserById = catchAsync(async (req, res) => {
  const userId = req.params.userId;
  const result = await UserServices.makeUserById(userId);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Make user successfully",
    data: result,
  });
});
// ================================================
// Blocking user Function
// ================================================
const blockingUserById = catchAsync(async (req, res) => {
  const userId = req.params.userId;
  const result = await UserServices.blockingUserById(userId);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User blocking successfully",
    data: result,
  });
});
// ================================================
// Activating user Function
// ================================================
const activatingUserById = catchAsync(async (req, res) => {
  const userId = req.params.userId;
  const result = await UserServices.activatingUserById(userId);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User activated successfully",
    data: result,
  });
});
// ================================================
// Deleting user Function
// ================================================
const deletingUserById = catchAsync(async (req, res) => {
  const userId = req.params.userId;

  const result = await UserServices.deletingUserById(userId);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User deleted successfully",
    data: result,
  });
});
// ================================================
// Counting documents Function
// ================================================
const countingDocument = catchAsync(async (req, res) => {
  const result = await UserServices.countingDocument();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Documents counted successfully",
    data: result,
  });
});

export const UserController = {
  getAllUser,
  makeAdminById,
  makeUserById,
  blockingUserById,
  activatingUserById,
  deletingUserById,
  countingDocument,
};
