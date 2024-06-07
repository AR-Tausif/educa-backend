import httpStatus from "http-status";
import AppError from "../../errors/AppErrors";
import StudentModel from "../student/student.model";
import { TStudentPaymentReqBody } from "./payment.interface";
import StudentPaymentModel from "./payment.model";
import mongoose from "mongoose";
import ClassModel from "../class/class.model";
import PaymentHistoryModel from "../paymentHistory/paymentHistory.model";
import AcademicPaymentModel from "../academic-payment/academic.payment.model";

const ObjectId = mongoose.Types.ObjectId;

const createStudentPaymentIntoDB = async (
  paymentPayload: TStudentPaymentReqBody
) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  // let payResult;
  // const dataResult: string[] = [];

  // const fees = Object.keys(paymentPayload.fees);

  // fees.forEach(async (fee) => {
  //   payResult = await StudentPaymentModel.create({
  //     student: paymentPayload.student,
  //     class: paymentPayload.class,
  //     receivedBy: paymentPayload.receivedBy,
  //     paymentedBy: paymentPayload.paymentedBy,
  //     year: paymentPayload.year
  //       ? paymentPayload.year
  //       : new Date().getFullYear(),
  //     [fee]: paymentPayload.fees[fee],
  //     paymentedDate: paymentPayload.date,
  //   });
  //   dataResult.push(fee);
  // });

  const result = await StudentPaymentModel.create({
    class: paymentPayload.class,
    year: paymentPayload.year,
  });

  return result;
};

const getAllStudentPaymentIntoDB = async () => {
  const result = await StudentPaymentModel.find().populate("class");

  return result;
};
const getSingleStudentPaymentInfoByStudentIdAndClassID = async (payload: {
  studentId: string;
  classId: string;
}) => {
  const result = await StudentPaymentModel.findOne({
    student: payload.studentId,
    class: payload.classId,
  }).populate("class");

  return result;
};

// TODO: using payment history in payment service file. I need to cut this code on paymentHistory module.
const getSingleStudentPaymentHistoryInfoByStudentIdAndClassID =
  async (payload: { studentId: string; classId: string }) => {
    const existStudent = await StudentModel.findById(payload.studentId);
    const existClass = await ClassModel.findById(payload.classId);

    if (!existClass) {
      throw new AppError(httpStatus.NOT_FOUND, "Oppps, class not found");
    }
    if (!existStudent) {
      throw new AppError(httpStatus.NOT_FOUND, "Oppps, student not found");
    }
    if (existStudent.isDeleted) {
      throw new AppError(httpStatus.NOT_FOUND, "Oppps, student deleted");
    }
    const studentPaymentHistory = await PaymentHistoryModel.find({
      student: existStudent._id,
      class: existClass._id,
    }).populate("receivedBy");

    if (!studentPaymentHistory) {
      throw new AppError(
        httpStatus.NOT_FOUND,
        "Oppps, student payment history not found"
      );
    }

    return studentPaymentHistory;
  };

const updateStudentPaymentIntoDB = async (
  paymentPayload: TStudentPaymentReqBody
) => {
  const {
    yearlyMonthFees,
    admissionFees,
    reAdmissionFees,
    books,
    stationeries,
    idCard,
    tie,
    studyTour,
    examFees,
    picnicFees,
  } = paymentPayload.fees;

  const existStudent = await StudentModel.findById(paymentPayload.student);

  if (!existStudent) {
    throw new AppError(httpStatus.NOT_FOUND, "Student not found");
  }
  if (existStudent.isDeleted) {
    throw new AppError(httpStatus.NOT_FOUND, "Student already deleted");
  }

  const paymentDetails = await StudentPaymentModel.findOne({
    student: paymentPayload.student,
    class: paymentPayload.class,
  });

  if (!paymentDetails) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      "Payment details not found for the student and class"
    );
  }

  paymentDetails.lastPaymentedDate = paymentPayload.lastPaymentedDate;
  // paymentDetails.yearlyMonthFees.push({
  //   amount: yearlyMonthFees || 0,
  //   date: paymentPayload.lastPaymentedDate,
  //   due: 0,
  // });
  paymentDetails.yearlyMonthFees.amount += yearlyMonthFees || 0;
  paymentDetails.admissionFees.amount += admissionFees || 0;
  paymentDetails.reAdmissionFees.amount += reAdmissionFees || 0;
  paymentDetails.books.amount += books || 0;
  paymentDetails.stationeries.amount += stationeries || 0;
  paymentDetails.idCard.amount += idCard || 0;
  paymentDetails.tie.amount += tie || 0;
  paymentDetails.studyTour.amount += studyTour || 0;
  paymentDetails.examFees.amount += examFees || 0;
  paymentDetails.picnicFees.amount += picnicFees || 0;
  paymentDetails.save();

  await PaymentHistoryModel.create({
    ...paymentPayload.fees,
    date: paymentPayload.lastPaymentedDate,
    discountOnFees: paymentPayload.discountOnFees,
    cashCollection: paymentPayload.cashCollection,
    student: paymentDetails.student,
    class: paymentDetails.class,
    studentPayment: paymentDetails._id,
    receivedBy: paymentPayload.receivedBy,
  });
  // paymentDetails.paymentHistory.push({
  //   ...paymentPayload.fees,
  //   date: paymentPayload.lastPaymentedDate,
  //   discountOnFees: paymentPayload.discountOnFees,
  //   cashCollection: paymentPayload.cashCollection,
  // });

  return paymentDetails;
};

