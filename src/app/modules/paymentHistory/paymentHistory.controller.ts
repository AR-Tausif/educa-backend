import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { PaymentHistoryServices } from "./paymentHistory.services";

const getAllPaymentHistoryFromDB = catchAsync(async (req, res) => {
  const result = await PaymentHistoryServices.getAllPaymentHistoryFromDB();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "payment history retrieved is successfully",
    data: result,
  });
});

export const PaymentHistoryController = {
  getAllPaymentHistoryFromDB,
};
