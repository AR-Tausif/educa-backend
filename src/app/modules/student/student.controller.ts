import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import { StudentServices } from "./student.service";
import sendResponse from "../../utils/sendResponse";
import AppError from "../../errors/AppErrors";

// ================================================
// Job Post db
// ================================================

const createStudent = catchAsync(async (req, res) => {
  // const files = req.files as Express.Multer.File[];

  // const fileData = files.map((file) => {
  //   return `http://localhost:5000/${file.path}`;
  // });
  // console.log(fileData);
  // const data = { ...req.body, images: fileData };

  req.body.createdBy = req.username.userId;

  const data = { ...req.body };

  const result = await StudentServices.createStudentIntoDB(data);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Student created successfully",
    data: {
      Post: result,
    },
  });
});

// ================================================
// All Post Get Function
// ================================================
const getAllStudent = catchAsync(async (req, res) => {
  const result = await StudentServices.getAllStudentFromDB();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "All Student Received Successfully",
    data: result,
  });
});

// ================================================
// Single Course Get By _id
// ================================================

const getSingleStudent = catchAsync(async (req, res) => {
  const studentId = req.params.studentId;
  const result = await StudentServices.getSingleStudentFromDB(studentId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Single Student Data retrieved successfully",
    data: result,
  });
});

// ================================================
// Students by classs Id
// ================================================
const getStudentsByClassIdFromDB = catchAsync(async (req, res) => {
  const { classId } = req.params;
  const result = await StudentServices.getStudentsByClassIdFromDB(classId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Student Data retrieved successfully by class id",
    data: result,
  });
});
// ================================================
// Get deleted all students
// ================================================
const getAllDeletedStudentsFromDB = catchAsync(async (req, res) => {
  const result = await StudentServices.getAllDeletedStudentsFromDB();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Deleted student data retrieved successfully",
    data: result,
  });
});

// ================================================
// Update single Course
// ================================================

const updateSingleStudent = catchAsync(async (req, res) => {
  const studentId = req.params.studentId;

  const updatedData = req.body;
  if (!studentId) {
    throw new AppError(httpStatus.NOT_FOUND, "Student id is required");
  }
  const result = await StudentServices.updateStudentDataInDB(
    studentId,
    updatedData
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Single Student Data updated successfully",
    data: result,
  });
});

// ================================================
// Delete user _id
// ================================================
const deleteSingleStudent = catchAsync(async (req, res) => {
  const studentId = req.params._id;

  if (!studentId) {
    throw new AppError(httpStatus.NOT_FOUND, `Student id not found`);
  }
  const result = await StudentServices.deleteStudentFromDB(studentId);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Single Student Data Deleted",
    data: result,
  });
});

export const StudentController = {
  createStudent,
  getAllStudent,
  getSingleStudent,
  getStudentsByClassIdFromDB,
  getAllDeletedStudentsFromDB,
  deleteSingleStudent,
  updateSingleStudent,
};