const getDueOfStudent = async (getDuePayload: {
  studentId: string;
  classId: string;
}) => {
  const result = await StudentPaymentModel.aggregate([
    // pipeline -01
    {
      $match: {
        student: new ObjectId(getDuePayload.studentId), // Student ID
        class: new ObjectId(getDuePayload.classId), // Class ID
      },
    },
    // pipeline -02
    {
      $lookup: {
        from: "academicpayments",
        localField: "class",
        foreignField: "class",
        as: "academicPayment",
      },
    },
    // pipeline -03
    {
      $unwind: "$academicPayment",
    },
    // pipeline -04
    {
      $project: {
        dueFees: {
          monthlyFees: {
            $max: [
              {
                $subtract: [
                  "$academicPayment.yearlyMonthFees",
                  "$yearlyMonthFees.amount",
                ],
              },
              0,
            ],
          },
          admissionFees: {
            $max: [
              {
                $subtract: [
                  "$academicPayment.admissionFees",
                  "$admissionFees.amount",
                ],
              },
              0,
            ],
          },
          reAdmissionFees: {
            $max: [
              {
                $subtract: [
                  "$academicPayment.reAdmissionFees",
                  "$reAdmissionFees.amount",
                ],
              },
              0,
            ],
          },
          books: {
            $max: [
              { $subtract: ["$academicPayment.books", "$books.amount"] },
              0,
            ],
          },
          stationeries: {
            $max: [
              {
                $subtract: [
                  "$academicPayment.stationeries",
                  "$stationeries.amount",
                ],
              },
              0,
            ],
          },
          idCard: {
            $max: [
              { $subtract: ["$academicPayment.idCard", "$idCard.amount"] },
              0,
            ],
          },
          tie: {
            $max: [{ $subtract: ["$academicPayment.tie", "$tie.amount"] }, 0],
          },
          studyTour: {
            $max: [
              {
                $subtract: ["$academicPayment.studyTour", "$studyTour.amount"],
              },
              0,
            ],
          },
          examFees: {
            $max: [
              { $subtract: ["$academicPayment.examFees", "$examFees.amount"] },
              0,
            ],
          },
          picnicFees: {
            $max: [
              {
                $subtract: [
                  "$academicPayment.picnicFees",
                  "$picnicFees.amount",
                ],
              },
              0,
            ],
          },
        },
        extraFees: {
          monthlyFees: {
            $cond: [
              {
                $lt: [
                  {
                    $subtract: [
                      "$academicPayment.yearlyMonthFees",
                      "$yearlyMonthFees.amount",
                    ],
                  },
                  0,
                ],
              },
              {
                $abs: {
                  $subtract: [
                    "$academicPayment.yearlyMonthFees",
                    "$yearlyMonthFees.amount",
                  ],
                },
              },
              0,
            ],
          },
          admissionFees: {
            $cond: [
              {
                $lt: [
                  {
                    $subtract: [
                      "$academicPayment.admissionFees",
                      "$admissionFees.amount",
                    ],
                  },
                  0,
                ],
              },
              {
                $abs: {
                  $subtract: [
                    "$academicPayment.admissionFees",
                    "$admissionFees.amount",
                  ],
                },
              },
              0,
            ],
          },
          reAdmissionFees: {
            $cond: [
              {
                $lt: [
                  {
                    $subtract: [
                      "$academicPayment.reAdmissionFees",
                      "$reAdmissionFees.amount",
                    ],
                  },
                  0,
                ],
              },
              {
                $abs: {
                  $subtract: [
                    "$academicPayment.reAdmissionFees",
                    "$reAdmissionFees.amount",
                  ],
                },
              },
              0,
            ],
          },
          books: {
            $cond: [
              {
                $lt: [
                  { $subtract: ["$academicPayment.books", "$books.amount"] },
                  0,
                ],
              },
              {
                $abs: {
                  $subtract: ["$academicPayment.books", "$books.amount"],
                },
              },
              0,
            ],
          },
          stationeries: {
            $cond: [
              {
                $lt: [
                  {
                    $subtract: [
                      "$academicPayment.stationeries",
                      "$stationeries.amount",
                    ],
                  },
                  0,
                ],
              },
              {
                $abs: {
                  $subtract: [
                    "$academicPayment.stationeries",
                    "$stationeries.amount",
                  ],
                },
              },
              0,
            ],
          },
          idCard: {
            $cond: [
              {
                $lt: [
                  { $subtract: ["$academicPayment.idCard", "$idCard.amount"] },
                  0,
                ],
              },
              {
                $abs: {
                  $subtract: ["$academicPayment.idCard", "$idCard.amount"],
                },
              },
              0,
            ],
          },
          tie: {
            $cond: [
              {
                $lt: [
                  { $subtract: ["$academicPayment.tie", "$tie.amount"] },
                  0,
                ],
              },
              { $abs: { $subtract: ["$academicPayment.tie", "$tie.amount"] } },
              0,
            ],
          },
          studyTour: {
            $cond: [
              {
                $lt: [
                  {
                    $subtract: [
                      "$academicPayment.studyTour",
                      "$studyTour.amount",
                    ],
                  },
                  0,
                ],
              },
              {
                $abs: {
                  $subtract: [
                    "$academicPayment.studyTour",
                    "$studyTour.amount",
                  ],
                },
              },
              0,
            ],
          },
          examFees: {
            $cond: [
              {
                $lt: [
                  {
                    $subtract: [
                      "$academicPayment.examFees",
                      "$examFees.amount",
                    ],
                  },
                  0,
                ],
              },
              {
                $abs: {
                  $subtract: ["$academicPayment.examFees", "$examFees.amount"],
                },
              },
              0,
            ],
          },
          picnicFees: {
            $cond: [
              {
                $lt: [
                  {
                    $subtract: [
                      "$academicPayment.picnicFees",
                      "$picnicFees.amount",
                    ],
                  },
                  0,
                ],
              },
              {
                $abs: {
                  $subtract: [
                    "$academicPayment.picnicFees",
                    "$picnicFees.amount",
                  ],
                },
              },
              0,
            ],
          },
        },
      },
    },
    // pipeline -05
    {
      $addFields: {
        totalDue: {
          $add: [
            "$dueFees.monthlyFees",
            "$dueFees.admissionFees",
            "$dueFees.reAdmissionFees",
            "$dueFees.books",
            "$dueFees.stationeries",
            "$dueFees.idCard",
            "$dueFees.tie",
            "$dueFees.studyTour",
            "$dueFees.examFees",
            "$dueFees.picnicFees",
          ],
        },
        totalExtraFees: {
          $add: [
            "$extraFees.monthlyFees",
            "$extraFees.admissionFees",
            "$extraFees.reAdmissionFees",
            "$extraFees.books",
            "$extraFees.stationeries",
            "$extraFees.idCard",
            "$extraFees.tie",
            "$extraFees.studyTour",
            "$extraFees.examFees",
            "$extraFees.picnicFees",
          ],
        },
      },
    },
  ]);

  // const academicPayment = await AcademicPaymentModel.findOne({
  //   class: getDuePayload.classId,
  // });

  // const studentPayment = await StudentPaymentModel.findOne(
  //   {
  //     student: getDuePayload.studentId,
  //     class: getDuePayload.classId,
  //   },
  //   {
  //     _id: 1,
  //     yearlyMonthFees: 1,
  //     admissionFees: 1,
  //     reAdmissionFees: 1,
  //     books: 1,
  //     stationeries: 1,
  //     idCard: 1,
  //     tie: 1,
  //     studyTour: 1,
  //     examFees: 1,
  //     picnicFees: 1,
  //   }
  // );

  // // Calculate due amount
  // console.log("sss", studentPayment, academicPayment);
  // const dueAmounts = calculateDueAmount(studentPayment, academicPayment);
  const dueResponse = result[0];

  return dueResponse;
};

