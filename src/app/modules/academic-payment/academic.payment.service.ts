import httpStatus from "http-status";
import AppError from "../../errors/AppErrors";
import { TAcademicPayment } from "./academic.payment.interface";
import AcademicPaymentModel from "./academic.payment.model";

// ========>:  Create Academic Payment Function   :<=========
const createAcademicPaymentIntoDB = async (
  paymentPayload: TAcademicPayment
) => {
  // TODO: populate class id and then show error message this class name
  const paymentExist = await AcademicPaymentModel.findOne({
    class: paymentPayload.class,
    year: paymentPayload.year,
  });
  if (paymentExist) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      `Payment already exist on database for ${paymentPayload.class} in ${paymentPayload.year}`
    );
  }
  const stpayment = await AcademicPaymentModel.create(paymentPayload);
  return stpayment;
};

// ========>:   Get All Academic Payment Function   :<========
const getAllAcademicPaymentFromDB = async () => {
  const academicPayment = await AcademicPaymentModel.find({});
  return academicPayment;
};
// ========>:   Get Academic Payment By ClassId & Year Function   :<========
const getAcademicPaymentByClassIdAndYear = async ({
  classId,
}: {
  classId: string;
}) => {
  const academicPayment = await AcademicPaymentModel.findOne({
    class: classId,
  }).populate("class");
  return academicPayment;
};

export const StudentPaymentService = {
  createAcademicPaymentIntoDB,
  getAllAcademicPaymentFromDB,
  getAcademicPaymentByClassIdAndYear,
};
