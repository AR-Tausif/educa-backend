import PaymentHistoryModel from "../paymentHistory/paymentHistory.model";
import StudentModel from "../student/student.model";
type TMonthlyRepor = {
  month: number;
  monthlyFees: number;
  others: number;
};
const yearlyPaymentReports = async () => {
  //   const reports = await PaymentHistoryModel.aggregate([
  //     {
  //       $project: {
  //         month: { $dateFromString: { dateString: "$date" } }, // Convert date field to date type
  //         yearlyMonthFees: 1,
  //         cashCollection: 1,
  //       },
  //     },
  // {
  //   $group: {
  //     _id: "$date",
  //     monthlyFees: { $sum: "$yearlyMonthFees" },
  //     others: {
  //       $sum: { $subtract: ["$cashCollection", "$yearlyMonthFees"] },
  //     },
  //   },
  // },
  //   ]);

  const reports = await PaymentHistoryModel.find({}).select([
    "date",
    "yearlyMonthFees",
    "cashCollection",
  ]);

  // Example: Filter and manipulate data programmatically
  const monthlyReports: TMonthlyRepor[] = [];

  reports.forEach((history) => {
    const date = new Date(history.date); // Convert date string to Date object if necessary
    const month = date.getMonth(); // Get month from Date object
    const monthlyFees = history.yearlyMonthFees;
    const cashCollection = history.cashCollection;

    // Example: Summarize data for each month
    const existingMonthReport = monthlyReports.find(
      (report) => report.month === month
    );
    if (existingMonthReport) {
      existingMonthReport.monthlyFees += monthlyFees;
      existingMonthReport.others += cashCollection - monthlyFees;
    } else {
      monthlyReports.push({
        month,
        monthlyFees,
        others: cashCollection - monthlyFees,
      });
    }
  });

  return monthlyReports;
};

const filterStudentGenderFromDB = async () => {
  const totalStudent = await StudentModel.countDocuments({ isDeleted: false });
  const filteredData = await StudentModel.aggregate([
    {
      $match: {
        isDeleted: false,
      },
    },
    {
      $group: {
        _id: "$gender",
        count: { $sum: 1 },
      },
    },
    {
      $project: {
        gender: "$_id",
        count: 1,
        percentage: {
          $multiply: [
            {
              $divide: ["$count", totalStudent],
            },
            100,
          ],
        },
      },
    },
  ]);

  return filteredData;
};

export const ReportServices = {
  yearlyPaymentReports,
  filterStudentGenderFromDB,
};

/**
 
# Payment Records Lists
    -student: ObjectId;
    -class: ObjectId;
    -receivedBy: ObjectId;
    -paymentedBy: string;
    -year: number;
    -lastPaymentedDate: Date;

  // Fees
    -yearlyMonthFees: TFieldType;
    -admissionFees: TFieldType;
    -reAdmissionFees: TFieldType;
    -books: TFieldType;
    -stationeries: TFieldType;
    -idCard: TFieldType;
    -tie: TFieldType;
    -studyTour: TFieldType;
    -examFees: TFieldType;
    -picnicFees: TFieldType;
    -others: TFieldType;
 */