const getNagaOfStudent = async (getDuePayload: { studentId: string }) => {
  console.log("succed");
  const student = await StudentModel.findById(getDuePayload.studentId);
  if (!student) {
    throw new AppError(httpStatus.NOT_FOUND, "student not found");
  }
  if (student.isDeleted) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      "student deleted. please try another student"
    );
  }
  const studentClass = await ClassModel.findById(student?.class._id);

  if (!studentClass) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      "class not found. try with another or create new"
    );
  }
  if (studentClass.isDeleted) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      `class of ${studentClass.name} deleted`
    );
  }
  const academicPayment = await AcademicPaymentModel.findOne({
    class: studentClass._id,
  });
  console.log(academicPayment);

  if (!academicPayment) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      `academic student is not availabe for this  class`
    );
  }
  console.log("hola");

  const result = await StudentPaymentModel.aggregate([
    // pipeline -01
    {
      $match: {
        student: new ObjectId(student._id), // Student ID
        class: new ObjectId(studentClass._id), // Class ID
      },
    },
    // pipeline -02
    {
      $lookup: {
        from: "academicpayments",
        localField: "class",
        foreignField: "class",
        as: "academicPayment",
      },
    },
    // pipeline -03
    {
      $unwind: "$academicPayment",
    },
    // pipeline -04
    {
      $project: {
        dueFees: {
          monthlyFees: {
            $max: [
              {
                $subtract: [
                  "$academicPayment.yearlyMonthFees",
                  "$yearlyMonthFees.amount",
                ],
              },
              0,
            ],
          },
          admissionFees: {
            $max: [
              {
                $subtract: [
                  "$academicPayment.admissionFees",
                  "$admissionFees.amount",
                ],
              },
              0,
            ],
          },
          reAdmissionFees: {
            $max: [
              {
                $subtract: [
                  "$academicPayment.reAdmissionFees",
                  "$reAdmissionFees.amount",
                ],
              },
              0,
            ],
          },
          books: {
            $max: [
              { $subtract: ["$academicPayment.books", "$books.amount"] },
              0,
            ],
          },
          stationeries: {
            $max: [
              {
                $subtract: [
                  "$academicPayment.stationeries",
                  "$stationeries.amount",
                ],
              },
              0,
            ],
          },
          idCard: {
            $max: [
              { $subtract: ["$academicPayment.idCard", "$idCard.amount"] },
              0,
            ],
          },
          tie: {
            $max: [{ $subtract: ["$academicPayment.tie", "$tie.amount"] }, 0],
          },
          studyTour: {
            $max: [
              {
                $subtract: ["$academicPayment.studyTour", "$studyTour.amount"],
              },
              0,
            ],
          },
          examFees: {
            $max: [
              { $subtract: ["$academicPayment.examFees", "$examFees.amount"] },
              0,
            ],
          },
          picnicFees: {
            $max: [
              {
                $subtract: [
                  "$academicPayment.picnicFees",
                  "$picnicFees.amount",
                ],
              },
              0,
            ],
          },
        },
        extraFees: {
          monthlyFees: {
            $cond: [
              {
                $lt: [
                  {
                    $subtract: [
                      "$academicPayment.yearlyMonthFees",
                      "$yearlyMonthFees.amount",
                    ],
                  },
                  0,
                ],
              },
              {
                $abs: {
                  $subtract: [
                    "$academicPayment.yearlyMonthFees",
                    "$yearlyMonthFees.amount",
                  ],
                },
              },
              0,
            ],
          },
          admissionFees: {
            $cond: [
              {
                $lt: [
                  {
                    $subtract: [
                      "$academicPayment.admissionFees",
                      "$admissionFees.amount",
                    ],
                  },
                  0,
                ],
              },
              {
                $abs: {
                  $subtract: [
                    "$academicPayment.admissionFees",
                    "$admissionFees.amount",
                  ],
                },
              },
              0,
            ],
          },
          reAdmissionFees: {
            $cond: [
              {
                $lt: [
                  {
                    $subtract: [
                      "$academicPayment.reAdmissionFees",
                      "$reAdmissionFees.amount",
                    ],
                  },
                  0,
                ],
              },
              {
                $abs: {
                  $subtract: [
                    "$academicPayment.reAdmissionFees",
                    "$reAdmissionFees.amount",
                  ],
                },
              },
              0,
            ],
          },
          books: {
            $cond: [
              {
                $lt: [
                  { $subtract: ["$academicPayment.books", "$books.amount"] },
                  0,
                ],
              },
              {
                $abs: {
                  $subtract: ["$academicPayment.books", "$books.amount"],
                },
              },
              0,
            ],
          },
          stationeries: {
            $cond: [
              {
                $lt: [
                  {
                    $subtract: [
                      "$academicPayment.stationeries",
                      "$stationeries.amount",
                    ],
                  },
                  0,
                ],
              },
              {
                $abs: {
                  $subtract: [
                    "$academicPayment.stationeries",
                    "$stationeries.amount",
                  ],
                },
              },
              0,
            ],
          },
          idCard: {
            $cond: [
              {
                $lt: [
                  { $subtract: ["$academicPayment.idCard", "$idCard.amount"] },
                  0,
                ],
              },
              {
                $abs: {
                  $subtract: ["$academicPayment.idCard", "$idCard.amount"],
                },
              },
              0,
            ],
          },
          tie: {
            $cond: [
              {
                $lt: [
                  { $subtract: ["$academicPayment.tie", "$tie.amount"] },
                  0,
                ],
              },
              { $abs: { $subtract: ["$academicPayment.tie", "$tie.amount"] } },
              0,
            ],
          },
          studyTour: {
            $cond: [
              {
                $lt: [
                  {
                    $subtract: [
                      "$academicPayment.studyTour",
                      "$studyTour.amount",
                    ],
                  },
                  0,
                ],
              },
              {
                $abs: {
                  $subtract: [
                    "$academicPayment.studyTour",
                    "$studyTour.amount",
                  ],
                },
              },
              0,
            ],
          },
          examFees: {
            $cond: [
              {
                $lt: [
                  {
                    $subtract: [
                      "$academicPayment.examFees",
                      "$examFees.amount",
                    ],
                  },
                  0,
                ],
              },
              {
                $abs: {
                  $subtract: ["$academicPayment.examFees", "$examFees.amount"],
                },
              },
              0,
            ],
          },
          picnicFees: {
            $cond: [
              {
                $lt: [
                  {
                    $subtract: [
                      "$academicPayment.picnicFees",
                      "$picnicFees.amount",
                    ],
                  },
                  0,
                ],
              },
              {
                $abs: {
                  $subtract: [
                    "$academicPayment.picnicFees",
                    "$picnicFees.amount",
                  ],
                },
              },
              0,
            ],
          },
        },
      },
    },
    // pipeline -05
    {
      $addFields: {
        totalDue: {
          $add: [
            "$dueFees.monthlyFees",
            "$dueFees.admissionFees",
            "$dueFees.reAdmissionFees",
            "$dueFees.books",
            "$dueFees.stationeries",
            "$dueFees.idCard",
            "$dueFees.tie",
            "$dueFees.studyTour",
            "$dueFees.examFees",
            "$dueFees.picnicFees",
          ],
        },
        totalExtraFees: {
          $add: [
            "$extraFees.monthlyFees",
            "$extraFees.admissionFees",
            "$extraFees.reAdmissionFees",
            "$extraFees.books",
            "$extraFees.stationeries",
            "$extraFees.idCard",
            "$extraFees.tie",
            "$extraFees.studyTour",
            "$extraFees.examFees",
            "$extraFees.picnicFees",
          ],
        },
      },
    },
  ]);

  // const academicPayment = await AcademicPaymentModel.findOne({
  //   class: getDuePayload.classId,
  // });

  // const studentPayment = await StudentPaymentModel.findOne(
  //   {
  //     student: getDuePayload.studentId,
  //     class: getDuePayload.classId,
  //   },
  //   {
  //     _id: 1,
  //     yearlyMonthFees: 1,
  //     admissionFees: 1,
  //     reAdmissionFees: 1,
  //     books: 1,
  //     stationeries: 1,
  //     idCard: 1,
  //     tie: 1,
  //     studyTour: 1,
  //     examFees: 1,
  //     picnicFees: 1,
  //   }
  // );

  // // Calculate due amount
  // console.log("sss", studentPayment, academicPayment);
  // const dueAmounts = calculateDueAmount(studentPayment, academicPayment);
  const dueResponse = result[0];

  return dueResponse;
};
export const StudentPaymentService = {
  createStudentPaymentIntoDB,
  getAllStudentPaymentIntoDB,
  getSingleStudentPaymentInfoByStudentIdAndClassID,
  getSingleStudentPaymentHistoryInfoByStudentIdAndClassID,
  updateStudentPaymentIntoDB,
  getDueOfStudent,
  getNagaOfStudent,
};
