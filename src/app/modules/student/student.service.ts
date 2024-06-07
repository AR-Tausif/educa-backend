import httpStatus from "http-status";
import AppError from "../../errors/AppErrors";
import StudentPaymentModel from "../payment/payment.model";
import { TStudent } from "./student.interface";
import StudentModel from "./student.model";
import toTitleCase from "../../helper/toTitleCase";

// ================================================
// Craete Student Function
// ================================================

const createStudentIntoDB = async (student: TStudent) => {
  const existStudent = await StudentModel.findOne({
    studentName: student.studentName,
    class: student.class,
    fatherName: student.fatherName,
    motherName: student.motherName,
    dateOfBirth: student.dateOfBirth,
    isDeleted: false,
  });

  if (existStudent) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      `${existStudent.studentName ? existStudent.studentName : "This student"} already exist on database`
    );
  }

  const result = await StudentModel.create(student);

  const payment = await StudentPaymentModel.create({
    student: result.id,
    class: result.class,
    receivedBy: result.createdBy,
    yearlyMonthFees: { amount: 0, date: "" },
    admissionFees: { amount: 0, date: "" },
    reAdmissionFees: { amount: 0, date: "" },
    books: { amount: 0, date: "" },
    stationeries: { amount: 0, date: "" },
    idCard: { amount: 0, date: "" },
    tie: { amount: 0, date: "" },
    studyTour: { amount: 0, date: "" },
    examFees: { amount: 0, date: "" },
    picnicFees: { amount: 0, date: "" },
  });
  return { result, payment };
};

// ================================================
// All Post Get Function
// ================================================

const getAllStudentFromDB = async () => {
  const result = await StudentModel.find(
    { isDeleted: false },
    {
      _id: 1,
      studentName: 1,
      class: 1,
      dateOfBirth: 1,
      classRoll: 1,
      fatherName: 1,
      motherName: 1,
      gender: 1,
    }
  ).populate("class");
  return result;
};

// ================================================
// Single Course Get By _id
// ================================================

const getSingleStudentFromDB = async (studentId: string) => {
  const result = await StudentModel.findOne({
    _id: studentId,
  }).populate("class");
  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, "Student not found");
  }
  if (result.isDeleted) {
    throw new AppError(httpStatus.NOT_FOUND, "Student deleted");
  }
  return result;
};

// ================================================
// Student data by classId
// ================================================

const getStudentsByClassIdFromDB = async (classId: string) => {
  const result = await StudentModel.find({
    class: classId,
    isDeleted: false,
  }).populate("class");
  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, "Student not found by this class");
  }
  return result;
};
// ================================================
// Get all deleted student
// ================================================

const getAllDeletedStudentsFromDB = async () => {
  const result = await StudentModel.find({
    isDeleted: true,
  }).populate("class");
  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, "Cannot deleted yet student");
  }
  return result;
};

// ================================================
// Delete Post By _id
// ================================================

const deleteStudentFromDB = async (studentId: string) => {
  const result = await StudentModel.findOneAndUpdate(
    {
      _id: studentId,
      isDeleted: false,
    },
    { isDeleted: true },
    { new: true }
  );
  return result;
};

// =======================================
// update User Data In DB
// =======================================
// level?: 'Beginner' | 'Intermediate' | 'Advanced';

const updateStudentDataInDB = async (_id: string, updatedData: TStudent) => {
  const student = await StudentModel.findOne({ _id });
  if (!student) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }
  if (student.isDeleted) {
    throw new AppError(httpStatus.NOT_FOUND, "Student deleted");
  }
  const data = {
    classRoll: updatedData.classRoll || student.classRoll,
    studentName: toTitleCase(updatedData.studentName) || student.studentName,
    dateOfBirth: updatedData.dateOfBirth || student.dateOfBirth,
    gender: updatedData.gender || student.gender,
    class: updatedData.class || student.class,
    createdBy: updatedData.createdBy || student.createdBy,
    religion: updatedData.religion || student.religion,
    placeOfBirth: updatedData.placeOfBirth || student.placeOfBirth,
    nationality: updatedData.nationality || student.nationality,
    firstLanguage: updatedData.firstLanguage || student.firstLanguage,
    presentAddress: updatedData.presentAddress || student.presentAddress,
    permanentAddress: updatedData.permanentAddress || student.permanentAddress,
    fatherName: toTitleCase(updatedData.fatherName) || student.fatherName,
    fatherEmail: updatedData.fatherEmail || student.fatherEmail,
    fatherPhonNumber: updatedData.fatherPhonNumber || student.fatherPhonNumber,
    fatherIDCardNumber:
      updatedData.fatherIDCardNumber || student.fatherIDCardNumber,
    fatherProfession: updatedData.fatherProfession || student.fatherProfession,
    fatherPesignation:
      updatedData.fatherPesignation || student.fatherPesignation,
    motherName: toTitleCase(updatedData.motherName) || student.motherName,
    motherEmail: updatedData.motherEmail || student.motherEmail,
    motherPhonNumber: updatedData.motherPhonNumber || student.motherPhonNumber,
    motherIDCardNumber:
      updatedData.motherIDCardNumber || student.motherIDCardNumber,
    motherProfession: updatedData.motherProfession || student.motherProfession,
    motherPesignation:
      updatedData.motherPesignation || student.motherPesignation,
  };
  const result = await StudentModel.findOneAndUpdate({ _id }, data, {
    new: true,
  });
  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, `User not found`);
  }
  return result;
};

export const StudentServices = {
  createStudentIntoDB,
  getAllStudentFromDB,
  getSingleStudentFromDB,
  getStudentsByClassIdFromDB,
  getAllDeletedStudentsFromDB,
  deleteStudentFromDB,
  updateStudentDataInDB,
};
