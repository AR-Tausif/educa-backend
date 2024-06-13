import httpStatus from "http-status";
import sendResponse from "../../utils/sendResponse";
import catchAsync from "../../utils/catchAsync";
import { StudentPaymentService } from "./academic.payment.service";

const createAcademicPaymentIntoDB = catchAsync(async (req, res) => {
  req.body.createdBy = req.username.userId;
  const paymentData = req.body;
  const result =
    await StudentPaymentService.createAcademicPaymentIntoDB(paymentData);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "academic payment created successfully",
    data: result,
  });
});
const getAcademicPaymentFromDB = catchAsync(async (req, res) => {
  const result = await StudentPaymentService.getAllAcademicPaymentFromDB();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "academic payment are retrieved successfully",
    data: result,
  });
});
const getAcademicPaymentByClassIdAndYear = catchAsync(async (req, res) => {
  const result = await StudentPaymentService.getAcademicPaymentByClassIdAndYear(
    { classId: req.params.classId as string }
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "academic payment is retrieved by classId successfully",
    data: result,
  });
});
const updateAcademicPaymentById = catchAsync(async (req, res) => {
  const result = await StudentPaymentService.updateAcademicPaymentById({
    _id: req.params._id,
    data: req.body,
  });
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "academic payment is updated by id successfully",
    data: result,
  });
});

export const StudentPaymentController = {
  createAcademicPaymentIntoDB,
  getAcademicPaymentFromDB,
  getAcademicPaymentByClassIdAndYear,
  updateAcademicPaymentById,
};
