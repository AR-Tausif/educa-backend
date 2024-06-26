import httpStatus from "http-status";
import UserModel from "./user.model";
import AppError from "../../errors/AppErrors";
import { USER_ROLE } from "../auth/auth.constant";
import StudentModel from "../student/student.model";
import ClassModel from "../class/class.model";
import StudentPaymentModel from "../payment/payment.model";
import PaymentHistoryModel from "../paymentHistory/paymentHistory.model";
import AcademicPaymentModel from "../academic-payment/academic.payment.model";

const getAllUserFromDB = async () => {
  const result = await UserModel.find({ isDeleted: false }).sort({
    createdAt: -1,
  });
  return result;
};

const editUserInfo = async (
  userId: string,
  userInfo: { name: string; email: string }
) => {
  const user = await UserModel.findById(userId);
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "user not found on database");
  }

  user.fullName = userInfo.name || user.fullName;
  user.email = userInfo.email || user.email;
  user.save();

  return { name: user.fullName, email: user.email };
};

const makeAdminById = async (userId: string) => {
  const result = await UserModel.findById(userId);
  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }
  if (result.isDeleted) {
    throw new AppError(httpStatus.NOT_FOUND, "User deleted");
  }
  if (result.role === "superAdmin") {
    throw new AppError(
      httpStatus.NOT_FOUND,
      "Sorry, you cannot delete website author"
    );
  }
  if (!(result.status === "active")) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      "You cannot change role when user blocked or deactivated"
    );
  }
  const new_data = await UserModel.updateOne(
    { _id: userId },
    {
      $set: {
        role: USER_ROLE.admin,
      },
    }
  );
  return new_data;
};
// ================================================
// Make user by userId
// ================================================
const makeUserById = async (userId: string) => {
  const result = await UserModel.findById(userId);
  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }
  if (result.isDeleted) {
    throw new AppError(httpStatus.NOT_FOUND, "User deleted");
  }
  if (result.role === "superAdmin") {
    throw new AppError(
      httpStatus.NOT_FOUND,
      "Sorry, you cannot delete website author"
    );
  }
  if (result.role === "user") {
    throw new AppError(
      httpStatus.NOT_FOUND,
      "This user role already on user role"
    );
  }
  if (!(result.status === "active")) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      "You cannot change role when user blocked or deactivated"
    );
  }
  const new_data = await UserModel.updateOne(
    { _id: result._id },
    {
      $set: {
        role: USER_ROLE.user,
      },
    }
  );
  return new_data;
};
const blockingUserById = async (userId: string) => {
  const result = await UserModel.findById(userId);
  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }
  if (result.isDeleted) {
    throw new AppError(httpStatus.NOT_FOUND, "User deleted");
  }
  if (!(result.role == "user")) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      "You can just block a user not admin or super-admin"
    );
  }
  const new_data = await UserModel.updateOne(
    { _id: result._id },
    {
      $set: {
        status: "block",
      },
    }
  );
  return new_data;
};
const activatingUserById = async (userId: string) => {
  const result = await UserModel.findById(userId);
  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }
  if (result.isDeleted) {
    throw new AppError(httpStatus.NOT_FOUND, "User deleted");
  }
  if (!(result.role == "user")) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      "You can just activate a user not admin or super-admin"
    );
  }
  const new_data = await UserModel.updateOne(
    { _id: result._id },
    {
      $set: {
        status: "active",
      },
    }
  );
  return new_data;
};
const deletingUserById = async (userId: string) => {
  const user = await UserModel.findById(userId);
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }
  if (user.isDeleted) {
    throw new AppError(httpStatus.NOT_FOUND, "User deleted");
  }
  if (!(user.status === "active")) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      "You can't delete this blocked or de-active user"
    );
  }
  if (user.role === "superAdmin") {
    throw new AppError(
      httpStatus.NOT_FOUND,
      "Sorry, you cannot delete website author"
    );
  }
  const new_data = await UserModel.updateOne(
    { _id: user._id },
    {
      $set: {
        isDeleted: true,
      },
    }
  );
  return new_data;
};

const countingDocument = async () => {
  const [
    allStudents,
    students,
    classes,
    studentPayment,
    paymentHistory,
    totalCollection,
  ] = await Promise.all([
    StudentModel.countDocuments(),
    StudentModel.find({ isDeleted: false }).countDocuments(),
    ClassModel.countDocuments(),
    StudentPaymentModel.countDocuments(),
    PaymentHistoryModel.countDocuments(),
    // Here do the sum for getting all cashCollection amount.
    PaymentHistoryModel.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: "$cashCollection" },
        },
      },
    ]),
  ]);

  const feesSummary = await AcademicPaymentModel.aggregate([
    {
      $lookup: {
        from: "students",
        localField: "class",
        foreignField: "class",
        as: "students",
      },
    },
    {
      $unwind: {
        path: "$students",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $group: {
        _id: "$class",
        studentCount: { $sum: 1 },
        totalAdmissionFees: { $sum: { $ifNull: ["$admissionFees", 0] } },
        totalReAdmissionFees: { $sum: { $ifNull: ["$reAdmissionFees", 0] } },
        totalBooks: { $sum: { $ifNull: ["$books", 0] } },
        totalExamFees: { $sum: { $ifNull: ["$examFees", 0] } },
        totalIdCard: { $sum: { $ifNull: ["$idCard", 0] } },
        totalYearlyMonthFees: { $sum: { $ifNull: ["$yearlyMonthFees", 0] } },
        totalPicnicFees: { $sum: { $ifNull: ["$picnicFees", 0] } },
        totalStationeries: { $sum: { $ifNull: ["$stationeries", 0] } },
        totalStudyTour: { $sum: { $ifNull: ["$studyTour", 0] } },
        totalTie: { $sum: { $ifNull: ["$tie", 0] } },
        totalFees: {
          $sum: {
            $add: [
              { $ifNull: ["$admissionFees", 0] },
              { $ifNull: ["$reAdmissionFees", 0] },
              { $ifNull: ["$books", 0] },
              { $ifNull: ["$examFees", 0] },
              { $ifNull: ["$idCard", 0] },
              { $ifNull: ["$yearlyMonthFees", 0] },
              { $ifNull: ["$picnicFees", 0] },
              { $ifNull: ["$stationeries", 0] },
              { $ifNull: ["$studyTour", 0] },
              { $ifNull: ["$tie", 0] },
            ],
          },
        },
      },
    },
    {
      $group: {
        _id: null,
        allTotalFees: { $sum: "$totalFees" },
      },
    },
  ]);

  return {
    allStudents,
    students,
    classes,
    studentPayment,
    paymentHistory,
    totalCollection: totalCollection.length > 0 ? totalCollection[0].total : 0,
    remaining: feesSummary.length > 0 ? feesSummary[0] : { allTotalFees: 0 },
  };
};

export const UserServices = {
  getAllUserFromDB,
  editUserInfo,
  makeAdminById,
  makeUserById,
  blockingUserById,
  activatingUserById,
  deletingUserById,
  countingDocument,
};
