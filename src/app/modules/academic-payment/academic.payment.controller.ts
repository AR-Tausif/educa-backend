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
    message: "Academic Payment Created Successfully",
    data: result,
  });
});
const getAcademicPaymentFromDB = catchAsync(async (req, res) => {
  const result = await StudentPaymentService.getAllAcademicPaymentFromDB();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Academic Payment are Retrieved Successfully",
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
    message: "Academic Payment is Retrieved by ClassId Successfully",
    data: result,
  });
});

export const StudentPaymentController = {
  createAcademicPaymentIntoDB,
  getAcademicPaymentFromDB,
  getAcademicPaymentByClassIdAndYear,
};
