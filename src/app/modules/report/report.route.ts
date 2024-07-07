import { Router } from "express";
import { ReportControllers } from "./report.controller";

const router = Router();

router.get("/yearly-payment-report", ReportControllers.yearlyPaymentReports);
router.get(
  "/filter-student-gender",
  ReportControllers.filterStudentGenderFromDB
);

export const ReportRouter = router;
