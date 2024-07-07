import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { ReportServices } from "./report.service";

const yearlyPaymentReports = catchAsync(async (req, res) => {
  const result = await ReportServices.yearlyPaymentReports();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "year based received payment reports",
    data: result,
  });
});
const filterStudentGenderFromDB = catchAsync(async (req, res) => {
  const result = await ReportServices.filterStudentGenderFromDB();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "year based received payment reports",
    data: result,
  });
});

export const ReportControllers = {
  yearlyPaymentReports,
  filterStudentGenderFromDB,
};
