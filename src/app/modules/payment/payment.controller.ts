import httpStatus from "http-status";
import sendResponse from "../../utils/sendResponse";
import catchAsync from "../../utils/catchAsync";
import { StudentPaymentService } from "./payment.service";
import { TStudentPaymentReqBody } from "./payment.interface";

const createStudentPaymentIntoDB = catchAsync(async (req, res) => {
  req.body.receivedBy = req.username.userId;
  // {
  //   paymentedBy: "Partho Kirtunia",
  //   student: mongodbID,
  //   class: 9,
  //   fees: {
  //   admissionFees: 20000,
  //   date: 10-05-2024,
  //    }
  //   }

  const paymentData: TStudentPaymentReqBody = req.body;

  const result =
    await StudentPaymentService.createStudentPaymentIntoDB(paymentData);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Student Payment Created Successfully",
    data: result,
  });
});
const getAllStudentPaymentIntoDB = catchAsync(async (req, res) => {
  const result = await StudentPaymentService.getAllStudentPaymentIntoDB();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "All Student Payment History Retrieved are Successfully",
    data: result,
  });
});
const getSingleStudentPaymentInfoByStudentIdAndClassID = catchAsync(
  async (req, res) => {
    const { studentId, classId } = req.params;
    const result =
      await StudentPaymentService.getSingleStudentPaymentInfoByStudentIdAndClassID(
        { studentId, classId }
      );
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Single Student Payment Info Retrieved is Successfully",
      data: result,
    });
  }
);
const getSingleStudentPaymentHistoryInfoByStudentIdAndClassID = catchAsync(
  async (req, res) => {
    const { studentId, classId } = req.params;
    const result =
      await StudentPaymentService.getSingleStudentPaymentHistoryInfoByStudentIdAndClassID(
        { studentId, classId }
      );
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Single Student Payment History Retrieved is Successfully",
      data: result,
    });
  }
);
const updateStudentPaymentIntoDB = catchAsync(async (req, res) => {
  req.body.lastPaymentedDate = new Date();
  req.body.receivedBy = req.username.userId
  const paymentData: TStudentPaymentReqBody = req.body;

  const result =
    await StudentPaymentService.updateStudentPaymentIntoDB(paymentData);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Student Payment Created Successfully",
    data: result,
  });
});
const getDueOfStudent = catchAsync(async (req, res) => {
  const { studentId, classId } = req.params;

  const result = await StudentPaymentService.getDueOfStudent({
    studentId,
    classId,
  });
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Student due retrieved Successfully",
    data: result,
  });
});

const getNagaOfStudent = catchAsync(async (req, res) => {
  const { studentId } = req.params;

  const result = await StudentPaymentService.getNagaOfStudent({
    studentId,
  });
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Student due retrieved Successfully",
    data: result,
  });
});

export const StudentPaymentController = {
  createStudentPaymentIntoDB,
  getAllStudentPaymentIntoDB,
  getSingleStudentPaymentInfoByStudentIdAndClassID,
  getSingleStudentPaymentHistoryInfoByStudentIdAndClassID,
  updateStudentPaymentIntoDB,
  getDueOfStudent,
  getNagaOfStudent,
};
