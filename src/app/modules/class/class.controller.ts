import httpStatus from "http-status";
import sendResponse from "../../utils/sendResponse";
import catchAsync from "../../utils/catchAsync";
import { ClassService } from "./class.service";
import { TCreateClassPayload } from "./class.interface";

// API: Gel all class from database
const getAllClassFromDB = catchAsync(async (req, res) => {
  const result = await ClassService.getAllClassFromDB();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Available Classes Retrieved Successfully",
    data: result,
  });
});

// API: Get single class by id into database
const getSingleClassById = catchAsync(async (req, res) => {
  const result = await ClassService.getSingleClassById(
    req.params.classId as string
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Class is Retrieved Successfully",
    data: result,
  });
});

// API: Create single class by id into database
const createClassIntoDB = catchAsync(async (req, res) => {
  req.body.createdBy = req.username.userId;
  const result = await ClassService.createClassIntoDB(req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Class Created Successfully",
    data: result,
  });
});

// API: Update single class by id into database
const updateClassByIdIntoDB = catchAsync(async (req, res) => {
  const classId = req.params.classId as string;
  const updatedContent = req.body as TCreateClassPayload;

  const result = await ClassService.updateClassByIdIntoDB({
    classId,
    updatedContent,
  });

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Class Updated Successfully",
    data: result,
  });
});

// API: Delete single class by id from database
const deleteSingleClassById = catchAsync(async (req, res) => {
  const result = await ClassService.deleteSingleClassById(
    req.params.classId as string
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Class Deleted Successfully",
    data: result,
  });
});

export const ClassController = {
  getAllClassFromDB,
  getSingleClassById,
  createClassIntoDB,
  updateClassByIdIntoDB,
  deleteSingleClassById,
};
