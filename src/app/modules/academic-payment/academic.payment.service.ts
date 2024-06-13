import httpStatus from "http-status";
import AppError from "../../errors/AppErrors";
import {
  TAcademicPayment,
  TAccademicUpdatePayload,
} from "./academic.payment.interface";
import AcademicPaymentModel from "./academic.payment.model";
import ClassModel from "../class/class.model";

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
// ========>:   Update Academic Payment By Id Function   :<========
const updateAcademicPaymentById = async (
  AccademicUpdatePayload: TAccademicUpdatePayload
) => {
  const academicPayment = await AcademicPaymentModel.findById(
    AccademicUpdatePayload._id
  );
  if (!academicPayment) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      `Payment does not exist on database`
    );
  }

  const academicPaymentClass = await ClassModel.findById(
    AccademicUpdatePayload.data.class
  );
  if (!academicPaymentClass) {
    throw new AppError(httpStatus.NOT_FOUND, `this does not exist on database`);
  }

  (academicPayment.year =
    AccademicUpdatePayload.data.year || academicPayment.year),
    // fees
    (academicPayment.yearlyMonthFees =
      AccademicUpdatePayload.data.yearlyMonthFees ||
      academicPayment.yearlyMonthFees),
    (academicPayment.admissionFees =
      AccademicUpdatePayload.data.admissionFees ||
      academicPayment.admissionFees),
    (academicPayment.reAdmissionFees =
      AccademicUpdatePayload.data.reAdmissionFees ||
      academicPayment.reAdmissionFees),
    (academicPayment.books =
      AccademicUpdatePayload.data.books || academicPayment.books),
    (academicPayment.stationeries =
      AccademicUpdatePayload.data.stationeries || academicPayment.stationeries),
    (academicPayment.idCard =
      AccademicUpdatePayload.data.idCard || academicPayment.idCard),
    (academicPayment.tie =
      AccademicUpdatePayload.data.tie || academicPayment.tie),
    (academicPayment.studyTour =
      AccademicUpdatePayload.data.studyTour || academicPayment.studyTour),
    (academicPayment.examFees =
      AccademicUpdatePayload.data.examFees || academicPayment.examFees),
    (academicPayment.picnicFees =
      AccademicUpdatePayload.data.picnicFees || academicPayment.picnicFees),
    academicPayment.save();

  return academicPayment;
};

export const StudentPaymentService = {
  createAcademicPaymentIntoDB,
  getAllAcademicPaymentFromDB,
  getAcademicPaymentByClassIdAndYear,
  updateAcademicPaymentById,
};
