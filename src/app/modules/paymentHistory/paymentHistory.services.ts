import httpStatus from "http-status";
import AppError from "../../errors/AppErrors";
import PaymentHistoryModel from "./paymentHistory.model";

const getAllPaymentHistoryFromDB = async () => {
  const payemntHistory = await PaymentHistoryModel.find({})
    .populate("class") // Populating the class data
    .populate({
      path: "student",
      select: "studentName", // Replace these with the actual field names you want
    })
    .populate("receivedBy");
  if (!payemntHistory) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      "Oppps, payment histories not found"
    );
  }

  return payemntHistory;
};

export const PaymentHistoryServices = {
  getAllPaymentHistoryFromDB,
};
