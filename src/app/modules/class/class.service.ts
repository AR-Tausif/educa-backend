import httpStatus from "http-status";
import AppError from "../../errors/AppErrors";
import { TCreateClassPayload } from "./class.interface";
import ClassModel from "./class.model";
import AcademicPaymentModel from "../academic-payment/academic.payment.model";
import mongoose from "mongoose";
import toTitleCase from "../../helper/toTitleCase";

export type TErrorRes = {
  success?: boolean;
  errorMessage?: string;
  message?: string;
  errorDetails?: {
    statusCode: 400;
  };
  stack?: string;
};

// API: Get all class form database
const getAllClassFromDB = async () => {
  const educaClass = await ClassModel.find({});
  return educaClass;
};
// API: Get single class form database
const getSingleClassById = async (id: string) => {
  const educaClass = await ClassModel.findById(id);
  if (!educaClass) {
    throw new AppError(httpStatus.NOT_FOUND, "Class no found");
  }
  return educaClass;
};
// API: Create single class into database
const createClassIntoDB = async (classPayload: TCreateClassPayload) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();
    // transection-1
    const educaClass = await ClassModel.create(
      [
        {
          name: toTitleCase(classPayload.className),
          createdBy: classPayload.createdBy,
        },
      ],
      {
        session,
      }
    );
    if (!educaClass.length) {
      throw new AppError(httpStatus.BAD_REQUEST, "Failed to create class");
    }
    // transection -2
    const academicPayment = await AcademicPaymentModel.create(
      [
        {
          class: educaClass[0]._id,
          year: new Date().getFullYear(),
          createdBy: classPayload.createdBy,
          // fees
          yearlyMonthFees: classPayload.fees.yearlyMonthFees || 0,
          admissionFees: classPayload.fees.admissionFees || 0,
          reAdmissionFees: classPayload.fees.reAdmissionFees || 0,
          books: classPayload.fees.books || 0,
          stationeries: classPayload.fees.stationeries || 0,
          idCard: classPayload.fees.idCard || 0,
          tie: classPayload.fees.tie || 0,
          studyTour: classPayload.fees.studyTour || 0,
          examFees: classPayload.fees.examFees || 0,
          picnicFees: classPayload.fees.picnicFees || 0,
        },
      ],
      { session }
    );

    if (!academicPayment.length) {
      throw new AppError(httpStatus.BAD_REQUEST, "Failed to create class");
    }
    await session.commitTransaction();
    await session.endSession();
    return {
      educaClass: educaClass.length,
      academicPayment: academicPayment.length,
    };
  } catch (error) {
    const err = error as TErrorRes;
    await session.abortTransaction();
    await session.endSession();
    throw new AppError(
      httpStatus.BAD_REQUEST,
      err?.message || "Failed to create class"
    );
  }
};
// API: Update single class by id into database
const updateClassByIdIntoDB = async (classPayload: {
  classId: string;
  updatedContent: TCreateClassPayload;
}) => {
  const existClassById = await ClassModel.findByIdAndUpdate(
    classPayload.classId,
    { name: toTitleCase(classPayload.updatedContent.className) },
    { new: true }
  );

  if (!existClassById) {
    throw new AppError(httpStatus.NOT_FOUND, "This class is not valid");
  }

  return existClassById;
};

// API: Delete single class by id from database
const deleteSingleClassById = async (id: string) => {
  const deletedClass = await ClassModel.findByIdAndDelete(id);
  if (!deletedClass) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      "Class record not found on database"
    );
  }
  return deletedClass;
};
export const ClassService = {
  getAllClassFromDB,
  getSingleClassById,
  createClassIntoDB,
  updateClassByIdIntoDB,
  deleteSingleClassById,
};
